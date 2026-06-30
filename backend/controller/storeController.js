import Product from '../models/Product.js'
import User from '../models/User.js'
import mongoose from 'mongoose'
import fs from 'fs'
import Stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config();
import bcrypt from 'bcrypt'
import validator from 'validator'
import {v2 as cloudinary} from 'cloudinary';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const extractURL = (imageUrl) => {
    if (!imageUrl) return null;
    try {
        // https://res.cloudinary.com/dluzdsmxw/image/upload/v1782630691/store-products/kbssggtpophr85oftrbq.png
        const parts = imageUrl.split('/');
        // [
        //   'https:',
        //   '',
        //   'res.cloudinary.com',
        //   'dluzdsmxw',
        //   'image',
        //   'upload',
        //   'v1782630691',     
        //   'store-products',  
        //   'kbssggtpophr85oftrbq.png'
        // ]
        const uploadIndex = parts.indexOf('upload');


        if (uploadIndex === -1) return null;
        const publicId = parts.slice(uploadIndex + 2).join('/').split('.')[0];
        // slice
        // 'store-products',  
        // 'kbssggtpophr85oftrbq.png'

        // join
        // Result: 'store-products/kbssggtpophr85oftrbq.png'

        // split
        // store-products/kbssggtpophr85oftrbq

        return publicId;    
    } 
    catch (error) {
        console.error('Error extracting public_id:', error);
        return null;
    }
};


export const checkoutSession = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.product');

        if (!user || !user.cart.length) {
            return res.status(400).json({ error: "Your cart is empty." });
        }

        const line_items = user.cart.map((item) => {
            const product = item.product;

            return {
                price_data: {
                    currency: "AUD",
                    product_data: {
                        name: product.title,
                        description: product.description,
                        images: [product.image],
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: item.quantity
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url:"http://localhost:5173/",
            cancel_url:"http://localhost:5173/product"
        });

        return res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Error Details:", error.message);
        return res.status(500).json({ error: error.message });
    }
}


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

export const getAllCustomers = async (req, res) => {
    const customers = await User.find({role: "customer"});
    return res.json(customers);
}

export const delSpecificUser = async (req, res) => {
    try {
        const {id} = req.params;
        const customers = await User.findByIdAndDelete(id);
        return res.status(200).json(customers);
    }

    catch (err) {
        return res.status(404).json(err);
    }

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

export const updateExistingProduct = async (req, res) => {
    const {id} = req.params;
    const updatedFields = req.body;
    let newImage = null;
    let publicImageURL = null;
    const existingProduct = await Product.findById(id);

    if (req.file) { // if new image provided
        if (existingProduct.image) {
            publicImageURL = extractURL(existingProduct.image);
        }
        
        // delete old image
        if (publicImageURL) {
            console.log(publicImageURL);
            await cloudinary.uploader.destroy(publicImageURL);
        }
        
        // upload new image
        newImage = await cloudinary.uploader.upload(req.file.path, {
            folder: 'store-products',
            transformation: [
                {quality: 'auto'}
            ]
        })
    }

    if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }

    if (newImage) {
        updatedFields.image = newImage.secure_url;
    }


    const product = await Product.findByIdAndUpdate(id, updatedFields, {
        returnDocument: 'after',
        runValidators: true // validators prevent submitting empty field and letters (also input type does this)
    });

    if (!product) {
        return res.status(404).json({msg: "No product found"});
    }

    const products = await Product.find({ user_id: req.user._id }).sort({createdAt:-1});
    
    return res.status(200).json(products);

}

export const createProduct = async (req, res) => {
    
    const {title, description, price, quantity} = req.body;
    if (!title) {
        errorFields.push("title");
    }
    const errorFields = [];

    if (!description) {
        errorFields.push("description");
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
        try {
            const link = await cloudinary.uploader.upload(req.file.path, {
                folder: 'store-products',
                transformation: [
                    {quality: 'auto'}
                ]
            });

            image = link.secure_url;

            // remove from localStorage since uploaded to cloudinary
        }
        catch (err) {
            return res.status(500).json({msg: "Failed to upload image"});
        }


        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        /*image = `${req.protocol}://${req.get('host')}/imageFolder/${req.file.filename}`;*/
                // http         :// localhost:4000  /imageFolder/ filename.png
    }
    const product = await Product.create({title, description, price, quantity, user_id, image});
    res.status(200).json(product);
  
    // res.send({msg:"Admin function to add store items"});
}

export const deleteProduct = async (req, res) => {
    const {id} = req.params;
    let publicImageURL = null;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({msg: "ID is not valid"})
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({msg: "Product does not exist"});
        }

        if (product.image) {

            publicImageURL = extractURL(product.image);
            
            // delete old image
            if (publicImageURL) {
                const demoUser = await User.findOne({username: "admindemo1"});
                if (!product.user_id.equals(demoUser._id)) {
                    await cloudinary.uploader.destroy(publicImageURL); // don't delete url for demo products, to seed database persistently
                }
            }
        }
        
        const cartUpdate = await User.updateMany(
            { "cart.product": id },
            { $pull: { cart: { product: id } } }
        );

        await Product.findByIdAndDelete(id); // delete product from db

        return res.status(200).json(product);
    }
    catch (err) {
        return res.status(400).json({error: err.message});
    }
    
}

export const addToCart = async (req, res) => {
    const { productID } = req.body;
    const user = await User.findById(req.user._id);
    const product = await Product.findById(productID);

    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }

    if (product.quantity <= 0) {
        return res.status(400).json({ error: "Product is out of stock" });
    }

    const result = user.cart.find(cartItem => cartItem.product.toString() === productID);
    if (result) {
        result.quantity += 1;
    }
    else {
        user.cart.push({ product: productID, quantity: 1 });
    }

    product.quantity -= 1;

    await user.save();
    await product.save();

    const populatedCart = await User.findById(req.user._id).populate('cart.product').select('-password');
    return res.json(populatedCart);
}

export const decrementCart = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(req.user._id).select('cart').populate('cart.product');
    const cartItem = user.cart.find(item => item.product._id.toString() === id);

    if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
    }

    cartItem.quantity -= 1;
    cartItem.product.quantity += 1;

    if (cartItem.quantity <= 0) {
        user.cart = user.cart.filter(item => item.product._id.toString() !== id);
    }

    await cartItem.product.save();
    await user.save();
    await user.populate('cart.product');

    return res.json(user.cart);
}

export const incrementCart = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(req.user._id).select('cart').populate('cart.product');
    const cartItem = user.cart.find(item => item.product._id.toString() === id);

    if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
    }

    if (cartItem.product.quantity <= 0) {
        return res.status(400).json({ error: "Product is out of stock" });
    }

    cartItem.quantity += 1;
    cartItem.product.quantity -= 1;

    await cartItem.product.save();
    await user.save();
    await user.populate('cart.product');
    return res.json(user.cart);
}

export const getCartProducts = async (req, res) => {
    const user = await User.findById(req.user._id).select('cart').populate('cart.product');

    if (!user) {
        return res.status(404).json({msg: "No products added to cart "})
    }
    return res.status(200).json(user.cart);
}

export const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(req.user._id).populate('cart.product');

        if (!user) {
            return res.status(404).json({msg: "No user found"});
        }

        const cartItem = user.cart.find(cartItem => cartItem.product._id.toString() === id);

        if (cartItem && cartItem.product) {
            cartItem.product.quantity += cartItem.quantity;
            await cartItem.product.save();
        }

        user.cart = user.cart.filter(cartItem => cartItem.product._id.toString() !== id);

        await user.save();

        const populatedCart = await User.findById(req.user._id).populate('cart.product').select('-password');
        
        return res.status(200).json(populatedCart);
    }
    
    catch (err) {
        return res.status(404).json({msg: err});
    }


}

export const updateProfile = async (req, res) => {
    let {username, password} = req.body;
    const errorField = [];
    if (!validator.isStrongPassword(password)) {
        errorField.push('Password is not strong enough');
    }
    
    const userExists = await User.findOne({username, _id : {$ne: req.user._id}}); // $ne -> not equal

    if (userExists) {
        errorField.push('Username is taken');
    }

    if (errorField.length > 0) {
        return res.status(400).json({errorField});
    }

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    let updatedFields = {username, password};

    const user = await User.findByIdAndUpdate(req.user._id, updatedFields, {
        returnDocument: 'after',
        runValidators: true // validators prevent submitting empty field and letters (also input type does this)
    });

    return res.json(user);
}

export const deactivate = async (req, res) => {
    const user = await User.findByIdAndDelete(req.user._id);
    return res.json(user);
}
