import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Star, Sparkles, Heart, CheckCircle2, UserCheck, ThumbsUp, ShieldAlert, Phone } from 'lucide-react';
import { doctorApi } from '../services/doctorApi';
import { appointmentApi } from '../services/appointmentApi';
import { Doctor, Review, Appointment, ConsultationType } from '../types';

// Component Imports
import DoctorHero from '../components/doctors/DoctorHero';
import DoctorProfileCard from '../components/doctors/DoctorProfileCard';
import DoctorAbout from '../components/doctors/DoctorAbout';
import DoctorQualification from '../components/doctors/DoctorQualification';
import DoctorAwards from '../components/doctors/DoctorAwards';
import DoctorLanguages from '../components/doctors/DoctorLanguages';
import DoctorAvailability from '../components/doctors/DoctorAvailability';
import BookingModal from '../components/doctors/BookingModal';
import DoctorReviews from '../components/doctors/DoctorReviews';
import SimilarDoctors from '../components/doctors/SimilarDoctors';
import FAQSection from '../components/doctors/FAQSection';
import ErrorFallback from '../components/doctors/ErrorFallback';

export const DoctorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const availabilityRef = useRef<HTMLDivElement>(null);

  // Data states
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  
  // Loading & State checkers
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  // Selected parameters for booking
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAppt, setConfirmedAppt] = useState<Appointment | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Scroll handler to scheduling widget
  const handleScrollToBooking = () => {
    if (availabilityRef.current) {
      availabilityRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll to booking and auto-toggle video mode
  const handleVideoConsultClick = () => {
    handleScrollToBooking();
    // Dispatch scroll event and toggle can be handled or let the user scroll down.
  };

  // Load Doctor Profile and Reviews
  useEffect(() => {
    if (!id) return;
    
    const loadDoctorDetails = async () => {
      setLoading(true);
      try {
        const [docRes, allDocsRes, reviewsRes] = await Promise.all([
          doctorApi.getDoctorById(id),
          doctorApi.getDoctors(),
          appointmentApi.getDoctorReviews(id)
        ]);

        if (docRes.data) {
          setDoctor(docRes.data);
          setReviews(reviewsRes.data || []);
          setAllDoctors(allDocsRes.data);
          
          if (docRes.isFallback || allDocsRes.isFallback || reviewsRes.isFallback) {
            setIsFallbackMode(true);
          }
        } else {
          // If doctor not found in db, redirect to directory list
          navigate('/doctors');
        }
      } catch (err) {
        setIsFallbackMode(true);
        console.error('Failed fetching doctor details, using fallback mode', err);
      } finally {
        setLoading(false);
      }
    };

    loadDoctorDetails();
  }, [id, navigate]);

  // Load available slots when date changes
  useEffect(() => {
    if (!id || !bookingDate) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSelectedSlot(null);
      try {
        const slots = await appointmentApi.getAvailableSlots(id, bookingDate);
        setAvailableSlots(slots);
      } catch (err) {
        console.error('Error fetching available time slots', err);
        setAvailableSlots([
          "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
          "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
        ]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [id, bookingDate]);

  // Submit appointment booking
  const handleBookSubmit = async (formData: {
    patientName: string;
    email: string;
    phone: string;
    consultationType: ConsultationType;
    healthConcern: string;
    notes: string;
  }) => {
    if (!id || !selectedSlot) {
      setBookingError('Please select an active date and time slot first.');
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      const payload = {
        doctorId: id,
        patientName: formData.patientName,
        email: formData.email,
        phone: formData.phone,
        appointmentDate: bookingDate,
        appointmentTime: selectedSlot,
        consultationType: formData.consultationType,
        notes: `${formData.healthConcern}. Additional Notes: ${formData.notes || 'None'}`
      };

      const result = await appointmentApi.bookAppointment(payload);
      if (result.success) {
        setConfirmedAppt(result.data);
        setIsModalOpen(true);
        if (result.isFallback) {
          setIsFallbackMode(true);
        }
      } else {
        setBookingError('Appointment booking failed. Please verify details and retry.');
      }
    } catch (err: any) {
      setBookingError(err.message || 'Network error encountered during booking. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8FFF8] py-20">
        <div className="flex flex-col space-y-4 items-center animate-pulse">
          <div className="w-12 h-12 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
            Retrieving Vaidya Profile...
          </span>
        </div>
      </div>
    );
  }

  if (!doctor) return null;

  return (
    <div className="min-h-screen bg-background pb-16">
      
      {/* 0. Diagnostic offline warning banner */}
      {isFallbackMode && (
        <div className="pt-24 shrink-0">
          <ErrorFallback message="Using Demo Data" />
        </div>
      )}

      {/* Main Profile Area */}
      <div className={`max-w-7xl mx-auto px-6 md:px-12 ${isFallbackMode ? 'pt-6' : 'pt-28'}`}>
        
        {/* 1. Doctor Hero Section */}
        <div className="mb-10">
          <DoctorHero
            doctor={doctor}
            onBookClick={handleScrollToBooking}
            onVideoClick={handleVideoConsultClick}
          />
        </div>

        {/* 2. Main Page Layout (Two Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* LEFT COLUMN: About, Credentials, Reviews, FAQ */}
          <div className="lg:col-span-2 space-y-10">
            {/* About Doctor */}
            <DoctorAbout doctor={doctor} />

            {/* Qualifications */}
            <DoctorQualification doctor={doctor} />

            {/* Awards & Recognition */}
            <DoctorAwards doctor={doctor} />

            {/* Why Choose This Doctor Section */}
            <div className="bg-white border border-[#2E7D32]/5 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
              <h3 className="font-serif text-lg font-bold text-primary flex items-center space-x-2.5">
                <Heart className="w-5 h-5 text-accent shrink-0" />
                <span>Why Choose {doctor.name}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4.5 bg-[#F8FFF8] border border-primary/5 rounded-2xl flex items-start space-x-3.5">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-primary">Verified Expert</h4>
                    <p className="text-[10px] text-text-secondary leading-relaxed mt-0.5">
                      Fully registered practitioner under AYUSH ministry guidelines.
                    </p>
                  </div>
                </div>

                <div className="p-4.5 bg-[#F8FFF8] border border-primary/5 rounded-2xl flex items-start space-x-3.5">
                  <UserCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-primary">Years of Experience</h4>
                    <p className="text-[10px] text-text-secondary leading-relaxed mt-0.5">
                      Over {doctor.experience} years of clinical success in treating root imbalances.
                    </p>
                  </div>
                </div>

                <div className="p-4.5 bg-[#F8FFF8] border border-primary/5 rounded-2xl flex items-start space-x-3.5">
                  <ThumbsUp className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-primary">Patient Satisfaction</h4>
                    <p className="text-[10px] text-text-secondary leading-relaxed mt-0.5">
                      Rated {doctor.rating}/5.0 stars with consistent positive recovery reports.
                    </p>
                  </div>
                </div>

                <div className="p-4.5 bg-[#F8FFF8] border border-primary/5 rounded-2xl flex items-start space-x-3.5">
                  <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-primary">Personalized Care</h4>
                    <p className="text-[10px] text-text-secondary leading-relaxed mt-0.5">
                      Treatments tailored to your unique Prakriti (body constitution) and Agni.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Languages Spoken (Mobile layout utility) */}
            <div className="lg:hidden">
              <DoctorLanguages doctor={doctor} />
            </div>

            {/* Reviews Section */}
            <div className="bg-white border border-[#2E7D32]/5 p-6 md:p-8 rounded-3xl shadow-sm">
              <DoctorReviews reviews={reviews} />
            </div>

            {/* FAQ Accordions */}
            <FAQSection />
          </div>

          {/* RIGHT COLUMN: Sidebar Stats & Availability Widget */}
          <div className="space-y-10">
            {/* Quick Profile Summary Card */}
            <DoctorProfileCard
              doctor={doctor}
              onBookScroll={handleScrollToBooking}
            />

            {/* Languages Badges (Desktop) */}
            <div className="hidden lg:block">
              <DoctorLanguages doctor={doctor} />
            </div>

            {/* Interactive Availability Calendar & Form */}
            <div ref={availabilityRef}>
              <DoctorAvailability
                doctor={doctor}
                selectedDate={bookingDate}
                onDateChange={setBookingDate}
                slots={availableSlots}
                selectedSlot={selectedSlot}
                onSlotSelect={setSelectedSlot}
                loadingSlots={loadingSlots}
                onBookSubmit={handleBookSubmit}
                isSubmitting={isSubmitting}
                errorMsg={bookingError}
              />
            </div>
          </div>

        </div>

        {/* 3. Similar Doctors Carousel/Grid */}
        <div className="mt-16">
          <SimilarDoctors
            doctors={allDoctors}
            currentDoctorId={doctor.id}
          />
        </div>

        {/* 4. CTA Banner Section */}
        <section className="bg-gradient-to-r from-[#2E7D32] to-[#1B4D20] text-white p-8 md:p-12 rounded-3xl mt-16 text-center space-y-6 shadow-xl relative overflow-hidden">
          {/* Subtle gold decoration background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-serif text-2xl md:text-4xl font-bold">
              Start Your Ayurveda Healing Journey Today
            </h2>
            <p className="text-xs text-secondary leading-relaxed max-w-lg mx-auto">
              Restore your doshas and achieve systemic wellness under specialized Ayurvedic Vaidya consultation. Secure your diagnostic checkup now.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
            <button
              onClick={handleScrollToBooking}
              className="bg-accent hover:bg-[#c29d2f] text-primary font-bold text-xs py-3.5 px-8 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 uppercase tracking-wider"
            >
              Book Appointment Now
            </button>
            <button
              onClick={() => window.open('tel:+1800-AYURVEDA', '_blank')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs py-3.5 px-8 rounded-full shadow-sm transition-all flex items-center justify-center space-x-2 uppercase tracking-wider"
            >
              <Phone className="w-4 h-4 text-accent animate-bounce" />
              <span>Contact Clinic</span>
            </button>
          </div>
        </section>

      </div>

      {/* 5. Booking Confirmation Overlay Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setConfirmedAppt(null);
        }}
        appointment={confirmedAppt}
        doctorName={doctor.name}
      />

    </div>
  );
};

export default DoctorProfile;
