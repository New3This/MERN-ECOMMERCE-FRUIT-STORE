import Product from '../models/Product.js'
import User from '../models/User.js'
import mongoose from 'mongoose'
import fs from 'fs'
import Stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config();
import bcrypt from 'bcrypt'
import validator from 'validator'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
                        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop"],
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

    if (req.file) {
        updatedFields.image = `${req.protocol}://${req.get('host')}/imageFolder/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(id, updatedFields, {
        returnDocument: 'after',
        runValidators: true // validators prevent submitting empty field and letters (also input type does this)
    });

    if (!product) {
        return res.status(404).json({msg: "No product found"});
    }

    const products = await Product.find().sort({createdAt:-1})
    return res.status(200).json(products);

}

export const createProduct = async (req, res) => {
    
    const {title, description, price, quantity} = req.body;
    const errorFields = [];

    if (!title) {
        errorFields.push("title");
    }
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
        image = `${req.protocol}://${req.get('host')}/imageFolder/${req.file.filename}`;
                // http         :// localhost:4000  /imageFolder/ filename.png
    }
    const product = await Product.create({title, description, price, quantity, user_id, image});
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

        if (product.image) { // if has image => can be deleted or stored img
            //  http://localhost:4000/imageFolder/empty.png
            try {
                const filename = product.image.split('/').pop(); // empty.png
                const filePath = `./imageFolder/${filename}`; // /imageFolder/empty.png
                
                if (fs.existsSync(filePath)) { // if img stored
                    await fs.promises.unlink(filePath);
                }
            }

            catch (err) {
                console.log(er);
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
    const result = user.cart.find(cartItem => cartItem.product.toString() === productID);
    if (result) {
        result.quantity += 1
    }
    else {
        user.cart.push({product: productID, quantity: 1});
    }

    await user.save();

    const populatedCart = await User.findById(req.user._id).populate('cart.product').select('-password');
    return res.json(populatedCart);
}

export const decrementCart = async (req, res) => {
    const { id } = req.params;
    // const user = await User.findById(req.user._id).select('cart');
    // const cartItem = await user.cart.find(item => item.product.toString() === id);
    const user = await User.findById(req.user._id).select('cart');
    const cartItem = user.cart.find(item => item.product._id.toString() === id);
    cartItem.quantity -= 1;
    await user.save();
    await user.populate('cart.product');

    return res.json(user.cart);
}

export const incrementCart = async (req, res) => {
    const { id } = req.params;
    // const user = await User.findById(req.user._id).select('cart');
    // const cartItem = await user.cart.find(item => item.product.toString() === id);
    const user = await User.findById(req.user._id).select('cart');
    const cartItem = user.cart.find(item => item.product.toString() === id);
    cartItem.quantity += 1;

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

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({msg: "No user found"});
        }
        user.cart = user.cart.filter(cartItem => cartItem.product.toString() !== id);

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
