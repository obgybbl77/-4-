function BookDetail({ book, onBack, onEdit, onDelete }) {
  return (
    <section className="book-detail">
      <button onClick={onBack}>← 목록으로</button>

      <div className="detail-body">
        <div className="book-cover">
          {book.coverImageUrl ? 'AI 표지' : book.title}
        </div>
        <div className="detail-info">
          <h2>{book.title}</h2>
          <p>저자: {book.author}</p>
          <p>출판사: {book.publisher}</p>
          <p>장르: {book.genre}</p>
          <p>{book.content}</p>
        </div>
      </div>

      <div className="detail-buttons">
        <button>✨ AI 표지 생성</button>
        <button onClick={onEdit}>수정</button>
        <button onClick={onDelete}>삭제</button>
      </div>
    </section>
  );
}

export default BookDetail;