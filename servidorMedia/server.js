const express = require('express');
const app = express();
const port = 3000;

const imageController = require('./controllers/imageController');
const audioController = require('./controllers/audioController');
const videoController = require('./controllers/videoController');

// Rutas
app.get('/image', imageController.resizeImage);
app.get('/audio', audioController.convertAudio);
app.get('/video', videoController.streamVideo);

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});