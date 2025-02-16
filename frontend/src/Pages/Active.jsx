import React, { useContext, useEffect } from 'react'
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { AuthContext } from '../Context/Authcontext'

const Active = () => {
  const {logout} = useContext(AuthContext)

  useEffect(() => {
    var scalar = 2;
    var unicorn = confetti.shapeFromText({ text: '😅', scalar });
  
    var defaults = {
      ticks: 100, // Longer duration
      gravity: 0.2, // Slower fall
      decay: 0.95, // Lasts longer before fading
      startVelocity: 3, // Gentle fall
      angle: 90, // Falling straight down
      spread: 30, // Slightly spread out
      shapes: [unicorn],
      scalar
    };
  
    function shoot() {
      confetti({
        ...defaults,
        particleCount: 5, // Few particles at a time
        origin: { x: Math.random(), y: -0.1 } // Start from slightly above the screen
      });
    }
  
    // Fire continuously for a falling effect
    const interval = setInterval(shoot, 500);
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primarytext via-red-400 to-primarytext">
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-lg shadow-2xl text-center mx-4"
    >
      <motion.h1
        className="text-4xl font-bold mb-4 text-gray-800"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
      >
        The page is not yet available. Please check back later.
      </motion.h1>
      <motion.p
        className="text-xl text-gray-600 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Excited to host you soon
      </motion.p>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
      >
        <button
          className="bg-gradient-to-r from-primarytext to-red-500 text-white font-bold py-3 px-6 rounded-full hover:from-pink-500 hover:to-purple-500 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          onClick={logout}
        >
          Go Back
        </button>
      </motion.div>
    </motion.div>
  </div>
  )
}

export default Active