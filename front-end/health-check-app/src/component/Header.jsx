import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../utils/slices/authSlice';

const Header = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = {
        name: "John Doe",
        profilePic: "/path/to/profile-pic.jpg"
    }; 

    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);

    const drawerRef = useRef(null);
    const profileRef = useRef(null);

    const handleLogout = () => {
        // Perform logout logic here
        dispatch(logout());
        localStorage.removeItem('user');
        setProfileMenuOpen(false);
        navigate('/');
    };

    const handleClickOutside = (e) => {
        if (drawerRef.current && !drawerRef.current.contains(e.target)) {
            setDrawerOpen(false);
        }
        if (profileRef.current && !profileRef.current.contains(e.target)) {
            setProfileMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative z-50">
            <header className="bg-blue-600 text-white flex justify-between items-center p-4 shadow-md">
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="md:hidden text-2xl focus:outline-none"
                >
                    ☰
                </button>
                <Link to="/dashboard" className="text-xl font-bold">
                    Health Check
                </Link>

                <div className="hidden md:flex space-x-6 items-center">
                    <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                    <Link to="/appointment" className="hover:underline">Appointment</Link>
                    <Link to="/notification" className="hover:underline">Notification</Link>

                    {user && (
                        <div className="relative" ref={profileRef}>
                            <img
                                src="https://i.pravatar.cc/100"
                                alt="profile"
                                className="w-8 h-8 rounded-full border-2 border-white cursor-pointer"
                                onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                            />
                            {isProfileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg py-2">
                                    <Link
                                        to="/profile"
                                        onClick={() => setProfileMenuOpen(false)}
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        View Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {!user && (
                        <Link to="/login" className="hover:underline">Login</Link>
                    )}
                </div>
            </header>

            {/* Mobile Drawer */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-40 bg-black bg-opacity-40">
                    <div
                        ref={drawerRef}
                        className="fixed top-0 left-0 h-full w-2/3 max-w-xs bg-white shadow-md p-5 transition-transform"
                    >
                        <button
                            onClick={() => setDrawerOpen(false)}
                            className="text-gray-500 text-xl mb-6"
                        >
                            ×
                        </button>

                        <nav className="flex flex-col space-y-4">
                            <Link to="/dashboard" onClick={() => setDrawerOpen(false)} className="text-gray-800 hover:text-blue-600">Dashboard</Link>
                            <Link to="/appointment" onClick={() => setDrawerOpen(false)} className="text-gray-800 hover:text-blue-600">Appointment</Link>
                            <Link to="/notification" onClick={() => setDrawerOpen(false)} className="text-gray-800 hover:text-blue-600">Notification</Link>

                            {user && (
                                <>
                                    <Link to="/profile" onClick={() => setDrawerOpen(false)} className="text-gray-800 hover:text-blue-600">View Profile</Link>
                                    <button onClick={() => { handleLogout(); setDrawerOpen(false); }} className="text-red-600 text-left">Logout</button>
                                </>
                            )}

                            {!user && (
                                <Link to="/login" onClick={() => setDrawerOpen(false)} className="text-blue-600">Login</Link>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
