import { Paper, Box, Typography, Button, Chip, Divider } from '@mui/material';
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

      </div>
        <div className="detail-info">
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1B3A5C', mb: 1 }}>
            {book.title}
          </Typography>
          <Chip label={book.genre} size="small" sx={{ bgcolor: '#f3edf7', color: '#9760a8', mb: 2 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: '60px 1fr', rowGap: 1 }}>
            <Typography color="text.secondary">저자</Typography>
            <Typography sx={{ fontWeight: 500 }}>{book.author}</Typography>
            <Typography color="text.secondary">출판사</Typography>
            <Typography sx={{ fontWeight: 500 }}>{book.publisher}</Typography>
            <Typography color="text.secondary">등록일</Typography>
            <Typography sx={{ fontWeight: 500 }}>{book.createdAt?.slice(0, 10)}</Typography>
            <Typography color="text.secondary">수정일</Typography>
            <Typography sx={{ fontWeight: 500 }}>{book.updatedAt?.slice(0, 10)}</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

           <Typography sx={{ bgcolor: '#f9fafb', p: 2, borderRadius: 2, lineHeight: 1.7 }}>
            {book.content}
          </Typography>
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