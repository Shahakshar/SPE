// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 px-6 py-12">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-indigo-800">Welcome to Oasis Care</h1>
        <p className="mt-4 text-lg text-gray-600">Book appointments with top specialists from the comfort of your home.</p>
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/doctors"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow hover:bg-indigo-700 transition"
          >
            View Doctors
          </Link>
          <Link
            to="/register"
            className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition"
          >
            Register Now
          </Link>
        </div>

        {/* Section: Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-white shadow rounded-2xl">
            <h2 className="text-xl font-semibold text-indigo-700">Easy Booking</h2>
            <p className="mt-2 text-gray-600">Choose from flexible time slots and book with ease.</p>
          </div>
          <div className="p-6 bg-white shadow rounded-2xl">
            <h2 className="text-xl font-semibold text-indigo-700">Verified Doctors</h2>
            <p className="mt-2 text-gray-600">All doctors are certified and experienced in their fields.</p>
          </div>
          <div className="p-6 bg-white shadow rounded-2xl">
            <h2 className="text-xl font-semibold text-indigo-700">Track Appointments</h2>
            <p className="mt-2 text-gray-600">See upcoming and past appointments with your doctors.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
