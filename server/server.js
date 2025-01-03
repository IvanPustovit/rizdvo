const express = require('express');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const { createReadStream } = require("node:fs");
const FormData = require("form-data");

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Помилка MongoDB:'));
db.once('open', () => console.log('Підключено до MongoDB'));

// Модель для метаданих відео
const Video = mongoose.model('Video', new mongoose.Schema({
  title: String,
  user: String,
  filePath: String,
  uploadedAt: { type: Date, default: Date.now },
}));

// Налаштування для завантаження файлів
const upload = multer({ dest: path.join(__dirname, 'uploads') });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const sendTelegramVideoNotification = async (message,videoPath) => {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Не задані змінні TELEGRAM_BOT_TOKEN або TELEGRAM_CHAT_ID.');
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendVideo`;
  const videoFullPath = path.join(__dirname, videoPath);

  try {
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('caption', message);
    formData.append('video', createReadStream(videoFullPath));

    await axios.post(url, formData, {
      headers: formData.getHeaders(),
    });

    console.log('Повідомлення з відео успішно надіслано');
  } catch (error) {
    console.error('Помилка надсилання повідомлення в Telegram:', error.response?.data || error.message);
  }
};

// Роут для завантаження відео
app.post('/api/upload', upload.single('video'), async (req, res) => {
  const { title, user } = req.body;

  if (!req.file) return res.status(400).send('Файл не завантажено');

  const video = new Video({
    title,
    user,
    filePath: `/uploads/${req.file.filename}`,
  });

  await video.save();

  // Відправка повідомлення в Telegram з текстом і відео
  const message = `Нове відео завантажено:\nНазва: ${title}\nКористувач: ${user}`;
  const videoPath = video.filePath; // Відносний шлях до відео
  sendTelegramVideoNotification(message, videoPath);

  res.status(200).json(video);
});

// Роут для отримання списку відео
app.get('/api/videos', async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
});

// Додавання статичних файлів з React
app.use(express.static(path.join(__dirname, '../client/dist')));

// Обслуговування React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Запуск сервера
app.listen(PORT, () => console.log(`Сервер працює на порту ${PORT}`));
