import BookCard from './BookCard';
import { useState } from 'react';                   
import { GENRES } from './BookForm';               

function BookList({ books, onSelect, onCreate, onToggleLike }) {     
  const [keyword, setKeyword] = useState('');       
  const [genre, setGenre] = useState('');        //'' = 전체 장르
  const [onlyLiked, setOnlyLiked] = useState(false);


    if (books.length === 0) {
    return (
      <div className="status-box">
        <p className="status-title">📚 아직 등록된 도서가 없어요</p>
        <p>첫 번째 책을 등록하고 AI 표지를 만들어 보세요.</p>
        {onCreate && (
          <button className="status-button" onClick={onCreate}>+ 도서 등록</button>
        )}
      </div>
    );
  }


  const search = keyword.trim().toLowerCase();    
  const filteredBooks = books.filter((book) => {
    const matchKeyword =
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search);
  const matchGenre = genre === '' || book.genre === genre;
  const matchLiked = !onlyLiked || book.liked;
  return matchKeyword && matchGenre && matchLiked;
});
 
  const resetFilter = () => {
    setKeyword('');
    setGenre('');
    setOnlyLiked(false);
};
 
 
    return (
      <section>
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 제목, 저자 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <select className="search-select" value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">전체 장르</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <button
            type="button"
            className={onlyLiked ? 'like-filter active' : 'like-filter'}
            onClick={() => setOnlyLiked(!onlyLiked)}
          >
            ♥ 즐겨찾기만
          </button>
        </div>
 
        {filteredBooks.length === 0 ? (
          <div className="empty-result">
            <p>조건에 맞는 도서가 없어요.</p>
            <button onClick={resetFilter}>검색 초기화</button>
          </div>
        ) : (
          <ul className="book-list">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onSelect={onSelect} onToggleLike={onToggleLike} />
            ))}
          </ul>
        )}
      </section>
    );
 
}
 
export default BookList;
 