import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Copy } from "lucide-react";

const PropertyListing = () => {
    const backendurl = import.meta.env.VITE_BACKEND_URL;
    // console.log(backendurl);
    const [propertyData, setPropertyData] = useState([]);
    const [error, setError] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null); // Track property to delete
    const [showModal, setShowModal] = useState(false); // Track modal visibility

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${backendurl}/api/admin/getproperty`);
            setPropertyData(response.data);
        } catch (error) {
            console.error(error);
            setError("Failed to load properties");
        }
    };

    const confirmDelete = (property) => {
        setSelectedProperty(property);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!selectedProperty) return;
        try {
            await axios.delete(`${backendurl}/api/admin/deleteproperty/${selectedProperty._id}`);
            setPropertyData(propertyData.filter((p) => p._id !== selectedProperty._id)); // Optimistic UI update
        } catch (error) {
            console.error("Error deleting property:", error);
        } finally {
            setShowModal(false);
            setSelectedProperty(null);
        }
    };

    return (
        <div>
            {/* Custom Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{selectedProperty?.title}</strong>?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {propertyData.length > 0 ? (
                    propertyData.map((property, index) => (
                        <motion.div
                            key={property._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white rounded-lg shadow-md overflow-hidden relative"
                        >
                            <motion.img
                                src={property.coverImage || "/placeholder.svg?height=192&width=384"}
                                alt={property.title}
                                className="w-full h-48 object-cover"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                                    {property.title}
                                </h2>
                                <p className="text-sm text-gray-600 mb-4">ID: {property._id}</p>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(property._id);
                                        // Optional: Show a brief confirmation
                                        alert("ID copied to clipboard!");
                                    }}
                                   
                                    className="mx-2 text-gray-500 hover:text-blue-500 transition-colors focus:outline-none"
                                    title="Copy ID"
                                >
                                    <Copy size={14} />
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`${property.active
                                        ? "bg-green-500 hover:bg-green-600"
                                        : "bg-red-500 hover:bg-red-600"
                                        } text-white px-4 py-2 rounded-md transition-colors duration-300`}
                                >
                                    {property.active ? "Active" : "Inactive"}
                                </motion.button>
                                <button
                                    onClick={() => confirmDelete(property)}
                                    className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full transition duration-200"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full text-center text-red-500"
                    >
                        {error || "No properties found"}
                    </motion.p>
                )}
            </div>
        </div>
    );
};

export default PropertyListing;
