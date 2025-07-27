import React from 'react';
import { Navigate } from 'react-router-dom';
import { Container, VStack, Text, Box } from '@chakra-ui/react';
import { useColorModeValue } from './ui/color-mode';
import { useAuthStore } from '../store/auth.jsx';

const AuthRedirect = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthStore();
    const bg = useColorModeValue('white', 'gray.800');

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

    // If user is already authenticated, redirect to home page
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // If not authenticated, render the auth page (login/signup)
    return children;
};

export default AuthRedirect;
