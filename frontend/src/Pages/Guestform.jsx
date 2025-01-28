import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../Context/Authcontext';
import { motion } from "framer-motion";
import { Palmtree } from "lucide-react"



const GuestForm = () => {
  const { id } = useParams(); // Initialize useParams hook
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { auth_login } = useContext(AuthContext); // Initialize auth_login function from AuthContext
  const [title, setTitle] = useState('');
  // console.log("id from guestform",id);

  useEffect(() => {
    const fetchPropertyName = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/admin/getproperty/name/${id}`);
        console.log("response from guestform", response.data);
        setTitle(response.data.data.title);

      } catch (error) {
        console.error("Error fetching property name:", error);
      }
    };

    fetchPropertyName();
  }, [id]);


  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    property_name: title,
    number_of_guests: 1,
    documents: [{ name: '', file: '' ,age: 0 , idCardType: '' ,gender: ''}],
    checkin: '',
    checkout: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDocumentChange = (index, field, value) => {
    const updatedDocuments = [...formData.documents];
    updatedDocuments[index] = { ...updatedDocuments[index], [field]: value };
    setFormData({ ...formData, documents: updatedDocuments });
  };

  const handleGuestCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    const updatedDocuments = Array.from({ length: count }, (_, i) => formData.documents[i] || { name: '', file: '' });
    setFormData({
      ...formData,
      number_of_guests: count,
      documents: updatedDocuments,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      property_name: '',
      number_of_guests: 1,
      documents: [],
      checkin: '',
      checkout: '',
    });
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    data.append('property_name', title);
    data.append('number_of_guests', formData.number_of_guests);
    data.append('checkin', formData.checkin);
    data.append('checkout', formData.checkout);
    

    const documentsData = formData.documents.map((doc) => ({
      name: doc.name,
      age:doc.age,
      gender: doc.gender,
      idCardType: doc.idCardType,
    }));

    data.append('Document', JSON.stringify(documentsData));
    formData.documents.forEach((doc) => {
      data.append('documents', doc.file);
    });

    try {
      const response = await axios.post(`http://localhost:3000/api/guest/verify/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      console.log('Form Data:', formData);
      setIsSubmitted(true);
      setIsLoading(false);
      // resetForm();
      // localStorage.setItem('authToken', response.data.token); // Store the token in local storage
      // localStorage.setItem('guestId', response.data.guestId); // Store the guest ID in local storage
      // localStorage.setItem('guestName', response.data.guestName); // Store the guest name in local storage
      // Use AuthContext to handle login and redirection
      auth_login(response.data.token, response.data.guestName, response.data.guestId, id); // Call the login function from AuthContext
      navigate('/dashboard'); // Redirect to dashboard after successful registration
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start p-4 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1515404929826-76fff9fef6fe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
      }}
    >
      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-2">
            <CheckCircle2 className="text-green-900 w-6 h-6" />
            <span className="text-green-900 font-semibold">Document submitted successfully!</span>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8 mt-8"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">Welcome to KiwiStays</h1>
        <p className="text-xl md:text-2xl text-white mt-4 drop-shadow-md">Your perfect  getaway begins here</p>
        <Link to="/login" className="text-white hover:underline mt-4 block">Already have an account ? <h2 className="underline">Click to Login</h2> </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white/40 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-green-900 to-green-800 p-6 md:p-8 flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Guest Registration</h2>
          <Palmtree className="text-white w-10 h-10" />
        </div>
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <label className="block text-sm font-medium text-gray-800 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
                placeholder="Your full name"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <label className="block text-sm font-medium text-gray-800 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
                placeholder="Your phone number"
              />
            </motion.div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <label className="block text-sm font-medium text-gray-800 mb-1">Property Name</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
              placeholder={title}
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <label className="block text-sm font-medium text-gray-800 mb-1">Number of Guests</label>
            <select
              name="number_of_guests"
              value={formData.number_of_guests}
              onChange={handleGuestCountChange}
              className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </motion.div>

          {formData.documents.map((doc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="space-y-2 p-4 bg-white/50 rounded-lg backdrop-blur-sm"
            >
              <label className="block text-sm font-medium text-gray-800">
                Guest {index + 1} Details
              </label>
              <input
                type="text"
                value={doc.name}
                onChange={(e) => handleDocumentChange(index, "name", e.target.value)}
                className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
                placeholder={`Guest ${index + 1} name`}
              />
              {/* Age field */}
              <input
                type="number"
                value={doc.age || ""}
                onChange={(e) => handleDocumentChange(index, "age", e.target.value)}
                className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
                placeholder="Age"
              />
              <div className="flex flex-col md:flex-row md:gap-4 w-full max-w-full">
                <select
                  value={doc.gender || ""}
                  onChange={(e) => handleDocumentChange(index, "gender", e.target.value)}
                  className="w-full md:w-1/2 px-3 py-2 mb-4 md:mb-0 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>

                <select
                  value={doc.idCardType || ""}
                  onChange={(e) => handleDocumentChange(index, "idCardType", e.target.value)}
                  className="w-full md:w-1/2 px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
                >
                  <option value="">Select ID Type</option>
                  <option value="passport"  >Passport</option>
                  <option value="driverLicense"  >Driver License</option>
                  <option value="aadhar" >Aadhar</option>
                  <option value="voterId" >Voter ID</option>
                </select>
              </div>
              {/* Existing file input */}
              <input
                type="file"
                onChange={(e) => handleDocumentChange(index, "file", e.target.files[0])}
                className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-900 file:text-white hover:file:bg-green-800"
              />
            </motion.div>
          ))}

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <label className="block text-sm font-medium text-gray-800 mb-1">Check-in Date</label>
              <input
                type="date"
                name="checkin"
                value={formData.checkin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <label className="block text-sm font-medium text-gray-800 mb-1">Check-out Date</label>
              <input
                type="date"
                name="checkout"
                value={formData.checkout}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
              />
            </motion.div>
          </div>

          <div className="flex justify-center pt-6">
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-green-900 to-green-800 text-white font-semibold rounded-md shadow-md hover:from-green-800 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-900 focus:ring-offset-2 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Submitting...</span>
                </div>
              ) : (
                "Submit"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default GuestForm;