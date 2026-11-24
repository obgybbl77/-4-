import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import BookForm from './components/BookForm';
import CoverGenerator from './components/CoverGenerator';
 
const BOOKS_URL = 'http://localhost:3000/books';
 
async function request(url, method = 'GET', body) {
  const options = {method};
  if (body) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`서버 요청에 실패했어요 ${res.status}`);
  return res.json();
}
 
function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const [page, setPage] = useState('list');          
  const [selectedId, setSelectedId] = useState(null); 
  const [selectedBook, setSelectedBook] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [listKey, setListKey] = useState(0);
 
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 2000);
  };
 
  
  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await request(BOOKS_URL);
        setBooks(data);
      } catch (err) {
        console.error(err);
        setError('도서를 불러오지 못했어요.');
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);
 
    useEffect(() => {
    if (selectedId === null) return;
    async function loadBook() {
      try {
        const data = await request(`${BOOKS_URL}/${selectedId}`);
        setSelectedBook(data);
      } catch (err) {
        console.error(err);
        alert('도서 상세 정보를 불러오지 못했어요.');
      }
    }
    loadBook();
  }, [selectedId]);
 
  // 화면 이동 함수
  const goList = () => {
    setPage('list');
    setSelectedId(null);
    setSelectedBook(null);
    setListKey(listKey + 1); // 검색어 · 장르 · 즐겨찾기 필터 초기화
  };
  const goDetail = (id) => { setSelectedId(id); setPage('detail'); };
  const goCreate = () => setPage('create');
  const goEdit = () => setPage('edit');
  const goGenerateCover = () => setPage('generate');
 
  // 도서 등록 (POST)
  const handleAddBook = async (formData) => {
    try {
      const now = new Date().toISOString();
      const newBook = { ...formData, coverImageUrl: '', createdAt: now, updatedAt: now };
      const saved = await request(BOOKS_URL, 'POST', newBook);
      setBooks([...books, saved]);
      showMessage('도서가 등록되었어요.', 'success');
      goList();
    } catch (err) {
      console.error(err);
      showMessage('도서 등록에 실패했어요.', 'error');
    }
  };
 
  // 도서 수정 (PATCH)
  const handleUpdateBook = async (id, formData) => {
    const changed = {};
    for (const key in formData) {
      if (formData[key] !== (selectedBook[key] || '')) {
        changed[key] = formData[key];
      }
    }
    if (Object.keys(changed).length === 0) {
      alert('바뀐 내용이 없어요.');
      return;
    }
    try {
      const updated = await request(`${BOOKS_URL}/${id}`, 'PATCH', {
        ...changed,
        updatedAt: new Date().toISOString(),
      });
      setBooks(books.map((b) => (b.id === id ? updated : b)));
      showMessage('도서가 수정되었어요.', 'success');
      goList();
    } catch (err) {
      console.error(err);
      showMessage('도서 수정에 실패했어요.', 'error');
    }
  };
 
  // 도서 삭제 (DELETE)
  const handleDeleteBook = async (id) => {
    if (!confirm('정말 삭제할까요?')) return;
    try {
      await request(`${BOOKS_URL}/${id}`, 'DELETE');
      setBooks(books.filter((b) => b.id !== id));
      showMessage('도서가 삭제되었어요.', 'success');
      goList();
    } catch (err) {
      console.error(err);
      showMessage('도서 삭제에 실패했어요.', 'error');
    }
  };
 
  const handleToggleLike = async (book) => {
    try {
      const updated = await request(`${BOOKS_URL}/${book.id}`, 'PATCH', { liked: !book.liked });
      setBooks(books.map((b) => (b.id === book.id ? updated : b)));
    } catch (err) {
      console.error(err);
      showMessage('즐겨찾기 변경에 실패했어요.', 'error');
    }
  };
 
  const handleSaveCover = async (id, coverData) => {
    const updatedBook = await request(`${BOOKS_URL}/${id}`, 'PATCH', coverData);
    setBooks((prev) =>
      prev.map((book) => (String(book.id) === String(id) ? updatedBook : book))
    );
    setSelectedBook(updatedBook);
    goDetail(id);
  };



// 화면 처리 순서
  const renderContent = () => {
    // 1. 로딩 중
    if (loading) {
      return (
        <div className="status-box">
          <div className="spinner"></div>
          <p>도서를 불러오는 중...</p>
        </div>
      );
    }

    // 2. 서버 에러
    if (error) {
      return (
        <div className="status-box status-error">
          <p className="status-title">⚠️ {error}</p>
          <p>json-server가 켜져 있는지 확인해 주세요.</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      );
    }

    // 3. 정상 호출 — 기존 화면
    return (
      <>
        {page === 'list' && (
          <BookList key={listKey} books={books} onSelect={goDetail} onCreate={goCreate} onToggleLike={handleToggleLike} />
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
      </>
    );
  };


  return (
    <>
      <Header onCreate={goCreate} onList={goList} />
      {message.text && (
        <p className={`message ${message.type}`}>{message.text}</p>
      )}

      <main>{renderContent()}</main>

    </>
  );
}
 
export default App;
 