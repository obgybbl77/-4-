import BookCard from './BookCard';

function BookList({ books, onSelect }) {
  if (books.length === 0) {
    return <p>등록된 도서가 없어요.</p>;
  }

  return (
    <ul className="book-list">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onSelect={onSelect} />
      ))}
    </ul>
  );
}

export default BookList;
