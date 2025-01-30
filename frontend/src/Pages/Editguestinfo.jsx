import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle2 } from 'lucide-react';

const Editguestinfo = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [userId, setUserId] = useState('');
    const [formData, setFormData] = useState({
      name: '',
      phone: '',
      property_name: '',
      number_of_guests: 1,
      documents: [],
      checkin: '',
      checkout: '',
    });
  
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/api/guest/guestinfo/${userId}`);
        const user = response.data.data;
        setFormData({
          name: user.name,
          phone: user.phone,
          property_name: user.property_name,
          number_of_guests: user.number_of_guests,
          documents: user.documents || [],
          checkin: user.checkin.split('T')[0],
          checkout: user.checkout.split('T')[0],
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setIsLoading(false);
      }
    };
  
    const handleUpdate = async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('phone', formData.phone);
        data.append('property_name', formData.property_name);
        data.append('number_of_guests', formData.number_of_guests);
        data.append('checkin', formData.checkin);
        data.append('checkout', formData.checkout);
  
        const documentsData = formData.documents.map((doc) => ({
          name: doc.name,
        }));
        data.append('Document', JSON.stringify(documentsData));
        formData.documents.forEach((doc) => {
          if (doc.file) data.append('documents', doc.file);
        });
  
        await axios.put(`http://localhost:3000/api/guest/updateguset/${userId}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        setIsSubmitted(true);
        setIsLoading(false);
        // console.log('User updated successfully!');
        // console.log('Data:', formData);
      } catch (error) {
        console.error('Error updating user:', error);
        setIsLoading(false);
      }
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-start p-4 bg-gray-100">
        {isSubmitted && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            User information updated successfully!
          </div>
        )}
  
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600">Find and update user details</p>
        </div>
  
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Enter User ID"
            />
            <button
              onClick={fetchUserDetails}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
            >
              {isLoading ? 'Loading...' : 'Fetch User'}
            </button>
          </div>
  
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Property Name</label>
              <input
                type="text"
                name="property_name"
                value={formData.property_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
              <input
                type="number"
                name="number_of_guests"
                value={formData.number_of_guests}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
              <input
                type="date"
                name="checkin"
                value={formData.checkin}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
              <input
                type="date"
                name="checkout"
                value={formData.checkout}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
  
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Updating...</span>
                </div>
              ) : (
                'Update Info'
              )}
            </button>
          </form>
        </div>
      </div>
    );
}

export default Editguestinfo
