import {AppBar, Toolbar, Typography, Button} from '@mui/material';

function Header({onCreate}){
  return(
    <AppBar position='static' sx={
      {mb:2, bgcolor: 'white',  borderBottom: '4px solid #9760a8'}} color='default'>
      <Toolbar>
        <Typography variant='h5' sx={{flexGrow:1, color: '#1B3A5C', fontWeight: 'bold' }}>
          📚 도서 관리 시스템

        </Typography>
        <Button color='inherit' onClick={onCreate} sx={{ bgcolor: '#ceb8e2', color: '#1e1f20'}}>
          +도서등록
        </Button>
      </Toolbar>

    </AppBar>
  )
}

export default Header;