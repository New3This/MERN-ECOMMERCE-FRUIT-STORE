import mongoose from 'mongoose'
import express from 'express'
import storeRoutes from './routes/storeRoutes.js'
import userRoutes from './routes/userRoutes.js'
import dotenv from 'dotenv'
import cors from 'cors'
import fs from 'fs';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); // converts json to jso for req.body
app.use('/api/store', storeRoutes);
app.use('/api/user', userRoutes);

fs.mkdirSync('uploads', { recursive: true });
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Connected to Database. Listening on port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log(err);
    })

