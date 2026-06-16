// src/components/auth/ResetPasswordForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { mockResetPassword } from '../../data/mockAuth';
import { ResetPasswordFormData } from '../../types/auth';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPasswordForm: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation() as any;
  const email = location.state?.email || '';

  const pwd = watch('newPassword', '');

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError('');
    if (data.newPassword !== data.confirmPassword) {
      setServerError('Passwords do not match');
      return;
    }
    const res = await mockResetPassword(email, data.newPassword);
    if (res.success) {
      setServerSuccess('Password reset successful');
      setTimeout(() => navigate('/auth/login'), 1500);
    } else {
      setServerError(res.error ?? 'Reset failed');
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
      <h2 className="text-2xl font-semibold text-primary mb-4 text-center">Reset Password</h2>
      {serverError && <p className="text-error text-center">{serverError}</p>}
      {serverSuccess && <p className="text-success text-center">{serverSuccess}</p>}
      <div className="relative">
        <label className="block text-sm font-medium text-text mb-1" htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          type={showPassword ? 'text' : 'password'}
          {...register('newPassword', { required: 'New password required' })}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.newPassword ? 'border-error' : 'border-gray-300'}`}
        />
        <span
          className="absolute right-3 top-9 cursor-pointer text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </span>
        {errors.newPassword && <p className="text-error text-sm mt-1">{errors.newPassword.message}</p>}
      </div>
      <div className="relative">
        <label className="block text-sm font-medium text-text mb-1" htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          {...register('confirmPassword', { required: 'Confirm password required' })}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.confirmPassword ? 'border-error' : 'border-gray-300'}`}
        />
        <span
          className="absolute right-3 top-9 cursor-pointer text-gray-600"
          onClick={() => setShowConfirm(!showConfirm)}
        >
          {showConfirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </span>
        {errors.confirmPassword && <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>}
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition-colors"
      >
        Reset Password
      </button>
    </motion.form>
  );
};

export default ResetPasswordForm;
