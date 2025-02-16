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
    deleteAt: { type: Date },
    token: {
        type: String,
    },
    cleaningTime:{
        type: String,
        trim: true,
    },
    otp: { type: String }, // Store the generated OTP
    otpExpiresAt: { type: Date }, // Expiry time for the OTP
});
// Pre-save middleware to calculate deleteAt
Guestschema.pre('save', function (next) {
    try {
        if (this.checkout) {
            // Set deleteAt to checkout + 7 days
            this.deleteAt = new Date(this.checkout.getTime() + 7 * 24 * 60 * 60 * 1000);
        }
        next();
    } catch (e) {
        console.log(e)
    }

});

// Create TTL Index
Guestschema.index({ deleteAt: 1 }, { expireAfterSeconds: 0 });
Guestschema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 });

export const Guestmodel = mongoose.model('Guest', Guestschema); 