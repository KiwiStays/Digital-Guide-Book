import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    // service: "Gmail",
    service: 'gmail',
    // host: "smtp.gmail.com",
    // port: 465,
    // secure: true,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
    },
});
