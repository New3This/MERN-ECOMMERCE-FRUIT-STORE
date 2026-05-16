import mongoose from 'mongoose'
import express from 'express'
import storeRoutes from './routes/storeRoutes.js' 
import dotenv from 'dotenv'

dotenv.config();
const app = express();
app.use(express.json()); // converts json to jso for req.body
app.use('/api/store', storeRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Connected to Database. Listening on port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log(err);
    })

