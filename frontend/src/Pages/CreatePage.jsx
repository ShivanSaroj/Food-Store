"use client"
import { Container, Heading, VStack, Box, Input, Button, Text} from '@chakra-ui/react';
import { useColorModeValue } from '../components/ui/color-mode';
import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useProductStore } from '../store/product.jsx'


const CreatePage = () => {
    const navigate = useNavigate();

    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        image: "",
    });

const {createProduct} = useProductStore();

const handleAddProduct = async() => {

    const {success, message} = await createProduct(newProduct);

  if(!success){
    alert('Error while processing data')
  }
  else{
    alert('Product added successfully!');
    setNewProduct({name: "", price: "", image: ""});
    navigate('/');
  }
}

  return ( 
   <Container maxW={"lg"}>
    <VStack wordSpacing={8}
    >
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
Create New Product
        </Heading>

        <Box
        w={"full"} bg={useColorModeValue("white", "gray.800")}
        p={6} rounded={"lg"} shadow={"md"}
       
        >
            <VStack wordSpacing={4}>

    <Input
        placeholder='Product Name'
        name='name'
        value={newProduct.name}
        onChange={(e) =>setNewProduct({...newProduct, name: e.target.value})}
        w="full"
    />
    <Box position="relative" w="full">
        <Text
            position="absolute"
            left="12px"
            top="50%"
            transform="translateY(-50%)"
            color="gray.500"
            fontWeight="bold"
            zIndex="1"
            pointerEvents="none"
        >
            $
        </Text>
        <Input
            placeholder='Enter price in dollars'
            name='price'
            value={newProduct.price}
            type='number'
            step='0.01'
            min='0'
            onChange={(e) =>setNewProduct({...newProduct, price: e.target.value})}
            paddingLeft='2rem'
            w="full"
        />
    </Box>
    <Input
        placeholder='Image URL'
        name='image'
        value={newProduct.image}
        onChange={(e) =>setNewProduct({...newProduct, image: e.target.value})}
        w="full"
    />
<Button colorScheme={"red"} bgColor={"red.400"} onClick={handleAddProduct} w={"full"}>
    Add Product
</Button>

            </VStack>

        </Box>

    </VStack>

   </Container>
   

  )

}

export default CreatePage
//1:29:35