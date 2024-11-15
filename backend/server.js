import express from 'express';
import dotenv  from 'dotenv'
import { connectDB } from './config/db.js';
import Product from './models/product.model.js';
import mongoose from 'mongoose';
import productRoutes from './routes/product.route.js'

dotenv.config();

const app = express();
app.use(express.json());
//allows us to express data

app.use("/api/products",productRoutes )
app.listen(5000, ()=>{

    connectDB()
    console.log("server started at http://localhost:5000");


})




//rasQrrmTb1mz78dd