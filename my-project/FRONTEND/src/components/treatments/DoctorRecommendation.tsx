import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Briefcase, Award } from 'lucide-react';
import { Doctor } from '../../types';

interface DoctorRecommendationProps {
  doctors: Doctor[];
  isFallback: boolean;
}

export const DoctorRecommendation: React.FC<DoctorRecommendationProps> = ({ doctors, isFallback }) => {
  return (
    <section className="bg-white border border-[#2E7D32]/5 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
      <div className="space-y-1">
        <span className="text-accent text-[9px] font-bold uppercase tracking-widest block font-sans">Ecosystem Directory</span>
        <h3 className="font-serif text-xl md:text-2xl font-bold text-primary">Recommended Practitioner Registry</h3>
        <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
          Consult with our verified, board-certified Ayurvedic Vaidyas specializing in this therapeutic profile.
        </p>
      </div>

      {doctors.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-[#2E7D32]/25 rounded-3xl bg-[#FAF9F6]">
          <p className="text-xs text-text-secondary font-medium italic">
            🍃 No verified practitioners are currently registered for this therapeutic profile.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.slice(0, 6).map((doc) => (
            <div 
              key={doc.id}
              className="group bg-[#FAF9F6] border border-primary/5 hover:border-primary/20 p-5 rounded-3xl flex flex-col justify-between h-[360px] hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Profile image & top metadata */}
                <div className="flex items-center space-x-3.5">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-white">
                    <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover group-hover:scale-103 transition-transform" />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <h4 className="font-bold text-primary font-serif leading-tight text-sm">{doc.name}</h4>
                    <p className="text-[10px] text-text-secondary font-semibold">{doc.specialization}</p>
                    <div className="flex items-center space-x-1 text-[10px] font-bold">
                      <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                      <span>{doc.rating} ({doc.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Specs */}
                <div className="space-y-2 text-[10.5px] text-text-secondary font-medium">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4.5 h-4.5 text-secondary shrink-0" />
                    <span>{doc.experience} Years of Active Experience</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4.5 h-4.5 text-secondary shrink-0" />
                    <span className="truncate">Schedule: {doc.availability}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4.5 h-4.5 text-secondary shrink-0" />
                    <span className="truncate">{doc.qualification}</span>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-[10px] text-text-secondary leading-relaxed line-clamp-3 font-semibold italic">
                  "{doc.about}"
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-gray-150 flex items-center justify-between shrink-0">
                <div>
                  <span className="block text-[8px] uppercase font-bold text-text-secondary">Consultation Fee</span>
                  <span className="text-xs font-black text-primary">₹{doc.consultationFee.toLocaleString('en-IN')}</span>
                </div>
                
                <Link
                  to={`/doctor/${doc.id}`}
                  className="bg-primary hover:bg-primary-light text-white font-bold text-[9.5px] py-2.5 px-4 rounded-xl shadow-md transition-colors uppercase tracking-wider block"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFallback && (
        <p className="text-[9px] text-text-secondary italic text-center pt-2">
          🍃 Practitioner recommendations resolved from offline local database.
        </p>
      )}
    </section>
  );
};

export default DoctorRecommendation;
