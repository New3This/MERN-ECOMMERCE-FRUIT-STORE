import mongoose from 'mongoose'
import express from 'express'
import storeRoutes from './routes/storeRoutes.js'
import userRoutes from './routes/userRoutes.js'
import dotenv from 'dotenv'
import cors from 'cors'
import fs from 'fs';
import multer from 'multer';
import Product from './models/Product.js'
import User from './models/User.js'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary';

dotenv.config();
const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
});

app.use(cors());
app.use(express.json()); // converts json to jso for req.body
app.use('/api/store', storeRoutes);
app.use('/api/user', userRoutes);

// NO NEED TO SERVE LOCAL FILES with cloudinary

// fs.mkdirSync('imageFolder', { recursive: true });
// app.use('/imageFolder', express.static('imageFolder'));
        // app.use gives frontend access to 
        // browser url       folder name
        // browser url: http://localhost:4000/imageFolder/empty.png
        // folder name: backend/imageFolder/empty.png

const seedDatabase = async () => {
    const productCount = await Product.countDocuments();

    if (productCount < 1) {
        let seedAdmin = await User.findOne({ username: 'admindemo1'});

        if (!seedAdmin) {
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash('admindemo1!A', salt);

            seedAdmin = await User.create({
                username: 'admindemo1',
                email: 'admindemo1@e.com',
                password,
                role: 'admin'
            });
        }


        await Product.insertMany([
            {
                title: "Fruit Basket",
                description: "A lovely collection and assortment of fresh fruits, ripe for the season",
                price: 10.99,
                quantity: 10,
                user_id: seedAdmin._id,
                image: "https://res.cloudinary.com/dluzdsmxw/image/upload/v1782634030/image-removebg-preview_mcdaif.png"
            },
            {
                title: "Kiwi fruit",
                description: "A nutrient-dense berry with fuzzy brown skin and vibrant flesh",
                price: 1.99,
                quantity: 10,
                user_id: seedAdmin._id,
                image: "https://res.cloudinary.com/dluzdsmxw/image/upload/v1782634850/kiwi_fruit_nu4lre.jpg"
            },
            {
                title: "Bowl worth of Strawberries",
                description: "A widely cultivated, low-growing herbaceous plant of the rose family (Rosaceae) and its bright red, sweet, and aromatic edible fruit",
                price: 2.99,
                quantity: 10,
                user_id: seedAdmin._id,
                image: "https://res.cloudinary.com/dluzdsmxw/image/upload/v1782634772/bowl_of_strawberries_psvpwu.png"
            },
            {
                title: "Bowl worth of Blackberries",
                description: "Blackberries are sweet, nutrient-dense aggregate fruits that grow on sprawling, thorny bramble bushes",
                price: 5.99,
                quantity: 10,
                user_id: seedAdmin._id,
                image: "https://res.cloudinary.com/dluzdsmxw/image/upload/v1782634615/bowl_of_blackberries_cankgm.png"
            },
        ]);
    }
};

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        await seedDatabase();
        app.listen(process.env.PORT, () => {
            console.log(`Connected to Database. Listening on port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log(err);
    })
