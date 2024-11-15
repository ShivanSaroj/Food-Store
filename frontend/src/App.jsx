import {Box, Button } from "@chakra-ui/react"
import {Route, Routes} from 'react-router-dom'
import CreatePage from "./Pages/CreatePage"
import HomePage from "./Pages/HomePage"
import NavBar from "./components/NavBar"
import { useColorModeValue } from "./components/ui/color-mode"
import { useProductStore } from "./store/product.jsx"

function App() {
  
  
  return (
    <Box minH = {"100vh"} bg={useColorModeValue("gray.500", "gray.900")}>
      <NavBar/>
    <Routes>
      <Route path="/" element= {<HomePage/>}/>
      <Route path="/create" element= {<CreatePage/>}/>
    </Routes>
    </Box>
  )
}

export default App
