// FRONTEND/src/components/diseases/DiseaseFilter.tsx
import React from 'react';
import { Filter, Star } from 'lucide-react';
import { DiseaseCategory } from '../../services/diseaseApi';

export interface PopularDiseaseItem {
  name: string;
  slug: string;
}

interface DiseaseFilterProps {
  categories: DiseaseCategory[];
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
  selectedSeverity: string | null;
  onSelectSeverity: (sev: string | null) => void;
  popularDiseases: PopularDiseaseItem[];
  onSelectPopular: (slug: string) => void;
  
  // New MongoDB Filter & Sort props
  selectedAgeGroup?: string;
  onSelectAgeGroup?: (age: string) => void;
  selectedGender?: string;
  onSelectGender?: (gender: string) => void;
  selectedDosha?: string;
  onSelectDosha?: (dosha: string) => void;
  selectedBodyPart?: string;
  onSelectBodyPart?: (bodyPart: string) => void;
  selectedSort?: string;
  onSelectSort?: (sort: string) => void;
}

export const DiseaseFilter: React.FC<DiseaseFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedSeverity,
  onSelectSeverity,
  popularDiseases,
  onSelectPopular,
  selectedAgeGroup = '',
  onSelectAgeGroup,
  selectedGender = '',
  onSelectGender,
  selectedDosha = '',
  onSelectDosha,
  selectedBodyPart = '',
  onSelectBodyPart,
  selectedSort = 'Newest',
  onSelectSort
}) => {
  return (
    <div className="bg-white border border-[#2E7D32]/5 p-6 rounded-3xl shadow-sm space-y-5">
      <div className="flex items-center space-x-2 pb-3 border-b border-[#2E7D32]/5">
        <Filter className="w-4.5 h-4.5 text-accent" />
        <h3 className="font-serif text-base font-bold text-primary font-bold">Refine Diagnostics</h3>
      </div>

      {/* Sorting */}
      {onSelectSort && (
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-text-secondary">Sort Results</label>
          <select
            value={selectedSort}
            onChange={(e) => onSelectSort(e.target.value)}
            className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2 px-2.5 text-xs focus:outline-none focus:border-primary font-medium"
          >
            <option value="Newest">Newest Added</option>
            <option value="Oldest">Oldest Added</option>
            <option value="Highest Rated">Highest Rated</option>
            <option value="Most Viewed">Most Viewed</option>
            <option value="Alphabetical">Alphabetical</option>
          </select>
        </div>
      )}

      {/* Category Dropdown */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-bold text-text-secondary">By Body System</label>
        <select
          value={selectedCategory || ''}
          onChange={(e) => onSelectCategory(e.target.value || null)}
          className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2 px-2.5 text-xs focus:outline-none focus:border-primary font-medium"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Severity Dropdown */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-bold text-text-secondary">By Severity</label>
        <select
          value={selectedSeverity || ''}
          onChange={(e) => onSelectSeverity(e.target.value || null)}
          className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2 px-2.5 text-xs focus:outline-none focus:border-primary font-medium"
        >
          <option value="">All Severities</option>
          <option value="Low">Low Severity</option>
          <option value="Moderate">Moderate Severity</option>
          <option value="High">High Severity</option>
        </select>
      </div>

      {/* Dosha Dropdown */}
      {onSelectDosha && (
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-text-secondary">By Dosha Affected</label>
          <select
            value={selectedDosha}
            onChange={(e) => onSelectDosha(e.target.value)}
            className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2 px-2.5 text-xs focus:outline-none focus:border-primary font-medium"
          >
            <option value="">All Doshas</option>
            <option value="Vata">Vata</option>
            <option value="Pitta">Pitta</option>
            <option value="Kapha">Kapha</option>
          </select>
        </div>
      )}

      {/* Body Part Dropdown */}
      {onSelectBodyPart && (
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-text-secondary">By Body Part</label>
          <select
            value={selectedBodyPart}
            onChange={(e) => onSelectBodyPart(e.target.value)}
            className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2 px-2.5 text-xs focus:outline-none focus:border-primary font-medium"
          >
            <option value="">All Parts</option>
            <option value="Joints">Joints</option>
            <option value="Stomach">Stomach</option>
            <option value="Skin">Skin</option>
            <option value="Head">Head</option>
            <option value="Lungs">Lungs</option>
            <option value="Systemic">Systemic</option>
          </select>
        </div>
      )}

      {/* Age Group Dropdown */}
      {onSelectAgeGroup && (
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-text-secondary">By Age Group</label>
          <select
            value={selectedAgeGroup}
            onChange={(e) => onSelectAgeGroup(e.target.value)}
            className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2 px-2.5 text-xs focus:outline-none focus:border-primary font-medium"
          >
            <option value="">All Ages</option>
            <option value="Children">Children</option>
            <option value="Adults">Adults</option>
            <option value="Seniors">Seniors</option>
          </select>
        </div>
      )}

      {/* Gender Dropdown */}
      {onSelectGender && (
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-text-secondary">By Gender</label>
          <select
            value={selectedGender}
            onChange={(e) => onSelectGender(e.target.value)}
            className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2 px-2.5 text-xs focus:outline-none focus:border-primary font-medium"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      )}

      {/* Popular Tags */}
      <div className="space-y-2.5 pt-1">
        <span className="text-[10px] uppercase font-bold text-text-secondary flex items-center space-x-1.5">
          <Star className="w-3.5 h-3.5 text-accent fill-accent" />
          <span>Popular Diagnostics</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {popularDiseases.map((item) => (
            <button
              key={item.slug}
              onClick={() => onSelectPopular(item.slug)}
              className="text-[10px] bg-[#F8FFF8] hover:bg-primary/5 border border-primary/15 text-primary font-semibold px-2.5 py-1 rounded-full transition-colors"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiseaseFilter;
