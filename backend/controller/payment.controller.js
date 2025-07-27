import { razorpay, razorpayConfig } from '../config/razorpay.js';
import crypto from 'crypto';
import User from '../models/user.model.js';

// Currency conversion rate
const USD_TO_INR_RATE = 83;

// Create Razorpay order
export const createPaymentOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR' } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount"
            });
        }

        // Convert USD to INR
        const amountInINR = amount * USD_TO_INR_RATE;

        // Create order options
        const options = {
            amount: Math.round(amountInINR * 100), // Razorpay expects amount in paise
            currency: currency,
            receipt: `${razorpayConfig.receipt_prefix}${Date.now()}`,
            notes: {
                ...razorpayConfig.notes,
                user_id: req.userId,
                order_amount_usd: amount,
                order_amount_inr: amountInINR
            }
        };

        // Create order with Razorpay
        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt
            },
            key_id: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error("Error creating payment order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create payment order"
        });
    }
};

// Verify payment signature
export const verifyPayment = async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            cart_data 
        } = req.body;

        // Create signature for verification
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        // Verify signature
        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        // Payment is verified, now process the order
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // Calculate total
        const total = user.cart.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Generate order ID
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Create order
        const order = {
            orderId,
            items: [...user.cart],
            total,
            paymentMethod: 'razorpay',
            paymentId: razorpay_payment_id,
            razorpayOrderId: razorpay_order_id,
            status: "completed",
            orderDate: new Date()
        };

        // Add to order history
        user.orderHistory.push(order);

        // Clear cart
        user.cart = [];

        await user.save();

        res.status(200).json({
            success: true,
            message: "Payment verified and order created successfully",
            order
        });

    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });
    }
};

// Get payment details
export const getPaymentDetails = async (req, res) => {
    try {
        const { payment_id } = req.params;

        const payment = await razorpay.payments.fetch(payment_id);

        res.status(200).json({
            success: true,
            payment
        });

    } catch (error) {
        console.error("Error fetching payment details:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch payment details"
        });
    }
};
