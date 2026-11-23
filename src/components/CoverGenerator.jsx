import { Chip, Paper, Box, Typography, TextField, Button, Alert, CircularProgress, Divider} from "@mui/material";
import { useEffect, useState } from "react";

const AI_URL = "http://localhost:3001/api";

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
  const [preview, setPreview] = useState("");
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  // 저장된 프롬프트가 비어 있을 때만 추천
  useEffect(() => {
    if (book.coverPrompt?.trim()) {
      setPrompt(book.coverPrompt);
      setRecommendLoading(false);
      return;
    }

    let active = true;

    async function recommend() {
      setRecommendLoading(true);
      setError("");

      try {
        const data = await postAI("recommend-prompt", {
          title: book.title,
          author: book.author,
          publisher: book.publisher,
          genre: book.genre,
          content: book.content,
        });

        if (active) {
          setPrompt(data.prompt || "");
        }
      } catch (err) {
        if (active) {
          setError(err.message);
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
  }, [book]);

  // 이미지 생성 · 재생성
  const generate = async () => {
    if (!prompt.trim() || imageLoading) return;

    setImageLoading(true);
    setError("");
    setPreview("");

    try {
      const data = await postAI("generate-cover", { prompt });
      setPreview(data.imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setImageLoading(false);
    }
  };

  // 최종 프롬프트 + 이미지 함께 저장
  const save = async () => {
    if (!preview || saving) return;

    setSaving(true);
    setError("");

    try {
      await onSave(book.id, {
        coverPrompt: prompt,
        coverImageUrl: preview,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err.message);
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
        }}
        disabled={busy}
        placeholder="표지에 원하는 분위기를 입력하세요."
      />

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, mb: 2 }}>
        생성 버튼을 누르면 API 이용 요금이 발생합니다.
      </Typography>

      <Button
        variant="contained"
        onClick={generate}
        disabled={busy || !prompt.trim()}
        startIcon={imageLoading ? <CircularProgress size={16} color="inherit" /> : null}
        sx={{ bgcolor: '#9760a8' }}
      >
        {imageLoading ? "표지 생성 중..." : "AI 표지 생성 / 재생성"}
      </Button>

       {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {preview && (
        <div style={{ marginTop: "24px" }}>
          <h3>생성 결과 미리보기</h3>

          <img
            src={preview}
            alt={`${book.title} AI 생성 표지`}
            style={{ width: "260px", maxWidth: "100%" }}
          />

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
