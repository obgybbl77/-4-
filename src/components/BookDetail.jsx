function BookDetail({ book, onBack, onEdit, onDelete, onGenerate }) {
  return (
    <section className="book-detail">
      <button onClick={onBack}>← 목록으로</button>

      <div className="detail-body">
      <div className="book-cover">
        {book.coverImageUrl ? (
          <img
            src={book.coverImageUrl}
            alt={`${book.title} 표지`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <span>{book.title}</span>
        )}

        {/* 책 표지 텍스트 오버레이 */}
        <div className="cover-text">
          <h2 className="cover-title">{book.title}</h2>
          <p className="cover-author">{book.author}</p>
          <p className="cover-publisher">{book.publisher}</p>
        </div>
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
        <button onClick={onGenerate}>✨ AI 표지 생성</button>
        <button onClick={onEdit}>수정</button>
        <button onClick={onDelete}>삭제</button>
      </div>
    </section>
  );
}

export default BookDetail;