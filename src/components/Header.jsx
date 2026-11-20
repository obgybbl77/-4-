function Header({ onCreate }) {
  return (
    <header className="header">
      <h1>📚 도서 관리 시스템</h1>
      <button onClick={onCreate}>+ 도서 등록</button>
    </header>
  );
}

export default Header;