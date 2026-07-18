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
}

export const DiseaseFilter: React.FC<DiseaseFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedSeverity,
  onSelectSeverity,
  popularDiseases,
  onSelectPopular
}) => {
  return (
    <div className="bg-white border border-[#2E7D32]/5 p-6 rounded-3xl shadow-sm space-y-6">
      <div className="flex items-center space-x-2 pb-4 border-b border-[#2E7D32]/5">
        <Filter className="w-4.5 h-4.5 text-accent" />
        <h3 className="font-serif text-base font-bold text-primary">Refine Diagnostics</h3>
      </div>

      {/* Category Dropdown */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold text-text-secondary">By Body System</label>
        <select
          value={selectedCategory || ''}
          onChange={(e) => onSelectCategory(e.target.value || null)}
          className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-primary font-medium"
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
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold text-text-secondary">By Severity</label>
        <select
          value={selectedSeverity || ''}
          onChange={(e) => onSelectSeverity(e.target.value || null)}
          className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-primary font-medium"
        >
          <option value="">All Severities</option>
          <option value="Low">Low Severity</option>
          <option value="Moderate">Moderate Severity</option>
          <option value="High">High Severity</option>
        </select>
      </div>

      {/* Popular Tags */}
      <div className="space-y-3 pt-2">
        <span className="text-[10px] uppercase font-bold text-text-secondary flex items-center space-x-1.5">
          <Star className="w-3.5 h-3.5 text-accent fill-accent" />
          <span>Popular Diagnostics</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {popularDiseases.map((item) => (
            <button
              key={item.slug}
              onClick={() => onSelectPopular(item.slug)}
              className="text-[10px] bg-[#F8FFF8] hover:bg-primary/5 border border-primary/15 text-primary font-semibold px-2.5 py-1.5 rounded-full transition-colors"
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
