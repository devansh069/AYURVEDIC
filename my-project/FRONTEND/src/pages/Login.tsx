import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // UX states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await login(email, password, role);
      if (result.success) {
        // Redirect based on role
        if (role === 'patient') {
          navigate('/dashboard');
        } else {
          navigate('/doctor-dashboard');
        }
      } else {
        setError(result.error || 'Authentication failed.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12 bg-gradient-to-br from-[#2E7D32]/5 via-[#F8FFF8] to-[#D4AF37]/5 relative overflow-hidden">
      {/* Background Decorative Blur Circles */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-[#2E7D32]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Logo and Greeting */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-[#2E7D32]/5 border border-[#2E7D32]/10 px-3 py-1 rounded-full text-[10px] font-bold text-[#2E7D32] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>AyurVeda Connect Ecosystem</span>
          </div>
          <h2 className="font-serif text-3xl font-black text-[#2E7D32] leading-tight">Welcome Back</h2>
          <p className="text-xs text-text-secondary leading-relaxed font-semibold">
            Log in to manage consultations, herbal treatments, and recovery logs.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="glass-effect rounded-3xl p-8 shadow-xl border border-white/60 bg-white/80">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold flex items-center space-x-2.5 animate-fade-in-up">
              <ShieldAlert className="w-4.5 h-4.5 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection Slider */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-text-secondary tracking-wider">
                Select Your Portal Role
              </label>
              <div className="bg-[#F0F5F0] p-1 rounded-xl flex relative">
                {/* Active Indicator Slide (Manual style toggle) */}
                <div
                  className={`absolute top-1 bottom-1 w-[48%] bg-primary rounded-lg transition-all duration-300 shadow-md ${
                    role === 'doctor' ? 'left-[51%]' : 'left-1'
                  }`}
                />
                
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`w-1/2 py-2 text-xs font-bold rounded-lg relative z-10 transition-colors duration-300 ${
                    role === 'patient' ? 'text-white font-extrabold' : 'text-text-secondary hover:text-primary'
                  }`}
                >
                  Patient Portal
                </button>
                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={`w-1/2 py-2 text-xs font-bold rounded-lg relative z-10 transition-colors duration-300 ${
                    role === 'doctor' ? 'text-white font-extrabold' : 'text-text-secondary hover:text-primary'
                  }`}
                >
                  Doctor Portal
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-[10px] uppercase font-bold text-text-secondary tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder={
                    role === 'patient' ? 'priyanshi@ayurvedaconnect.com' : 'dr.arun@ayurvedaconnect.com'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-gray-150 rounded-xl pl-10 pr-4 py-3 text-xs text-text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-[10px] uppercase font-bold text-text-secondary tracking-wider">
                  Password
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset links will be simulated soon.'); }} className="text-[10px] font-bold text-primary hover:text-accent transition-colors">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-gray-150 rounded-xl pl-10 pr-4 py-3 text-xs text-text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4.5 h-4.5 text-primary border-gray-300 rounded focus:ring-primary accent-primary cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-xs font-semibold text-text-secondary cursor-pointer select-none">
                Remember my session on this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-light disabled:bg-primary/50 text-white font-bold text-xs py-3.5 rounded-xl shadow-md shadow-primary/10 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Login to Portal</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Info Alert */}
          <div className="mt-6 bg-[#2E7D32]/5 border border-[#2E7D32]/10 p-3.5 rounded-xl text-[10.5px] text-text-secondary leading-relaxed font-semibold">
            <span className="text-primary font-bold block mb-1">💡 Demo Accounts:</span>
            Patient: <code className="bg-[#FAF9F6] px-1 py-0.5 rounded text-primary border border-primary/10">priyanshi@ayurvedaconnect.com</code> / password: <code className="bg-[#FAF9F6] px-1 py-0.5 rounded text-primary border border-primary/10">password</code><br/>
            Doctor: <code className="bg-[#FAF9F6] px-1 py-0.5 rounded text-primary border border-primary/10">dr.arun@ayurvedaconnect.com</code> / password: <code className="bg-[#FAF9F6] px-1 py-0.5 rounded text-primary border border-primary/10">password</code>
          </div>
        </div>

        {/* Redirect to Signup */}
        <div className="text-center mt-6">
          <p className="text-xs font-semibold text-text-secondary">
            Don't have an Ayurvedic portal account?{' '}
            <Link to="/signup" className="text-primary hover:text-accent font-bold transition-colors">
              Sign Up Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
