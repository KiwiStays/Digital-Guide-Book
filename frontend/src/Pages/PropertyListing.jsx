import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const PropertyListing = () => {
    const backendurl = import.meta.env.VITE_BACKEND_URL;
    console.log(backendurl);
    const [propertyData, setPropertyData] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchdata = async () => {
            try {
                const property = await axios.get(`${backendurl}/api/admin/getproperty`)
                console.log(property.data)
                setPropertyData(property.data);

            } catch (error) {
                console.error(error);
                setError("failed to load property");
            }
        }
        fetchdata();

    }, [])

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {propertyData ? (
                propertyData.map((property, index) => (
                    <motion.div
                        key={property._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        <motion.img
                            src={property.coverImage || "/placeholder.svg?height=192&width=384"}
                            alt={property.title}
                            className="w-full h-48 object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">{property.title}</h2>
                            <p className="text-sm text-gray-600 mb-4">ID: {property._id}</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`${property.active ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                                    } text-white px-4 py-2 rounded-md transition-colors duration-300`}
                            >
                                {property.active ? 'Active' : 'Inactive'}
                            </motion.button>
                        </div>
                    </motion.div>
                ))
            ) : (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center text-red-500">
                    {error}
                </motion.p>
            )}
        </div>
    )
}

export default PropertyListing