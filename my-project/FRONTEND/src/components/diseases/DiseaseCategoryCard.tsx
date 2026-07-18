import React from 'react';
import { Activity, Info, Droplets, Wind, Heart, Brain, FileText } from 'lucide-react';
import { DiseaseCategory } from '../../services/diseaseApi';

const categoryIcons: Record<string, React.ComponentType<any>> = {
  "Digestive Disorders": Activity,
  "Skin Disorders": Info,
  "Women's Health": Droplets,
  "Respiratory Disorders": Wind,
  "Lifestyle Diseases": Heart,
  "Mental Wellness": Brain,
  "Bone & Joints": Activity,
  "Nervous System": Brain,
};

interface DiseaseCategoryCardProps {
  category: DiseaseCategory;
  isActive: boolean;
  onClick: () => void;
}

export const DiseaseCategoryCard: React.FC<DiseaseCategoryCardProps> = ({ category, isActive, onClick }) => {
  const IconComponent = categoryIcons[category.name] || FileText;

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col items-center text-center space-y-3 ${
        isActive
          ? 'bg-primary border-primary text-white shadow-md shadow-primary/10'
          : 'bg-white border-[#2E7D32]/5 text-text-primary hover:border-primary/20 hover:shadow-md'
      }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-white/20 text-accent' : 'bg-primary/5 text-primary'}`}>
        <IconComponent className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-serif text-sm font-bold">{category.name}</h4>
        <p className={`text-[10px] mt-1 leading-relaxed ${isActive ? 'text-white/80' : 'text-text-secondary'}`}>
          {category.description}
        </p>
      </div>
    </div>
  );
};

export default DiseaseCategoryCard;
