import { useState } from 'react';

export const GENRES = ['소설', '에세이', '시', '인문', '과학', '기술/IT', '경제/경영' ,'자기개발'];

//글자수 제한
const MAX = {
  title: 50,
  author: 30,
  publisher: 30,
  content: 500,
  coverPrompt: 300,
};

function BookForm({ initialBook, onSave, onCancel }) {

  const [title, setTitle] = useState(initialBook?.title || '');
  const [author, setAuthor] = useState(initialBook?.author || '');
  const [publisher, setPublisher] = useState(initialBook?.publisher || '');
  const [genre, setGenre] = useState(initialBook?.genre || '');
  const [content, setContent] = useState(initialBook?.content || '');
  const [coverPrompt, setCoverPrompt] = useState(initialBook?.coverPrompt || '');
  const [errors, setErrors] = useState({});  


  const validate = () => {
  const newErrors = {};

  if (!title.trim()) newErrors.title = '제목을 입력해 주세요.';
  else if (title.trim().length > MAX.title) newErrors.title = `제목은 ${MAX.title}자 이내로 입력해 주세요.`;

  if (!author.trim()) newErrors.author = '저자를 입력해 주세요.';
  else if (author.trim().length > MAX.author) newErrors.author = `저자는 ${MAX.author}자 이내로 입력해 주세요.`;

  if (!publisher.trim()) newErrors.publisher = '출판사를 입력해 주세요.';
  else if (publisher.trim().length > MAX.publisher) newErrors.publisher = `출판사는 ${MAX.publisher}자 이내로 입력해 주세요.`;

  if (!genre) newErrors.genre = '장르를 선택해 주세요.';

  if (content.trim().length > MAX.content) newErrors.content = `도서 내용은 ${MAX.content}자 이내로 입력해 주세요.`;
  if (coverPrompt.trim().length > MAX.coverPrompt) newErrors.coverPrompt = `표지 생성 문구는 ${MAX.coverPrompt}자 이내로 입력해 주세요.`;

  return newErrors;
};

const clearError = (name) => {
  if (errors[name]) setErrors({ ...errors, [name]: '' });
};

const handleSubmit = () => {
  const newErrors = validate();
  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  onSave({
    title: title.trim(),
    author: author.trim(),
    publisher: publisher.trim(),
    genre,
    content: content.trim(),
    coverPrompt: coverPrompt.trim(),
  });
};


  return (
    <section className="book-form">
      <h2>{initialBook ? '도서 수정' : '도서 등록'}</h2>
      <input
        value={title}
        onChange={(e) => { setTitle(e.target.value); clearError('title'); }}
        placeholder="제목 *"
        className={errors.title ? 'input-error' : ''}
      />
      {errors.title && <p className="error-text">{errors.title}</p>}

      <input
        value={author}
        onChange={(e) => { setAuthor(e.target.value); clearError('author'); }}
        placeholder="저자 *"
        className={errors.author ? 'input-error' : ''}
      />
      {errors.author && <p className="error-text">{errors.author}</p>}

      <input
        value={publisher}
        onChange={(e) => { setPublisher(e.target.value); clearError('publisher'); }}
        placeholder="출판사 *"
        className={errors.publisher ? 'input-error' : ''}
      />
      {errors.publisher && <p className="error-text">{errors.publisher}</p>}

      <select
        value={genre}
        onChange={(e) => { setGenre(e.target.value); clearError('genre'); }}
        className={errors.genre ? 'input-error' : ''}
      >
        <option value="">장르 선택 *</option>
        {GENRES.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>
      {errors.genre && <p className="error-text">{errors.genre}</p>}

      <textarea
        value={content}
        onChange={(e) => { setContent(e.target.value); clearError('content'); }}
        placeholder="도서 내용 또는 소개"
        maxLength={MAX.content}
        className={errors.content ? 'input-error' : ''}
      />
      <p className="char-count">{content.length} / {MAX.content}</p>
      {errors.content && <p className="error-text">{errors.content}</p>}

      <label htmlFor="coverPrompt">AI 표지 생성 문구 (선택)</label>

      <textarea
        id="coverPrompt"
        value={coverPrompt}
        onChange={(e) => { setCoverPrompt(e.target.value); clearError('coverPrompt'); }}
        placeholder="원하는 표지 분위기를 입력하세요. 비워두면 AI가 추천합니다."
        rows={4}
        maxLength={MAX.coverPrompt}
        className={errors.coverPrompt ? 'input-error' : ''}
      />
      <p className="char-count">{coverPrompt.length} / {MAX.coverPrompt}</p>
      {errors.coverPrompt && <p className="error-text">{errors.coverPrompt}</p>}

      <div className="form-buttons">
        <button onClick={handleSubmit}>저장</button>
        <button onClick={onCancel}>취소</button>
      </div>
    </section>
  );
}

export default BookForm;
