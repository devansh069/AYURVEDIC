// src/components/auth/ForgotPasswordForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { mockSendOTP } from '../../data/mockAuth';
import { ForgotPasswordFormData } from '../../types/auth';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>();
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError('');
    setServerSuccess('');
    const res = await mockSendOTP(data.email);
    if (res.success) {
      // In demo we can pass OTP via state or query; here just navigate
      navigate('/auth/otp', { state: { email: data.email } });
    } else {
      setServerError(res.error ?? 'Failed to send OTP');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-semibold text-primary mb-4 text-center">Forgot Password</h2>
      {serverError && <p className="text-error text-center">{serverError}</p>}
      <div>
        <label className="block text-sm font-medium text-text mb-1" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', { required: 'Email is required' })}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-error' : 'border-gray-300'}`}
        />
        {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition-colors"
      >
        Send OTP
      </button>
    </motion.form>
  );
};

export default ForgotPasswordForm;
