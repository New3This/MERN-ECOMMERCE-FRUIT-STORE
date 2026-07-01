import mongoose from 'mongoose'
import express from 'express'
import storeRoutes from './routes/storeRoutes.js'
import userRoutes from './routes/userRoutes.js'
import dotenv from 'dotenv'
import cors from 'cors'
import Product from './models/Product.js'
import User from './models/User.js'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express.json());
app.use('/api/store', storeRoutes);
app.use('/api/user', userRoutes);

const seedDatabase = async () => {
    const productCount = await Product.countDocuments();

    if (productCount < 1) {
        let seedAdmin = await User.findOne({ username: 'admindemo1' });

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
                title: 'Fruit Basket',
                description: 'A lovely collection and assortment of fresh fruits, ripe for the season',
                price: 10.99,
                quantity: 10,
                user_id: seedAdmin._id,
                image: 'https://res.cloudinary.com/dylancloudstore/image/upload/v1782634030/image-removebg-preview_mcdaif.png'
            },
            {
                title: 'Kiwi fruit',
                description: 'A nutrient-dense berry with fuzzy brown skin and vibrant flesh',
                price: 1.99,
                quantity: 10,
                user_id: seedAdmin._id,
                image: 'https://res.cloudinary.com/dylancloudstore/image/upload/v1782634850/kiwi_fruit_nu4lre.jpg'
            },
            {
                title: 'Bowl worth of Strawberries',
                description: 'A widely cultivated, low-growing herbaceous plant of the rose family (Rosaceae) and its bright red, sweet, and aromatic edible fruit',
                price: 2.99,
                quantity: 10,
                user_id: seedAdmin._id,
                image: 'https://res.cloudinary.com/dylancloudstore/image/upload/v1782634772/bowl_of_strawberries_psvpwu.png'
            },
            {
                title: 'Bowl worth of Blackberries',
                description: 'Blackberries are sweet, nutrient-dense aggregate fruits that grow on sprawling, thorny bramble bushes',
                price: 5.99,
                quantity: 10,
                user_id: seedAdmin._id,
                image: 'https://res.cloudinary.com/dylancloudstore/image/upload/v1782634615/bowl_of_blackberries_cankgm.png'
            },
        ]);
    }
};

const startServer = async () => {
    if (!process.env.MONGO_URI) {
        console.warn('MONGO_URI not defined. Skipping database connection.');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        await seedDatabase();

        if (process.env.VERCEL !== '1') {
            app.listen(process.env.PORT || 4000, () => {
                console.log(`Connected to Database. Listening on port ${process.env.PORT || 4000}`);
            });
        }
    } catch (err) {
        console.log(err);
    }
};

void startServer();

export { app, startServer };
export default app;
