import express from "express";

import { createProduct, deleteProduct, getProducts, updateProduct } from "../controller/product.controller.js";
const router = express.Router();

router.get("/", getProducts)
router.post("/", createProduct);
//console.log(process.env.MONGO_URI)

//

router.put("/:id",updateProduct)

router.delete("/:id", deleteProduct)
export default router;