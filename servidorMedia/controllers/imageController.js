const path = require('path');
const sharp = require('sharp');

exports.resizeImage = (req, res) => {
  const inputImagePath = path.join(__dirname, '..', 'media', 'input.jpg');
  const outputImagePath = path.join(__dirname, '..', 'media', 'output.jpg');

  sharp(inputImagePath)
    .resize(300, 300)
    .toFile(outputImagePath, (err, info) => {
      if (err) {
        return res.status(500).send('Error procesando la imagen.');
      }
      res.sendFile(outputImagePath);
    });
};