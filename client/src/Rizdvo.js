// Import необхідних бібліотек
import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, CircularProgress, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import VideoList from './VideoList';

// Стилізація кнопки завантаження
const Input = styled('input')({
  display: 'none',
});
const apiUrl = "http://localhost:5000"

const UserVideoUpload = () => {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (event) => {
    setVideo(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!video || !title || !username) {
      alert('Будь ласка, заповніть усі поля та оберіть файл.');
      return;
    }

    const formData = new FormData();
    formData.append('video', video);
    formData.append('title', title);
    formData.append('user', username);

    try {
      setLoading(true);
      setSuccessMessage('');
      const response = await axios.post(`/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setSuccessMessage('Відео успішно завантажено!');
        setVideo(null);
        setTitle('');
        setUsername('');
      }
    } catch (error) {
      console.error('Помилка завантаження відео:', error);
      alert('Помилка завантаження відео. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', textAlign: 'center', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Завантаження відео
      </Typography>

      <TextField
        label="Номер карти"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        label="Назва відео"
        variant="outlined"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="video-upload">
        <Input
          accept="video/*"
          id="video-upload"
          type="file"
          onChange={handleFileChange}
        />
        <Button variant="contained" component="span" sx={{ mt: 2 }}>
          Обрати відео
        </Button>
      </label>

      {video && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Обрано файл: {video.name}
        </Typography>
      )}

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={loading}
        >
          Завантажити
        </Button>
        {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
      </Box>

      {successMessage && (
        <Typography variant="body1" color="success.main" sx={{ mt: 2 }}>
          {successMessage}
        </Typography>
      )}
      {/* <VideoList/> */}
    </Box>
  );
};

export default UserVideoUpload;
