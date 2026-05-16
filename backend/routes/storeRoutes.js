import express from 'express'
import {createProduct, getAllProducts, getOneProduct, deleteProduct, updateExistingProduct} from '../controller/storeController.js'
const router = express.Router();


router.get('/', getAllProducts);

router.get('/:id', getOneProduct);

// router.get('/savedItems', (req, res) => {
//     res.send({msg:"Get all saved items"});
// })


router.delete('/:id', deleteProduct);

router.patch('/:id', updateExistingProduct)

router.post('/', createProduct);

export default router;