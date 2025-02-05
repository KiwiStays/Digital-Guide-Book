import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const IconFooter = () => {
  const [activeLink, setActiveLink] = useState("Arrival");
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white/30 backdrop-blur-md border-t border-white/20 shadow-sm rounded-t-3xl">
      <div className="flex justify-around items-center py-2">
        {/* Arrival Link */}
        <button
          className={`flex flex-col items-center p-2 w-full rounded transition-colors duration-200 `}
        >
          <Link className="flex flex-col items-center space-y-2" to="/">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke={currentPath === "/dashboard" ? "#cb4e2e" : "#333333"}
              strokeWidth="1.5"
              className="w-7 h-7"
            >
              <path
                d="M12 18.75C11.59 18.75 11.25 18.41 11.25 18V15C11.25 14.59 11.59 14.25 12 14.25C12.41 14.25 12.75 14.59 12.75 15V18C12.75 18.41 12.41 18.75 12 18.75Z"
                stroke={currentPath === "/dashboard" ? "#cb4e2e" : "#333333"}
                fill="none"
              />
              <path
                d="M17.6 22.56H6.39996C4.57996 22.56 2.91996 21.16 2.61996 19.37L1.28996 11.4C1.06996 10.16 1.67996 8.57001 2.66996 7.78001L9.59996 2.23001C10.94 1.15001 13.05 1.16001 14.4 2.24001L21.33 7.78001C22.31 8.57001 22.91 10.16 22.71 11.4L21.38 19.36C21.08 21.13 19.38 22.56 17.6 22.56Z"
                stroke={currentPath === "/dashboard" ? "#cb4e2e" : "#333333"}
                fill="none"
              />
            </svg>
            <span className={`text-sm font-semibold ${currentPath === "/dashboard" ? "text-[#cb4e2e]" : "text-gray-700"}`}>
              Arrival
            </span>
          </Link>
        </button>

        {/* StayInfo Link */}
        <button
          className={`flex flex-col items-center p-2 w-full rounded transition-colors duration-200 `}
        >
          <Link className="flex flex-col items-center space-y-2" to="/stayinfo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
              stroke={currentPath === "/stayinfo" ? "#cb4e2e" : "#333333"}
              className="w-7 h-7"
            >
              <path
                d="M17.22 9.75H8.96002C8.40002 9.75 7.84002 9.56001 7.40002 9.20001L5.21002 7.45001C4.61002 6.97001 4.27002 6.26 4.27002 5.5C4.27002 4.74 4.61002 4.01999 5.21002 3.54999L7.40002 1.79999C7.84002 1.44999 8.40002 1.25 8.96002 1.25H17.22C18.6 1.25 19.72 2.37 19.72 3.75V7.25C19.72 8.63 18.6 9.75 17.22 9.75Z"
                stroke={currentPath === "/stayinfo" ? "#cb4e2e" : "#333333"}
                fill="none"
              />
              <path
                d="M15.0598 19.75H6.7998C5.4198 19.75 4.2998 18.63 4.2998 17.25V13.75C4.2998 12.37 5.4198 11.25 6.7998 11.25H15.0598C15.6298 11.25 16.1798 11.44 16.6198 11.8L18.8098 13.55C19.4098 14.03 19.7498 14.74 19.7498 15.5C19.7498 16.26 19.4098 16.98 18.8098 17.45L16.6198 19.2C16.1798 19.56 15.6298 19.75 15.0598 19.75Z"
                stroke={currentPath === "/stayinfo" ? "#cb4e2e" : "#333333"}
                fill="none"
              />
              <path
                d="M12 12.75C11.59 12.75 11.25 12.41 11.25 12V9C11.25 8.59 11.59 8.25 12 8.25C12.41 8.25 12.75 8.59 12.75 9V12C12.75 12.41 12.41 12.75 12 12.75Z"
                stroke={currentPath === "/stayinfo" ? "#cb4e2e" : "#333333"}
                fill="none"
              />
              <path
                d="M12 22.75C11.59 22.75 11.25 22.41 11.25 22V19C11.25 18.59 11.59 18.25 12 18.25C12.41 18.25 12.75 18.59 12.75 19V22C12.75 22.41 12.41 22.75 12 22.75Z"
                stroke={currentPath === "/stayinfo" ? "#cb4e2e" : "#333333"}
                fill="none"
              />
            </svg>
            <span className={`text-sm font-semibold ${currentPath === "/stayinfo" ? "text-[#cb4e2e]" : "text-gray-700"}`}>
              StayInfo
            </span>
          </Link>
        </button>

        {/* Nearby Link */}
        <button
          className={`flex flex-col items-center p-2 w-full rounded transition-colors duration-200 `}
        >
          <Link className="flex flex-col items-center space-y-2" to="/nearby">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke={currentPath === "/nearby" ? "#cb4e2e" : "#333333"}
              strokeWidth="1.5"
              className="w-7 h-7"
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                stroke={currentPath === "/nearby" ? "#cb4e2e" : "#333333"}
                fill="none"
              />
            </svg>
            <span className={`text-sm font-semibold ${currentPath === "/nearby" ? "text-[#cb4e2e]" : "text-gray-700"}`}>
              Nearby
            </span>
          </Link>
        </button>
      </div>
    </footer>
  );
};

export default IconFooter;