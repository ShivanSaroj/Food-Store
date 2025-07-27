import User from "../models/user.model.js";

// Get user's cart
export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('cart.productId');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            cart: user.cart
        });
    } catch (error) {
        console.error("Error in getCart:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const { productId, name, price, image } = req.body;

        if (!productId || !name || !price || !image) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if item already exists in cart
        const existingItemIndex = user.cart.findIndex(
            item => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Item exists, increase quantity
            user.cart[existingItemIndex].quantity += 1;
        } else {
            // New item, add to cart
            user.cart.push({
                productId,
                name,
                price,
                image,
                quantity: 1
            });
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Item added to cart",
            cart: user.cart
        });
    } catch (error) {
        console.error("Error in addToCart:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || quantity < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid data"
            });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (quantity === 0) {
            // Remove item from cart
            user.cart = user.cart.filter(
                item => item.productId.toString() !== productId
            );
        } else {
            // Update quantity
            const itemIndex = user.cart.findIndex(
                item => item.productId.toString() === productId
            );
            
            if (itemIndex > -1) {
                user.cart[itemIndex].quantity = quantity;
            }
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: user.cart
        });
    } catch (error) {
        console.error("Error in updateCartItem:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.cart = user.cart.filter(
            item => item.productId.toString() !== productId
        );

        await user.save();

        res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cart: user.cart
        });
    } catch (error) {
        console.error("Error in removeFromCart:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Clear cart
export const clearCart = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.cart = [];
        await user.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared",
            cart: []
        });
    } catch (error) {
        console.error("Error in clearCart:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Create order from cart
export const createOrder = async (req, res) => {
    try {
        const { paymentMethod } = req.body;

        if (!paymentMethod || !["upi", "cash"].includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method"
            });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // Calculate total
        const total = user.cart.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Generate order ID
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Create order
        const order = {
            orderId,
            items: [...user.cart],
            total,
            paymentMethod,
            status: "completed",
            orderDate: new Date()
        };

        // Add to order history
        user.orderHistory.push(order);

        // Clear cart
        user.cart = [];

        await user.save();

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order
        });
    } catch (error) {
        console.error("Error in createOrder:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Get order history with pagination
export const getOrderHistory = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Get pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Sort orders by date (newest first)
        const sortedOrders = user.orderHistory.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        // Apply pagination
        const paginatedOrders = sortedOrders.slice(skip, skip + limit);
        const totalOrders = sortedOrders.length;
        const totalPages = Math.ceil(totalOrders / limit);

        res.status(200).json({
            success: true,
            orders: paginatedOrders,
            pagination: {
                currentPage: page,
                totalPages,
                totalOrders,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                limit
            }
        });
    } catch (error) {
        console.error("Error in getOrderHistory:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Get all orders (Admin only) with pagination
export const getAllOrders = async (req, res) => {
    try {
        // Check if user is admin
        console.log("req: "+ req)
        const user = await User.findById(req.userId);
        console.log(user)
        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        // Get pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get all users with their order history
        const users = await User.find({}, {
            username: 1,
            email: 1,
            orderHistory: 1
        });

        // Flatten all orders and add user info
        const allOrders = [];
        users.forEach(user => {
            user.orderHistory.forEach(order => {
                allOrders.push({
                    ...order.toObject(),
                    customerInfo: {
                        userId: user._id,
                        username: user.username,
                        email: user.email
                    }
                });
            });
        });

        // Sort by order date (newest first)
        allOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        // Apply pagination
        const paginatedOrders = allOrders.slice(skip, skip + limit);
        const totalOrders = allOrders.length;
        const totalPages = Math.ceil(totalOrders / limit);
        const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);

        res.status(200).json({
            success: true,
            orders: paginatedOrders,
            pagination: {
                currentPage: page,
                totalPages,
                totalOrders,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                limit
            },
            totalRevenue
        });
    } catch (error) {
        console.error("Error in getAllOrders:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
