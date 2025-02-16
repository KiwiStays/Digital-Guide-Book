import React, { useContext, useState } from 'react'
import { AdminContext } from '../../Context/AdminContext';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { adminToken, logout } = useContext(AdminContext);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        logout(); // Call logout function passed from parent
        navigate('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', requireAuth: true },
        { name: 'Create Property', path: '/admin/property', requireAuth: true },
        { name: "Property List", path: '/admin/propertylist', requireAuth: true },
        { name: 'Guest Info', path: '/admin/guestinfo', requireAuth: true },
        { name: "Edit Guest info", path: '/admin/editguestinfo', requireAuth: true },
        { name: "Edit Proerty", path: '/admin/editproperty', requireAuth: true },
    ];

    return (
        <nav className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo or Brand */}
                    <div className="flex items-center">
                        <Link to="/admin/dashboard" className="text-xl font-bold">
                            Admin Panel
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-white hover:text-gray-300 focus:outline-none"
                        >
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                (!item.requireAuth || adminToken) && (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        {item.name}
                                    </Link>
                                )
                            ))}
                            {adminToken && (
                                <button
                                    onClick={handleLogout}
                                    className="text-white hover:bg-red-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium bg-red-600"
                                >
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.1 }}
                        className="md:hidden bg-gray-800"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navItems.map((item) => (
                                (!item.requireAuth || adminToken) && (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={toggleMenu}
                                        className="text-white hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        {item.name}
                                    </Link>
                                )
                            ))}
                            {adminToken && (
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        toggleMenu();
                                    }}
                                    className="text-white hover:bg-red-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600"
                                >
                                    Logout
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    );
}

export default Navbar