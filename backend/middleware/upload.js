import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadFolder = process.env.UPLOAD_DIR || (process.env.VERCEL ? '/tmp/uploadFolder' : path.resolve('uploadFolder'));

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fullPath = path.join(uploadFolder, file.originalname);
        if (fs.existsSync(fullPath)) {
            return cb(new Error('File already exists'), null);
        }
        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const upload = multer({ storage });