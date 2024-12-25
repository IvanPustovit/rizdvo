// Import необхідних бібліотек
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Button } from '@mui/material';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('/api/videos');
        setVideos(response.data);
      } catch (err) {
        console.error('Помилка завантаження списку відео:', err);
        setError('Не вдалося завантажити список відео. Спробуйте пізніше.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Список відео
      </Typography>
      {videos.length === 0 ? (
        <Typography variant="body1">Немає завантажених відео.</Typography>
      ) : (
        <List>
          {videos.map((video, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={video.title}
                secondary={`Завантажено: ${new Date(video.uploadedAt).toLocaleString()} | Користувач: ${video.user}`}
              />
              <Button
                variant="contained"
                component={Link}
                to={`/video/${encodeURIComponent(video.filePath)}`}
                sx={{ ml: 2 }}
              >
                Переглянути
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

const VideoPlayer = () => {
  const { id } = useParams();
  const videoUrl = `http://localhost:5000${decodeURIComponent(id)}`;

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 3, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Відео
      </Typography>
      <video src={videoUrl} controls style={{ width: '100%' }} />
    </Box>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VideoList />} />
        <Route path="/video/:id" element={<VideoPlayer />} />
      </Routes>
    </Router>
  );
};

export default App;
