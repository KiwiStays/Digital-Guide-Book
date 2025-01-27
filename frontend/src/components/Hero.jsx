import React from 'react'

const Hero = ({heroimg , title}) => {
  return (
    <section className='flex flex-col'>
        <div className="relative ">
        {/* image  */}
        <div className="">
            <img src={heroimg} alt="hero img" className="w-full  md:h-[60vh] object-cover"/>
        </div>
        
        {/* title */}
        <div className='absolute bottom-5 w-full bg-white/60 px-4 py-2'>
            <h1 className='text-black flex items-center justify-center text-2xl md:text-4xl font-semibold '>
                Welcome to {title}, Goa
            </h1>
        </div>
        </div>
{/* host section */}
        <div className='py-10 px-3 flex space-x-4   md:justify-start md:px-20  max-w-max '>
            <img src='https://staysync.in/assets/images/only-symbols-1-312x312.png' alt="host image" className="w-[12vh] h-[12vh] md:w-60 md:h-full bg-white object-cover rounded-lg border-green-900 border-2"/>
            <p className='text-primarytext md:text-2xl '><span className="font-medium text-green-900 md:text-2xl ">I'm your host Nymisha</span>. Welcome to our little piece of paradise.<br/> We hope you've a fantastic time staying with us. Happy Holidays!!</p>
            
        </div>
        <div className='flex justify-center py-5'>
        <h1 className='text-orange-600  text-2xl font-semibold md:text-5xl md:font-normal'>Check in: 3 PM -  Checkout: 11 AM </h1>
        </div>
    </section>  )
}

export default Hero