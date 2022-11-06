import express from 'express';
const router = express.Router();
import CategoryController from '../controllers/categoryController.js'
import Authentication from '../controllers/userAuthController.js'
import checkUserAuth from '../middleware/authMiddleware.js'



// category of products API
router.get('/getCategories', CategoryController.getAllCategory)
router.post('/createCategory', CategoryController.createCategory),
router.get('/getCategoryProduct/select', CategoryController.selectCategory)



// authentication API

router.post('/user/Registration', Authentication.userRegistration)
router.put("/user/userProfile",checkUserAuth,Authentication.userProfile);
router.post('/user/login', Authentication.userLogin)
router.get('/user/logout',checkUserAuth, Authentication.userLogout)
router.post('/user/otp/Verification', Authentication.otpVerification)





export default router