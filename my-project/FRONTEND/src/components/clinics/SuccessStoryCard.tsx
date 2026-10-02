import React, { useState, useEffect } from 'react';
import { Star, Quote, ShieldCheck } from 'lucide-react';
import axios from 'axios';

interface ClinicTestimonial {
  id: string;
  patientName: string;
  conditionName?: string;
  condition?: string;
  clinicName: string;
  recoveryResult: string;
  quote: string;
  avatar: string;
}

export const SuccessStoryCard: React.FC = () => {
  const [clinicStories, setClinicStories] = useState<ClinicTestimonial[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get('http://localhost:5174/api/clinics/stories');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setClinicStories(res.data);
        }
      } catch (err) {
        console.error('Failed fetching clinic stories from SQL API:', err);
      }
    };
    fetchStories();
  }, []);

  return (
    <section className="bg-white border border-[#2E7D32]/5 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="bg-[#2E7D32]/5 text-primary border border-primary/10 text-[9px] font-bold py-1 px-3.5 rounded-full uppercase tracking-wider inline-block">
          Patient Chronicles
        </span>
        <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary">Clinic Recovery Records</h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Discover outcomes achieved by patients undergoing clinical purification regimens at our partner sanctuaries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        {clinicStories.map((s) => (
          <div 
            key={s.id} 
            className="bg-[#FAF9F6] border border-primary/5 hover:border-primary/20 p-6 rounded-3xl flex flex-col justify-between space-y-4 transition-all shadow-sm relative group"
          >
            <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/5 group-hover:text-primary/10 transition-colors" />
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                  ))}
                </div>
                <span className="text-[8.5px] bg-primary/5 text-primary border border-primary/10 py-0.5 px-2 rounded-full uppercase font-bold tracking-wider">
                  {s.condition || s.conditionName}
                </span>
              </div>

              <p className="text-[11px] text-text-secondary leading-relaxed font-semibold italic">
                "{s.quote}"
              </p>
            </div>

            <div className="space-y-3">
              {/* Recovery result */}
              <div className="bg-[#2E7D32]/5 border border-primary/15 p-2 rounded-xl flex items-center space-x-1.5 text-primary font-bold">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                <span className="text-[10px] truncate">{s.recoveryResult}</span>
              </div>

              {/* Profile */}
              <div className="flex items-center space-x-3 pt-3 border-t border-gray-150">
                <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-sm border border-white">
                  <img src={s.avatar} alt={s.patientName} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-primary">{s.patientName}</h4>
                  <p className="text-[9px] text-text-secondary font-medium truncate">
                    Treated at <span className="text-accent font-bold">{s.clinicName}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SuccessStoryCard;
