// import { Link } from "lucide-react";
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer
      className="relative bottom-0 left-0 right-0 text-gray-700 py-8 w-full mt-auto mb-10 pb-20 md:pb-40"
      style={{
        backgroundImage: 'url(https://staysync.in/assets/images/mbr-1-1920x1152.jpeg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* Black overlay for better text visibility */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Content */}
      <div className="relative">
        {/* Footer Text */}
        <div className="text-center mb-4">
          <p className="text-md font-medium md:text-xl md:font-semibold text-white">
            Goa: A paradise where time slows down, worries fade away, and memories are forever etched
          </p>
        </div>

        {/* Social Media Links */}
        <div>
          <ul className="flex justify-evenly space-x-4 items-center">
            <li>
              <Link to="https://www.airbnb.com" >
                <svg
                  fill="white"
                  viewBox="0 0 28 28"
                  id="airbnb"
                  data-name="Line Color"
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon line-color text-white w-12 h-10"
                
                >
                  <path
                    id="primary"
                    d="M14,14h0a4.83,4.83,0,0,1-1.41,3.41L10,20a3.54,3.54,0,0,1-2.5,1h0A3.53,3.53,0,0,1,4,17.46H4A10.47,10.47,0,0,1,5.1,12.8l4-8A3.21,3.21,0,0,1,12,3h0a3.21,3.21,0,0,1,2.89,1.79l4,8A10.47,10.47,0,0,1,20,17.46h0A3.53,3.53,0,0,1,16.46,21h0A3.54,3.54,0,0,1,14,20l-2.55-2.55A4.83,4.83,0,0,1,10,14h0a2,2,0,0,1,2-2h0A2,2,0,0,1,14,14Z"
                    style={{
                      fill: "none",
                      stroke: "white",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                    }}
                  />
                </svg>
              </Link>
            </li>
            <li>
              <Link to="https://www.facebook.com" >
                <svg
                  fill="white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMinYMin"
                  className="jam jam-instagram w-10 h-10 text-white"

                >
                  <path d="M14.017 0h-8.07A5.954 5.954 0 0 0 0 5.948v8.07a5.954 5.954 0 0 0 5.948 5.947h8.07a5.954 5.954 0 0 0 5.947-5.948v-8.07A5.954 5.954 0 0 0 14.017 0zm3.94 14.017a3.94 3.94 0 0 1-3.94 3.94h-8.07a3.94 3.94 0 0 1-3.939-3.94v-8.07a3.94 3.94 0 0 1 3.94-3.939h8.07a3.94 3.94 0 0 1 3.939 3.94v8.07z" />
                  <path d="M9.982 4.819A5.17 5.17 0 0 0 4.82 9.982a5.17 5.17 0 0 0 5.163 5.164 5.17 5.17 0 0 0 5.164-5.164A5.17 5.17 0 0 0 9.982 4.82zm0 8.319a3.155 3.155 0 1 1 0-6.31 3.155 3.155 0 0 1 0 6.31z" />
                  <circle cx={15.156} cy={4.858} r={1.237} />
                </svg>
              </Link>
            </li>
            <li>
              <Link to="https://www.yourwebsite.com" >
                <svg
                  className="w-10 h-10 text-white"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"

                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.5 1a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zm4.894 4a5.527 5.527 0 0 0-3.053-2.676c.444.84.765 1.74.953 2.676h2.1zm.582 2.995A5.11 5.11 0 0 0 14 7.5a5.464 5.464 0 0 0-.213-1.5h-2.342c.032.331.055.664.055 1a10.114 10.114 0 0 1-.206 2h2.493c.095-.329.158-.665.19-1.005zm-3.535 0l.006-.051A9.04 9.04 0 0 0 10.5 7a8.994 8.994 0 0 0-.076-1H6.576A8.82 8.82 0 0 0 6.5 7a8.98 8.98 0 0 0 .233 2h3.534c.077-.332.135-.667.174-1.005zM10.249 5a8.974 8.974 0 0 0-1.255-2.97C8.83 2.016 8.666 2 8.5 2a3.62 3.62 0 0 0-.312.015l-.182.015L8 2.04A8.97 8.97 0 0 0 6.751 5h3.498zM5.706 5a9.959 9.959 0 0 1 .966-2.681A5.527 5.527 0 0 0 3.606 5h2.1zM3.213 6A5.48 5.48 0 0 0 3 7.5 5.48 5.48 0 0 0 3.213 9h2.493A10.016 10.016 0 0 1 5.5 7c0-.336.023-.669.055-1H3.213zm2.754 4h-2.36a5.515 5.515 0 0 0 3.819 2.893A10.023 10.023 0 0 1 5.967 10zM8.5 12.644A8.942 8.942 0 0 0 9.978 10H7.022A8.943 8.943 0 0 0 8.5 12.644zM11.033 10a10.024 10.024 0 0 1-1.459 2.893A5.517 5.517 0 0 0 13.393 10h-2.36z"
                  />
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
};

export default Footer;
