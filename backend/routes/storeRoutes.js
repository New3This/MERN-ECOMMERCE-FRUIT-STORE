import express from 'express'
import {createProduct, getAllProducts, getOneProduct, deleteProduct, getAdminProducts, updateExistingProduct, getAllUsers} from '../controller/storeController.js'
import authorise from '../middleware/authorise.js';

const router = express.Router();

router.get('/:id', getOneProduct);

router.use(authorise);

router.get('/', getAllProducts);

router.get('/admin', getAdminProducts);

router.get('/users', getAllUsers);


// router.get('/savedItems', (req, res) => {
//     res.send({msg:"Get all saved items"});
// })


router.delete('/:id', deleteProduct);

router.patch('/:id', updateExistingProduct)

router.post('/', createProduct);


export default router;