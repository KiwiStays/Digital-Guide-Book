

import React, { useContext, useEffect } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { AuthContext } from "../Context/Authcontext"

const Thanks = () => {
  const { logout } = useContext(AuthContext)



  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-400 via-pink-500 to-red-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-2xl text-center"
      >
        <motion.h1
          className="text-4xl font-bold mb-4 text-gray-800"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        >
          Thanks for Registering!
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
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 px-6 rounded-full hover:from-pink-500 hover:to-purple-500 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            onClick={logout}
          >
            Go back
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Thanks

