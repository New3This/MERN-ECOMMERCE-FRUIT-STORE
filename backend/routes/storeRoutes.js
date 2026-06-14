import express from 'express'
import {createProduct, getAllProducts, getOneProduct, deleteProduct, getAdminProducts, updateExistingProduct, getAllUsers} from '../controller/storeController.js'
import authorise from '../middleware/authorise.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

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

router.post('/', upload.single('image'), createProduct);


export default router;