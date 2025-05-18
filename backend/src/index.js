
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


// Scheduled Transfer Function
// const scheduleGuestTransfer = () => {
//     // Function to check and transfer expired guests
//     const transfer = async () => {
//         try {

//             // Get the current date
//             const currentDate = new Date();

//             // Find guests whose expiry date is more than 7 days ago
//             const expiredGuests = await Guestmodel.find({
//                 checkout: { $lt: new Date(currentDate - 7 * 24 * 60 * 60 * 1000) },
//             });

//             // Transfer expired guests to GuestHistory and remove them from Guestmodel
//             for (const guest of expiredGuests) {
//                 // await GuestHistoryModel.create(guest.toObject()); // Save guest to history
//                 const newGuest = new GuestHistoryModel({
//                     place_id: guest.place_id,
//                     name: guest.name,
//                     phone: guest.phone,
//                     property_name: guest.property_name,
//                     number_of_guests: guest.number_of_guests,
//                     Document: guest.Document,
//                     checkin: guest.checkin,
//                     checkout: guest.checkout,
//                 });
//                 await newGuest.save();
//                 await Guestmodel.findByIdAndDelete(guest._id); // Remove guest from Guests
//             }

//             if (expiredGuests.length > 0) {
//                 console.log(`Transferred ${expiredGuests.length} guests to GuestHistory`);
//             } else {
//                 console.log('No guests to transfer');
//             }
//         } catch (error) {
//             console.error('Data transfer failed', error);
//         }
//     };

//     // Schedule the function to run every 24 hours
//     setInterval(async () => {
//         console.log('Running scheduled guest transfer...');
//         await transfer();
//     }, 60*60*24*1000); // 24 hours in milliseconds
// };

// // Start the scheduled transfer
// scheduleGuestTransfer();




// Define the guest transfer logic
// Define the guest transfer logic
// const transferExpiredGuests = async () => {
//     try {
//         const currentDate = new Date();

//         const expiredGuests = await Guestmodel.find({
//             checkout: {
//                 $lt: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000),
//             },
//         });

//         console.log(`Found ${expiredGuests.length} expired guests to transfer`);

//         for (const guest of expiredGuests) {
//             try {
//                 console.log(`Transferring guest: ${guest.name}, ID: ${guest._id}`);

//                 const historyData = {
//                     place_id: guest.place_id,
//                     name: guest.name,
//                     phone: guest.phone,
//                     property_name: guest.property_name,
//                     number_of_guests: guest.number_of_guests,
//                     Document: guest.Document ? guest.Document.map(doc => ({
//                         name: doc.name,
//                         age: doc.age || null,
//                         gender: doc.gender || '',
//                         idcard: doc.idcard || '',
//                         file: doc.file || ''
//                     })) : [],
//                     checkin: guest.checkin,
//                     checkout: guest.checkout,
//                 };

//                 console.log('Creating history record with data:', JSON.stringify(historyData));

//                 const newGuest = new GuestHistoryModel(historyData);
//                 const savedGuest = await newGuest.save();

//                 console.log(`Successfully saved to history with ID: ${savedGuest._id}`);
//                 await Guestmodel.findByIdAndDelete(guest._id);
//                 console.log(`Deleted original guest record with ID: ${guest._id}`);
//             } catch (guestError) {
//                 console.error(`Error transferring guest ${guest._id}:`, guestError);
//                 // Continue with next guest even if one fails
//             }
//         }

//         if (expiredGuests.length > 0) {
//             console.log(`Transferred ${expiredGuests.length} guests to GuestHistory`);
//         } else {
//             console.log('No guests to transfer at this time.');
//         }
//     } catch (error) {
//         console.error('Data transfer failed:', error);
//     }
// };

// // Schedule the task to run every day at 12:00 AM
// cron.schedule('0 0 * * *', async () => {
//     console.log('Running guest transfer job at midnight...');
//     await transferExpiredGuests();
// });
