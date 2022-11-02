import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware.js';
import userAuthController from '../controllers/userAuthController.js';

router.put("/userProfile",authMiddleware,userAuthController.userProfile);


export default router;