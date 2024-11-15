"use client"
import { Container, Heading, VStack, Box, Input, Button} from '@chakra-ui/react';
import { useColorModeValue } from '../components/ui/color-mode';
import React from 'react'
import { useState } from 'react';
import {useProductStore } from '../store/product.jsx'


const CreatePage = () => {

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
  
    alert('data saved successfully') 
}

setNewProduct({name: "", price: "", image: ""})
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

    />
    <Input
    placeholder='Price'
    name='price'
    value={newProduct.price}
    type='number'
    onChange={(e) =>setNewProduct({...newProduct, price: e.target.value})}

    />
    <Input
    placeholder='Image URL'
    name='image'
    value={newProduct.image}
    onChange={(e) =>setNewProduct({...newProduct, image: e.target.value})}

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