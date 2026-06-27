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
                title: "Starter T-Shirt",
                description: "A clean demo product for your store.",
                price: 29.99,
                quantity: 10,
                user_id: seedAdmin._id,
                image: ""
            },
            {
                title: "Demo Hoodie",
                description: "Another sample item so the catalog feels real.",
                price: 59.99,
                quantity: 8,
                user_id: seedAdmin._id,
                image: ""
            },
            {
                title: "Starter T-Shirt",
                description: "A clean demo product for your store.",
                price: 29.99,
                quantity: 10,
                user_id: seedAdmin._id,
                image: ""
            },
            {
                title: "Demo Hoodie",
                description: "Another sample item so the catalog feels real.",
                price: 59.99,
                quantity: 8,
                user_id: seedAdmin._id,
                image: ""
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
