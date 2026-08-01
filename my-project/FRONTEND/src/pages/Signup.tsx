import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Mail, Lock, User, Phone, MapPin, Briefcase, Award, Sparkles, ShieldCheck, ShieldAlert, Heart, Calendar } from 'lucide-react';

export const Signup: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Common Form States
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Google sign up states
  const [googleId, setGoogleId] = useState<string | null>(null);
  const [loginProvider, setLoginProvider] = useState<'local' | 'google'>('local');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Patient Specific States
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [city, setCity] = useState('');
  const [doshaType, setDoshaType] = useState('Pitta-Kapha');
  const [primaryGoal, setPrimaryGoal] = useState('PCOS Management');

  // Doctor Specific States
  const [specialization, setSpecialization] = useState('Panchakarma Specialist');
  const [qualification, setQualification] = useState('BAMS, MD (Ayurveda)');
  const [experience, setExperience] = useState('');
  const [clinicName, setClinicName] = useState('');

  // UX States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError(null);
      setLoading(true);
      try {
        const userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        const googleUser = userInfoRes.data;
        if (googleUser && googleUser.email) {
          setName(googleUser.name || '');
          setEmail(googleUser.email);
          setGoogleId(googleUser.sub);
          setProfilePhoto(googleUser.picture || null);
          setLoginProvider('google');
          alert('Google account authenticated! Please complete the remaining profile details below and click Sign Up to create your account.');
        } else {
          setError('Failed to fetch user info from Google.');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred during Google authentication.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google sign-up was canceled or failed.');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isGoogle = loginProvider === 'google';

    // Validation
    if (!name || !email) {
      setError('Please fill in all common required fields.');
      return;
    }
    if (!isGoogle && (!password || !confirmPassword)) {
      setError('Please fill in all common required fields.');
      return;
    }
    if (!isGoogle && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!isGoogle && password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      let userData: any = { 
        name, 
        email, 
        phone, 
        googleId, 
        loginProvider, 
        profilePhoto 
      };
      if (role === 'patient') {
        userData = {
          ...userData,
          age,
          gender,
          city,
          doshaType,
          healthGoals: [primaryGoal],
        };
      } else {
        userData = {
          ...userData,
          specialization,
          qualification,
          experience: experience ? `${experience}+ Years` : '5+ Years',
          clinicName,
          city,
        };
      }

      const result = await signup(userData, isGoogle ? '' : password, role);
      if (result.success) {
        if (role === 'patient') {
          navigate('/dashboard');
        } else {
          navigate('/doctor-dashboard');
        }
      } else {
        setError(result.error || 'Failed to create account.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[95vh] flex items-center justify-center px-6 py-12 bg-gradient-to-br from-[#2E7D32]/5 via-[#F8FFF8] to-[#D4AF37]/5 relative overflow-hidden">
      {/* Decorative Blur Circles */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#2E7D32]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 animate-fade-in-up">
        {/* Greetings */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-[#2E7D32]/5 border border-[#2E7D32]/10 px-3 py-1 rounded-full text-[10px] font-bold text-[#2E7D32] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Join our Healing Network</span>
          </div>
          <h2 className="font-serif text-3xl font-black text-[#2E7D32] leading-tight">Create Portal Account</h2>
          <p className="text-xs text-text-secondary leading-relaxed font-semibold max-w-md mx-auto">
            Choose your role and register to access custom Ayurvedic planners, diagnostic timelines, and video appointments.
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-effect rounded-3xl p-6 md:p-8 shadow-xl border border-white/60 bg-white/80">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold flex items-center space-x-2.5 animate-fade-in-up">
              <ShieldAlert className="w-4.5 h-4.5 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Switcher */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-text-secondary tracking-wider">
                I want to register as a:
              </label>
              <div className="bg-[#F0F5F0] p-1 rounded-xl flex relative">
                <div
                  className={`absolute top-1 bottom-1 w-[48%] bg-primary rounded-lg transition-all duration-300 shadow-md ${
                    role === 'doctor' ? 'left-[51%]' : 'left-1'
                  }`}
                />
                
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`w-1/2 py-2.5 text-xs font-bold rounded-lg relative z-10 transition-colors duration-300 ${
                    role === 'patient' ? 'text-white font-extrabold' : 'text-text-secondary hover:text-primary'
                  }`}
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={`w-1/2 py-2.5 text-xs font-bold rounded-lg relative z-10 transition-colors duration-300 ${
                    role === 'doctor' ? 'text-white font-extrabold' : 'text-text-secondary hover:text-primary'
                  }`}
                >
                  Ayurvedic Practitioner (Doctor)
                </button>
              </div>
            </div>

            {/* Google Sign Up Button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => googleSignup()}
                className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 font-bold text-xs py-3.5 rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                  <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.74 14.93 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.86 3C6.35 7.55 8.94 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.44c-.28 1.48-1.11 2.73-2.36 3.58l3.66 2.84c2.14-1.97 3.39-4.87 3.39-8.55z" />
                  <path fill="#FBBC05" d="M5.36 14.5c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.5 7.06C.54 8.98 0 11.12 0 13.37s.54 4.39 1.5 6.31l3.86-3.18z" />
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.01.68-2.31 1.09-4.3 1.09-3.06 0-5.65-2.51-6.64-5.46L1.5 16.06C3.4 19.91 7.35 22.5 12 22.5z" />
                </svg>
                <span>Sign up with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-gray-150 w-full"></div>
                <span className="absolute bg-[#FAF9F6] px-3 text-[10px] uppercase font-bold text-gray-400">
                  Or Fill Details Manually
                </span>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* --- Section A: Core Credentials --- */}
              <div className="space-y-4">
                <h3 className="font-serif text-sm font-bold text-primary pb-1.5 border-b border-gray-100 flex items-center space-x-1.5">
                  <User className="w-4.5 h-4.5 text-accent" />
                  <span>Account Credentials</span>
                </h3>

                {/* Full Name */}
                <div className="space-y-1">
                  <label htmlFor="name" className="block text-[9.5px] uppercase font-bold text-text-secondary">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="e.g. Devansh Singh"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-gray-150 rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-[9.5px] uppercase font-bold text-text-secondary">
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
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-gray-150 rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label htmlFor="phone" className="block text-[9.5px] uppercase font-bold text-text-secondary">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-gray-150 rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Password Fields */}
                {loginProvider === 'google' ? (
                  <div className="bg-[#2E7D32]/5 border border-[#2E7D32]/10 p-3.5 rounded-xl text-[10.5px] text-[#2E7D32] leading-relaxed font-semibold flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span>Authenticated via Google ({email}). Password is not required.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="pass" className="block text-[9.5px] uppercase font-bold text-text-secondary">
                        Password
                      </label>
                      <input
                        id="pass"
                        type="password"
                        required
                        placeholder="min. 6 chars"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#FAF9F6] border border-gray-150 rounded-xl px-4 py-2.5 text-xs text-text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="confPass" className="block text-[9.5px] uppercase font-bold text-text-secondary">
                        Confirm Pass
                      </label>
                      <input
                        id="confPass"
                        type="password"
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-[#FAF9F6] border border-gray-150 rounded-xl px-4 py-2.5 text-xs text-text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* --- Section B: Role Specific Details --- */}
              <div className="space-y-4">
                
                {role === 'patient' ? (
                  <>
                    <h3 className="font-serif text-sm font-bold text-primary pb-1.5 border-b border-gray-100 flex items-center space-x-1.5">
                      <Heart className="w-4.5 h-4.5 text-accent" />
                      <span>Patient Health Profile</span>
                    </h3>

                    {/* Age & Gender */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label htmlFor="age" className="block text-[9.5px] uppercase font-bold text-text-secondary">
                          Age (Years)
                        </label>
                        <input
                          id="age"
                          type="number"
                          required
                          placeholder="e.g. 28"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-gray-150 rounded-xl px-4 py-2.5 text-xs text-text-primary font-semibold outline-none text-center focus:border-primary focus:bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="gender" className="block text-[9.5px] uppercase font-bold text-text-secondary">
                          Gender
                        </label>
                        <select
                          id="gender"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-gray-150 rounded-xl px-4 py-2.5 text-xs text-text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all"
                        >
                          <option>Female</option>
                          <option>Male</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>

                    {/* City */}
                    <div className="space-y-1">
                      <label htmlFor="city" className="block text-[9.5px] uppercase font-bold text-text-secondary">
                        City / Town
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                          <MapPin className="w-4 h-4" />
                        </span>
                        <input
                          id="city"
                          type="text"
                          required
                          placeholder="e.g. New Delhi"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-gray-150 rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Dosha Type */}
                    <div className="space-y-1">
                      <label htmlFor="dosha" className="block text-[9.5px] uppercase font-bold text-text-secondary">
                        Constitutional Dosha (Prakriti)
                      </label>
                      <select
                        id="dosha"
                        value={doshaType}
                        onChange={(e) => setDoshaType(e.target.value)}
                        className="w-full bg-[#FAF9F6] border border-gray-150 rounded-xl px-4 py-2.5 text-xs text-text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all"
                      >
                        <option>Pitta-Kapha (Recommended)</option>
                        <option>Vata-Pitta</option>
                        <option>Kapha-Vata</option>
                        <option>Pitta Dominant</option>
                        <option>Vata Dominant</option>
                        <option>Kapha Dominant</option>
                        <option>Tri-Doshic (Balanced)</option>
                        <option>Unknown / Don't Know</option>
                      </select>
                    </div>

                    {/* Health Goal */}
                    <div className="space-y-1">
                      <label htmlFor="goal" className="block text-[9.5px] uppercase font-bold text-text-secondary">
                        Primary Wellness Goal
                      </label>
                      <select
                        id="goal"
                        value={primaryGoal}
                        onChange={(e) => setPrimaryGoal(e.target.value)}
                        className="w-full bg-[#FAF9F6] border border-gray-150 rounded-xl px-4 py-2.5 text-xs text-text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all"
                      >
                        <option>PCOS Management</option>
                        <option>Stress Reduction</option>
                        <option>Weight Management</option>
                        <option>Improved Digestion</option>
                        <option>Chronic Pain Relief</option>
                        <option>General Longevity</option>
                      </select>
                    </div>

                  </>
                ) : (
                  <>
                    <h3 className="font-serif text-sm font-bold text-primary pb-1.5 border-b border-gray-100 flex items-center space-x-1.5">
                      <Briefcase className="w-4.5 h-4.5 text-accent" />
                      <span>Professional Practitioner Details</span>
                    </h3>

                    {/* Specialization */}
                    <div className="space-y-1">
                      <label htmlFor="spec" className="block text-[9.5px] uppercase font-bold text-text-secondary">
                        Ayurvedic Specialty
                      </label>
                      <select
                        id="spec"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className="w-full bg-[#FAF9F6] border border-gray-150 rounded-xl px-4 py-2.5 text-xs text-text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all"
                      >
                        <option>Panchakarma Specialist</option>
                        <option>Ayurvedic General Physician</option>
                        <option>Yoga & Diet Expert</option>
                        <option>Dravya Guna (Herbs) Expert</option>
                        <option>Rasayana (Anti-Aging) Scholar</option>
                      </select>
                    </div>

                    {/* Qualification */}
                    <div className="space-y-1">
                      <label htmlFor="qual" className="block text-[9.5px] uppercase font-bold text-text-secondary">
                        Academic Qualifications
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                          <Award className="w-4 h-4" />
                        </span>
                        <input
                          id="qual"
                          type="text"
                          required
                          placeholder="e.g. BAMS, MD (Ayurveda)"
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-gray-150 rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Experience (Years) */}
                    <div className="space-y-1">
                      <label htmlFor="exp" className="block text-[9.5px] uppercase font-bold text-text-secondary">
                        Years of Experience
                      </label>
                      <input
                        id="exp"
                        type="number"
                        required
                        placeholder="e.g. 12"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full bg-[#FAF9F6] border border-gray-150 rounded-xl px-4 py-2.5 text-xs text-text-primary font-semibold outline-none text-center focus:border-primary focus:bg-white transition-all"
                      />
                    </div>

                    {/* Clinic Name & City */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label htmlFor="clName" className="block text-[9.5px] uppercase font-bold text-text-secondary">
                          Affiliated Clinic
                        </label>
                        <input
                          id="clName"
                          type="text"
                          required
                          placeholder="e.g. AyurCare Hub"
                          value={clinicName}
                          onChange={(e) => setClinicName(e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-gray-150 rounded-xl px-4 py-2.5 text-xs text-text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="clCity" className="block text-[9.5px] uppercase font-bold text-text-secondary">
                          City
                        </label>
                        <input
                          id="clCity"
                          type="text"
                          required
                          placeholder="e.g. Jaipur"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-gray-150 rounded-xl px-4 py-2.5 text-xs text-text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                  </>
                )}

              </div>

            </div>

            {/* Terms of Agreement Check */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className="w-4.5 h-4.5 text-primary border-gray-300 rounded focus:ring-primary accent-primary mt-0.5 cursor-pointer"
              />
              <label htmlFor="terms" className="ml-2 text-xs font-semibold text-text-secondary leading-relaxed cursor-pointer select-none">
                I verify that the medical logs and diagnostic information submitted above are accurate and I agree to the platform's traditional counseling guidelines.
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
                  <span>Creating Account & Seeding Profile...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Register & Open Dashboard</span>
                </>
              )}
            </button>
          </form>

        </div>

        {/* Redirect to Login */}
        <div className="text-center mt-6">
          <p className="text-xs font-semibold text-text-secondary">
            Already have an Ayurvedic account?{' '}
            <Link to="/login" className="text-primary hover:text-accent font-bold transition-colors">
              Log In Instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
