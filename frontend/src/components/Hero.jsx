import React from 'react'
import { Link } from 'react-router-dom'

const Hero = ({ heroimg, title, locationLink }) => {
    return (
        <section className='flex flex-col max-w-7xl mx-auto w-full'>
            <div className="relative">
                {/* image  */}
                <div className="h-[30vh] sm:h-[40vh] md:h-[60vh] lg:h-[70vh]">
                    <img
                        src={heroimg}
                        alt="hero img"
                        className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                </div>

                {/* title */}
                <div className='absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent px-4 py-4 bg-white/40'>
                    <h1 className='text-black text-center text-xl sm:text-xl md:text-3xl lg:text-4xl font-semibold'>
                        Welcome to {title.split('|')[0]}, Goa
                    </h1>
                </div>
            </div>
            {/* Link section */}
            <div className="flex items-center justify-center px-4 my-6">
                <Link
                    to={locationLink}
                    className="group transition-all duration-300 
                   bg-white
                   border-2 rounded-xl  px-6 py-2 
                   w-full max-w-md flex items-center justify-between 
                   gap-4 text-lg font-medium text-[#B7410E] active:text-white"
                >
                    Google map location
                    <svg
                        className="w-8 h-8 p-1 -rotate-45 bg-blue-600 rounded-full  stroke-white transition-transform group-hover:scale-110"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="white"
                        // strokeWidth="2"
                    >
                        <path
                            d="M5.40995 21.75C4.28995 21.75 3.57995 21.37 3.12995 20.92C2.24995 20.04 1.62995 18.17 3.60995 14.2L4.47995 12.47C4.58995 12.24 4.58995 11.76 4.47995 11.53L3.60995 9.79999C1.61995 5.82999 2.24995 3.94999 3.12995 3.07999C3.99995 2.19999 5.87995 1.56999 9.83995 3.55999L18.3999 7.83999C20.5299 8.89999 21.6999 10.38 21.6999 12C21.6999 13.62 20.5299 15.1 18.4099 16.16L9.84995 20.44C7.90995 21.41 6.46995 21.75 5.40995 21.75ZM5.40995 3.74999C4.86995 3.74999 4.44995 3.87999 4.18995 4.13999C3.45995 4.85999 3.74995 6.72999 4.94995 9.11999L5.81995 10.86C6.13995 11.51 6.13995 12.49 5.81995 13.14L4.94995 14.87C3.74995 17.27 3.45995 19.13 4.18995 19.85C4.90995 20.58 6.77995 20.29 9.17995 19.09L17.7399 14.81C19.3099 14.03 20.1999 13 20.1999 11.99C20.1999 10.98 19.2999 9.94999 17.7299 9.16999L9.16995 4.89999C7.64995 4.13999 6.33995 3.74999 5.40995 3.74999Z"
                            fill="#000000"
                        />
                        <path
                            d="M10.8399 12.75H5.43994C5.02994 12.75 4.68994 12.41 4.68994 12C4.68994 11.59 5.02994 11.25 5.43994 11.25H10.8399C11.2499 11.25 11.5899 11.59 11.5899 12C11.5899 12.41 11.2499 12.75 10.8399 12.75Z"
                            fill="#000000"
                        />
                    </svg>

                </Link>
            </div>


        </section>
    )
}

export default Hero