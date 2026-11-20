# AI 표지 생성을 지원하는 도서관리 시스템

> KT 에이블스쿨 2반 7조 4차 미니프로젝트
>
> 현재 개발 진행 중이며, 구현 완료 후 실제 기능과 실행 화면을 반영할 예정입니다.

## 1. 프로젝트 소개

도서 정보를 등록하고 관리하며, OpenAI API를 활용하여
도서 정보에 적합한 표지 이미지를 생성할 수 있는 웹 서비스입니다.

## 2. 주요 기능

- 도서 목록 및 상세 정보 조회
- 도서 등록, 수정, 삭제
- AI 기반 도서 표지 이미지 생성
- 생성된 표지 이미지 미리보기 및 저장

## 3. 기술 스택

| 구분 | 기술 |
| --- | --- |
| Frontend | React, Vite |
| Mock API Server | json-server 0.17.4 |
| API 통신 | Fetch API |
| AI | OpenAI API |
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

- [x] 프로젝트 초기 기획 및 설계
- [x] GitHub 저장소 생성 및 초기 커밋
- [x] React 및 Vite 초기 프로젝트 구성
- [x] json-server 초기 환경 구성
- [x] 기본 UI 및 Mock 데이터 렌더링
- [ ] 도서 CRUD API 연동
- [ ] OpenAI API 연동
- [ ] 통합 테스트
- [ ] 최종 산출물 정리

## 9. 추후 업데이트 항목

- 실제 구현 완료 기능 및 개발 진행 현황
- 최종 프로젝트 폴더 및 컴포넌트 구조
- 데이터 모델 및 API 명세 문서
- 주요 화면 스크린샷 및 기능 시연 방법
- AI 표지 생성 사용 방법 및 주의사항
