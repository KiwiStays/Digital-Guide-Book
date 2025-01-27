
import { Guestmodel } from '../models/Guest.model.js';
import {GuestHistoryModel} from '../models/GuestHistory.model.js';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import app from './app.js';
import dotenv from 'dotenv';
import connectDB from '../db/index.js';
dotenv.config();

app.use(cors());



connectDB(process.env.MONGO_URI).then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`listening on port ${process.env.PORT}`);
    });

})
.catch( (err) =>{
        console.error("Mongoose connection error ",err);
})


// Scheduled Transfer Function
const scheduleGuestTransfer = () => {
    // Function to check and transfer expired guests
    const transfer = async () => {
        try {

            // Get the current date
            const currentDate = new Date();

            // Find guests whose expiry date is more than 7 days ago
            const expiredGuests = await Guestmodel.find({
                checkout: { $lt: new Date(currentDate - 7 * 24 * 60 * 60 * 1000) },
            });

            // Transfer expired guests to GuestHistory and remove them from Guestmodel
            for (const guest of expiredGuests) {
                // await GuestHistoryModel.create(guest.toObject()); // Save guest to history
                const newGuest = new GuestHistoryModel({
                    place_id: guest.place_id,
                    name: guest.name,
                    phone: guest.phone,
                    property_name: guest.property_name,
                    number_of_guests: guest.number_of_guests,
                    Document: guest.Document,
                    checkin: guest.checkin,
                    checkout: guest.checkout,
                });
                await newGuest.save();
                await Guestmodel.findByIdAndDelete(guest._id); // Remove guest from Guests
            }

            if (expiredGuests.length > 0) {
                console.log(`Transferred ${expiredGuests.length} guests to GuestHistory`);
            } else {
                console.log('No guests to transfer');
            }
        } catch (error) {
            console.error('Data transfer failed', error);
        }
    };

    // Schedule the function to run every 24 hours
    setInterval(async () => {
        console.log('Running scheduled guest transfer...');
        await transfer();
    }, 60*60*24*1000); // 24 hours in milliseconds
};

// Start the scheduled transfer
scheduleGuestTransfer();


