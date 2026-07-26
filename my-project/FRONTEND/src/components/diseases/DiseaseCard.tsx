// FRONTEND/src/components/diseases/DiseaseCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Bookmark, Star, UserCheck, Share2, Clock, Heart } from 'lucide-react';
import { Disease } from '../../services/diseaseApi';

interface DiseaseCardProps {
  disease: Disease;
  onLearnMore: () => void;
}

export const DiseaseCard: React.FC<DiseaseCardProps> = ({ disease, onLearnMore }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(disease.totalBookmarks || 30);
  const [copied, setCopied] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    setBookmarkCount(prev => isSaved ? prev - 1 : prev + 1);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/diseases?slug=${disease.slug}`;
    if (navigator.share) {
      navigator.share({
        title: disease.diseaseName || disease.name,
        text: disease.overview || disease.shortDescription,
        url: url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      onClick={onLearnMore}
      className="bg-white border border-[#2E7D32]/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer card-hover"
    >
      <div>
        {/* Header Image */}
        <div className="h-48 overflow-hidden relative">
          <img
            src={disease.image || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&q=80'}
            alt={disease.diseaseName || disease.name}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          />
          <span className={`absolute top-4 left-4 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
            disease.severity === 'High' 
              ? 'bg-red-500 text-white' 
              : disease.severity === 'Moderate' 
                ? 'bg-amber-500 text-white' 
                : 'bg-primary text-white'
          }`}>
            {disease.severity} Risk
          </span>
          <button
            onClick={handleSave}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm text-primary transition-colors duration-200"
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-primary'}`} />
          </button>
        </div>

        {/* Info panel */}
        <div className="p-5 space-y-3">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-[#81C784]">
            <span>{disease.category}</span>
            <div className="flex items-center space-x-1 text-amber-500">
              <Star className="w-3 h-3 fill-amber-500" />
              <span>{disease.rating || 4.8}</span>
            </div>
          </div>

          <h3 className="font-serif text-lg font-bold text-primary">{disease.diseaseName || disease.name}</h3>
          <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">{disease.overview || disease.shortDescription}</p>
          
          <div className="pt-2 border-t border-gray-50 flex flex-wrap gap-y-2 justify-between items-center text-[10px] text-text-secondary font-semibold">
            {disease.recoveryTime && (
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>Recovery: {disease.recoveryTime}</span>
              </span>
            )}
            {disease.doctorSpecialization && (
              <span className="flex items-center space-x-1">
                <UserCheck className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="line-clamp-1">{disease.doctorSpecialization}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Button footer */}
      <div className="px-5 pb-5 pt-2 space-y-3">
        <div className="flex justify-between items-center text-[10px] text-text-secondary border-t border-gray-50 pt-2.5">
          <div className="flex items-center space-x-3 font-semibold">
            <span className="flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{disease.totalViews || 120}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Bookmark className="w-3.5 h-3.5" />
              <span>{bookmarkCount}</span>
            </span>
          </div>
          <button 
            onClick={handleShare}
            className="text-primary hover:text-accent font-bold flex items-center space-x-1"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>

        <div className="flex gap-2 w-full pt-1">
          <button
            onClick={onLearnMore}
            className="flex-1 text-center bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold py-2 rounded-xl transition-all flex items-center justify-center space-x-1"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <Link
            to={`/doctors?specialization=${encodeURIComponent(disease.doctorSpecialization || disease.category)}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 text-center bg-primary hover:bg-primary-light text-white text-[10px] font-bold py-2 rounded-xl transition-all flex items-center justify-center space-x-1 shadow-sm"
          >
            <UserCheck className="w-3.5 h-3.5 text-accent shrink-0" />
            <span>Book Doctor</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DiseaseCard;
