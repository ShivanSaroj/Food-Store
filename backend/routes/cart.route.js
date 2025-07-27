import express from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    createOrder,
    getOrderHistory,
    getAllOrders
} from "../controller/cart.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// All cart routes require authentication
router.use(verifyToken);

// Cart management
router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove/:productId", removeFromCart);
router.delete("/clear", clearCart);

// Order management
router.post("/order", createOrder);
router.get("/orders", getOrderHistory);

// Admin only routes
router.get("/admin/orders", getAllOrders);

export default router;
