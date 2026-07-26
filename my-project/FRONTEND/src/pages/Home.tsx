import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Star, MapPin, Video, Building, Clock, ArrowRight, ChevronRight, 
  AlertCircle, CheckCircle, Calendar, Sprout, Users, Bot, Compass, 
  BookOpen, Award, ShieldAlert, Send, Activity, Heart, Eye, Sparkles, Smile, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService, MOCK_STATS, MOCK_DISEASES, MOCK_TREATMENTS, MOCK_DOCTORS, MOCK_CLINICS, MOCK_TESTIMONIALS } from '../services/apiService';
import aiApi from '../services/aiApi';

// Animated Counter Component
const Counter: React.FC<{ target: number; suffix?: string; duration?: number }> = ({ target, suffix = '', duration = 1200 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return <span className="font-serif text-3xl md:text-5xl font-black text-primary">{count.toLocaleString()}{suffix}</span>;
};

// Main Home Component
const Home: React.FC = () => {
  // API state
  const [stats, setStats] = useState(MOCK_STATS);
  const [doctors, setDoctors] = useState(MOCK_DOCTORS);
  const [clinics, setClinics] = useState(MOCK_CLINICS);
  const [testimonials, setTestimonials] = useState(MOCK_TESTIMONIALS);
  const [diseases, setDiseases] = useState(MOCK_DISEASES);
  const [treatments, setTreatments] = useState(MOCK_TREATMENTS);
  
  // Loading & Diagnostics State
  const [loading, setLoading] = useState(true);
  const [hasConnectionError, setHasConnectionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // AI Chat simulation state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'Namaste! I am your AyurVeda Connect AI Assistant. How can I help you achieve holistic balance today?' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Email form state
  const [emailValue, setEmailValue] = useState('');
  const [emailSubscribed, setEmailSubscribed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, doctorsRes, clinicsRes, testimonialsRes, diseasesRes, treatmentsRes] = await Promise.all([
          apiService.getStats(),
          apiService.getDoctors(),
          apiService.getClinics(),
          apiService.getTestimonials(),
          apiService.getDiseases(),
          apiService.getTreatments()
        ]);

        // If any response failed and triggered fallback, set connection warning
        const fallbackActive = statsRes.isFallback || doctorsRes.isFallback || clinicsRes.isFallback || testimonialsRes.isFallback;
        
        if (fallbackActive) {
          setHasConnectionError(true);
          setErrorMessage('Vaidya API server at localhost:5174 is offline. Running in secure local cache mode.');
        }

        setStats(statsRes.data);
        setDoctors(doctorsRes.data);
        setClinics(clinicsRes.data);
        setTestimonials(testimonialsRes.data);
        if (diseasesRes.data && diseasesRes.data.length > 0) setDiseases(diseasesRes.data);
        if (treatmentsRes.data && treatmentsRes.data.length > 0) setTreatments(treatmentsRes.data);
      } catch (err: any) {
        // Double safety fallback protection
        setHasConnectionError(true);
        setErrorMessage('Failed to connect to backend server. Running in secure fallback mode.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Live AI Assistant trigger logic powered by Gemini API & stored in MySQL
  const handleChatOption = async (option: string) => {
    if (chatLoading) return;

    setChatMessages(prev => [...prev, { sender: 'user', text: option }]);
    setChatLoading(true);

    try {
      const res = await aiApi.sendMessage(option);
      const botReply = res.data ? res.data.message : 'Namaste! I am analyzing your query with Vaidya AI.';
      setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'bot', text: 'Namaste! Based on Ayurvedic guidelines, favor warm freshly cooked foods, balancing herbs, and regular consultations with our Vaidyas.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailValue.trim()) {
      setEmailSubscribed(true);
      setEmailValue('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FFF8]">
      
      {/* 0. Connection Diagnostic Warning Toast */}
      {hasConnectionError && (
        <div className="bg-amber-500 text-white py-2.5 px-4 text-center text-xs font-bold flex items-center justify-center space-x-2 animate-fade-in-up z-50 relative">
          <AlertCircle className="w-4 h-4 text-white shrink-0 animate-pulse" />
          <span>{errorMessage}</span>
          <span className="hidden md:inline bg-amber-600 px-2 py-0.5 rounded text-[10px] ml-2">Local Fallback Active</span>
        </div>
      )}

      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-12 overflow-hidden bg-gradient-to-br from-[#2E7D32]/5 via-[#F8FFF8] to-[#D4AF37]/5">
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -z-10 animate-float" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Left Text */}
          <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-primary/5 border border-primary/10 px-4 py-1.5 rounded-full text-xs font-semibold text-primary">
              <Sparkles className="w-3.5 h-3.5 text-accent animate-spin-slow" />
              <span>Ayurveda Connect — Startup Level Ecosystem</span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-text-primary leading-[1.1]">
              Your Complete <br />
              <span className="text-gradient">Ayurveda Healthcare</span> <br />
              Ecosystem
            </h1>

            <p className="text-sm md:text-base text-text-secondary max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Discover diseases, treatments, doctors and recovery solutions in one platform. We integrate ancient herbal systems with modern telehealth convenience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/doctors"
                className="bg-primary hover:bg-primary-light text-white font-bold text-sm px-8 py-4 rounded-full shadow-lg shadow-primary/15 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <span>Find Doctor</span>
                <ArrowRight className="w-4 h-4 text-accent" />
              </Link>
              <Link
                to="/diseases"
                className="bg-white hover:bg-gray-50 border border-primary/15 text-primary font-bold text-sm px-8 py-4 rounded-full shadow-sm transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Explore Diseases</span>
              </Link>
            </div>
          </div>

          {/* Right Image Deck */}
          <div className="w-full lg:w-1/2 flex justify-center relative">
            <div className="relative w-[280px] h-[340px] md:w-[380px] md:h-[440px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 animate-float">
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80"
                alt="Herbs treatment session"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
            
            <div className="absolute -bottom-6 -left-6 md:-left-8 glass-effect p-5 rounded-2xl border border-white/60 shadow-xl max-w-[190px]">
              <div className="w-8 h-8 rounded-full bg-accent/25 flex items-center justify-center text-accent mb-2">
                <Compass className="w-4 h-4 text-primary" />
              </div>
              <span className="block text-2xl font-bold text-primary font-serif">100%</span>
              <span className="text-[10px] text-text-secondary font-semibold leading-tight block">Certified Ayurvedic Remedies</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Statistics Section */}
      <section className="bg-white border-t border-b border-[#2E7D32]/5 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="flex justify-center"><Users className="w-6 h-6 text-accent mb-1" /></div>
            <Counter target={stats.patients} suffix="+" />
            <p className="text-xs uppercase tracking-wider font-bold text-text-secondary">Happy Patients</p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-center"><Activity className="w-6 h-6 text-accent mb-1" /></div>
            <Counter target={stats.doctors} suffix="+" />
            <p className="text-xs uppercase tracking-wider font-bold text-text-secondary">Verified Doctors</p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-center"><Building className="w-6 h-6 text-accent mb-1" /></div>
            <Counter target={stats.clinics} suffix="+" />
            <p className="text-xs uppercase tracking-wider font-bold text-text-secondary">Wellness Clinics</p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-center"><Sprout className="w-6 h-6 text-accent mb-1" /></div>
            <Counter target={stats.treatments} suffix="+" />
            <p className="text-xs uppercase tracking-wider font-bold text-text-secondary">Remedial Treatments</p>
          </div>
        </div>
      </section>

      {/* 3. Disease Categories Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold text-accent uppercase tracking-widest block">Core Library</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">Targeted Disease Intelligence</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Choose a health condition to explore custom herbal remedies, Dosha profiles, and integrated dietary strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {diseases.slice(0, 6).map((dis: any) => (
            <div
              key={dis.id}
              className="bg-white border border-[#2E7D32]/5 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 card-hover flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-[9px] uppercase font-bold text-accent bg-accent/15 px-2.5 py-0.5 rounded-full inline-block">
                  {dis.category}
                </span>
                <h3 className="font-serif text-xl font-bold text-primary">{dis.name}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{dis.shortDescription || dis.description}</p>
              </div>
              <Link
                to="/diseases"
                className="mt-6 text-xs font-bold text-primary hover:text-accent transition-colors flex items-center space-x-1"
              >
                <span>Symptom Tracker</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Treatment Categories Section */}
      <section className="bg-white py-20 px-6 md:px-12 border-t border-b border-[#2E7D32]/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold text-accent uppercase tracking-widest block">Therapy Protocols</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">Time-Tested Treatment Modalities</h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Experience therapeutic restoration through authenticated cleansing protocols customized for modern lifestyles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {treatments.slice(0, 6).map((trt: any) => (
              <div
                key={trt.id}
                className="bg-[#F8FFF8] border border-[#2E7D32]/5 p-6 rounded-2xl hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-lg font-bold text-primary">{trt.name}</h3>
                    <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {trt.duration || 'Custom'}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{trt.description}</p>
                </div>
                <span className="text-[10px] text-[#2E7D32] font-semibold mt-4 block uppercase tracking-wider">
                  Verified Therapy
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Doctors Section (API driven with Fallback) */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-accent uppercase tracking-widest block">Certified Experts</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">Meet Our Featured Vaidyas</h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Consult with certified Ayurvedic doctors online or in-clinic.
            </p>
          </div>
          <Link
            to="/doctors"
            className="text-xs font-bold text-primary hover:text-accent transition-colors flex items-center space-x-1"
          >
            <span>View All Doctors</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-[#2E7D32]/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-primary text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {doc.specialization.split(' ')[0]}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-base font-bold text-primary">{doc.name}</h3>
                    <div className="flex items-center space-x-0.5">
                      <Star className="w-3.5 h-3.5 fill-accent text-accent animate-pulse" />
                      <span className="text-xs font-bold text-primary">{doc.rating}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-text-secondary font-semibold">{doc.specialization}</p>
                  <p className="text-xs text-text-secondary font-medium">{doc.experience} Yrs Experience</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    <span className="block text-[8px] text-text-secondary uppercase font-semibold">Fee</span>
                    <span className="text-sm font-bold text-primary">₹{doc.fee}</span>
                  </div>
                  <Link
                    to="/doctors"
                    className="bg-primary hover:bg-primary-light text-white font-bold text-[10px] px-4 py-2 rounded-full transition-colors"
                  >
                    Book Consult
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Featured Clinics Section (API driven with Fallback) */}
      <section className="bg-white py-20 px-6 md:px-12 border-t border-b border-[#2E7D32]/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-accent uppercase tracking-widest block">Wellness hubs</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">Affiliated Healing Clinics</h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                Premium healthcare centers equipped with standard Panchakarma purification chambers.
              </p>
            </div>
            <Link
              to="/clinics"
              className="text-xs font-bold text-primary hover:text-accent transition-colors flex items-center space-x-1"
            >
              <span>View All Clinics</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clinics.map((cl) => (
              <div
                key={cl.id}
                className="bg-[#F8FFF8] border border-[#2E7D32]/5 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-44 overflow-hidden relative">
                  <img src={cl.bannerImage} alt={cl.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-white px-2 py-0.5 rounded border border-[#2E7D32]/5 flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                    <span className="text-xs font-bold text-primary">{cl.rating}</span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-primary">{cl.name}</h3>
                    <div className="flex items-center space-x-1 text-xs text-text-secondary mt-1">
                      <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{cl.city}, {cl.state}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-[8px] uppercase tracking-wider font-bold text-text-secondary">Core Services</span>
                    <div className="flex flex-wrap gap-1.5">
                      {cl.services.map((srv, i) => (
                        <span key={i} className="text-[10px] bg-white border border-[#2E7D32]/5 text-text-secondary px-2.5 py-0.5 rounded-full font-medium">
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Recovery Journey Timeline Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold text-accent uppercase tracking-widest block">Flowchart Flow</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">Your Ayurvedic Recovery Journey</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Understand the structured clinical process we deploy to correct deep metabolic and skeletal imbalances.
          </p>
        </div>

        <div className="relative">
          {/* Horizontal Line on Desktop */}
          <div className="hidden lg:block absolute top-10 left-16 right-16 h-0.5 bg-accent/40 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center relative z-10">
            {/* Step 1 */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-primary/5 hover:border-accent transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mx-auto border border-primary/20">1</div>
              <h4 className="font-serif text-sm font-bold text-primary">Symptoms</h4>
              <p className="text-[10px] text-text-secondary leading-relaxed">Self-assess physical signals and compile dosha notes.</p>
            </div>
            {/* Step 2 */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-primary/5 hover:border-accent transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mx-auto border border-primary/20">2</div>
              <h4 className="font-serif text-sm font-bold text-primary">Diagnosis</h4>
              <p className="text-[10px] text-text-secondary leading-relaxed">Identify structural core root triggers (Nidana).</p>
            </div>
            {/* Step 3 */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-primary/5 hover:border-accent transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mx-auto border border-primary/20">3</div>
              <h4 className="font-serif text-sm font-bold text-primary">Treatment</h4>
              <p className="text-[10px] text-text-secondary leading-relaxed">Prescribe botanical herbs, cleansing packs.</p>
            </div>
            {/* Step 4 */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-primary/5 hover:border-accent transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mx-auto border border-primary/20">4</div>
              <h4 className="font-serif text-sm font-bold text-primary">Consultation</h4>
              <p className="text-[10px] text-text-secondary leading-relaxed">Pulse readings and weekly check-ins with Vaidyas.</p>
            </div>
            {/* Step 5 */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-primary/5 hover:border-accent transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mx-auto border border-primary/20">5</div>
              <h4 className="font-serif text-sm font-bold text-primary">Recovery Tracking</h4>
              <p className="text-[10px] text-text-secondary leading-relaxed">Log diet compliance and symptoms inside tracker.</p>
            </div>
            {/* Step 6 */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-primary/5 hover:border-accent transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-full bg-accent/25 text-primary flex items-center justify-center font-bold text-sm mx-auto border border-accent/40">6</div>
              <h4 className="font-serif text-sm font-bold text-primary">Wellness</h4>
              <p className="text-[10px] text-text-secondary leading-relaxed">Maintain dosha equilibrium for long-term health.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Platform Features Section */}
      <section className="bg-white py-20 px-6 md:px-12 border-t border-b border-[#2E7D32]/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold text-accent uppercase tracking-widest block">Digital Services</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">Key Ecosystem Features</h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              We combine ancient knowledge frameworks with state of the art health informatics toolsets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#F8FFF8] border border-[#2E7D32]/5 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary">Disease Library</h3>
              <p className="text-xs text-text-secondary leading-relaxed">Explore causes, symptoms, and traditional herbs for dozens of critical chronic illnesses.</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-[#F8FFF8] border border-[#2E7D32]/5 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Activity className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary">Recovery Tracker</h3>
              <p className="text-xs text-text-secondary leading-relaxed">Log daily habits, symptoms changes, and watch your metabolic scores improve over time.</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-[#F8FFF8] border border-[#2E7D32]/5 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary">AI Assistant</h3>
              <p className="text-xs text-text-secondary leading-relaxed">Instant dietary pointers and physician matching recommendations powered by Ayurvedic nodes.</p>
            </div>
            {/* Feature 4 */}
            <div className="bg-[#F8FFF8] border border-[#2E7D32]/5 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Compass className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary">Dosha Analysis</h3>
              <p className="text-xs text-text-secondary leading-relaxed">Interactive diagnostic pulse assessments to determine Vata, Pitta, and Kapha splits.</p>
            </div>
            {/* Feature 5 */}
            <div className="bg-[#F8FFF8] border border-[#2E7D32]/5 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary">Diet Planner</h3>
              <p className="text-xs text-text-secondary leading-relaxed">Get tailored Pathya charts separating compatible foods from toxic gut disruptors.</p>
            </div>
            {/* Feature 6 */}
            <div className="bg-[#F8FFF8] border border-[#2E7D32]/5 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Video className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary">Video Consultation</h3>
              <p className="text-xs text-text-secondary leading-relaxed">Consult directly with experienced Indian Vaidyas from the comfort of your home.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Success Stories (Testimonials) */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold text-accent uppercase tracking-widest block">cured Patient reviews</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">Success Stories of Real Healing</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Read clinical restoration reports from people who targeted root causes instead of temporary patches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-[#2E7D32]/5 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <img src={t.avatar} alt={t.patientName} className="w-10 h-10 rounded-full object-cover shadow-inner" />
                    <div>
                      <h4 className="font-bold text-xs text-primary">{t.patientName}</h4>
                      <span className="text-[9px] text-[#2E7D32] bg-[#2E7D32]/5 px-2 py-0.5 rounded-full inline-block font-semibold">
                        Cured {t.disease}
                      </span>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed italic">"{t.text}"</p>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-6 flex justify-between items-center text-[10px] text-text-secondary">
                <span><strong>Therapy:</strong> {t.treatment}</span>
                <span className="bg-accent/15 text-primary px-2 py-0.5 rounded font-bold">{t.recoveryTime}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. AI Assistant Preview Section (Interactive Chatbot Demo) */}
      <section className="bg-white py-20 px-6 md:px-12 border-t border-b border-[#2E7D32]/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Chat text layout */}
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <span className="text-xs font-bold text-accent uppercase tracking-widest block">Instant answers</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">Try the AI Ayurveda Assistant</h2>
            <p className="text-xs text-text-secondary leading-relaxed max-w-md mx-auto lg:mx-0">
              Get diagnostic predictions, match symptoms to Dosha levels, and receive herbal diet guidelines instantly. Select a prompt to try it!
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleChatOption('Analyze my symptoms')}
                className="bg-[#F8FFF8] hover:bg-primary/5 border border-primary/10 text-left p-3.5 rounded-xl text-xs font-semibold text-primary transition-all duration-200"
              >
                🔍 Analyze my symptoms
              </button>
              <button
                onClick={() => handleChatOption('Recommend a doctor')}
                className="bg-[#F8FFF8] hover:bg-primary/5 border border-primary/10 text-left p-3.5 rounded-xl text-xs font-semibold text-primary transition-all duration-200"
              >
                🩺 Recommend a doctor
              </button>
              <button
                onClick={() => handleChatOption('Suggest a diet plan')}
                className="bg-[#F8FFF8] hover:bg-primary/5 border border-primary/10 text-left p-3.5 rounded-xl text-xs font-semibold text-primary transition-all duration-200"
              >
                🥗 Suggest a diet plan
              </button>
              <button
                onClick={() => handleChatOption('Guide my treatment')}
                className="bg-[#F8FFF8] hover:bg-primary/5 border border-primary/10 text-left p-3.5 rounded-xl text-xs font-semibold text-primary transition-all duration-200"
              >
                🌿 Guide my treatment
              </button>
            </div>
          </div>

          {/* Interactive Chat Window */}
          <div className="w-full lg:w-1/2">
            <div className="bg-[#F8FFF8] border border-primary/15 rounded-3xl overflow-hidden shadow-xl flex flex-col h-[380px]">
              {/* Chat Title */}
              <div className="bg-primary text-white py-4 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-4.5 h-4.5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">AyurVeda Chat Assistant</h4>
                    <span className="text-[8px] text-secondary font-medium block uppercase tracking-widest">Interactive Preview</span>
                  </div>
                </div>
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              </div>

              {/* Chat Body */}
              <div className="p-5 overflow-y-auto flex-grow space-y-4">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-primary text-white rounded-tr-none'
                          : 'bg-white border border-[#2E7D32]/10 text-text-primary rounded-tl-none shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-[#2E7D32]/10 rounded-2xl rounded-tl-none px-4 py-2.5 flex space-x-1 items-center shadow-sm">
                      <div className="w-1.5 h-1.5 bg-[#2E7D32] rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-[#2E7D32] rounded-full animate-bounce delay-100" />
                      <div className="w-1.5 h-1.5 bg-[#2E7D32] rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* 11. Newsletter Section */}
      <section className="py-20 px-6 md:px-12 max-w-4xl mx-auto text-center space-y-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto border border-primary/20">
          <Sprout className="w-6 h-6 text-accent animate-float" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-primary">Get Weekly Healing Insights</h2>
        <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
          Subscribe to our platform newsletter to receive customized recipes, dosha tips, and early booking notifications directly.
        </p>

        {emailSubscribed ? (
          <div className="p-4 bg-primary/15 border border-primary/30 rounded-2xl text-primary text-xs font-bold max-w-sm mx-auto animate-fade-in-up">
            🌿 Subscribed Successfully! Check your inbox for weekly herbal remedies.
          </div>
        ) : (
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              required
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              placeholder="Enter your email address"
              className="flex-grow bg-white border border-[#2E7D32]/15 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-light text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}
      </section>

    </div>
  );
};

export default Home;
