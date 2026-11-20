function BookCard({ book, onSelect }) {
  return (
    <li className="book-card" onClick={() => onSelect(book.id)}>
      <div className="book-cover">
        {book.coverImageUrl ? 'AI 표지' : book.title}
      </div>
      <h3>{book.title}</h3>
      <p>{book.author} · {book.publisher}</p>
      <span className="genre-tag">{book.genre}</span>
    </li>
  );
}

export default BookCard;