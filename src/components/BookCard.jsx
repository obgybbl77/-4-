import { Card, CardActionArea, CardContent, Typography, Chip } from '@mui/material';
 
function BookCard({ book, onSelect, onToggleLike }) {
  return (
    <Card component='li' sx={{ listStyle: 'none', position: 'relative' }}>
      <CardActionArea onClick={() => onSelect(book.id)}>
        {/* 마우스를 올리면 책이 3D로 뒤집혀서 뒷면에 내용이 보임 */}
        <div className='flip-card'>
          <div className='flip-inner'>
            {/* 앞면: 원래 표지 그대로 */}
            <div className='book-cover flip-front'>
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
 
            {/* 뒷면: 책 내용 */}
            <div className='flip-back'>
              <p className='back-title'>{book.title}</p>
              <p className='back-content'>{book.content || '등록된 내용이 없어요.'}</p>
            </div>
          </div>
        </div>
 
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
 
      <button
        type='button'
        className={book.liked ? 'like-btn liked' : 'like-btn'}
        onClick={() => onToggleLike(book)}
        aria-label='즐겨찾기'
      >
        {book.liked ? '♥' : '♡'}
      </button>
    </Card>
  );
}
 
export default BookCard;
 