import Product from '../models/Product.js'
import User from '../models/User.js'
import mongoose from 'mongoose'
import fs from 'fs'

export const getAllProducts = async (req, res) => {
    const products = await Product.find().sort({createdAt:-1})
    res.status(200).json(products);
}

export const getAdminProducts = async (req, res) => {
    const user_id = req.user._id;

    const products = await Product.find({user_id}).sort({createdAt:-1})
    res.status(200).json(products);
}

export const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password');
    res.status(200).json(users);
}

export const getOneProduct = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({msg: "ID is not valid"})
    }
    const product = await Product.findById(id);

    if (!product) {
        res.status(404).json({msg: "No product exists"})
    }
    else {
        res.status(200).json(product);
    }
}

export const createProduct = async (req, res) => {
    
    const {title, price, quantity} = req.body;
    const errorFields = [];

    if (!title) {
        errorFields.push("title");
    }
    if (!price) {
        errorFields.push("price");
    }
    if (!quantity) {
        errorFields.push("quantity");
    }
    if (errorFields.length > 0) {
        return res.status(400).json({error: "Please fill the following fields:", errorFields});
    }

    const user_id = req.user._id;
    let image = '';

    if (req.file) {
        image = `${req.protocol}://${req.get('host')}/imageFolder/${req.file.filename}`;
                // http         :// localhost:4000  /imageFolder/ filename.png
    }
    const product = await Product.create({title, price, quantity, user_id, image});
    res.status(200).json(product);
  
    // res.send({msg:"Admin function to add store items"});
}

export const deleteProduct = async (req, res) => {
    const {id} = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({msg: "ID is not valid"})
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({msg: "Product does not exist"});
        }

        if (product.image) { // if has image, delete img
            //  http://localhost:4000/imageFolder/empty.png
            const filename = product.image.split('/').pop(); // empty.png
            const filePath = `./imageFolder/${filename}`; // /imageFolder/empty.png

            await fs.promises.unlink(filePath);
        }

        await Product.findByIdAndDelete(id); // delete product from db

        return res.status(200).json(product);
    }
    catch (err) {
        return res.status(400).json({error: err.message});
    }
    
}

export const updateExistingProduct = async (req, res) => {

    const {id} = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({msg: "ID is not valid"})
        }

        const product = await Product.findOneAndUpdate({_id:id}, {
            ...req.body
        });

        if (!product) {
            res.status(404).json({msg: "Product does not exist"});
        }
        else {
            res.status(200).json(product);
        }
    }
    catch (err) {
        res.status(400).json({error: err.message});
    }

}