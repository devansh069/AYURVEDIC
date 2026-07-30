import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, loginWithGoogle, loginWithGoogleToken } = useAuth();
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

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError(null);
      setLoading(true);
      try {
        const result = await loginWithGoogleToken(tokenResponse.access_token, role);
        if (result.success) {
          if (role === 'patient') {
            navigate('/dashboard');
          } else {
            navigate('/doctor-dashboard');
          }
        } else {
          setError(result.error || 'Google Login failed.');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred during Google authentication.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google sign-in was canceled or failed.');
    }
  });

  const handleGoogleLogin = () => {
    if (role === 'patient') {
      googleLogin();
    } else {
      const emailStr = prompt("Enter your Google Account email:", "dr.arun@ayurvedaconnect.com");
      if (!emailStr) return;
      
      setError(null);
      setLoading(true);
      loginWithGoogle(emailStr, role)
        .then(result => {
          if (result.success) {
            navigate('/doctor-dashboard');
          } else {
            setError(result.error || 'Google Login failed.');
          }
        })
        .catch(err => {
          console.error(err);
          setError('An error occurred during Google authentication.');
        })
        .finally(() => setLoading(false));
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

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-gray-150 w-full"></div>
              <span className="absolute bg-[#FAF9F6] px-3 text-[10px] uppercase font-bold text-gray-400">
                Or Continue With
              </span>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 font-bold text-xs py-3 rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.74 14.93 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.86 3C6.35 7.55 8.94 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.44c-.28 1.48-1.11 2.73-2.36 3.58l3.66 2.84c2.14-1.97 3.39-4.87 3.39-8.55z" />
                <path fill="#FBBC05" d="M5.36 14.5c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.5 7.06C.54 8.98 0 11.12 0 13.37s.54 4.39 1.5 6.31l3.86-3.18z" />
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.01.68-2.31 1.09-4.3 1.09-3.06 0-5.65-2.51-6.64-5.46L1.5 16.06C3.4 19.91 7.35 22.5 12 22.5z" />
              </svg>
              <span>Sign in with Google</span>
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
