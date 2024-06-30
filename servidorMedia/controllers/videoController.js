const path = require('path');
const fs = require('fs');

exports.streamVideo = (req, res) => {
    const videoPath = path.join(__dirname, '..', 'media', 'input.mp4');

    fs.stat(videoPath, (err, stats) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.sendStatus(404);
            }
            return res.status(500).send(err);
        }

        const range = req.headers.range;
        const { size } = stats;
        const start = 0;
        const end = size - 1;

        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
            const chunksize = end - start + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${size}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': size,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    });
};