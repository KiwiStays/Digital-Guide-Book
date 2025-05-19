import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../Context/Authcontext';
import { motion } from "framer-motion";
import { Palmtree } from "lucide-react"
import imageCompression from "browser-image-compression";

const backend_url = import.meta.env.VITE_BACKEND_URL;
// console.log("backendurl", backend_url);

const GuestForm = () => {
  const { id } = useParams(); // Initialize useParams hook
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { auth_login } = useContext(AuthContext); // Initialize auth_login function from AuthContext
  const [title, setTitle] = useState('');
  const [active, setActive] = useState(false);
  const [coverImage, setCoverImage] = useState(''); // Initialize coverImage state
  const [newQuestion, setNewQuestion] = useState('');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState(new Set());
  const questionsPerPage = 1;
  // const [isOptionType, setIsOptionType] = useState(false);
  const [questions, setQuestions] = useState({
    multipleChoice: [], // Will store multiple choice questions
    fillUp: [] // Will store fill-up questions
  });

  // console.log("id from guestform",id);
  // At the top of your component
  const [uploadProgress, setUploadProgress] = useState('');
  const uploadCounter = useRef({ completed: 0, total: 0 });

  const getTotalQuestions = () => questions.multipleChoice.length + questions.fillUp.length;

  // In your handleSubmit function, before the uploads start:
  // uploadCounter.current = { completed: 0, total: formData.documents.length };
  useEffect(() => {
    const fetchPropertyName = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/admin/getproperty/name/${id}`);
        // console.log("response from guestform", response.data.data);
        const multipleChoiceQuestions = [];
        const fillUpQuestions = [];
        response?.data?.data?.questions?.forEach((question) => {
          console.log("question", question);
          const cleanedQuestionText = question.questionText.replace(/t_/g, '');
          if (question.type === 'multiple-choice') {
            multipleChoiceQuestions.push({
              questionText: cleanedQuestionText,
              options: question.options,
              id: question._id
            });
          } else if (question.type === 'fill-up') {
            fillUpQuestions.push({
              questionText: cleanedQuestionText,
              id: question._id
            });

          }

        });
        // console.log("newType", newType);
        setQuestions({
          multipleChoice: multipleChoiceQuestions,
          fillUp: fillUpQuestions
        });
        setTitle(response.data.data.title);
        setCoverImage(response.data.data.coverImage);
        setActive(response.data.data.active);

      } catch (error) {
        console.error("Error fetching property name:", error);
      }
    };

    fetchPropertyName();
  }, [id]);

  // console.log("newMultipleChoicequestion", newMultipleChoicequestion);
  // console.log("multipleChoice", multipleChoice);
  // console.log("fillUp", fillUp);

  // console.log("active", active);


  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    property_name: title,
    number_of_guests: 1,
    documents: [{ name: '', file: '', age: '', idCardType: '', gender: '' }],
    checkin: 'dd/mm/yyyy',
    checkout: 'dd/mm/yyyy',
    cleaningTime: '',
    answers: []
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
      answers: [],
    });
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  // Modified handleSubmit function for two-phase submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Form Data being sent:', {
      basicData: {
        name: formData.name,
        phone: formData.phone,
        property_name: title,
        number_of_guests: formData.number_of_guests,
        checkin: formData.checkin,
        checkout: formData.checkout,
        cleaningTime: formData.cleaningTime,
        answers:formData.answers
      },
      documents: formData.documents.map(doc => ({
        name: doc.name,
        age: doc.age,
        gender: doc.gender,
        idCardType: doc.idCardType,
        file: doc.file ? 'File present' : 'No file'
      }))
    });


    try {
      // PHASE 1: Save basic guest info quickly
      const basicData = {
        name: formData.name,
        phone: formData.phone,
        property_name: title,
        number_of_guests: formData.number_of_guests,
        checkin: formData.checkin,
        checkout: formData.checkout,
        cleaningTime: formData.cleaningTime,
        answers: formData.answers
      };

      // First create the guest with basic info
      const initialResponse = await axios.post(`${backend_url}/api/guest/create/${id}`, basicData);
      // console.log('Initial Response:', initialResponse.data);
      // console.log('Guest ID:', initialResponse.data.guestId);
      // console.log('token :', initialResponse.data.token);
      const guestId = initialResponse.data.guestId;

      // Update progress status for user
      setUploadProgress("Guest information saved. Uploading documents...");

      // PHASE 2: Process and upload images directly to Cloudinary
      // Get upload signature from your server
      const signatureResponse = await axios.get(`${backend_url}/api/guest/cloudinary/signature`);
      console.log('Signature Response:', signatureResponse.data);
      const { signature, timestamp, cloudName, apiKey } = signatureResponse.data;

      // Upload all images in parallel
      uploadCounter.current = { completed: 0, total: formData.documents.length };

      const uploadPromises = formData.documents.map(async (doc, index) => {
        // Prepare document metadata
        const docData = {
          name: index === 0 ? formData.name : doc.name,
          age: doc.age,
          gender: doc.gender,
          idCardType: doc.idCardType
        };

        // Create upload form for Cloudinary
        const uploadData = new FormData();
        uploadData.append('file', doc.file);
        uploadData.append('api_key', apiKey);
        uploadData.append('timestamp', timestamp);
        uploadData.append('signature', signature);
        uploadData.append('folder', 'guest_documents');

        try {
          // Upload directly to Cloudinary
          const uploadResponse = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            uploadData
          );

          // Only increment counter after successful upload completion
          uploadCounter.current.completed += 1;
          setUploadProgress(`Uploading document ${uploadCounter.current.completed}/${uploadCounter.current.total}...`);

          // Return document info with Cloudinary URL
          return {
            ...docData,
            file: uploadResponse.data.secure_url
          };
        } catch (error) {
          console.error(`Error uploading document ${index}:`, error);
          throw error;
        }
      });

      // Wait for all uploads to complete
      const uploadedDocs = await Promise.all(uploadPromises);

      // Finally, update the guest record with document information
      await axios.patch(`${backend_url}/api/guest/update-documents/${guestId}`, {
        documents: uploadedDocs
      });

      setIsSubmitted(true);
      setIsLoading(false);

      // Handle login and navigation as before
      auth_login(initialResponse.data.token, initialResponse.data.guestName, guestId, id, active);

      if (active) {
        navigate('/dashboard');
      } else {
        navigate("/thanks");
      }
    } catch (error) {
      if (error.response && error.response.status === 402) {
        alert(error.response.data.message);
      } else {
        console.error('Error:', error);
      }
      setIsLoading(false);
    }
  };


  const calculateDateDifference = (checkin, checkout) => {
    const start = new Date(checkin);
    const end = new Date(checkout);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1532484468512-fd9df0aa70f4?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
      }}>
      {!active && isSubmitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-2">
            <CheckCircle2 className="text-primarytext w-6 h-6" />
            <span className="text-primarytext font-semibold">
              Document submitted successfully!
            </span>
          </div>
        </motion.div>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-4xl mx-auto  bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden ">
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left p-8 bg-gradient-to-r md:from-red-800 md:to-primarytext">
          <h1 className="text-4xl md:text-5xl lg:text-4xl font-semibold text-white  drop-shadow-lg">
            Welcome to KiwiStays
          </h1>

          <p className="text-xl md:text-xl lg:text-xl text-white mt-4 drop-shadow-md">
            Your perfect getaway begins here
          </p>

          <Link to="/login" className="text-white  mt-4 block">
            Already have an account?{' '}
            <span className="underline hover:text-green-200">Click to Login</span>
          </Link>

          <div className="mt-8 bg-white/10 md:p-4 rounded-lg backdrop-blur-sm">
            <img
              src={coverImage}
              alt="Property view"
              className="rounded-lg w-full h-48 md:h-64 object-cover"
            />

          </div>

          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="flex flex-col items-center justify-center mt-8 md:hidden lg:hidden">
            <h2 className="text-white mt-4 text-xl font-semibold">
              {title}
            </h2>
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
          <div className="bg-gradient-to-r from-primarytext to-red-800 p-6 flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-white">Guest Registration</h2>
            <Palmtree className="text-white w-8 h-8" />
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 md:px-10  md:max-h-[70vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <label className="block text-md font-bold  text-white  mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-primarytext/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarytext focus:border-transparent bg-white/70"
                  placeholder="Your full name"
                  required
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <label className="block text-sm font-bold  text-white  mb-1">Phone</label>
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
                  className="w-full px-3 py-2 border border-primarytext/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarytext focus:border-transparent bg-white/70"
                  placeholder="Your phone number"
                  required
                />

              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <label className="block text-sm font-bold  text-white  mb-1">Property Name</label>
                <input
                  type="text"
                  name="property_name"
                  value={title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-primarytext/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarytext focus:border-transparent bg-white/70"
                  placeholder="Property Name"
                  required
                />
              </motion.div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <label className="block text-sm font-bold  text-white mb-1">Number of Guests</label>
              <select
                name="number_of_guests"
                value={formData.number_of_guests}
                onChange={handleGuestCountChange}
                className="w-full px-3 py-2 border border-primarytext/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarytext focus:border-transparent bg-white/70"
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
                <h3 className="text-lg font-bold  text-white">Guest {index + 1} Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={index == 0 ? (formData.name) : doc.name}
                    // value={doc.name}
                    onChange={(e) => handleDocumentChange(index, "name", e.target.value)}
                    className="w-full px-3 py-2 border border-primarytext/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarytext focus:border-transparent bg-white/70"
                    placeholder="Full name"
                    required
                  />
                  <input
                    type="number"
                    value={doc.age}
                    onChange={(e) => handleDocumentChange(index, "age", e.target.value)}
                    className="w-full px-3 py-2 border border-primarytext/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarytext focus:border-transparent bg-white/70"
                    placeholder="Age"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <select
                    value={doc.gender}
                    onChange={(e) => handleDocumentChange(index, "gender", e.target.value)}
                    className="w-full px-3 py-2 border border-primarytext/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarytext focus:border-transparent bg-white/70"
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
                    className="w-full px-3 py-2 border border-primarytext/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent bg-white/70"
                    required
                  >
                    <option value="">Select ID Type</option>
                    <option value="passport">Passport</option>
                    <option value="driverLicense">Driver's License</option>
                    <option value="nationalId">Adhar Card</option>
                    <option value="voterId">Voter Id Card</option>
                  </select>
                </div>
                <h6 className="font-thin text-sm text-gray-600">Max Size 5 Mb</h6>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file && file.size > 5 * 1024 * 1024) { // 2MB limit
                      alert("Max Size : 5 Mb");
                      return;
                    }
                    handleDocumentChange(index, "file", file);
                  }}
                  className="w-full px-3 py-2 border border-primarytext/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarytext focus:border-transparent bg-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primarytext file:text-white hover:file:bg-green-800"
                  required
                />
              </motion.div>
            ))}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <label className="block text-sm font-medium text-white  mb-1">Check-in Date</label>
                <input
                  type="date"
                  name="checkin"
                  value={formData.checkin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-primarytext/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarytext focus:border-transparent bg-white/70"
                  required
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <label className="block text-sm font-bold  text-white  mb-1">Check-out Date</label>
                <input
                  type="date"
                  name="checkout"
                  value={formData.checkout}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-primarytext/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarytext focus:border-transparent bg-white/70"
                  required
                />
              </motion.div>
            </div>
            {calculateDateDifference(formData.checkin, formData.checkout) > 2 && (
              <div>
                <motion.div className="space-y-4">
                  <label className="block text-md font-bold text-white mb-3">Select preferred cleaning time during your stay</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="morning"
                        name="cleaningTime"
                        value="9:30AM - 10:30AM"
                        onChange={handleChange}
                        className="w-4 h-4 accent-primarytext"
                        required
                      />
                      <label htmlFor="morning" className="text-gray-600">9:30 AM - 10:30 AM</label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="afternoon"
                        name="cleaningTime"
                        value="10:30AM - 11:30AM"
                        onChange={handleChange}
                        className="w-4 h-4 accent-primarytext"
                        required
                      />
                      <label htmlFor="afternoon" className="text-gray-600">10:30 AM - 11:30 AM</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="afternoon"
                        name="cleaningTime"
                        value="2:00PM - 3:00 PM"
                        onChange={handleChange}
                        className="w-4 h-4 accent-primarytext"
                        required
                      />
                      <label htmlFor="afternoon" className="text-gray-600">2:00 PM - 3:00 PM</label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="evening"
                        name="cleaningTime"
                        value="3:00PM - 4:00PM"
                        onChange={handleChange}
                        className="w-4 h-4 accent-primarytext"
                        required
                      />
                      <label htmlFor="evening" className="text-gray-600">3:00PM - 4:00PM</label>
                    </div>
                  </div>
                </motion.div>

              </div>)}

            {/* Questions Section */}
            <div className="space-y-8 p-6 bg-gradient-to-br from-red-900/40 to-red-800/40 rounded-xl backdrop-blur-md shadow-xl border border-red-800/30">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white pb-2">
                  🤔 Quick Questions for You
                </h3>
                <p className="text-gray-200 text-sm">Your answers help us serve you better</p>
              </div>

              {/* Multiple Choice Questions */}
              <div className="space-y-6">
                {questions.multipleChoice.map((question, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    key={question.id}
                    className="bg-white/10 p-6 rounded-lg border border-red-400/20 shadow-lg hover:shadow-red-900/20 transition-all duration-300 hover:scale-[1.01]"
                  >
                    <p className="text-white mb-5 font-semibold text-lg">
                      <span className="text-red-300 mr-2">Q{index + 1}.</span>
                      {question.questionText}
                    </p>
                    <div className="space-y-3 pl-4">
                      {question.options.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className="flex items-center p-3 hover:bg-red-900/50 rounded-lg cursor-pointer transition-all duration-200 group"
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option}
                            onChange={(e) => {
                              setFormData(prev => ({
                                ...prev,
                                answers: [
                                  ...prev.answers.filter(ans => !ans.startsWith(`${question.questionText}_`)),
                                  `${question.questionText}_${e.target.value}`
                                ]
                              }));
                            }}
                            className="w-5 h-5 accent-red-600 cursor-pointer"
                            required
                          />
                          <span className="text-white text-base font-medium ml-4 group-hover:text-red-200 transition-colors">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Fill Up Questions */}
              <div className="space-y-6">
                {questions.fillUp.map((question, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: (questions.multipleChoice.length + index) * 0.1 }}
                    key={question.id}
                    className="bg-white/10 p-6 rounded-lg border border-red-400/20 shadow-lg hover:shadow-red-900/20 transition-all duration-300 hover:scale-[1.01]"
                  >
                    <p className="text-white mb-5 font-semibold text-lg">
                      <span className="text-red-300 mr-2">Q{questions.multipleChoice.length + index + 1}.</span>
                      {question.questionText}
                    </p>
                    <input
                      type="text"
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          answers: [
                            ...prev.answers.filter(ans => !ans.startsWith(`${question.questionText}_`)),
                            `${question.questionText}_${e.target.value}`
                          ]
                        }));
                      }}
                      className="w-full px-5 py-4 bg-white/90 rounded-lg border-2 border-red-800/30 
               focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 
               placeholder-gray-500 text-gray-800 font-medium transition-all duration-300
               hover:bg-white"
                      placeholder="Type your answer here..."
                      required
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r bg-primarytext text-white  font-semibold rounded-md shadow-md hover:from-red-800 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-primarytext focus:ring-offset-2 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span className="min-w-[150px] text-center">{uploadProgress || "Submitting..."}</span>
                    </div>
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
