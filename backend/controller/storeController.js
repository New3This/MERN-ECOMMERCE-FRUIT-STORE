import Product from '../models/Product.js'
import mongoose from 'mongoose'

export const getAllProducts = async (req, res) => {
    const products = await Product.find({}).sort({createdAt:-1})
    res.status(200).json(products);
}

export const getOneProduct = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({msg: "ID is not valid"})
    }
    const products = await Product.findById(id);

    if (!products) {
        res.status(404).json({msg: "No product exists"})
    }
    else {
        res.status(200).json(products);
    }
}

export const createProduct = async (req, res) => {
    const {title, price, quantity} = req.body;
    try {
        const product = await Product.create({title, price, quantity});
        res.status(200).json(product);
    }
    catch (err) {
        res.status(400).json({error: err.message});
    }
    // res.send({msg:"Admin function to add store items"});
}

export const deleteProduct = async (req, res) => {
    const {id} = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({msg: "ID is not valid"})
        }

        const product = await Product.findByIdAndDelete(id);
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
            res.status(404).json({msg: "Workout does not exist"});
        }
        else {
            res.status(200).json(product);
        }
    }
    catch (err) {
        res.status(400).json({error: err.message});
    }

}