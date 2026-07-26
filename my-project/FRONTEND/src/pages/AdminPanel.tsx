// FRONTEND/src/pages/AdminPanel.tsx
import React, { useState } from 'react';
import { useDiseases, useCreateDisease, useUpdateDisease, useDeleteDisease, Disease } from '../services/diseaseApi';
import { Plus, Edit2, Trash2, Save, X, Settings, List, PlusCircle, CheckCircle, Database } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { data: diseasesRes, refetch } = useDiseases({ limit: 100 });
  const diseases = diseasesRes?.data || [];

  const createMutation = useCreateDisease();
  const updateMutation = useUpdateDisease();
  const deleteMutation = useDeleteDisease();

  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Disease>>({
    diseaseName: '',
    slug: '',
    scientificName: '',
    alternativeNames: [],
    category: 'Lifestyle Diseases',
    subCategory: '',
    overview: '',
    description: '',
    causes: [],
    symptoms: [],
    recommendedHerbs: [],
    recommendedMedicines: [],
    recommendedFoods: [],
    foodsToAvoid: [],
    recommendedYoga: [],
    recommendedExercises: [],
    severity: 'Moderate',
    recoveryTime: '',
    FAQs: [],
    doctorSpecialization: '',
    featuredImage: '',
    galleryImages: [],
    videoLinks: []
  });

  // Array inputs helper states
  const [tempAltName, setTempAltName] = useState('');
  const [tempCause, setTempCause] = useState('');
  const [tempSymptom, setTempSymptom] = useState('');
  const [tempHerb, setTempHerb] = useState('');
  const [tempMed, setTempMed] = useState('');
  const [tempFood, setTempFood] = useState('');
  const [tempAvoid, setTempAvoid] = useState('');
  const [tempYoga, setTempYoga] = useState('');
  const [tempExercise, setTempExercise] = useState('');
  
  // FAQ state
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');

  const handleEdit = (disease: Disease) => {
    setEditingId(disease._id || disease.id || null);
    setFormData({
      diseaseName: disease.diseaseName,
      slug: disease.slug,
      scientificName: disease.scientificName || '',
      alternativeNames: disease.alternativeNames || [],
      category: disease.category,
      subCategory: disease.subCategory || '',
      overview: disease.overview || '',
      description: disease.description || '',
      causes: disease.causes || [],
      symptoms: disease.symptoms || [],
      recommendedHerbs: disease.recommendedHerbs || [],
      recommendedMedicines: disease.recommendedMedicines || [],
      recommendedFoods: disease.recommendedFoods || [],
      foodsToAvoid: disease.foodsToAvoid || [],
      recommendedYoga: disease.recommendedYoga || [],
      recommendedExercises: disease.recommendedExercises || [],
      severity: disease.severity || 'Moderate',
      recoveryTime: disease.recoveryTime || '',
      FAQs: disease.FAQs || disease.faq || [],
      doctorSpecialization: disease.doctorSpecialization || '',
      featuredImage: disease.featuredImage || disease.image || '',
      galleryImages: disease.galleryImages || [],
      videoLinks: disease.videoLinks || []
    });
    setActiveTab('edit');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this disease document from MongoDB?')) {
      await deleteMutation.mutateAsync(id);
      refetch();
      alert('Disease deleted successfully from MongoDB!');
    }
  };

  const handleResetForm = () => {
    setFormData({
      diseaseName: '',
      slug: '',
      scientificName: '',
      alternativeNames: [],
      category: 'Lifestyle Diseases',
      subCategory: '',
      overview: '',
      description: '',
      causes: [],
      symptoms: [],
      recommendedHerbs: [],
      recommendedMedicines: [],
      recommendedFoods: [],
      foodsToAvoid: [],
      recommendedYoga: [],
      recommendedExercises: [],
      severity: 'Moderate',
      recoveryTime: '',
      FAQs: [],
      doctorSpecialization: '',
      featuredImage: '',
      galleryImages: [],
      videoLinks: []
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'edit' && editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: formData });
        alert('Disease details updated successfully in MongoDB!');
      } else {
        await createMutation.mutateAsync(formData as Omit<Disease, '_id' | 'id'>);
        alert('New disease successfully created and saved in MongoDB!');
      }
      handleResetForm();
      setActiveTab('list');
      refetch();
    } catch (err: any) {
      alert('Error saving disease document: ' + err.message);
    }
  };

  const addArrayItem = (field: keyof typeof formData, tempVal: string, setTemp: (v: string) => void) => {
    if (!tempVal.trim()) return;
    const currentList = (formData[field] as string[]) || [];
    setFormData({ ...formData, [field]: [...currentList, tempVal.trim()] });
    setTemp('');
  };

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    const currentList = (formData[field] as string[]) || [];
    const updated = currentList.filter((_, idx) => idx !== index);
    setFormData({ ...formData, [field]: updated });
  };

  const addFaq = () => {
    if (!faqQ.trim() || !faqA.trim()) return;
    const currentFaqs = formData.FAQs || [];
    setFormData({
      ...formData,
      FAQs: [...currentFaqs, { question: faqQ.trim(), answer: faqA.trim() }]
    });
    setFaqQ('');
    setFaqA('');
  };

  const removeFaq = (index: number) => {
    const currentFaqs = formData.FAQs || [];
    setFormData({
      ...formData,
      FAQs: currentFaqs.filter((_, idx) => idx !== index)
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-8 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-primary/10 pb-5">
        <div>
          <span className="bg-primary/5 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center space-x-1">
            <Database className="w-3.5 h-3.5 text-accent shrink-0 animate-pulse" />
            <span>Ayurveda Platform Database Controller</span>
          </span>
          <h1 className="font-serif text-3xl font-bold text-primary mt-1">Disease Admin Center</h1>
          <p className="text-xs text-text-secondary">Perform real-time CRUD operations directly on the Mongoose/MongoDB Disease Collections.</p>
        </div>

        <div className="flex bg-primary/5 p-1 rounded-xl">
          <button
            onClick={() => { setActiveTab('list'); handleResetForm(); }}
            className={`flex items-center space-x-1 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'list' ? 'bg-primary text-white shadow-sm' : 'text-primary hover:bg-primary/5'
            }`}
          >
            <List className="w-4 h-4" />
            <span>All Diseases</span>
          </button>
          <button
            onClick={() => { setActiveTab('add'); handleResetForm(); }}
            className={`flex items-center space-x-1 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'add' ? 'bg-primary text-white shadow-sm' : 'text-primary hover:bg-primary/5'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'list' ? (
        <div className="bg-white border border-[#2E7D32]/5 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-primary">Active Disease Documents ({diseases.length})</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2E7D32]/5 text-[10px] uppercase font-bold text-text-secondary">
                  <th className="pb-3 pl-3">Image</th>
                  <th className="pb-3">Disease Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Severity</th>
                  <th className="pb-3">Views / Bookmarks</th>
                  <th className="pb-3 pr-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E7D32]/5 text-xs text-text-secondary">
                {diseases.map((d) => (
                  <tr key={d._id || d.id} className="hover:bg-primary/5 transition-colors">
                    <td className="py-3 pl-3">
                      <img 
                        src={d.image || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=80&q=80'} 
                        alt={d.diseaseName || d.name} 
                        className="w-12 h-10 rounded-lg object-cover border border-primary/10"
                      />
                    </td>
                    <td className="py-3 font-bold text-primary">{d.diseaseName || d.name}</td>
                    <td className="py-3">{d.category}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        d.severity === 'High' ? 'bg-red-500 text-white' : d.severity === 'Moderate' ? 'bg-amber-500 text-white' : 'bg-primary text-white'
                      }`}>
                        {d.severity}
                      </span>
                    </td>
                    <td className="py-3">
                      <span>👁️ {d.totalViews || 0} | 🔖 {d.totalBookmarks || 0}</span>
                    </td>
                    <td className="py-3 pr-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(d)}
                          className="bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary p-2 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(d._id || d.id || '')}
                          className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-600 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-[#2E7D32]/5 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <h3 className="font-serif text-lg font-bold text-primary">
              {activeTab === 'edit' ? 'Edit Disease Document' : 'Create Disease Document'}
            </h3>
            <button 
              type="button" 
              onClick={() => { setActiveTab('list'); handleResetForm(); }}
              className="text-text-secondary hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Core properties */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Disease Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gout"
                  value={formData.diseaseName || ''}
                  onChange={(e) => setFormData({ ...formData, diseaseName: e.target.value })}
                  className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-primary font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Scientific Name</label>
                <input
                  type="text"
                  placeholder="e.g. Gouty arthritis"
                  value={formData.scientificName || ''}
                  onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                  className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-primary font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Category</label>
                <select
                  value={formData.category || 'Lifestyle Diseases'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-primary font-medium"
                >
                  <option value="Digestive Disorders">Digestive Disorders</option>
                  <option value="Skin Disorders">Skin Disorders</option>
                  <option value="Women's Health">Women's Health</option>
                  <option value="Respiratory Disorders">Respiratory Disorders</option>
                  <option value="Lifestyle Diseases">Lifestyle Diseases</option>
                  <option value="Mental Wellness">Mental Wellness</option>
                  <option value="Bone & Joints">Bone & Joints</option>
                  <option value="Nervous System">Nervous System</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Severity Risk</label>
                <select
                  value={formData.severity || 'Moderate'}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                  className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-primary font-medium"
                >
                  <option value="Low">Low Risk</option>
                  <option value="Moderate">Moderate Risk</option>
                  <option value="High">High Risk</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Recovery Time Course</label>
                <input
                  type="text"
                  placeholder="e.g. 2 - 4 months"
                  value={formData.recoveryTime || ''}
                  onChange={(e) => setFormData({ ...formData, recoveryTime: e.target.value })}
                  className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-primary font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Doctor Specialization Required</label>
                <input
                  type="text"
                  placeholder="e.g. Rheum-specialist"
                  value={formData.doctorSpecialization || ''}
                  onChange={(e) => setFormData({ ...formData, doctorSpecialization: e.target.value })}
                  className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-primary font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Featured Banner Image URL</label>
                <input
                  type="text"
                  placeholder="https://unsplash.com/..."
                  value={formData.featuredImage || ''}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-primary font-medium"
                />
              </div>
            </div>

            {/* Right Column: Narrative content */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Short Overview (Card Description)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="2-sentence descriptive executive summary..."
                  value={formData.overview || ''}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Detailed Ayurvedic perspective (Nidana & Samprapti)</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Detailed breakdown from traditional texts..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Ayurvedic Chikitsa (Treatment Protocol)</label>
                <textarea
                  rows={3}
                  placeholder="Panchakarma details, oil specifications..."
                  value={formData.ayurvedicTreatment || ''}
                  onChange={(e) => setFormData({ ...formData, ayurvedicTreatment: e.target.value })}
                  className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary font-medium"
                />
              </div>
            </div>
          </div>

          {/* Arrays Input Section */}
          <div className="border-t border-gray-100 pt-6 space-y-6">
            <h4 className="font-serif text-sm font-bold text-primary">Symptoms, Causes & Remedies Parameters</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Alternative Names */}
              <div className="space-y-2 bg-[#F8FFF8] p-4 rounded-2xl border border-primary/10">
                <label className="text-[10px] uppercase font-bold text-primary">Alternative Names</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Vatarakta"
                    value={tempAltName}
                    onChange={(e) => setTempAltName(e.target.value)}
                    className="flex-grow bg-white border border-[#2E7D32]/15 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('alternativeNames', tempAltName, setTempAltName)}
                    className="bg-primary hover:bg-primary-light text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(formData.alternativeNames || []).map((name, i) => (
                    <span key={i} className="bg-primary/5 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-primary/10">
                      <span>{name}</span>
                      <button type="button" onClick={() => removeArrayItem('alternativeNames', i)} className="text-red-500 hover:text-red-700 ml-1">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Clinical Symptoms */}
              <div className="space-y-2 bg-[#F8FFF8] p-4 rounded-2xl border border-primary/10">
                <label className="text-[10px] uppercase font-bold text-primary">Clinical Symptoms</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Joint Swelling"
                    value={tempSymptom}
                    onChange={(e) => setTempSymptom(e.target.value)}
                    className="flex-grow bg-white border border-[#2E7D32]/15 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('symptoms', tempSymptom, setTempSymptom)}
                    className="bg-primary hover:bg-primary-light text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(formData.symptoms || []).map((sym, i) => (
                    <span key={i} className="bg-primary/5 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-primary/10">
                      <span>{sym}</span>
                      <button type="button" onClick={() => removeArrayItem('symptoms', i)} className="text-red-500 hover:text-red-700 ml-1">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Etiology (Causes) */}
              <div className="space-y-2 bg-[#F8FFF8] p-4 rounded-2xl border border-primary/10">
                <label className="text-[10px] uppercase font-bold text-primary">Etiology (Causes)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Excess Uric Acid"
                    value={tempCause}
                    onChange={(e) => setTempCause(e.target.value)}
                    className="flex-grow bg-white border border-[#2E7D32]/15 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('causes', tempCause, setTempCause)}
                    className="bg-primary hover:bg-primary-light text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(formData.causes || []).map((c, i) => (
                    <span key={i} className="bg-primary/5 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-primary/10">
                      <span>{c}</span>
                      <button type="button" onClick={() => removeArrayItem('causes', i)} className="text-red-500 hover:text-red-700 ml-1">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {/* Recommended Herbs */}
              <div className="space-y-2 bg-[#F8FFF8] p-4 rounded-2xl border border-primary/10">
                <label className="text-[10px] uppercase font-bold text-primary">Recommended Herbs</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Giloy"
                    value={tempHerb}
                    onChange={(e) => setTempHerb(e.target.value)}
                    className="flex-grow bg-white border border-[#2E7D32]/15 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('recommendedHerbs', tempHerb, setTempHerb)}
                    className="bg-primary hover:bg-primary-light text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(formData.recommendedHerbs || []).map((h, i) => (
                    <span key={i} className="bg-accent/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-accent/20">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Foods */}
              <div className="space-y-2 bg-[#F8FFF8] p-4 rounded-2xl border border-primary/10">
                <label className="text-[10px] uppercase font-bold text-primary">Recommended Foods</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Barley soup"
                    value={tempFood}
                    onChange={(e) => setTempFood(e.target.value)}
                    className="flex-grow bg-white border border-[#2E7D32]/15 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('recommendedFoods', tempFood, setTempFood)}
                    className="bg-primary hover:bg-primary-light text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(formData.recommendedFoods || []).map((f, i) => (
                    <span key={i} className="bg-emerald-500/10 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Foods to Avoid */}
              <div className="space-y-2 bg-[#F8FFF8] p-4 rounded-2xl border border-primary/10">
                <label className="text-[10px] uppercase font-bold text-primary">Foods to Avoid</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Sour curd"
                    value={tempAvoid}
                    onChange={(e) => setTempAvoid(e.target.value)}
                    className="flex-grow bg-white border border-[#2E7D32]/15 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('foodsToAvoid', tempAvoid, setTempAvoid)}
                    className="bg-primary hover:bg-primary-light text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(formData.foodsToAvoid || []).map((f, i) => (
                    <span key={i} className="bg-red-500/10 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Manage FAQs */}
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <h4 className="font-serif text-sm font-bold text-primary">Manage Frequently Asked Questions (FAQs)</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="FAQ Question"
                  value={faqQ}
                  onChange={(e) => setFaqQ(e.target.value)}
                  className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary font-medium"
                />
                <textarea
                  rows={2}
                  placeholder="FAQ Answer"
                  value={faqA}
                  onChange={(e) => setFaqA(e.target.value)}
                  className="w-full bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary font-medium"
                />
                <button
                  type="button"
                  onClick={addFaq}
                  className="bg-primary hover:bg-primary-light text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm"
                >
                  Add FAQ
                </button>
              </div>

              <div className="space-y-2 border border-dashed border-[#2E7D32]/15 p-4 rounded-2xl max-h-48 overflow-y-auto">
                <span className="block text-[10px] uppercase font-bold text-text-secondary mb-2">Configured FAQs</span>
                {(formData.FAQs || []).map((faq, i) => (
                  <div key={i} className="text-xs border-b border-gray-50 pb-2 flex justify-between items-start gap-2">
                    <div>
                      <p className="font-bold text-primary">Q: {faq.question}</p>
                      <p className="text-text-secondary mt-0.5">A: {faq.answer}</p>
                    </div>
                    <button type="button" onClick={() => removeFaq(i)} className="text-red-500 font-bold hover:text-red-700">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="border-t border-gray-100 pt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => { setActiveTab('list'); handleResetForm(); }}
              className="border border-primary/20 hover:bg-primary/5 text-primary text-xs font-bold px-6 py-2.5 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-light text-white text-xs font-bold px-8 py-2.5 rounded-xl shadow-md transition-colors flex items-center space-x-1"
            >
              <Save className="w-4 h-4" />
              <span>{activeTab === 'edit' ? 'Update Document' : 'Save Document'}</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
};

export default AdminPanel;
