import userModel from '../models/User.js'
import jwt from 'jsonwebtoken';

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '5d'});
}

export const signupUser = async (req, res) => {
    try {
        const user = await userModel.signUp(req.body.username, req.body.email, req.body.password);
        const token = createToken(user._id);
        res.status(201).json({user, token});
    }
    catch (err) {
        res.status(400).json({error: err.message});
    }
}

export const loginUser = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const user = await userModel.login(username, email, password);
        // alternate way of writing the above line:
        // const user = await userModel.login(req.body.username, req.body.email, req.body.password);
        
        const token = createToken(user._id);
        res.status(201).json({user, token});
    }
    catch (err) {
        res.status(400).json({error: err.message});
    }
}