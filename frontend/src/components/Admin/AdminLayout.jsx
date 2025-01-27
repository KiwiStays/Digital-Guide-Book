import React, { useContext } from 'react'
import { AdminContext } from '../../Context/AdminContext';
import Navbar from './Navbar';

const AdminLayout = ({children}) => {
    const {adminToken} = useContext(AdminContext); 
  return (
    <div>
        {adminToken ? (
            <Navbar/>
        ) : null}
        <main  className='bg-gradient-to-br from-blue-50 to-indigo-100 h-screen'>
        {children}
        </main>
        
    </div>
  )
}

export default AdminLayout