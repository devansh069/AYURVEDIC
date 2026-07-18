import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Stethoscope, 
  Heart, 
  ShieldCheck, 
  UserCheck,
  CheckCircle2, 
  MapPin,
  Clock,
  Briefcase,
  Star,
  Sparkles,
  Mail,
  Send,
  Check,
  ArrowRight
} from 'lucide-react';

// APIs & Services
import clinicApi from '../services/clinicApi';
import { Clinic, PanchakarmaCenter } from '../types';

// Components
import ClinicSearch from '../components/clinics/ClinicSearch';
import ClinicFilters from '../components/clinics/ClinicFilters';
import ClinicGrid from '../components/clinics/ClinicGrid';
import FeaturedClinics from '../components/clinics/FeaturedClinics';
import PanchakarmaCenterCard from '../components/clinics/PanchakarmaCenterCard';
import ClinicComparison from '../components/clinics/ClinicComparison';
import ClinicMapPreview from '../components/clinics/ClinicMapPreview';
import FacilityCard from '../components/clinics/FacilityCard';
import SuccessStoryCard from '../components/clinics/SuccessStoryCard';
import ClinicCTA from '../components/clinics/ClinicCTA';
import LoadingSkeleton from '../components/clinics/LoadingSkeleton';
import ErrorFallback from '../components/clinics/ErrorFallback';

export const Clinics: React.FC = () => {
  const navigate = useNavigate();

  // API states
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [citiesList, setCitiesList] = useState<string[]>([]);
  const [servicesList, setServicesList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  // Search/Filters inputs states
  const [nameQuery, setNameQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [serviceQuery, setServiceQuery] = useState('');

  // Sidebar filters states
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedService, setSelectedService] = useState('');
  const [selectedYears, setSelectedYears] = useState('');

  // Compare states
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Geolocation and proximity states
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locPermissionState, setLocPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'checking'>('prompt');

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [clinicsRes, citiesRes, servicesRes] = await Promise.all([
          clinicApi.getClinics(),
          clinicApi.getCities(),
          clinicApi.getServices()
        ]);

        setClinics(clinicsRes.data);
        setCitiesList(citiesRes.data);
        setServicesList(servicesRes.data);
        setIsFallback(clinicsRes.isFallback || citiesRes.isFallback || servicesRes.isFallback);
      } catch (err) {
        console.error('Error loading clinic directory data:', err);
        setIsFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const detectUserLocation = () => {
    setLocPermissionState('checking');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocPermissionState('granted');
        },
        (err) => {
          // Fall back gracefully
          setLocPermissionState('denied');
        },
        { enableHighAccuracy: false, timeout: 6000 }
      );
    } else {
      setLocPermissionState('denied');
    }
  };

  // Haversine distance formula in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter & Proximity Sort calculation logic
  const filteredClinics = useMemo(() => {
    let results = clinics.map((c) => {
      let distanceKm: number | null = null;
      if (userLocation && c.latitude && c.longitude) {
        distanceKm = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          parseFloat(c.latitude as any),
          parseFloat(c.longitude as any)
        );
      }
      return { ...c, distanceKm };
    });

    results = results.filter((c) => {
      // Hero queries
      const matchesHeroName = !nameQuery || c.name.toLowerCase().includes(nameQuery.toLowerCase());
      const matchesHeroCity = !cityQuery || c.city.toLowerCase() === cityQuery.toLowerCase();
      const matchesHeroService = !serviceQuery || c.services.some(s => s.toLowerCase() === serviceQuery.toLowerCase());

      // Sidebar queries
      const matchesCity = !selectedCity || c.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesState = !selectedState || c.state.toLowerCase() === selectedState.toLowerCase();
      const matchesType = !selectedType || c.type.toLowerCase() === selectedType.toLowerCase();
      const matchesRating = !selectedRating || c.rating >= selectedRating;
      const matchesService = !selectedService || c.services.some(s => s.toLowerCase() === selectedService.toLowerCase());

      // Years established calculation
      let matchesAge = true;
      if (selectedYears === 'new') matchesAge = c.yearsEstablished < 10;
      else if (selectedYears === 'mid') matchesAge = c.yearsEstablished >= 10 && c.yearsEstablished <= 20;
      else if (selectedYears === 'legacy') matchesAge = c.yearsEstablished > 20;

      return (
        matchesHeroName &&
        matchesHeroCity &&
        matchesHeroService &&
        matchesCity &&
        matchesState &&
        matchesType &&
        matchesRating &&
        matchesService &&
        matchesAge
      );
    });

    // If user has location, sort by nearest
    if (userLocation) {
      results.sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }

    return results;
  }, [
    clinics,
    nameQuery,
    cityQuery,
    serviceQuery,
    selectedCity,
    selectedState,
    selectedType,
    selectedRating,
    selectedService,
    selectedYears,
    userLocation
  ]);

  // Unique States list for filter dropdown
  const statesList = useMemo(() => {
    return Array.from(new Set(clinics.map(c => c.state)));
  }, [clinics]);

  // Panchakarma Centers subset for dedicated section
  const panchakarmaCenters = useMemo(() => {
    return clinics.filter(c => c.type === 'Panchakarma Center');
  }, [clinics]);

  // Featured Clinics subset
  const featuredClinics = useMemo(() => {
    return clinics.filter(c => c.rating >= 4.8);
  }, [clinics]);

  // Search submit triggers local filtering synchronization
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Synchronize selected dropdown values to local sidebar selections for visual representation
    if (cityQuery) setSelectedCity(cityQuery);
    if (serviceQuery) setSelectedService(serviceQuery);
  };

  const handleExploreClinics = () => {
    setNameQuery('');
    setCityQuery('');
    setServiceQuery('');
    setSelectedCity('');
    setSelectedState('');
    setSelectedType('');
    setSelectedRating(0);
    setSelectedService('');
    setSelectedYears('');
  };

  const handleResetAllFilters = () => {
    handleExploreClinics();
  };

  // Compare triggers
  const handleToggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter(x => x !== id));
    } else {
      if (compareIds.length < 3) {
        setCompareIds([...compareIds, id]);
      } else {
        // Swap first item if maximum of 3 items selected
        setCompareIds([...compareIds.slice(1), id]);
      }
    }
  };

  const handleRemoveCompare = (id: string) => {
    setCompareIds(compareIds.filter(x => x !== id));
  };

  // Action links
  const handleViewProfile = (clinic: Clinic) => {
    // Navigate to the detailed clinic profile route
    navigate(`/clinics/${clinic.id}`);
  };

  const handleBookVisit = (clinic: Clinic) => {
    navigate(`/clinics/${clinic.id}`);
  };

  const handleNewsletterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  return (
    <div className="bg-background min-h-screen text-text-primary">
      {/* 1. SECURE OFFLINE WARNING BANNER */}
      {isFallback && (
        <div className="sticky top-[72px] z-40 w-full px-4 pt-2">
          <ErrorFallback message="Using Demo Data" />
        </div>
      )}

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="absolute top-10 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-primary/5 border border-primary/10 px-4 py-1.5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">
            <Building2 className="w-3.5 h-3.5 text-accent" />
            <span>Ayurveda Infrastructure Directory</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl font-black text-primary leading-tight">
            Find Trusted Ayurveda <span className="text-gradient">Clinics</span> & Centers
          </h1>

          <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-semibold max-w-2xl mx-auto">
            Discover verified Ayurvedic hospitals, luxury Panchakarma resorts, and corporate wellness hubs. Compare specialized treatments, ratings, and facilities to begin your healing.
          </p>

          {/* Search dashboard */}
          <div className="pt-4 w-full">
            <ClinicSearch
              nameQuery={nameQuery}
              onNameQueryChange={setNameQuery}
              cityQuery={cityQuery}
              onCityQueryChange={setCityQuery}
              serviceQuery={serviceQuery}
              onServiceQueryChange={setServiceQuery}
              citiesList={citiesList}
              servicesList={servicesList}
              onSearchSubmit={handleSearchSubmit}
              onExploreClinics={handleExploreClinics}
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24 space-y-20">
        
        {/* 3. STATISTICS SECTION */}
        <section className="bg-white border border-[#2E7D32]/10 p-6 md:p-8 rounded-3xl shadow-sm text-center relative overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-semibold text-text-secondary">
            <div className="space-y-1">
              <span className="block font-serif text-2xl md:text-3xl font-black text-primary">500+</span>
              <span className="text-[10px] uppercase font-bold tracking-wider block">Verified Clinics</span>
            </div>
            <div className="space-y-1 border-l border-gray-100">
              <span className="block font-serif text-2xl md:text-3xl font-black text-primary">200+</span>
              <span className="text-[10px] uppercase font-bold tracking-wider block">Panchakarma Hubs</span>
            </div>
            <div className="space-y-1 border-l border-gray-100">
              <span className="block font-serif text-2xl md:text-3xl font-black text-primary">1,000+</span>
              <span className="text-[10px] uppercase font-bold tracking-wider block">Specialist Doctors</span>
            </div>
            <div className="space-y-1 border-l border-gray-100">
              <span className="block font-serif text-2xl md:text-3xl font-black text-primary">10,000+</span>
              <span className="text-[10px] uppercase font-bold tracking-wider block">Healed Patients</span>
            </div>
          </div>
        </section>

        {/* 5. FEATURED CLINICS SECTION */}
        <FeaturedClinics 
          clinics={featuredClinics}
          onViewProfile={handleViewProfile}
          onBookConsultation={handleBookVisit}
        />

        {/* 7. DEDICATED PANCHAKARMA CENTERS SECTION */}
        <PanchakarmaCenterCard 
          centers={panchakarmaCenters}
          onViewProfile={handleViewProfile}
        />

        {/* 4 & 6. CLINICS DIRECTORY: DUAL COLUMN FILTER + GRID */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-primary/10 pb-4 gap-4">
            <div className="space-y-1">
              <span className="text-accent text-[9px] font-bold uppercase tracking-widest block font-sans">verified registry</span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary">Partner Clinics Directory</h2>
            </div>
            <div className="text-xs font-semibold text-text-secondary bg-primary/5 py-1.5 px-4 rounded-full border border-primary/5">
              Showing <span className="text-primary font-black">{filteredClinics.length}</span> of {clinics.length} matching centers
            </div>
          </div>

          {/* Geospatial Geolocation Status Banner */}
          <div className="bg-[#FAF9F6] border border-[#2E7D32]/10 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold">
            <div className="flex items-start space-x-3 text-left">
              <span className="text-xl shrink-0 mt-0.5">📍</span>
              <div className="space-y-0.5">
                <h4 className="font-bold text-primary">Suggest Closest Healing Centers?</h4>
                <p className="text-[10px] text-text-secondary leading-relaxed">
                  {locPermissionState === 'prompt' && "Click detect to allow Chrome location access and instantly sort clinics by proximity."}
                  {locPermissionState === 'checking' && "Connecting to browser GPS satellites, please stand by..."}
                  {locPermissionState === 'granted' && "Successfully connected! Nearby clinics are now sorted by distance to your live location."}
                  {locPermissionState === 'denied' && (
                    <span>
                      GPS permission blocked. To reset, click the <b>Tune/Lock icon</b> next to the URL, set Location to 'Allow', and reload.
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            {locPermissionState === 'prompt' && (
              <button
                onClick={detectUserLocation}
                className="bg-primary hover:bg-primary-light text-white text-[10px] font-black uppercase tracking-wider px-5 py-2.5 rounded-full shadow-sm shrink-0 transition-all flex items-center space-x-1 cursor-pointer"
              >
                <span>Detect My Location</span>
              </button>
            )}
            
            {locPermissionState === 'checking' && (
              <button
                disabled
                className="bg-gray-200 text-gray-400 text-[10px] font-black uppercase tracking-wider px-5 py-2.5 rounded-full shrink-0 flex items-center space-x-1.5 cursor-not-allowed"
              >
                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Detecting...</span>
              </button>
            )}

            {locPermissionState === 'granted' && (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-250 py-1.5 px-3 rounded-full text-[10px] uppercase font-bold shrink-0 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Sorted By Proximity</span>
              </div>
            )}

            {locPermissionState === 'denied' && (
              <button
                onClick={detectUserLocation}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-full shrink-0 transition-all cursor-pointer"
              >
                <span>Retry Detect</span>
              </button>
            )}
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Left Sidebar Filter (1/4 width) */}
            <div className="lg:col-span-1">
              <ClinicFilters 
                citiesList={citiesList}
                statesList={statesList}
                servicesList={servicesList}
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                selectedState={selectedState}
                onStateChange={setSelectedState}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                selectedRating={selectedRating}
                onRatingChange={setSelectedRating}
                selectedService={selectedService}
                onServiceChange={setSelectedService}
                selectedYears={selectedYears}
                onYearsChange={setSelectedYears}
                onReset={handleResetAllFilters}
              />
            </div>

            {/* Right Card Grid (3/4 width) */}
            <div className="lg:col-span-3">
              {loading ? (
                <LoadingSkeleton />
              ) : (
                <ClinicGrid 
                  clinics={filteredClinics}
                  onViewProfile={handleViewProfile}
                  onBookConsultation={handleBookVisit}
                  onToggleCompare={handleToggleCompare}
                  compareIds={compareIds}
                  onResetFilters={handleResetAllFilters}
                />
              )}
            </div>
          </div>
        </section>

        {/* 9. CLINIC COMPARISON SECTION */}
        <ClinicComparison 
          clinics={clinics}
          compareIds={compareIds}
          onRemoveCompare={handleRemoveCompare}
        />

        {/* 10. CLINIC FACILITIES SECTION */}
        <FacilityCard />

        {/* 8. INTERACTIVE MAP PREVIEW */}
        {!loading && clinics.length > 0 && (
          <ClinicMapPreview 
            clinics={filteredClinics.length > 0 ? filteredClinics : clinics} 
            userLocation={userLocation}
            onRefresh={async () => {
              const clinicsRes = await clinicApi.getClinics();
              setClinics(clinicsRes.data);
            }}
          />
        )}

        {/* 12. WHY CHOOSE VERIFIED CLINICS */}
        <section className="bg-white border border-[#2E7D32]/5 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="bg-[#2E7D32]/5 text-primary border border-primary/10 text-[9px] font-bold py-1 px-3.5 rounded-full uppercase tracking-wider inline-block">
              Accreditation Guard
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary">Why Choose Verified Partner Clinics?</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Every partner center in our directory undergoes diagnostic standards reviews to assure patient healing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs font-semibold text-text-secondary">
            {/* Card 1 */}
            <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-primary/5 space-y-3">
              <span className="text-lg block">🏥</span>
              <h4 className="font-serif font-bold text-primary text-[11px] leading-tight block">Verified Facilities</h4>
              <p className="text-[9.5px] leading-relaxed font-medium">Standardized clinical tools, clean therapy rooms, and certified herbal compounding labs.</p>
            </div>
            {/* Card 2 */}
            <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-primary/5 space-y-3">
              <span className="text-lg block">👨‍⚕️</span>
              <h4 className="font-serif font-bold text-primary text-[11px] leading-tight block">Experienced Doctors</h4>
              <p className="text-[9.5px] leading-relaxed font-medium">Practitioners hold verified BAMS/MD qualifications and registered boards credentials.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-primary/5 space-y-3">
              <span className="text-lg block">🌿</span>
              <h4 className="font-serif font-bold text-primary text-[11px] leading-tight block">Trusted Treatments</h4>
              <p className="text-[9.5px] leading-relaxed font-medium">Pure organic herbal oils and strict alignment with classical Ayurvedic healing textbooks.</p>
            </div>
            {/* Card 4 */}
            <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-primary/5 space-y-3">
              <span className="text-lg block">⚖</span>
              <h4 className="font-serif font-bold text-primary text-[11px] leading-tight block">Transparent Pricing</h4>
              <p className="text-[9.5px] leading-relaxed font-medium">Clean Billing package outlines without hidden taxes or diagnostic commissions.</p>
            </div>
            {/* Card 5 */}
            <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-primary/5 space-y-3">
              <span className="text-lg block">⭐</span>
              <h4 className="font-serif font-bold text-primary text-[11px] leading-tight block">Patient Reviews</h4>
              <p className="text-[9.5px] leading-relaxed font-medium">Authentic feedback records and transparent clinical recovery outcomes registry.</p>
            </div>
          </div>
        </section>

        {/* 11. SUCCESS STORIES SECTION */}
        <SuccessStoryCard />

        {/* 13. CLINIC CTA SECTION */}
        <ClinicCTA 
          onBrowseClinics={() => {
            const el = document.getElementById('popular-only');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onBookConsultation={handleExploreClinics}
        />

        {/* 14. NEWSLETTER SECTION */}
        <section className="bg-white border border-[#2E7D32]/10 p-8 md:p-12 rounded-3xl shadow-sm text-center max-w-3xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mx-auto">
            <Mail className="w-6 h-6 text-accent" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-xl md:text-2xl font-bold text-primary">Subscribe to Partner Insights</h3>
            <p className="text-xs text-text-secondary leading-relaxed font-medium max-w-md mx-auto">
              Stay updated with certified health retreat discounts, seasonal Panchakarma offers, and wellness guidelines.
            </p>
          </div>

          {newsletterSubscribed ? (
            <div className="bg-[#F8FFF8] border border-primary/20 text-primary py-3.5 px-6 rounded-2xl inline-flex items-center space-x-2.5 text-xs font-bold animate-fade-in-up">
              <Check className="w-4.5 h-4.5 text-accent shrink-0" />
              <span>Thank you! Your secure subscription is now active.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-3.5 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full bg-[#FAF9F6] border border-[#2E7D32]/10 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary font-semibold text-text-primary"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-light text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md transition-colors shrink-0 uppercase tracking-widest flex items-center justify-center space-x-1.5"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5 text-accent" />
              </button>
            </form>
          )}
        </section>

      </div>
    </div>
  );
};

export default Clinics;
