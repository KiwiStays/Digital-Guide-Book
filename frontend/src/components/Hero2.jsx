import React, { useContext, useState } from "react";
import Rules from "./Rules";
import { AuthContext } from "../Context/Authcontext";
import { QuickResponseItems } from "../data/quickresponse";

const Hero2 = ({ wifi, selfcheckin, address, faqs, locationLink, houseRules }) => {
    const { propertyData } = useContext(AuthContext);
    const quickResponse = propertyData?.data?.quickResponse || [];
    console.log("quickResponse", quickResponse);
    const [isOpen, setIsOpen] = useState(null);
    const [selectedQuickResponse, setSelectedQuickResponse] = useState(null);

    if (!wifi || !selfcheckin || !address || !faqs || !houseRules) return null;

    const getIconFromImport = (description) => {
        const matchedItem = QuickResponseItems.find(
            item => item.name.toLowerCase() === description.toLowerCase()
        );
        return matchedItem ? matchedItem.url : null;
    };

    const InfoCard2 = ({ description, number }) => {
        const importedIcon = getIconFromImport(description);

        return (
            <div className="flex flex-col items-center">
                {importedIcon && (
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden">
                        <img
                            src={importedIcon}
                            alt={description}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <p className="mt-2 text-sm font-medium text-green-600">{description}</p>
                <p className="text-xl text-red-600">{number}</p>
            </div>
        );
    };

    const InfoCard = ({ title, content, imageSrc, locationLink, customComponent }) => {
        const isCardOpen = isOpen === title;
        const toggleCard = () => setIsOpen(isCardOpen ? null : title);

        return (
            <div className="p-2">
                <div
                    className="flex flex-col justify-center items-center px-6 py-6 bg-white shadow-lg rounded-xl cursor-pointer transition-transform transform hover:scale-105 w-full max-w-[120px] h-[110px]"
                    onClick={toggleCard}
                >
                    <img 
                        src={imageSrc || "/placeholder.svg"} 
                        alt={title} 
                        className="w-12 h-12 sm:w-14 sm:h-14"
                        style={{
                          fill: "#ff6b3d !important",
                          filter: "invert(53%) sepia(65%) saturate(2578%) hue-rotate(339deg) brightness(99%) contrast(92%)"
                      }}
                    />
                    <h3 className="mt-2 text-sm font-semibold text-gray-800 text-center">{title}</h3>
                </div>

                {isCardOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div
                            className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto overflow-hidden animate-fadeIn"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center px-6 py-4 bg-[#ecc19a] rounded-t-xl">
                                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                                <button
                                    onClick={() => setIsOpen(null)}
                                    className="text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6 flex items-center justify-center whitespace-pre-line max-h-[70vh] md:w-full overflow-y-auto pr-2 font-semibold">
                                {customComponent ? customComponent : content}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <section className="flex flex-col items-center w-full overflow-hidden">
            <div className="grid grid-cols-3 gap-2 w-full max-w-lg px-4 py-8 sm:grid-cols-3 md:grid-cols-3">
                <InfoCard
                    title="Address"
                    content={address}
                    locationLink={locationLink}
                    imageSrc="https://img.icons8.com/?size=100&id=Eyy3nmHIbCL8&format=png"
                />
                <InfoCard
                    title="WiFi"
                    customComponent={
                        wifi?.username && wifi?.password ? (
                            <div className="flex flex-col items-center">
                                <p>
                                    <strong className="text-orange-500">Username:</strong> {wifi.username}
                                </p>
                                <p>
                                    <strong className="text-orange-500">Password:</strong> {wifi.password}
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(wifi.password);
                                            alert("Copied to clipboard");
                                        }}
                                        className="ml-2 text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        📋
                                    </button>
                                </p>
                            </div>
                        ) : (
                            "No WiFi credentials available"
                        )
                    }
                    imageSrc="https://img.icons8.com/?size=100&id=172&format=png"
                />
                <InfoCard
                    title="Code"
                    content={selfcheckin}
                    imageSrc="https://img.icons8.com/?size=100&id=555&format=png"
                />
                <InfoCard
                    title="FAQs"
                    customComponent={
                        <div>
                            {faqs.map((faq) => (
                                <div key={faq._id} className="mb-4">
                                    <h4 className="font-medium text-red-800">{faq.question}</h4>
                                    <p className="mt-1 text-gray-500">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    }
                    imageSrc="https://img.icons8.com/glyph-neue/64/3e7b27/faq.png"
                />
                <InfoCard
                    title="House Rules"
                    customComponent={
                        <Rules houseRules={houseRules}/>
                    }
                    imageSrc="https://img.icons8.com/?size=100&id=6440&format=png&color=1A1A1A"
                />
                <InfoCard
                    title="Cabs and Taxi"
                    customComponent={
                        <div className="grid grid-cols-2 gap-4">
                            {quickResponse.map((item, index) => (
                                <InfoCard2
                                    key={index}
                                    description={item.description}
                                    number={item.number}
                                />
                            ))}
                        </div>
                    }
                    imageSrc="https://img.icons8.com/?size=100&id=Yw96S2HqmIWM&format=png&color=1A1A1A"
                />
            </div>
        </section>
    );
};

export default Hero2;