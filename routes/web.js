import express from 'express';
const router = express.Router();
import CategoryController from '../controllers/categoryController.js'
import ProductController from '../controllers/productControllers.js'
import Authentication from '../controllers/userAuthController.js'


// category of products API
router.post('/createCategoryProduct', CategoryController.cat1),
router.get('/getCategoryProduct/select', CategoryController.selectCategory)

// product API
router.post('/create/product', ProductController.createProduct)

// authentication API

router.post('/user/ragistration', Authentication.userRagistration)
router.post('/user/login', Authentication.userLogin)


export default router