import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  FaBrain, FaLeaf, FaSearch, FaHeart, FaShieldAlt,
  FaChartLine, FaArrowRight, FaStar, FaCheckCircle,
  FaExclamationTriangle, FaInfoCircle, FaQuoteLeft,
  FaFire, FaWind, FaWater, FaYinYang, FaUserMd,
  FaSeedling, FaAppleAlt, FaDumbbell, FaMoon, FaSun,
  FaChevronDown, FaChevronUp, FaPlay, FaRedo
} from 'react-icons/fa';
import { MdHealthAndSafety, MdBiotech, MdLocalHospital } from 'react-icons/md';
import { GiHerbsBundle, GiMeditation, GiStomach } from 'react-icons/gi';

import {
  MOCK_SYMPTOMS, ASSESSMENT_QUESTIONS, DOSHA_PROFILES, AYURVEDIC_REMEDIES,
  MOCK_ANALYSIS_RESULTS, MOCK_HEALTH_INSIGHTS, HEALTH_METRICS_DATA,
  SYMPTOM_CHECKER_FAQS, SYMPTOM_CHECKER_TESTIMONIALS,
  Symptom, AnalysisResult, DoshaProfile
} from '../data/symptomCheckerData';

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ─── DOSHA COLORS ─────────────────────────────────────────────────────────────
const DOSHA_COLOR_MAP: Record<string, string> = {
  Vata: '#7C3AED',
  Pitta: '#DC2626',
  Kapha: '#059669',
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard: React.FC<{ icon: React.ReactNode; value: string; label: string; color: string; bg: string }> = ({
  icon, value, label, color, bg
}) => (
  <motion.div
    variants={fadeInUp}
    className="flex flex-col items-center gap-2 p-5 rounded-2xl shadow-sm border border-white/60 backdrop-blur-sm"
    style={{ background: bg }}
  >
    <div className="text-2xl" style={{ color }}>{icon}</div>
    <span className="text-2xl font-black" style={{ color }}>{value}</span>
    <span className="text-xs text-gray-500 font-semibold text-center">{label}</span>
  </motion.div>
);

// ─── SYMPTOM PILL ─────────────────────────────────────────────────────────────
const SymptomPill: React.FC<{
  symptom: Symptom;
  selected: boolean;
  onClick: () => void;
}> = ({ symptom, selected, onClick }) => {
  const severityColor = symptom.severity === 'severe' ? '#DC2626' : symptom.severity === 'moderate' ? '#D4AF37' : '#2E7D32';
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${
        selected
          ? 'text-white shadow-md'
          : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-300'
      }`}
      style={selected ? { background: severityColor, borderColor: severityColor } : {}}
    >
      <span>{symptom.icon}</span>
      <span>{symptom.name}</span>
      {selected && <FaCheckCircle className="text-white/80 text-xs" />}
    </motion.button>
  );
};

// ─── ASSESSMENT PROGRESS BAR ──────────────────────────────────────────────────
const AssessmentProgress: React.FC<{ step: number; total: number }> = ({ step, total }) => (
  <div className="w-full mb-6">
    <div className="flex justify-between items-center mb-2">
      <span className="text-xs font-semibold text-emerald-700">Step {step} of {total}</span>
      <span className="text-xs text-gray-400">{Math.round((step / total) * 100)}% Complete</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2">
      <motion.div
        className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
        initial={{ width: 0 }}
        animate={{ width: `${(step / total) * 100}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
    <div className="flex mt-2 gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-1 rounded-full transition-all duration-300 ${
            i < step ? 'bg-emerald-500' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  </div>
);

// ─── DOSHA GAUGE ──────────────────────────────────────────────────────────────
const DoshaGauge: React.FC<{ dosha: DoshaProfile; index: number }> = ({ dosha, index }) => {
  const icons: Record<string, React.ReactNode> = {
    Vata: <FaWind />,
    Pitta: <FaFire />,
    Kapha: <FaWater />,
  };
  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg shadow"
          style={{ background: `linear-gradient(135deg, ${dosha.color}, ${dosha.color}99)` }}
        >
          {icons[dosha.dosha]}
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-base">{dosha.dosha} Dosha</h3>
          <p className="text-xs text-gray-400">{dosha.dosha === 'Vata' ? 'Air + Space' : dosha.dosha === 'Pitta' ? 'Fire + Water' : 'Earth + Water'}</p>
        </div>
        <span className="ml-auto font-black text-xl" style={{ color: dosha.color }}>{dosha.percentage}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
        <motion.div
          className="h-3 rounded-full"
          style={{ background: `linear-gradient(90deg, ${dosha.color}, ${dosha.color}88)` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${dosha.percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: index * 0.1 }}
        />
      </div>
      <p className="text-xs text-gray-500 mb-3">{dosha.description}</p>
      <div className="flex flex-wrap gap-1">
        {dosha.primaryTraits.map(trait => (
          <span key={trait} className="px-2 py-0.5 rounded-lg text-[10px] font-semibold text-white"
            style={{ background: dosha.color }}>{trait}</span>
        ))}
      </div>
    </motion.div>
  );
};

// ─── REMEDY CARD ──────────────────────────────────────────────────────────────
const RemedyCard: React.FC<{ remedy: typeof AYURVEDIC_REMEDIES[0]; index: number }> = ({ remedy, index }) => {
  const typeColors: Record<string, string> = {
    herb: '#2E7D32', diet: '#D4AF37', therapy: '#7C3AED', lifestyle: '#059669', yoga: '#2196F3',
  };
  const urgencyBg: Record<string, string> = {
    preventive: 'bg-blue-50 text-blue-700', supportive: 'bg-amber-50 text-amber-700', therapeutic: 'bg-emerald-50 text-emerald-700',
  };
  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      whileHover={{ y: -4, shadow: '0 20px 40px rgba(0,0,0,0.12)' }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col gap-3"
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{remedy.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-gray-800 text-sm">{remedy.name}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${urgencyBg[remedy.urgency]}`}>
              {remedy.urgency}
            </span>
          </div>
          <span className="text-[11px] font-semibold capitalize px-2 py-0.5 rounded-md text-white inline-block mt-1"
            style={{ background: typeColors[remedy.type] }}>{remedy.type}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <FaStar className="text-amber-400 text-xs" />
          <span className="text-xs font-bold text-gray-600">{remedy.rating}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500">{remedy.description}</p>
      <ul className="space-y-1">
        {remedy.benefits.slice(0, 3).map(b => (
          <li key={b} className="flex items-center gap-1.5 text-xs text-gray-600">
            <FaCheckCircle className="text-emerald-500 shrink-0" />
            {b}
          </li>
        ))}
      </ul>
      {remedy.dosage && (
        <div className="bg-emerald-50 rounded-xl p-2.5">
          <p className="text-[11px] text-emerald-700 font-semibold">📏 Dosage: {remedy.dosage}</p>
          {remedy.timing && <p className="text-[11px] text-emerald-600">⏰ {remedy.timing}</p>}
        </div>
      )}
      <div className="flex flex-wrap gap-1">
        {remedy.forDoshas.map(d => (
          <span key={d} className="text-[10px] px-2 py-0.5 rounded-lg text-white font-semibold"
            style={{ background: DOSHA_COLOR_MAP[d] }}>{d}</span>
        ))}
      </div>
    </motion.div>
  );
};

// ─── ANALYSIS RESULT PANEL ────────────────────────────────────────────────────
const AnalysisResultPanel: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const [tab, setTab] = useState<'overview' | 'diet' | 'lifestyle' | 'remedies'>('overview');
  const severityConfig = {
    low: { color: '#059669', bg: 'bg-emerald-50', label: 'Mild Concern', icon: <FaCheckCircle /> },
    medium: { color: '#D4AF37', bg: 'bg-amber-50', label: 'Moderate Concern', icon: <FaExclamationTriangle /> },
    high: { color: '#DC2626', bg: 'bg-red-50', label: 'High Priority', icon: <FaExclamationTriangle /> },
  };
  const cfg = severityConfig[result.severity];
  const tabs: { key: typeof tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <FaBrain /> },
    { key: 'diet', label: 'Diet Plan', icon: <FaAppleAlt /> },
    { key: 'lifestyle', label: 'Lifestyle', icon: <FaDumbbell /> },
    { key: 'remedies', label: 'Remedies', icon: <GiHerbsBundle /> },
  ];
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <FaYinYang className="text-white text-xl" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-gray-800">{result.condition}</h2>
            <p className="text-sm text-emerald-700 font-semibold italic">{result.ayurvedicName}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${cfg.bg}`} style={{ color: cfg.color }}>
                {cfg.icon} {cfg.label}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-700">
                {result.probability}% Probability Match
              </div>
              {result.doshaImbalance.map(d => (
                <span key={d} className="text-xs px-2 py-1 rounded-full text-white font-bold"
                  style={{ background: DOSHA_COLOR_MAP[d] }}>{d} Imbalanced</span>
              ))}
            </div>
          </div>
        </div>
        {/* Probability bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>AI Confidence Score</span>
            <span className="font-bold">{result.probability}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
              initial={{ width: 0 }}
              animate={{ width: `${result.probability}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
              tab === t.key
                ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-xs">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {tab === 'overview' && (
            <div className="space-y-5">
              <p className="text-sm text-gray-600 leading-relaxed">{result.description}</p>
              <div>
                <h4 className="font-bold text-gray-700 text-sm mb-2">Matching Symptoms</h4>
                <div className="flex flex-wrap gap-2">
                  {result.symptoms.map(s => (
                    <span key={s} className="px-3 py-1 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-100">{s}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-blue-700 mb-1">⏱️ Recovery Timeline</p>
                  <p className="text-sm font-semibold text-blue-800">{result.recoveryTime}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-amber-700 mb-1">🏥 Doctor Consultation</p>
                  <p className="text-xs text-amber-800">{result.whenToSeeDoctor}</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                  <FaInfoCircle /> This analysis is based on classical Ayurvedic principles and is for educational purposes only. Please consult a qualified Vaidya for personalized treatment.
                </p>
              </div>
            </div>
          )}
          {tab === 'diet' && (
            <div className="space-y-3">
              <h4 className="font-bold text-gray-700 text-sm mb-3">Ayurvedic Diet Protocol</h4>
              {result.dietPlan.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl"
                >
                  <FaLeaf className="text-emerald-500 shrink-0 mt-0.5 text-sm" />
                  <p className="text-sm text-gray-700">{item}</p>
                </motion.div>
              ))}
            </div>
          )}
          {tab === 'lifestyle' && (
            <div className="space-y-3">
              <h4 className="font-bold text-gray-700 text-sm mb-3">Lifestyle Transformation Plan</h4>
              {result.lifestyleChanges.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl"
                >
                  <FaDumbbell className="text-purple-500 shrink-0 mt-0.5 text-sm" />
                  <p className="text-sm text-gray-700">{item}</p>
                </motion.div>
              ))}
            </div>
          )}
          {tab === 'remedies' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.remedies.map((r, i) => (
                <RemedyCard key={r.id} remedy={r} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// ─── HEALTH INSIGHT CARD ──────────────────────────────────────────────────────
const HealthInsightCard: React.FC<{ insight: typeof MOCK_HEALTH_INSIGHTS[0] }> = ({ insight }) => {
  const trendConfig = {
    improving: { icon: '📈', color: '#059669', label: 'Improving' },
    stable: { icon: '➡️', color: '#D4AF37', label: 'Stable' },
    declining: { icon: '📉', color: '#DC2626', label: 'Needs Attention' },
  };
  const trend = trendConfig[insight.trend];
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{insight.icon}</span>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{insight.category}</p>
          <h3 className="text-sm font-bold text-gray-800">{insight.title}</h3>
        </div>
        <div className="text-right">
          <span className="text-xl font-black" style={{ color: insight.color }}>{insight.score}</span>
          <span className="text-xs text-gray-400">/100</span>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
        <motion.div
          className="h-2 rounded-full"
          style={{ background: insight.color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${insight.score}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-gray-400">{insight.description}</p>
        <span className="text-[11px] font-bold ml-2" style={{ color: trend.color }}>
          {trend.icon} {trend.label}
        </span>
      </div>
    </motion.div>
  );
};

// ─── FAQ ITEM ─────────────────────────────────────────────────────────────────
const FAQItem: React.FC<{ faq: typeof SYMPTOM_CHECKER_FAQS[0]; index: number }> = ({ faq, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-emerald-50/50 transition-colors"
      >
        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
          <span className="text-emerald-700 text-xs font-black">{index + 1}</span>
        </div>
        <p className="flex-1 font-semibold text-gray-800 text-sm">{faq.question}</p>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FaChevronDown className="text-emerald-500 text-sm shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-5 pb-5 ml-11">
              <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── MAIN PAGE COMPONENT ──────────────────────────────────────────────────────
const SymptomChecker: React.FC = () => {
  // Section refs for scroll navigation
  const assessmentRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Assessment state
  const [phase, setPhase] = useState<'landing' | 'symptoms' | 'assessment' | 'results'>('landing');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [symptomSearch, setSymptomSearch] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
  const [selectedResult, setSelectedResult] = useState<AnalysisResult>(MOCK_ANALYSIS_RESULTS[0]);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [scaleValue, setScaleValue] = useState(5);

  const { register, watch } = useForm();
  const textAnswer = watch('textAnswer');

  // Categories for filter tabs
  const categories = ['All', 'Digestive', 'Respiratory', 'Skin', 'Mental/Emotional', 'Musculoskeletal', 'Sleep', 'Energy'];

  // Filtered symptoms
  const filteredSymptoms = MOCK_SYMPTOMS.filter(s => {
    const matchCat = activeCategory === 'All' || s.category === activeCategory;
    const matchSearch = s.name.toLowerCase().includes(symptomSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleSymptom = useCallback((id: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  }, []);

  const handleMultiAnswer = (questionId: string, value: string) => {
    setAnswers(prev => {
      const current = (prev[questionId] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [questionId]: updated };
    });
  };

  const handleSingleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < ASSESSMENT_QUESTIONS.length) {
      setCurrentStep(s => s + 1);
    } else {
      runAnalysis();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  const runAnalysis = () => {
    setAnalysisLoading(true);
    setTimeout(() => {
      // Determine result based on answers
      const dosha = answers['q4'];
      let result = MOCK_ANALYSIS_RESULTS[0];
      if (dosha === 'pitta') result = MOCK_ANALYSIS_RESULTS[1];
      else if (dosha === 'kapha') result = MOCK_ANALYSIS_RESULTS[2];
      setSelectedResult(result);
      setAnalysisLoading(false);
      setPhase('results');
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, 2800);
  };

  const startAssessment = () => {
    setPhase('symptoms');
    setTimeout(() => assessmentRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const proceedToQuestions = () => {
    setPhase('assessment');
    setCurrentStep(1);
  };

  const resetAll = () => {
    setPhase('landing');
    setSelectedSymptoms([]);
    setAnswers({});
    setCurrentStep(1);
    setScaleValue(5);
  };

  const currentQuestion = ASSESSMENT_QUESTIONS[currentStep - 1];

  // ─── RADAR CHART DATA ───────────────────────────────────────────────────────
  const radarData = DOSHA_PROFILES.map(d => ({
    dosha: d.dosha, value: d.percentage,
  }));

  // ─── DOSHA PIE DATA ─────────────────────────────────────────────────────────
  const pieData = DOSHA_PROFILES.map(d => ({
    name: d.dosha, value: d.percentage, color: d.color
  }));

  return (
    <div className="min-h-screen bg-[#F8FFF8] font-sans">

      {/* ─── HERO SECTION ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A3D1F] via-[#1B5E35] to-[#2E7D32] text-white">
        {/* Animated BG blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #81C784, transparent)' }}
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #D4AF37, transparent)' }}
            animate={{ scale: [1.1, 1, 1.1], rotate: [0, -60, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #FFFFFF, transparent)' }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 1px, transparent 40px)' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col lg:flex-row items-center gap-12"
          >
            {/* Left Text */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <MdBiotech className="text-emerald-300 text-lg" />
                <span className="text-sm font-semibold text-emerald-100">AI-Powered Ayurvedic Health Intelligence</span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-5">
                AI Symptom Checker &
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#81C784] to-[#D4AF37]"> Smart Health</span>
                <br />Assessment Center
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-emerald-100 text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Harness 5,000 years of Ayurvedic wisdom combined with modern AI to understand your Dosha imbalances, analyze symptoms and get personalized healing protocols.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 20px 40px rgba(212,175,55,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={startAssessment}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-white px-8 py-4 rounded-2xl font-black text-base shadow-xl"
                >
                  <FaPlay /> Start Free Assessment
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-base"
                >
                  <FaChartLine /> View Sample Results
                </motion.button>
              </motion.div>
              {/* Trust Badges */}
              <motion.div variants={fadeInUp} className="flex items-center gap-6 mt-8 justify-center lg:justify-start flex-wrap">
                {[
                  { icon: <FaUserMd />, label: '50K+ Assessments' },
                  { icon: <FaShieldAlt />, label: '100% Private' },
                  { icon: <GiHerbsBundle />, label: 'Vedic Wisdom' },
                  { icon: <FaStar />, label: '4.9★ Rated' },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-emerald-200 text-sm">
                    <span className="text-emerald-300">{badge.icon}</span>
                    <span className="font-semibold">{badge.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Visual - Dosha Radar */}
            <motion.div variants={slideInRight} className="flex-shrink-0 w-full max-w-sm lg:max-w-md">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
                <h3 className="text-center font-bold text-white mb-1 text-sm">Live Dosha Intelligence</h3>
                <p className="text-center text-emerald-200 text-xs mb-4">Real-time balance visualization</p>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.2)" />
                    <PolarAngleAxis dataKey="dosha" tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 700 }} />
                    <Radar name="Dosha" dataKey="value" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {DOSHA_PROFILES.map(d => (
                    <div key={d.dosha} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-xs text-white/80 font-semibold">{d.dosha} {d.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Hero Stats Bar */}
        <div className="relative border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            >
              {[
                { value: '36+', label: 'Symptom Categories' },
                { value: '8-Step', label: 'Deep Assessment' },
                { value: '3 Doshas', label: 'Comprehensive Analysis' },
                { value: '5000+', label: 'Years of Wisdom' },
              ].map((stat, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <p className="text-2xl font-black text-[#D4AF37]">{stat.value}</p>
                  <p className="text-xs text-emerald-200 font-semibold">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-2 mb-4 border border-emerald-100">
              <FaLeaf className="text-emerald-600" />
              <span className="text-emerald-700 font-semibold text-sm">Simple 4-Phase Process</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              How Our AI Assessment Works
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-500 max-w-2xl mx-auto">
              A guided journey combining ancient Ayurvedic diagnostic methods with modern AI to deliver personalized health insights.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { step: '01', icon: <FaSearch className="text-3xl" />, title: 'Select Symptoms', desc: 'Browse and select your current symptoms from our comprehensive Ayurvedic symptom library', color: '#2196F3', bg: '#EFF6FF' },
              { step: '02', icon: <FaBrain className="text-3xl" />, title: 'Deep Assessment', desc: 'Answer 8 targeted questions about your constitution, lifestyle and health patterns', color: '#7C3AED', bg: '#F5F3FF' },
              { step: '03', icon: <MdBiotech className="text-3xl" />, title: 'AI Analysis', desc: 'Our Ayurvedic AI engine cross-references your data with classical diagnostic texts', color: '#D4AF37', bg: '#FFFBEB' },
              { step: '04', icon: <GiHerbsBundle className="text-3xl" />, title: 'Get Your Protocol', desc: 'Receive a complete personalized healing protocol with diet, herbs, therapy and lifestyle changes', color: '#2E7D32', bg: '#F0FDF4' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="relative text-center p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                style={{ background: item.bg }}
              >
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                  <span className="text-[10px] font-black text-gray-500">{item.step}</span>
                </div>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md"
                  style={{ background: item.color, color: '#fff' }}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <FaArrowRight className="text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── SYMPTOM SELECTOR ──────────────────────────────────────────────── */}
      <section ref={assessmentRef} className="py-16 bg-[#F8FFF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-10 text-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-emerald-100 rounded-full px-4 py-2 mb-4">
              <GiStomach className="text-emerald-700" />
              <span className="text-emerald-700 font-semibold text-sm">Step 1 of 4 — Symptom Mapping</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              What Symptoms Are You Experiencing?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-500 max-w-xl mx-auto text-sm">
              Select all relevant symptoms. Our AI cross-references these with classical Ayurvedic Nidana (diagnostic) principles.
            </motion.p>
          </motion.div>

          {/* Search + Category Filter */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search symptoms..."
                value={symptomSearch}
                onChange={e => setSymptomSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:border-emerald-400 text-sm font-medium"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    activeCategory === cat
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Symptoms Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-wrap gap-3 mb-8"
          >
            <AnimatePresence>
              {filteredSymptoms.map(symptom => (
                <motion.div
                  key={symptom.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <SymptomPill
                    symptom={symptom}
                    selected={selectedSymptoms.includes(symptom.id)}
                    onClick={() => toggleSymptom(symptom.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Selected Symptoms Summary */}
          <AnimatePresence>
            {selectedSymptoms.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-emerald-600 rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center gap-4 shadow-xl"
              >
                <div className="flex-1">
                  <p className="font-bold text-lg">{selectedSymptoms.length} Symptom{selectedSymptoms.length > 1 ? 's' : ''} Selected</p>
                  <p className="text-emerald-100 text-sm">
                    {MOCK_SYMPTOMS.filter(s => selectedSymptoms.includes(s.id)).map(s => s.name).join(' · ')}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={proceedToQuestions}
                  className="flex items-center gap-2 bg-white text-emerald-700 font-black px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all whitespace-nowrap"
                >
                  Continue to Assessment <FaArrowRight />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip option */}
          <div className="text-center mt-4">
            <button
              onClick={proceedToQuestions}
              className="text-sm text-emerald-600 hover:text-emerald-800 font-semibold underline underline-offset-4"
            >
              Skip symptom selection → Go directly to questionnaire
            </button>
          </div>
        </div>
      </section>

      {/* ─── ASSESSMENT QUESTIONNAIRE ──────────────────────────────────────── */}
      {(phase === 'assessment' || phase === 'results') && (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {phase === 'assessment' && !analysisLoading && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-purple-50 rounded-full px-4 py-2 mb-4 border border-purple-100">
                    <FaBrain className="text-purple-600" />
                    <span className="text-purple-700 font-semibold text-sm">Step 2 of 4 — Deep Assessment</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900">Ayurvedic Health Questionnaire</h2>
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8">
                  <AssessmentProgress step={currentStep} total={ASSESSMENT_QUESTIONS.length} />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.35 }}
                    >
                      <h3 className="text-xl font-black text-gray-800 mb-1">{currentQuestion.question}</h3>
                      <p className="text-sm text-gray-400 mb-6">{currentQuestion.subtitle}</p>

                      {/* Single / Multi Options */}
                      {(currentQuestion.type === 'single' || currentQuestion.type === 'multi') && (
                        <div className={`grid gap-3 ${currentQuestion.options && currentQuestion.options.length > 5 ? 'grid-cols-2 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
                          {currentQuestion.options?.map(opt => {
                            const isSelected = currentQuestion.type === 'single'
                              ? answers[currentQuestion.id] === opt.value
                              : ((answers[currentQuestion.id] as string[]) || []).includes(opt.value);
                            return (
                              <motion.button
                                key={opt.value}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() =>
                                  currentQuestion.type === 'single'
                                    ? handleSingleAnswer(currentQuestion.id, opt.value)
                                    : handleMultiAnswer(currentQuestion.id, opt.value)
                                }
                                className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                                  isSelected
                                    ? 'border-emerald-500 bg-emerald-50'
                                    : 'border-gray-100 bg-gray-50 hover:border-emerald-200 hover:bg-emerald-50/30'
                                }`}
                              >
                                <span className="text-xl">{opt.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <p className={`font-semibold text-sm ${isSelected ? 'text-emerald-800' : 'text-gray-700'}`}>{opt.label}</p>
                                  {opt.description && <p className="text-xs text-gray-400 truncate">{opt.description}</p>}
                                </div>
                                {isSelected && <FaCheckCircle className="text-emerald-500 shrink-0 text-base" />}
                              </motion.button>
                            );
                          })}
                        </div>
                      )}

                      {/* Scale */}
                      {currentQuestion.type === 'scale' && (
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm text-gray-500 font-semibold">
                            <span>😴 Very Low</span>
                            <span className="text-2xl font-black text-emerald-600">{scaleValue}/10</span>
                            <span>⚡ Very High</span>
                          </div>
                          <input
                            type="range"
                            min={1} max={10}
                            value={scaleValue}
                            onChange={e => {
                              const v = parseInt(e.target.value);
                              setScaleValue(v);
                              setAnswers(prev => ({ ...prev, [currentQuestion.id]: v }));
                            }}
                            className="w-full accent-emerald-600 h-3 cursor-pointer"
                          />
                          <div className="grid grid-cols-10 gap-1">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <div
                                key={i}
                                className={`h-8 rounded-lg transition-all duration-200 ${i < scaleValue ? 'bg-emerald-500' : 'bg-gray-100'}`}
                              />
                            ))}
                          </div>
                          <p className="text-center text-sm text-gray-500">
                            {scaleValue <= 3 ? '😰 Very low energy — significant concern' : scaleValue <= 6 ? '😐 Moderate energy level' : '😊 Good energy level'}
                          </p>
                        </div>
                      )}

                      {/* Text */}
                      {currentQuestion.type === 'text' && (
                        <textarea
                          {...register('textAnswer')}
                          placeholder={currentQuestion.placeholder}
                          rows={4}
                          className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-emerald-400 resize-none text-gray-700 placeholder:text-gray-400"
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
                    <button
                      onClick={handlePrevStep}
                      disabled={currentStep === 1}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      ← Previous
                    </button>
                    <span className="text-xs text-gray-400">{currentStep}/{ASSESSMENT_QUESTIONS.length}</span>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleNextStep}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 shadow transition-all"
                    >
                      {currentStep === ASSESSMENT_QUESTIONS.length ? (
                        <><FaBrain /> Analyze Now</>
                      ) : (
                        <>Next Step <FaArrowRight /></>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LOADING ANALYSIS */}
            {analysisLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="relative inline-block mb-8">
                  <motion.div
                    className="w-24 h-24 border-4 border-emerald-200 border-t-emerald-600 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaYinYang className="text-emerald-600 text-2xl" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-3">Analyzing Your Health Profile...</h3>
                <p className="text-gray-400 mb-6">Cross-referencing with Charaka Samhita & Ashtanga Hridayam</p>
                <div className="max-w-sm mx-auto space-y-3">
                  {['Mapping symptom patterns to Dosha imbalances...', 'Calculating Prakriti-Vikruti correlation...', 'Generating personalized Ayurvedic protocol...'].map((text, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.8 + 0.3 }}
                      className="flex items-center gap-3 text-sm text-gray-500 bg-emerald-50 rounded-xl p-3"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-4 h-4 border-2 border-emerald-400 border-t-emerald-700 rounded-full shrink-0"
                      />
                      {text}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* ─── ANALYSIS RESULTS ──────────────────────────────────────────────── */}
      <section ref={resultsRef} className="py-16 bg-[#F8FFF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-10 text-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-amber-50 rounded-full px-4 py-2 mb-4 border border-amber-100">
              <FaChartLine className="text-amber-600" />
              <span className="text-amber-700 font-semibold text-sm">
                {phase === 'results' ? 'Your Personalized Analysis Report' : 'Sample Analysis Preview'}
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              {phase === 'results' ? 'Your AI Health Analysis Results' : 'See What Your Results Look Like'}
            </motion.h2>
            {phase === 'results' && (
              <motion.button
                variants={fadeInUp}
                whileHover={{ scale: 1.04 }}
                onClick={resetAll}
                className="mt-2 inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-800 font-semibold underline underline-offset-4"
              >
                <FaRedo /> Take Assessment Again
              </motion.button>
            )}
          </motion.div>

          {/* Result Selector Tabs */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide"
          >
            {MOCK_ANALYSIS_RESULTS.map(result => (
              <button
                key={result.id}
                onClick={() => setSelectedResult(result)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedResult.id === result.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                }`}
              >
                {result.doshaImbalance.map(d => (
                  <span key={d} className="w-2 h-2 rounded-full" style={{ background: DOSHA_COLOR_MAP[d] }} />
                ))}
                {result.doshaImbalance.join('+')} Pattern
                <span className="text-xs opacity-70">{result.probability}%</span>
              </button>
            ))}
          </motion.div>

          {/* Main Analysis Result */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mb-10"
          >
            <AnalysisResultPanel result={selectedResult} />
          </motion.div>

          {/* Dosha Distribution + Health Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Dosha Breakdown Charts */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="font-black text-gray-800 text-lg mb-1">Dosha Composition Analysis</h3>
              <p className="text-xs text-gray-400 mb-5">Your natural constitution breakdown</p>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3 w-full">
                  {DOSHA_PROFILES.map(d => (
                    <div key={d.dosha} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
                      <span className="text-sm font-semibold text-gray-700 flex-1">{d.dosha}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${d.percentage}%`, background: d.color }} />
                      </div>
                      <span className="text-sm font-black text-gray-700 w-10 text-right">{d.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Health Metrics Trend */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="font-black text-gray-800 text-lg mb-1">Projected Health Recovery</h3>
              <p className="text-xs text-gray-400 mb-5">Expected improvement over 8 weeks with protocol</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={HEALTH_METRICS_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="energy" stroke="#2E7D32" fill="#2E7D3220" strokeWidth={2} name="Energy" />
                  <Area type="monotone" dataKey="sleep" stroke="#7C3AED" fill="#7C3AED10" strokeWidth={2} name="Sleep" />
                  <Area type="monotone" dataKey="immunity" stroke="#D4AF37" fill="#D4AF3710" strokeWidth={2} name="Immunity" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-2 flex-wrap justify-center">
                {[{ label: 'Energy', color: '#2E7D32' }, { label: 'Sleep', color: '#7C3AED' }, { label: 'Immunity', color: '#D4AF37' }].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <div className="w-3 h-0.5 rounded" style={{ background: l.color }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Health Insights Grid */}
          <div className="mb-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="mb-6"
            >
              <motion.h3 variants={fadeInUp} className="text-2xl font-black text-gray-900 mb-1">Your Ayurvedic Health Metrics</motion.h3>
              <motion.p variants={fadeInUp} className="text-gray-500 text-sm">Key vitality indicators from Ayurvedic diagnostic framework</motion.p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4"
            >
              {MOCK_HEALTH_INSIGHTS.map((insight, i) => (
                <HealthInsightCard key={insight.id} insight={insight} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── DOSHA PROFILES SECTION ─────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-violet-50 rounded-full px-4 py-2 mb-4 border border-violet-100">
              <FaYinYang className="text-violet-600" />
              <span className="text-violet-700 font-semibold text-sm">Ayurvedic Tridosha System</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Understanding Your Doshas
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-500 max-w-2xl mx-auto text-sm">
              The three Doshas are the fundamental energetic forces that govern all physical and mental processes. Understanding them is the foundation of Ayurvedic medicine.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10"
          >
            {DOSHA_PROFILES.map((dosha, i) => (
              <DoshaGauge key={dosha.dosha} dosha={dosha} index={i} />
            ))}
          </motion.div>

          {/* Dosha Detail Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {DOSHA_PROFILES.map((dosha, i) => {
              const icons = { Vata: <FaWind />, Pitta: <FaFire />, Kapha: <FaWater /> };
              return (
                <motion.div
                  key={dosha.dosha}
                  variants={fadeInUp}
                  className="rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${dosha.gradient} p-6 text-white`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                        {icons[dosha.dosha]}
                      </div>
                      <div>
                        <h3 className="font-black text-xl">{dosha.dosha} Dosha</h3>
                        <p className="text-white/80 text-xs">{dosha.dosha === 'Vata' ? '🌬️ Air + Space' : dosha.dosha === 'Pitta' ? '🔥 Fire + Water' : '🌊 Earth + Water'}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {dosha.imbalanceSymptoms.slice(0, 4).map(s => (
                        <span key={s} className="text-[10px] bg-white/20 px-2 py-0.5 rounded-lg font-semibold">{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="bg-white p-5 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Key Herbs</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {dosha.herbs.map(h => (
                          <span key={h} className="text-xs px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">{h}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Diet Guidelines</h4>
                      <ul className="space-y-1">
                        {dosha.diet.slice(0, 3).map(d => (
                          <li key={d} className="flex items-center gap-2 text-xs text-gray-600">
                            <FaLeaf className="text-emerald-400 shrink-0" /> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Lifestyle Tips</h4>
                      <ul className="space-y-1">
                        {dosha.lifestyle.slice(0, 3).map(l => (
                          <li key={l} className="flex items-center gap-2 text-xs text-gray-600">
                            <FaCheckCircle className="text-blue-400 shrink-0" /> {l}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── ALL REMEDIES SECTION ────────────────────────────────────────────── */}
      <section className="py-16 bg-[#F8FFF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-10"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-2 mb-4 border border-emerald-100">
              <GiHerbsBundle className="text-emerald-700 text-base" />
              <span className="text-emerald-700 font-semibold text-sm">Ayurvedic Healing Arsenal</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Proven Ayurvedic Remedies & Protocols
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-500 max-w-2xl mx-auto text-sm">
              Time-tested healing modalities from classical Ayurveda, curated for modern lifestyles. Each remedy is backed by thousands of years of empirical evidence.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {AYURVEDIC_REMEDIES.map((remedy, i) => (
              <RemedyCard key={remedy.id} remedy={remedy} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-br from-[#0A3D1F] to-[#1B5E35] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-black mb-3">
              Real People, Real Healing
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-emerald-200 max-w-xl mx-auto text-sm">
              Thousands have transformed their health using our AI-powered Ayurvedic assessment
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {SYMPTOM_CHECKER_TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.id}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-5 hover:bg-white/15 transition-all"
              >
                <FaQuoteLeft className="text-[#D4AF37] text-2xl mb-3" />
                <p className="text-sm text-white/90 leading-relaxed mb-4">"{t.result}"</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{t.avatar}</span>
                  <div>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    <p className="text-[11px] text-emerald-300">{t.age} yrs · {t.location}</p>
                    <p className="text-[10px] text-amber-300 font-semibold">{t.condition}</p>
                  </div>
                  <div className="ml-auto flex">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <FaStar key={j} className="text-amber-400 text-xs" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ SECTION ─────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-10"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Frequently Asked Questions
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-500 text-sm">
              Everything you need to know about our AI Ayurvedic Symptom Assessment
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-3"
          >
            {SYMPTOM_CHECKER_FAQS.map((faq, i) => (
              <FAQItem key={faq.id} faq={faq} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA SECTION ─────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-[#D4AF37] via-amber-500 to-orange-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-5xl mb-5">🙏</motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-white mb-4">
              Begin Your Ayurvedic Healing Journey
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">
              Get your personalized Dosha analysis and healing protocol in under 8 minutes. Ancient wisdom meets modern AI.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.97 }}
                onClick={startAssessment}
                className="flex items-center justify-center gap-3 bg-white text-amber-700 font-black px-10 py-4 rounded-2xl text-lg shadow-2xl"
              >
                <FaPlay /> Start Free Assessment
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-3 bg-amber-700/30 backdrop-blur text-white border border-white/30 font-bold px-10 py-4 rounded-2xl text-base"
              >
                <MdLocalHospital /> Consult an Ayurvedic Doctor
              </motion.button>
            </motion.div>
            <motion.p variants={fadeInUp} className="text-amber-100 text-xs mt-5 opacity-80">
              ⚠️ This tool provides educational information only. Not a substitute for professional medical advice.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SymptomChecker;
