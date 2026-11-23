import { Card, CardActionArea, CardContent, Typography, Chip, Tooltip } from '@mui/material';
 
function BookCard({ book, onSelect }) {
  return (
    <Card component='li' sx={{ listStyle: 'none' }}>
      <CardActionArea onClick={() => onSelect(book.id)}>
        {/* 표지에 마우스를 올리면 오른쪽에 책 내용이 말풍선으로 보임 */}
        <Tooltip
          title={book.content || ''}
          placement='right'
          arrow
          enterDelay={200}
          slotProps={{
            tooltip: { sx: { fontSize: 20, lineHeight: 1.6, maxWidth: 390, p: 2 } },
          }}
        >
          <div className='book-cover'>
            {book.coverImageUrl ? (
              <img
                src={book.coverImageUrl}
                alt={`${book.title} 표지`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span>표지없음</span>
            )}
            <div className='cover-text'>
              <p className='cover-title'>{book.title}</p>
              <p className='cover-author'>{book.author}</p>
              <p className='cover-publisher'>{book.publisher}</p>
            </div>
          </div>
        </Tooltip>
 
        <CardContent>
          <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: '#1B3A5C' }}>
            {book.title}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {book.author} - {book.publisher}
          </Typography>
          <Chip label={book.genre} size='small' sx={{ mt: 1 }} />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
 
export default BookCard;
 