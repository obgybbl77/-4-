import { useState } from 'react';

const GENRES = ['소설', '에세이', '시', '인문', '과학', '기술/IT', '경제/경영' ,'자기개발'];

function BookForm({ initialBook, onSave, onCancel }) {

  const [title, setTitle] = useState(initialBook?.title || '');
  const [author, setAuthor] = useState(initialBook?.author || '');
  const [publisher, setPublisher] = useState(initialBook?.publisher || '');
  const [genre, setGenre] = useState(initialBook?.genre || '');
  const [content, setContent] = useState(initialBook?.content || '');

  const handleSubmit = () => {
    
    if (!title.trim() || !author.trim() || !publisher.trim() || !genre) {
      alert('제목, 저자, 출판사, 장르는 꼭 입력해 주세요.');
      return;
    }
    onSave({ title, author, publisher, genre, content });
  };

  return (
    <section className="book-form">
      <h2>{initialBook ? '도서 수정' : '도서 등록'}</h2>

      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목 *" />
      <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="저자 *" />
      <input value={publisher} onChange={(e) => setPublisher(e.target.value)} placeholder="출판사 *" />

      <select value={genre} onChange={(e) => setGenre(e.target.value)}>
        <option value="">장르 선택 *</option>
        {GENRES.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="표지 생성 문구 (선택, 500자까지)"
        maxLength={500}
      />

      <div className="form-buttons">
        <button onClick={handleSubmit}>저장</button>
        <button onClick={onCancel}>취소</button>
      </div>
    </section>
  );
}

export default BookForm;
