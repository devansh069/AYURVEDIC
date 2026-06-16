// src/components/auth/OTPForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { mockVerifyOTP } from '../../data/mockAuth';
import { OTPFormData } from '../../types/auth';
import { useLocation, useNavigate } from 'react-router-dom';

const OTPForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<OTPFormData>();
  const [serverError, setServerError] = useState('');
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();
  const location = useLocation() as any;
  const email = location.state?.email || '';

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data: OTPFormData) => {
    setServerError('');
    const res = await mockVerifyOTP(data.otp);
    if (res.success) {
      navigate('/auth/reset', { state: { email } });
    } else {
      setServerError(res.error ?? 'Invalid OTP');
    }
  };

  const handleResend = async () => {
    // For mock, reuse mockSendOTP (import not needed for demo)
    // Here we just reset timer
    setTimer(30);
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-semibold text-primary mb-4 text-center">Enter OTP</h2>
      {serverError && <p className="text-error text-center">{serverError}</p>}
      <p className="text-sm text-text text-center mb-2">OTP sent to {email}</p>
      <div>
        <label className="block text-sm font-medium text-text mb-1" htmlFor="otp">OTP</label>
        <input
          id="otp"
          type="text"
          maxLength={6}
          {...register('otp', { required: 'OTP is required', pattern: { value: /^[0-9]{6}$/, message: 'Enter 6 digits' } })}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.otp ? 'border-error' : 'border-gray-300'}`}
        />
        {errors.otp && <p className="text-error text-sm mt-1">{errors.otp.message}</p>}
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition-colors"
        disabled={timer === 0 ? false : true}
      >
        Verify OTP
      </button>
      <div className="text-center mt-2">
        {timer > 0 ? (
          <span className="text-text">Resend available in {timer}s</span>
        ) : (
          <button type="button" onClick={handleResend} className="text-primary underline">
            Resend OTP
          </button>
        )}
      </div>
    </motion.form>
  );
};

export default OTPForm;
