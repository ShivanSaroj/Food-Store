import React, { useEffect } from 'react'
import {Container, VStack, Text, SimpleGrid} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../store/product'
import ProductCard from '../components/ProductCard.jsx'
const HomePage = () => {
  const {fetchProducts, products}= useProductStore()
  useEffect(()=>{
    fetchProducts();

  }, [fetchProducts])

 // console.log("products", products)
  return (
   <Container  py={12}>
    <VStack wordSpacing={8}>

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
  md:2,
  lg:3
}} wordSpacing={10} w={"full"}
gridGap={10}
>
  {products.map((product) =>(
    <ProductCard key={product._id} product={product}/>
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
