import { uploadToCloudinary } from '../utils/cloudinary.js';
import { Guestmodel } from '../models/Guest.model.js';
import { Propertymodel } from '../models/Property.model.js';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import geoip from "geoip-lite";

const secretKey = process.env.JWT_SECRET;

const generateToken = (userId, checkOutDate) => {
  return jwt.sign(
    {
      userId,
      exp: Math.floor(new Date(checkOutDate).getTime() / 1000)
      // exp: Math.floor(Date.now() / 1000) + 10
      // exp:Math.floor(Date.now() / 1000) + 10
    },
    secretKey
  );
};

// mongoose.connection.once('open', () => {
//   const changeStream = Guestmodel.watch();
//   changeStream.on('change', (change) => {
//       if (change.operationType === 'delete') {
//           console.log(Guest document deleted:, change.documentKey);
//       }
//   });
// });

// export const VerifyGuest = async (req, res)=>{
//     try {
//         const {id} = req.params;
//         const { name, phone, property_name, number_of_guests, checkin, checkout } = req.body;

//         const checkin_new =checkin.split('T')[0];
//         const checkout_new =checkout.split('T')[0];

//         let DocUrls = [];
//         if (req.files && req.files.length > 0) {
//           const documentsData = JSON.parse(req.body.Document || '[]'); // Parse document names

//           DocUrls = await Promise.all(
//             req.files.map(async (file, index) => {
//               // const username = documentsData[index]?.name + checkin_new + checkout_new  || 'Unnamed';
//               const username = (documentsData[index]?.name + " "+ checkin_new +" "+ checkout_new) || 'Unnamed';


//               const filepath = file.path;
//               const cloud_data = await uploadToCloudinary(filepath, username); // Wait for Cloudinary upload

//               return { name: username, file: cloud_data.url }; // Return the object for DocUrls
//             })
//           );
//         }

//         // console.log(documentsData.name);
//         const documents = DocUrls.map((item, index) => ({
//           name: item.name|| 'Unnamed', // Ensure the name exists
//           file: item.file, // File path from multer
//         }));

//         // Create a new guest entry
//         const guest = new Guestmodel({
//           place_id:id,
//           name,
//           phone,
//           property_name,
//           number_of_guests,
//           Document: documents,
//           checkin,
//           checkout,
//         });
//         const token = generateToken(guest._id,checkout);
//         guest.token = token;
//         await guest.save();
//         console.log("Guest Saved Successfully!!");

//         res.status(201).json({ message: 'Guest created successfully', token, guestId: guest._id, guestName: guest.name  });
//       } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Server Error', error });
//       }
// }

// export const VerifyGuest = async (req, res)=>{
//   try {
//       const {id} = req.params;
//       const { name, phone, property_name, number_of_guests, checkin, checkout,cleaningTime } = req.body;
//       // console.log("req body",req.body);

//       // console.log("req files",req.files); 

//       const existingGuest = await Guestmodel.findOne({ phone: phone });
//       if (existingGuest) {
//         console.log("Phone number already exists, please use a different number or login.");
//         return res.status(402).json({ message: 'Phone number already exists, please use a different number or login.' });
//       }


//       const checkin_new = checkin.split('T')[0];
//       const checkout_new = checkout.split('T')[0];

//       let DocUrls = [];
//       if (req.files && req.files.length > 0) {
//         const documentsData = JSON.parse(req.body.Document || '[]'); // Parse document names

//         DocUrls = await Promise.all(
//           req.files.map(async (file, index) => {
//             // const username = documentsData[index]?.name + checkin_new + checkout_new  || 'Unnamed';
//             const username = (documentsData[index]?.name + " " + checkin_new + " " + checkout_new) || file.originalname;
//             const gender = documentsData[index]?.gender;
//             const idCardType = documentsData[index]?.idCardType;
//             const age = documentsData[index]?.age;
//             const filepath = file.path;
//             const cloud_data = await uploadToCloudinary(filepath, username); // Wait for Cloudinary upload

//             return { name: documentsData[index]?.name, file: cloud_data.url,gender: gender, idCardType: idCardType, age: age }; // Return the object for DocUrls
//           })
//         );
//       }

//       // console.log(documentsData.name);
//       const documents = DocUrls.map((item) => ({
//         name: item.name || 'Unnamed', // Ensure the name exists
//         file: item.file, // File path from multer
//         gender:item.gender, // Gender
//         age: item.age || 0 ,
//         idcard: item.idCardType || ' ',
//       }));

//       // Create a new guest entry
//       const guest = new Guestmodel({
//         place_id:id,
//         name,
//         phone,
//         property_name,
//         number_of_guests,
//         Document: documents,
//         checkin,
//         checkout,
//         cleaningTime,
//       });
//       const token = generateToken(guest._id,checkout);
//       guest.token = token;
//       await guest.save();
//       // console.log("guest ", guest);
//       console.log("Guest Saved Successfully!!");

//       res.status(201).json({ message: 'Guest created successfully', token, guestId: guest._id, guestName: guest.name  });
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ message: 'Server Error', error });
//     }
// }

// 1. Atomic Controller for creating guest with all info and documents in one step
export const CreateGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, phone, property_name, number_of_guests,
      checkin, checkout, cleaningTime, answers, location,
      documents // Array of {name, file, age, gender, idCardType}
    } = req.body;

    // Validate documents
    if (!Array.isArray(documents) || documents.length !== Number(number_of_guests)) {
      return res.status(400).json({ message: 'All guest documents must be uploaded.' });
    }
    for (const doc of documents) {
      if (!doc.name || !doc.file || !doc.age || !doc.gender || !doc.idCardType) {
        return res.status(400).json({ message: 'Each document must have name, file, age, gender, and idCardType.' });
      }
    }

    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.connection.remoteAddress;
    const ipLocation = geoip.lookup(ipAddress);
    // const ipLocation = geoip.lookup('103.6.159.200');
    // console.log("ipLocation",ipLocation);
    let city = location?.address?.city || ipLocation?.city || '';
    // let loc = location || {};
    // if (!location) {
    let loc = (location && Object.keys(location).length > 0) ? location : ipLocation;
    //  console.log("loc",loc);
    // city = ipLocation?.city || '';
    // }
    // console.log("loc",loc);
    // console.log("ipAddress",ipAddress);
    // console.log(geoip.lookup('103.6.159.200'));

    const existingGuest = await Guestmodel.findOne({ phone: phone });
    if (existingGuest) {
      return res.status(402).json({ message: 'Phone number already exists, please use a different number or login.' });
    }

    // Format documents for schema
    const formattedDocuments = documents.map(doc => ({
      name: doc.name,
      file: doc.file,
      gender: doc.gender,
      age: doc.age,
      idcard: doc.idCardType
    }));

    // Create a new guest entry with all info and docs
    const guest = new Guestmodel({
      place_id: id,
      name,
      phone,
      property_name,
      number_of_guests,
      Document: formattedDocuments,
      checkin,
      checkout,
      cleaningTime,
      answers,
      digitalSignature: {
        ipAddress: ipAddress,
        timestamp: new Date(),
        location: loc,
        city: city || '',
      },
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
    console.error('Error:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};
// 2. Controller for updating documents after they're uploaded to Cloudinary
export const UpdateGuestDocuments = async (req, res) => {
  try {
    const { guestId } = req.params;
    const { documents } = req.body;

    // Format documents to match your schema
    const formattedDocuments = documents.map(doc => ({
      name: doc.name || 'Unnamed',
      file: doc.file,
      gender: doc.gender,
      age: doc.age || 0,
      idcard: doc.idCardType || ' ',
    }));

    // Update the guest record with document information
    const updatedGuest = await Guestmodel.findByIdAndUpdate(
      guestId,
      { Document: formattedDocuments },
      { new: true }
    );

    if (!updatedGuest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    res.status(200).json({
      message: 'Documents updated successfully',
      guest: updatedGuest
    });
  } catch (error) {
    console.error('Error updating documents:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// 3. Controller for generating Cloudinary signatures
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
//  

// export const guestinfo = async (req, res) => {
//   try {
//     const { startDate, endDate, propertyName } = req.query;
//     console.log("startDate",startDate);
//     console.log("endDate",endDate);
//     const filter = {};

//     // Date range filter
//     if (startDate && endDate) {
//       filter.checkin = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       };
//       filter.checkout = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       };
//     }


//     if(startDate){
//       filter.checkin = {
//         $gte: new Date(startDate),
//       };
//       filter.checkout = {
//         $gte: new Date(startDate),
//       }
//     }

//     if(endDate && !startDate){
//       filter.checkin = {
//         $lte: new Date(endDate),
//       };
//       filter.checkout = {
//         $lte: new Date(endDate),
//       } 
//     }




//     // Property name filter
//     if (propertyName) {
//       // Find properties whose title matches propertyName (case-insensitive)
//       const matchedProperties = await Propertymodel.find({
//         title: { $regex: propertyName, $options: 'i' },
//       }).select('_id');
//       const matchedPropertyIds = matchedProperties.map((prop) => prop._id);

//       // Include only guests with those property IDs
//       filter.place_id = { $in: matchedPropertyIds };
//     }

//     // Fetch guests given the combined filter
//     const guests = await Guestmodel.find(filter);

//     // Fetch place details (title) for each guest
//     const guestsWithPlaceDetails = await Promise.all(
//       guests.map(async (guest) => {
//         const place = await Propertymodel
//           .findById(guest.place_id)
//           .select('title'); // or whatever field holds the property's name

//         return {
//           ...guest._doc,
//           place_name: place ? place.title : 'Unknown',
//         };
//       })
//     );

//     res.status(200).json(guestsWithPlaceDetails);
//   } catch (error) {
//     console.error('Error fetching guests:', error.message);
//     res.status(500).json({ error: 'Error fetching guests', details: error.message });
//   }
// };

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
//     console.log(Found ${guests.length} guests);

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

// export const UpdateGuestbyid = async (req, res) => { 
//   try {
//     const { id } = req.params;
//     console.log("id",id);
//     const { name, phone, property_name, number_of_guests, checkin, checkout } = req.body;
//     console.log("req body", req.body);

//     const updatedUser = await Guestmodel.findByIdAndUpdate(
//       id,
//       {
//         name,
//         phone,
//         property_name,
//         number_of_guests,
//         checkin,
//         checkout,
//       },
//       { new: true } // Return the updated document
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({ message: 'User updated successfully', data: updatedUser });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


export const updateGuest = async (req, res) => {
  try {
    const { id } = req.params; // Guest ID from URL
    const { name, phone, property_name, number_of_guests, checkin, checkout, place_id } = req.body;
    console.log("req body", req.body);

    const checkin_new = checkin?.split('T')[0];
    const checkout_new = checkout?.split('T')[0];

    let DocUrls = [];
    if (req.files && req.files.length > 0) {
      const documentsData = JSON.parse(req.body.Document || '[]'); // Parse document names

      DocUrls = await Promise.all(
        req.files.map(async (file, index) => {
          const username = (documentsData[index]?.name + " " + checkin_new + " " + checkout_new) || 'Unnamed';
          const filepath = file.path;
          const gender = documentsData[index]?.gender;
          const idCardType = documentsData[index]?.idCardType;
          const age = documentsData[index]?.age;
          const cloud_data = await uploadToCloudinary(filepath, username); // Upload file to Cloudinary

          return { name: documentsData[index]?.name, file: cloud_data.url, gender: gender, idCardType: idCardType, age: age }; // Return the object for DocUrls
        })
      );
    }

    // Prepare updated documents
    const documents = DocUrls.map((item, index) => ({
      name: item.name || 'Unnamed', // Ensure the name exists
      file: item.file, // File path from Cloudinary
      gender: item.gender, // Gender
      age: item.age || 0,
      idcard: item.idCardType || ' ',
    }));

    // Find and update the guest
    const guest = await Guestmodel.findById(id);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    // Update guest fields
    guest.name = name || guest.name;
    guest.phone = phone || guest.phone;
    guest.property_name = property_name || guest.property_name;
    guest.number_of_guests = number_of_guests || guest.number_of_guests;
    guest.checkin = checkin || guest.checkin;
    guest.checkout = checkout || guest.checkout;
    guest.place_id = place_id || guest.place_id;

    // Append new documents to existing ones
    if (documents.length > 0) {
      guest.Document = [...guest.Document, ...documents];
    }

    // Generate a new token if check-out date changes
    if (checkout && checkout !== guest.checkout) {
      guest.token = generateToken(guest._id, checkout);
    }

    await guest.save(); // Save updated guest to the database

    console.log("Guest Updated Successfully!!");
    res.status(200).json({
      message: 'Guest updated successfully',
      guest,
    });
  } catch (error) {
    console.error('Error updating guest:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const guestinfo = async (req, res) => {
  try {
    // Add rate limiting check


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

    // Property name filtering - EXACT MATCH ONLY
    if (propertyName && propertyName.trim() !== '') {
      filter.property_name = propertyName.trim(); // Exact match instead of regex
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

    console.log(`🔍 Fetching guests - Page: ${ pageNum }, Limit: ${ limitNum }, Sort: ${ sortField } ${ sortOrder }`);
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

    console.log(`✅ Found ${ guests.length } guests out of ${ totalGuests } total(Page ${ pageNum } / ${ totalPages })`);

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
