

import axios from "axios"
import { useEffect, useState } from "react"

const Rentalwiseguest = () => {
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalGuests: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")

  const fetchGuests = async (page = 1, limit = 10, search = "", sort = "createdAt", order = "desc") => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: sort,
        sortOrder: order,
        ...(search && { search }),
      })

      const response = await axios.get(`/api/rentalwise/guestData?${params}`)

      if (response.data.success) {
        setGuests(response.data.data || [])
        setPagination(response.data.pagination || {})
      } else {
        setError(response.data.message || "Failed to fetch guests")
        setGuests([])
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setError("No guests found")
        setGuests([])
        setPagination({
          currentPage: page,
          totalPages: 0,
          totalGuests: 0,
          hasNextPage: false,
          hasPrevPage: false,
        })
      } else {
        setError(error.response?.data?.message || "Failed to fetch guests")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGuests()
  }, [])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchGuests(newPage, 10, searchTerm, sortBy, sortOrder)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchGuests(1, 10, searchTerm, sortBy, sortOrder) // Reset to page 1 when searching
  }

  const handleSortChange = (newSortBy) => {
    const newOrder = sortBy === newSortBy && sortOrder === "asc" ? "desc" : "asc"
    setSortBy(newSortBy)
    setSortOrder(newOrder)
    fetchGuests(1, 10, searchTerm, newSortBy, newOrder)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div>Loading guests...</div>
      </div>
    )
  }

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <h1 className="mb-8 text-2xl font-bold text-gray-800">Rentalwise Guests</h1>

      {/* Search and Controls */}
      <div className="mb-8 flex flex-wrap gap-4 items-center">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name, phone, property, booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2.5 border border-gray-300 rounded-md min-w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 text-white border-none rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>

        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split("-")
            setSortBy(field)
            setSortOrder(order)
            fetchGuests(1, 10, searchTerm, field, order)
          }}
          className="p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="Name-asc">Name A-Z</option>
          <option value="Name-desc">Name Z-A</option>
          <option value="checkIn-desc">Check-in (Latest)</option>
          <option value="checkIn-asc">Check-in (Earliest)</option>
        </select>
      </div>

      {/* Results Summary */}
      <div className="mb-5 text-gray-600">
        {pagination.totalGuests > 0 ? (
          <p>
            Showing {(pagination.currentPage - 1) * 10 + 1} to{" "}
            {Math.min(pagination.currentPage * 10, pagination.totalGuests)} of {pagination.totalGuests} guests
          </p>
        ) : (
          <p>No guests found</p>
        )}
      </div>

      {/* Error Display */}
      {error && <div className="bg-red-100 text-red-800 p-4 rounded-md mb-5 border border-red-200">{error}</div>}

      {/* Guests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {guests.map((guest) => (
          <div
            key={guest._id || guest.bookingId}
            className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="border-b-2 border-gray-100 pb-4 mb-4 flex flex-col">
              <h3 className="mb-2 text-gray-800 text-lg font-medium">{guest.Name || "Unknown Guest"}</h3>
              <h2 className="pb-2.5 text-sm text-gray-600">Guest Db id: {guest._id}</h2>
              <div className="flex justify-between items-center">
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                  Rental Wise Guest Booking Id: {guest.bookingId}
                </span>
                {guest.channel && (
                  <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">{guest.channel}</span>
                )}
              </div>
              <div className="mt-2">
                <button
                  onClick={() => {
                    const link = `http://localhost:5173/${guest._id}/${guest.property_id}`
                    navigator.clipboard
                      .writeText(link)
                      .then(() => {
                        alert("Link copied to clipboard!")
                      })
                      .catch(() => {
                        const textArea = document.createElement("textarea")
                        textArea.value = link
                        document.body.appendChild(textArea)
                        textArea.select()
                        document.execCommand("copy")
                        document.body.removeChild(textArea)
                        alert("Link copied to clipboard!")
                      })
                  }}
                  className="px-3 py-1.5 bg-gray-600 text-white border-none rounded text-xs cursor-pointer hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  📋 Copy Link
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-sm">
              <div>
                <strong className="text-gray-700">📞 Phone:</strong>
                <br />
                <span className="text-gray-600">
                  {guest.Phone !== "No Phone number was provided" ? guest.Phone : "Not provided"}
                </span>
              </div>

              <div>
                <strong className="text-gray-700">🏠 Property:</strong>
                <br />
                <span className="text-gray-600">{guest.propertyName || "Unknown"}</span>
                <span className="text-gray-400 text-xs"> {guest.property_id}</span>
              </div>

              <div>
                <strong className="text-gray-700">📅 Check-in:</strong>
                <br />
                <span className="text-gray-600">{guest.checkIn ? formatDate(guest.checkIn) : "N/A"}</span>
              </div>

              <div>
                <strong className="text-gray-700">📅 Check-out:</strong>
                <br />
                <span className="text-gray-600">{guest.checkOut ? formatDate(guest.checkOut) : "N/A"}</span>
              </div>

              <div>
                <strong className="text-gray-700">💰 Total:</strong>
                <br />
                <span className="text-green-700 font-medium">{formatCurrency(guest.totalAmount)}</span>
              </div>

              <div>
                <strong className="text-gray-700">💳 Balance:</strong>
                <br />
                <span className={`font-medium ${guest.balanceAmount > 0 ? "text-red-700" : "text-green-700"}`}>
                  {formatCurrency(guest.balanceAmount)}
                </span>
              </div>
            </div>

            {/* Action Links */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex gap-2 flex-wrap">
                {guest.balanceAmountLink && guest.balanceAmount > 0 && (
                  <a
                    href={guest.balanceAmountLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-amber-500 text-white no-underline rounded text-xs hover:bg-amber-600 transition-colors"
                  >
                    💳 Pay Balance
                  </a>
                )}
                {guest.summary_url && (
                  <a
                    href={guest.summary_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-500 text-white no-underline rounded text-xs hover:bg-blue-600 transition-colors"
                  >
                    📄 Summary
                  </a>
                )}
                {guest.calendar_url && (
                  <a
                    href={guest.calendar_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-green-500 text-white no-underline rounded text-xs hover:bg-green-600 transition-colors"
                  >
                    📅 Calendar
                  </a>
                )}
                {guest.brochure_url && (
                  <a
                    href={guest.brochure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-purple-600 text-white no-underline rounded text-xs hover:bg-purple-700 transition-colors"
                  >
                    📋 Brochure
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2.5 mt-8">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className={`px-4 py-2.5 text-white border-none rounded ${pagination.hasPrevPage ? "bg-blue-600 cursor-pointer hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"} transition-colors`}
          >
            ← Previous
          </button>

          <span className="px-5 py-2.5 bg-gray-50 rounded border border-gray-200">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className={`px-4 py-2.5 text-white border-none rounded ${pagination.hasNextPage ? "bg-blue-600 cursor-pointer hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"} transition-colors`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default Rentalwiseguest
