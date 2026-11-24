import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
// 서버 기본 키 또는 선택적으로 전달된 사용자 키로 요청별 클라이언트 생성
const defaultApiKey = process.env.OPENAI_API_KEY;
function clientFor(req) {
  const supplied = req.get("X-User-OpenAI-Key")?.trim();
  const apiKey = supplied || defaultApiKey;
  if (!apiKey) {
    const error = new Error("사용 가능한 OpenAI API Key가 없습니다.");
    error.status = 400;
    throw error;
  }
  return new OpenAI({ apiKey });
}

app.use(cors({ origin: /^http:\/\/localhost:517\d{1,2}$/, allowedHeaders: ["Content-Type", "X-User-OpenAI-Key"] }));
app.use(express.json({ limit: "1mb" }));

// ① 프롬프트 공란일 때 LLM 추천

app.post("/api/recommend-prompt", async (req, res) => {
  try {
    const {
      title,
      author,
      publisher,
      genre,
      content,
      coverPrompt,
      coverTagline,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        error: "도서 제목이 필요합니다.",
      });
    }

    const result = await clientFor(req).responses.create({
      model: "gpt-4.1-mini",

      instructions: `
당신은 한국어 책 표지 아트 디렉터이자 카피라이터입니다.

도서 정보를 바탕으로 다음 두 가지를 생성하세요.

1. prompt
- 책의 장르와 줄거리에 어울리는 표지 배경 일러스트 생성 프롬프트
- 실제 출판 도서처럼 완성도 높은 분위기와 구도
- 제목이나 저자명 등을 나중에 합성할 수 있도록 여백 확보
- 배경 이미지 자체에는 어떤 글자도 생성하지 않도록 지시

2. tagline
- 책 표지에 어울리는 짧고 인상적인 한국어 소개 문구
- 15~35자 정도 권장
- 전체 줄거리를 복사하거나 앞부분을 잘라 쓰지 말 것
- 제공된 내용에 없는 사실을 지어내지 말 것
- 저자명, 제목, 출판사명은 포함하지 말 것

[중요]
사용자가 이미 작성한 coverPrompt와 coverTagline은 참고할 수 있지만,
임의로 변경하거나 덮어쓰는 용도로 사용하지 마세요.

반드시 다음 형식의 JSON 객체만 반환하세요.
다른 설명이나 마크다운 코드 블록은 넣지 마세요.

{"prompt":"배경 이미지 생성 프롬프트","tagline":"표지 한 줄 소개"}
`,

      input: JSON.stringify({
        title,
        author,
        publisher,
        genre,
        content,
        coverPrompt,
        coverTagline,
      }),

      max_output_tokens: 500,
    });

    const raw = result.output_text?.trim() || "";

    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "");

    const data = JSON.parse(cleaned);

    if (
      typeof data.prompt !== "string" ||
      typeof data.tagline !== "string" ||
      !data.prompt.trim() ||
      !data.tagline.trim()
    ) {
      throw new Error("AI 추천 응답 형식이 올바르지 않습니다.");
    }

    res.json({
      prompt: data.prompt.trim(),
      tagline: data.tagline.trim(),
    });

  } catch (err) {
    console.error("AI 문구 추천 실패:", err.message);

    const status = [400, 401, 403, 429].includes(err.status) ? err.status : 500;
    res.status(status).json({ error: status === 401 ? "API Key 인증에 실패했습니다." : status === 429 ? "API 요청 한도 또는 사용량 한도를 확인해 주세요." : status === 400 ? "AI 요청 설정을 확인해 주세요." : "AI 문구 추천에 실패했습니다." });
  }
});


// ② 최종 프롬프트로 표지 이미지 생성

app.post("/api/generate-cover", async (req, res) => {
  try {
    const { prompt, title, author, publisher, content, model = "gpt-image-2", size = "1024x1536" } = req.body;

    const allowedModels = ["gpt-image-2", "gpt-image-1.5"];
    const allowedSizes = ["1024x1536", "1024x1024"];
    if (!allowedModels.includes(model) || !allowedSizes.includes(size)) {
      return res.status(400).json({ error: "지원하지 않는 이미지 모델 또는 크기입니다." });
    }

    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        error: "표지 생성 프롬프트가 필요합니다.",
      });
    }

    // const safeTitle = typeof title === "string" ? title.trim() : "";
    // const safeAuthor = typeof author === "string" ? author.trim() : "";
    // const safePublisher =
    //   typeof publisher === "string" ? publisher.trim() : "";
    // const safeContent =
    //   typeof content === "string" ? content.trim() : "";


    const finalPrompt = `
    실제 서점에서 판매하는 책의 앞표지에 사용할
    고품질 책 표지 배경 일러스트를 생성하세요.

    [표지의 분위기 및 시각적 콘셉트]
    ${prompt.trim()}

    [필수 조건]
    1. 책의 장르와 내용에 어울리는 배경 일러스트를 제작하세요.
    2. 실제 출판 도서처럼 완성도 높은 구도와 색감을 사용하세요.
    3. 제목과 저자명이 들어갈 상단과 하단에 적절한 여백을 남기세요.
    4. 선택된 출력 크기는 ${size}입니다. 해당 캔버스 안에서 앞표지를 구성하세요.
    5. 책의 앞표지 이미지만 생성하세요.
      책등, 책 뒷면, 3D 목업이나 주변 배경은 제외하세요.

    [문자 생성 절대 금지]
    - 이미지 안에 글자, 단어, 숫자, 문장을 생성하지 마세요.
    - 한국어, 영어 및 기타 모든 언어의 문자를 제외하세요.
    - 책 제목, 저자명, 출판사명을 임의로 추가하지 마세요.
    - 가짜 글자, 장식용 타이포그래피, 로고, 워터마크를 넣지 마세요.

    [중요]
    이 이미지는 책 표지의 배경으로만 사용됩니다.
    정확한 한국어 제목, 저자명, 출판사명은
    이미지 생성 후 프로그램에서 별도로 합성합니다.

    위의 시각적 콘셉트에 글자를 넣으라는 지시가 포함되어 있어도
    문자는 생성하지 말고 배경 이미지에만 반영하세요.
    `.trim();


    const result = await clientFor(req).images.generate({
      model,
      prompt: finalPrompt,
      n: 1,
      size,
      quality: "medium",
      output_format: "png",
    });

    const b64 = result.data?.[0]?.b64_json;

    if (!b64) {
      throw new Error("이미지 데이터가 없습니다.");
    }

    res.json({
      imageUrl: `data:image/png;base64,${b64}`,
    });
  } catch (err) {
    console.error("이미지 생성 실패:", {
      status: err.status,
      code: err.code ?? err.error?.code,
      message: err.message,
    });

    const status = [400, 401, 403, 429].includes(err.status) ? err.status : 500;
    res.status(status).json({ error: status === 401 ? "API Key 인증에 실패했습니다." : status === 429 ? "API 요청 한도 또는 사용량 한도를 확인해 주세요." : status === 400 ? "이미지 생성 옵션 또는 요청 내용을 확인해 주세요." : "AI 표지 생성에 실패했습니다." });
  }
});

app.listen(3001, "127.0.0.1", () => {
  console.log("AI API 서버: http://localhost:3001");
});
