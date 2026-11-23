function BookCard({ book, onSelect }) {
  return (
    <li className="book-card" onClick={() => onSelect(book.id)}>
      <div className="book-cover">
        {book.coverImageUrl ? (
        <img
          src={book.coverImageUrl}
          alt={`${book.title} 표지`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span>표지 없음</span>
      )}
      </div>
      <h3>{book.title}</h3>
      <p>{book.author} · {book.publisher}</p>
      <span className="genre-tag">{book.genre}</span>
    </li>
  );
}

export default BookCard;