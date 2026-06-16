// src/components/auth/SocialLoginButtons.tsx
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaFacebookF, FaLinkedin } from 'react-icons/fa';

interface SocialLoginButtonsProps {
  onLogin?: (provider: string) => void;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ onLogin }) => {
  const providers = [
    { name: 'google', icon: <FcGoogle size={20} />, label: 'Continue with Google' },
    { name: 'apple', icon: <FaApple size={20} />, label: 'Continue with Apple' },
    { name: 'facebook', icon: <FaFacebookF size={20} />, label: 'Continue with Facebook' },
    { name: 'linkedin', icon: <FaLinkedin size={20} />, label: 'Continue with LinkedIn' },
  ];

  return (
    <div className="space-y-3 mt-4">
      {providers.map((p) => (
        <button
          key={p.name}
          type="button"
          onClick={() => onLogin && onLogin(p.name)}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 transition"
        >
          {p.icon}
          <span className="text-sm text-text">{p.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SocialLoginButtons;
