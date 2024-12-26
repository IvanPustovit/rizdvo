// Import необхідних бібліотек
import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

const VideoUpload = () => {
  const [title, setTitle] = useState("");
  const [user, setUser] = useState("");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (event) => {
    setVideo(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!title || !user || !video) {
      alert("Будь ласка, заповніть усі поля та оберіть файл.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("user", user);
    formData.append("video", video);

    try {
      setLoading(true);
      setSuccessMessage("");
      const response = await axios.post(
        "http://localhost:50000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Відео успішно завантажено!");
        setTitle("");
        setUser("");
        setVideo(null);
      }
    } catch (error) {
      console.error("Помилка завантаження відео:", error);
      alert("Помилка завантаження відео. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{ maxWidth: 600, margin: "auto", padding: 3, textAlign: "center" }}
    >
      <Typography variant="h4" gutterBottom>
        Завантаження відео
      </Typography>
      <TextField
        label="Номер карти"
        variant="outlined"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Ім'я користувача"
        variant="outlined"
        fullWidth
        margin="normal"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
      <Button variant="contained" component="label" sx={{ mt: 2 }}>
        Обрати відео
        <input
          type="file"
          hidden
          accept="video/*"
          onChange={handleFileChange}
        />
      </Button>
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
    </Box>
  );
};

export default VideoUpload;
