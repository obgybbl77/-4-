
export async function composeBookCover(imageUrl, book) {
  const img = new Image();
  img.src = imageUrl;
  await img.decode();

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1536;

  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;

  // 이미지가 캔버스를 가득 채우도록 배치
  const scale = Math.max(w / img.width, h / img.height);
  const sw = w / scale;
  const sh = h / scale;

  ctx.drawImage(
    img,
    (img.width - sw) / 2,
    (img.height - sh) / 2,
    sw,
    sh,
    0,
    0,
    w,
    h
  );

  // 글자가 잘 보이도록 상단·하단에 그라데이션
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, "rgba(0,0,0,0.65)");
  gradient.addColorStop(0.3, "rgba(0,0,0,0)");
  gradient.addColorStop(0.65, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,0.8)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  // 제목: 긴 제목은 여러 줄로 나누기
  const title = String(book.title || "").trim();
  const titleFontSize = 90;

  ctx.font = `bold ${titleFontSize}px sans-serif`;

  const maxWidth = w - 140;
  const lines = [];
  let line = "";

  for (const char of title) {
    const next = line + char;

    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line.trim());
      line = char;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line.trim());

  lines.forEach((text, i) => {
    ctx.fillText(text, w / 2, 135 + i * 110);
  });


  // 짧은 표지 소개 문구
  // coverTagline이 있으면 우선 사용하고,
  // 없으면 content에서 최대 45자까지 가져오기
const tagline = String(book.coverTagline || "").trim();

const shortTagline = tagline;

  if (shortTagline) {
    ctx.font = "34px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";

    const maxTaglineWidth = w - 160;
    const words = shortTagline.split(/\s+/);
    const taglineLines = [];
    let currentLine = "";

    for (const word of words) {
      const nextLine = currentLine
        ? `${currentLine} ${word}`
        : word;

      if (
        ctx.measureText(nextLine).width > maxTaglineWidth &&
        currentLine
      ) {
        taglineLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = nextLine;
      }
    }

    if (currentLine) taglineLines.push(currentLine);

    // 저자명 위쪽에 최대 두 줄 표시
    taglineLines.slice(0, 2).forEach((line, index) => {
      ctx.fillText(
        line,
        w / 2,
        h - 440 + index * 48
      );
    });
  }


  // 저자명
  ctx.font = "48px sans-serif";
  ctx.fillText(String(book.author || ""), w / 2, h - 260);

  // 출판사명
  ctx.font = "36px sans-serif";
  ctx.fillText(String(book.publisher || ""), w / 2, h - 130);

  // 텍스트가 실제로 포함된 PNG 반환
  return canvas.toDataURL("image/png");
}
