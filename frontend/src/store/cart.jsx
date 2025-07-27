import { create } from 'zustand';


const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const useCartStore = create((set, get) => ({
    cartItems: [],
    isCartOpen: false,
    isLoading: false,
    isCartLoaded: false, // Flag to track if cart has been loaded

    // Load cart from backend
    loadCart: async () => {
        const { isLoading } = get();

        // Prevent multiple simultaneous loads
        if (isLoading) {
            console.log("Cart is already loading, skipping...");
            return;
        }

        console.log("Loading cart from backend...");
        set({ isLoading: true });
        try {
            const res = await fetch(`${baseUrl}/api/cart`, {
                credentials: 'include' // Ensure cookies are sent
            });
            const data = await res.json();

            if (data.success) {
                console.log("Raw cart data from backend:", data.cart);

                // Transform backend cart format to frontend format
                const cartItems = data.cart.map((item, index) => {
                    console.log(`Transforming item ${index}:`, item);
                    const productId = item.productId || item._id;
                    return {
                        _id: typeof productId === 'object' ? productId.toString() : String(productId),
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: item.quantity
                    };
                });

                console.log("Transformed cart items:", cartItems);
                set({ cartItems, isLoading: false, isCartLoaded: true });
            } else {
                set({ cartItems: [], isLoading: false, isCartLoaded: true });
            }
        } catch (error) {
            console.error("Error loading cart:", error);
            set({ cartItems: [], isLoading: false, isCartLoaded: true });
        }
    },

    // Add item to cart
    addToCart: async (product) => {
        const { cartItems } = get();

        // Check if item already exists
        const existingItem = cartItems.find(item => item._id === product._id);
        if (existingItem) {
            return; // Don't add if already in cart
        }

        try {
            // Optimistically update UI first
            set({
                cartItems: [...cartItems, { ...product, quantity: 1 }]
            });

            const res = await fetch(`${baseUrl}/api/cart/add`, {
                method: "POST",
                credentials: 'include',
                
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                })
            });

            const data = await res.json();

            if (data.success) {
                console.log("Successfully added to cart, backend response:", data.cart);
                // Transform and update cart items from backend response
                const updatedCartItems = data.cart.map((item, index) => {
                    console.log(`Transforming added item ${index}:`, item);
                    const productId = item.productId || item._id;
                    return {
                        _id: typeof productId === 'object' ? productId.toString() : String(productId),
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: item.quantity
                    };
                });
                console.log("Updated cart items after add:", updatedCartItems);
                set({ cartItems: updatedCartItems });
            } else {
                // Revert optimistic update on failure
                set({ cartItems });
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            // Revert optimistic update on error
            set({ cartItems });
        }
    },

    // Remove item from cart
    removeFromCart: async (productId) => {
        try {
            const res = await fetch(`${baseUrl}/api/cart/remove/${productId}`, {
                method: "DELETE"
            });

            const data = await res.json();

            if (data.success) {
                console.log("Item removed successfully, backend response:", data.cart);
                // Transform and update cart items from backend response
                const updatedCartItems = data.cart.map((item, index) => {
                    console.log(`Transforming remaining item ${index}:`, item);
                    const productId = item.productId || item._id;
                    return {
                        _id: typeof productId === 'object' ? productId.toString() : String(productId),
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: item.quantity
                    };
                });
                console.log("Updated cart items after remove:", updatedCartItems);
                set({ cartItems: updatedCartItems });
            }
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    },

    // Update item quantity
    updateQuantity: async (productId, quantity) => {
        try {
            const res = await fetch(`${baseUrl}/api/cart/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId,
                    quantity
                })
            });

            const data = await res.json();

            if (data.success) {
                console.log("Quantity updated successfully, backend response:", data.cart);
                // Transform and update cart items from backend response
                const updatedCartItems = data.cart.map((item, index) => {
                    console.log(`Transforming updated item ${index}:`, item);
                    const productId = item.productId || item._id;
                    return {
                        _id: typeof productId === 'object' ? productId.toString() : String(productId),
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: item.quantity
                    };
                });
                console.log("Updated cart items after quantity change:", updatedCartItems);
                set({ cartItems: updatedCartItems });
            }
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    },

    // Clear cart
    clearCart: async () => {
        try {
            const res = await fetch(`${baseUrl}/api/cart/clear`, {
                method: "DELETE"
            });

            const data = await res.json();

            if (data.success) {
                set({ cartItems: [] });
            }
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    },

    // Create order
    createOrder: async (paymentMethod) => {
        try {
            const res = await fetch(`${baseUrl}/api/cart/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ paymentMethod })
            });

            const data = await res.json();

            if (data.success) {
                set({ cartItems: [] });
                return { success: true, order: data.order };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Error creating order:", error);
            return { success: false, message: "Network error" };
        }
    },

    // Toggle cart visibility
    toggleCart: () => {
        set(state => ({ isCartOpen: !state.isCartOpen }));
    },

    // Close cart
    closeCart: () => {
        set({ isCartOpen: false });
    },

    // Get cart total
    getCartTotal: () => {
        const { cartItems } = get();
        return cartItems.reduce((total, item) => {
            return total + (parseFloat(item.price) * item.quantity);
        }, 0);
    },

    // Get cart item count
    getCartItemCount: () => {
        const { cartItems } = get();
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }
}));
