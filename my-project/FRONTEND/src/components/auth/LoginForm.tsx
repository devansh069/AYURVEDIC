// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { mockLogin } from '../../data/mockAuth';
import { LoginFormData } from '../../types/auth';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    setServerError('');
    const res = await mockLogin(data.email, data.password);
    if (res.success) {
      // redirect to dashboard or home
      navigate('/dashboard');
    } else {
      setServerError(res.error ?? 'Login failed');
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
      <h2 className="text-2xl font-semibold text-primary mb-4 text-center">Login</h2>
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
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition-colors"
      >
        Sign In
      </button>
      <div className="flex justify-between text-sm mt-2">
        <span className="text-primary cursor-pointer" onClick={() => navigate('/auth/forgot')}>Forgot Password?</span>
        <span className="text-primary cursor-pointer" onClick={() => navigate('/auth/signup')}>Create Account</span>
      </div>
    </motion.form>
  );
};

export default LoginForm;
