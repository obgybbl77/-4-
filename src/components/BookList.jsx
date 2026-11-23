
import { Box, TextField, MenuItem, Typography, Button } from '@mui/material';
import BookCard from './BookCard';
import { useState } from 'react';                   
import { GENRES } from './BookForm';               

function BookList({ books, onSelect }) {
  const [keyword, setKeyword] = useState('');       
  const [genre, setGenre] = useState('');        //'' = 전체 장르

  if (books.length === 0) {
    return<Typography color="text.secondary">등록된 도서가 없어요.</Typography>;
  } 

  const search = keyword.trim().toLowerCase();    
  const filteredBooks = books.filter((book) => {
    const matchKeyword =
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search);
  const matchGenre = genre === '' || book.genre === genre;
  return matchKeyword && matchGenre;
});

  const resetFilter = () => {
    setKeyword('');
    setGenre('');
};

return(
  <section>
    <Box sx={{display: 'flex', gap: 1, mb:2}}>
      <TextField
        size="small"
        placeholder="🔍 제목, 저자 검색"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        sx={{ flex: 1, bgcolor: 'white' }}
      />
      <TextField
        select
        size="small"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        slotProps={{ select: { displayEmpty: true } }}
        sx={{ width: 140, bgcolor: 'white' }}
      >
        <MenuItem value="">전체 장르</MenuItem>
        {GENRES.map((g) => (
          <MenuItem key={g} value={g}>{g}</MenuItem>
        ))}
      </TextField>
    </Box>

      {filteredBooks.length === 0 ? (
        <Box sx={{ py: 5, textAlign: 'center' }}>
          <Typography color="text.secondary">조건에 맞는 도서가 없어요.</Typography>
          <Button variant="outlined" onClick={resetFilter} sx={{ mt: 1.5 }}>
            검색 초기화
          </Button>
        </Box>
      ) : (
        <ul className="book-list">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </section>
  );
}

export default BookList;
