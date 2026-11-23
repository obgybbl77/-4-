import { Paper, Box, Typography, Button } from '@mui/material';
function BookDetail({ book, onBack, onEdit, onDelete, onGenerate }) {
  return (
   <Paper sx={{ p: 3 }}>
      <Button onClick={onBack}>← 목록으로</Button>

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
          <Typography variant='h5' sx={{fontWeight:'bold', color:'#1B3A5C', mb: 1  }}>{book.title}</Typography>
          <Typography>저자: {book.author}</Typography>
          <Typography>출판사: {book.publisher}</Typography>
          <Typography>장르: {book.genre}</Typography>
          <Typography>{book.content}</Typography>
        </div>
      </div>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" onClick={onGenerate} sx={{ bgcolor: '#9760a8' }}>
           ✨ AI 표지 생성
        </Button>
        <Button variant="outlined" onClick={onEdit}>수정</Button>
        <Button variant="outlined" color="error" onClick={onDelete}>삭제</Button>
      </Box>
    </Paper>
  );
}

export default BookDetail;