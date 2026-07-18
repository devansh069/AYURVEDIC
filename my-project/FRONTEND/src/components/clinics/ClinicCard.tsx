import React from 'react';
import { Star, MapPin, Shield, Calendar, Scale } from 'lucide-react';
import { Clinic } from '../../types';

interface ClinicCardProps {
  clinic: Clinic;
  onViewProfile: (clinic: Clinic) => void;
  onBookConsultation: (clinic: Clinic) => void;
  onToggleCompare?: (id: string) => void;
  isComparing?: boolean;
}

export const ClinicCard: React.FC<ClinicCardProps> = ({
  clinic,
  onViewProfile,
  onBookConsultation,
  onToggleCompare,
  isComparing = false
}) => {
  return (
    <div className="group bg-white border border-[#2E7D32]/5 hover:border-primary/25 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-[450px]">
      <div className="space-y-4">
        {/* Banner image & logo */}
        <div className="h-40 relative overflow-hidden bg-gray-50 shrink-0">
          <img 
            src={clinic.bannerImage} 
            alt={clinic.name} 
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
          {/* Logo overlay */}
          <div className="absolute bottom-3 left-4 flex items-end space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-white border border-primary/10 overflow-hidden shadow-sm p-1">
              <img src={clinic.logo} alt="" className="w-full h-full object-contain" />
            </div>
            {/* Type badge */}
            <span className="bg-primary/90 backdrop-blur-md text-white text-[8px] font-black py-1 px-3 rounded-full uppercase tracking-wider shadow-sm mb-1">
              {clinic.type}
            </span>
          </div>

          {/* Comparison checkbox indicator */}
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare(clinic.id)}
              className="absolute top-3 right-3 bg-white/90 backdrop-blur-md hover:bg-white p-2 rounded-xl border border-primary/10 text-primary shadow-sm flex items-center space-x-1.5 transition-colors"
            >
              <Scale className={`w-3.5 h-3.5 ${isComparing ? 'text-accent' : 'text-primary/60'}`} />
              <span className="text-[9px] font-bold uppercase tracking-wider">
                {isComparing ? 'Comparing' : 'Compare'}
              </span>
            </button>
          )}
        </div>

        {/* Content Details */}
        <div className="px-5 space-y-2.5">
          <div className="flex justify-between items-start">
            <h3 className="font-serif text-sm md:text-base font-bold text-primary group-hover:text-primary-light transition-colors leading-tight truncate max-w-[80%]">
              {clinic.name}
            </h3>
            <div className="flex items-center space-x-1 text-xs shrink-0 font-bold text-primary pl-2">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" />
              <span>{clinic.rating}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-text-secondary font-bold">
            <div className="flex items-center space-x-1 truncate max-w-[70%]">
              <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span className="truncate">{clinic.address}, {clinic.city}</span>
            </div>
            {(clinic as any).distanceKm !== undefined && (clinic as any).distanceKm !== null && (
              <span className="bg-primary/10 text-primary font-black px-2 py-0.5 rounded text-[8.5px] uppercase tracking-wider shrink-0 flex items-center space-x-0.5 border border-primary/15">
                <span>📍 {(clinic as any).distanceKm.toFixed(1)} km</span>
              </span>
            )}
          </div>

          <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2 font-medium">
            {clinic.description}
          </p>

          {/* Service Tags (first 3) */}
          <div className="flex flex-wrap gap-1 pt-1">
            {clinic.services.slice(0, 3).map((serv, i) => (
              <span 
                key={i} 
                className="bg-[#2E7D32]/5 text-primary text-[8.5px] font-bold py-0.5 px-2 rounded-md border border-primary/5 uppercase"
              >
                {serv}
              </span>
            ))}
            {clinic.services.length > 3 && (
              <span className="bg-gray-50 text-text-secondary text-[8.5px] font-bold py-0.5 px-1.5 rounded-md border border-gray-100">
                +{clinic.services.length - 3} More
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer statistics & action buttons */}
      <div className="p-5 border-t border-gray-50 bg-[#F8FFF8]/25 flex flex-col space-y-3 shrink-0 text-xs font-bold text-text-secondary">
        <div className="flex justify-between items-center text-[10px] border-b border-gray-50/60 pb-2">
          <div className="flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span>Est. {clinic.yearsEstablished} Years</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span>{clinic.doctorsCount} Specialists</span>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onViewProfile(clinic)}
            className="flex-grow border border-[#2E7D32]/25 hover:bg-primary/5 text-primary font-bold text-[9.5px] py-2.5 rounded-xl uppercase tracking-wider transition-colors"
          >
            View Profile
          </button>
          
          <button
            onClick={() => onBookConsultation(clinic)}
            className="flex-grow bg-primary hover:bg-primary-light text-white font-bold text-[9.5px] py-2.5 rounded-xl shadow-md uppercase tracking-wider transition-all"
          >
            Book Visit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicCard;
