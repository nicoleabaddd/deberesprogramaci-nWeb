const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

exports.convertAudio = (req, res) => {
    const inputAudioPath = path.join(__dirname, '..', 'media', 'input.mp3');

    res.setHeader('Content-Disposition', 'attachment; filename="output.wav"');
    res.setHeader('Content-Type', 'audio/wav');

    const ffmpegStream = ffmpeg(inputAudioPath)
        .toFormat('wav')
        .on('start', () => {
            console.log('Transcoding started');
        })
        .on('error', (err) => {
            console.error('Error processing the audio:', err);
            if (!res.headersSent) {
                res.status(500).send('Error processing the audio.');
            }
        })
        .on('end', () => {
            console.log('Transcoding finished');
            res.end();
        });

    // Pipe ffmpeg stream to response
    const outputStream = ffmpegStream.pipe();

    outputStream.pipe(res);

    req.on('close', () => {
        console.log('Request aborted by the client.');
        outputStream.destroy();
    });

    res.on('finish', () => {
        console.log('Response finished.');
    });

    res.on('close', () => {
        console.log('Response closed.');
        outputStream.destroy();
    });
};