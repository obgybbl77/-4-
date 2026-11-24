import { Chip, Paper, Box, Typography, TextField, Button, Alert, CircularProgress, Divider} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { composeBookCover } from "../utils/composeBookCover";

const AI_URL = "http://localhost:3001/api";

// 같은 도서 정보로 발생한 중복 추천 요청을 재사용
const recommendCache = new Map();

// 동일 입력의 AI 배경 이미지 재사용 (브라우저 메모리에 최대 3개)
const imageCache = new Map();
const pendingImages = new Map();
const IMAGE_CACHE_LIMIT = 3;

function getImageRequest(book, prompt) {
  return {
    prompt: prompt.trim(),
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    content: book.content,
  };
}

async function postAI(path, payload) {
  const res = await fetch(`${AI_URL}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "AI 요청 실패");
  }

  return data;
}

function CoverGenerator({ book, onSave, onBack }) {
  const [prompt, setPrompt] = useState(book.coverPrompt || "");
  const [tagline, setTagline] = useState(book.coverTagline || "");
  const [preview, setPreview] = useState("");
  const [previewKey, setPreviewKey] = useState("");
  const imageRequestInProgress = useRef(false);

  const [recommendLoading, setRecommendLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 프롬프트와 한 줄 카피 중 비어 있는 항목만 AI 추천
  useEffect(() => {
    const savedPrompt = book.coverPrompt?.trim() || "";
    const savedTagline = book.coverTagline?.trim() || "";

    setPrompt(savedPrompt);
    setTagline(savedTagline);

    // 두 항목이 모두 입력되어 있다면 AI 호출 생략
    if (savedPrompt && savedTagline) {
      setRecommendLoading(false);
      return;
    }

    let active = true;

    const payload = {
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      genre: book.genre,
      content: book.content,
      coverPrompt: savedPrompt,
      coverTagline: savedTagline,
    };

    const cacheKey = JSON.stringify(payload);

    async function recommend() {
      setRecommendLoading(true);
      setError("");

      try {
        let request = recommendCache.get(cacheKey);

        if (!request) {
          request = postAI("recommend-prompt", payload);
          recommendCache.set(cacheKey, request);

          // 실패한 요청은 캐시에서 제거
          request.catch(() => {
            if (recommendCache.get(cacheKey) === request) {
              recommendCache.delete(cacheKey);
            }
          });
        }

        const data = await request;

        if (!active) return;

        // 사용자가 이미 작성한 값은 덮어쓰지 않음
        if (!savedPrompt) {
          setPrompt((current) => current || data.prompt || "");
        }

        if (!savedTagline) {
          setTagline((current) => current || data.tagline || "");
        }
      } catch (err) {
        if (active) {
          setError(err.message || "AI 추천에 실패했습니다.");
        }
      } finally {
        if (active) {
          setRecommendLoading(false);
        }
      }
    }

    recommend();

    return () => {
      active = false;
    };
  }, [
    book.id,
    book.title,
    book.author,
    book.publisher,
    book.genre,
    book.content,
    book.coverPrompt,
    book.coverTagline,
  ]);

  // 같은 프롬프트/도서 조건에서만 같은 AI 배경을 재사용한다.
  const currentImageKey = JSON.stringify(getImageRequest(book, prompt));
  const hasCachedImage = imageCache.has(currentImageKey);

  // 무료: 기존 캐시 조회만 수행. 캐시가 없어도 이미지 생성 API를 호출하지 않는다.
  function reuseImage() {
    if (imageRequestInProgress.current || recommendLoading || saving) return;

    const cached = imageCache.get(currentImageKey);
    if (!cached) {
      setError("재사용할 배경 이미지가 없습니다. 최초 1회는 새 이미지 생성이 필요합니다.");
      return;
    }

    setError("");
    setPreview(cached);
    setPreviewKey(currentImageKey);
  }

  // 유료: 사용자가 명시적으로 요청할 때만 새 배경을 생성한다.
  async function generateNewImage() {
    if (!prompt.trim() || imageRequestInProgress.current || recommendLoading || saving) {
      return;
    }

    imageRequestInProgress.current = true;
    setImageLoading(true);
    setError("");

    const payload = getImageRequest(book, prompt);
    const requestKey = JSON.stringify(payload);
    let request;

    try {
      // 같은 요청이 진행 중이라면 Promise만 공유한다.
      request = pendingImages.get(requestKey);
      if (!request) {
        request = postAI("generate-cover", payload);
        pendingImages.set(requestKey, request);
      }

      const data = await request;
      if (!data?.imageUrl) {
        throw new Error("생성된 이미지가 없습니다.");
      }

      imageCache.delete(requestKey);
      imageCache.set(requestKey, data.imageUrl);
      while (imageCache.size > IMAGE_CACHE_LIMIT) {
        imageCache.delete(imageCache.keys().next().value);
      }

      setPreview(data.imageUrl);
      setPreviewKey(requestKey);
    } catch (err) {
      setError(err.message || "이미지 생성에 실패했습니다.");
    } finally {
      if (pendingImages.get(requestKey) === request) {
        pendingImages.delete(requestKey);
      }
      imageRequestInProgress.current = false;
      setImageLoading(false);
    }
  }

  // 최종 프롬프트 + 한 줄 카피 + 완성된 표지 PNG 저장
  const save = async () => {
    if (!preview || saving || imageLoading) return;

    if (previewKey !== currentImageKey) {
      setError("프롬프트 또는 도서 정보가 변경되었습니다. 해당 조건의 이미지를 다시 선택하거나 생성해 주세요.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // 현재 입력된 한 줄 카피를 포함해서 이미지 합성
      const finalImageUrl = await composeBookCover(preview, {
        ...book,
        coverTagline: tagline.trim(),
      });

      await onSave(book.id, {
        coverPrompt: prompt.trim(),
        coverTagline: tagline.trim(),
        coverImageUrl: finalImageUrl,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err.message || "표지 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const busy = recommendLoading || imageLoading || saving;

  return (
    <Paper sx={{ p: 3 }}>
      <Button onClick={onBack} disabled={busy}>
        ← 도서 상세로
      </Button>

      <Box sx={{ borderLeft: '4px solid #9760a8', pl: 2, mt: 2, mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1B3A5C' }}>
          ✨ AI 도서 표지 생성
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Chip label={book.title} size="small" sx={{ bgcolor: '#f3edf7', color: '#9760a8', fontWeight: 'bold' }} />
          <Typography variant="body2" color="text.secondary">{book.author}</Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
        표지 생성 프롬프트
      </Typography>

      {recommendLoading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">AI 추천 문구 생성 중...</Typography>
        </Box>
      )}

      <TextField
        multiline
        rows={7}
        fullWidth
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          setPreview("");
          setPreviewKey("");
        }}
        disabled={busy}
        placeholder="표지에 원하는 분위기를 입력하세요."
      />

      <TextField
        label="표지 한 줄 소개 (선택)"
        fullWidth
        value={tagline}
        onChange={(e) => setTagline(e.target.value)}
        placeholder="직접 입력하거나 AI 추천 문구를 수정하세요."
        disabled={busy}
        helperText={`${tagline.length} / 60`}
        slotProps={{ htmlInput: { maxLength: 60 } }}
        sx={{ mt: 2 }}
      />

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, mb: 2 }}>
        기존 배경 재사용은 OpenAI 호출이 없습니다. 새 이미지 생성 시에만 API 이용 요금이 발생합니다.
        {hasCachedImage ? " (현재 입력 조건의 캐시 있음)" : " (현재 입력 조건의 캐시 없음)"}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          onClick={reuseImage}
          disabled={busy || !prompt.trim() || !hasCachedImage}
        >
          기존 이미지 재사용 (무료)
        </Button>

        <Button
          variant="contained"
          onClick={generateNewImage}
          disabled={busy || !prompt.trim()}
          startIcon={imageLoading ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{ bgcolor: '#9760a8' }}
        >
          {imageLoading ? "표지 생성 중..." : "새 AI 이미지 생성 (API 호출)"}
        </Button>
      </Box>

       {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {preview && (
        <div style={{ marginTop: "24px" }}>
          <h3>생성 결과 미리보기</h3>

          <img
            src={preview}
            alt={`${book.title} AI 생성 배경`}
            style={{ width: "260px", maxWidth: "100%" }}
          />

          <p>
            저장 시 제목·저자·출판사·한 줄 소개가
            이미지에 합성됩니다.
          </p>

          <div style={{ marginTop: "16px" }}>
            <button onClick={save} disabled={busy}>
              {saving ? "저장 중..." : "이 표지 저장"}
            </button>
          </div>
        </div>
      )}
    </Paper>
  );
}

export default CoverGenerator;
