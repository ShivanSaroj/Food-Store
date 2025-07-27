import React, { useEffect } from 'react'
import { Box, Heading, HStack, Image,Input, Text, Button, useDisclosure, VStack} from '@chakra-ui/react'
import { useColorModeValue } from "../components/ui/color-mode"
import {FaEdit } from "react-icons/fa";
import {MdDelete } from "react-icons/md"
import { FaShoppingCart } from "react-icons/fa";
import { useProductStore } from '../store/product.jsx';
import { useAuthStore } from '../store/auth.jsx';
import { useCartStore } from '../store/cart.jsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


const ProductCard = ({product}) => {

const [updatedProduct, setUpdateProduct]=useState(product)
    const textColor=useColorModeValue("gray.600", "gray.200");
    const bg= useColorModeValue("white", "gray.800");
    //console.log(product.name)


    const {deleteProduct, updateProduct}=useProductStore();
    const { isAdmin, isAuthenticated } = useAuthStore();
    const { addToCart, cartItems, loadCart, isLoading, isCartLoaded } = useCartStore();
    const navigate = useNavigate();
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // Check if this product is already in cart
    const isInCart = cartItems.some(item => item._id === product._id);

    // Load cart when component mounts and user is authenticated
    useEffect(() => {
        if (isAuthenticated && !isCartLoaded && cartItems.length === 0) {
            console.log(`ProductCard: Loading cart for authenticated user (not loaded yet)`);
            loadCart();
        }
    }, [isAuthenticated, loadCart, cartItems.length, isCartLoaded]);

    
    // Handle add to cart with authentication check
    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            // Redirect to login if not authenticated
            navigate('/login');
            return;
        }

        // Don't allow adding if already in cart
        if (isInCart) {
            console.log("Item already in cart, ignoring click");
            return;
        }

        console.log(`Adding ${product.name} to cart...`);
        setIsAddingToCart(true);
        try {
            await addToCart(product);
            console.log("Add to cart completed for:", product.name);
        } finally {
            setIsAddingToCart(false);
        }
    };
    const handleDeleteProduct = async(pid)=>{
       const {success, message} =await deleteProduct(pid)
       if(!success){
        alert("Error while deleting product")
       }
       else{
        alert('Product deleted successfully')
       }
    }

    
    const handleUpdateProduct = async (pid, updatedProduct)=>{
  const {success, message}=await updateProduct(pid, updateProduct)

onClose();

if(!success){
    alert('Error while updating product')
}
else{
    alert("Product updated successfully!")
}



    }

  return (
    <Box
    shadow={'lg'}
    rounded={'lg'}
    overflow={'hidden'}
    transition={'all 0.3s'}
    _hover={{transform: "translateY(-5px)", shadow: "xl"}}
    bg={bg}
    >


<Image src={product.image} alt={product.name} h={48} w={"full"} objectFit={'cover'} />

<Box p={4}>
    <Heading as='h3' size='md' mb={2}>
{product.name}
    </Heading>
    <Text fontWeight='bold'  fontSize='xl' color={textColor} mb={4}>
 ${product.price}
    </Text>
    <HStack spacing={2}>
        {/* Only show cart button for non-admin users */}
        {!isAdmin() && (
            <Button
                onClick={handleAddToCart}
                bgColor={isAuthenticated && isInCart ? "red.400" : "green.400"}
                color="white"
                fontWeight="bold"
                flex="1"
                leftIcon={<FaShoppingCart />}
                isDisabled={isAuthenticated && isInCart}
                isLoading={isAddingToCart || isLoading}
                loadingText="Adding..."
                _disabled={{
                    bgColor: "red.400",
                    color: "white",
                    opacity: 1
                }}
            >
                {isAuthenticated && isInCart ? "Added to Cart" : "Add to Cart"}
            </Button>
        )}

        {/* Only show delete button for admin users */}
        {isAdmin() && (
            <Button bg={"red.400"} color="white" onClick={()=>handleDeleteProduct(product._id)} flex="1">
                <MdDelete />
            </Button>
        )}
    </HStack>

</Box>




    </Box>
  )
}

export default ProductCard
