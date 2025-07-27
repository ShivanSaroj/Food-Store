import React, { useState, useEffect } from 'react';
import {
    Container,
    VStack,
    Box,
    Heading,
    Text,
    HStack,
    Badge,
    Image,
    Stack
} from '@chakra-ui/react';
import { useColorModeValue } from '../components/ui/color-mode';
import Pagination from '../components/Pagination.jsx';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalOrders: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 10
    });
    
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('gray.600', 'gray.200');

    useEffect(() => {
        loadOrderHistory(1);
    }, []);

    const loadOrderHistory = async (page = 1) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/cart/orders?page=${page}&limit=10`, {
                credentials: 'include'
            });
            const data = await res.json();

            if (data.success) {
                setOrders(data.orders);
                setPagination(data.pagination);
            } else {
                console.error("Failed to load order history:", data.message);
            }
        } catch (error) {
            console.error("Error loading order history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (page) => {
        loadOrderHistory(page);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <Container maxW="800px" py={8}>
                <Text textAlign="center">Loading order history...</Text>
            </Container>
        );
    }

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
                    Order History
                </Heading>

                {orders.length === 0 ? (
                    <Box p={6} textAlign="center">
                        <Text fontSize="lg" color={textColor}>
                            No orders found
                        </Text>
                        <Text fontSize="sm" color={textColor} mt={2}>
                            Start shopping to see your order history here!
                        </Text>
                    </Box>
                ) : (
                    <VStack spacing={6} w="full">
                        {orders.map((order) => (
                            <Box
                                key={order.orderId}
                                w="full"
                                bg={bg}
                                p={6}
                                rounded="lg"
                                shadow="lg"
                                border="1px solid"
                                borderColor={borderColor}
                            >
                                <VStack spacing={4} align="stretch">
                                    {/* Order Header */}
                                    <HStack justify="space-between" wrap="wrap">
                                        <VStack align="start" spacing={1}>
                                            <Text fontWeight="bold" fontSize="lg">
                                                Order #{order.orderId}
                                            </Text>
                                            <Text fontSize="sm" color={textColor}>
                                                {formatDate(order.orderDate)}
                                            </Text>
                                        </VStack>
                                        
                                        <VStack align="end" spacing={1}>
                                            <Badge
                                                colorScheme={order.status === 'completed' ? 'green' : 'orange'}
                                                fontSize="sm"
                                                px={3}
                                                py={1}
                                                rounded="full"
                                            >
                                                {order.status.toUpperCase()}
                                            </Badge>
                                            <Badge
                                                colorScheme={
                                                    order.paymentMethod === 'upi' ? 'blue' :
                                                    order.paymentMethod === 'razorpay' ? 'green' :
                                                    'purple'
                                                }
                                                variant="outline"
                                                fontSize="xs"
                                            >
                                                {
                                                    order.paymentMethod === 'upi' ? 'UPI Payment' :
                                                    order.paymentMethod === 'razorpay' ? 'Online Payment (Razorpay)' :
                                                    'Cash on Counter'
                                                }
                                            </Badge>
                                        </VStack>
                                    </HStack>

                                    {/* Order Items */}
                                    <Box>
                                        <Text fontWeight="semibold" mb={3}>
                                            Items ({order.items.length}):
                                        </Text>
                                        <Stack spacing={3}>
                                            {order.items.map((item, index) => (
                                                <HStack key={index} spacing={4}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        boxSize="50px"
                                                        objectFit="cover"
                                                        rounded="md"
                                                    />
                                                    <VStack align="start" flex="1" spacing={0}>
                                                        <Text fontWeight="medium">
                                                            {item.name}
                                                        </Text>
                                                        <Text fontSize="sm" color={textColor}>
                                                            ${item.price} × {item.quantity}
                                                        </Text>
                                                    </VStack>
                                                    <Text fontWeight="bold" color="green.500">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </Text>
                                                </HStack>
                                            ))}
                                        </Stack>
                                    </Box>

                                    {/* Order Total */}
                                    <Box h="1px" bg={borderColor} w="full" />
                                    <HStack justify="space-between">
                                        <Text fontSize="lg" fontWeight="bold">
                                            Total Amount:
                                        </Text>
                                        <Text fontSize="xl" fontWeight="bold" color="green.500">
                                            ${order.total.toFixed(2)}
                                        </Text>
                                    </HStack>
                                </VStack>
                            </Box>
                        ))}
                    </VStack>
                )}

                {/* Pagination */}
                {orders.length > 0 && (
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                        hasNextPage={pagination.hasNextPage}
                        hasPrevPage={pagination.hasPrevPage}
                        totalItems={pagination.totalOrders}
                        itemsPerPage={pagination.limit}
                    />
                )}
            </VStack>
        </Container>
    );
};

export default OrderHistoryPage;
