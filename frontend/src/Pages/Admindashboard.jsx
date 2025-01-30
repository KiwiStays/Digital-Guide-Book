import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../Context/AdminContext';
import Navbar from '../components/Admin/Navbar';
import { use } from 'react';
import axios from 'axios';
import { Home, Users } from 'lucide-react';

const Admindashboard = () => {  
  // const {logout} = useContext(AdminContext);
  const [guestcount, setGuestCount] = useState(0);
  const [propertycount, setPropertyCount] = useState(0);
  useEffect(() => {
    axios.get("http://localhost:3000/api/admin/count").then((response) => {
      console.log(response.data);
      setGuestCount(response.data.guestcount);
      setPropertyCount(response.data.propertycount);

    }).catch((error) => { 
      console.log(error)
    })
    
  },[]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl shadow-lg h-full">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Users</p>
            <p className="text-3xl font-bold text-gray-800">{guestcount}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Home className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Properties</p>
            <p className="text-3xl font-bold text-gray-800">{propertycount}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Admindashboard
