import express from 'express';
import cors from 'cors';
import  { v2 as cloudinary } from 'cloudinary';
import Guestrouter from '../routes/guest.route.js';
import PropertyRouter from "../routes/Property.route.js";
import AuthRouter from "../routes/Auth.route.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET, 
});


app.use("/api/guest", Guestrouter);
app.use("/api/admin", PropertyRouter);
app.use("/api/auth/", AuthRouter);



app.get('/', async (req, res) => {
    res.send('Hello World!');
})


export default app;