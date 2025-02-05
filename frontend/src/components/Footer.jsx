import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Instagram, Globe } from "lucide-react";

const Footer = () => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <footer className="relative w-full mt-auto pb-20 md:pb-30 ">
      <div className="max-w-6xl mx-auto">
        {/* Fixed Height Wrapper */}
        <div
          className="h-[200px] md:h-[300px] lg:h-[400px] overflow-hidden shadow-lg" // 🔥 Adjust height here
          style={{
            background: "linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)",
          }}
        >
          <div className="flex md:flex-row h-full  lg:w-full">
            {/* Left Side - Image with overlay */}
            <div className="relative w-full md:w-1/2  h-full">
              <img
                src="https://plus.unsplash.com/premium_photo-1664304458186-9a67c1330d02?q=80&w=1890&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Goa view"
                className="w-full h-full object-cover"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity hover:bg-opacity-30">
                {/* Icons Container */}
                <div className="absolute bottom-4 left-4 flex space-x-4">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        isLiked ? "fill-red-500 text-red-500" : "text-white"
                      }`}
                    />
                  </button>
                  <button className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between h-full">
              {/* Message */}
              <div className="mb-6">
                <p className="text-white text-lg md:text-xl font-medium leading-relaxed">
                  "Follow us on Instagram @thekiwistays."
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-end space-x-4">
                <Link
                  to="https://www.instagram.com"
                  className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
                >
                  <Instagram className="w-6 h-6 text-white" />
                </Link>
                <Link
                  to="https://www.yourwebsite.com"
                  className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
                >
                  <Globe className="w-6 h-6 text-white" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
