import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, Sparkles, HelpCircle, UserCheck, Bot } from 'lucide-react';
import { Disease, DiseaseCategory } from '../../services/diseaseApi';
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-primary/45 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#F8FFF8] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-white/60 flex flex-col max-h-[90vh] animate-fade-in-up">
        
        {/* Banner Header Section */}
        <div
          className="relative h-60 bg-primary text-white p-6 md:p-8 flex flex-col justify-end shrink-0"
          style={{
            backgroundImage: `linear-gradient(rgba(46,125,50,0.7), rgba(46,125,50,0.95)), url(${disease.modernData?.wikiImage || disease.image})`,
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
          
          <div className="space-y-2">
            <span className="bg-accent text-primary text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              {disease.category}
            </span>
            <h2 className="font-serif text-2xl md:text-4xl font-bold">{disease.name}</h2>
            <p className="text-xs text-secondary max-w-xl leading-relaxed">{disease.shortDescription}</p>
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
                {disease.ayurvedicPerspective}
              </p>
            </div>

            {/* Severity Card */}
            <div className="bg-white border border-[#2E7D32]/5 p-5 rounded-2xl shadow-sm space-y-4">
              <div>
                <span className="block text-[9px] uppercase font-bold text-text-secondary">Dosha Causes</span>
                <ul className="mt-2 space-y-1.5">
                  {disease.causes.map((c, i) => (
                    <li key={i} className="text-xs text-text-primary font-semibold flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-text-secondary">Severity Risk</span>
                <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  disease.severity === 'High' 
                    ? 'bg-red-500 text-white' 
                    : disease.severity === 'Moderate' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-primary text-white'
                }`}>
                  {disease.severity}
                </span>
              </div>
            </div>
          </div>

          {/* 1b. Modern Medical Perspective (Wikipedia & openFDA) */}
          {disease.modernData && (
            <div className="bg-white border border-accent/20 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold text-primary flex items-center space-x-2">
                <Bot className="w-5 h-5 text-accent" />
                <span>Modern Medical Perspective (Real-Time API Data)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <span className="block text-[9px] uppercase font-bold text-text-secondary">Wikipedia Medical Summary</span>
                  <p className="text-xs text-text-secondary leading-relaxed bg-primary/5 p-4 rounded-2xl border border-primary/10">
                    {disease.modernData.wikiExtract || "No summary available."}
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-text-secondary">openFDA Approved Active Ingredients</span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {disease.modernData.fdaApprovedDrugs && disease.modernData.fdaApprovedDrugs.length > 0 ? (
                        disease.modernData.fdaApprovedDrugs.map((drug, i) => (
                          <span key={i} className="text-[10px] font-semibold bg-accent/15 border border-accent/25 text-primary px-3 py-1.5 rounded-full">
                            {drug}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-text-secondary italic">No drugs listed.</span>
                      )}
                    </div>
                  </div>
                  {disease.modernData.lastSynced && (
                    <span className="block text-[9px] text-text-secondary italic">
                      Last Synced: {new Date(disease.modernData.lastSynced).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. Symptoms Checklist */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-primary">Symptoms Checklist</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {disease.symptoms.map((s, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-xs text-text-secondary bg-white px-4 py-3 rounded-xl border border-[#2E7D32]/5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Diet Recommendations (Pathya / Apathya) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recommended Foods */}
            <div className="bg-emerald-500/5 border border-emerald-100 p-6 rounded-2xl space-y-3">
              <h4 className="font-serif text-base font-bold text-emerald-950 flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Pathya (Recommended Diet)</span>
              </h4>
              <ul className="space-y-2">
                {disease.dietRecommendations.map((food, i) => (
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

          {/* 4. Lifestyle & Herbs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#2E7D32]/5 p-6 rounded-2xl shadow-sm space-y-3 col-span-1 md:col-span-2">
              <h4 className="font-serif text-base font-bold text-primary">Lifestyle Recommendations</h4>
              <ul className="space-y-2">
                {disease.lifestyleRecommendations.map((rec, i) => (
                  <li key={i} className="text-xs text-text-secondary leading-relaxed font-semibold flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-[#2E7D32]/5 p-6 rounded-2xl shadow-sm space-y-3">
              <h4 className="font-serif text-base font-bold text-primary">Recommended Herbs</h4>
              <div className="flex flex-wrap gap-2">
                {disease.recommendedHerbs.map((h, i) => (
                  <span key={i} className="text-[10px] font-bold bg-accent/15 border border-accent/25 text-primary px-3 py-1.5 rounded-full">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 5. treatments */}
          <div className="bg-white border border-[#2E7D32]/5 p-6 rounded-2xl shadow-sm space-y-3">
            <h4 className="font-serif text-base font-bold text-primary">Recommended Panchakarma & Therapies</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-semibold">
              {disease.treatments.join(', ')}
            </p>
          </div>

          {/* 6. Timeline */}
          <DiseaseTimeline timeline={disease.recoveryTimeline} />

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
