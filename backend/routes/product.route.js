import express from "express";

import { createProduct, deleteProduct, getProducts, updateProduct } from "../controller/product.controller.js";
import { requireAdmin, optionalAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public route - anyone can view products
router.get("/", getProducts);

// Protected routes - only admin can create, update, and delete products
router.post("/", requireAdmin, createProduct);
router.put("/:id", requireAdmin, updateProduct);
router.delete("/:id", requireAdmin, deleteProduct);

export default router;