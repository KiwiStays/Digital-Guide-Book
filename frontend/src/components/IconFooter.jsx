import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const IconFooter = () => {
  const [activeLink, setActiveLink] = useState("Arrival");
  console.log(activeLink);
  const location = useLocation(); // Get the current route
  const currentPath = location.pathname;

  return (
    <footer className="bg-primarybg fixed bottom-0 left-0 w-full">
      <div className="flex justify-around items-center">
        {/* Arrival Link */}
        <button
          className={`flex flex-col items-center p-2 w-full rounded ${currentPath === "/dashboard" ? "bg-yellow-400 text-teal-700" : ""
            }`}
        >
          <Link className="flex flex-col items-center space-y-1" to="/">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke={currentPath === "/dashboard" ? "teal" : "black"}
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.354 7.208a5.5 5.5 0 11-8.708 0m8.708 0a5.5 5.5 0 00-8.708 0m8.708 0L12 21m-3.646-13.792L12 21m3.646-13.792L12 3m0 0l3.646 3.646M12 3L8.354 6.854"
              />
            </svg> */}
            <svg

              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke={currentPath === "/dashboard" ? "teal" : "black"}
              className="w-6 h-6"
            >
              <path
                d="M12 2c-4.4 0-8 3.6-8 8 0 5.4 7 11.5 7.3 11.8.2.1.5.2.7.2.2 0 .5-.1.7-.2.3-.3 7.3-6.4 7.3-11.8 0-4.4-3.6-8-8-8zm0 17.7c-2.1-2-6-6.3-6-9.7 0-3.3 2.7-6 6-6s6 2.7 6 6-3.9 7.7-6 9.7zM12 6c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
                fill="#0D0D0D"
              />
            </svg>
          </Link>
          <span className="font-medium">Arrival</span>
        </button>

        {/* StayInfo Link */}
        <button
          className={`flex flex-col items-center space-y-1 p-2 w-full rounded ${currentPath === "/stayinfo" ? "bg-yellow-400 text-teal-700" : ""
            }`}
        >
          <Link className="flex flex-col items-center space-y-1" to="/stayinfo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke={currentPath === "/stayinfo" ? "teal" : "black"}
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10v11h18V10M3 10l9-9 9 9M9 21v-6h6v6"
              />
            </svg>
          </Link>
          <span className="font-medium">StayInfo</span>
        </button>

        {/* Contacts Link */}
        <button
          className={`flex flex-col items-center justify-center space-y-1 p-2 w-full rounded ${currentPath === "/contacts" ? "bg-yellow-400 text-teal-700" : ""
            }`}
        >
          <Link className="flex flex-col items-center space-y-1" to="/contacts">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke={currentPath === "/contacts" ? "teal" : "black"}
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8h4l2-2h6l2 2h4v13H3V8z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 14a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg> */}
            <svg

              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              
              strokeWidth={2}
              stroke={currentPath === "/contacts" ? "teal" : "black"}
              className="w-6 h-6"

            >
              <path
                opacity={0.25}
                d="M15.4363 14.7782C14.841 14.5276 14.1 14.2154 14.1 13.975V12.4059C14.9676 11.7528 15.5 10.6951 15.5 9.6V7.5C15.5 5.5701 13.9299 4 12 4C10.0701 4 8.5 5.5701 8.5 7.5V9.6C8.5 10.6948 9.03235 11.7528 9.9 12.4059V13.975C9.9 14.2007 9.16605 14.5147 8.57665 14.7667C7.15215 15.3757 5 16.2958 5 18.7V19.05H19V18.7C19 16.2801 16.8556 15.3764 15.4363 14.7782Z"
                fill={currentPath === "/contacts" ? "teal" : "black"}
              />
              <path
                d="M8.5 9.5V7.5C8.5 5.567 10.067 4 12 4C13.933 4 15.5 5.567 15.5 7.5V9.5C15.5 10.6894 14.9067 11.7402 14 12.3727V13.323C14 13.7319 14.249 14.0996 14.6286 14.2514L16.2146 14.8858C17.8969 15.5587 19 17.1881 19 19H5C5 17.1881 6.10313 15.5587 7.78543 14.8858L9.37139 14.2514C9.75105 14.0996 10 13.7319 10 13.323V12.3727C9.09326 11.7402 8.5 10.6894 8.5 9.5Z"
                fill={currentPath === "/contacts" ? "teal" : "black"}
              />
            </svg>
          </Link>
          <span className="font-medium">Contacts</span>
        </button>
      </div>
    </footer>
  );
};

export default IconFooter;
