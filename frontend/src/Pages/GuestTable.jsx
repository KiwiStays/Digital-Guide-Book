import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const GuestTable = () => {
    const [guests, setGuests] = useState([]); // State to store guest data
    const [filters, setFilters] = useState({ startDate: '', endDate: '', propertyName: '' });
    const [loading, setLoading] = useState(false); // State for loading spinner
    const [searchTerm, setSearchTerm] = useState(''); // For property name search
    const [propertyOptions, setPropertyOptions] = useState([]); // Store dropdown property names
    const [expandedRows, setExpandedRows] = useState([]); // Track which rows are expanded
    const [isExporting, setIsExporting] = useState(false); // For export loading
    const [exportMessage, setExportMessage] = useState(''); // For export status messages

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalGuests, setTotalGuests] = useState(0);
    const [itemsPerPage] = useState(10); // Fixed items per page

    const toggleRow = (id) => {
        setExpandedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    // Fetch property names for the dropdown
    const fetchPropertyNames = async () => {
        try {
            const response = await axios.get('/api/admin/property');
            setPropertyOptions(response.data || []);
        } catch (error) {
            console.error('Error fetching property names:', error);
            alert('Failed to fetch property names. Please try again later.');
        }
    };

    // Fetch guest data with pagination and sorting by timestamp
    // Fetch guest data with pagination and sorting by timestamp
    const fetchGuests = async (page = 1) => {
        try {
            setLoading(true);

            // Build query params
            const queryParams = [];
            queryParams.push(`page=${page}`);
            queryParams.push(`limit=${itemsPerPage}`);
            queryParams.push(`sortBy=_id`); // Sort by ObjectId for timestamp
            queryParams.push(`sortOrder=desc`); // Latest first (newest timestamps)

            if (filters.startDate) queryParams.push(`startDate=${filters.startDate}`);
            if (filters.endDate) queryParams.push(`endDate=${filters.endDate}`);
            if (filters.propertyName) queryParams.push(`propertyName=${encodeURIComponent(filters.propertyName)}`);
            if (searchTerm) queryParams.push(`searchTerm=${encodeURIComponent(searchTerm)}`);

            const url = `/api/guest/guestinfo?${queryParams.join('&')}`;
            // console.log('🔄 Fetching URL:', url);

            const response = await axios.get(url);
            // console.log('📥 Response:', response.data);

            // Handle the new paginated response structure
            if (response.data.success && response.data.guests) {
                setGuests(response.data.guests);
                setCurrentPage(response.data.pagination.currentPage);
                setTotalPages(response.data.pagination.totalPages);
                setTotalGuests(response.data.pagination.totalGuests);

                // console.log(`✅ Loaded page ${response.data.pagination.currentPage} of ${response.data.pagination.totalPages}`);
                // console.log(`📊 Showing ${response.data.guests.length} guests out of ${response.data.pagination.totalGuests} total`);
            } else {
                // Fallback for old response format
                // console.log('⚠️ Using fallback pagination');
                const allGuests = response.data || [];

                // Sort by timestamp
                const sortedGuests = allGuests.sort((a, b) => {
                    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(parseInt(a._id.substring(0, 8), 16) * 1000).getTime();
                    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(parseInt(b._id.substring(0, 8), 16) * 1000).getTime();
                    return timeB - timeA; // Latest first
                });

                // Manual pagination
                const startIndex = (page - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const paginatedGuests = sortedGuests.slice(startIndex, endIndex);

                setGuests(paginatedGuests);
                setTotalGuests(sortedGuests.length);
                setTotalPages(Math.ceil(sortedGuests.length / itemsPerPage));
                setCurrentPage(page);
            }

        } catch (error) {
            console.error('❌ Error fetching guest data:', error);
            alert('Failed to fetch guest data. Please try again later.');
            // Reset states on error
            setGuests([]);
            setTotalGuests(0);
            setTotalPages(1);
            setCurrentPage(1);
        } finally {
            setLoading(false);
        }
    };
    // Handle page changes
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchGuests(newPage);
            setExpandedRows([]); // Collapse all rows when changing pages
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchPropertyNames(); // Load property names for the dropdown
        fetchGuests(1); // Fetch guest data starting from page 1
        // eslint-disable-next-line
    }, []);

    // Format guest data for export (fetch all data for export)
    const formatGuestData = (allGuests) => {
        return allGuests.map((guest) => {
            const baseFields = {
                'Property Name': guest.property_name,
                'Guest Name': guest.name,
                'Guest DB ID': guest._id,
                'Phone': guest.phone,
                'Cleaning Time Slot': guest.cleaningTime,
                'Number of Guests': guest.number_of_guests,
                'Check-in Date': guest.checkin.split('T')[0],
                'Check-out Date': guest.checkout.split('T')[0],
                'Created Date': guest.createdAt
                    ? new Date(guest.createdAt).toLocaleString()
                    : new Date(parseInt(guest._id.substring(0, 8), 16) * 1000).toLocaleString(),
                'Number of Days Stayed': Math.ceil(
                    (new Date(guest.checkout) - new Date(guest.checkin)) /
                    (1000 * 60 * 60 * 24)
                ),
                'QnA': guest?.answers?.map((item, index) => {
                    const [question, answer] = item.split('_');
                    return `Q${index + 1}: ${question} | A${index + 1}: ${answer}`;
                }).join('\n') || 'No answers provided'
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
    };

    // Export all data (fetch all pages)
    // Export all data (fetch all pages)
    const exportAllData = async () => {
        try {
            setIsExporting(true);
            setExportMessage('Fetching all data for export...');

            // Fetch all data without pagination but with timestamp sorting
            const queryParams = [];
            queryParams.push(`sortBy=_id`);
            queryParams.push(`sortOrder=desc`);
            queryParams.push(`limit=10000`); // Large limit to get all data
            queryParams.push(`page=1`); // Always get page 1 with large limit

            if (filters.startDate) queryParams.push(`startDate=${filters.startDate}`);
            if (filters.endDate) queryParams.push(`endDate=${filters.endDate}`);
            if (filters.propertyName) queryParams.push(`propertyName=${encodeURIComponent(filters.propertyName)}`);
            if (searchTerm) queryParams.push(`searchTerm=${encodeURIComponent(searchTerm)}`);

            const url = `/api/guest/guestinfo?${queryParams.join('&')}`;
            const response = await axios.get(url);

            const allGuests = response.data.guests || response.data || [];
            // console.log(`📊 Exporting ${allGuests.length} guests`);

            if (allGuests.length === 0) {
                setExportMessage('No data found to export.');
                return;
            }

            const formattedData = formatGuestData(allGuests);

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

            const timestamp = new Date().toISOString().split('T')[0];
            saveAs(blob, `Guests_${timestamp}.xlsx`);

            setExportMessage(`Excel file downloaded successfully! (${allGuests.length} records)`);
        } catch (error) {
            console.error('Error exporting data:', error);
            setExportMessage('Failed to export data. Please try again.');
        } finally {
            setIsExporting(false);
            setTimeout(() => setExportMessage(''), 5000);
        }
    };
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page
        fetchGuests(1); // Re-fetch data with updated filters
    };

    const clearAll = () => {
        setFilters({ startDate: '', endDate: '', propertyName: '' });
        setSearchTerm('');
        setCurrentPage(1);
        fetchGuests(1);
    };

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const delta = 2; // Number of pages to show on each side of current page
        const pages = [];
        const start = Math.max(1, currentPage - delta);
        const end = Math.min(totalPages, currentPage + delta);

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('...');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    };

    // Helper function to get readable timestamp
    // Helper function to get readable timestamp
    const getReadableTimestamp = (guest) => {
        if (guest.createdAt) {
            return new Date(guest.createdAt).toLocaleString();
        }
        // Fallback to ObjectId timestamp
        const timestamp = new Date(parseInt(guest._id.substring(0, 8), 16) * 1000);
        return timestamp.toLocaleString();
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

            {/* Results Summary */}
            <div className="mb-4 text-gray-600 text-sm">
                {totalGuests > 0 ? (
                    <p>
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalGuests)} of {totalGuests} guests
                        (Page {currentPage} of {totalPages}) - Sorted by latest first
                    </p>
                ) : (
                    <p>No guests found</p>
                )}
            </div>

            {/* Loading Spinner */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2">Loading...</p>
                </div>
            ) : (
                <>
                    {/* Responsive Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 text-left text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 border">Guest DB ID</th>
                                    <th className="p-2 border">Guest Name</th>
                                    <th className="p-2 border">Phone</th>
                                    <th className="p-2 border">Property Name</th>
                                    <th className="p-2 border">Number of Guests</th>
                                    <th className="p-2 border">Dates Stayed</th>
                                    <th className="p-2 border">Days Stayed</th>
                                    <th className="p-2 border">Cleaning Time Slot</th>
                                    <th className="p-2 border">Created At</th>
                                    <th className="p-2 border">QnA</th>
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
                                                    <td className="p-2 border">{guest.cleaningTime || 'not chosen'}</td>
                                                    <td className="p-2 border text-xs">
                                                        {getReadableTimestamp(guest)}
                                                    </td>
                                                    <td className='p-2 border'>{guest?.answers?.map((item, index) => {
                                                        const [question, answer] = item.split('_');
                                                        return (
                                                            <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                                                                <p className='text-xs text-gray-500'>Q: {question}</p>
                                                                <p className='text-sm font-medium text-gray-800'>A: {answer}</p>
                                                            </div>
                                                        );
                                                    })}</td>
                                                </tr>

                                                {/* Expanded Row for Documents */}
                                                {isExpanded && guest.Document?.length > 0 && (
                                                    <tr>
                                                        <td colSpan="10" className="p-4 bg-gray-50 border">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                {guest.Document.map((doc) => {
                                                                    const fileLower = doc.file.toLowerCase();
                                                                    const isPDF = fileLower.endsWith('.pdf');

                                                                    return (
                                                                        <div key={doc._id} className="mb-4 w-full">
                                                                            <div className="flex gap-4 items-center border-2 rounded-lg bg-white shadow-sm px-4 py-5">
                                                                                <div className="flex-1">
                                                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                                                        <p><span className="font-semibold">Name:</span> {doc.name}</p>
                                                                                        <p><span className="font-semibold">Age:</span> {doc?.age}</p>
                                                                                        <p><span className="font-semibold">Gender:</span> {doc?.gender}</p>
                                                                                        <p><span className="font-semibold">ID Type:</span> {doc?.idcard}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex-shrink-0">
                                                                                    {isPDF ? (
                                                                                        <a
                                                                                            href={doc.file}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                                                                                        >
                                                                                            View PDF
                                                                                        </a>
                                                                                    ) : (
                                                                                        <img
                                                                                            src={doc.file}
                                                                                            alt={doc.name}
                                                                                            className="w-20 h-20 object-cover border rounded"
                                                                                        />
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="p-8 border text-center text-gray-500">
                                            No guests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-2 text-sm border rounded ${currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Previous
                            </button>

                            {getPageNumbers().map((page, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof page === 'number' && handlePageChange(page)}
                                    disabled={page === '...'}
                                    className={`px-3 py-2 text-sm border rounded ${page === currentPage
                                        ? 'bg-blue-500 text-white'
                                        : page === '...'
                                            ? 'bg-white text-gray-400 cursor-default'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-2 text-sm border rounded ${currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {/* Export Buttons */}
                    <div className="mt-6 flex justify-center gap-4 flex-wrap">
                        <button
                            onClick={exportAllData}
                            disabled={isExporting}
                            className={`px-6 py-2 rounded w-full md:w-auto ${isExporting
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-green-500 text-white hover:bg-green-600'
                                }`}
                        >
                            {isExporting ? 'Exporting...' : 'Download Excel (All Data)'}
                        </button>
                    </div>

                    {/* Export Status Message */}
                    {exportMessage && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-center text-blue-800">
                            {exportMessage}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default GuestTable;