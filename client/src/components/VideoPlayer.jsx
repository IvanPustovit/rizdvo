import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

const VideoPlayer = ({video}) => {
  const { id } = useParams();
  // const [video, setVideo] = useState(null);

  // useEffect(() => {
  //   const fetchVideo = async () => {
  //     const response = await axios.get(`http://localhost:50000/api/videos`);
  //     const foundVideo = response.data.find((v) => v._id === id);
  //     setVideo(foundVideo);
  //   };
  //   fetchVideo();
  // }, [id]);

  if (!video) return <Typography>Завантаження...</Typography>;

  return (
    <Box sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h4">{video.title}</Typography>
      <video controls style={{ width: '100%' }} src={`/${video.filePath}`} />
    </Box>
  );
};

export default VideoPlayer;
