import mongoose, { Schema } from "mongoose";

const Guestschema = new Schema({
    place_id: {
        type: String,
    },
    name: {
        type: String,
    },
    phone: {
        type: Number,
    },
    property_name: {
        type: String,
    },
    number_of_guests: {
        type: Number,
    },
    Document: [{
        name: {
            type: String,
        },
        age: {
            type: Number,
        },
        gender: {
            type: String,

        },
        idcard: {
            type: String,
        },
        file: {
            type: String,
        }
    }],
    checkin: {
        type: Date,
    },
    checkout: {
        type: Date,
    },
    token: {
        type: String,
    },
    cleaningTime:{
        type: String,
        trim: true,
    },
    answers:[String],
    otp: { type: String }, // Store the generated OTP
    otpExpiresAt: { type: Date }, // Expiry time for the OTP
},
{ 
    timestamps: true 
});
// Pre-save middleware to calculate deleteAt


// Create TTL Index


export const Guestmodel = mongoose.model('Guest', Guestschema); 
