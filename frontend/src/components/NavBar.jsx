import { Button, Container, Flex, HStack, VStack, Text, Box, Badge } from '@chakra-ui/react'
import { useColorMode, useColorModeValue } from './ui/color-mode';
import { Link, useNavigate } from 'react-router-dom'
import { CiSquarePlus } from "react-icons/ci";
import { LuSun } from "react-icons/lu";
import { IoMoon } from "react-icons/io5";
import { FiLogOut, FiUser, FiShoppingCart, FiList, FiUsers } from "react-icons/fi";
import { useProductStore } from '../store/product.jsx';
import { useAuthStore } from '../store/auth.jsx';
import { useCartStore } from '../store/cart.jsx';

const NavBar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isAuthenticated, user, logout, isAdmin } = useAuthStore();
    const { getCartItemCount } = useCartStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <Container maxW={"1140px"} px={4}>
            <Flex
                h={16}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexDir={{
                    base: "column",
                    sm: "row"
                }}
            >
                <Text
                    bgGradient="to-r"
                    gradientFrom="orange.400"
                    gradientTo="red.600"
                    fontSize={{ base: "22px", sm: "28px" }}
                    fontWeight={"bold"}
                    textTransform={"uppercase"}
                    textAlign={"center"}
                    bgClip="text"
                >
                    <Link to={"/"}> Food Store</Link>
                </Text>

                <HStack spacing={2} alignItems={"center"}>
                    {/* Cart and Orders buttons - only for authenticated non-admin users */}
                    {isAuthenticated && !isAdmin() && (
                        <>
                            <Box position="relative">
                                <Link to="/cart">
                                    <Button bgColor="blue.400" color="white" borderRadius="md" fontWeight={'bolder'}>
                                        <FiShoppingCart />
                                    </Button>
                                </Link>
                                {getCartItemCount() > 0 && (
                                    <Badge
                                        position="absolute"
                                        top="-8px"
                                        right="-8px"
                                        colorScheme="red"
                                        borderRadius="full"
                                        fontSize="xs"
                                        minW="20px"
                                        h="20px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        {getCartItemCount()}
                                    </Badge>
                                )}
                            </Box>

                            <Link to="/orders">
                                <Button bgColor="purple.400" color="white" borderRadius="md" fontWeight={'bolder'}>
                                    <FiList />
                                </Button>
                            </Link>
                        </>
                    )}

                    {/* Show admin buttons only for admin users */}
                    {isAuthenticated && isAdmin() && (
                        <>
                            <Link to={"/create"}>
                                <Button bgColor="red.400" color="white" borderRadius="md" fontWeight={'bolder'}>
                                    <CiSquarePlus />
                                </Button>
                            </Link>

                            <Link to={"/admin/orders"}>
                                <Button bgColor="orange.400" color="white" borderRadius="md" fontWeight={'bolder'}>
                                    <FiUsers />
                                </Button>
                            </Link>
                        </>
                    )}

                    {/* Color mode toggle */}
                    <Button onClick={toggleColorMode} bgColor="red.400" color="white" fontWeight="bold">
                        {colorMode === "light" ? <IoMoon /> : <LuSun size={20} />}
                    </Button>

                    {/* Authentication buttons */}
                    {isAuthenticated ? (
                        <HStack spacing={2}>
                            <Box bg="red.400" color="white" px={3} py={2} rounded="md">
                                <Text fontSize="sm" fontWeight="bold">
                                    {user?.username} ({user?.role === 'admin' ? 'Admin' : 'User'})
                                </Text>
                            </Box>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                colorScheme="red"
                                size="sm"
                            >
                                Logout
                            </Button>
                        </HStack>
                    ) : (
                        <HStack spacing={2}>
                            <Link to="/login">
                                <Button variant="outline" colorScheme="red">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button bgColor="red.400" color="white">
                                    Sign Up
                                </Button>
                            </Link>
                        </HStack>
                    )}
                </HStack>
            </Flex>
        </Container>
    );
};

export default NavBar
