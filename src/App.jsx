import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import BookForm from './components/BookForm';
import CoverGenerator from './components/CoverGenerator';

const BOOKS_URL = 'http://localhost:3000/books';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState('list');          
  const [selectedId, setSelectedId] = useState(null); 

  
  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch(BOOKS_URL);
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error(err);
        setError('도서를 불러오지 못했어요.');
      }
      setLoading(false);
    }
    loadBooks();
  }, []);

  // 화면 이동 함수
  const goList = () => { setPage('list'); setSelectedId(null); };
  const goDetail = (id) => { setSelectedId(id); setPage('detail'); };
  const goCreate = () => setPage('create');
  const goEdit = () => setPage('edit');
  const goGenerateCover = () => setPage('generate');

  // 도서 등록 (POST)
  const handleAddBook = async (formData) => {
    try {
      const now = new Date().toISOString();
      const newBook = {
        ...formData,
        coverImageUrl: '',
        createdAt: now,
        updatedAt: now,
      };
      const res = await fetch(BOOKS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook),
      });
      if (!res.ok) throw new Error('등록 실패');
      const saved = await res.json();
      setBooks([...books, saved]);
      goList();
    } catch (err) {
      console.error(err);
      alert('도서 등록에 실패했어요.');
    }
  };

  // 도서 수정 (PATCH)
  const handleUpdateBook = async (id, formData) => {
    try {
      const res = await fetch(`${BOOKS_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, updatedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error('수정 실패');
      const updated = await res.json();
      setBooks(books.map((b) => (b.id === id ? updated : b)));
      goDetail(id);
    } catch (err) {
      console.error(err);
      alert('도서 수정에 실패했어요.');
    }
  };

  // 도서 삭제 (DELETE)
  const handleDeleteBook = async (id) => {
    if (!confirm('정말 삭제할까요?')) return;
    try {
      const res = await fetch(`${BOOKS_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('삭제 실패');
      setBooks(books.filter((b) => b.id !== id));
      goList();
    } catch (err) {
      console.error(err);
      alert('도서 삭제에 실패했어요.');
    }
  };

  const handleSaveCover = async (id, coverData) => {
  const res = await fetch(`${BOOKS_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(coverData),
  });

  if (!res.ok) {
    throw new Error('표지 저장에 실패했어요.');
  }

  const updatedBook = await res.json();

  setBooks((prev) =>
    prev.map((book) =>
      String(book.id) === String(id) ? updatedBook : book
    )
  );

  goDetail(id);
};

  const selectedBook = books.find((b) => b.id === selectedId);

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>에러: {error}</p>;

  return (
    <>
      <Header onCreate={goCreate} />

      <main>
        {page === 'list' && (
          <BookList books={books} onSelect={goDetail} />
        )}

        {page === 'detail' && selectedBook && (
          <BookDetail
            book={selectedBook}
            onBack={goList}
            onEdit={goEdit}
            onDelete={() => handleDeleteBook(selectedBook.id)}
            onGenerate={goGenerateCover}
          />
        )}

        {page === 'create' && (
          <BookForm
            onSave={handleAddBook}
            onCancel={goList}
          />
        )}

        {page === 'edit' && selectedBook && (
          <BookForm
            initialBook={selectedBook}
            onSave={(data) => handleUpdateBook(selectedBook.id, data)}
            onCancel={() => goDetail(selectedBook.id)}
          />
        )}

        {page === 'generate' && selectedBook && (
          <CoverGenerator
          key={selectedBook.id}
          book={selectedBook}
          onBack={() => goDetail(selectedBook.id)}
          onSave={handleSaveCover}
          />
        )}
      </main>
    </>
  );
}

export default App;
