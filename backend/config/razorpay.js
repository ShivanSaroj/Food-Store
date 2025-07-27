import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Razorpay instance
export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'your_razorpay_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret',
});

// Razorpay configuration
export const razorpayConfig = {
    currency: 'INR',
    receipt_prefix: 'FOOD_STORE_',
    notes: {
        store_name: 'Food Store',
        payment_for: 'Food Order'
    }
};
