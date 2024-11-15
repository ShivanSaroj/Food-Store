import React from 'react'
import { Box, Heading, HStack, Image,Input, Text, Button, useDisclosure, VStack} from '@chakra-ui/react'
import { useColorModeValue } from "../components/ui/color-mode"
import {FaEdit } from "react-icons/fa";
import {MdDelete } from "react-icons/md"
import { useProductStore } from '../store/product.jsx';
import { useState } from 'react';
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";


const ProductCard = ({product}) => {

    const [isLike, setLike ]=useState(false);

const [updatedProduct, setUpdateProduct]=useState(product)
    const textColor=useColorModeValue("gray.600", "gray.200");
    const bg= useColorModeValue("white", "gray.800");
    //console.log(product.name)

    
    const {deleteProduct, updateProduct}=useProductStore()
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
 Rs.{product.price}
    </Text>
    <HStack wordSpacing={2}>
       
        <Button onClick={() => setLike(!isLike)} bgColor="white" color="red" fontWeight="bold">
        {isLike === false ?<FaRegHeart />  : <FaHeart size={20}/>}
        </Button>

       
        <Button bg={"red.400"} onClick={()=>handleDeleteProduct(product._id)}>
        <MdDelete />
        </Button>
        
      
    </HStack>

</Box>




    </Box>
  )
}

export default ProductCard
