
/**
 * AI 책 표지 디자인 설정
 * 기준 크기: 1024 × 1536px
 *
 * 디자인 담당자는 이 파일만 수정하면 됩니다.
 *
 * direction:
 *   "horizontal" = 가로쓰기
 *   "vertical"   = 세로쓰기
 *
 * x: 가로 위치 (0 = 왼쪽, 0.5 = 중앙, 1 = 오른쪽)
 * y: 위쪽에서부터의 위치 (px)
 */

export const COVER_STYLE = {
  width: 1024,
  height: 1536,

  layout: {
    horizontalPadding: 90,
    fontFamily: '"Malgun Gothic", sans-serif',
  },

  // 배경 이미지 명암 조절
  overlay: {
    enabled: true,
    topOpacity: 0.35,
    bottomOpacity: 0.75,
  },

  // 책 제목: 오른쪽 세로쓰기
  title: {
    direction: "vertical",
    fontSize: 88,
    minFontSize: 48,
    fontWeight: 700,
    color: "#FFFFFF",
    x: 0.78,
    y: 190,
    lineHeight: 1.15,
    maxLines: 3,
    align: "center",
  },

  // 한 줄 소개: 하단 중앙
  tagline: {
    direction: "horizontal",
    fontSize: 34,
    fontWeight: 400,
    color: "#FFFFFF",
    x: 0.5,
    y: 1130,
    lineHeight: 1.4,
    maxLines: 2,
    align: "center",
  },

  // 저자명: 하단 중앙
  author: {
    direction: "horizontal",
    fontSize: 46,
    fontWeight: 500,
    color: "#FFFFFF",
    x: 0.5,
    y: 1320,
    lineHeight: 1.2,
    maxLines: 1,
    align: "center",
  },

  // 출판사: 가장 아래 중앙
  publisher: {
    direction: "horizontal",
    fontSize: 30,
    fontWeight: 400,
    color: "#FFFFFF",
    x: 0.5,
    y: 1440,
    lineHeight: 1.2,
    maxLines: 1,
    align: "center",
  },
};

