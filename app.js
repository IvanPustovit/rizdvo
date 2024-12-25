// Import необхідних бібліотек
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;


if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}



// Налаштування сховища Multer для локального збереження файлів
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Відключення CORS
app.use(cors());

// Імітація бази даних у пам'яті та її оновлення
const dbFilePath = path.join(__dirname, 'db.json');

const loadDatabase = () => {
  try {
    if (fs.existsSync(dbFilePath)) {
      const data = fs.readFileSync(dbFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Помилка завантаження бази даних:', error);
  }
  return [];
};

const saveDatabase = (data) => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Помилка збереження бази даних:', error);
  }
};

const videoDataStore = loadDatabase();

// Маршрут для завантаження відео
app.post('/api/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Файл не завантажено.');
  }

  const videoData = {
    title: req.body.title,
    filePath: `/uploads/${req.file.filename}`,
    user: req.body.user, // Додано збереження даних про юзера
    uploadedAt: new Date(),
  };

  // Збереження даних у пам'яті та оновлення файлу бази даних
  videoDataStore.push(videoData);
  saveDatabase(videoDataStore);

  res.status(200).json({
    message: 'Відео успішно завантажено!',
    video: videoData,
  });
});

// Маршрут для отримання списку відео
app.get('/api/videos', (req, res) => {
  res.json(videoDataStore);
});

app.get('/api/videos/:id', (req, res) => {
  res.json(videoDataStore[req.params.id]);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
