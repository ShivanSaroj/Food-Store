import { Box, Flex } from "@chakra-ui/react"
import { Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import CreatePage from "./Pages/CreatePage"
import HomePage from "./Pages/HomePage"
import LoginPage from "./Pages/LoginPage"
import SignupPage from "./Pages/SignupPage"
import CartPage from "./Pages/CartPage"
import OrderHistoryPage from "./Pages/OrderHistoryPage"
import AdminOrdersPage from "./Pages/AdminOrdersPage"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"
import AuthRedirect from "./components/AuthRedirect"
import { useColorModeValue } from "./components/ui/color-mode"
import { useAuthStore } from "./store/auth.jsx"

function App() {
  const { checkAuth } = useAuthStore();

  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Flex direction="column" minH="100vh" bg={useColorModeValue("gray.500", "gray.900")}>
      <NavBar />
      <Box flex="1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute requireAdmin={false}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute requireAdmin={false}>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <AuthRedirect>
                <LoginPage />
              </AuthRedirect>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRedirect>
                <SignupPage />
              </AuthRedirect>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute requireAdmin={true}>
                <CreatePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
      <Footer />
    </Flex>
  )
}

export default App
