import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStar, FaHeart, FaRegHeart, FaMapPin, FaClock, FaGraduationCap, 
  FaAward, FaBriefcase, FaArrowRight, FaGlobe, FaCheckCircle, 
  FaChevronDown, FaChevronUp, FaTimes, FaHospital, FaRupeeSign, 
  FaFilter, FaUndo, FaSearch, FaUserCheck, FaShieldAlt, FaCalendarCheck,
  FaCheck, FaQuoteLeft
} from 'react-icons/fa';
import { MdVerified, MdLanguage, MdChat, MdVideoCall, MdOutlineRateReview, MdOutlineDone } from 'react-icons/md';
import { FiPhone, FiMail, FiMapPin, FiSearch } from 'react-icons/fi';
import { MOCK_DIRECTORY_DOCTORS, TOP_SPECIALIZATIONS, TOP_CITIES, FAQS, MOCK_REVIEWS_DIRECTORY, DirectoryDoctor } from '../data/directoryMockData';

// Animations Config
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const Doctors: React.FC = () => {
  // Directory & Search State
  const [searchName, setSearchName] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchClinic, setSearchClinic] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  
  // Active Refined Filters
  const [filterExperience, setFilterExperience] = useState<number>(0); // Min experience
  const [filterRating, setFilterRating] = useState<number>(0); // Min rating
  const [filterMaxFee, setFilterMaxFee] = useState<number>(1500); // Max fee
  const [filterGender, setFilterGender] = useState<string>('all'); // Male/Female
  const [filterConsultationType, setFilterConsultationType] = useState<string>('all'); // Online/In-Clinic/Both
  const [filterLanguage, setFilterLanguage] = useState<string>('all'); // Selected language
  const [filterAvailability, setFilterAvailability] = useState<string>('all'); // Availability status
  
  // Sort State
  const [sortBy, setSortBy] = useState<string>('rating'); // rating, experience, fee-low, fee-high, reviews, newest

  // Saved Doctors State (Favorites)
  const [savedDoctorIds, setSavedDoctorIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saved_doctors');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("Failed parsing saved_doctors from localStorage", e);
    }
    return [];
  });

  // Profile Modal State
  const [activeProfile, setActiveProfile] = useState<DirectoryDoctor | null>(null);
  // Booking confirmation status
  const [bookingCompleted, setBookingCompleted] = useState<boolean>(false);
  const [bookingFormData, setBookingFormData] = useState({
    patientName: '',
    phone: '',
    email: '',
    date: '',
    time: '10:00 AM',
    type: 'Online Video'
  });

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Handle Save Doctor Toggle
  const toggleSaveDoctor = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedDoctorIds(prev => {
      const updated = prev.includes(id) ? prev.filter(savedId => savedId !== id) : [...prev, id];
      localStorage.setItem('saved_doctors', JSON.stringify(updated));
      return updated;
    });
  };

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSearchName('');
    setSearchCity('');
    setSearchClinic('');
    setSelectedSpecialization('');
    setSelectedLocation('');
    setFilterExperience(0);
    setFilterRating(0);
    setFilterMaxFee(1500);
    setFilterGender('all');
    setFilterConsultationType('all');
    setFilterLanguage('all');
    setFilterAvailability('all');
    setSortBy('rating');
  };

  // Perform search / filter operations in frontend
  const processedDoctors = useMemo(() => {
    let result = [...MOCK_DIRECTORY_DOCTORS];

    // 1. Text Search (Doctor Name, Specialization, Clinic)
    if (searchName) {
      const searchLower = searchName.toLowerCase();
      result = result.filter(doc => 
        doc.name.toLowerCase().includes(searchLower) ||
        doc.specialization.toLowerCase().includes(searchLower) ||
        doc.clinicName.toLowerCase().includes(searchLower)
      );
    }

    // 2. City Filter (Top selector or City filter)
    const cityQuery = (searchCity || selectedLocation).toLowerCase();
    if (cityQuery) {
      result = result.filter(doc => doc.city.toLowerCase().includes(cityQuery));
    }

    // 3. Clinic Filter
    if (searchClinic) {
      result = result.filter(doc => doc.clinicName.toLowerCase().includes(searchClinic.toLowerCase()));
    }

    // 4. Specialization Filter
    if (selectedSpecialization) {
      result = result.filter(doc => doc.specialization === selectedSpecialization);
    }

    // 5. Experience Filter
    if (filterExperience > 0) {
      result = result.filter(doc => doc.experience >= filterExperience);
    }

    // 6. Rating Filter
    if (filterRating > 0) {
      result = result.filter(doc => doc.rating >= filterRating);
    }

    // 7. Max Fee Filter
    if (filterMaxFee < 1500) {
      result = result.filter(doc => doc.consultationFee <= filterMaxFee);
    }

    // 8. Gender Filter (Inferred from Dr. Name for demonstration)
    if (filterGender !== 'all') {
      const isFemale = ['sunita', 'meera', 'priya', 'kavita', 'neha', 'shalini', 'divya', 'rupa', 'geeta', 'pooja', 'kiran', 'arundhati'].some(
        name => result.find(d => d.name.toLowerCase().includes(name))
      );
      result = result.filter(doc => {
        const docNameLower = doc.name.toLowerCase();
        const docFemale = ['sunita', 'meera', 'priya', 'kavita', 'neha', 'shalini', 'divya', 'rupa', 'geeta', 'pooja', 'kiran', 'arundhati'].some(
          name => docNameLower.includes(name)
        );
        return filterGender === 'female' ? docFemale : !docFemale;
      });
    }

    // 9. Consultation Type Filter
    if (filterConsultationType !== 'all') {
      if (filterConsultationType === 'online') {
        result = result.filter(doc => doc.onlineConsultationFee > 0);
      } else if (filterConsultationType === 'inclinic') {
        result = result.filter(doc => doc.consultationFee > 0);
      }
    }

    // 10. Language Filter
    if (filterLanguage !== 'all') {
      result = result.filter(doc => doc.languages.includes(filterLanguage));
    }

    // 11. Availability Filter
    if (filterAvailability !== 'all') {
      result = result.filter(doc => doc.availability.toLowerCase().includes(filterAvailability.toLowerCase()));
    }

    // 12. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience - a.experience;
        case 'fee-low':
          return a.consultationFee - b.consultationFee;
        case 'fee-high':
          return b.consultationFee - a.consultationFee;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        case 'newest':
          // Simulate newest by id
          return b.id.localeCompare(a.id);
        default:
          return b.rating - a.rating;
      }
    });

    return result;
  }, [
    searchName, searchCity, searchClinic, selectedSpecialization, selectedLocation,
    filterExperience, filterRating, filterMaxFee, filterGender, filterConsultationType,
    filterLanguage, filterAvailability, sortBy
  ]);

  // Featured Doctors: Top 8 rated doctors from the list
  const featuredDoctors = useMemo(() => {
    return [...MOCK_DIRECTORY_DOCTORS]
      .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
      .slice(0, 8);
  }, []);

  // Submit Booking Form
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingCompleted(true);
    setTimeout(() => {
      // Auto close and reset after a delay
      setActiveProfile(null);
      setBookingCompleted(false);
      setBookingFormData({
        patientName: '',
        phone: '',
        email: '',
        date: '',
        time: '10:00 AM',
        type: 'Online Video'
      });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8FFF8] text-[#1A1A1A] font-sans antialiased overflow-hidden">
      
      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-24 px-6 md:px-12 bg-gradient-to-br from-[#2E7D32]/10 via-[#F8FFF8] to-[#D4AF37]/5 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#2E7D32]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-[#2E7D32]/10 border border-[#2E7D32]/20 px-4 py-1.5 rounded-full text-xs font-bold text-[#2E7D32] uppercase tracking-wider"
            >
              <MdVerified className="text-[#D4AF37] w-4 h-4" />
              <span>Verified Ayurvedic Specialists</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl md:text-6xl font-bold text-[#2E7D32] leading-tight"
            >
              Find Trusted <br />
              <span className="text-gradient font-bold">Ayurvedic Doctors</span> Near You
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-base text-gray-700 max-w-xl leading-relaxed"
            >
              Book in-clinic or secure online video consultations with highly qualified, certified Ayurvedic Vaidyas across India. Reclaim health naturally.
            </motion.p>
            
            {/* Embedded Search Widget */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-3 bg-white/70 backdrop-blur-md rounded-2xl md:rounded-full border border-white/80 shadow-lg flex flex-col md:flex-row items-center gap-3.5"
            >
              {/* Location Input */}
              <div className="flex items-center space-x-2.5 px-3 py-2 md:py-0 w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200">
                <FaMapPin className="text-[#2E7D32] w-4.5 h-4.5 shrink-0" />
                <input 
                  type="text" 
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Enter City (e.g. Delhi)"
                  className="bg-transparent border-none outline-none text-xs text-gray-800 w-full placeholder-gray-400"
                />
              </div>
              {/* Doctor Search Input */}
              <div className="flex items-center space-x-2.5 px-3 py-2 md:py-0 w-full md:w-1/2">
                <FaSearch className="text-[#2E7D32] w-4.5 h-4.5 shrink-0" />
                <input 
                  type="text" 
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Search doctor, specialization, or clinic name..."
                  className="bg-transparent border-none outline-none text-xs text-gray-800 w-full placeholder-gray-400"
                />
              </div>
              {/* Action Button */}
              <button 
                onClick={() => {
                  const element = document.getElementById('directory-results');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full md:w-auto bg-[#2E7D32] hover:bg-[#1B4D20] text-white font-bold text-xs py-3.5 px-7 rounded-xl md:rounded-full shadow-md transition-all flex items-center justify-center space-x-2 whitespace-nowrap cursor-pointer"
              >
                <span>Find Vaidyas</span>
                <FaArrowRight className="w-3 h-3 text-[#D4AF37]" />
              </button>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center">
            {/* Background vector visual illustration */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-72 h-72 md:w-96 md:h-96"
            >
              {/* Outer decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#2E7D32]/20 animate-spin" style={{ animationDuration: '30s' }} />
              {/* Inner glowing circle */}
              <div className="absolute inset-10 rounded-full bg-gradient-to-tr from-[#2E7D32]/20 to-[#D4AF37]/20 blur-xl" />
              {/* Main medical vector layout */}
              <div className="absolute inset-4 bg-white/45 backdrop-blur-sm rounded-full border border-white/60 shadow-xl flex items-center justify-center overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=400&q=80" 
                  alt="Ayurvedic Diagnostics"
                  className="w-full h-full object-cover transform scale-110 opacity-90 transition-transform hover:scale-105 duration-700"
                />
              </div>
              {/* Tiny tags */}
              <div className="absolute top-10 -left-6 bg-white border border-[#2E7D32]/10 p-3 rounded-2xl shadow-md flex items-center space-x-2 animate-bounce" style={{ animationDuration: '5s' }}>
                <span className="p-1 bg-[#4CAF50]/10 text-[#4CAF50] rounded-lg text-xs"><FaCheck /></span>
                <span className="text-[10px] font-bold text-gray-800">100% Herbal</span>
              </div>
              <div className="absolute bottom-10 -right-6 bg-white border border-[#2E7D32]/10 p-3 rounded-2xl shadow-md flex items-center space-x-2 animate-bounce" style={{ animationDuration: '7s' }}>
                <span className="p-1 bg-[#2196F3]/10 text-[#2196F3] rounded-lg text-xs">⭐</span>
                <span className="text-[10px] font-bold text-gray-800">4.9 Average Rating</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Statistics Section */}
      <section className="bg-white border-y border-[#2E7D32]/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          >
            {/* Stat 1 */}
            <motion.div variants={fadeInUp} className="text-center space-y-1">
              <h3 className="font-serif text-3xl md:text-5xl font-bold text-[#2E7D32]">500+</h3>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Verified Vaidyas</p>
            </motion.div>
            {/* Stat 2 */}
            <motion.div variants={fadeInUp} className="text-center space-y-1">
              <h3 className="font-serif text-3xl md:text-5xl font-bold text-[#2E7D32]">50+</h3>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Specializations</p>
            </motion.div>
            {/* Stat 3 */}
            <motion.div variants={fadeInUp} className="text-center space-y-1">
              <h3 className="font-serif text-3xl md:text-5xl font-bold text-[#2E7D32]">10,000+</h3>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Patients Healed</p>
            </motion.div>
            {/* Stat 4 */}
            <motion.div variants={fadeInUp} className="text-center space-y-1">
              <h3 className="font-serif text-3xl md:text-5xl font-bold text-[#2E7D32]">200+</h3>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Wellness Clinics</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 9. Top Specializations Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Medical Spectrum</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2E7D32]">Explore Top Specializations</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">Select a specialty to filter doctors specifically trained in those Ayurvedic branches.</p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5"
        >
          {TOP_SPECIALIZATIONS.map((spec) => (
            <motion.div 
              key={spec.name}
              variants={fadeInUp}
              onClick={() => {
                setSelectedSpecialization(spec.name);
                const element = document.getElementById('directory-results');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`p-6 bg-white border rounded-2xl text-center space-y-3 shadow-sm hover:shadow-md hover:border-[#2E7D32]/30 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden ${
                selectedSpecialization === spec.name ? 'border-[#2E7D32] bg-[#2E7D32]/5 ring-1 ring-[#2E7D32]' : 'border-gray-150'
              }`}
            >
              <div className="text-3xl">{spec.icon}</div>
              <div>
                <h4 className="font-bold text-xs text-gray-900">{spec.name}</h4>
                <p className="text-[9px] text-gray-400 mt-1">{spec.count} Available Doctors</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5. Featured Doctors Section */}
      <section className="py-20 px-6 md:px-12 bg-white border-y border-[#2E7D32]/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4">
            <div className="text-left space-y-3">
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Premium Selection</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2E7D32]">Our Featured Specialists</h2>
              <p className="text-xs text-gray-500 max-w-md">Vaidyas with exceptional patient rating scores, extensive experience, and high success rates.</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleResetFilters}
                className="bg-[#F8FFF8] hover:bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/30 font-bold text-xs px-5 py-2.5 rounded-full shadow-sm transition-all"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredDoctors.map((doc) => (
              <motion.div 
                key={doc.id}
                variants={fadeInUp}
                onClick={() => setActiveProfile(doc)}
                className="group relative bg-[#F8FFF8] border border-gray-150 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                {/* Image Section */}
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <img 
                    src={doc.photo} 
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Glass Verified Tag */}
                  <div className="absolute top-3 left-3 bg-white/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/50 text-[10px] font-bold text-[#2E7D32] flex items-center space-x-1 shadow-sm">
                    <MdVerified className="text-[#D4AF37] w-3 h-3" />
                    <span>VERIFIED</span>
                  </div>
                  {/* Saved button */}
                  <button 
                    onClick={(e) => toggleSaveDoctor(doc.id, e)}
                    className="absolute top-3 right-3 p-2 bg-white/75 backdrop-blur-sm rounded-full border border-white/50 text-gray-500 hover:text-red-500 hover:bg-white shadow-sm transition-all"
                  >
                    {savedDoctorIds.includes(doc.id) ? (
                      <FaHeart className="w-3.5 h-3.5 text-red-500" />
                    ) : (
                      <FaRegHeart className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-grow space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-bold uppercase text-[#2E7D32] bg-[#2E7D32]/10 px-2 py-0.5 rounded">
                      {doc.specialization}
                    </span>
                    <div className="flex items-center space-x-1 text-xs font-bold text-gray-800">
                      <FaStar className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                      <span>{doc.rating}</span>
                      <span className="text-[10px] text-gray-400 font-medium">({doc.reviewCount})</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-base font-bold text-gray-900">{doc.name}</h3>
                    <p className="text-[10.5px] text-gray-500 mt-0.5">{doc.qualification}</p>
                  </div>

                  <div className="space-y-1.5 pt-2 text-[11px] text-gray-600 border-t border-gray-100">
                    <div className="flex items-center space-x-1.5">
                      <FaBriefcase className="w-3.5 h-3.5 text-gray-400" />
                      <span>{doc.experience} Years Experience</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <FaHospital className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate">{doc.clinicName}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <FaMapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>{doc.city}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Consultation Fee</p>
                      <p className="text-xs font-extrabold text-gray-800 flex items-center">
                        <FaRupeeSign className="w-2.5 h-2.5" />
                        <span>{doc.consultationFee}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-[#4CAF50] font-bold">● Available Today</p>
                      <p className="text-[9px] text-gray-400">{doc.availability.split(',')[0]}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 pb-5 grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setActiveProfile(doc)}
                    className="w-full bg-[#2E7D32]/5 hover:bg-[#2E7D32]/10 border border-[#2E7D32]/20 text-[#2E7D32] font-bold text-[10px] uppercase tracking-wider py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    View Info
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProfile(doc);
                    }}
                    className="w-full bg-[#2E7D32] hover:bg-[#1B4D20] text-white font-bold text-[10px] uppercase tracking-wider py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Book Consultation
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. & 6. Search, Filter, Sort & All Doctors Directory */}
      <section id="directory-results" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Complete Directory</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2E7D32]">Find & Filter Doctors</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">Use filters and sort parameters to select the best physician fit for your body constitution.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* FILTER PANEL (Left Column - 3 Units) */}
          <div className="lg:col-span-3 bg-white border border-[#2E7D32]/10 p-6 rounded-2xl shadow-sm space-y-6 sticky top-28 z-20">
            <div className="flex justify-between items-center border-b border-gray-150 pb-3">
              <h3 className="font-serif text-base font-bold text-[#2E7D32] flex items-center space-x-2">
                <FaFilter className="w-3.5 h-3.5" />
                <span>Refine Search</span>
              </h3>
              <button 
                onClick={handleResetFilters}
                className="text-[10px] font-bold text-gray-400 hover:text-red-500 flex items-center space-x-1 cursor-pointer"
              >
                <FaUndo className="w-2.5 h-2.5" />
                <span>Reset All</span>
              </button>
            </div>

            {/* Specialization Filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Specialization</label>
              <select 
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full bg-[#F8FFF8] border border-gray-250 rounded-xl py-2.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-[#2E7D32]"
              >
                <option value="">All Specializations</option>
                {TOP_SPECIALIZATIONS.map(spec => (
                  <option key={spec.name} value={spec.name}>{spec.name}</option>
                ))}
              </select>
            </div>

            {/* Location Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Location / City</label>
              <select 
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-[#F8FFF8] border border-gray-250 rounded-xl py-2.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-[#2E7D32]"
              >
                <option value="">All Cities</option>
                {TOP_CITIES.map(city => (
                  <option key={city.name} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>

            {/* Experience Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <span>Min Experience</span>
                <span className="text-[#2E7D32] normal-case">{filterExperience || 'Any'} Years+</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="25" 
                value={filterExperience}
                onChange={(e) => setFilterExperience(Number(e.target.value))}
                className="w-full accent-[#2E7D32]"
              />
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Min Patient Rating</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 4.6, 4.8, 4.9].map((ratingVal) => (
                  <button
                    key={ratingVal}
                    onClick={() => setFilterRating(ratingVal)}
                    className={`py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                      filterRating === ratingVal 
                        ? 'bg-[#2E7D32] text-white border-[#2E7D32]' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-55'
                    }`}
                  >
                    {ratingVal === 0 ? 'Any' : `${ratingVal}⭐`}
                  </button>
                ))}
              </div>
            </div>

            {/* Consultation Fee Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <span>Max Consultation Fee</span>
                <span className="text-[#2E7D32] normal-case">₹{filterMaxFee}</span>
              </div>
              <input 
                type="range" 
                min="300" 
                max="1500" 
                step="50"
                value={filterMaxFee}
                onChange={(e) => setFilterMaxFee(Number(e.target.value))}
                className="w-full accent-[#2E7D32]"
              />
            </div>

            {/* Consultation Type Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Consultation Mode</label>
              <select
                value={filterConsultationType}
                onChange={(e) => setFilterConsultationType(e.target.value)}
                className="w-full bg-[#F8FFF8] border border-gray-250 rounded-xl py-2.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-[#2E7D32]"
              >
                <option value="all">All Modes</option>
                <option value="online">Online Video Consult</option>
                <option value="inclinic">In-Clinic Visit</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Doctor Gender</label>
              <div className="grid grid-cols-3 gap-1.5">
                {['all', 'male', 'female'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setFilterGender(g)}
                    className={`py-1.5 text-[10px] font-bold rounded-lg border uppercase transition-all cursor-pointer ${
                      filterGender === g 
                        ? 'bg-[#2E7D32] text-white border-[#2E7D32]' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-55'
                    }`}
                  >
                    {g === 'all' ? 'Any' : g}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Languages</label>
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="w-full bg-[#F8FFF8] border border-gray-250 rounded-xl py-2.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-[#2E7D32]"
              >
                <option value="all">Any Language</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Marathi">Marathi</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Tamil">Tamil</option>
                <option value="Kannada">Kannada</option>
                <option value="Telugu">Telugu</option>
                <option value="Malayalam">Malayalam</option>
              </select>
            </div>
          </div>

          {/* DOCTORS GRID RESULTS (Right Column - 9 Units) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Header Result Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4.5 border border-[#2E7D32]/10 rounded-2xl shadow-sm">
              <div>
                <p className="text-xs text-gray-500">
                  Showing <span className="font-bold text-[#2E7D32]">{processedDoctors.length}</span> Ayurvedic doctors matching filters
                </p>
              </div>
              
              <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Sort By</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#F8FFF8] border border-[#2E7D32]/20 rounded-xl py-2 px-3 text-xs text-gray-700 focus:outline-none focus:border-[#2E7D32] w-full sm:w-auto"
                >
                  <option value="rating">Highest Rating</option>
                  <option value="experience">Years of Experience</option>
                  <option value="fee-low">Fee: Low to High</option>
                  <option value="fee-high">Fee: High to Low</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="newest">Newest Doctors</option>
                </select>
              </div>
            </div>

            {/* Doctors Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {processedDoctors.map((doc) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={doc.id}
                    onClick={() => setActiveProfile(doc)}
                    className="bg-white border border-[#2E7D32]/10 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col justify-between cursor-pointer relative group"
                  >
                    {/* Header Image Info */}
                    <div className="relative h-44 bg-gray-50">
                      <img 
                        src={doc.photo} 
                        alt={doc.name}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                      {/* Save doctor icon */}
                      <button 
                        onClick={(e) => toggleSaveDoctor(doc.id, e)}
                        className="absolute top-3 right-3 p-2 bg-white/85 backdrop-blur-sm rounded-full border border-gray-100 text-gray-500 hover:text-red-500 hover:bg-white shadow-sm transition-all"
                      >
                        {savedDoctorIds.includes(doc.id) ? (
                          <FaHeart className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                        ) : (
                          <FaRegHeart className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Verified Badge */}
                      {doc.verified && (
                        <div className="absolute top-3 left-3 bg-[#2E7D32] text-white px-2.5 py-1 rounded-full text-[9px] font-bold flex items-center space-x-1 shadow-sm">
                          <MdVerified className="text-[#D4AF37]" />
                          <span>VERIFIED</span>
                        </div>
                      )}

                      {/* Quick Success Rate Bubble */}
                      <div className="absolute bottom-3 right-3 bg-[#4CAF50] text-white font-bold text-[9px] px-2.5 py-1 rounded-full shadow">
                        {doc.successRate}% Success
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-grow space-y-3">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h3 className="font-serif text-sm font-bold text-gray-900 line-clamp-1">{doc.name}</h3>
                          <div className="flex items-center space-x-0.5 text-xs font-bold text-gray-800 shrink-0">
                            <FaStar className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                            <span>{doc.rating}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{doc.qualification}</p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        <span className="text-[9px] font-bold text-[#2E7D32] bg-[#2E7D32]/5 px-2 py-0.5 rounded border border-[#2E7D32]/10">
                          {doc.specialization}
                        </span>
                        {doc.languages.slice(0, 2).map((lang) => (
                          <span key={lang} className="text-[9px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-150">
                            {lang}
                          </span>
                        ))}
                      </div>

                      <div className="space-y-1 text-[10.5px] text-gray-600 border-t border-gray-100 pt-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Clinic:</span>
                          <span className="font-bold text-gray-800 truncate max-w-[150px]">{doc.clinicName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Patients treated:</span>
                          <span className="font-bold text-gray-800">{doc.patientsTreated.toLocaleString()}+</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Location:</span>
                          <span className="font-bold text-gray-800">{doc.city}</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-2.5 flex justify-between items-center">
                        <div>
                          <p className="text-[8px] text-gray-400 font-bold uppercase">Consultation Fee</p>
                          <p className="text-xs font-extrabold text-gray-800 flex items-center">
                            <FaRupeeSign className="w-2.5 h-2.5" />
                            <span>{doc.consultationFee}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-[#4CAF50] font-bold uppercase bg-[#4CAF50]/5 border border-[#4CAF50]/15 px-2 py-0.5 rounded-full">
                            {doc.onlineConsultationFee > 0 ? "Video Consult" : "In-Clinic"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-5 pb-5 grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setActiveProfile(doc)}
                        className="w-full bg-[#2E7D32]/5 hover:bg-[#2E7D32]/10 border border-[#2E7D32]/25 text-[#2E7D32] font-bold text-[9px] uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        Profile Preview
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveProfile(doc);
                        }}
                        className="w-full bg-[#2E7D32] hover:bg-[#1B4D20] text-white font-bold text-[9px] uppercase tracking-wider py-2.5 rounded-xl shadow transition-all cursor-pointer"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 10. Top Cities Section */}
      <section className="py-20 px-6 md:px-12 bg-white border-y border-[#2E7D32]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Widespread Network</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2E7D32]">Consult Top Doctors Across Cities</h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto">Connect with local Vaidyas in your city for personalized diagnostic sessions and treatments.</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-5"
          >
            {TOP_CITIES.map((city) => (
              <motion.div 
                key={city.name}
                variants={fadeInUp}
                onClick={() => {
                  setSelectedLocation(city.name);
                  const element = document.getElementById('directory-results');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group border rounded-2xl p-2 bg-white text-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                  selectedLocation === city.name ? 'border-[#2E7D32] ring-1 ring-[#2E7D32] bg-[#2E7D32]/5' : 'border-gray-150 hover:shadow-md'
                }`}
              >
                <div className="h-16 w-full rounded-xl bg-gray-50 overflow-hidden mb-2">
                  <img 
                    src={city.image} 
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-bold text-xs text-gray-900">{city.name}</h4>
                <p className="text-[9px] text-gray-400 mt-0.5">{city.count} Doctors</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 11. Reviews Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Patient Outcomes</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2E7D32]">Our Healed Patients Share</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">Authentic feedback from patients who reversed conditions through directory consultations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {MOCK_REVIEWS_DIRECTORY.map((rev) => (
            <motion.div 
              key={rev.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-[#2E7D32]/10 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <FaStar key={i} className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                  ))}
                </div>
                <FaQuoteLeft className="w-4 h-4 text-[#D4AF37]/40" />
                <p className="text-xs text-gray-600 leading-relaxed italic">"{rev.comment}"</p>
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-xs text-gray-800">{rev.patientName}</h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">{rev.date}</p>
                </div>
                <span className="text-[9px] font-bold text-[#2E7D32] bg-[#2E7D32]/5 border border-[#2E7D32]/10 px-2 py-0.5 rounded">
                  {rev.specialty}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 12. Why Choose Our Doctors */}
      <section className="py-20 px-6 md:px-12 bg-white border-y border-[#2E7D32]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Quality Standards</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2E7D32]">Standard Ayurvedic Consulting</h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto">Every doctor listed on AyurVeda Connect goes through credentials screening for high safety levels.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Box 1 */}
            <div className="p-6 bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-2xl space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center font-bold text-lg"><FaUserCheck /></div>
              <h3 className="font-serif text-base font-bold text-[#2E7D32]">Verified Doctors</h3>
              <p className="text-xs text-gray-600 leading-relaxed">We manually cross-examine council registration details, medical degrees (BAMS/MD), and certificates before profile approvals.</p>
            </div>
            {/* Box 2 */}
            <div className="p-6 bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-2xl space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center font-bold text-lg"><FaShieldAlt /></div>
              <h3 className="font-serif text-base font-bold text-[#2E7D32]">Licensed Practitioners & Clinics</h3>
              <p className="text-xs text-gray-600 leading-relaxed">All allied clinics and individual Vaidyas operate under the strict governance guidelines of AYUSH ministry regulations.</p>
            </div>
            {/* Box 3 */}
            <div className="p-6 bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-2xl space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center font-bold text-lg"><FaCalendarCheck /></div>
              <h3 className="font-serif text-base font-bold text-[#2E7D32]">Secure Scheduling</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Our advanced directory lets you book direct video consultations and reserve clinic check-in queues without broker overheads.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 13. FAQ Section */}
      <section className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Information Desk</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2E7D32]">Frequently Asked Queries</h2>
          <p className="text-xs text-gray-500">Find quick responses to diagnostic standards, payments, and clinic visits.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full text-left p-5 flex justify-between items-center text-xs font-bold text-[#2E7D32] focus:outline-none"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <FaChevronUp className="w-3.5 h-3.5 text-[#D4AF37]" /> : <FaChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" />}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-5 pt-0 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-[#F8FFF8]/30">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 14. CTA Banner */}
      <section className="mx-6 md:mx-12 max-w-7xl lg:mx-auto bg-gradient-to-r from-[#2E7D32] to-[#1B4D20] text-white p-10 md:p-14 rounded-3xl text-center space-y-6 shadow-xl relative overflow-hidden mb-24">
        {/* Subtle gold decoration background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            Book Your Ayurveda Consultation Today
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed max-w-lg mx-auto">
            Get personalized root-cause diagnostic checking and a tailored diet regime based on your unique body constitution (Prakriti).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
          <button
            onClick={() => {
              const element = document.getElementById('directory-results');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-[#D4AF37] hover:bg-[#c29d2f] text-[#2E7D32] font-bold text-xs py-3.5 px-8 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 uppercase tracking-wider cursor-pointer"
          >
            Find Doctor Directory
          </button>
          <button
            onClick={() => {
              const element = document.getElementById('directory-results');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs py-3.5 px-8 rounded-full shadow-sm transition-all uppercase tracking-wider cursor-pointer"
          >
            Book Appointment
          </button>
        </div>
      </section>

      {/* 8. Doctor Profile Preview Modal Overlay */}
      <AnimatePresence>
        {activeProfile && (
          <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-150 relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => {
                  setActiveProfile(null);
                  setBookingCompleted(false);
                }}
                className="absolute top-5 right-5 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-all focus:outline-none z-10 cursor-pointer"
              >
                <FaTimes className="w-3.5 h-3.5" />
              </button>

              {bookingCompleted ? (
                /* Animated Booking Success View */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 text-center space-y-6 flex flex-col items-center justify-center min-h-[400px]"
                >
                  <div className="w-16 h-16 bg-[#4CAF50]/15 text-[#4CAF50] rounded-full flex items-center justify-center text-3xl animate-bounce">
                    <FaCheckCircle />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-bold text-[#2E7D32]">Appointment Request Submitted!</h3>
                    <p className="text-xs text-gray-500 max-w-md">
                      Thank you <span className="font-bold text-gray-800">{bookingFormData.patientName}</span>. Your consultation booking request for <span className="font-bold text-gray-800">{bookingFormData.date} at {bookingFormData.time}</span> with {activeProfile.name} has been securely logged. A verification SMS and email have been sent to you.
                    </p>
                  </div>
                  <div className="p-4 bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-2xl text-[11px] text-[#2E7D32] font-semibold">
                    🌿 Standard consultation fees of ₹{activeProfile.consultationFee} is payable directly at the clinic check-in counter or online portal.
                  </div>
                </motion.div>
              ) : (
                /* Profile & Booking Form View */
                <div className="grid grid-cols-1 md:grid-cols-12">
                  
                  {/* Doctor Info Detail Panel (Left - 7 Units) */}
                  <div className="md:col-span-7 p-6 md:p-8 space-y-6 border-b md:border-b-0 md:border-r border-gray-150">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-100 shadow border border-gray-100">
                        <img src={activeProfile.photo} alt={activeProfile.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-center sm:text-left space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                          <h3 className="font-serif text-xl font-bold text-gray-900">{activeProfile.name}</h3>
                          <span className="bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-0.5 rounded text-[9px] font-bold inline-flex items-center gap-0.5 border border-[#2E7D32]/15">
                            <MdVerified className="text-[#D4AF37]" />
                            <span>VERIFIED VAIDYA</span>
                          </span>
                        </div>
                        <p className="text-xs font-bold text-gray-500 uppercase">{activeProfile.qualification}</p>
                        
                        <div className="flex justify-center sm:justify-start items-center space-x-3.5">
                          <span className="text-[10px] font-bold text-[#2E7D32] bg-[#2E7D32]/5 border border-[#2E7D32]/10 px-2.5 py-1 rounded-full">
                            {activeProfile.specialization}
                          </span>
                          <div className="flex items-center space-x-1 text-xs font-extrabold text-gray-800">
                            <FaStar className="w-3 text-[#D4AF37] fill-[#D4AF37]" />
                            <span>{activeProfile.rating}</span>
                            <span className="text-[10px] text-gray-400 font-medium">({activeProfile.reviewCount} Reviews)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-3.5 bg-[#F8FFF8] border border-[#2E7D32]/10 p-4 rounded-2xl text-center">
                      <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">Experience</p>
                        <p className="text-xs font-extrabold text-gray-800">{activeProfile.experience} Yrs+</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">Success Rate</p>
                        <p className="text-xs font-extrabold text-gray-800">{activeProfile.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">Patients Healed</p>
                        <p className="text-xs font-extrabold text-gray-800">{activeProfile.patientsTreated.toLocaleString()}+</p>
                      </div>
                    </div>

                    {/* About */}
                    <div className="space-y-2">
                      <h4 className="font-serif text-xs font-bold text-gray-800 uppercase tracking-wider">About Doctor</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{activeProfile.bio}</p>
                    </div>

                    {/* Qualifications & Education */}
                    <div className="space-y-2">
                      <h4 className="font-serif text-xs font-bold text-gray-800 uppercase tracking-wider">Education & Registrations</h4>
                      <ul className="space-y-1.5 text-xs text-gray-600">
                        <li className="flex items-start space-x-2">
                          <span className="text-[#D4AF37] shrink-0 mt-0.5"><FaGraduationCap /></span>
                          <span>Post Graduation: {activeProfile.qualification.split(',')[1] || "MD in Ayurvedic Medicine"}</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-[#D4AF37] shrink-0 mt-0.5"><FaGraduationCap /></span>
                          <span>Medical Degree: {activeProfile.qualification.split(',')[0]}</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-[#D4AF37] shrink-0 mt-0.5"><FaAward /></span>
                          <span>Licensed Council Registrations: AYUSH Central Registry, India</span>
                        </li>
                      </ul>
                    </div>

                    {/* Core details */}
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-150 pt-4.5 text-xs">
                      <div>
                        <h5 className="font-bold text-gray-400 uppercase text-[9px]">Languages</h5>
                        <p className="font-bold text-gray-800 mt-1 flex items-center space-x-1">
                          <MdLanguage className="text-gray-400" />
                          <span>{activeProfile.languages.join(', ')}</span>
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-400 uppercase text-[9px]">Clinic / Affiliation</h5>
                        <p className="font-bold text-gray-800 mt-1 flex items-center space-x-1">
                          <FaHospital className="text-gray-400" />
                          <span>{activeProfile.clinicName}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Widget Form (Right - 5 Units) */}
                  <div className="md:col-span-5 p-6 md:p-8 bg-[#F8FFF8]/40 space-y-6">
                    <div className="space-y-2">
                      <h4 className="font-serif text-base font-bold text-[#2E7D32]">Schedule Appointment</h4>
                      <p className="text-[10px] text-gray-500">Select consultation mode and provide patient details to queue instantly.</p>
                    </div>

                    {/* Pricing Display */}
                    <div className="bg-white border border-[#2E7D32]/10 p-4 rounded-2xl space-y-2 text-xs">
                      <div className="flex justify-between items-center text-gray-600">
                        <span>In-Clinic Visit Fee:</span>
                        <span className="font-bold text-gray-900 flex items-center">
                          <FaRupeeSign className="w-2.5 h-2.5" />
                          <span>{activeProfile.consultationFee}</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600 border-t border-gray-100 pt-2">
                        <span>Online Video Fee:</span>
                        <span className="font-bold text-gray-900 flex items-center">
                          <FaRupeeSign className="w-2.5 h-2.5" />
                          <span>{activeProfile.onlineConsultationFee}</span>
                        </span>
                      </div>
                    </div>

                    {/* Appointment Form */}
                    <form onSubmit={handleConfirmBooking} className="space-y-4">
                      {/* Consultation Type */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">Consultation Format</label>
                        <select 
                          required
                          value={bookingFormData.type}
                          onChange={(e) => setBookingFormData(prev => ({ ...prev, type: e.target.value }))}
                          className="w-full bg-white border border-gray-250 rounded-xl py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-[#2E7D32]"
                        >
                          <option value="Online Video">Online Video Consultation</option>
                          <option value="Clinic Visit">Physical Clinic Visit</option>
                        </select>
                      </div>

                      {/* Date Select */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Date</label>
                          <input 
                            type="date" 
                            required
                            value={bookingFormData.date}
                            onChange={(e) => setBookingFormData(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full bg-white border border-gray-250 rounded-xl py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-[#2E7D32]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Time Slot</label>
                          <select 
                            required
                            value={bookingFormData.time}
                            onChange={(e) => setBookingFormData(prev => ({ ...prev, time: e.target.value }))}
                            className="w-full bg-white border border-gray-250 rounded-xl py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-[#2E7D32]"
                          >
                            <option value="09:00 AM">09:00 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="12:00 PM">12:00 PM</option>
                            <option value="02:00 PM">02:00 PM</option>
                            <option value="03:00 PM">03:00 PM</option>
                            <option value="04:00 PM">04:00 PM</option>
                            <option value="05:00 PM">05:00 PM</option>
                          </select>
                        </div>
                      </div>

                      {/* Patient Name */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">Patient Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Enter patient full name"
                          value={bookingFormData.patientName}
                          onChange={(e) => setBookingFormData(prev => ({ ...prev, patientName: e.target.value }))}
                          className="w-full bg-white border border-gray-250 rounded-xl py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-[#2E7D32]"
                        />
                      </div>

                      {/* Email & Phone */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">Contact Number</label>
                        <input 
                          type="tel" 
                          required
                          placeholder="+91 98765 43210"
                          value={bookingFormData.phone}
                          onChange={(e) => setBookingFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full bg-white border border-gray-250 rounded-xl py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-[#2E7D32]"
                        />
                      </div>

                      {/* Submit */}
                      <button 
                        type="submit"
                        className="w-full bg-[#2E7D32] hover:bg-[#1B4D20] text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-colors cursor-pointer uppercase tracking-wider"
                      >
                        Confirm Booking request
                      </button>
                    </form>
                  </div>

                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Doctors;
