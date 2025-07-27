import React from 'react';
import { Button } from '@chakra-ui/react';
import { convertUSDToINR, formatCurrency } from '../utils/currency.js';

const RazorpayPayment = ({ amount, onSuccess, onFailure, disabled = false, children }) => {
    const handlePayment = async () => {
        try {
            // Create order on backend
            const orderResponse = await fetch('/api/payment/create-order', {
                method: 'POST',
                 credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount,
                    currency: 'INR'
                })
            });

            const orderData = await orderResponse.json();

            if (!orderData.success) {
                throw new Error(orderData.message || 'Failed to create order');
            }

            // Razorpay options
            const options = {
                key: orderData.key_id,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: 'Food Store',
                description: 'Food Order Payment',
                order_id: orderData.order.id,
                handler: async function (response) {
                    try {
                        // Verify payment on backend
                        const verifyResponse = await fetch('/api/payment/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        const verifyData = await verifyResponse.json();

                        if (verifyData.success) {
                            onSuccess && onSuccess(verifyData.order);
                        } else {
                            throw new Error(verifyData.message || 'Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        onFailure && onFailure(error.message);
                    }
                },
                prefill: {
                    name: 'Customer',
                    email: 'customer@example.com',
                    contact: '9999999999'
                },
                notes: {
                    address: 'Food Store Order'
                },
                theme: {
                    color: '#3399cc'
                },
                modal: {
                    ondismiss: function() {
                        onFailure && onFailure('Payment cancelled by user');
                    }
                }
            };

            // Load Razorpay script if not already loaded
            if (!window.Razorpay) {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => {
                    const rzp = new window.Razorpay(options);
                    rzp.open();
                };
                script.onerror = () => {
                    onFailure && onFailure('Failed to load payment gateway');
                };
                document.body.appendChild(script);
            } else {
                const rzp = new window.Razorpay(options);
                rzp.open();
            }

        } catch (error) {
            console.error('Payment initiation error:', error);
            onFailure && onFailure(error.message);
        }
    };

    return (
        <Button
            onClick={handlePayment}
            disabled={disabled}
            colorScheme="blue"
            size="lg"
            width="full"
        >
            {children || `Pay ${formatCurrency(convertUSDToINR(amount), 'INR')}`}
        </Button>
    );
};

export default RazorpayPayment;
