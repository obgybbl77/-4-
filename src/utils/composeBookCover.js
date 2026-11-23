import { COVER_STYLE } from "./coverStyle";

// 글자 너비에 맞춰 여러 줄로 나누기
function wrapText(ctx, text, maxWidth) {
  const lines = [];
  let line = "";

  for (const char of Array.from(String(text))) {
    const next = line + char;

    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line.trim());
      line = char.trimStart();
    } else {
      line = next;
    }
  }

  if (line.trim()) {
    lines.push(line.trim());
  }

  return lines;
}

// 텍스트를 Canvas에 그리기 (가로쓰기)
function drawText(ctx, text, style, canvas) {
  if (!text?.trim()) return;

  const { horizontalPadding, fontFamily } = COVER_STYLE.layout;
  const maxWidth = canvas.width - horizontalPadding * 2;

  let fontSize = style.fontSize;
  let lines = [];

  do {
    ctx.font = `${style.fontWeight} ${fontSize}px ${fontFamily}`;
    lines = wrapText(ctx, text, maxWidth);

    if (lines.length <= style.maxLines) break;

    fontSize -= 2;
  } while (fontSize >= (style.minFontSize || style.fontSize));

  ctx.font = `${style.fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = style.color;
  ctx.textAlign = style.align;
  ctx.textBaseline = "top";

  const x = canvas.width * style.x;
  const lineHeight = fontSize * style.lineHeight;

  const visibleLines = lines.slice(0, style.maxLines);

  if (lines.length > style.maxLines) {
    let last = visibleLines[style.maxLines - 1] || "";

    while (
      last &&
      ctx.measureText(last + "…").width > maxWidth
    ) {
      last = last.slice(0, -1);
    }

    visibleLines[style.maxLines - 1] = last + "…";
  }

  visibleLines.forEach((line, index) => {
    ctx.fillText(
      line,
      x,
      style.y + index * lineHeight,
      maxWidth
    );
  });
}

// 세로 텍스트 쓰기 전용 함수
function drawVerticalText(ctx, text, style, canvas) {
  if (!text?.trim()) return;

  const fontFamily = COVER_STYLE.layout.fontFamily;

  ctx.font = `${style.fontWeight} ${style.fontSize}px ${fontFamily}`;
  ctx.fillStyle = style.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const x = canvas.width * style.x;
  const y = style.y;
  const letterSpacing = style.fontSize * style.lineHeight;

  Array.from(text).forEach((char, index) => {
    ctx.fillText(
      char,
      x,
      y + index * letterSpacing
    );
  });
}

// AI 배경 + 정확한 도서 정보 합성
export async function composeBookCover(imageUrl, book) {
  const style = COVER_STYLE;

  const img = new Image();
  img.src = imageUrl;
  await img.decode();

  const canvas = document.createElement("canvas");
  canvas.width = style.width;
  canvas.height = style.height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas를 초기화할 수 없습니다.");
  }

  const w = canvas.width;
  const h = canvas.height;

  // 배경 이미지를 표지 비율에 맞춰 채우기
  const scale = Math.max(w / img.width, h / img.height);
  const sourceWidth = w / scale;
  const sourceHeight = h / scale;

  ctx.drawImage(
    img,
    (img.width - sourceWidth) / 2,
    (img.height - sourceHeight) / 2,
    sourceWidth,
    sourceHeight,
    0,
    0,
    w,
    h
  );

  // 글자 가독성을 위한 그라데이션
  if (style.overlay.enabled) {
    const gradient = ctx.createLinearGradient(0, 0, 0, h);

    gradient.addColorStop(
      0,
      `rgba(0,0,0,${style.overlay.topOpacity})`
    );
    gradient.addColorStop(0.3, "rgba(0,0,0,0)");
    gradient.addColorStop(0.65, "rgba(0,0,0,0)");
    gradient.addColorStop(
      1,
      `rgba(0,0,0,${style.overlay.bottomOpacity})`
    );

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  }

  // 브라우저에서 사용할 글꼴 로딩
  const fonts = [
    style.title,
    style.tagline,
    style.author,
    style.publisher,
  ];

  await Promise.all(
    fonts.map((item) =>
      document.fonts.load(
        `${item.fontWeight} ${item.fontSize}px ${style.layout.fontFamily}`
      )
    )
  );

  // 책 제목
  if (style.title.direction === "vertical") {
    drawVerticalText(
      ctx,
      String(book.title || ""),
      style.title,
      canvas
    );
  } else {
    drawText(
      ctx,
      String(book.title || ""),
      style.title,
      canvas
    );
  }

  // 한 줄 소개
  drawText(
    ctx,
    String(book.coverTagline || ""),
    style.tagline,
    canvas
  );

  // 저자
  drawText(
    ctx,
    String(book.author || ""),
    style.author,
    canvas
  );

  // 출판사
  drawText(
    ctx,
    String(book.publisher || ""),
    style.publisher,
    canvas
  );

  return canvas.toDataURL("image/png");
}