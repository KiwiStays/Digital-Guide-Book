
import { Guestmodel } from '../models/Guest.model.js';
import { GuestHistoryModel } from '../models/GuestHistory.model.js';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import app from './app.js';
import dotenv from 'dotenv';
import connectDB from '../db/index.js';
import { fetchRentalwiseGuests } from '../controllers/RentalwiseGuest.controller.js';

import cron from 'node-cron';
dotenv.config();

app.use(cors());



connectDB(process.env.MONGO_URI).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`listening on port ${process.env.PORT}`);
        // setTimeout(async()=>{
        //     console.log("fetching guests from rentalwise");
        //     try{
        //         await  fetchRentalwiseGuests();
        //         console.log("Fetched guests from rentalwise successfully");

        //     }
        //     catch(err){
        //         console.error("Error fetching guests from rentalwise", err);
        //     }
        // },4000);
    });

})
    .catch((err) => {
        console.error("Mongoose connection error ", err);
    })

