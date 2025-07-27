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

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    });
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { signup, isLoading, error, clearError } = useAuthStore();

    const bg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.200');

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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

        const result = await signup(
            formData.username,
            formData.email,
            formData.password,
            formData.role
        );
        
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
                            Join Food Store
                        </Heading>

                        {error && (
                            <Box bg="red.100" color="red.800" p={3} rounded="md" border="1px solid" borderColor="red.200">
                                {error}
                            </Box>
                        )}

                        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                            <VStack spacing={4}>
                                <Box w="full">
                                    <Text mb={2} fontWeight="medium">Username</Text>
                                    <Input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Enter your username"
                                        borderColor={errors.username ? "red.500" : "gray.300"}
                                    />
                                    {errors.username && (
                                        <Text color="red.500" fontSize="sm" mt={1}>
                                            {errors.username}
                                        </Text>
                                    )}
                                </Box>

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

                                <Box w="full">
                                    <Text mb={2} fontWeight="medium">Confirm Password</Text>
                                    <Input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        borderColor={errors.confirmPassword ? "red.500" : "gray.300"}
                                    />
                                    {errors.confirmPassword && (
                                        <Text color="red.500" fontSize="sm" mt={1}>
                                            {errors.confirmPassword}
                                        </Text>
                                    )}
                                </Box>

                                <Box w="full">
                                    <Text mb={2} fontWeight="medium">Role</Text>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '6px',
                                            fontSize: '16px',
                                            backgroundColor: 'white'
                                        }}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </Box>

                                <Button
                                    type="submit"
                                    colorScheme="red"
                                    bgColor="red.400"
                                    w="full"
                                    isLoading={isLoading}
                                    loadingText="Creating account..."
                                >
                                    Sign Up
                                </Button>
                            </VStack>
                        </form>

                        <Text color={textColor} textAlign="center">
                            Already have an account?{' '}
                            <ChakraLink as={Link} to="/login" color="red.400" fontWeight="bold">
                                Login here
                            </ChakraLink>
                        </Text>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

export default SignupPage;
