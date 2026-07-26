// FRONTEND/src/components/diseases/DiseaseDetail.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { X, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, Sparkles, HelpCircle, UserCheck, Bot, Heart, Activity } from 'lucide-react';
import { Disease } from '../../services/diseaseApi';
import DiseaseTimeline from './DiseaseTimeline';
import RelatedDiseases from './RelatedDiseases';

interface DiseaseDetailProps {
  disease: Disease;
  allDiseases: Disease[];
  onClose: () => void;
  onSelectDisease: (d: Disease) => void;
}

export const DiseaseDetail: React.FC<DiseaseDetailProps> = ({
  disease,
  allDiseases,
  onClose,
  onSelectDisease
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Dynamic fetch recommended doctors matching doctorSpecialization or category
  const { data: recommendedDoctors } = useQuery({
    queryKey: ['detailDoctors', disease.doctorSpecialization || disease.category],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5174/api/doctors');
      const list = Array.isArray(res.data) ? res.data : [];
      const spec = (disease.doctorSpecialization || disease.category || '').toLowerCase();
      return list.filter((doc: any) => 
        (doc.specialization || '').toLowerCase().includes(spec) || 
        spec.includes((doc.specialization || '').toLowerCase())
      ).slice(0, 3);
    }
  });

  // Dynamic fetch related clinics
  const { data: relatedClinics } = useQuery({
    queryKey: ['detailClinics'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5174/api/clinics');
      return Array.isArray(res.data) ? res.data.slice(0, 2) : [];
    }
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-primary/45 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#F8FFF8] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-white/60 flex flex-col max-h-[90vh] animate-fade-in-up">
        
        {/* Banner Header Section */}
        <div
          className="relative h-64 bg-primary text-white p-6 md:p-8 flex flex-col justify-end shrink-0"
          style={{
            backgroundImage: `linear-gradient(rgba(46,125,50,0.75), rgba(46,125,50,0.98)), url(${disease.image || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="space-y-1">
            <div className="flex flex-wrap gap-2">
              <span className="bg-accent text-primary text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                {disease.category}
              </span>
              {disease.scientificName && (
                <span className="bg-white/10 text-white text-[9px] font-bold px-3 py-1 rounded-full italic inline-block">
                  {disease.scientificName}
                </span>
              )}
            </div>
            <h2 className="font-serif text-2xl md:text-4xl font-bold">{disease.diseaseName || disease.name}</h2>
            {disease.alternativeNames && disease.alternativeNames.length > 0 && (
              <p className="text-[10px] text-accent/80 font-bold uppercase tracking-wider">
                Also known as: {disease.alternativeNames.join(', ')}
              </p>
            )}
            <p className="text-xs text-secondary max-w-2xl leading-relaxed">{disease.overview || disease.shortDescription}</p>
          </div>
        </div>

        {/* Scrollable details panel */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8">
          
          {/* 1. Ayurvedic Perspective & General Description */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              <h3 className="font-serif text-base font-bold text-primary flex items-center space-x-2">
                <Sparkles className="w-4.5 h-4.5 text-accent" />
                <span>Nidana & Ayurvedic Perspective</span>
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed bg-white border border-[#2E7D32]/5 p-4 rounded-2xl shadow-sm">
                {disease.description || disease.ayurvedicPerspective}
              </p>
            </div>

            {/* Dosha & Severity Card */}
            <div className="bg-white border border-[#2E7D32]/5 p-5 rounded-2xl shadow-sm space-y-4">
              {disease.doshaAffected && disease.doshaAffected.length > 0 && (
                <div>
                  <span className="block text-[9px] uppercase font-bold text-text-secondary">Dosha Imbalance</span>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {disease.doshaAffected.map((dosha, i) => (
                      <span key={i} className="text-[9px] font-bold bg-amber-500/10 text-amber-800 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        {dosha}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {disease.bodyPartsAffected && disease.bodyPartsAffected.length > 0 && (
                <div>
                  <span className="block text-[9px] uppercase font-bold text-text-secondary">Affected Channels</span>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {disease.bodyPartsAffected.map((part, i) => (
                      <span key={i} className="text-[9px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                        {part}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <span className="block text-[9px] uppercase font-bold text-text-secondary">Severity & Recovery</span>
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    disease.severity === 'High' 
                      ? 'bg-red-500 text-white' 
                      : disease.severity === 'Moderate' 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-primary text-white'
                  }`}>
                    {disease.severity}
                  </span>
                  {disease.recoveryTime && (
                    <span className="text-[10px] text-text-secondary font-bold">
                      ~ {disease.recoveryTime}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Causes & Risk Factors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#2E7D32]/5 p-5 rounded-2xl shadow-sm space-y-2">
              <h4 className="text-xs uppercase font-bold text-primary">Nidana (Primary Causes)</h4>
              <ul className="space-y-1.5">
                {(disease.causes || []).map((cause, i) => (
                  <li key={i} className="text-xs text-text-secondary leading-relaxed font-semibold flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
            {disease.riskFactors && disease.riskFactors.length > 0 && (
              <div className="bg-white border border-[#2E7D32]/5 p-5 rounded-2xl shadow-sm space-y-2">
                <h4 className="text-xs uppercase font-bold text-primary">Risk Factors</h4>
                <ul className="space-y-1.5">
                  {disease.riskFactors.map((rf, i) => (
                    <li key={i} className="text-xs text-text-secondary leading-relaxed font-semibold flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-red-500/75 rounded-full shrink-0" />
                      <span>{rf}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Symptoms (Early vs Advanced) */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-primary">Clinical Symptoms Checklist</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* General Symptoms */}
              <div className="bg-white border border-[#2E7D32]/5 p-4 rounded-xl shadow-sm">
                <span className="block text-[9px] uppercase font-bold text-text-secondary mb-2">Common Symptoms</span>
                <div className="space-y-1.5">
                  {(disease.symptoms || []).map((s, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-text-secondary">
                      <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Early Symptoms */}
              <div className="bg-white border border-[#2E7D32]/5 p-4 rounded-xl shadow-sm">
                <span className="block text-[9px] uppercase font-bold text-primary mb-2">Early Warning Signs</span>
                <div className="space-y-1.5">
                  {disease.earlySymptoms && disease.earlySymptoms.length > 0 ? (
                    disease.earlySymptoms.map((s, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-text-secondary">
                        <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-text-secondary italic">N/A</span>
                  )}
                </div>
              </div>
              {/* Advanced Symptoms */}
              <div className="bg-white border border-[#2E7D32]/5 p-4 rounded-xl shadow-sm">
                <span className="block text-[9px] uppercase font-bold text-red-500 mb-2">Advanced Symptoms</span>
                <div className="space-y-1.5">
                  {disease.advancedSymptoms && disease.advancedSymptoms.length > 0 ? (
                    disease.advancedSymptoms.map((s, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-text-secondary">
                        <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-text-secondary italic">N/A</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Treatment Modalities (Ayurvedic & Modern) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-primary/20 p-5 rounded-2xl shadow-sm space-y-2">
              <h4 className="text-xs uppercase font-bold text-primary flex items-center space-x-1">
                <Heart className="w-4 h-4 text-accent fill-accent" />
                <span>Chikitsa (Ayurvedic Treatment)</span>
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                {disease.ayurvedicTreatment || (Array.isArray(disease.treatments) ? disease.treatments.join('. ') : '')}
              </p>
            </div>
            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm space-y-2">
              <h4 className="text-xs uppercase font-bold text-text-secondary flex items-center space-x-1">
                <Activity className="w-4 h-4 text-gray-400" />
                <span>Modern Medical Care</span>
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                {disease.modernTreatment || 'Symptomatic control and medication as recommended by doctors.'}
              </p>
            </div>
          </div>

          {/* Diet Recommendations (Pathya / Apathya) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recommended Foods */}
            <div className="bg-emerald-500/5 border border-emerald-100 p-6 rounded-2xl space-y-3">
              <h4 className="font-serif text-base font-bold text-emerald-950 flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Pathya (Recommended Foods)</span>
              </h4>
              <ul className="space-y-2">
                {(disease.recommendedFoods || disease.dietRecommendations || []).map((food, i) => (
                  <li key={i} className="text-xs text-emerald-900 font-medium flex items-center space-x-2">
                    <span className="w-1 h-1 bg-emerald-700 rounded-full shrink-0" />
                    <span>{food}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Foods to Avoid */}
            <div className="bg-red-500/5 border border-red-100 p-6 rounded-2xl space-y-3">
              <h4 className="font-serif text-base font-bold text-red-950 flex items-center space-x-2">
                <X className="w-5 h-5 text-red-500 shrink-0" />
                <span>Apathya (Foods to Avoid)</span>
              </h4>
              <ul className="space-y-2">
                {disease.foodsToAvoid.map((food, i) => (
                  <li key={i} className="text-xs text-red-900 font-medium flex items-center space-x-2">
                    <span className="w-1 h-1 bg-red-500 rounded-full shrink-0" />
                    <span>{food}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Lifestyle & Herbs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#2E7D32]/5 p-6 rounded-2xl shadow-sm space-y-3 col-span-1 md:col-span-2">
              <h4 className="font-serif text-base font-bold text-primary">Lifestyle & Daily Routine</h4>
              {disease.dailyRoutine && (
                <p className="text-xs text-text-secondary font-medium mb-2">
                  <span className="font-bold text-primary">Dincharya:</span> {disease.dailyRoutine}
                </p>
              )}
              {disease.sleepRecommendation && (
                <p className="text-xs text-text-secondary font-medium mb-2">
                  <span className="font-bold text-primary">Sleep Guidelines:</span> {disease.sleepRecommendation}
                </p>
              )}
              {disease.stressManagement && (
                <p className="text-xs text-text-secondary font-medium mb-2">
                  <span className="font-bold text-primary">Stress Control:</span> {disease.stressManagement}
                </p>
              )}
            </div>

            <div className="bg-white border border-[#2E7D32]/5 p-6 rounded-2xl shadow-sm space-y-3">
              <h4 className="font-serif text-base font-bold text-primary">Recommended Herbs & Meds</h4>
              <div className="flex flex-wrap gap-1.5">
                {disease.recommendedHerbs.map((h, i) => (
                  <span key={i} className="text-[10px] font-bold bg-accent/15 border border-accent/25 text-primary px-2.5 py-1 rounded-full">
                    {h}
                  </span>
                ))}
                {disease.recommendedMedicines && disease.recommendedMedicines.map((m, i) => (
                  <span key={i} className="text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded-full">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Yoga & Exercise Section */}
          {(disease.recommendedYoga?.length || disease.recommendedExercises?.length) ? (
            <div className="bg-white border border-[#2E7D32]/5 p-5 rounded-2xl shadow-sm space-y-3">
              <h4 className="font-serif text-base font-bold text-primary">Yoga & Physical Exercise</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {disease.recommendedYoga && disease.recommendedYoga.length > 0 && (
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-text-secondary mb-1.5">Yoga Asanas</span>
                    <div className="flex flex-wrap gap-1.5">
                      {disease.recommendedYoga.map((y, idx) => (
                        <span key={idx} className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                          {y}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {disease.recommendedExercises && disease.recommendedExercises.length > 0 && (
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-text-secondary mb-1.5">Exercise Guidelines</span>
                    <div className="flex flex-wrap gap-1.5">
                      {disease.recommendedExercises.map((e, idx) => (
                        <span key={idx} className="text-[10px] font-semibold bg-primary/5 text-primary border border-primary/15 px-2.5 py-1 rounded-full">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* 6. Timeline */}
          {disease.recoveryTimeline && disease.recoveryTimeline.length > 0 && (
            <DiseaseTimeline timeline={disease.recoveryTimeline} />
          )}

          {/* Dynamic Recommended Doctors */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold text-primary flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-accent" />
              <span>Recommended Ayurvedic Specialists</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendedDoctors && recommendedDoctors.length > 0 ? (
                recommendedDoctors.map((doc: any) => (
                  <div key={doc.id} className="bg-white border border-[#2E7D32]/5 p-4 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <img 
                        src={doc.photo || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&q=80"} 
                        alt={doc.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                      />
                      <div>
                        <h5 className="text-xs font-bold text-primary">{doc.name}</h5>
                        <p className="text-[10px] text-text-secondary font-semibold">{doc.qualification}</p>
                        <p className="text-[9px] text-accent font-bold uppercase">{doc.specialization}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-50 flex justify-between items-center text-[10px] font-bold text-text-secondary">
                      <span>Fee: ₹{doc.consultationFee || doc.fee}</span>
                      <Link 
                        to={`/doctor/${doc.id}`}
                        onClick={onClose}
                        className="text-primary hover:text-accent flex items-center space-x-1"
                      >
                        <span>Profile</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-4 bg-white border border-dashed border-[#2E7D32]/10 rounded-2xl text-xs text-text-secondary">
                  No direct matching specialists found. Any General Vaidya can advise.
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Related Clinics */}
          {relatedClinics && relatedClinics.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-serif text-base font-bold text-primary">Related Wellness Clinics</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedClinics.map((clinic: any) => (
                  <div key={clinic.id} className="bg-white border border-[#2E7D32]/5 p-4 rounded-2xl shadow-sm flex space-x-3 items-center">
                    <img 
                      src={clinic.bannerImage || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&q=80"} 
                      alt={clinic.name} 
                      className="w-16 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-primary line-clamp-1">{clinic.name}</h5>
                      <p className="text-[10px] text-text-secondary">{clinic.city}, {clinic.state}</p>
                      <Link 
                        to={`/clinics/${clinic.id}`}
                        onClick={onClose}
                        className="text-[9px] text-accent font-bold uppercase hover:underline"
                      >
                        View Clinic
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Related Diseases */}
          <RelatedDiseases
            currentDisease={disease}
            allDiseases={allDiseases}
            onSelect={onSelectDisease}
          />

          {/* 8. FAQs */}
          {disease.faq && disease.faq.length > 0 && (
            <div className="space-y-4 border-t border-[#2E7D32]/5 pt-6">
              <h4 className="font-serif text-base font-bold text-primary flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-accent shrink-0" />
                <span>Frequently Asked Questions</span>
              </h4>
              <div className="space-y-2">
                {disease.faq.map((item, idx) => {
                  const isFaqOpen = openFaq === idx;
                  return (
                    <div key={idx} className="bg-white border border-[#2E7D32]/5 rounded-xl overflow-hidden shadow-sm">
                      <button
                        onClick={() => setOpenFaq(isFaqOpen ? null : idx)}
                        className="w-full text-left px-5 py-3.5 text-xs font-bold text-primary flex justify-between items-center"
                      >
                        <span>{item.question}</span>
                        <span className="text-lg font-bold">{isFaqOpen ? '−' : '+'}</span>
                      </button>
                      {isFaqOpen && (
                        <div className="px-5 pb-4 text-xs text-text-secondary leading-relaxed border-t border-gray-50 pt-3">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="bg-primary/5 p-6 border-t border-[#2E7D32]/5 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-[10px] text-text-secondary font-semibold flex items-center space-x-1">
            <ShieldAlert className="w-4 h-4 text-accent shrink-0 animate-pulse" />
            <span>Consult a certified Vaidya before starting herbal regimens.</span>
          </span>
          <div className="flex space-x-3 w-full sm:w-auto">
            <Link
              to={`/doctors?specialization=${encodeURIComponent(disease.category)}`}
              onClick={onClose}
              className="flex-1 sm:flex-none border border-primary hover:bg-white text-primary text-xs font-bold px-6 py-3 rounded-full text-center flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <UserCheck className="w-4 h-4 text-accent" />
              <span>Recommended Doctors</span>
            </Link>
            <Link
              to="/doctors"
              onClick={onClose}
              className="flex-1 sm:flex-none bg-primary hover:bg-primary-light text-white text-xs font-bold px-6 py-3 rounded-full text-center flex items-center justify-center space-x-1.5 shadow-md"
            >
              <span>Book Consultation</span>
              <ArrowRight className="w-4 h-4 text-accent" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetail;
