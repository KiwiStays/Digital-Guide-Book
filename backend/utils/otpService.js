import  otpGenerator from 'otp-generator';

// Generate a random 6-digit OTP
const generateOTP = () => {
    return otpGenerator.generate(6, { digits: true, alphabets: false, specialChars: false });
};

export const generateOTPService = generateOTP;
