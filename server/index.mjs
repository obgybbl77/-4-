
import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors({ origin: /^http:\/\/localhost:517\d{1,2}$/, }));
app.use(express.json({ limit: "1mb" }));

// ① 프롬프트 공란일 때 LLM 추천
app.post("/api/recommend-prompt", async (req, res) => {
  try {
    const { title, author, publisher, genre, content } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ error: "도서 제목이 필요합니다." });
    }

    const result = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions: `
당신은 전문 도서 표지 아트 디렉터입니다.
도서 정보에 어울리는 이미지 생성용 프롬프트 하나를
한국어로 작성하세요.
색감, 구도, 분위기, 스타일을 구체적으로 설명하세요.
완성된 프롬프트만 출력하세요.
      `,
      input: JSON.stringify({
        title,
        author,
        publisher,
        genre,
        content,
      }),
      max_output_tokens: 350,
    });

    const prompt = result.output_text?.trim();

    if (!prompt) {
      throw new Error("추천 프롬프트가 비어 있습니다.");
    }

    res.json({ prompt });
} catch (err) {
  console.error("이미지 생성 실패:", err.status ?? err.message);
  res.status(500).json({ error: "AI 표지 생성 실패" });
}
});

// ② 최종 프롬프트로 표지 이미지 생성
app.post("/api/generate-cover", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({ error: "프롬프트가 필요합니다." });
    }

    const result = await client.images.generate({
      model: "gpt-image-2",
      prompt,
      n: 1,
      size: "1024x1536",
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
    console.error("이미지 생성 실패:", err.status ?? err.message);
    res.status(500).json({ error: "AI 표지 생성 실패" });
  }
});

app.listen(3001, "127.0.0.1", () => {
  console.log("AI API 서버: http://localhost:3001");
});
