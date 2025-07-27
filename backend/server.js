import express from 'express';
import dotenv  from 'dotenv'
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import Product from './models/product.model.js';
import mongoose from 'mongoose';
import productRoutes from './routes/product.route.js'
import authRoutes from './routes/auth.route.js'
import cartRoutes from './routes/cart.route.js'
import paymentRoutes from './routes/payment.route.js'
import cors from 'cors';

dotenv.config();



const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173" || "https://food-store-nf9c.onrender.com" ,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
//allows us to express data

app.use("/api/products",productRoutes );
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.listen(process.env.PORT || 5000, '0.0.0.0', ()=>{

    connectDB()
    console.log("server started at http://localhost:5000");


})




//rasQrrmTb1mz78dd