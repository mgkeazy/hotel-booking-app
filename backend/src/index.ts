import express,{Request,Response} from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRoutes from './routes/users';
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import "dotenv/config";
import mongoose from 'mongoose';
import path from 'path';
import {v2 as cloudinary} from 'cloudinary';
import myHotelRoutes from './routes/my-hotels';

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


const app = express();
app.use(cookieParser());

//convert the body of api requests into json
app.use(express.json());



// by default value is undefined so we typecasted it as string
mongoose.connect(process.env.MONGODB_CONNECT as string);


//used to parse incoming requests with URL-encoded payloads. When extended is set to true, the qs library is used to parse the URL-encoded data, allowing for more complex data structures to be represented in the URL-encoded data.
app.use(express.urlencoded({extended:true}));


// for security purpose
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
}));

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/my-hotels",myHotelRoutes);

app.get("*",(req:Request, res:Response)=>{
    res.sendFile(path.join(__dirname,'../../frontend/dist/index.html'))
})


app.listen(7000,()=>{
    console.log('Server running on PORT:7000');
});