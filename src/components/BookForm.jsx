import { useState } from 'react';
import { Paper, Typography, TextField, MenuItem, Box, Button } from '@mui/material';

export const GENRES = ['소설', '에세이', '시', '인문', '과학', '기술/IT', '경제/경영' ,'자기개발'];

//글자수 제한
const MAX = {
  title: 50,
  author: 30,
  publisher: 30,
  content: 500,
  coverPrompt: 300,
};

function BookForm({ initialBook, onSave, onCancel }) {

  const [title, setTitle] = useState(initialBook?.title || '');
  const [author, setAuthor] = useState(initialBook?.author || '');
  const [publisher, setPublisher] = useState(initialBook?.publisher || '');
  const [genre, setGenre] = useState(initialBook?.genre || '');
  const [content, setContent] = useState(initialBook?.content || '');
  const [coverPrompt, setCoverPrompt] = useState(initialBook?.coverPrompt || '');
  const [errors, setErrors] = useState({});


  const validate = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = '제목을 입력해 주세요.';
    else if (title.trim().length > MAX.title) newErrors.title = `제목은 ${MAX.title}자 이내로 입력해 주세요.`;

    if (!author.trim()) newErrors.author = '저자를 입력해 주세요.';
    else if (author.trim().length > MAX.author) newErrors.author = `저자는 ${MAX.author}자 이내로 입력해 주세요.`;

    if (!publisher.trim()) newErrors.publisher = '출판사를 입력해 주세요.';
    else if (publisher.trim().length > MAX.publisher) newErrors.publisher = `출판사는 ${MAX.publisher}자 이내로 입력해 주세요.`;

    if (!genre) newErrors.genre = '장르를 선택해 주세요.';

    if (content.trim().length > MAX.content) newErrors.content = `도서 내용은 ${MAX.content}자 이내로 입력해 주세요.`;
    if (coverPrompt.trim().length > MAX.coverPrompt) newErrors.coverPrompt = `표지 생성 문구는 ${MAX.coverPrompt}자 이내로 입력해 주세요.`;

    return newErrors;
  };

  const clearError = (name) => {
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = () => {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave({
      title: title.trim(),
      author: author.trim(),
      publisher: publisher.trim(),
      genre,
      content: content.trim(),
      coverPrompt: coverPrompt.trim(),
    });
  };


  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1B3A5C', mb: 2 }}>
        {initialBook ? '도서 수정' : '도서 등록'}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="제목"
          required
          value={title}
          onChange={(e) => { setTitle(e.target.value); clearError('title'); }}
          error={!!errors.title}
          helperText={errors.title}
        />

        <TextField
          label="저자"
          required
          value={author}
          onChange={(e) => { setAuthor(e.target.value); clearError('author'); }}
          error={!!errors.author}
          helperText={errors.author}
        />

        <TextField
          label="출판사"
          required
          value={publisher}
          onChange={(e) => { setPublisher(e.target.value); clearError('publisher'); }}
          error={!!errors.publisher}
          helperText={errors.publisher}
        />

        <TextField
          select
          label="장르"
          required
          value={genre}
          onChange={(e) => { setGenre(e.target.value); clearError('genre'); }}
          error={!!errors.genre}
          helperText={errors.genre}
        >
          {GENRES.map((g) => (
            <MenuItem key={g} value={g}>{g}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="도서 내용 또는 소개"
          multiline
          rows={4}
          value={content}
          onChange={(e) => { setContent(e.target.value); clearError('content'); }}
          error={!!errors.content}
          helperText={errors.content || `${content.length} / ${MAX.content}`}
          slotProps={{ htmlInput: { maxLength: MAX.content } }}
        />

        <TextField
          label="AI 표지 생성 문구 (선택)"
          placeholder="원하는 표지 분위기를 입력하세요. 비워두면 AI가 추천합니다."
          multiline
          rows={4}
          value={coverPrompt}
          onChange={(e) => { setCoverPrompt(e.target.value); clearError('coverPrompt'); }}
          error={!!errors.coverPrompt}
          helperText={errors.coverPrompt || `${coverPrompt.length} / ${MAX.coverPrompt}`}
          slotProps={{ htmlInput: { maxLength: MAX.coverPrompt } }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
        <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: '#9760a8' }}>
          저장
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          취소
        </Button>
      </Box>
    </Paper>
  );
}

export default BookForm;