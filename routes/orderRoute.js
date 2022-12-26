import express from "express";
import OrderController from "../controllers/orderController.js";
import checkUserAuth from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/createMyOrder",checkUserAuth,OrderController.createOrder);
router.get("/MyAllOrders",OrderController.getOrders);

export default router