
import { useEffect, useState } from "react";
import { composeBookCover } from "../utils/composeBookCover";

const AI_URL = "http://localhost:3001/api";

// 같은 도서 정보로 발생한 중복 추천 요청을 재사용
const recommendCache = new Map();

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

  // AI 배경 이미지 생성 · 재생성
  const generate = async () => {
    if (!prompt.trim() || imageLoading || recommendLoading || saving) {
      return;
    }

    setImageLoading(true);
    setError("");
    setPreview("");

    try {
      const data = await postAI("generate-cover", {
        prompt,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        content: book.content,
      });

      setPreview(data.imageUrl);
    } catch (err) {
      setError(err.message || "이미지 생성에 실패했습니다.");
    } finally {
      setImageLoading(false);
    }
  };

  // 최종 프롬프트 + 한 줄 카피 + 완성된 표지 PNG 저장
  const save = async () => {
    if (!preview || saving) return;

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
    <section className="cover-generator">
      <button onClick={onBack} disabled={busy}>
        ← 도서 상세로
      </button>

      <h2>AI 도서 표지 생성</h2>
      <p>
        {book.title} · {book.author}
      </p>

      <h3>표지 생성 프롬프트</h3>

      {recommendLoading && (
        <p>AI 추천 문구 생성 중...</p>
      )}

      <textarea
        rows={7}
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          setPreview("");
        }}
        disabled={busy}
        placeholder="표지에 원하는 분위기를 입력하세요."
        style={{ width: "100%", padding: "12px" }}
      />

      <div className="cover-tagline-field">
        <label htmlFor="coverTagline">
          표지 한 줄 소개 (선택)
        </label>

        <input
          id="coverTagline"
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="직접 입력하거나 AI 추천 문구를 수정하세요."
          maxLength={60}
          disabled={busy}
        />
      </div>

      <p>생성 버튼을 누르면 API 이용 요금이 발생합니다.</p>

      <button
        onClick={generate}
        disabled={busy || !prompt.trim()}
      >
        {imageLoading
          ? "표지 생성 중..."
          : "AI 표지 생성 / 재생성"}
      </button>

      {error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}

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
    </section>
  );
}

export default CoverGenerator;
