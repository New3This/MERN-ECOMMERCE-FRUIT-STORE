import mongoose from 'mongoose'
import express from 'express'
import storeRoutes from './routes/storeRoutes.js'
import userRoutes from './routes/userRoutes.js'
import dotenv from 'dotenv'
import cors from 'cors'
import fs from 'fs';
import multer from 'multer';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); // converts json to jso for req.body
app.use('/api/store', storeRoutes);
app.use('/api/user', userRoutes);

fs.mkdirSync('imageFolder', { recursive: true });
app.use('/imageFolder', express.static('imageFolder'));
        // app.use gives frontend access to 
        // browser url       folder name
        // browser url: http://localhost:4000/imageFolder/empty.png
        // folder name: backend/imageFolder/empty.png


        
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Connected to Database. Listening on port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log(err);
    })

