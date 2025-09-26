import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle2, MessageSquareWarning, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../Context/Authcontext';
import { motion } from "framer-motion";
import { Palmtree } from "lucide-react"
import imageCompression from "browser-image-compression";
import KiwiFinalLogo from '../components/assets/KiwiFinallogo.png';

const backend_url = import.meta.env.VITE_BACKEND_URL;

const GuestForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { auth_login } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [active, setActive] = useState(false);
  const [coverImage, setCoverImage] = useState('');
  // const [newQuestion, setNewQuestion] = useState('');
  const { rentalwiseguest, rentalwiseGuestSetup } = useContext(AuthContext);

  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // const [completedQuestions, setCompletedQuestions] = useState(new Set());
  // const questionsPerPage = 1;

  const [questions, setQuestions] = useState({
    multipleChoice: [],
    fillUp: []
  });

  const [uploadProgress, setUploadProgress] = useState('');
  // Geolocation state
  const [geoStatus, setGeoStatus] = useState('idle'); // 'idle', 'requesting', 'success', 'error'
  const [geoCoords, setGeoCoords] = useState(null); // { lat, lon }
  const [geoAddress, setGeoAddress] = useState(null); // address object
  // const uploadCounter = useRef({ completed: 0, total: 0 });

  // const getTotalQuestions = () => questions.multipleChoice.length + questions.fillUp.length;


  const tncText = `
    1. Stay Terms
    - I acknowledge that this property is privately owned. Kiwistays acts only as a facilitator between me and the property owner/host.

    2. Guest Responsibilities
    - I will use the property in a safe, respectful, and lawful manner.
    - Strictly prohibited: use/possession of illegal substances, unlawful gatherings, nuisance, or violence.
    - I am responsible for my actions and those of my accompanying guests.
    - Kiwistays may deny check-in or evict me without refund if I or my guests are found engaging in illegal, unsafe, or disruptive activities.

    3. Liability & Damages
    - Kiwistays and the property owner/host are not liable for any accident, injury, illness, loss, theft, damage, or incident during my stay.
    - I accept full responsibility for my own safety, health, and belongings.
    - Any damage to the property or its contents during my stay will be my financial responsibility and must be settled immediately.

    4. Indemnification & Governing Law
    I indemnify and hold harmless Kiwistays, its employees, agents, and the property owner/host from any claims or costs arising from my stay, except in cases of proven gross negligence. This agreement is governed by the laws of India and disputes fall under the courts of Goa.
  `;

  const [tncChecked, setTncChecked] = useState(false);


  const [showModal, setShowModal] = useState(false);
  const [modalAtBottom, setModalAtBottom] = useState(false);

  // Handler for scroll event in modal
  const handleModalScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setModalAtBottom(true);
    }
  };

  // Handler for confirming T&C after scroll
  const handleModalAcknowledge = () => {
    setTncChecked(true);
    setShowModal(false);
  };

  // Reset modalAtBottom when modal opens
  useEffect(() => {
    if (showModal) setModalAtBottom(false);
  }, [showModal]);

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchGuestData = async () => {
      const response = await axios.get(`${backend_url}/api/rentalwise/guest/684bcd37614707ee7923907d`);
      console.log("guest data:", response.data.data);
      rentalwiseGuestSetup(response.data.data);
    };

    const fetchPropertyName = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/admin/getproperty/name/${id}`);
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

    // Prompt for geolocation on page load
    const getGeolocation = async () => {
      setGeoStatus('requesting');
      setGeoCoords(null);
      setGeoAddress(null);
      try {
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            async pos => {
              setGeoStatus('success');
              const coords = {
                lat: pos.coords.latitude,
                lon: pos.coords.longitude
              };
              setGeoCoords(coords);
              // Fetch address from Nominatim
              try {
                const res = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lon}&format=json`
                );
                const addressData = await res.json();
                setGeoAddress(addressData);
              } catch (err) {
                setGeoAddress(null);
              }
              resolve();
            },
            err => {
              setGeoStatus('error');
              setGeoCoords(null);
              setGeoAddress(null);
              reject(err);
            },
            { timeout: 10000, enableHighAccuracy: true }
          );
        });
      } catch (err) {
        setGeoStatus('error');
      }
    };

    fetchGuestData();
    fetchPropertyName();
    getGeolocation();
  }, [id]);

  // Date defaults: today and tomorrow
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const formatDate = (date) => date.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    property_name: title,
    number_of_guests: 1,
    documents: [{ name: '', file: '', age: '', idCardType: '', gender: '' }],
    checkin: formatDate(today),
    checkout: formatDate(tomorrow),
    cleaningTime: '',
    answers: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Enhanced file handling with compression for files over 5MB
  // Enhanced file handling with compression for files over 5MB
  // Enhanced file handling with compression for files over 5MB - NO FILE TYPE RESTRICTIONS
  // Enhanced file handling with strict 10MB limit and compression for files over 5MB
  const handleDocumentChange = async (index, field, value) => {
    if (field === 'file' && value) {
      // Disallow Excel and Word files
      const forbiddenTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
      ];
      const forbiddenExtensions = ['.xls', '.xlsx', '.doc', '.docx'];
      const fileName = value.name.toLowerCase();
      if (
        forbiddenTypes.includes(value.type) ||
        forbiddenExtensions.some(ext => fileName.endsWith(ext))
      ) {
        alert('Excel and Word files are not allowed. Please upload a valid document or image.');
        // Clear only the current file input
        const fileInputs = document.querySelectorAll('input[type="file"]');
        if (fileInputs && fileInputs[index]) fileInputs[index].value = '';
        return;
      }

      // STRICT 10MB limit - reject files over 10MB
      if (value.size > 10 * 1024 * 1024) {
        alert(`File "${value.name}" exceeds the 10MB limit (${(value.size / 1024 / 1024).toFixed(2)}MB). Please choose a smaller file.`);
        // Clear only the current file input
        const fileInputs = document.querySelectorAll('input[type="file"]');
        if (fileInputs && fileInputs[index]) fileInputs[index].value = '';
        return;
      }

      // Compress files over 5MB threshold (only images)
      if (value.size > 5 * 1024 * 1024) {
        try {
          console.log(`File: ${value.name} (${(value.size / 1024 / 1024).toFixed(2)}MB) - Over 5MB, processing...`);

          // Only compress if it's an image file
          if (value.type.startsWith('image/')) {
            setUploadProgress(`Compressing ${value.name}...`);
            const options = {
              maxSizeMB: 3,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
              fileType: 'image/jpeg',
              initialQuality: 0.8
            };
            const compressedFile = await imageCompression(value, options);
            console.log(`Compressed from ${(value.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
            const finalFile = new File([compressedFile], value.name, {
              type: compressedFile.type,
              lastModified: Date.now()
            });
            const updatedDocuments = [...formData.documents];
            updatedDocuments[index] = { ...updatedDocuments[index], [field]: finalFile };
            setFormData({ ...formData, documents: updatedDocuments });
            setUploadProgress('');
          } else {
            // For non-image files over 5MB, warn user but allow upload (under 10MB)
            const proceed = window.confirm(
              `${value.name} is ${(value.size / 1024 / 1024).toFixed(2)}MB. Large files may take longer to upload. Continue?`
            );
            if (proceed) {
              const updatedDocuments = [...formData.documents];
              updatedDocuments[index] = { ...updatedDocuments[index], [field]: value };
              setFormData({ ...formData, documents: updatedDocuments });
            } else {
              // Clear only the current file input if user cancels
              const fileInputs = document.querySelectorAll('input[type="file"]');
              if (fileInputs && fileInputs[index]) fileInputs[index].value = '';
            }
          }
        } catch (error) {
          console.error('File processing failed:', error);
          alert('Failed to process file. Using original file.');
          const updatedDocuments = [...formData.documents];
          updatedDocuments[index] = { ...updatedDocuments[index], [field]: value };
          setFormData({ ...formData, documents: updatedDocuments });
          setUploadProgress('');
        }
      } else {
        // File is under 5MB, use as-is
        console.log(`File: ${value.name} (${(value.size / 1024 / 1024).toFixed(2)}MB) - Under 5MB, using original`);
        const updatedDocuments = [...formData.documents];
        updatedDocuments[index] = { ...updatedDocuments[index], [field]: value };
        setFormData({ ...formData, documents: updatedDocuments });
      }
    } else {
      // Handle non-file fields
      const updatedDocuments = [...formData.documents];
      updatedDocuments[index] = { ...updatedDocuments[index], [field]: value };
      setFormData({ ...formData, documents: updatedDocuments });
    }
  };

  const handleGuestCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    // Always create a new array of the correct length, copying existing data if present
    const updatedDocuments = Array.from({ length: count }, (_, i) => {
      const existing = formData.documents[i] || {};
      return {
        name: existing.name || '',
        file: existing.file || '',
        age: existing.age || '',
        idCardType: existing.idCardType || '',
        gender: existing.gender || ''
      };
    });
    setFormData({
      ...formData,
      number_of_guests: count,
      documents: updatedDocuments,
    });
  };

  // const resetForm = () => {
  //   setFormData({
  //     name: '',
  //     phone: '',
  //     property_name: '',
  //     number_of_guests: 1,
  //     documents: [],
  //     checkin: '',
  //     checkout: '',
  //     answers: [],
  //   });


  // Enhanced handleSubmit with retry logic and better error handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tncChecked) {
      setShowAlert(true);
      return;
    }
    setShowAlert(false);

    // Validate that all guests have files uploaded
    const missingFiles = formData.documents.filter(doc => !doc.file);
    if (missingFiles.length > 0) {
      alert(`Please upload documents for all guests. Missing files for ${missingFiles.length} guest(s).`);
      return;
    }

    // Validate file sizes before submission
    const oversizedFiles = formData.documents.filter(doc =>
      doc.file && doc.file.size > 10 * 1024 * 1024
    );

    if (oversizedFiles.length > 0) {
      alert("Some files exceed the 10MB limit. Please choose smaller files.");
      return;
    }

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
        answers: formData.answers
      },
      documents: formData.documents.map(doc => ({
        name: doc.name,
        age: doc.age,
        gender: doc.gender,
        idCardType: doc.idCardType,
        file: doc.file ? `File: ${doc.file.name} (${(doc.file.size / 1024 / 1024).toFixed(2)}MB)` : 'No file'
      })),
      geoCoords,
      geoAddress
    });

    // Use geolocation/address from state
    let locationData = geoAddress || {};

    // Helper for batching uploads
    async function batchUpload(uploadFns, batchSize = 3) {
      const results = [];
      for (let i = 0; i < uploadFns.length; i += batchSize) {
        const batch = uploadFns.slice(i, i + batchSize);
        setUploadProgress(`Uploading batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(uploadFns.length / batchSize)}...`);
        const batchResults = await Promise.allSettled(batch.map(fn => fn()));
        results.push(...batchResults);
      }
      return results;
    }

    try {
      // PHASE 1: Get Cloudinary signature
      const signatureResponse = await axios.get(`${backend_url}/api/guest/cloudinary/signature`);
      const { signature, timestamp, cloudName, apiKey } = signatureResponse.data;

      // PHASE 2: Batch uploads to Cloudinary
      const totalFiles = formData.documents.length;
      setUploadProgress(`Starting batch upload of ${totalFiles} documents...`);

      // Create upload functions for each document
      const uploadFns = formData.documents.map((doc, index) => async () => {
        const uploadData = new FormData();
        uploadData.append('file', doc.file);
        uploadData.append('api_key', apiKey);
        uploadData.append('timestamp', timestamp);
        uploadData.append('signature', signature);
        uploadData.append('folder', 'guest_documents');

        try {
          let uploadEndpoint;
          if (doc.file.type.startsWith('image/')) {
            uploadEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
          } else {
            uploadEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
            uploadData.append('resource_type', 'auto');
          }

          const uploadResponse = await axios.post(
            uploadEndpoint,
            uploadData,
            {
              timeout: 30000,
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(`Uploading documents... Document ${index + 1}: ${percentCompleted}%`);
              }
            }
          );

          return {
            success: true,
            index: index,
            data: {
              name: index === 0 ? formData.name : doc.name,
              age: doc.age,
              gender: doc.gender,
              idCardType: doc.idCardType,
              file: uploadResponse.data.secure_url
            }
          };
        } catch (error) {
          console.error(`❌ Upload failed for document ${index + 1}:`, error);
          return {
            success: false,
            index: index,
            error: error.message,
            docName: doc.name || `Document ${index + 1}`
          };
        }
      });

      // Run uploads in batches of 3
      const uploadResults = await batchUpload(uploadFns, 3);

      const uploadedDocs = [];
      const failedUploads = [];

      uploadResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          if (result.value.success) {
            uploadedDocs.push(result.value.data);
            console.log(`✅ Document ${index + 1} uploaded successfully`);
          } else {
            failedUploads.push(result.value);
            console.error(`❌ Document ${index + 1} failed:`, result.value.error);
          }
        } else {
          failedUploads.push({
            index: index,
            error: result.reason?.message || 'Unknown error',
            docName: `Document ${index + 1}`
          });
          console.error(`❌ Document ${index + 1} promise rejected:`, result.reason);
        }
      });

      setUploadProgress(`Uploaded ${uploadedDocs.length}/${totalFiles} documents successfully`);

      if (failedUploads.length > 0) {
        const failedNames = failedUploads.map(f => f.docName).join(', ');
        const continueAnyway = window.confirm(
          `${failedUploads.length} document(s) failed to upload: ${failedNames}\n\nDo you want to continue with the ${uploadedDocs.length} successfully uploaded documents?\n\nClick OK to continue, or Cancel to try again.`
        );
        if (!continueAnyway) {
          throw new Error('Upload cancelled by user due to failed documents');
        }
      }

      // PHASE 3: Send all guest info and documents in a single POST
      setUploadProgress("Finalizing registration...");
      const allGuestData = {
        name: formData.name,
        phone: formData.phone,
        property_name: title,
        number_of_guests: formData.number_of_guests,
        checkin: formData.checkin,
        checkout: formData.checkout,
        cleaningTime: formData.cleaningTime,
        answers: formData.answers,
        location: locationData,
        geoCoords: geoCoords,
        documents: uploadedDocs
      };

      const response = await axios.post(`${backend_url}/api/guest/create/${id}`, allGuestData);

      setUploadProgress("Registration completed successfully!");
      setIsSubmitted(true);
      setIsLoading(false);

      // Handle login and navigation
      auth_login(response.data.token, response.data.guestName, response.data.guestId, id, active);

      if (active) {
        navigate('/dashboard');
      } else {
        navigate("/thanks");
      }

    } catch (error) {
      console.error('Error in form submission:', error);
      setIsLoading(false);
      setUploadProgress('');

      // Enhanced error logging for debugging
      if (error.response) {
        console.error('Backend error response:', error.response);
        alert(`Backend error: ${error.response.status}\n${JSON.stringify(error.response.data)}`);
      } else if (error.message && error.message.includes('Upload cancelled by user')) {
        setUploadProgress('Upload cancelled');
      } else if (error.message && error.message.includes('timeout')) {
        alert('Upload timed out. Please check your internet connection and try again with smaller files.');
      } else if (error.message && error.message.includes('Network Error')) {
        alert('Network error occurred. Please check your internet connection and try again.');
      } else {
        alert('An error occurred during submission. Please try again. If the problem persists, try using smaller image files.');
      }
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-primarybg">
      {/* Geolocation status feedback */}
      {/* {geoStatus === 'requesting' && (
        <div className="text-blue-600 mb-2">Requesting your location...</div>
      )}
      {geoStatus === 'error' && (
        <div className="text-red-600 mb-2">Could not get your location. Please allow location access or check your browser settings.</div>
      )}
      {geoStatus === 'success' && geoAddress && (
        <div className="text-green-700 mb-2 text-xs">Location detected: {geoAddress.display_name}</div>
      )} */}
      {!active && isSubmitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-2">
            <CheckCircle2 className="text-primarybanner w-6 h-6" />
            <span className="text-primarybanner font-semibold">
              Document submitted successfully!
            </span>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left p-8 bg-gradient-to-r md:from-primarybanner md:to-primarybanner">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 mb-4">
            <img
              src={KiwiFinalLogo}
              alt="Kiwi Stays Logo"
              className="w-28 h-28 md:w-32 md:h-32 lg:w-28 lg:h-28 object-contain rounded-full shadow-lg shadow-black/30 bg-white/20 p-3 backdrop-blur-sm border border-white/20"
            />
            <h1 className="text-4xl md:text-5xl lg:text-4xl font-semibold text-primarybanner lg:text-white drop-shadow-lg">
              Welcome to KiwiStays
            </h1>
          </div>

          <p className="text-xl md:text-xl lg:text-xl text-green-600 lg:text-white mt-4 drop-shadow-md">
            Your perfect getaway begins here
          </p>

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
            <h2 className="text-green-600 lg:text-white mt-4 text-xl font-semibold">
              {title}
            </h2>
            <span className="text-green-600 lg:text-white text-lg font-bold">Scroll down to fill the form</span>
            <span className="text-green-600 lg:text-white text-2xl mt-2">↓</span>
          </motion.div>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/20 backdrop-blur-md">
          <div className="bg-gradient-to-r from-primarybanner to-primarybanner p-6 flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-white">Guest Registration</h2>
            <Palmtree className="text-white w-8 h-8" />
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 md:px-10 md:max-h-[70vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <label className="block text-md font-bold text-secondarytext mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-primarybanner/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarybanner focus:border-transparent bg-white/70"
                  placeholder="Your full name"
                  required
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <label className="block text-sm font-bold text-secondarytext mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,10}$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  className="w-full px-3 py-2 border border-primarybanner/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarybanner focus:border-transparent bg-white/70"
                  placeholder="Your phone number"
                  required
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <label className="block text-sm font-bold text-secondarytext mb-1">Property Name</label>
                <input
                  type="text"
                  name="property_name"
                  value={title}
                  readOnly
                  className="w-full px-3 py-2 border border-primarybanner/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarybanner focus:border-transparent bg-white/70 bg-gray-100 cursor-not-allowed"
                  placeholder="Property Name"
                  required
                />
              </motion.div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <label className="block text-sm font-bold text-secondarytext mb-1">Number of Guests</label>
              <select
                name="number_of_guests"
                value={formData.number_of_guests}
                onChange={handleGuestCountChange}
                className="w-full px-3 py-2 border border-primarybanner/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarybanner focus:border-transparent bg-white/70"
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
                <h3 className="text-lg font-bold text-secondarytext">Guest {index + 1} Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={index == 0 ? (formData.name) : doc.name}
                    onChange={(e) => handleDocumentChange(index, "name", e.target.value)}
                    className="w-full px-3 py-2 border border-primarybanner/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarybanner focus:border-transparent bg-white/70"
                    placeholder="Full name"
                    required
                  />
                  <input
                    type="number"
                    value={doc.age}
                    onChange={(e) => handleDocumentChange(index, "age", e.target.value)}
                    className="w-full px-3 py-2 border border-primarybanner/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarybanner focus:border-transparent bg-white/70"
                    placeholder="Age"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <select
                    value={doc.gender}
                    onChange={(e) => handleDocumentChange(index, "gender", e.target.value)}
                    className="w-full px-3 py-2 border border-primarybanner/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarybanner focus:border-transparent bg-white/70"
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
                    className="w-full px-3 py-2 border border-primarybanner/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarybanner focus:border-transparent bg-white/70"
                    required
                  >
                    <option value="">Select ID Type</option>
                    <option value="passport">Passport</option>
                    <option value="driverLicense">Driver's License</option>
                    <option value="nationalId">Adhar Card</option>
                    <option value="voterId">Voter Id Card</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <h6 className="font-medium text-sm text-secondarytext bg-primarytextlight/40 p-2 rounded">
                    📁 Max file size: 10MB <br />
                    🔄 Files over 5MB will be automatically compressed (images only)<br />
                  </h6>
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        handleDocumentChange(index, "file", file);
                      }
                    }}
                    className="w-full px-3 py-2 border border-primarybanner/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarybanner focus:border-transparent bg-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primarybanner file:text-white hover:file:bg-secondarytext"
                    required
                  />

                  {doc.file && (
                    <div className="text-xs text-secondarytext bg-primarytextlight/30 p-2 rounded">
                      ✅ {doc.file.name} ({(doc.file.size / 1024 / 1024).toFixed(2)}MB)
                      {doc.file.type.startsWith('image/') && (
                        <span className="text-primarybanner ml-2">📷 Image</span>
                      )}
                      {doc.file.size > 5 * 1024 * 1024 && doc.file.type.startsWith('image/') && (
                        <span className="text-primarytextlight ml-2">🔄 Compressed</span>
                      )}
                    </div>
                  )}

                  {!doc.file && (
                    <div className="text-xs text-primarybanner bg-primarybanner/20 p-2 rounded">
                      ⚠️ Please select a document file for Guest {index + 1}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <label className="block text-sm font-medium text-secondarytext mb-1">Check-in Date</label>
                <input
                  type="date"
                  name="checkin"
                  value={formData.checkin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-primarybanner/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarybanner focus:border-transparent bg-white/70"
                  required
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <label className="block text-sm font-bold text-secondarytext mb-1">Check-out Date</label>
                <input
                  type="date"
                  name="checkout"
                  value={formData.checkout}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-primarybanner/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primarybanner focus:border-transparent bg-white/70"
                  required
                />
              </motion.div>
            </div>

            <div className='flex flex-row gap-1'>
              <label>
                <input
                  type="checkbox"
                  checked={tncChecked}
                  onChange={e => setTncChecked(e.target.checked)}
                />
                I accept Terms and Conditions.
              </label>

              <button type="button" onClick={() => setShowModal(true)}>
                <div className='text-blue-600'>Read Terms</div>
              </button>
            </div>

            {calculateDateDifference(formData.checkin, formData.checkout) > 2 && (
              <div>
                <motion.div className="space-y-4">
                  <label className="block text-md font-bold text-secondarytext mb-3">Select preferred cleaning time during your stay</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="morning"
                        name="cleaningTime"
                        value="9:30AM - 10:30AM"
                        onChange={handleChange}
                        className="w-4 h-4 accent-primarybanner"
                        required
                      />
                      <label htmlFor="morning" className="text-secondarytext">9:30 AM - 10:30 AM</label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="afternoon"
                        name="cleaningTime"
                        value="10:30AM - 11:30AM"
                        onChange={handleChange}
                        className="w-4 h-4 accent-primarybanner"
                        required
                      />
                      <label htmlFor="afternoon" className="text-secondarytext">10:30 AM - 11:30 AM</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="afternoon2"
                        name="cleaningTime"
                        value="2:00PM - 3:00 PM"
                        onChange={handleChange}
                        className="w-4 h-4 accent-primarybanner"
                        required
                      />
                      <label htmlFor="afternoon2" className="text-secondarytext">2:00 PM - 3:00 PM</label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="evening"
                        name="cleaningTime"
                        value="3:00PM - 4:00PM"
                        onChange={handleChange}
                        className="w-4 h-4 accent-primarybanner"
                        required
                      />
                      <label htmlFor="evening" className="text-secondarytext">3:00PM - 4:00PM</label>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Questions Section */}
            <div className="space-y-8 p-6 bg-gradient-to-br from-primarybanner/50 to-primarybanner/50 rounded-xl backdrop-blur-md shadow-xl border border-primarybanner/30">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white pb-2">
                  🤔 Quick Questions for You
                </h3>
                <p className="text-gray-200 text-sm font-bold">Your answers help us serve you better</p>
              </div>

              {/* Multiple Choice Questions */}
              <div className="space-y-6">
                {questions.multipleChoice.map((question, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    key={question.id}
                    className="bg-white/10 p-6 rounded-lg border border-primarybanner/20 shadow-lg hover:shadow-primarybanner/20 transition-all duration-300 hover:scale-[1.01]"
                  >
                    <p className="text-secondarytext mb-5 font-semibold text-lg">
                      <span className="text-secondarytext mr-2">Q{index + 1}.</span>
                      {question.questionText}
                    </p>
                    <div className="space-y-3 pl-4">
                      {question.options.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className="flex items-center p-3 hover:bg-secondarytext/50 rounded-lg cursor-pointer transition-all duration-200 group"
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
                            className="w-5 h-5 accent-secondarytext cursor-pointer"
                            required
                          />
                          <span className="text-secondarytext text-base font-medium ml-4 group-hover:text-white transition-colors">
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
                    className="bg-white/10 p-6 rounded-lg border border-primarybanner/20 shadow-lg hover:shadow-primarybanner/20 transition-all duration-300 hover:scale-[1.01]"
                  >
                    <p className="text-secondarytext mb-5 font-semibold text-lg">
                      <span className="text-secondarytext mr-2">Q{questions.multipleChoice.length + index + 1}.</span>
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
                      className="w-full px-5 py-4 bg-white/90 rounded-lg border-2 border-primarybanner/30 
                        focus:outline-none focus:border-secondarytext focus:ring-2 focus:ring-secondarytext/50 
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
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                className="px-6 py-3 bg-gradient-to-r bg-primarybanner text-white font-semibold rounded-md shadow-md hover:from-secondarytext hover:to-secondarytext focus:outline-none focus:ring-2 focus:ring-secondarytext focus:ring-offset-2 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
              >
                {isLoading ? (
                  <div className="flex flex-col items-center space-y-1">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span className="text-sm">Processing...</span>
                    </div>
                    {uploadProgress && (
                      <span className="text-xs text-primarytextlight max-w-[180px] truncate">
                        {uploadProgress}
                      </span>
                    )}
                  </div>
                ) : (
                  "Submit Registration"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 50
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-0 w-[95vw] max-w-md flex flex-col border-2 border-primarybanner animate-fadeIn"
            style={{ minHeight: 420 }}
          >
            <div className="bg-primarybanner rounded-t-2xl px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Terms &amp; Conditions</h3>
            </div>
            <div
              className="flex-1 overflow-y-auto px-6 py-4 text-gray-700 text-sm leading-relaxed border-b border-primarybanner/20"
              style={{ maxHeight: 260, minHeight: 180, background: '#f9fafb' }}
              onScroll={handleModalScroll}
            >
              <div className="flex flex-col gap-3">
                {tncText.split('\n').map((line, idx) => (
                  <p key={idx} className="text-sm">{line.trim()}</p>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 flex flex-col items-center gap-2 bg-white rounded-b-2xl">
              <span className="text-xs text-primarybanner font-semibold mb-1">
                Please scroll to the bottom to enable the confirmation button.
              </span>
              <button
                className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors duration-200 shadow-md ${modalAtBottom ? 'bg-primarybanner text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                disabled={!modalAtBottom}
                onClick={handleModalAcknowledge}
              >
                I have read the T&amp;C
              </button>
            </div>
          </div>
        </div>
      )}
      {showAlert && (
        <div className="fixed top-0 left-0 w-full flex justify-center z-50">
          <div className="bg-red-100 border border-red-400 p-4 rounded flex items-center gap-2 text-red-700">
            <MessageSquareWarning className="w-6 h-6" />
            <span>It is mandatory to read and accept the terms in order to proceed.</span>
            <button className="ml-2 text-xs underline" onClick={() => setShowAlert(false)}><X /></button>
          </div>
        </div>
      )}
    </div>
  );

};

export default GuestForm;