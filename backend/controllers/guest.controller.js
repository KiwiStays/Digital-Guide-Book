import { uploadToCloudinary } from '../utils/cloudinary.js';
import { Guestmodel } from '../models/Guest.model.js';
import { Propertymodel } from '../models/Property.model.js';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET;

const generateToken = (userId, checkOutDate) => {
  return jwt.sign(
      { userId, 
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
//           console.log(`Guest document deleted:`, change.documentKey);
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

export const VerifyGuest = async (req, res)=>{
  try {
      const {id} = req.params;
      const { name, phone, property_name, number_of_guests, checkin, checkout } = req.body;
      console.log("req body",req.body);
      console.log("req files",req.files); 

      const existingGuest = await Guestmodel.findOne({ phone: phone });
      if (existingGuest) {
        console.log("Phone number already exists, please use a different number or login.");
        return res.status(402).json({ message: 'Phone number already exists, please use a different number or login.' });
      }
      

      const checkin_new = checkin.split('T')[0];
      const checkout_new = checkout.split('T')[0];
  
      let DocUrls = [];
      if (req.files && req.files.length > 0) {
        const documentsData = JSON.parse(req.body.Document || '[]'); // Parse document names
      
        DocUrls = await Promise.all(
          req.files.map(async (file, index) => {
            // const username = documentsData[index]?.name + checkin_new + checkout_new  || 'Unnamed';
            const username = (documentsData[index]?.name + " " + checkin_new + " " + checkout_new) || file.originalname;
            const gender = documentsData[index]?.gender;
            const idCardType = documentsData[index]?.idCardType;
            const age = documentsData[index]?.age;
            const filepath = file.path;
            const cloud_data = await uploadToCloudinary(filepath, username); // Wait for Cloudinary upload
      
            return { name: documentsData[index]?.name, file: cloud_data.url,gender: gender, idCardType: idCardType, age: age }; // Return the object for DocUrls
          })
        );
      }

      // console.log(documentsData.name);
      const documents = DocUrls.map((item) => ({
        name: item.name || 'Unnamed', // Ensure the name exists
        file: item.file, // File path from multer
        gender:item.gender, // Gender
        age: item.age || 0 ,
        idcard: item.idCardType || ' ',
      }));

      // Create a new guest entry
      const guest = new Guestmodel({
        place_id:id,
        name,
        phone,
        property_name,
        number_of_guests,
        Document: documents,
        checkin,
        checkout,
      });
      const token = generateToken(guest._id,checkout);
      guest.token = token;
      await guest.save();
      console.log("guest ", guest);
      console.log("Guest Saved Successfully!!");
      
      res.status(201).json({ message: 'Guest created successfully', token, guestId: guest._id, guestName: guest.name  });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server Error', error });
    }
}


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

export const guestinfo = async (req, res) => {
  try {
    const { startDate, endDate, propertyName } = req.query;
    console.log("Query params:", { startDate, endDate, propertyName });
    
    const filter = {};

    // Date filtering
    if (startDate || endDate) {
      filter.$or = [];
      
      if (startDate && endDate) {
        // Find stays that overlap with the date range
        filter.$or.push({
          $and: [
            { checkin: { $lte: new Date(endDate) } },
            { checkout: { $gte: new Date(startDate) } }
          ]
        });
      } else if (startDate) {
        // Find stays that start on or after startDate
        filter.$or.push({
          checkin: { $gte: new Date(startDate) }
          
        });
        // filter.$or.push({
        //   checkout: { $gte: new Date(startDate) }
          
        // });

      } 
      
      else if (endDate) {
        // Find stays that end on or before endDate
        filter.$or.push({
          checkout: { $lte: new Date(endDate) }
        });
      }
    }

    // Property name filter
    if (propertyName) {
      const matchedProperties = await Propertymodel.find({
        title: { $regex: propertyName, $options: 'i' }
      }).select('_id');
      
      const matchedPropertyIds = matchedProperties.map(prop => prop._id);
      filter.place_id = { $in: matchedPropertyIds };
    }

    console.log("Final filter:", JSON.stringify(filter, null, 2));

    // Fetch filtered guests
    const guests = await Guestmodel.find(filter);
    console.log(`Found ${guests.length} guests`);

    // Add property details
    const guestsWithPlaceDetails = await Promise.all(
      guests.map(async (guest) => {
        const place = await Propertymodel
          .findById(guest.place_id)
          .select('title');

        return {
          ...guest._doc,
          property_name: place?.title || 'Unknown'
        };
      })
    );

    res.status(200).json(guestsWithPlaceDetails);

  } catch (error) {
    console.error('Error in guestinfo:', error);
    res.status(500).json({ 
      error: 'Error fetching guests', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


export const GuestinfoById = async (req, res) =>{
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
    const { name, phone, property_name, number_of_guests, checkin, checkout } = req.body;

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

          return { name: documentsData[index]?.name, file: cloud_data.url,gender: gender, idCardType: idCardType, age: age}; // Return the object for DocUrls
        })
      );
    }

    // Prepare updated documents
    const documents = DocUrls.map((item, index) => ({
      name: item.name || 'Unnamed', // Ensure the name exists
      file: item.file, // File path from Cloudinary
      gender:item.gender, // Gender
      age: item.age || 0 ,
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
