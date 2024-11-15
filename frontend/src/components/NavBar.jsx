import { Button, Container, Flex, HStack, Text } from '@chakra-ui/react'
import { useColorMode, useColorModeValue } from './ui/color-mode';
import { Link } from 'react-router-dom'
import { CiSquarePlus } from "react-icons/ci";
import { LuSun } from "react-icons/lu";
import { IoMoon } from "react-icons/io5";
import { useProductStore } from '../store/product.jsx';

const NavBar = () => {

    const {colorMode,toggleColorMode }=useColorMode();

   
  return (
    
        
     <Container maxW={"1140px"} px={4} >
  <Flex
  h={16}
  alignItems={"center"}
  justifyContent={"space-between"}
  flexDir={{
    base: "column",
    sm:"row"
  }}>
    <Text
    bgGradient="to-r" gradientFrom="orange.400" gradientTo="red.600"
    fontSize={{base: "22px", sm: "28px"}}
    fontWeight={"bold"}

    textTransform={"uppercase"}
    textAlign={"center"}
    bgClip="text"

    >
        <Link to={"/"}> Food Store
        </Link>
    </Text>
    

    <HStack wordSpacing={2} alignItems={"center"}>
        <Link to={"/create"}>
        <Button bgColor="red.400" color="white"  borderRadius="md" fontWeight={'bolder'}>
        <CiSquarePlus />
        </Button></Link>

    <Button onClick={toggleColorMode} bgColor="red.400" color="white" fontWeight="bold">
        {colorMode === "light" ?<IoMoon />  : <LuSun  size={20}/>}

    </Button>
    </HStack>
  </Flex>
     </Container>
    
  )
}

export default NavBar
