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
    Stack,
    SimpleGrid
} from '@chakra-ui/react';
import { useColorModeValue } from '../components/ui/color-mode';
import Pagination from '../components/Pagination.jsx';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });
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
        loadAllOrders(1);
    }, []);

    const loadAllOrders = async (page = 1) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/admin/orders?page=${page}&limit=10`, {
                credentials: 'include'
            });

            const data = await res.json();
            console.log(data)

            if (data.success) {
                setOrders(data.orders);
                setPagination(data.pagination);
                setStats({
                    totalOrders: data.pagination.totalOrders,
                    totalRevenue: data.totalRevenue
                });
            } else {
                console.error("Failed to load orders:", data.message);
            }
        } catch (error) {
            console.error("Error loading orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (page) => {
        loadAllOrders(page);
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
            <Container maxW="1200px" py={8}>
                <Text textAlign="center">Loading all orders...</Text>
            </Container>
        );
    }

    return (
        <Container maxW="1200px" py={8}>
            <VStack spacing={8}>
                <Heading
                    size="lg"
                    bgGradient="to-r"
                    gradientFrom="orange.400"
                    gradientTo="red.600"
                    bgClip="text"
                    textAlign="center"
                >
                    Admin - All Customer Orders
                </Heading>

                {/* Statistics */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                    <Box
                        p={6}
                        bg={bg}
                        border="1px solid"
                        borderColor={borderColor}
                        rounded="lg"
                        textAlign="center"
                    >
                        <VStack spacing={2}>
                            <Text fontSize="sm" color={textColor} fontWeight="medium">
                                Total Orders
                            </Text>
                            <Text fontSize="3xl" fontWeight="bold" color="blue.500">
                                {stats.totalOrders}
                            </Text>
                            <Text fontSize="xs" color={textColor}>
                                All time orders
                            </Text>
                        </VStack>
                    </Box>

                    <Box
                        p={6}
                        bg={bg}
                        border="1px solid"
                        borderColor={borderColor}
                        rounded="lg"
                        textAlign="center"
                    >
                        <VStack spacing={2}>
                            <Text fontSize="sm" color={textColor} fontWeight="medium">
                                Total Revenue
                            </Text>
                            <Text fontSize="3xl" fontWeight="bold" color="green.500">
                                ${stats.totalRevenue.toFixed(2)}
                            </Text>
                            <Text fontSize="xs" color={textColor}>
                                All time revenue
                            </Text>
                        </VStack>
                    </Box>
                </SimpleGrid>

                {orders.length === 0 ? (
                    <Box p={6} textAlign="center">
                        <Text fontSize="lg" color={textColor}>
                            No orders found
                        </Text>
                    </Box>
                ) : (
                    <VStack spacing={6} w="full">
                        {orders.map((order, index) => (
                            <Box
                                key={`${order.orderId}-${index}`}
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
                                            <Text fontSize="sm" color="blue.500" fontWeight="medium">
                                                Customer: {order.customerInfo.username} ({order.customerInfo.email})
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
                                            {order.items.map((item, itemIndex) => (
                                                <HStack key={itemIndex} spacing={4}>
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

                                    {/* Payment Details for Razorpay */}
                                    {order.paymentMethod === 'razorpay' && order.paymentId && (
                                        <Box>
                                            <Text fontSize="sm" color={textColor}>
                                                Payment ID: {order.paymentId}
                                            </Text>
                                            {order.razorpayOrderId && (
                                                <Text fontSize="sm" color={textColor}>
                                                    Razorpay Order ID: {order.razorpayOrderId}
                                                </Text>
                                            )}
                                        </Box>
                                    )}
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

export default AdminOrdersPage;
