import express from "express";
import { 
    createPaymentOrder, 
    verifyPayment, 
    getPaymentDetails 
} from "../controller/payment.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// All payment routes require authentication
router.use(verifyToken);

// Create payment order
router.post("/create-order", createPaymentOrder);

// Verify payment
router.post("/verify", verifyPayment);

// Get payment details
router.get("/details/:payment_id", getPaymentDetails);

export default router;
