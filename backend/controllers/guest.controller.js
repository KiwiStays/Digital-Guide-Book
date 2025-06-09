// import { uploadToCloudinary } from '../utils/cloudinary.js';
// import { Guestmodel } from '../models/Guest.model.js';
// import { Propertymodel } from '../models/Property.model.js';
// import jwt from 'jsonwebtoken';
// import cloudinary from 'cloudinary';

// const secretKey = process.env.JWT_SECRET;

// const generateToken = (userId, checkOutDate) => {
//   return jwt.sign(
//       { userId, 
//         exp: Math.floor(new Date(checkOutDate).getTime() / 1000) 
//         // exp: Math.floor(Date.now() / 1000) + 10
//         // exp:Math.floor(Date.now() / 1000) + 10
//       },
//       secretKey
//   );
// };

// // mongoose.connection.once('open', () => {
// //   const changeStream = Guestmodel.watch();
// //   changeStream.on('change', (change) => {
// //       if (change.operationType === 'delete') {
// //           console.log(`Guest document deleted:`, change.documentKey);
// //       }
// //   });
// // });

// // export const VerifyGuest = async (req, res)=>{
// //     try {
// //         const {id} = req.params;
// //         const { name, phone, property_name, number_of_guests, checkin, checkout } = req.body;

// //         const checkin_new =checkin.split('T')[0];
// //         const checkout_new =checkout.split('T')[0];

// //         let DocUrls = [];
// //         if (req.files && req.files.length > 0) {
// //           const documentsData = JSON.parse(req.body.Document || '[]'); // Parse document names

// //           DocUrls = await Promise.all(
// //             req.files.map(async (file, index) => {
// //               // const username = documentsData[index]?.name + checkin_new + checkout_new  || 'Unnamed';
// //               const username = (documentsData[index]?.name + " "+ checkin_new +" "+ checkout_new) || 'Unnamed';


// //               const filepath = file.path;
// //               const cloud_data = await uploadToCloudinary(filepath, username); // Wait for Cloudinary upload

// //               return { name: username, file: cloud_data.url }; // Return the object for DocUrls
// //             })
// //           );
// //         }

// //         // console.log(documentsData.name);
// //         const documents = DocUrls.map((item, index) => ({
// //           name: item.name|| 'Unnamed', // Ensure the name exists
// //           file: item.file, // File path from multer
// //         }));

// //         // Create a new guest entry
// //         const guest = new Guestmodel({
// //           place_id:id,
// //           name,
// //           phone,
// //           property_name,
// //           number_of_guests,
// //           Document: documents,
// //           checkin,
// //           checkout,
// //         });
// //         const token = generateToken(guest._id,checkout);
// //         guest.token = token;
// //         await guest.save();
// //         console.log("Guest Saved Successfully!!");

// //         res.status(201).json({ message: 'Guest created successfully', token, guestId: guest._id, guestName: guest.name  });
// //       } catch (error) {
// //         console.error('Error:', error);
// //         res.status(500).json({ message: 'Server Error', error });
// //       }
// // }

// // export const VerifyGuest = async (req, res)=>{
// //   try {
// //       const {id} = req.params;
// //       const { name, phone, property_name, number_of_guests, checkin, checkout,cleaningTime } = req.body;
// //       // console.log("req body",req.body);

// //       // console.log("req files",req.files); 

// //       const existingGuest = await Guestmodel.findOne({ phone: phone });
// //       if (existingGuest) {
// //         console.log("Phone number already exists, please use a different number or login.");
// //         return res.status(402).json({ message: 'Phone number already exists, please use a different number or login.' });
// //       }


// //       const checkin_new = checkin.split('T')[0];
// //       const checkout_new = checkout.split('T')[0];

// //       let DocUrls = [];
// //       if (req.files && req.files.length > 0) {
// //         const documentsData = JSON.parse(req.body.Document || '[]'); // Parse document names

// //         DocUrls = await Promise.all(
// //           req.files.map(async (file, index) => {
// //             // const username = documentsData[index]?.name + checkin_new + checkout_new  || 'Unnamed';
// //             const username = (documentsData[index]?.name + " " + checkin_new + " " + checkout_new) || file.originalname;
// //             const gender = documentsData[index]?.gender;
// //             const idCardType = documentsData[index]?.idCardType;
// //             const age = documentsData[index]?.age;
// //             const filepath = file.path;
// //             const cloud_data = await uploadToCloudinary(filepath, username); // Wait for Cloudinary upload

// //             return { name: documentsData[index]?.name, file: cloud_data.url,gender: gender, idCardType: idCardType, age: age }; // Return the object for DocUrls
// //           })
// //         );
// //       }

// //       // console.log(documentsData.name);
// //       const documents = DocUrls.map((item) => ({
// //         name: item.name || 'Unnamed', // Ensure the name exists
// //         file: item.file, // File path from multer
// //         gender:item.gender, // Gender
// //         age: item.age || 0 ,
// //         idcard: item.idCardType || ' ',
// //       }));

// //       // Create a new guest entry
// //       const guest = new Guestmodel({
// //         place_id:id,
// //         name,
// //         phone,
// //         property_name,
// //         number_of_guests,
// //         Document: documents,
// //         checkin,
// //         checkout,
// //         cleaningTime,
// //       });
// //       const token = generateToken(guest._id,checkout);
// //       guest.token = token;
// //       await guest.save();
// //       // console.log("guest ", guest);
// //       console.log("Guest Saved Successfully!!");

// //       res.status(201).json({ message: 'Guest created successfully', token, guestId: guest._id, guestName: guest.name  });
// //     } catch (error) {
// //       console.error('Error:', error);
// //       res.status(500).json({ message: 'Server Error', error });
// //     }
// // }

// // 1. Controller for creating guest with basic info
// export const CreateGuest = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("id", id);
//     console.log("req body", req.body);
//     const { name, phone, property_name, number_of_guests, checkin, checkout, cleaningTime,answers } = req.body;

//     const existingGuest = await Guestmodel.findOne({ phone: phone });
//     if (existingGuest) {
//       return res.status(402).json({ message: 'Phone number already exists, please use a different number or login.' });
//     }

//     // Create a new guest entry with empty documents array
//     const guest = new Guestmodel({
//       place_id: id,
//       name,
//       phone,
//       property_name,
//       number_of_guests,
//       Document: [], // Empty initially
//       checkin,
//       checkout,
//       cleaningTime,
//       answers, // Initialize answers as an empty array
//     });

//     const token = generateToken(guest._id, checkout);
//     guest.token = token;
//     await guest.save();

//     res.status(201).json({ 
//       message: 'Guest created successfully', 
//       token, 
//       guestId: guest._id, 
//       guestName: guest.name 
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };
//  // 2. Controller for updating documents after they're uploaded to Cloudinary
// export const UpdateGuestDocuments = async (req, res) => {
//   try {
//     const { guestId } = req.params;
//     const { documents } = req.body;

//     // Format documents to match your schema
//     const formattedDocuments = documents.map(doc => ({
//       name: doc.name || 'Unnamed',
//       file: doc.file,
//       gender: doc.gender,
//       age: doc.age || 0,
//       idcard: doc.idCardType || ' ',
//     }));

//     // Update the guest record with document information
//     const updatedGuest = await Guestmodel.findByIdAndUpdate(
//       guestId,
//       { Document: formattedDocuments },
//       { new: true }
//     );

//     if (!updatedGuest) {
//       return res.status(404).json({ message: 'Guest not found' });
//     }

//     res.status(200).json({ 
//       message: 'Documents updated successfully',
//       guest: updatedGuest
//     });
//   } catch (error) {
//     console.error('Error updating documents:', error);
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

// // 3. Controller for generating Cloudinary signatures
// export const getCloudinarySignature = async (req, res) => {
//   try {
//     const timestamp = Math.round(new Date().getTime() / 1000);
//     const signature = cloudinary.utils.api_sign_request({
//       timestamp: timestamp,
//       folder: 'guest_documents'
//     }, process.env.CLOUDINARY_API_SECRET);

//     res.status(200).json({
//       signature,
//       timestamp,
//       cloudName: process.env.CLOUDINARY_CLOUD_NAME,
//       apiKey: process.env.CLOUDINARY_API_KEY
//     });
//   } catch (error) {
//     console.error('Error generating signature:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// // export const guestinfo = async (req, res) => {
// //  

// // export const guestinfo = async (req, res) => {
// //   try {
// //     const { startDate, endDate, propertyName } = req.query;
// //     console.log("startDate",startDate);
// //     console.log("endDate",endDate);
// //     const filter = {};

// //     // Date range filter
// //     if (startDate && endDate) {
// //       filter.checkin = {
// //         $gte: new Date(startDate),
// //         $lte: new Date(endDate),
// //       };
// //       filter.checkout = {
// //         $gte: new Date(startDate),
// //         $lte: new Date(endDate),
// //       };
// //     }


// //     if(startDate){
// //       filter.checkin = {
// //         $gte: new Date(startDate),
// //       };
// //       filter.checkout = {
// //         $gte: new Date(startDate),
// //       }
// //     }

// //     if(endDate && !startDate){
// //       filter.checkin = {
// //         $lte: new Date(endDate),
// //       };
// //       filter.checkout = {
// //         $lte: new Date(endDate),
// //       } 
// //     }




// //     // Property name filter
// //     if (propertyName) {
// //       // Find properties whose title matches propertyName (case-insensitive)
// //       const matchedProperties = await Propertymodel.find({
// //         title: { $regex: propertyName, $options: 'i' },
// //       }).select('_id');
// //       const matchedPropertyIds = matchedProperties.map((prop) => prop._id);

// //       // Include only guests with those property IDs
// //       filter.place_id = { $in: matchedPropertyIds };
// //     }

// //     // Fetch guests given the combined filter
// //     const guests = await Guestmodel.find(filter);

// //     // Fetch place details (title) for each guest
// //     const guestsWithPlaceDetails = await Promise.all(
// //       guests.map(async (guest) => {
// //         const place = await Propertymodel
// //           .findById(guest.place_id)
// //           .select('title'); // or whatever field holds the property's name

// //         return {
// //           ...guest._doc,
// //           place_name: place ? place.title : 'Unknown',
// //         };
// //       })
// //     );

// //     res.status(200).json(guestsWithPlaceDetails);
// //   } catch (error) {
// //     console.error('Error fetching guests:', error.message);
// //     res.status(500).json({ error: 'Error fetching guests', details: error.message });
// //   }
// // };

// export const guestinfo = async (req, res) => {
//   try {
//     const { startDate, endDate, propertyName } = req.query;
//     console.log("Query params:", { startDate, endDate, propertyName });

//     const filter = {};

//     // Date filtering
//     if (startDate || endDate) {
//       filter.$or = [];

//       if (startDate && endDate) {
//         // Find stays that overlap with the date range
//         filter.$or.push({
//           $and: [
//             { checkin: { $lte: new Date(endDate) } },
//             { checkout: { $gte: new Date(startDate) } }
//           ]
//         });
//       } else if (startDate) {
//         // Find stays that start on or after startDate
//         filter.$or.push({
//           checkin: { $gte: new Date(startDate) }

//         });
//         // filter.$or.push({
//         //   checkout: { $gte: new Date(startDate) }

//         // });

//       } 

//       else if (endDate) {
//         // Find stays that end on or before endDate
//         filter.$or.push({
//           checkout: { $lte: new Date(endDate) }
//         });
//       }
//     }

//     // Property name filter
//     if (propertyName) {
//       const matchedProperties = await Propertymodel.find({
//         title: { $regex: propertyName, $options: 'i' }
//       }).select('_id');

//       const matchedPropertyIds = matchedProperties.map(prop => prop._id);
//       filter.place_id = { $in: matchedPropertyIds };
//     }

//     console.log("Final filter:", JSON.stringify(filter, null, 2));

//     // Fetch filtered guests
//     const guests = await Guestmodel.find(filter);
//     console.log(`Found ${guests.length} guests`);

//     // Add property details
//     const guestsWithPlaceDetails = await Promise.all(
//       guests.map(async (guest) => {
//         const place = await Propertymodel
//           .findById(guest.place_id)
//           .select('title');

//         return {
//           ...guest._doc,
//           property_name: place?.title || 'Unknown'
//         };
//       })
//     );

//     res.status(200).json(guestsWithPlaceDetails);

//   } catch (error) {
//     console.error('Error in guestinfo:', error);
//     res.status(500).json({ 
//       error: 'Error fetching guests', 
//       details: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// };


// export const GuestinfoById = async (req, res) =>{
//   try {
//     const { id } = req.params;
//     const user = await Guestmodel.findById(id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.status(200).json({ data: user });
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // export const UpdateGuestbyid = async (req, res) => { 
// //   try {
// //     const { id } = req.params;
// //     console.log("id",id);
// //     const { name, phone, property_name, number_of_guests, checkin, checkout } = req.body;
// //     console.log("req body", req.body);

// //     const updatedUser = await Guestmodel.findByIdAndUpdate(
// //       id,
// //       {
// //         name,
// //         phone,
// //         property_name,
// //         number_of_guests,
// //         checkin,
// //         checkout,
// //       },
// //       { new: true } // Return the updated document
// //     );

// //     if (!updatedUser) {
// //       return res.status(404).json({ message: 'User not found' });
// //     }

// //     res.status(200).json({ message: 'User updated successfully', data: updatedUser });
// //   } catch (error) {
// //     console.error('Error updating user:', error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };


// export const updateGuest = async (req, res) => {
//   try {
//     const { id } = req.params; // Guest ID from URL
//     const { name, phone, property_name, number_of_guests, checkin, checkout , place_id } = req.body;
//     console.log("req body", req.body);

//     const checkin_new = checkin?.split('T')[0];
//     const checkout_new = checkout?.split('T')[0];

//     let DocUrls = [];
//     if (req.files && req.files.length > 0) {
//       const documentsData = JSON.parse(req.body.Document || '[]'); // Parse document names

//       DocUrls = await Promise.all(
//         req.files.map(async (file, index) => {
//           const username = (documentsData[index]?.name + " " + checkin_new + " " + checkout_new) || 'Unnamed';
//           const filepath = file.path;
//           const gender = documentsData[index]?.gender;
//           const idCardType = documentsData[index]?.idCardType;
//           const age = documentsData[index]?.age;
//           const cloud_data = await uploadToCloudinary(filepath, username); // Upload file to Cloudinary

//           return { name: documentsData[index]?.name, file: cloud_data.url,gender: gender, idCardType: idCardType, age: age}; // Return the object for DocUrls
//         })
//       );
//     }

//     // Prepare updated documents
//     const documents = DocUrls.map((item, index) => ({
//       name: item.name || 'Unnamed', // Ensure the name exists
//       file: item.file, // File path from Cloudinary
//       gender:item.gender, // Gender
//       age: item.age || 0 ,
//       idcard: item.idCardType || ' ',
//     }));

//     // Find and update the guest
//     const guest = await Guestmodel.findById(id);
//     if (!guest) {
//       return res.status(404).json({ message: 'Guest not found' });
//     }

//     // Update guest fields
//     guest.name = name || guest.name;
//     guest.phone = phone || guest.phone;
//     guest.property_name = property_name || guest.property_name;
//     guest.number_of_guests = number_of_guests || guest.number_of_guests;
//     guest.checkin = checkin || guest.checkin;
//     guest.checkout = checkout || guest.checkout;
//     guest.place_id = place_id || guest.place_id;

//     // Append new documents to existing ones
//     if (documents.length > 0) {
//       guest.Document = [...guest.Document, ...documents];
//     }

//     // Generate a new token if check-out date changes
//     if (checkout && checkout !== guest.checkout) {
//       guest.token = generateToken(guest._id, checkout);
//     }

//     await guest.save(); // Save updated guest to the database

//     console.log("Guest Updated Successfully!!");
//     res.status(200).json({
//       message: 'Guest updated successfully',
//       guest,
//     });
//   } catch (error) {
//     console.error('Error updating guest:', error);
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };


import { uploadToCloudinary } from '../utils/cloudinary.js';
import { Guestmodel } from '../models/Guest.model.js';
import { Propertymodel } from '../models/Property.model.js';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';

const secretKey = process.env.JWT_SECRET;
const uploadAttempts = new Map();

// const checkRateLimit = (ip) => {
//   const now = Date.now();
//   const attempts = uploadAttempts.get(ip) || [];
  
//   // Remove attempts older than 1 minute
//   const recentAttempts = attempts.filter(time => now - time < 60000);
  
//   if (recentAttempts.length >= 10) { // Max 10 uploads per minute
//     return false;
//   }
  
//   recentAttempts.push(now);
//   uploadAttempts.set(ip, recentAttempts);
//   return true;
// };

// Enhanced rate limiting configuration
const RATE_LIMITS = {
  GUEST_CREATION: {
    MAX_ATTEMPTS: 5,
    WINDOW_MS: 60000
  },
  FILE_UPLOAD: {
    MAX_ATTEMPTS: 15, // Increased for better throughput
    WINDOW_MS: 60000
  },
  DOCUMENT_UPDATE: {
    MAX_ATTEMPTS: 10,
    WINDOW_MS: 60000
  },
  GENERAL: {
    MAX_ATTEMPTS: 20,
    WINDOW_MS: 60000
  }
};

// Separate rate limit maps
const guestCreationAttempts = new Map();
const fileUploadAttempts = new Map();
const documentUpdateAttempts = new Map();
const generalAttempts = new Map();

const checkRateLimit = (ip, operation = 'GENERAL') => {
  const now = Date.now();
  const config = RATE_LIMITS[operation];
  
  let attemptsMap;
  switch (operation) {
    case 'GUEST_CREATION':
      attemptsMap = guestCreationAttempts;
      break;
    case 'FILE_UPLOAD':
      attemptsMap = fileUploadAttempts;
      break;
    case 'DOCUMENT_UPDATE':
      attemptsMap = documentUpdateAttempts;
      break;
    default:
      attemptsMap = generalAttempts;
  }
  
  const attempts = attemptsMap.get(ip) || [];
  const recentAttempts = attempts.filter(time => now - time < config.WINDOW_MS);
  
  if (recentAttempts.length >= config.MAX_ATTEMPTS) {
    console.log(`🚫 Rate limit exceeded for ${ip} - ${operation}: ${recentAttempts.length}/${config.MAX_ATTEMPTS}`);
    return false;
  }
  
  recentAttempts.push(now);
  attemptsMap.set(ip, recentAttempts);
  return true;
};

// Configuration constants
// Optimized configuration
const UPLOAD_LIMITS = {
  MAX_FILES: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // Increased to 15MB per file
  MAX_TOTAL_SIZE: 100 * 1024 * 1024, // Increased to 100MB total
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/heic',
    'image/heif',
    'application/pdf'
  ],
  CONCURRENT_UPLOADS: 5, // Increased concurrent uploads
  BATCH_SIZE: 3, // Smaller batches for faster processing
  RETRY_ATTEMPTS: 2, // Add retry logic
  TIMEOUT_MS: 30000 // 30 second timeout per upload
};

const generateToken = (userId, checkOutDate) => {
  return jwt.sign(
    {
      userId,
      exp: Math.floor(new Date(checkOutDate).getTime() / 1000)
    },
    secretKey
  );
};

// Helper function to validate file uploads
const validateFiles = (files) => {
  const errors = [];

  if (!files || files.length === 0) {
    return { isValid: true, errors: [] }; // No files is okay
  }

  if (files.length > UPLOAD_LIMITS.MAX_FILES) {
    errors.push(`Maximum ${UPLOAD_LIMITS.MAX_FILES} files allowed`);
  }

  let totalSize = 0;
  files.forEach((file, index) => {
    // Check file size
    if (file.size > UPLOAD_LIMITS.MAX_FILE_SIZE) {
      errors.push(`File ${index + 1} exceeds ${UPLOAD_LIMITS.MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
    }

    // Check file type
    if (!UPLOAD_LIMITS.ALLOWED_TYPES.includes(file.mimetype)) {
      errors.push(`File ${index + 1} has unsupported type: ${file.mimetype}`);
    }

    totalSize += file.size;
  });

  if (totalSize > UPLOAD_LIMITS.MAX_TOTAL_SIZE) {
    errors.push(`Total upload size exceeds ${UPLOAD_LIMITS.MAX_TOTAL_SIZE / (1024 * 1024)}MB limit`);
  }

  return { isValid: errors.length === 0, errors };
};

// Helper function to process uploads in batches
// Enhanced batch processing with retry logic
const processUploadsInBatches = async (files, documentsData, checkin_new, checkout_new) => {
  const results = [];
  const batchSize = UPLOAD_LIMITS.BATCH_SIZE; // Smaller batches
  
  console.log(`🚀 Starting batch upload of ${files.length} files in batches of ${batchSize}`);
  
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(files.length / batchSize);
    
    console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} files)`);
    
    const batchPromises = batch.map(async (file, batchIndex) => {
      const actualIndex = i + batchIndex;
      const docData = documentsData[actualIndex];
      
      if (!docData) {
        throw new Error(`Missing document data for file at index ${actualIndex}`);
      }
      
      const username = `${docData.name} ${checkin_new} ${checkout_new}`.trim() || file.originalname;
      
      // Retry logic for individual uploads
      for (let attempt = 1; attempt <= UPLOAD_LIMITS.RETRY_ATTEMPTS; attempt++) {
        try {
          console.log(`📤 Uploading file ${actualIndex + 1}/${files.length}: ${username} (Attempt ${attempt})`);
          
          // Add timeout to upload
          const uploadPromise = uploadToCloudinary(file.path, username);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Upload timeout')), UPLOAD_LIMITS.TIMEOUT_MS)
          );
          
          const cloud_data = await Promise.race([uploadPromise, timeoutPromise]);
          
          console.log(`✅ Successfully uploaded: ${username}`);
          
          return {
            name: docData.name,
            file: cloud_data.url,
            gender: docData.gender,
            idCardType: docData.idCardType,
            age: docData.age
          };
          
        } catch (uploadError) {
          console.error(`❌ Upload attempt ${attempt} failed for file ${actualIndex + 1}:`, uploadError.message);
          
          if (attempt === UPLOAD_LIMITS.RETRY_ATTEMPTS) {
            throw new Error(`Upload failed after ${UPLOAD_LIMITS.RETRY_ATTEMPTS} attempts: ${docData.name || file.originalname} - ${uploadError.message}`);
          }
          
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    });
    
    try {
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      console.log(`✅ Batch ${batchNumber}/${totalBatches} completed successfully`);
      
      // Small delay between batches to prevent overwhelming the server
      if (i + batchSize < files.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
    } catch (error) {
      console.error(`❌ Batch ${batchNumber} failed:`, error);
      throw error;
    }
  }
  
  console.log(`🎉 All uploads completed successfully: ${results.length} files`);
  return results;
};
export const CreateGuest = async (req, res) => {
  try {
     if (!checkRateLimit(req.ip)) {
      return res.status(429).json({ 
        message: 'Too many guest creation attempts. Please try again later.' 
      });
    }
    const { id } = req.params;
    const { name, phone, property_name, number_of_guests, checkin, checkout, cleaningTime, answers } = req.body;

    // Validate required fields
    if (!name || !phone || !checkin || !checkout) {
      return res.status(400).json({
        message: 'Missing required fields: name, phone, checkin, checkout'
      });
    }

    const existingGuest = await Guestmodel.findOne({ phone: phone });
    if (existingGuest) {
      return res.status(402).json({
        message: 'Phone number already exists, please use a different number or login.'
      });
    }

    const guest = new Guestmodel({
      place_id: id,
      name,
      phone,
      property_name,
      number_of_guests,
      Document: [],
      checkin,
      checkout,
      cleaningTime,
      answers: answers || []
    });

    const token = generateToken(guest._id, checkout);
    guest.token = token;
    await guest.save();

    res.status(201).json({
      message: 'Guest created successfully',
      token,
      guestId: guest._id,
      guestName: guest.name
    });
  } catch (error) {
    console.error('Error creating guest:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const UpdateGuestDocuments = async (req, res) => {
  try {
    // Add rate limiting check
    if (!checkRateLimit(req.ip)) {
      return res.status(429).json({ 
        message: 'Too many document update attempts. Please try again later.' 
      });
    }

    const { guestId } = req.params;
    const { documents } = req.body;

    // Validate guest ID format
    if (!guestId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid guest ID format' });
    }

    if (!documents || !Array.isArray(documents)) {
      return res.status(400).json({ message: 'Invalid documents data' });
    }

    // Check document limits
    if (documents.length > UPLOAD_LIMITS.MAX_FILES) {
      return res.status(400).json({ 
        message: `Maximum ${UPLOAD_LIMITS.MAX_FILES} documents allowed` 
      });
    }

    // Check if guest exists first
    const existingGuest = await Guestmodel.findById(guestId);
    if (!existingGuest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    console.log(`🔄 Processing ${documents.length} documents for guest ${guestId}`);

    // Process documents in batches to avoid overwhelming the system
    const batchSize = UPLOAD_LIMITS.CONCURRENT_UPLOADS;
    const formattedDocuments = [];

    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      
      const batchResults = batch.map((doc, index) => {
        const actualIndex = i + index;
        
        // Validate document structure
        if (!doc.file) {
          throw new Error(`Document ${actualIndex + 1}: Missing file URL`);
        }

        console.log(`📄 Processing document ${actualIndex + 1}/${documents.length}: ${doc.name || 'Unnamed'}`);

        return {
          name: doc.name || 'Unnamed',
          file: doc.file,
          gender: doc.gender || '',
          age: parseInt(doc.age) || 0,
          idcard: doc.idCardType || ' ',
        };
      });

      formattedDocuments.push(...batchResults);
      console.log(`✅ Batch ${Math.floor(i/batchSize) + 1} processed successfully`);
    }

    // Update guest with all formatted documents
    const updatedGuest = await Guestmodel.findByIdAndUpdate(
      guestId,
      { Document: formattedDocuments },
      { new: true, runValidators: true }
    );

    if (!updatedGuest) {
      return res.status(404).json({ message: 'Guest not found during update' });
    }

    console.log(`✅ Documents updated successfully for guest ${guestId} - Total: ${formattedDocuments.length}`);

    res.status(200).json({
      message: 'Documents updated successfully',
      guest: updatedGuest,
      documentsCount: formattedDocuments.length
    });

  } catch (error) {
    console.error('Error updating documents:', error);
    
    // Handle different error types
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid guest ID format', 
        error: error.message 
      });
    }

    if (error.message.includes('Document')) {
      return res.status(400).json({ 
        message: 'Document validation failed', 
        error: error.message 
      });
    }

    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// export const UpdateGuestDocuments = async (req, res) => {
//   try {
//     const { guestId } = req.params;
//     const { documents } = req.body;

//     if (!documents || !Array.isArray(documents)) {
//       return res.status(400).json({ message: 'Invalid documents data' });
//     }

//     const formattedDocuments = documents.map(doc => ({
//       name: doc.name || 'Unnamed',
//       file: doc.file,
//       gender: doc.gender,
//       age: parseInt(doc.age) || 0,
//       idcard: doc.idCardType || ' ',
//     }));

//     const updatedGuest = await Guestmodel.findByIdAndUpdate(
//       guestId,
//       { Document: formattedDocuments },
//       { new: true }
//     );

//     if (!updatedGuest) {
//       return res.status(404).json({ message: 'Guest not found' });
//     }

//     res.status(200).json({
//       message: 'Documents updated successfully',
//       guest: updatedGuest
//     });
//   } catch (error) {
//     console.error('Error updating documents:', error);
//     res.status(500).json({ message: 'Server Error', error: error.message });
//   }
// };

// // Add this helper function
// const cleanupFailedUploads = async (uploadedUrls) => {
//   if (!uploadedUrls || uploadedUrls.length === 0) return;
  
//   console.log(`🧹 Cleaning up ${uploadedUrls.length} failed uploads`);
  
//   for (const url of uploadedUrls) {
//     try {
//       // Extract public_id from Cloudinary URL
//       const publicId = url.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId);
//       console.log(`🗑️ Cleaned up: ${publicId}`);
//     } catch (cleanupError) {
//       console.error(`❌ Failed to cleanup ${url}:`, cleanupError);
//     }
//   }
// };

// This function will be called after the guest is created and documents are uploaded
export const updateGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, property_name, number_of_guests, checkin, checkout, place_id } = req.body;

    // Validate files if present
    const fileValidation = validateFiles(req.files);
    if (!fileValidation.isValid) {
      return res.status(400).json({
        message: 'File validation failed',
        errors: fileValidation.errors
      });
    }

    const guest = await Guestmodel.findById(id);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    // Process file uploads if present
    let newDocuments = [];
    if (req.files && req.files.length > 0) {
      try {
        const documentsData = JSON.parse(req.body.Document || '[]');

        // Validate that documentsData matches files array
        if (documentsData.length !== req.files.length) {
          return res.status(400).json({
            message: 'Mismatch between uploaded files and document data'
          });
        }

        const checkin_new = checkin?.split('T')[0] || new Date().toISOString().split('T')[0];
        const checkout_new = checkout?.split('T')[0] || new Date().toISOString().split('T')[0];

        const DocUrls = await processUploadsInBatches(req.files, documentsData, checkin_new, checkout_new);

        newDocuments = DocUrls.map(item => ({
          name: item.name || 'Unnamed',
          file: item.file,
          gender: item.gender,
          age: parseInt(item.age) || 0,
          idcard: item.idCardType || ' ',
        }));

      } catch (uploadError) {
        console.error('Upload processing error:', uploadError);
        return res.status(500).json({
          message: 'File upload failed',
          error: uploadError.message
        });
      }
    }

    // Update guest fields
    if (name) guest.name = name;
    if (phone) guest.phone = phone;
    if (property_name) guest.property_name = property_name;
    if (number_of_guests) guest.number_of_guests = number_of_guests;
    if (checkin) guest.checkin = checkin;
    if (checkout) guest.checkout = checkout;
    if (place_id) guest.place_id = place_id;

    // Append new documents
    if (newDocuments.length > 0) {
      guest.Document = [...guest.Document, ...newDocuments];
    }

    // Generate new token if checkout date changes
    if (checkout && checkout !== guest.checkout) {
      guest.token = generateToken(guest._id, checkout);
    }

    await guest.save();

    console.log("Guest Updated Successfully!!");
    res.status(200).json({
      message: 'Guest updated successfully',
      guest,
      uploadedFiles: newDocuments.length
    });

  } catch (error) {
    console.error('Error updating guest:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

// Keep other existing functions unchanged
export const getCloudinarySignature = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
      folder: 'guest_documents'
    }, process.env.CLOUDINARY_API_SECRET);

    res.status(200).json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY
    });
  } catch (error) {
    console.error('Error generating signature:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// export const guestinfo = async (req, res) => {
//   try {
//     const { startDate, endDate, propertyName } = req.query;
//     console.log("Query params:", { startDate, endDate, propertyName });

//     const filter = {};

//     if (startDate || endDate) {
//       filter.$or = [];

//       if (startDate && endDate) {
//         filter.$or.push({
//           $and: [
//             { checkin: { $lte: new Date(endDate) } },
//             { checkout: { $gte: new Date(startDate) } }
//           ]
//         });
//       } else if (startDate) {
//         filter.$or.push({
//           checkin: { $gte: new Date(startDate) }
//         });
//       } else if (endDate) {
//         filter.$or.push({
//           checkout: { $lte: new Date(endDate) }
//         });
//       }
//     }

//     if (propertyName) {
//       const matchedProperties = await Propertymodel.find({
//         title: { $regex: propertyName, $options: 'i' }
//       }).select('_id');

//       const matchedPropertyIds = matchedProperties.map(prop => prop._id);
//       filter.place_id = { $in: matchedPropertyIds };
//     }

//     const guests = await Guestmodel.find(filter);

//     const guestsWithPlaceDetails = await Promise.all(
//       guests.map(async (guest) => {
//         const place = await Propertymodel
//           .findById(guest.place_id)
//           .select('title');

//         return {
//           ...guest._doc,
//           property_name: place?.title || 'Unknown'
//         };
//       })
//     );

//     res.status(200).json(guestsWithPlaceDetails);

//   } catch (error) {
//     console.error('Error in guestinfo:', error);
//     res.status(500).json({
//       error: 'Error fetching guests',
//       details: error.message
//     });
//   }
// };

export const GuestinfoById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Guestmodel.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: error.message });
  }
};


export const guestinfo = async (req, res) => {
  try {
    // Add rate limiting check
    if (!checkRateLimit(req.ip, 'GENERAL')) {
      return res.status(429).json({ 
        message: 'Too many requests. Please try again later.' 
      });
    }

    // Extract query parameters
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate,
      propertyName,
      searchTerm
    } = req.query;

    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 items per page
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter = {};

    // Date filtering (on checkin date)
    if (startDate || endDate) {
      filter.checkin = {};
      if (startDate) {
        filter.checkin.$gte = new Date(startDate);
      }
      if (endDate) {
        // Add one day to include the end date
        const endDatePlusOne = new Date(endDate);
        endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
        filter.checkin.$lt = endDatePlusOne;
      }
    }

    // Property name filtering
    if (propertyName && propertyName.trim() !== '') {
      filter.property_name = { $regex: propertyName.trim(), $options: 'i' };
    }

    // Search term filtering (searches across multiple fields)
    if (searchTerm && searchTerm.trim() !== '') {
      const searchRegex = { $regex: searchTerm.trim(), $options: 'i' };
      filter.$or = [
        { name: searchRegex },
        { phone: searchRegex },
        { property_name: searchRegex }
      ];
      
      // If searchTerm looks like an ObjectId, also search by _id
      if (searchTerm.trim().match(/^[0-9a-fA-F]{24}$/)) {
        filter.$or.push({ _id: searchTerm.trim() });
      }
    }

    // Build sort object
    const sortObj = {};
    const validSortFields = ['createdAt', 'name', 'checkin', 'checkout', 'property_name', '_id'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : '_id'; // Default to _id for timestamp
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    sortObj[sortField] = sortDirection;

    console.log(`🔍 Fetching guests - Page: ${pageNum}, Limit: ${limitNum}, Sort: ${sortField} ${sortOrder}`);
    console.log('🔍 Filter:', JSON.stringify(filter, null, 2));

    // Get total count for pagination
    const totalGuests = await Guestmodel.countDocuments(filter);
    const totalPages = Math.ceil(totalGuests / limitNum);

    // Fetch guests with pagination and sorting
    const guests = await Guestmodel.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean(); // Use lean() for better performance

    // Calculate pagination info
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    console.log(`✅ Found ${guests.length} guests out of ${totalGuests} total (Page ${pageNum}/${totalPages})`);

    // Return paginated response
    res.status(200).json({
      success: true,
      guests: guests,
      pagination: {
        currentPage: pageNum,
        totalPages: totalPages,
        totalGuests: totalGuests,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
        limit: limitNum,
        skip: skip
      },
      filters: {
        startDate: startDate || null,
        endDate: endDate || null,
        propertyName: propertyName || null,
        searchTerm: searchTerm || null,
        sortBy: sortField,
        sortOrder: sortOrder
      }
    });

  } catch (error) {
    console.error('❌ Error in guestinfo:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching guests',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};