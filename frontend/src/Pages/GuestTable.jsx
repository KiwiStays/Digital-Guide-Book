import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const GuestTable = () => {
    const [guests, setGuests] = useState([]); // State to store guest data
    const [filters, setFilters] = useState({ startDate: '', endDate: '', propertyName: '' }); // Added propertyName to filters
    const [loading, setLoading] = useState(false); // State for loading spinner
    const [searchTerm, setSearchTerm] = useState(''); // For property name search
    const [propertyOptions, setPropertyOptions] = useState([]); // Store dropdown property names
    const [expandedRows, setExpandedRows] = useState([]); // Track which rows are expanded

    const toggleRow = (id) => {
        setExpandedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    // Fetch property names for the dropdown
    const fetchPropertyNames = async () => {
        try {
            const response = await axios.get('/api/admin/property'); // Replace with your endpoint
            setPropertyOptions(response.data || []); // Ensure an array is set
        } catch (error) {
            console.error('Error fetching property names:', error);
            alert('Failed to fetch property names. Please try again later.');
        }
    };

    // Fetch guest data
    const fetchGuests = async () => {
        try {
            setLoading(true);

            // Build query params
            const queryParams = [];
            if (filters.startDate) queryParams.push(`startDate=${filters.startDate}`);
            if (filters.endDate) queryParams.push(`endDate=${filters.endDate}`);
            if (filters.propertyName) queryParams.push(`propertyName=${encodeURIComponent(filters.propertyName)}`);
            if (searchTerm) queryParams.push(`searchTerm=${encodeURIComponent(searchTerm)}`);

            let url = '/api/guest/guestinfo';
            if (queryParams.length > 0) {
                url += `?${queryParams.join('&')}`;
            }

            const response = await axios.get(url);
            setGuests(response.data || []); // Ensure we set an array even if empty
            // console.log(response.data);
        } catch (error) {
            console.error('Error fetching guest data:', error);
            alert('Failed to fetch guest data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchPropertyNames(); // Load property names for the dropdown
        fetchGuests(); // Fetch guest data
        // eslint-disable-next-line
    }, []);

    // Handle Excel Download
    const handleDownloadExcel = () => {
        const formattedData = guests.map((guest) => {
            const baseFields = {
                'Property Name': guest.property_name,
                'Guest Name': guest.name,
                'Guest db id': guest._id,
                'Phone': guest.phone,
                'Cleaning Time Slot': guest.cleaningTime,
                'Number of Guests': guest.number_of_guests,
                'Check-in Date': guest.checkin.split('T')[0],
                'Check-out Date': guest.checkout.split('T')[0],
                'Number of Days Stayed': Math.ceil(
                    (new Date(guest.checkout) - new Date(guest.checkin)) /
                    (1000 * 60 * 60 * 24)
                ),
            };

            const docFields = {};
            guest.Document?.forEach((doc, index) => {
                docFields[`Guest ${index + 1} Name`] = doc.name;
                docFields[`Guest ${index + 1} File`] = doc.file;
                docFields[`Guest ${index + 1} Age`] = doc?.age;
                docFields[`Guest ${index + 1} idType`] = doc?.idcard;
                docFields[`Guest ${index + 1} gender`] = doc?.gender;
            });

            return { ...baseFields, ...docFields };
        });

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Guests');

        const workbookBinary = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });

        const blob = new Blob([workbookBinary], {
            type: 'application/octet-stream',
        });
        saveAs(blob, 'Guests.xlsx');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchGuests(); // Re-fetch data with updated filters
    };

    const clearAll = () => {
        setFilters({ startDate: '', endDate: '', propertyName: '' });
        setSearchTerm('');
        fetchGuests();
    };

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <h1 className="text-lg md:text-2xl font-bold mb-4 text-center">Guest Information</h1>

            {/* Filters + Search */}
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4 items-center">
                <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="border px-2 py-1 rounded w-full md:w-auto text-sm"
                />
                <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="border px-2 py-1 rounded w-full md:w-auto text-sm"
                />
                <select
                    value={filters.propertyName}
                    onChange={(e) => handleFilterChange('propertyName', e.target.value)}
                    className="border px-2 py-1 rounded w-full md:w-auto text-sm"
                >
                    <option value="">Select Property</option>
                    {propertyOptions.map((property) => (
                        <option key={property._id} value={property.title}>
                            {property.title}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Search by Property Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border px-2 py-1 rounded w-full md:w-auto text-sm"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
                >
                    Apply
                </button>
                <button
                    type="button"
                    onClick={clearAll}
                    className="bg-gray-500 text-white px-4 py-2 rounded w-full md:w-auto"
                >
                    Clear Filters
                </button>
            </form>

            {/* Loading Spinner */}
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <>
                    {/* Responsive Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 text-left text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 border">Guest DB id</th>
                                    <th className="p-2 border">Guest Name</th>
                                    <th className="p-2 border">Phone</th>
                                    <th className="p-2 border">Property Name</th>
                                    <th className="p-2 border">Number of Guests</th>
                                    <th className="p-2 border">Dates Stayed</th>
                                    <th className="p-2 border">Days Stayed</th>
                                    <th className="p-2 border">Cleaning time slot</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guests.length > 0 ? (
                                    guests.map((guest) => {
                                        const isExpanded = expandedRows.includes(guest._id);
                                        return (
                                            <React.Fragment key={guest._id}>
                                                <tr
                                                    onClick={() => toggleRow(guest._id)}
                                                    className="hover:bg-gray-50 cursor-pointer"
                                                >
                                                    <td className="p-2 border">{guest._id}</td>
                                                    <td className="p-2 border">{guest.name}</td>
                                                    <td className="p-2 border">{guest.phone}</td>
                                                    <td className="p-2 border">{guest.property_name}</td>
                                                    <td className="p-2 border">{guest.number_of_guests}</td>
                                                    <td className="p-2 border">
                                                        {guest.checkin && guest.checkout
                                                            ? `${guest.checkin.split('T')[0].split('-').reverse().join('-')} - ${guest.checkout.split('T')[0].split('-').reverse().join('-')}`
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="p-2 border">
                                                        {guest.checkin && guest.checkout
                                                            ? Math.ceil(
                                                                (new Date(guest.checkout) - new Date(guest.checkin)) /
                                                                (1000 * 60 * 60 * 24)
                                                            )
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="p-2 border">{guest.cleaningTime||'not choosen'}</td>
                                                </tr>

                                                {/* Expanded Row for Documents */}
                                                {isExpanded && guest.Document?.length > 0 && (
                                                    <tr>
                                                        <td colSpan="7" className="p-4 bg-gray-50 border">
                                                            {guest.Document.map((doc) => {
                                                                const fileLower = doc.file.toLowerCase();
                                                                console.log(fileLower);
                                                                const isPDF = fileLower.endsWith('.pdf');

                                                                return (
                                                                    <div key={doc._id} className="mb-4 w-full">
                                                                        <div className="flex gap-4 items-center border-2 rounded-lg max-w-sm bg-gray-100 shadow-sm md:max-w-md px-4 py-5">
                                                                            <div className="grid grid-cols-2 gap-4 items-center justify-evenly">
                                                                                <p className="font-semibold text-gray-700">Name: {doc.name}</p>
                                                                                <p className="font-semibold text-gray-700">Age: {doc?.age}</p>
                                                                                <p className="font-semibold text-gray-700">Gender: {doc?.gender}</p>
                                                                                <p className="font-semibold text-gray-700">Id Type: {doc?.idcard}</p>
                                                                            </div>
                                                                            <div>
                                                                                {isPDF ? (
                                                                                    <a
                                                                                        href={doc.file}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="text-blue-600 underline block"
                                                                                    >
                                                                                        View PDF
                                                                                    </a>
                                                                                ) : (
                                                                                    <img
                                                                                        src={doc.file}
                                                                                        alt={doc.name}
                                                                                        className="mt-1 border w-32 h-auto"
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="p-2 border text-center">
                                            No guests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Download Button */}
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={handleDownloadExcel}
                            className="bg-green-500 text-white px-6 py-2 rounded w-full md:w-auto"
                        >
                            Download Excel
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default GuestTable;
