import express from 'express'
import {createProduct, getAllProducts, getOneProduct, deleteProduct, getAdminProducts, updateExistingProduct, getAllUsers} from '../controller/storeController.js'
import authorise from '../middleware/authorise.js';
import { upload } from '../middleware/upload.js'; // customised multer middleware for file upload

const router = express.Router();

router.get('/admin', authorise, getAdminProducts);
router.get('/users', authorise, getAllUsers);
router.get('/:id', getOneProduct);

router.use(authorise);

router.get('/', getAllProducts);

// router.get('/savedItems', (req, res) => {
//     res.send({msg:"Get all saved items"});
// })


router.delete('/:id', deleteProduct);

const handleUpload = (req, res, next) => {
    const errorFields = [];
    upload.single('image')(req, res, (err) => {
        if (err) {
            // If the "File already exists" error happens, catch it here cleanly
            errorFields.push("image");
            return res.status(400).json({ error: err.message, errorFields });
        }
        // If no error, proceed to your createProduct controller safely
        next();
    });
};

router.post('/', handleUpload, createProduct);
// upload decides filename and destination of the file
// single means only one file is being uploaded
// 'imageFolder' is the name of the field in the formData that contains the file

export default router;