import { Card, CardActionArea, CardContent, Typography, Chip } from '@mui/material';
function BookCard({ book, onSelect }) {
  return (
    <Card component ='li' sx={{listStyle: 'none'}}>
      <CardActionArea onClick={()=>onSelect(book.id)}>
        <div className='book-cover'>
          {book.coverImageUrl ? (  <img
              src={book.coverImageUrl}
              alt={`${book.title} 표지`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />) : (<span>표지없음</span>)}
          <div className ='cover-text'>
          <p className='cover-title'>{book.title}</p>
            <p className='cover-author'>{book.author}</p>
            <p className='cover-publisher'>{book.publisher}</p>
        </div>
        </div>
      <CardContent>
        <Typography variant='subtitle1' sx={{fontWeight: 'bold', color:'#1B3A5C' }}>
          {book.title}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
            {book.author} - {book.publisher}

        </Typography>
        <Chip label={book.genre} size='small' sx={{mt:1}}/>

      </CardContent>



        
      </CardActionArea>
    </Card>

  );
}

export default BookCard;