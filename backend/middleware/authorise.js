import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const authorise = async (req, res, next) => {

    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Request is unauthorised" });
    }
    
    const token = authorization.split(' ')[1]; // [Bearer Token] <--

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const userId = payload.id || payload._id;

        if (!userId) {
            return res.status(401).json({ error: 'Request is unauthorised' });
        }

        req.user = await User.findById(userId).select('_id'); // extracts user id only

        if (!req.user) {
            return res.status(401).json({ error: 'Request is unauthorised' });
        }

        next(); // once we verified the tokens are valid, we allow access
    }

    catch (error) {
        res.status(401).json({error: "Request is unauthorised"});
    }

}

export default authorise;