import { uploadToCloudinary } from '../utils/cloudinary.js';
import { Propertymodel } from '../models/Property.model.js';
import { Guestmodel } from '../models/Guest.model.js';
import multer from 'multer';
import fs from 'fs';
import mongoose from 'mongoose';


export const CreateProperty = async (req, res) => {
    try {
        // console.log("req body" , req.body);
        // console.log("rules " , req.body.houseRules);
        // console.log(req.files);

        // const data = JSON.parse(req.body.data);

        const uploadedFiles = [];
        let coverImageUrl = '';

        // Handle cover image first
        if (req.files.coverImage && req.files.coverImage[0]) {
            const coverImageResult = await uploadToCloudinary(
                req.files.coverImage[0].path,
                req.files.coverImage[0].originalname
            );
            coverImageUrl = coverImageResult.url;
        }

        if (req.files.images && req.files.images.length > 0) {
            // Upload each file to Cloudinary
            const uploadPromises = req.files.images.map(file => uploadToCloudinary(file.path, file.originalname));
            const cloudinaryResults = await Promise.all(uploadPromises);
            uploadedFiles.push(...cloudinaryResults);
        }

        const propertyData = req.body

        const perkInfoMap = new Map(Object.entries(propertyData.perkInfo || {}));

        // Combine Cloudinary URLs with any existing image URLs
        // const processedImages = [
        //     ...uploadedFiles,
        //     ...(propertyData.images || [])
        //     .filter(img => img.url && img.url.trim() !== '' && !img.file)
        //     .map(img => ({
        //         url: img.url,
        //         description: img.description || ''
        //     }))
        // ];

        // console.log(propertyData.images);

        let processedImages = [];

        if (req.body.imageDescriptions && Array.isArray(req.body.imageDescriptions)) {
            for (let i = 0; i < uploadedFiles.length; i++) {
                // Check if description exists for this image
                const description = req.body.imageDescriptions[i] || ''; // Default to an empty string if undefined
                processedImages.push({ url: uploadedFiles[i].url, description });
            }
            // console.log(processedImages);
        } else {
            console.error('imageDescription is not an array or is missing.');
        }


        // Create property data object
        const newPropertyData = {
            active:propertyData.active,
            title: propertyData.title,
            hostName: propertyData.hostName,
            address: propertyData.address,
            location: propertyData.location,
            selfcheckin: propertyData.selfcheckin,
            wifi: JSON.parse(propertyData.wifi),
            contacts: propertyData.contacts.map(contact => ({
                name: contact.name,
                info: contact.info
            })),
            coverImage: coverImageUrl,
            perks: propertyData.perks,
            perkInfo: perkInfoMap,
            quickResponse: propertyData.quickResponse.map(qr => ({
                icon: qr.icon,
                description: qr.description,
                number: qr.number
            })),
            foodAndDrinks: propertyData.foodAndDrinks.map(fd => ({
                tag: fd.tag,
                title: fd.title,
                img: fd.img,
                location: fd.location,
                description: fd.description
            })),
            houseRules: propertyData.houseRules.map(hr => ({
                heading: hr.heading,
                rules: hr.rules.map(rule => {
                    if (typeof rule === "object" && rule.rule) {
                        return rule.rule; // Extract the `rule` property from objects
                    }
                    return rule; // Use the value directly if it's already a string
                }),
            })),
            faqs: propertyData.faqs.map(faq => ({
                question: faq.question,
                answer: faq.answer
            })),
            info: propertyData.info,
            kitchenItems: propertyData.kitchenItems,
            appliancesItems: propertyData.appliancesItems || [],
            images: processedImages
        };

        // Create new property
        const property = new Propertymodel(newPropertyData);

        // Validate the property
        await property.validate();

        // Save to database
        const savedProperty = await property.save();

        // Send success response
        res.status(201).json({
            status: 'success',
            message: 'Property created successfully',
            data: savedProperty
        });

        // console.log('Created in DB: ', savedProperty);

    } catch (error) {
        // if(req.files.coverImage){
        //     for(const file of req.files.coverImage){
        //         try{
        //             await fs.unlinkSync(file.path);
        //         }catch(unlinkError){
        //             console.error('Error deleting file:', unlinkError);
        //         }
        //     }
        // }
        // if (req.files.images) {
        //     for (const file of req.files.images) {
        //         try {
        //             await fs.unlinkSync(file.path);
        //         } catch (unlinkError) {
        //             console.error('Error deleting file:', unlinkError);
        //         }
        //     }
        // }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: 'error',
                message: 'Validation Error',
                details: error.message
            });
        }

        console.error('Error creating property:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            details: error.message
        });
    }
};

export const getProperty = async (req, res) => {
    const { id } = req.params;
    // console.log(id);

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid property ID",
        });
    }

    try {
        const property = await Propertymodel.findById(id);

        // Check if the property exists
        if (!property) {
            return res.status(404).json({
                status: "error",
                message: "Property not found",
            });
        }

        // Respond with the property data
        res.status(200).json({
            status: "success",
            data: property,
        });
    } catch (error) {
        console.error("Error fetching property:", error);

        // Avoid exposing sensitive error details in production
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export const getPropertyName = async (req, res) => {

    const { id } = req.params;
    // console.log(id);

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid property ID",
        });
    }

    try {
        // const property = await Propertymodel.findById(id);
        const property = await Propertymodel.findById(id).select('title _id coverImage active');

        // Check if the property exists
        if (!property) {
            return res.status(404).json({
                status: "error",
                message: "Property not found",
            });
        }

        // Respond with the property data
        res.status(200).json({
            status: "success",
            data: property,
        });
    } catch (error) {
        console.error("Error fetching property:", error);

        // Avoid exposing sensitive error details in production
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }


};

export const Allcount = async (req, res) => {
    try {
        const guestcount = await Guestmodel.countDocuments();
        const propertycount = await Propertymodel.countDocuments();
        res.status(200).json({ guestcount, propertycount });

    } catch (err) {
        console.error(err);
    }
};

export const CreatePropertyinUpdate = async (req, res) => {
    // console.log("req body", req.body);
    // console.log("req files", req.files);
    
    try {
        const uploadedFiles = [];
        let coverImageUrl = '';

        // Debug cover image data
        console.log("Cover image in files:", req.files?.coverImage);
        console.log("Cover image URL in body:", req.body.coverImageUrl);
        
        // Handle cover image with multiple fallbacks
        if (req.files?.coverImage && req.files.coverImage[0]) {
            // Case 1: Cover image is an uploaded file
            console.log("Processing cover image from file upload");
            const coverImageResult = await uploadToCloudinary(
                req.files.coverImage[0].path,
                req.files.coverImage[0].originalname
            );
            coverImageUrl = coverImageResult.url;
        } else if (req.body.coverImageUrl && req.body.coverImageUrl !== 'undefined' && req.body.coverImageUrl !== '') {
            // Case 2: Cover image URL is provided in the request body
            console.log("Using cover image URL from request body");
            coverImageUrl = req.body.coverImageUrl;
        } else if (req.body.coverImage && req.body.coverImage !== 'undefined' && req.body.coverImage !== '') {
            // Case 3: Alternative field name might be used
            console.log("Using coverImage field from request body");
            coverImageUrl = req.body.coverImage;
        }
        
        console.log("Final cover image URL:", coverImageUrl);

        // Handle multiple property images
        if (req.files?.images && req.files.images.length > 0) {
            // Upload each file to Cloudinary
            const uploadPromises = req.files.images.map(file => uploadToCloudinary(file.path, file.originalname));
            const cloudinaryResults = await Promise.all(uploadPromises);
            uploadedFiles.push(...cloudinaryResults);
        }

        const propertyData = req.body;
        const perkInfoMap = new Map(Object.entries(propertyData.perkInfo || {}));

        // Process image descriptions with uploaded images
        let processedImages = [];
        if (req.body.imageDescriptions && Array.isArray(req.body.imageDescriptions)) {
            // Process any existing image URLs first
            const imageUrlArray = req.body.imageUrls == '' || req.body.imageUrls == 'undefined' ? [] : req.body.imageUrls.split(',');
            let i = 0;
            let j = 0;
            while (i < req.body.imageDescriptions.length && j < imageUrlArray.length) {
                processedImages.push({
                    url: imageUrlArray[j],
                    description: req.body.imageDescriptions[i]
                });
                i++;
                j++;
            }

            // Process newly uploaded images
            let k = 0;
            while (i < req.body.imageDescriptions.length && k < uploadedFiles.length) {
                processedImages.push({
                    url: uploadedFiles[k].url,
                    description: req.body.imageDescriptions[i]
                });
                i++;
                k++;
            }
        } else {
            console.error('imageDescription is not an array or is missing.');
        }

        // Create property data object
        const newPropertyData = {
            active: propertyData.active || true,
            title: propertyData.title,
            hostName: propertyData.hostName,
            address: propertyData.address,
            location: propertyData.location,
            selfcheckin: propertyData.selfcheckin,
            wifi: JSON.parse(propertyData.wifi),
            contacts: propertyData.contacts.map(contact => ({
                name: contact.name,
                info: contact.info
            })),
            coverImage: coverImageUrl,
            perks: propertyData.perks,
            perkInfo: perkInfoMap,
            quickResponse: propertyData.quickResponse.map(qr => ({
                icon: qr.icon,
                description: qr.description,
                number: qr.number
            })),
            foodAndDrinks: propertyData.foodAndDrinks.map(fd => ({
                tag: fd.tag,
                title: fd.title,
                img: fd.img,
                location: fd.location,
                description: fd.description
            })),
            houseRules: propertyData.houseRules.map(hr => ({
                heading: hr.heading,
                rules: hr.rules.map(rule => {
                    if (typeof rule === "object" && rule.rule) {
                        return rule.rule; // Extract the `rule` property from objects
                    }
                    return rule; // Use the value directly if it's already a string
                }),
            })),
            faqs: propertyData.faqs.map(faq => ({
                question: faq.question,
                answer: faq.answer
            })),
            info: propertyData.info,
            kitchenItems: propertyData.kitchenItems,
            appliancesItems: propertyData.appliancesItems || [],
            images: processedImages
        };

        // Check if cover image is still empty
        if (!coverImageUrl) {
            console.warn("Warning: No cover image URL was found in the request");
        }

        // Create new property
        console.log("Final property data:", newPropertyData);
        
        const property = new Propertymodel(newPropertyData);

        // Validate the property
        await property.validate();

        // Save to database
        const savedProperty = await property.save();

        // Send success response
        res.status(201).json({
            status: 'success',
            message: 'Property created successfully',
            data: savedProperty
        });

    } catch (error) {
        // Error handling
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: 'error',
                message: 'Validation Error',
                details: error.message
            });
        }

        console.error('Error creating property:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            details: error.message
        });
    }
};

export const UpdateProperty = async (req, res) => {
    // console.log("req files",req.files);
    // console.log("req body",req.body);

    try {
        // console.log("req body" , req.body);
        // console.log("rules " , req.body.houseRules);
        const { id } = req.params;
        console.log(id);

        // const data = JSON.parse(req.body.data);

        const uploadedFiles = [];
        let coverImageUrl = '';

        // Handle cover image first
        if (req.files?.coverImage && req.files.coverImage[0]) {
            const coverImageResult = await uploadToCloudinary(
                req.files.coverImage[0].path,
                req.files.coverImage[0].originalname
            );
            coverImageUrl = coverImageResult.url;
        }
        else {
            coverImageUrl = req.body.coverImageUrl;
        }
        // console.log(coverImageUrl);

        if (req.files.images && req.files.images.length > 0) {
            // Upload each file to Cloudinary
            const uploadPromises = req.files.images.map(file => uploadToCloudinary(file.path, file.originalname));
            const cloudinaryResults = await Promise.all(uploadPromises);
            uploadedFiles.push(...cloudinaryResults);
        }

        const propertyData = req.body

        const perkInfoMap = new Map(Object.entries(propertyData.perkInfo || {}));

        // Combine Cloudinary URLs with any existing image URLs
        // const processedImages = [
        //     ...uploadedFiles,
        //     ...(propertyData.images || [])
        //     .filter(img => img.url && img.url.trim() !== '' && !img.file)
        //     .map(img => ({
        //         url: img.url,
        //         description: img.description || ''
        //     }))
        // ];

        // console.log(propertyData.images);

        let processedImages = [];

        if (req.body.imageDescriptions && Array.isArray(req.body.imageDescriptions)) {
            // for (let i = 0; i < uploadedFiles.length; i++) {
            //     // Check if description exists for this image
            //     const description = req.body.imageDescriptions[i] || ''; // Default to an empty string if undefined
            //     processedImages.push({ url: uploadedFiles[i].url, description });
            // }
            // console.log(processedImages);

            const imageUrlArray = req.body.imageUrls == '' || req.body.imageUrls == 'undefined' ? [] : req.body.imageUrls.split(',') 
            let i = 0
            let j = 0
            while (i < req.body.imageDescriptions.length && j < imageUrlArray.length) {
                processedImages.push({
                    url: imageUrlArray[j],
                    description: req.body.imageDescriptions[i]
                });
                i++;
                j++;
            }

            let k = 0
            while (i < req.body.imageDescriptions.length && k < uploadedFiles.length) {
                processedImages.push({
                    url: uploadedFiles[k].url,
                    description: req.body.imageDescriptions[i]
                });
                i++;
                k++
            }
        } else {
            console.error('imageDescription is not an array or is missing.');
        }


        // Create property data object
        const newPropertyData = {
            active:propertyData.active,
            title: propertyData.title,
            hostName: propertyData.hostName,
            address: propertyData.address,
            location: propertyData.location,
            selfcheckin: propertyData.selfcheckin,
            wifi: JSON.parse(propertyData.wifi),
            contacts: propertyData.contacts.map(contact => ({
                name: contact.name,
                info: contact.info
            })),
            coverImage: coverImageUrl,
            perks: propertyData.perks,
            perkInfo: perkInfoMap,
            quickResponse: propertyData.quickResponse.map(qr => ({
                icon: qr.icon,
                description: qr.description,
                number: qr.number
            })),
            foodAndDrinks: propertyData.foodAndDrinks.map(fd => ({
                tag: fd.tag,
                title: fd.title,
                img: fd.img,
                location: fd.location,
                description: fd.description
            })),
            houseRules: propertyData.houseRules.map(hr => ({
                heading: hr.heading,
                rules: hr.rules.map(rule => {
                    if (typeof rule === "object" && rule.rule) {
                        return rule.rule; // Extract the `rule` property from objects
                    }
                    return rule; // Use the value directly if it's already a string
                }),
            })),
            faqs: propertyData.faqs.map(faq => ({
                question: faq.question,
                answer: faq.answer
            })),
            info: propertyData.info,
            kitchenItems: propertyData.kitchenItems,
            appliancesItems: propertyData.appliancesItems || [],
            images: processedImages
        };

        // house rules,
        // Create new property
        console.log(newPropertyData);
        
        const property = await Propertymodel.findByIdAndUpdate(id, newPropertyData);
        if (!property) {
            return res.status(404).json({
                status: 'error',
                message: 'Property not found'
            });
        }

        // Validate the property
        await property.validate();

        // Save to database
        // const savedProperty = await property.save();

        // Send success response
        res.status(201).json({
            status: 'success',
            message: 'Property Updated successfully',
            data: property
        });

        // console.log('Created in DB: ', savedProperty);

    } catch (error) {
        // if(req.files.coverImage){
        //     for(const file of req.files.coverImage){
        //         try{
        //             await fs.unlinkSync(file.path);
        //         }catch(unlinkError){
        //             console.error('Error deleting file:', unlinkError);
        //         }
        //     }
        // }
        // if (req.files.images) {
        //     for (const file of req.files.images) {
        //         try {
        //             await fs.unlinkSync(file.path);
        //         } catch (unlinkError) {
        //             console.error('Error deleting file:', unlinkError);
        //         }
        //     }
        // }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: 'error',
                message: 'Updation Error',
                details: error.message
            });
        }

        console.error('Error creating property:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            details: error.message
        });
    }
};


// name of all the properties
export const getname = async (req, res) => {   
    try {
        const property = await Propertymodel.find({}, 'title');
        res.status(200).json(property);
        // console.log("property",property);
    } catch (err) {
        console.error(err);
    }

};

export const getallPropertyInfo = async (req, res) => {
    try {
        const properties = await Propertymodel.find({}, 'title coverImage active _id');
        // console.log(properties);
        res.status(200).json(properties);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProperty = await Propertymodel.findByIdAndDelete(id);

        if (!deletedProperty) {
            return res.status(404).json({ message: "Property not found" });
        }

        res.status(200).json({ message: "Property deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


// export const handler = async(req, res) => {
//     if (req.method !== 'POST') {
//       return res.status(405).json({ success: false, message: 'Method not allowed' });
//     }
  
//     try {
//       const { spreadsheetId, sheetName, values } = req.body;
//       console.log(req.body);
//       console.log(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
//       console.log(process.env.GOOGLE_PRIVATE_KEY);
  
//       if (!spreadsheetId || !sheetName || !values || !Array.isArray(values)) {
//         return res.status(400).json({ 
//           success: false, 
//           message: 'Missing required parameters or invalid data format' 
//         });
//       }
  
//       // Set up auth - using service account
//       const auth = new google.auth.GoogleAuth({
//         keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
//         scopes: ['https://www.googleapis.com/auth/spreadsheets'],
//       });
  
//       const sheets = google.sheets({ version: 'v4', auth });
  
//       // Check if the sheet exists
//       const spreadsheet = await sheets.spreadsheets.get({
//         spreadsheetId,
//       });
  
//       let sheetExists = false;
//       let sheetId = null;
  
//       for (const sheet of spreadsheet.data.sheets) {
//         if (sheet.properties.title === sheetName) {
//           sheetExists = true;
//           sheetId = sheet.properties.sheetId;
//           break;
//         }
//       }
  
//       // If sheet doesn't exist, create it
//       if (!sheetExists) {
//         await sheets.spreadsheets.batchUpdate({
//           spreadsheetId,
//           resource: {
//             requests: [
//               {
//                 addSheet: {
//                   properties: {
//                     title: sheetName,
//                   },
//                 },
//               },
//             ],
//           },
//         });
//       } else {
//         // Clear the existing data
//         await sheets.spreadsheets.values.clear({
//           spreadsheetId,
//           range: sheetName,
//         });
//       }
  
//       // Update the sheet with new values
//       await sheets.spreadsheets.values.update({
//         spreadsheetId,
//         range: sheetName,
//         valueInputOption: 'RAW',
//         resource: {
//           values,
//         },
//       });
  
//       // Format the header row (optional)
//       if (sheetId !== null) {
//         await sheets.spreadsheets.batchUpdate({
//           spreadsheetId,
//           resource: {
//             requests: [
//               {
//                 repeatCell: {
//                   range: {
//                     sheetId: sheetId,
//                     startRowIndex: 0,
//                     endRowIndex: 1,
//                   },
//                   cell: {
//                     userEnteredFormat: {
//                       backgroundColor: {
//                         red: 0.8,
//                         green: 0.8,
//                         blue: 0.8,
//                       },
//                       horizontalAlignment: 'CENTER',
//                       textFormat: {
//                         bold: true,
//                       },
//                     },
//                   },
//                   fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
//                 },
//               },
//               {
//                 updateSheetProperties: {
//                   properties: {
//                     sheetId: sheetId,
//                     gridProperties: {
//                       frozenRowCount: 1,
//                     },
//                   },
//                   fields: 'gridProperties.frozenRowCount',
//                 },
//               },
//             ],
//           },
//         });
//       }
  
//       return res.status(200).json({ 
//         success: true, 
//         message: 'Data successfully exported to Google Sheets' 
//       });
//     } catch (error) {
//       console.error('Error exporting to Google Sheets:', error);
//       return res.status(500).json({ 
//         success: false, 
//         message: 'Failed to export data to Google Sheets',
//         error: error.message 
//       });
//     }
//   }