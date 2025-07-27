import React, { useState } from 'react';
import {
    Container,
    VStack,
    Box,
    Heading,
    Input,
    Button,
    Text,
    Link as ChakraLink
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useColorModeValue } from '../components/ui/color-mode';
import { useAuthStore } from '../store/auth.jsx';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuthStore();

    const bg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.200');

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        
        // Clear global error
        if (error) {
            clearError();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const result = await login(formData.email, formData.password);
        
        if (result.success) {
            navigate('/');
        }
    };

    return (
        <Container maxW="md" py={12}>
            <VStack spacing={8}>
                <Box
                    w="full"
                    bg={bg}
                    p={8}
                    rounded="lg"
                    shadow="lg"
                >
                    <VStack spacing={6}>
                        <Heading
                            size="lg"
                            bgGradient="to-r"
                            gradientFrom="orange.400"
                            gradientTo="red.600"
                            bgClip="text"
                            textAlign="center"
                        >
                            Login to Food Store
                        </Heading>

                        {error && (
                            <Box bg="red.100" color="red.800" p={3} rounded="md" border="1px solid" borderColor="red.200">
                                {error}
                            </Box>
                        )}

                        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                            <VStack spacing={4}>
                                <Box w="full">
                                    <Text mb={2} fontWeight="medium">Email</Text>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        borderColor={errors.email ? "red.500" : "gray.300"}
                                    />
                                    {errors.email && (
                                        <Text color="red.500" fontSize="sm" mt={1}>
                                            {errors.email}
                                        </Text>
                                    )}
                                </Box>

                                <Box w="full">
                                    <Text mb={2} fontWeight="medium">Password</Text>
                                    <Input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        borderColor={errors.password ? "red.500" : "gray.300"}
                                    />
                                    {errors.password && (
                                        <Text color="red.500" fontSize="sm" mt={1}>
                                            {errors.password}
                                        </Text>
                                    )}
                                </Box>

                                <Button
                                    type="submit"
                                    colorScheme="red"
                                    bgColor="red.400"
                                    w="full"
                                    isLoading={isLoading}
                                    loadingText="Logging in..."
                                >
                                    Login
                                </Button>
                            </VStack>
                        </form>

                        <Text color={textColor} textAlign="center">
                            Don't have an account?{' '}
                            <ChakraLink as={Link} to="/signup" color="red.400" fontWeight="bold">
                                Sign up here
                            </ChakraLink>
                        </Text>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

export default LoginPage;
