import express from "express";
import CartController from "../controllers/cartController.js";
import checkUserAuth from "../middleware/authMiddleware.js";
const router = express.Router()


router.post("/createmycart", checkUserAuth,CartController.createCart)
router.get("/mycart", checkUserAuth,CartController.getcart)

export  default router