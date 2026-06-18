import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all common required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      let userData: any = { name, email, phone };
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

      const result = await signup(userData, password, role);
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
