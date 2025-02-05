import React, { useState, useContext } from 'react';
import { AuthContext } from '../Context/Authcontext';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { ArrowRight, Palmtree } from "lucide-react"

const backend_url = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const { auth_login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        if (!phoneNumber || phoneNumber.trim() === '') {
            alert('Phone number is required.');
            return;
        }
    
        try {
            const response = await fetch(`${backend_url}/api/auth/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ phoneNumber }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert(data.message); // OTP sent successfully
                setStep(2); // Move to the OTP input step
            } else {
                // Handle errors gracefully
                alert(data.message || 'Failed to send OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Failed to connect to the server. Please check your internet connection.');
        }
    };
    

    const handleVerifyOtp = async () => {
        try {
            const response = await fetch(`${backend_url}/api/auth/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, otp }),
            });
            const data = await response.json();
            // console.log(response);
            // console.log(data.data);
            // console.log(data.data.place_id);
            if (response.ok) {
                auth_login(data.data.token, data.data.guest.name, data.data.guest.id,data.data.guest.place_id);
                alert('Login successful.');
                navigate('/dashboard');
            } else {
                // console.log(data.message);
                alert(data.message);
            }
        } catch (err) {
            console.log(err);
            alert('Error verifying OTP.');
        }
    };

    return (
      <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed p-4"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1515404929826-76fff9fef6fe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/40 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-primarytext to-primarytext p-8 relative overflow-hidden">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"
          />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"
          />
          <div className="flex items-center justify-between relative z-10">
            <h1 className="text-4xl font-bold text-white">Login</h1>
            <Palmtree className="text-white w-10 h-10" />
          </div>
        </div>
        <div className="p-8 space-y-6">
          {step === 1 ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primarytext" />
                <input
                  type="text"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border-2 border-primarytext/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primarytext focus:border-transparent transition-all duration-300 bg-white/70"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSendOtp}
                className="w-full px-4 py-3 bg-gradient-to-r from-primarytext to-primarytext text-white font-semibold rounded-lg shadow-md hover:from-primarytext hover:to-primarytext focus:outline-none focus:ring-2 focus:ring-primarytext focus:ring-offset-2 transition-all duration-300 ease-in-out flex items-center justify-center space-x-2"
              >
                <span>Send OTP</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primarytext" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border-2 border-primarytext/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primarytext focus:border-transparent transition-all duration-300 bg-white/70"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVerifyOtp}
                className="w-full px-4 py-3 bg-gradient-to-r from-primarytext to-primarytext text-white font-semibold rounded-lg shadow-md hover:from-primarytext hover:to-primarytext focus:outline-none focus:ring-2 focus:ring-primarytext focus:ring-offset-2 transition-all duration-300 ease-in-out flex items-center justify-center space-x-2"
              >
                <span>Verify OTP</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
    );
};

export default Login;
