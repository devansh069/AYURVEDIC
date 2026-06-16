// src/components/auth/AuthLayout.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { isDemo } from '../../data/mockAuth';
import logo from '../../assets/logo.svg'; // placeholder logo

interface Props {
  children: React.ReactNode;
}

const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left branding panel - hidden on small screens */}
      <div className="hidden md:flex w-1/2 flex-col items-center justify-center p-8 bg-gradient-to-br from-primary to-secondary text-white">
        <img src={logo} alt="AyurVeda Connect" className="w-32 h-32 mb-4" />
        <h1 className="text-4xl font-bold mb-2">AyurVeda Connect</h1>
        <h2 className="text-2xl font-semibold mb-4">Your Complete Ayurveda Healthcare Ecosystem</h2>
        <p className="text-center max-w-md mb-6">
          Find doctors, discover treatments, book appointments, track recovery, manage medical records and receive personalized wellness guidance.
        </p>
        <ul className="space-y-2 text-left max-w-sm">
          <li>✓ Verified Doctors</li>
          <li>✓ Trusted Clinics</li>
          <li>✓ Recovery Tracking</li>
          <li>✓ AI Health Guidance</li>
          <li>✓ Personalized Diet Plans</li>
          <li>✓ Secure Medical Records</li>
        </ul>
      </div>
      {/* Right auth card */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        {isDemo && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-3 py-1 rounded shadow-lg">
            Using Demo Data
          </div>
        )}
        <motion.div
          className="w-full max-w-md bg-card bg-opacity-70 backdrop-blur-md rounded-xl shadow-2xl p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
