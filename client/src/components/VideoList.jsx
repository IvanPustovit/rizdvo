import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  const navigate = useNavigate();
    const [selectedVideo, setSelectedVideo] = useState(null);


  // useEffect(() => {
  //   const fetchVideos = async () => {
  //     const response = await axios.get('http://localhost:50000/api/videos');
  //     setVideos(response.data);
  //   };
  //   fetchVideos();
  // }, []);є

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`/api/videos`);

        setVideos(response.data);
      } catch (err) {
        console.error("Помилка завантаження списку відео:", err);
        setError("Не вдалося завантажити список відео. Спробуйте пізніше.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleViewVideo = (video) => {
    setSelectedVideo(video);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    // <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
    //   <Typography variant="h4" gutterBottom>
    //     Список відео
    //   </Typography>
    //   {videos.length === 0 ? (
    //     <Typography variant="body1">Немає завантажених відео.</Typography>
    //   ) : (
    //     <List>
    //       {videos.map((video, index) => (
    //         <ListItem key={index} divider>
    //           <ListItemText
    //             primary={video.title}
    //             secondary={`Завантажено: ${new Date(
    //               video.uploadedAt
    //             ).toLocaleString()} | Користувач: ${video.user}`}
    //           />
    //           <Button
    //             variant="contained"
    //             onClick={() => handleViewVideo(video)}
    //             sx={{ ml: 2 }}
    //           >
    //             Переглянути
    //           </Button>
    //         </ListItem>
    //       ))}
    //     </List>
    //   )}

    //   {selectedVideo && (
    //     <Box sx={{ mt: 4, textAlign: "center" }}>
    //       <Typography variant="h5" gutterBottom>
    //         {selectedVideo.title}
    //       </Typography>
    //       <video
    //         src={`/${selectedVideo.filePath}`}
    //         controls
    //         style={{ width: "100%" }}
    //       />
    //     </Box>
    //   )}
    // </Box>
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
      <Typography variant="h4">Список відео</Typography>
      {videos.length === 0 ? (
        <Typography variant="body1">Немає завантажених відео.</Typography>
      ) : (
        <List>
          {videos.map((video) => (
            <ListItem key={video._id} divider>
              <ListItemText
                primary={video.title}
                secondary={`Завантажено: ${new Date(
                  video.uploadedAt
                ).toLocaleString()} | Користувач: ${video.user}`}
              />
              <Button
                variant="contained"
                // onClick={() => navigate(`/video/${video._id}`)}
                onClick={() => handleViewVideo(video)}
                sx={{ ml: 2 }}
              >
                Переглянути
              </Button>
            </ListItem>
          ))}
        </List>
      )}

      {selectedVideo && <VideoPlayer video={selectedVideo} />}
    </Box>
  );
};

export default VideoList;
