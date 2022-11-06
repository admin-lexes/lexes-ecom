import express from 'express';
const router = express.Router();
import CategoryController from '../controllers/categoryController.js'
import ProductController from '../controllers/productControllers.js'
import Authentication from '../controllers/userAuthController.js'
import checkUserAuth from '../middleware/authMiddleware.js'



// category of products API
router.post('/createCategoryProduct', CategoryController.cat1),
router.get('/getCategoryProduct/select', CategoryController.selectCategory)

// product API
router.post('/create/product', ProductController.createProduct)

// authentication API

router.post('/user/Registration', Authentication.userRegistration)
router.post('/user/login', Authentication.userLogin)
router.get('/user/logout',checkUserAuth, Authentication.userLogout)
router.post('/user/otp/Verification', Authentication.otpVerification)





export default router