// src/components/auth/SignupForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { mockSignup } from '../../data/mockAuth';
import { SignupFormData } from '../../types/auth';
import { useNavigate } from 'react-router-dom';

const passwordStrength = (pwd: string) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score; // 0-5
};

const SignupForm: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const pwd = watch('password', '');
  const strength = passwordStrength(pwd);

  const onSubmit = async (data: SignupFormData) => {
    setServerError('');
    if (data.password !== data.confirmPassword) {
      setServerError('Passwords do not match');
      return;
    }
    const res = await mockSignup({ name: data.name, email: data.email, password: data.password });
    if (res.success) {
      navigate('/auth/login');
    } else {
      setServerError(res.error ?? 'Signup failed');
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
      <h2 className="text-2xl font-semibold text-primary mb-4 text-center">Create Account</h2>
      {serverError && <p className="text-error text-center">{serverError}</p>}
      <div>
        <label className="block text-sm font-medium text-text mb-1" htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'Name is required' })}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? 'border-error' : 'border-gray-300'}`}
        />
        {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
      </div>
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
      <div className="relative">
        <label className="block text-sm font-medium text-text mb-1" htmlFor="password">Password</label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          {...register('password', { required: 'Password is required' })}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.password ? 'border-error' : 'border-gray-300'}`}
        />
        <span
          className="absolute right-3 top-9 cursor-pointer text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </span>
        {errors.password && <p className="text-error text-sm mt-1">{errors.password.message}</p>}
        {pwd && (
          <div className="mt-1 h-2 w-full bg-gray-200 rounded">
            <div
              className={`h-full rounded ${strength < 3 ? 'bg-error' : strength < 5 ? 'bg-warning' : 'bg-success'}`}
              style={{ width: `${(strength / 5) * 100}%` }}
            />
          </div>
        )}
      </div>
      <div className="relative">
        <label className="block text-sm font-medium text-text mb-1" htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          {...register('confirmPassword', { required: 'Please confirm password' })}
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
      <div className="flex items-center">
        <input
          id="agreeTerms"
          type="checkbox"
          {...register('agreeTerms', { required: true })}
          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label htmlFor="agreeTerms" className="ml-2 text-sm text-text">
          I agree to the terms and conditions
        </label>
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition-colors"
      >
        Register
      </button>
    </motion.form>
  );
};

export default SignupForm;
