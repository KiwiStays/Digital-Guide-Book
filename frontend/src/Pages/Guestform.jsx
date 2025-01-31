import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../Context/Authcontext';
import { motion } from "framer-motion";
import { Palmtree } from "lucide-react"

const backend_url = import.meta.env.VITE_BACKEND_URL;
// console.log("backend_url",backend_url);

const GuestForm = () => {
  const { id } = useParams(); // Initialize useParams hook
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { auth_login } = useContext(AuthContext); // Initialize auth_login function from AuthContext
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState(''); // Initialize coverImage state
  // console.log("id from guestform",id);

  useEffect(() => {
    const fetchPropertyName = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/admin/getproperty/name/${id}`);
        console.log("response from guestform", response.data);
        setTitle(response.data.data.title);
        setCoverImage(response.data.data.coverImage);

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
    documents: [{ name: '', file: '', age: 0, idCardType: '', gender: '' }],
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
      age: doc.age,
      gender: doc.gender,
      idCardType: doc.idCardType,
    }));

    data.append('Document', JSON.stringify(documentsData));
    formData.documents.forEach((doc) => {
      data.append('documents', doc.file);
    });

    try {
      const response = await axios.post(`${backend_url}/api/guest/verify/${id}`, data, {
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1515404929826-76fff9fef6fe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
      }}>
      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-2">
            <CheckCircle2 className="text-green-900 w-6 h-6" />
            <span className="text-green-900 font-semibold">Document submitted successfully!</span>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-4xl mx-auto  bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden ">
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left p-8 bg-gradient-to-r md:from-green-800 md:to-green-900">
          <h1 className="text-4xl md:text-5xl lg:text-4xl font-semibold text-white drop-shadow-lg">
            Welcome to KiwiStays
          </h1>

          <p className="text-xl md:text-xl lg:text-xl text-white mt-4 drop-shadow-md">
            Your perfect getaway begins here
          </p>

          <Link to="/login" className="text-white mt-4 block">
            Already have an account?{' '}
            <span className="underline hover:text-green-200">Click to Login</span>
          </Link>

          <div className="mt-8 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <img
              src={coverImage}
              alt="Property view"
              className="rounded-lg w-full h-48 md:h-64 object-cover"
            />
            <h2 className="text-white mt-4 text-xl font-semibold">
              {title}
            </h2>
          </div>

          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="flex flex-col items-center justify-center mt-8 md:hidden lg:hidden">
            <span className="text-white text-lg font-bold">Scroll down to fill the form</span>
            <span className="text-white text-2xl mt-2">↓</span>
          </motion.div>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/20 backdrop-blur-md">
          <div className="bg-gradient-to-r from-green-900 to-green-800 p-6 flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-white">Guest Registration</h2>
            <Palmtree className="text-white w-8 h-8" />
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 md:px-10  md:max-h-[70vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <label className="block text-sm font-medium text-white mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
                  placeholder="Your full name"
                  required
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <label className="block text-sm font-medium text-white mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only numbers and restrict to 10 characters
                    if (/^\d{0,10}$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
                  placeholder="Your phone number"
                  required
                />

              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <label className="block text-sm font-medium text-white mb-1">Phone</label>
                <input
                  type="text"
                  name="property_name"
                  value={title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
                  placeholder="Your phone number"
                  required
                />
              </motion.div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <label className="block text-sm font-medium text-white mb-1">Number of Guests</label>
              <select
                name="number_of_guests"
                value={formData.number_of_guests}
                onChange={handleGuestCountChange}
                className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
                required
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'Guest' : 'Guests'}
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
                className="space-y-4 p-4 bg-white/20 rounded-lg backdrop-blur-sm"
              >
                <h3 className="text-lg font-semibold text-white">Guest {index + 1} Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={doc.name}
                    onChange={(e) => handleDocumentChange(index, "name", e.target.value)}
                    className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
                    placeholder="Full name"
                    required
                  />
                  <input
                    type="number"
                    value={doc.age}
                    onChange={(e) => handleDocumentChange(index, "age", e.target.value)}
                    className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
                    placeholder="Age"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <select
                    value={doc.gender}
                    onChange={(e) => handleDocumentChange(index, "gender", e.target.value)}
                    className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <select
                    value={doc.idCardType}
                    onChange={(e) => handleDocumentChange(index, "idCardType", e.target.value)}
                    className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
                    required
                  >
                    <option value="">Select ID Type</option>
                    <option value="passport">Passport</option>
                    <option value="driverLicense">Driver's License</option>
                    <option value="nationalId">National ID</option>
                  </select>
                </div>
                <input
                  type="file"
                  onChange={(e) => handleDocumentChange(index, "file", e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-900 file:text-white hover:file:bg-green-800"
                  required
                />
              </motion.div>
            ))}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <label className="block text-sm font-medium text-white mb-1">Check-in Date</label>
                <input
                  type="date"
                  name="checkin"
                  value={formData.checkin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
                  required
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <label className="block text-sm font-medium text-white mb-1">Check-out Date</label>
                <input
                  type="date"
                  name="checkout"
                  value={formData.checkout}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-green-900/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-white/70"
                  required
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
                  "Submit Registration"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default GuestForm;
