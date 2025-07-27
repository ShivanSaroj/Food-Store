import React from 'react';
import { Navigate } from 'react-router-dom';
import { Container, VStack, Text, Button, Box, Heading } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useColorModeValue } from './ui/color-mode';
import { useAuthStore } from '../store/auth.jsx';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, user, isLoading } = useAuthStore();
    const bg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.200');

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <Container maxW="md" py={12}>
                <VStack spacing={8}>
                    <Box
                        w="full"
                        bg={bg}
                        p={8}
                        rounded="lg"
                        shadow="lg"
                        textAlign="center"
                    >
                        <Text>Loading...</Text>
                    </Box>
                </VStack>
            </Container>
        );
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If admin is required but user is not admin, show access denied
    if (requireAdmin && user?.role !== 'admin') {
        return (
            <Container maxW="md" py={12}>
                <VStack spacing={8}>
                    <Box
                        w="full"
                        bg={bg}
                        p={8}
                        rounded="lg"
                        shadow="lg"
                        textAlign="center"
                    >
                        <VStack spacing={6}>
                            <Heading
                                size="lg"
                                bgGradient="to-r"
                                gradientFrom="orange.400"
                                gradientTo="red.600"
                                bgClip="text"
                            >
                                Access Denied
                            </Heading>
                            
                            <Text color={textColor} fontSize="lg">
                                You need admin privileges to access this page.
                            </Text>
                            
                            <Text color={textColor}>
                                Current role: <strong>{user?.role || 'Unknown'}</strong>
                            </Text>
                            
                            <VStack spacing={3}>
                                <Button
                                    as={Link}
                                    to="/"
                                    colorScheme="red"
                                    bgColor="red.400"
                                    size="lg"
                                >
                                    Go to Home
                                </Button>
                                
                                <Text color={textColor} fontSize="sm">
                                    Contact an administrator to request admin access.
                                </Text>
                            </VStack>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        );
    }

    // If all checks pass, render the protected component
    return children;
};

export default ProtectedRoute;
