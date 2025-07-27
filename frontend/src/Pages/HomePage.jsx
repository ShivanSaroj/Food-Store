import React, { useEffect } from 'react'
import {Container, VStack, Text, SimpleGrid, Box} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../store/product'
import { useCartStore } from '../store/cart.jsx'
import { useAuthStore } from '../store/auth.jsx'
import ProductCard from '../components/ProductCard.jsx'

const HomePage = () => {
  const {fetchProducts, products}= useProductStore()
  const { loadCart, isCartLoaded } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(()=>{
    fetchProducts();
  }, [fetchProducts])

  // Load cart when user is authenticated (only if not already loaded)
  useEffect(() => {
    if (isAuthenticated && !isCartLoaded) {
      console.log("HomePage: Loading cart for authenticated user");
      loadCart();
    }
  }, [isAuthenticated, loadCart, isCartLoaded])

 // console.log("products", products)
  return (
   <Container maxW="1200px" py={12}>
    <VStack spacing={12}>

<Text
 bgGradient="to-r" gradientFrom="orange.500" gradientTo="red.600"
 fontSize={"30px"}
 fontWeight={"bold"}

 textAlign={"center"}
 bgClip="text"
>
Current Products
</Text>

<SimpleGrid
columns={{
  base: 1,
  md: 2,
  lg: 3
}}
spacing={16}
w={"full"}
px={4}
>
  {products.map((product) =>(
    <Box key={product._id} p={2}>
      <ProductCard product={product}/>
    </Box>
  ))}

</SimpleGrid>

 

{products.length===0 && (
   <Text  fontSize='xl' textAlign={"center"} fontWeight={"bold"} color='gray.500'>
     No product Found!!  
     <Link to={"/create"}>

    <Text as='span' color='blue.500' _hover={{textDecoration: "underline"}}>
        Create a product
     </Text>
     </Link>

   </Text> 
)}
    </VStack>
   </Container>
  )
}

export default HomePage
