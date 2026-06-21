import express from 'express'
import {createProduct, deactivate, updateProfile, checkoutSession, updateExistingProduct, incrementCart, decrementCart, getAllCustomers, delSpecificUser, removeFromCart, getCartProducts, getAllProducts, getOneProduct, deleteProduct, getAdminProducts, getAllUsers, addToCart} from '../controller/storeController.js'
import authorise from '../middleware/authorise.js';
import { upload } from '../middleware/upload.js'; // customised multer middleware for file upload

const router = express.Router();

router.use(authorise);

router.get('/admin', getAdminProducts);
router.get('/users', getAllUsers);
router.get('/customers', getAllCustomers);
router.post('/addToCart', addToCart);
router.get('/addToCart', getCartProducts);
router.patch('/addToCart/decrement/:id', decrementCart);
router.patch('/addToCart/increment/:id', incrementCart);
router.patch('/profile', updateProfile);
router.get('/', getAllProducts);
// router.get('/savedItems', (req, res) => {
//     res.send({msg:"Get all saved items"});
// })

router.delete('/deleteUser/:id', delSpecificUser);
router.delete('/addToCart/:id', removeFromCart);
router.delete('/deactivate', deactivate);

router.delete('/:id', deleteProduct);
router.get('/:id', getOneProduct);

router.post('/checkout', checkoutSession);


const handleUpload = (req, res, next) => {
    const errorFields = [];
    upload.single('image')(req, res, (err) => {
        if (err) {
            // If the "File already exists" error happens, create error
            errorFields.push("image");
            return res.status(400).json({ error: err.message, errorFields });
        }
        // If no error, proceed to createProduct controller safely
        next();
    });
};

router.post('/', handleUpload, createProduct);
router.patch('/update/:id', handleUpload, updateExistingProduct);
// upload decides filename and destination of the file
// single means only one file is being uploaded
// 'imageFolder' is the name of the field in the formData that contains the file

export default router;