import React from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    Image,
    Badge
} from '@chakra-ui/react';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useColorModeValue } from './ui/color-mode';
import { useCartStore } from '../store/cart.jsx';

const Cart = () => {
    const { 
        cartItems, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        getCartTotal 
    } = useCartStore();

    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('gray.600', 'gray.200');

    if (cartItems.length === 0) {
        return (
            <Box p={6} textAlign="center">
                <Text fontSize="lg" color={textColor}>
                    Your cart is empty
                </Text>
                <Text fontSize="sm" color={textColor} mt={2}>
                    Add some delicious items to get started!
                </Text>
            </Box>
        );
    }

    return (
        <Box p={4}>
            <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                    <Text fontSize="xl" fontWeight="bold">
                        Shopping Cart
                    </Text>
                    <Badge colorScheme="red" fontSize="sm">
                        {cartItems.length} items
                    </Badge>
                </HStack>

                <Box h="1px" bg={borderColor} w="full" />

                {cartItems.map((item) => (
                    <Box
                        key={item._id}
                        p={4}
                        bg={bg}
                        border="1px solid"
                        borderColor={borderColor}
                        rounded="lg"
                    >
                        <HStack spacing={4}>
                            <Image
                                src={item.image}
                                alt={item.name}
                                boxSize="60px"
                                objectFit="cover"
                                rounded="md"
                            />
                            
                            <VStack align="start" flex="1" spacing={1}>
                                <Text fontWeight="bold" fontSize="md">
                                    {item.name}
                                </Text>
                                <Text color={textColor} fontSize="sm">
                                    ${item.price} each
                                </Text>
                            </VStack>

                            <HStack spacing={2}>
                                <Button
                                    size="sm"
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                    isDisabled={item.quantity <= 1}
                                    colorScheme="red"
                                    variant="outline"
                                >
                                    -
                                </Button>
                                <Text minW="40px" textAlign="center" fontWeight="bold">
                                    {item.quantity}
                                </Text>
                                <Button
                                    size="sm"
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                    colorScheme="green"
                                    variant="outline"
                                >
                                    +
                                </Button>
                            </HStack>

                            <VStack spacing={1} align="end">
                                <Text fontWeight="bold" color="green.500">
                                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                </Text>
                                <Button
                                    size="sm"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => removeFromCart(item._id)}
                                >
                                    Remove
                                </Button>
                            </VStack>
                        </HStack>
                    </Box>
                ))}

                <Box h="1px" bg={borderColor} w="full" />

                <HStack justify="space-between" p={4} bg={bg} rounded="lg">
                    <Text fontSize="xl" fontWeight="bold">
                        Total: ${getCartTotal().toFixed(2)}
                    </Text>
                    <Button
                        colorScheme="red"
                        variant="outline"
                        size="sm"
                        onClick={clearCart}
                    >
                        Clear Cart
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default Cart;
