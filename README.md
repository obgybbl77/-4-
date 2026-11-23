## 1. 프로젝트 소개

본 프로젝트는 **KT AIVLE School 2반 7조의 4차 미니프로젝트**로,
도서 정보를 관리하고 OpenAI API를 활용해 도서의 특성에 맞는
AI 표지 이미지를 생성하는 웹 서비스입니다.

사용자는 도서를 등록·조회·수정·삭제할 수 있으며,
AI가 추천하는 프롬프트를 수정하거나 직접 입력해
원하는 분위기의 책 표지를 제작할 수 있습니다.

생성된 이미지에는 도서 제목, 저자, 출판사, 한 줄 소개를
Canvas API로 합성하여 최종 표지로 저장합니다.

## 2. 주요 기능

### 2-1. 도서 관리

- 도서 목록 및 상세 정보 조회
- 도서 등록, 수정, 삭제 (CRUD)
- 제목 및 저자 검색
- 장르별 도서 필터링
- 도서 표지에 마우스를 올리면 내용 미리보기
- 필수 입력값 및 글자 수 유효성 검사

### 2-2. AI 표지 생성

- 도서 정보를 활용한 AI 표지 프롬프트 추천
- 프롬프트 직접 입력 및 수정
- AI 기반 표지 배경 이미지 생성 및 재생성
- 표지 한 줄 소개 입력 및 AI 추천
- 생성된 이미지 미리보기
- Canvas API를 이용한 이미지·텍스트 합성
- 제목 가로쓰기 및 세로쓰기 설정
- 최종 표지 이미지 저장 및 도서 정보 반영

※ 일부 기능은 통합 테스트 및 디자인 조정 중입니다.
※ AI 이미지 생성에는 API 이용 요금이 발생할 수 있습니다.

## 3. 기술 스택

| 구분 | 기술 |
| --- | --- |
| Frontend | React 19, Vite |
| UI | Material UI (MUI), CSS |
| 도서 데이터 서버 | json-server 0.17.4 |
| AI API 서버 | Node.js, Express |
| AI | OpenAI API |
| 이미지 처리 | HTML Canvas API |
| API 통신 | Fetch API |
| 협업 및 버전 관리 | Git, GitHub |


## 4. 프로젝트 실행 방법

Node.js와 Git이 설치된 환경에서 실행합니다.

### 4-1. 저장소 가져오기 및 패키지 설치

```bash
git clone https://github.com/obgybbl77/-4-.git
cd ./-4-
npm install
```

이미 Clone한 경우 기존 프로젝트 폴더에서 진행합니다.

### 4-2. API 서버 실행 (터미널 1)

```bash
npx json-server@0.17.4 --watch db.json
```

### 4-3. React 개발 서버 실행 (터미널 2)

```bash
npm run dev
```

두 서버는 동시에 실행 상태를 유지합니다.

- Frontend: http://localhost:5173/
- API Server: http://localhost:3000/books

### 4-4. Windows PowerShell 실행 오류 발생 시

```powershell
npm.cmd install
npx.cmd json-server@0.17.4 --watch db.json
npm.cmd run dev
```

## 5. 프로젝트 구조 (초기 구성 기준)

```text
프로젝트/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── db.json
├── package.json
├── vite.config.js
└── README.md
```

세부 컴포넌트 및 파일 구조는 팀 코드 통합 후 업데이트합니다.

## 6. 팀 구성 및 역할

| 이름 | 담당 업무 | 팀 내 역할 |
| --- | --- | --- |
| 정수아 | OpenAI 연동 | 조장 |
| 손요한 | PM 및 기획 | 검토 담당자 |
| 김태규 | CRUD 연동 | 서기 |
| 이진석 | 스타일링 및 QA | PPT 제작자 |
| 손희주 | UI 및 레이아웃 | PPT 제작자 |
| 김다연 | 발표 및 문서 | 발표자 |

## 7. Git 협업 방식

- `main`: 팀 공용 브랜치
- `feat/기능명`: 담당 기능별 개발 브랜치
- 각자 담당 브랜치에서 기능을 구현하고 Push합니다.
- 검토 및 병합 절차는 팀 협의에 따라 진행합니다.

브랜치 생성 예시:

```bash
git checkout -b feat/book-crud
```

※ OpenAI API 키는 GitHub에 커밋하지 않습니다.

## 8. 개발 진행 현황

### 구현 완료

- [x] 프로젝트 초기 기획 및 설계
- [x] GitHub 저장소 및 협업 환경 구성
- [x] React 및 Vite 프로젝트 구성
- [x] json-server 및 도서 데이터 구성
- [x] 도서 CRUD API 연동 코드 구현
- [x] 제목·저자 검색 및 장르 필터링 구현
- [x] 도서 입력값 유효성 검사 구현
- [x] 도서 즐겨찾기 기능 구현
- [x] 도서 카드 뒤집기 UI 구현
- [x] OpenAI API 연동 코드 구현
- [x] AI 표지 이미지 생성·재생성 기능 구현
- [x] Canvas 기반 최종 표지 합성 및 저장 코드 구현
- [x] MUI 기반 UI 개선

### 통합 테스트 및 마무리

- [ ] CRUD 전체 통합 테스트
- [ ] AI 표지 생성·저장·재조회 검증
- [ ] 긴 제목 및 가로·세로쓰기 디자인 검토
- [ ] 전체 UI/UX 최종 검토
- [ ] README 및 발표 자료 최종 정리
- [ ] 최종 시연 및 제출 확인


## 9. 추후 업데이트 항목

- 실제 구현 완료 기능 및 개발 진행 현황
- 최종 프로젝트 폴더 및 컴포넌트 구조
- 데이터 모델 및 API 명세 문서
- 주요 화면 스크린샷 및 기능 시연 방법
- AI 표지 생성 사용 방법 및 주의사항
