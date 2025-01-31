import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"


const Hero2 = ({ wifi, selfcheckin, address, faqs, locationLink }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSelfCheckinOpen, setIsSelfCheckinOpen] = useState(false);
  const [isFaqsOpen, setIsFaqsOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  if (!wifi || !selfcheckin || !address || !faqs) return null;

  // const InfoCard = ({ title, content, isOpen, setIsOpen, imageSrc }) => (
  //   <div className="relative w-full md:w-[20%] sm:w-1/3 mb-6 sm:mb-0">
  //     <div className="flex flex-col items-center ">
  //       <img
  //         src={imageSrc || "/placeholder.svg"}
  //         alt={title}
  //         className="w-24 h-24 sm:w-32 sm:h-32 cursor-pointer hover:opacity-90 transition-all duration-300 transform hover:scale-105"
  //         onClick={() => setIsOpen(!isOpen)}
  //       />
  //       {isOpen && (
  //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  //           <div
  //             className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto overflow-hidden animate-fadeIn"
  //             onClick={(e) => e.stopPropagation()}
  //           >
  //             <div className="flex justify-between items-center bg-primarybg px-6 py-4">
  //               <h3 className="text-xl font-semibold text-green-900">{title}</h3>
  //               <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-800 transition-colors">
  //                 <svg
  //                   className="w-6 h-6"
  //                   fill="none"
  //                   stroke="currentColor"
  //                   viewBox="0 0 24 24"
  //                   xmlns="http://www.w3.org/2000/svg"
  //                 >
  //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  //                 </svg>
  //               </button>
  //             </div>
  //             <div className="p-6">
  //               <div className="text-gray-700 whitespace-pre-line max-h-[60vh] overflow-y-auto pr-2 font-semibold">{content}</div>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // )

  const InfoCard = ({ title, content, isOpen, setIsOpen, imageSrc, locationLink }) => {
    return (
      <div className="relative w-full md:w-[20%] sm:w-1/3 mb-6 sm:mb-0">
        <div className="flex flex-col items-center">
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={title}
            className="w-24 h-24 sm:w-32 sm:h-32 cursor-pointer hover:opacity-90 transition-all duration-300 transform hover:scale-105"
            onClick={() => setIsOpen(!isOpen)}
          />
          {isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto overflow-hidden animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center bg-primarybg px-6 py-4">
                  <h3 className="text-xl font-semibold text-green-900">{title}</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <div className="text-gray-700 whitespace-pre-line max-h-[60vh] overflow-y-auto pr-2 font-semibold">
                    {content}
                  </div>
                  {title.toLowerCase() === 'address' && locationLink && (
                    <a
                      href={locationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex mt-4 bg-orange-600 py-2 max-w-sm text-white rounded-full items-center justify-center text-center font-semibold"
                    >
                      View on Google Maps
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className='flex flex-col items-center w-full overflow-hidden'>
      <div className="flex flex-row items-center justify-center w-full md:py-8 md:px-4 py-12 md:gap-8 ">
        <InfoCard
          title="Address"
          content={address}
          isOpen={isAddressOpen}
          setIsOpen={setIsAddressOpen}
          locationLink={locationLink}
          imageSrc="https://staysync.in/assets/images/photographer-personal-logotype-500-450px-500-550px-500-575px-135x156.png"
        />
        <InfoCard
          title="Self Check-in"
          content={selfcheckin}
          isOpen={isSelfCheckinOpen}
          setIsOpen={setIsSelfCheckinOpen}
          imageSrc="https://staysync.in/assets/images/final-square-logos-135x156.png"
        />
        <InfoCard
          title="FAQs"
          content={
            <div>
              {faqs.map((faq) => (
                <div key={faq._id} className="mb-4">
                  <h4 className="font-medium text-gray-800">{faq.question}</h4>
                  <p className="mt-1 text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          }
          isOpen={isFaqsOpen}
          setIsOpen={setIsFaqsOpen}
          imageSrc="https://img.icons8.com/glyph-neue/64/3e7b27/faq.png"
        />
      </div>

      <div className='w-full px-8 md:max-w-xl lg:max-w-xl'>
        {wifi.password && wifi.username ? (
          <div className="border-r-4 border-t-4 border-l border-b  bg-white border-black rounded-3xl w-full md:w-full md:h-full px-7 py-5 md:px-10 md:py-10  md:mt-10 shadow-lg flex flex-col items-center justify-center hover:border-orange-500">
            <h2 className="text-2xl md:text-5xl font-semibold text-green-900 mb-2">Wifi Access</h2>
            <p className="text-gray-700 flex items-center">
              <strong className="text-orange-500 md:text-2xl">Username:</strong> {wifi?.username}

            </p>
            <p className="text-gray-700 flex items-center">
              <strong className="text-orange-500 md:text-2xl">Password:</strong> {wifi?.password}
              <button onClick={() => { navigator.clipboard.writeText(wifi.password); alert('Copied to clipboard'); }} className="ml-2 text-gray-600 hover:text-gray-800 transition-colors">
                <svg
                  
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className='w-5 h-5 text-black mt-3'
                  
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z"
                    fill="black"
                  />
                </svg>
              </button>
            </p>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default Hero2


// <div className="p-4 space-y-6">
//   {Object.entries(perk).map(([key, value]) => (
//     <div key={key} className="border rounded-lg p-4 shadow-sm">
//       <h2 className="text-2xl font-semibold text-green-900 mb-2">{key}</h2>
//       <p className="text-gray-700 whitespace-pre-line">
//         {value}
//       </p>
//     </div>
//   ))}
// </div>