import express from 'express';
const router = express.Router();
import ProductController from '../controllers/productControllers.js';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';
import shortid from 'shortid';

// const upload = multer({ dest: 'upload/' });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, shortid.generate() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage });

// product API
router.post('/create/product',authMiddleware,upload.array('productImages'), ProductController.createProduct);

// paginate product
router.get('/:slug', ProductController.listingProductByCategory);





export default router