import userModel from '../models/User.js'

export const signupUser = async (req, res) => {
    try {
        const user = await userModel.signUp(req.body.username, req.body.email, req.body.password);
        res.status(201).json(user);
    }
    catch (err) {
        res.status(400).json({error: err.message});
    }
}

export const loginUser = async (req, res) => {
    res.send({msg:"Login user"});
}