// src/pages/auth/SignupPage.tsx
import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import SignupForm from '../../components/auth/SignupForm';

const SignupPage: React.FC = () => (
  <AuthLayout>
    <SignupForm />
  </AuthLayout>
);

export default SignupPage;
