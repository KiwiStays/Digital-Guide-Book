import { RentalwiseGuest } from "../models/Rentalwiseguest.model.js";
import { Propertymodel } from '../models/Property.model.js';
import axios from "axios";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchRentalwiseGuests(maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`🔄 Attempt ${attempt}/${maxRetries} - Fetching Rentalwise guests...`);
            
            const url = "https://app.rentalwise.io/rest/booking/query";
            const headers = {
                'content-type': 'application/json',
                'Authorization': `Bearer ${process.env.RENTALWISE_API_KEY}`,
                'User-Agent': 'Digital-Guide-Book/1.0'
            }
            
            const body = {
                "paginate": {
                    "page": 1, // Start with page 1
                    "perpage": 30 // Reduce page size
                },
                "sort": [
                    {
                        "field": "created_at",
                        "direction": "desc"
                    }
                ],
                "where": [
                    {
                        "field": "status",
                        "operator": "=",
                        "value": "confirmed"
                    }
                ],
                "with": ["guest", "property"]
            }

            const config = {
                headers,
                timeout: 60000, // 60 seconds
                maxRedirects: 5,
                validateStatus: (status) => status < 500, // Accept 4xx as valid responses
            };

            const response = await axios.post(url, body, config);
            
            if (response.status === 200 && response.data) {
                console.log(`✅ Successfully connected to Rentalwise API`);
                const data = response.data.data;
                
                if (data && data.length > 0) {
                    console.log(`📊 Found ${data.length} guests`);
                    await processGuests(data);
                } else {
                    console.log('📭 No guests found');
                }
                
                return data;
            } else {
                throw new Error(`API returned status: ${response.status}`);
            }
            
        } catch (error) {
            console.error(`❌ Attempt ${attempt} failed:`, error.code || error.message);
            
            if (attempt === maxRetries) {
                console.error(`🚫 All ${maxRetries} attempts failed. Giving up.`);
                throw error;
            }
            
            // Exponential backoff: 2s, 4s, 8s
            const waitTime = Math.pow(2, attempt) * 1000;
            console.log(`⏳ Waiting ${waitTime/1000}s before retry...`);
            await delay(waitTime);
        }
    }
}


async function findPropertyByName(propertyName) {
    if (!propertyName) return null;

    // Method 1: Exact match
    let property = await Propertymodel.findOne({ title: propertyName }, '_id');
    if (property) {
        console.log(`✅ Exact match found: ${propertyName}`);
        return property;
    }

    // Method 2: Match by first part (before |)
    const mainName = propertyName.split('|')[0].trim();
    property = await Propertymodel.findOne({
        title: { $regex: `^${mainName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, $options: 'i' }
    }, '_id');
    if (property) {
        console.log(`✅ Partial match found: ${mainName}`);
        return property;
    }

    // Method 3: Check if any database property starts with the API property name
    property = await Propertymodel.findOne({
        title: { $regex: `^${propertyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, $options: 'i' }
    }, '_id');
    if (property) {
        console.log(`✅ Forward match found: ${propertyName}`);
        return property;
    }

    // Method 4: Check if the API property name contains any database property
    const allProperties = await Propertymodel.find({}, 'title');
    for (const dbProperty of allProperties) {
        const dbMainName = dbProperty.title.split('|')[0].trim();
        if (propertyName.toLowerCase().includes(dbMainName.toLowerCase())) {
            console.log(`✅ Contains match found: ${dbMainName} in ${propertyName}`);
            return await Propertymodel.findById(dbProperty._id, '_id');
        }
    }

    console.log(`❌ No match found for: ${propertyName}`);
    return null;
}


// Separate function to process guests
async function processGuests(data) {
    for (const guest of data) {
        try {
            console.log(`\n📋 Processing Guest ${guest.id}`);

            // finding property id from property name in property model
            var property_id = await findPropertyByName( guest.property?.name?.en );
            if (!property_id) {
                property_id = 'Property not present in database';
                console.log(`❌ Property not found for guest ${guest.id}: ${property_id || ''}`);
            }
            else{
                console.log(`Property ID found: ${property_id._id}`);
            }


            
            const existingGuest = await RentalwiseGuest.findOne({ bookingId: guest.id });
            if (!existingGuest) {
                const newGuest = new RentalwiseGuest({
                    Name: guest.main_guest?.full_name || 'Unknown',
                    Phone: guest.main_guest?.phone || 'No Phone number was provided',
                    bookingId: guest.id,
                    propertyName: guest.property?.name?.en || 'Unknown Property',
                    property_id: property_id._id || 'Unknown Property ID',
                    checkIn: new Date(guest.checkin),
                    checkOut: new Date(guest.checkout),
                    totalAmount: guest.total || 0,
                    balanceAmount: guest.total_outstanding || 0,
                    balanceAmountLink: guest.payment_link || '',
                    channel: guest?.channel?.name || null,
                    brochure_url: guest.stay_property?.brochure_url || '',
                    summary_url: guest.summary_url || '',
                    calendar_url: guest.stay_property?.calendar_url || ''
                });
                
                await newGuest.save();
                console.log(`✅ Saved new guest: ${guest.main_guest?.full_name}`);
            } else {
                console.log(`⏭️ Guest ${guest.id} already exists, skipping`);
            }
        } catch (saveError) {
            console.error(`❌ Error saving guest ${guest.id}:`, saveError.message);
        }
    }
}


export const getRentalwiseGuests = async (req, res) => {
    try {
        console.log("🔄 Fetching Rentalwise guests with pagination...");
        
        // Extract query parameters with default values
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const search = req.query.search || '';
        
        // Calculate skip value for pagination
        const skip = (page - 1) * limit;
        
        // Build search filter
        let searchFilter = {};
        if (search) {
            searchFilter = {
                $or: [
                    { Name: { $regex: search, $options: 'i' } },
                    { Phone: { $regex: search, $options: 'i' } },
                    { propertyName: { $regex: search, $options: 'i' } },
                    { bookingId: { $regex: search, $options: 'i' } },
                    { channel: { $regex: search, $options: 'i' } }
                ]
            };
        }
        
        // Get total count for pagination info
        const totalGuests = await RentalwiseGuest.countDocuments(searchFilter);
        
        // Fetch guests with pagination
        const guests = await RentalwiseGuest.find(searchFilter)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean();
        
        if (!guests || guests.length === 0) {
            console.log('📭 No guests found in the database');
            return res.status(404).json({ 
                success: false, 
                message: 'No guests found',
                pagination: {
                    currentPage: page,
                    totalPages: 0,
                    totalGuests: 0,
                    hasNextPage: false,
                    hasPrevPage: false
                }
            });
        }
        
        // Calculate pagination info
        const totalPages = Math.ceil(totalGuests / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        
        console.log(`✅ Found ${guests.length} guests on page ${page} of ${totalPages}`);
        
        res.status(200).json({ 
            success: true, 
            data: guests,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalGuests: totalGuests,
                guestsPerPage: limit,
                hasNextPage: hasNextPage,
                hasPrevPage: hasPrevPage,
                nextPage: hasNextPage ? page + 1 : null,
                prevPage: hasPrevPage ? page - 1 : null
            }
        });
        
    } catch (error) {
        console.error('❌ Error fetching guests:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching guests', 
            error: error.message 
        });
    }
}


export const getRentalwiseGuestById = async (req, res) => {
    try{
        const {guestId} = req.params;
        console.log(`🔄 Fetching guest with ID: ${guestId}`);
        const guest = await RentalwiseGuest.findById(guestId);
        if(!guest){
            console.log(`❌ Guest with ID ${guestId} not found`);
            return res.status(404).json({ 
                success: false, 
                message: 'Guest not found' 
            });
        }
        if(guest.property_id === 'Property not present in database'){
            console.log(`❌ Property not found for guest with ID ${guestId}`);
            return res.status(404).json({ 
                success: false, 
                message: 'Property not found for this guest' 
            });
        }

        console.log(`✅ Found guest with ID ${guestId}`);
        res.status(200).json({ 
            success: true, 
            data: guest 
        });


    }catch(error){
        console.error(`❌ Error fetching guest by ID ${req.params.id}:`, error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching guest by ID', 
            error: error.message 
        });
    }
}