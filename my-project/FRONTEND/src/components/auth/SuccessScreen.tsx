// src/components/auth/SuccessScreen.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const SuccessScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth/login');
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <FiCheckCircle size={80} className="text-success mb-4" />
      <h2 className="text-2xl font-semibold text-primary mb-2">Success!</h2>
      <p className="text-text mb-6">Your operation completed successfully.</p>
      <button
        onClick={handleLogin}
        className="px-6 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
      >
        Back to Login
      </button>
    </motion.div>
  );
};

export default SuccessScreen;
