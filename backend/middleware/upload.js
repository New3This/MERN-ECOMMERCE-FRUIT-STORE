import multer from 'multer';
import fs from 'fs';
const storage = multer.diskStorage({
    destination: function (req, file, cb) { // decides destination of file
        const fullPath = `./imageFolder/${file.originalname}`;
        if (fs.existsSync(fullPath)) {
            return cb(new Error('File already exists'), null);
        }
        cb(null, 'imageFolder/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // decides filename of file
    }
});

export const upload = multer({ storage: storage });