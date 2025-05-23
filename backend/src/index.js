
import { Guestmodel } from '../models/Guest.model.js';
import { GuestHistoryModel } from '../models/GuestHistory.model.js';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import app from './app.js';
import dotenv from 'dotenv';
import connectDB from '../db/index.js';

import cron from 'node-cron';
dotenv.config();

app.use(cors());



connectDB(process.env.MONGO_URI).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`listening on port ${process.env.PORT}`);
    });

})
    .catch((err) => {
        console.error("Mongoose connection error ", err);
    })

