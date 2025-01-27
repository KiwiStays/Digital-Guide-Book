import { Guestmodel } from "../models/Guest.model.js";
import { generateOTPService } from "../utils/otpService.js";
import jwt  from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Adminmodel } from "../models/Admin.mode.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const logout = async (req, res) => {
    try {
        await Guestmodel.findByIdAndUpdate({ _id: req.guestId }, { token: null });
        res.status(200).json({ message: "Logged out successfully" });

    } catch (err) {
        res.json({ message: err.message })
    }
};

export const login = async (req, res) => {
    const { phoneNumber } = req.body;
    try {
        const guest = await Guestmodel.findOne({ phone: phoneNumber });
        if (!guest) {
            return res.status(404).json({ message: 'guest not found. Please register first.' });
        }

        // Check if the current date is within the valid session period
        // if (new Date() <= new Date(guest.checkout) && guest.token) {
        //     return res.status(200).json({ message: 'guest is already logged in.', token: guest.token });
        // }
        // Generate OTP
        const otp = generateOTPService();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

        // Update guest with OTP
        guest.otp = otp;
        guest.otpExpiresAt = otpExpiresAt;
        await guest.save();
        // Here, you'd send the OTP via SMS (mocking this for now)
        console.log(`OTP for ${phoneNumber}: ${otp}`);

        res.status(200).json({ message: 'OTP sent successfully.' });

    }
    catch (err) {
        res.status(500).json({ message: 'Error sending OTP', error: err.message });
    }
};


export const verifyOTP = async (req, res) => {
    const { phoneNumber, otp } = req.body;
    console.log("Phone Number:", phoneNumber);
    console.log("OTP:", otp);

    try {
        // Check if guest exists
        const guest = await Guestmodel.findOne({ phone: phoneNumber });

        if (!guest) {
            return res.status(404).json({ message: 'Guest not found.' });
        }

        // Validate OTP
        if (guest.otp !== otp || guest.otpExpiresAt < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        // Generate JWT token with expiration based on the checkout date
        const expiresIn = Math.floor(new Date(guest.checkout).getTime() / 1000) - Math.floor(Date.now() / 1000);
        // const expiresIn = 10; // Token will expire in 10 seconds
        const token = jwt.sign(
          { guestId: guest._id, name: guest.name },
          JWT_SECRET,
          { expiresIn } // Pass the duration directly, not an absolute timestamp
        );
        
        // Save token and clear OTP
        guest.token = token;
        guest.otp = null;
        guest.otpExpiresAt = null;
        await guest.save();

        // Return guest and token to frontend
        res.status(200).json({
            message: 'Login successful.',
            data: {
                guest: {
                    place_id: guest.place_id,
                    id: guest._id,
                    name: guest.name,
                    phone: guest.phone,
                    checkout: guest.checkout,
                },
                token,
            },
        });
    } catch (err) {
        console.log("Error:", err.message);
        res.status(500).json({ message: 'Error verifying OTP', error: err.message });
    }
};


export const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }
    
    // console.log("Token received:", token);
    
    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET )
        
        const guest = await Guestmodel.findById(decoded.guestId || decoded.userId);
            // console.log("Guest found:", guest);
    
            if (!guest) {
                return res.status(404).json({ message: 'Guest not found.' });
            }
    
            req.guest = guest;
            next();
            // console.log("Decoded token:", decoded);
        
      
        
      
    } catch (err) {
        console.error("Error during verification:", err.message);
        return res.status(401).json({ message: 'Invalid token.', error: err.message });
    }
};


export  const RegisterAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log("Email:", email);
        console.log("Password:", password);
    
        // Check if user already exists
        const existingUser = await Adminmodel.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }
    
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        // Create new user
        const newUser = new Adminmodel({
          email,
          password: hashedPassword
        });
    
        // Save user to database
        await newUser.save();
    
        // Generate JWT token
        const token = jwt.sign(
          { userId: newUser._id }, 
          process.env.JWT_SECRET, 
          { expiresIn: '1h' }
        );
        console.log('Token:', token); 
    
        res.status(201).json({ 
          message: 'User registered successfully', 
          token 
        });
      } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
      }
};

export const loginAdmin = async(req, res) => {
    try {
        const { email, password } = req.body;
    
        // Find user by email
        const user = await Adminmodel.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
    
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
    
        // Generate JWT token
        const token = jwt.sign(
          { userId: user._id }, 
          process.env.JWT_SECRET, 
          { expiresIn: '1h' }
        );
    
        res.status(200).json({ 
          message: 'Login successful', 
          token 
        });
      } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
      }
};

export const verifyAdminToken= async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};