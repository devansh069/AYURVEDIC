import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, Star, Clock, Heart, ShieldAlert, CheckCircle2, ChevronRight, UserCheck, Calendar, ArrowLeft, Loader } from 'lucide-react';
import { Treatment } from '../../types';
import { treatmentApi } from '../../services/treatmentApi';

interface TreatmentDetailProps {
  treatment: Treatment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TreatmentDetail: React.FC<TreatmentDetailProps> = ({ treatment, isOpen, onClose }) => {
  const navigate = useNavigate();

  // Booking states
  const [bookingMode, setBookingMode] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (9 AM - 12 PM)');
  const [notes, setNotes] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingId, setBookingId] = useState('');

  if (!isOpen || !treatment) return null;

  const handleFindDoctors = () => {
    onClose();
    navigate(`/doctors`);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('submitting');
    setErrorMessage('');
    
    try {
      const res = await treatmentApi.bookTreatment({
        treatmentId: treatment.id,
        treatmentName: treatment.name,
        patientName,
        patientEmail,
        patientPhone,
        preferredDate,
        preferredTime,
        notes
      });
      
      if (res.data && !res.isFallback) {
        setBookingId(res.data.booking.id);
        setBookingStatus('success');
        // Clear form
        setPatientName('');
        setPatientEmail('');
        setPatientPhone('');
        setPreferredDate('');
        setNotes('');
      } else {
        setErrorMessage(res.error || "Booking transaction failed.");
        setBookingStatus('error');
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setBookingStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-primary/45 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#F8FFF8] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-white/60 flex flex-col max-h-[90vh] animate-fade-in-up">
        
        {/* Banner header image */}
        <div
          className="relative h-60 bg-primary text-white p-6 md:p-8 flex flex-col justify-end shrink-0"
          style={{
            backgroundImage: `linear-gradient(rgba(46,125,50,0.7), rgba(46,125,50,0.95)), url(${treatment.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Close button */}
          <button
            onClick={() => {
              setBookingMode(false);
              setBookingStatus('idle');
              onClose();
            }}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-2">
            <span className="bg-accent text-primary text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
              {treatment.category}
            </span>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <h2 className="font-serif text-2xl md:text-3xl font-bold">{treatment.name}</h2>
              <div className="flex items-center space-x-1.5 bg-white/15 px-3 py-1 rounded-full text-[10px] font-bold">
                <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                <span>{treatment.rating} ({treatment.reviewCount} Reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrolling details content */}
        <div className="p-6 md:p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Columns (About and details) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Overview */}
            <div className="space-y-2.5">
              <h3 className="font-serif text-base font-bold text-primary">Overview</h3>
              <p className="text-xs text-text-secondary leading-relaxed font-medium">
                {treatment.overview}
              </p>
            </div>

            {/* Benefits list */}
            <div className="space-y-3 pt-4 border-t border-gray-150">
              <h3 className="font-serif text-base font-bold text-primary">Core Benefits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {treatment.benefits.map((b, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs font-semibold text-text-primary">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Procedure */}
            <div className="space-y-4 pt-4 border-t border-gray-150">
              <div className="space-y-1">
                <h3 className="font-serif text-base font-bold text-primary">Procedure Protocol</h3>
                <p className="text-[11px] text-text-secondary font-medium">{treatment.procedure}</p>
              </div>

              {/* Numbered Steps */}
              <div className="space-y-3 bg-white p-4.5 rounded-2xl border border-primary/5">
                <span className="text-[9px] uppercase font-bold text-text-secondary tracking-widest block">Operational Stages</span>
                <ol className="space-y-3 text-xs text-text-primary">
                  {treatment.steps.map((step, idx) => (
                    <li key={idx} className="flex space-x-3">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed font-medium">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Treatment FAQs */}
            <div className="space-y-3 pt-4 border-t border-gray-150">
              <h3 className="font-serif text-base font-bold text-primary">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {treatment.faq.map((fq, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-gray-150/70 space-y-1">
                    <h4 className="text-xs font-bold text-primary">Q: {fq.question}</h4>
                    <p className="text-[11px] text-text-secondary leading-relaxed font-medium">A: {fq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Specifications or Bookings Form) */}
          <div className="space-y-6">
            
            {bookingMode ? (
              // BOOKING FORM MODE
              <div className="bg-white border border-accent/20 p-5 rounded-2xl shadow-sm space-y-4">
                {bookingStatus === 'success' ? (
                  // SUCCESS PANEL
                  <div className="text-center py-6 space-y-4 animate-fade-in-up">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary mx-auto">
                      <CheckCircle2 className="w-7 h-7 text-accent" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-primary font-serif">Booking Confirmed!</h4>
                      <p className="text-[10px] text-text-secondary leading-normal">
                        Your session has been registered in real time. Our clinic coordinator will contact you shortly.
                      </p>
                    </div>
                    <div className="bg-primary/5 p-3 rounded-xl border border-primary/10 text-left space-y-1">
                      <span className="text-[8px] uppercase font-bold text-text-secondary block">Booking Reference ID</span>
                      <code className="text-[10px] font-mono font-bold text-primary block break-all">{bookingId}</code>
                    </div>
                    <button
                      onClick={() => {
                        setBookingMode(false);
                        setBookingStatus('idle');
                      }}
                      className="w-full bg-primary hover:bg-primary-light text-white text-[10px] font-bold py-2.5 rounded-xl uppercase tracking-wider shadow-sm transition-colors"
                    >
                      Back to Specifications
                    </button>
                  </div>
                ) : (
                  // INPUT FORM
                  <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <h4 className="font-serif text-sm font-bold text-primary">Book Treatment</h4>
                      <button
                        type="button"
                        onClick={() => {
                          setBookingMode(false);
                          setBookingStatus('idle');
                        }}
                        className="text-[9px] font-bold uppercase text-accent hover:text-primary transition-colors flex items-center space-x-0.5"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-secondary uppercase">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={patientName}
                        onChange={e => setPatientName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-secondary uppercase">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={patientEmail}
                        onChange={e => setPatientEmail(e.target.value)}
                        placeholder="e.g. john@example.com"
                        className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-secondary uppercase">Phone Number</label>
                      <input
                        type="tel"
                        value={patientPhone}
                        onChange={e => setPatientPhone(e.target.value)}
                        placeholder="e.g. +91 9876543210"
                        className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-text-secondary uppercase">Preferred Date *</label>
                        <input
                          type="date"
                          required
                          value={preferredDate}
                          onChange={e => setPreferredDate(e.target.value)}
                          className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-text-secondary uppercase">Preferred Slot</label>
                        <select
                          value={preferredTime}
                          onChange={e => setPreferredTime(e.target.value)}
                          className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary font-medium"
                        >
                          <option>Morning (9 AM - 12 PM)</option>
                          <option>Afternoon (12 PM - 4 PM)</option>
                          <option>Evening (4 PM - 7 PM)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-secondary uppercase">Special Notes</label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Any symptoms, medical history, or requests..."
                        className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary font-medium resize-none"
                      />
                    </div>

                    {bookingStatus === 'error' && (
                      <span className="text-[9px] font-bold text-red-500 block">
                        ⚠ {errorMessage}
                      </span>
                    )}

                    <button
                      type="submit"
                      disabled={bookingStatus === 'submitting'}
                      className="w-full bg-primary hover:bg-primary-light text-white font-bold text-[10px] py-3 rounded-xl shadow-md uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors disabled:bg-gray-250 disabled:cursor-not-allowed"
                    >
                      {bookingStatus === 'submitting' ? (
                        <>
                          <Loader className="w-3.5 h-3.5 animate-spin" />
                          <span>Booking Session...</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-3.5 h-3.5 text-accent" />
                          <span>Confirm Booking</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              // STANDARD SPECIFICATIONS MODE
              <>
                {/* Quick specifications panel */}
                <div className="bg-white border border-[#2E7D32]/10 p-5 rounded-2xl space-y-4 shadow-sm">
                  <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest block">Therapy Metrics</span>
                  
                  <div className="space-y-3.5 text-xs text-text-secondary">
                    <div className="flex items-center space-x-2.5">
                      <Clock className="w-4.5 h-4.5 text-primary shrink-0" />
                      <div>
                        <span className="text-[9px] block font-bold uppercase">Duration</span>
                        <span className="font-bold text-primary text-[11px]">{treatment.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5">
                      <Heart className="w-4.5 h-4.5 text-primary shrink-0" />
                      <div>
                        <span className="text-[9px] block font-bold uppercase">Recovery Period</span>
                        <span className="font-bold text-primary text-[11px]">{treatment.recoveryTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5">
                      <span className="text-primary text-[16px] font-bold shrink-0">₹</span>
                      <div>
                        <span className="text-[9px] block font-bold uppercase">Cost Estimate</span>
                        <span className="font-bold text-primary text-[11px]">₹{treatment.costEstimate.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suitability & Contraindications */}
                <div className="bg-white border border-[#2E7D32]/5 p-5 rounded-2xl space-y-4 shadow-sm text-xs">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-[#2E7D32] uppercase tracking-wider block">Suitable Conditions</span>
                    <div className="flex flex-wrap gap-1.5">
                      {treatment.suitableFor.map((item, i) => (
                        <span key={i} className="bg-[#2E7D32]/5 text-primary py-1 px-2.5 rounded-lg font-bold text-[9px]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-gray-50">
                    <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider block flex items-center space-x-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                      <span>Precautions</span>
                    </span>
                    <ul className="space-y-1 text-[10px] text-text-secondary list-disc list-inside leading-relaxed">
                      {treatment.precautions.map((item, i) => (
                        <li key={i} className="font-medium">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Booking Actions */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setBookingMode(true)}
                    className="w-full bg-primary hover:bg-primary-light text-white font-bold text-xs py-3.5 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 uppercase tracking-wider"
                  >
                    <Calendar className="w-4 h-4 text-accent" />
                    <span>Book Treatment Session</span>
                  </button>

                  <button
                    onClick={handleFindDoctors}
                    className="w-full bg-white hover:bg-gray-50 border border-primary text-primary font-bold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 uppercase tracking-wider"
                  >
                    <UserCheck className="w-4 h-4 text-accent" />
                    <span>Recommended Doctors</span>
                  </button>
                </div>
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default TreatmentDetail;
