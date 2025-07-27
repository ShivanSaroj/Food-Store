import React, { useState } from 'react';
import {
    Container,
    VStack,
    Box,
    Heading,
    Button,
    Text,
    HStack,
    Stack
} from '@chakra-ui/react';
import { useColorModeValue } from '../components/ui/color-mode';
import { useCartStore } from '../store/cart.jsx';
import { useNavigate } from 'react-router-dom';
import Cart from '../components/Cart.jsx';
import RazorpayPayment from '../components/RazorpayPayment.jsx';
import { convertUSDToINR, formatCurrency, formatDualCurrency } from '../utils/currency.js';

const CartPage = () => {
    const { cartItems, getCartTotal, createOrder, clearCart } = useCartStore();
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const navigate = useNavigate();

    const bg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.200');

    const handleOrder = () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        setShowPaymentOptions(true);
    };

    const handlePaymentSuccess = (order) => {
        setShowPaymentOptions(false);

        // Clear the cart explicitly for Razorpay payments
        clearCart();

        alert(`🎉 Payment Successful!\nOrder ${order.orderId} placed successfully!\nYour order has been saved to order history.\n\nRedirecting to home page...`);

        // Redirect to home page after a short delay
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    const handlePaymentFailure = (error) => {
        alert(`❌ Payment Failed\n${error || "Something went wrong with the payment"}`);
    };

    const handleCashPayment = async () => {
        const result = await createOrder('cash');

        if (result.success) {
            setShowPaymentOptions(false);
            alert(`✅ Order Placed!\nOrder ${result.order.orderId} placed successfully!\nYour order has been saved to order history.\nPlease pay cash at the counter when you collect your order.\n\nRedirecting to home page...`);

            // Redirect to home page after a short delay
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } else {
            alert(`❌ Order Failed\n${result.message || "Failed to create order"}`);
        }
    };

    return (
        <Container maxW="800px" py={8}>
            <VStack spacing={8}>
                <Heading
                    size="lg"
                    bgGradient="to-r"
                    gradientFrom="orange.400"
                    gradientTo="red.600"
                    bgClip="text"
                    textAlign="center"
                >
                    Your Cart
                </Heading>

                <Box w="full" bg={bg} rounded="lg" shadow="lg">
                    <Cart />
                </Box>

                {cartItems.length > 0 && !showPaymentOptions && (
                    <Button
                        colorScheme="green"
                        size="lg"
                        w="full"
                        onClick={handleOrder}
                        bgGradient="to-r"
                        gradientFrom="green.400"
                        gradientTo="green.600"
                    >
                        Place Order - ${getCartTotal().toFixed(2)}
                    </Button>
                )}

                {/* Payment Options */}
                {showPaymentOptions && (
                    <Box w="full" bg={bg} p={6} rounded="lg" shadow="lg">
                        <VStack spacing={6}>
                            <Text fontSize="xl" fontWeight="bold">
                                Choose Payment Method
                            </Text>

                            <Text fontWeight="bold" color="green.500">
                                Order Total: {formatDualCurrency(getCartTotal())}
                            </Text>

                            <Stack spacing={4} w="full">
                                <RazorpayPayment
                                    amount={getCartTotal()}
                                    onSuccess={handlePaymentSuccess}
                                    onFailure={handlePaymentFailure}
                                >
                                    Pay Online - {formatCurrency(convertUSDToINR(getCartTotal()), 'INR')}
                                </RazorpayPayment>

                                <Button
                                    colorScheme="orange"
                                    size="lg"
                                    onClick={handleCashPayment}
                                    w="full"
                                >
                                    Cash on Counter
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => setShowPaymentOptions(false)}
                                    w="full"
                                >
                                    Back to Cart
                                </Button>
                            </Stack>
                        </VStack>
                    </Box>
                )}
            </VStack>
        </Container>
    );
};

export default CartPage;
