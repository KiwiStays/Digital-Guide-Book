import mongoose from "mongoose";
import { Schema } from "mongoose";

const RentalwiseGuestSchema = new Schema({
    Name: {
        type:String,
        trim: true,
        // required: true,
    },
    Phone: {
        type: String,
        trim: true,
        // required: true,
    },
    bookingId: {
        type: String,
        trim: true,
        // required: true,
    },
    propertyName: {
        type: String,
        trim: true,
        // required: true,
    },
    property_id:{
        type: String,
        trim: true,
        // required: true,
    },
    checkIn: {
        type: Date,
        // required: true,
    },
    checkOut: {
        type: Date,
        // required: true,
    },
    totalAmount: {
        type: Number,
        // required: true,
    },
    balanceAmount: {
        type: Number,
        // required: true,
    },
    balanceAmountLink:{
        type: String,
        // trim: true,
    },
    channel:{
        type:String,
        trim: true,
    },
    brochure_url:{
        type: String,
        trim: true,
    },
    summary_url:{
        type: String,
        trim: true,
    },
    calendar_url:{
        type: String,
        trim: true,
    },   
},{
    timestamps: true,
    
});

export const RentalwiseGuest = mongoose.model("RentalwiseGuest", RentalwiseGuestSchema);
