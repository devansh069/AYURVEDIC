import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Calendar, 
  Activity, 
  FileText, 
  Compass, 
  Brain, 
  Bell, 
  User, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Send 
} from 'lucide-react';

// APIs & Services
import patientApi, { PatientDashboardData } from '../services/patientApi';
import patientAppointmentApi from '../services/patientAppointmentApi';
import patientRecoveryApi from '../services/patientRecoveryApi';
import patientNotificationApi from '../services/patientNotificationApi';
import { 
  Patient, 
  PatientDashboardAppointment, 
  RecoveryProgress, 
  MedicalRecord, 
  Notification, 
  HealthGoal, 
  WellnessMetric, 
  AIRecommendation 
} from '../types';

// Layout & Modular Components
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import AppointmentCard from '../components/dashboard/AppointmentCard';
import RecoveryChart from '../components/dashboard/RecoveryChart';
import WellnessCard from '../components/dashboard/WellnessCard';
import MedicalRecordCard from '../components/dashboard/MedicalRecordCard';
import AIRecommendationCard from '../components/dashboard/AIRecommendationCard';
import NotificationCard from '../components/dashboard/NotificationCard';
import HealthGoalCard from '../components/dashboard/HealthGoalCard';
import CalendarWidget from '../components/dashboard/CalendarWidget';
import QuickActionPanel from '../components/dashboard/QuickActionPanel';
import LoadingSkeleton from '../components/dashboard/LoadingSkeleton';
import ErrorFallback from '../components/dashboard/ErrorFallback';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'patient';
  text: string;
  time: string;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Core Data States
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<PatientDashboardAppointment[]>([]);
  const [recovery, setRecovery] = useState<RecoveryProgress | null>(null);
  const [weeklyMetrics, setWeeklyMetrics] = useState<any[]>([]);
  const [monthlyMetrics, setMonthlyMetrics] = useState<any[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [wellness, setWellness] = useState<WellnessMetric | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation | null>(null);
  const [healthGoals, setHealthGoals] = useState<HealthGoal[]>([]);

  // Recovery Log UI States
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logType, setLogType] = useState<'weekly' | 'monthly'>('weekly');
  const [logName, setLogName] = useState('');
  const [logProgress, setLogProgress] = useState(70);
  const [logTarget, setLogTarget] = useState(80);
  const [logSubmitting, setLogSubmitting] = useState(false);
  const [logError, setLogError] = useState<string | null>(null);

  // UX Control States
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'dashboard');
  const [isUploading, setIsUploading] = useState(false);

  // AI Assistant Chat States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Namaste Priyanshi. I am your Vaidya AI Assistant. I see we are balancing a Pitta-Kapha dosha today. How can I assist you with your PCOS management, diet plans, or herbal decoctions?',
      time: '02:52 PM'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [
          dashboardRes,
          appointmentsRes,
          recoveryRes,
          notificationsRes
        ] = await Promise.all([
          patientApi.getPatientDashboard(),
          patientAppointmentApi.getAppointments(),
          patientRecoveryApi.getRecoveryProgress(),
          patientNotificationApi.getNotifications()
        ]);

        if (dashboardRes.data) {
          setPatient(dashboardRes.data.profile);
          setWellness(dashboardRes.data.wellness);
          setAiRecommendations(dashboardRes.data.aiRecommendations);
          setHealthGoals(dashboardRes.data.healthGoals);
          setRecords(dashboardRes.data.records);
          setAppointments(appointmentsRes.data);
          setRecovery(recoveryRes.data);
          setWeeklyMetrics(recoveryRes.data.weeklyMetrics || []);
          setMonthlyMetrics(recoveryRes.data.monthlyMetrics || []);
          setNotifications(notificationsRes.data);

          setIsFallback(
            dashboardRes.isFallback ||
            appointmentsRes.isFallback ||
            recoveryRes.isFallback ||
            notificationsRes.isFallback
          );

          // Fetch chat messages from backend
          try {
            const active = localStorage.getItem('activeUser');
            let headers = {};
            if (active) {
              const parsed = JSON.parse(active);
              headers = { 'x-user-id': parsed.profile.id, 'x-user-role': parsed.role };
            }
            const chatRes = await axios.get('http://localhost:5174/api/patient/chat', { headers });
            if (chatRes.data && chatRes.data.success) {
              setChatMessages(chatRes.data.data.map((m: any) => ({
                id: m.id,
                sender: m.sender,
                text: m.text,
                time: m.time
              })));
            }
          } catch (chatErr) {
            console.warn('Could not load chat history from backend:', chatErr);
          }
        }
      } catch (err) {
        console.error('Fatal failure fetching patient portal data, using fallbacks.', err);
        setIsFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleUpdateWellness = (updated: WellnessMetric) => {
    setWellness(updated);
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLabel = logName.trim() || (logType === 'weekly' ? 'Wk ' + (weeklyMetrics.length + 1) : 'Month');
    setLogError(null);
    setLogSubmitting(true);
    try {
      const res = await patientRecoveryApi.logProgressPoint({
        chartType: logType,
        name: cleanLabel,
        progress: logProgress,
        target: logTarget
      });
      if (res.success) {
        setIsLogModalOpen(false);
        const recoveryRes = await patientRecoveryApi.getRecoveryProgress();
        if (recoveryRes.data) {
          setRecovery(recoveryRes.data);
          setWeeklyMetrics(recoveryRes.data.weeklyMetrics || []);
          setMonthlyMetrics(recoveryRes.data.monthlyMetrics || []);
        }
        setLogName('');
      } else {
        setLogError(res.error || 'Failed to save progress log.');
      }
    } catch (err: any) {
      setLogError(err.message || 'An error occurred while saving.');
    } finally {
      setLogSubmitting(false);
    }
  };

  // Submit appointment cancellation
  const handleCancelAppointment = async (id: string) => {
    try {
      const res = await patientAppointmentApi.cancelAppointment(id);
      if (res.data) {
        setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
      }
    } catch (err) {
      console.error('Failed to cancel appointment', err);
    }
  };

  // Submit appointment reschedule
  const handleRescheduleAppointment = async (id: string, date: string, time: string) => {
    try {
      const res = await patientAppointmentApi.rescheduleAppointment(id, date, time);
      if (res.data) {
        setAppointments(appointments.map(a => a.id === id ? { ...a, date, time, status: 'Confirmed' } : a));
      }
    } catch (err) {
      console.error('Failed to reschedule appointment', err);
    }
  };

  // Submit medical record upload
  const handleUploadRecord = async (recordData: { title: string; type: 'Report' | 'Prescription' | 'Document'; doctorName: string }) => {
    setIsUploading(true);
    try {
      const res = await patientApi.uploadMedicalRecord(recordData);
      if (res.data) {
        setRecords([res.data, ...records]);
      }
    } catch (err) {
      console.error('Failed to upload record', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Dismiss notification
  const handleDismissNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Chat message submit
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput('');
    setAiTyping(true);

    const tempUserMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'patient',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, tempUserMsg]);

    try {
      const active = localStorage.getItem('activeUser');
      let headers = {};
      if (active) {
        const parsed = JSON.parse(active);
        headers = { 'x-user-id': parsed.profile.id, 'x-user-role': parsed.role };
      }
      const response = await axios.post(
        'http://localhost:5174/api/patient/chat',
        { text: userText },
        { headers }
      );

      if (response.data && response.data.success) {
        const { patientMessage, aiResponse } = response.data.data;
        setChatMessages(prev => [
          ...prev.filter(m => m.id !== tempUserMsg.id),
          { id: patientMessage.id, sender: 'patient', text: patientMessage.text, time: patientMessage.time },
          { id: aiResponse.id, sender: 'ai', text: aiResponse.text, time: aiResponse.time }
        ]);
      }
    } catch (err) {
      console.error('Failed to post message to backend:', err);
      // Fallback response if offline
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: "I've logged your request. To pacify Pitta dosha, focus on sweet cooling substances like coconut water, and practice breathing exercises.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 1000);
    } finally {
      setAiTyping(false);
    }
  };

  if (loading || !patient || !wellness || !aiRecommendations) {
    return <LoadingSkeleton />;
  }

  // Active Count Metrics
  const activeAppointmentsCount = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending').length;
  const completedTreatmentsCount = appointments.filter(a => a.status === 'Completed').length || 1;

  return (
    <DashboardLayout
      patient={patient}
      isFallback={isFallback}
      notifications={notifications}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* 0. SECURE OFFLINE WARNING BANNER */}
      {isFallback && <ErrorFallback message="Using Demo Data" />}

      {/* RENDER ACTIVE TAB VIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Welcome Intro Section */}
          <section className="bg-gradient-to-br from-primary to-emerald-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-primary-light/10">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-accent/25 text-accent px-4 py-1 rounded-full inline-block border border-accent/20">
                  AyurVeda Health Dashboard
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-black leading-tight">
                  Welcome Back, {patient.name}!
                </h2>
                <p className="text-xs text-white/80 max-w-xl font-medium leading-relaxed">
                  Your Prakriti profile is analyzed as <strong className="text-accent">{patient.doshaType}</strong>. Focus on pacifying Kapha blockages to optimize your {patient.healthGoals[0]} goal today.
                </p>
              </div>

              {/* Quick stats badges */}
              <div className="flex flex-wrap gap-3.5 shrink-0 bg-white/10 backdrop-blur-md border border-white/10 p-4.5 rounded-2xl">
                <div className="text-left text-xs">
                  <span className="text-white/60 text-[9px] uppercase font-bold block">Constitutional Dosha</span>
                  <strong className="text-accent text-sm font-black">{patient.doshaType}</strong>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-left text-xs">
                  <span className="text-white/60 text-[9px] uppercase font-bold block">Patient ID</span>
                  <strong className="text-white text-sm font-black">{patient.id}</strong>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-left text-xs">
                  <span className="text-white/60 text-[9px] uppercase font-bold block">Goal Status</span>
                  <strong className="text-white text-sm font-black">72% Progress</strong>
                </div>
              </div>
            </div>
          </section>

          {/* Statistics Count Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Scheduled Consults"
              value={activeAppointmentsCount}
              icon={Calendar}
              color="from-emerald-500/10 to-teal-500/10 text-emerald-700 border-emerald-500/20"
              description="Upcoming clinic visits & video sessions"
              delayIndex={0}
            />
            <StatCard
              title="Active Recovery Program"
              value="1 Program"
              icon={Activity}
              color="from-blue-500/10 to-indigo-500/10 text-blue-700 border-blue-500/20"
              description={recovery?.condition || "PCOS Balancing"}
              delayIndex={1}
            />
            <StatCard
              title="Overall Recovery progress"
              value={`${recovery?.progress || 72}%`}
              icon={Heart}
              color="from-rose-500/10 to-pink-500/10 text-rose-700 border-rose-500/20"
              description="Cumulative outcome score indexes"
              delayIndex={2}
            />
            <StatCard
              title="Stored Health Files"
              value={records.length}
              icon={FileText}
              color="from-amber-500/10 to-yellow-500/10 text-amber-700 border-amber-500/20"
              description="Prescriptions, reports, and logs"
              delayIndex={3}
            />
          </div>

          {/* Main Content Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left 2 Columns */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Appointments List */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>Next Scheduled Consultations</span>
                </div>
                {appointments.slice(0, 2).map((apt) => (
                  <AppointmentCard
                    key={apt.id}
                    appointment={apt}
                    onCancel={handleCancelAppointment}
                    onReschedule={handleRescheduleAppointment}
                  />
                ))}
                {appointments.length > 2 && (
                  <button 
                    onClick={() => setActiveTab('appointments')}
                    className="text-primary hover:text-primary-light text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
                  >
                    <span>View all scheduled visits ({appointments.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Recovery curves */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <Activity className="w-4 h-4 text-accent" />
                    <span>Active Outcome Pathways</span>
                  </div>
                  <button
                    onClick={() => { setIsLogModalOpen(true); setLogName('Wk ' + (weeklyMetrics.length + 1)); }}
                    className="bg-primary/5 hover:bg-primary/10 text-primary border border-primary/10 font-bold text-[9.5px] uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition-all shadow-sm flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Log Recovery Progress</span>
                  </button>
                </div>
                <RecoveryChart
                  weeklyData={weeklyMetrics}
                  monthlyData={monthlyMetrics}
                  condition={recovery?.condition || 'PCOS & Metabolism Care'}
                />
              </div>

              {/* Wellness Summary trackers */}
              <WellnessCard 
                metrics={wellness} 
                onUpdateMetrics={handleUpdateWellness} 
              />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Quick links panel */}
              <QuickActionPanel onOpenChat={() => setActiveTab('ai-assistant')} />

              {/* Daily schedule widget */}
              <CalendarWidget />

              {/* Vaidya AI recommendations */}
              <AIRecommendationCard 
                recommendations={aiRecommendations} 
                onOpenChat={() => setActiveTab('ai-assistant')} 
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-accent text-[9px] font-bold uppercase tracking-widest block font-sans">scheduling archive</span>
            <h3 className="font-serif text-2xl font-bold text-primary">All Scheduled Consultations</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Manage your upcoming virtual consults or in-person retreat appointments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onCancel={handleCancelAppointment}
                onReschedule={handleRescheduleAppointment}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'recovery' && (
        <div className="space-y-8">
          <div className="space-y-1">
            <span className="text-accent text-[9px] font-bold uppercase tracking-widest block font-sans">clinical path details</span>
            <h3 className="font-serif text-2xl font-bold text-primary">Recovery Progress Tracker</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Track clinical outcomes, cell regeneration milestones, and metabolic rebalances.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-text-secondary">Outcome Curves</span>
                <button
                  onClick={() => { setIsLogModalOpen(true); setLogName('Wk ' + (weeklyMetrics.length + 1)); }}
                  className="bg-primary/5 hover:bg-primary/10 text-primary border border-primary/10 font-bold text-[9.5px] uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition-all shadow-sm flex items-center space-x-1 cursor-pointer"
                >
                  <span>Log Recovery Progress</span>
                </button>
              </div>
              <RecoveryChart
                weeklyData={weeklyMetrics}
                monthlyData={monthlyMetrics}
                condition={recovery?.condition || 'PCOS & Metabolism Care'}
              />
            </div>
            <div>
              <HealthGoalCard goals={healthGoals} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'records' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-accent text-[9px] font-bold uppercase tracking-widest block font-sans">personal digital vault</span>
            <h3 className="font-serif text-2xl font-bold text-primary">My Health Documentation</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Securely store laboratory reports, herbal prescriptions, and diagnostic logs.
            </p>
          </div>

          <MedicalRecordCard 
            records={records} 
            onUploadRecord={handleUploadRecord} 
            isUploading={isUploading}
          />
        </div>
      )}

      {activeTab === 'diet' && (
        <div className="space-y-6 max-w-3xl">
          <div className="space-y-1">
            <span className="text-accent text-[9px] font-bold uppercase tracking-widest block font-sans">Ahara (nutrition guidelines)</span>
            <h3 className="font-serif text-2xl font-bold text-primary">Custom Ayurvedic Diet Planner</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Meals mapped dynamically to balance Pitta warmth and clear Kapha stagnation.
            </p>
          </div>

          <div className="bg-white border border-[#2E7D32]/10 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
            <div className="space-y-4">
              <span className="text-primary font-black text-xs uppercase tracking-wide block">Approved Foods Catalog</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                <div className="bg-[#F8FFF8] border border-primary/10 p-4 rounded-xl space-y-2">
                  <span className="text-primary font-bold block">Favor (Cooling)</span>
                  <ul className="text-text-secondary space-y-1 list-disc pl-4 text-[11px] leading-relaxed">
                    <li>Steamed broccoli & asparagus</li>
                    <li>Ripe sweet avocados</li>
                    <li>Quinoa & organic barley</li>
                    <li>Fennel seed tea infusions</li>
                  </ul>
                </div>
                <div className="bg-amber-500/[0.03] border border-amber-300/20 p-4 rounded-xl space-y-2">
                  <span className="text-amber-700 font-bold block">Moderate (Neutral)</span>
                  <ul className="text-text-secondary space-y-1 list-disc pl-4 text-[11px] leading-relaxed">
                    <li>Basmati brown rice</li>
                    <li>Fresh sweet goat cheese</li>
                    <li>Cooked sweet potatoes</li>
                    <li>Almond milk infusions</li>
                  </ul>
                </div>
                <div className="bg-red-500/[0.03] border border-red-350/20 p-4 rounded-xl space-y-2">
                  <span className="text-red-700 font-bold block">Avoid (Heating)</span>
                  <ul className="text-text-secondary space-y-1 list-disc pl-4 text-[11px] leading-relaxed">
                    <li>Spicy green chilis & peppers</li>
                    <li>Sour yogurt & buttermilk</li>
                    <li>Raw onions & garlic</li>
                    <li>Deep fried oily snacks</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF9F6] border border-primary/5 p-5 rounded-2xl space-y-2 text-xs">
              <span className="text-primary font-bold block">Daily Nutrition Tip from Vaidya</span>
              <p className="text-text-secondary font-medium leading-relaxed">
                Drinking warm ginger tea 30 minutes before meals stimulates the digestive fire (Agni) without overheating Pitta blood. Avoid iced beverages entirely as they freeze digestive enzymes.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dosha' && (
        <div className="space-y-6 max-w-3xl">
          <div className="space-y-1">
            <span className="text-accent text-[9px] font-bold uppercase tracking-widest block font-sans">constitutional balance</span>
            <h3 className="font-serif text-2xl font-bold text-primary">Dosha Analysis: Pitta-Kapha</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Understanding your unique Prakriti makeup to balance metabolic heat and tissue structures.
            </p>
          </div>

          <div className="bg-white border border-[#2E7D32]/10 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 text-xs text-text-secondary">
            <div className="space-y-3">
              <span className="text-primary font-black text-xs uppercase tracking-wide block">Your Dosha Composition</span>
              <p className="leading-relaxed font-semibold">
                You carry a double-dosha constitution where **Pitta (Fire + Water)** dictates your metabolic functions, and **Kapha (Water + Earth)** shapes your skeletal structure and fluids lubrication. Today, Kapha stagnation is slightly elevated, manifesting as hormonal (PCOS) blockages.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2 bg-[#FAF9F6] p-5 rounded-xl border border-primary/5">
                <span className="text-primary font-bold block uppercase text-[10px] tracking-wide">Pitta Indicators (Pacify)</span>
                <p className="leading-relaxed font-medium">
                  Excessive Pitta triggers skin rashes, acid reflux, irritability, and cycle bleeding. Cooling self-massages, cold room temperatures, and meditation are recommended.
                </p>
              </div>
              <div className="space-y-2 bg-[#FAF9F6] p-5 rounded-xl border border-primary/5">
                <span className="text-primary font-bold block uppercase text-[10px] tracking-wide">Kapha Indicators (Stimulate)</span>
                <p className="leading-relaxed font-medium">
                  Excessive Kapha leads to lethargy, fluid retention, weight gain, and cyst accumulation. Activating yoga postures, dry skin brushing, and metabolic herbs are advised.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ai-assistant' && (
        <div className="bg-white border border-[#2E7D32]/10 rounded-3xl overflow-hidden shadow-xl flex flex-col h-[650px] relative max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-emerald-900 text-white p-5 border-b border-emerald-800/10 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-accent animate-pulse shrink-0">
                <Brain className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <span className="text-accent text-[8.5px] font-black uppercase tracking-widest block font-sans">live vaidya AI chat</span>
                <h3 className="font-serif text-sm font-bold leading-none">AyurVeda Connect Assistant</h3>
              </div>
            </div>
            <div className="bg-white/15 px-3 py-1 rounded-full text-[9px] font-bold border border-white/10 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
              <span>Offline Companion Active</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-[#FAF9F6]/30">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[75%] ${
                  msg.sender === 'patient' ? 'ml-auto items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed font-semibold shadow-sm ${
                    msg.sender === 'patient'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white border border-gray-100 text-text-primary rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[8.5px] text-text-secondary font-bold mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}

            {aiTyping && (
              <div className="flex flex-col items-start max-w-[75%]">
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none text-xs text-text-secondary font-bold flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>AI Vaidya is reviewing your dosha records...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendChatMessage} className="p-4 border-t border-gray-100 bg-white flex gap-3 shrink-0">
            <input
              type="text"
              required
              disabled={aiTyping}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about your diet, PCOS remedies, decoction timing..."
              className="flex-grow bg-[#FAF9F6] border border-gray-150 focus:border-primary rounded-xl px-4 py-3 text-xs text-text-primary font-semibold outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={aiTyping || !chatInput.trim()}
              className="bg-primary hover:bg-primary-light disabled:bg-primary/50 text-white font-bold p-3.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center shrink-0"
            >
              <Send className="w-4.5 h-4.5 text-accent" />
            </button>
          </form>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-6 max-w-3xl">
          <div className="space-y-1">
            <span className="text-accent text-[9px] font-bold uppercase tracking-widest block font-sans">communication logs</span>
            <h3 className="font-serif text-2xl font-bold text-primary">Alerts & Notifications Center</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Review medicine schedules, clinic reminders, and customized seasonal health tips.
            </p>
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="bg-white border border-[#2E7D32]/10 p-8 rounded-3xl text-center text-xs text-text-secondary font-medium">
                All notifications dismissed.
              </div>
            ) : (
              notifications.map((notif) => (
                <NotificationCard
                  key={notif.id}
                  notification={notif}
                  onDismiss={handleDismissNotification}
                />
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="space-y-6 max-w-3xl">
          <div className="space-y-1">
            <span className="text-accent text-[9px] font-bold uppercase tracking-widest block font-sans">identity record</span>
            <h3 className="font-serif text-2xl font-bold text-primary">Patient Personal Settings</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Verify your physical constitution metrics and contact details.
            </p>
          </div>

          <div className="bg-white border border-[#2E7D32]/10 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 text-xs font-semibold text-text-secondary">
            <div className="flex items-center space-x-4 pb-4 border-b border-gray-50">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-primary/25 bg-gray-50 shrink-0">
                <img src={patient.profilePhoto} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-black text-primary leading-tight">{patient.name}</h4>
                <span className="text-accent font-extrabold uppercase text-[9px] tracking-wide block mt-1">
                  Constitutional Dosha: {patient.doshaType}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1">
                <span className="block text-[8.5px] uppercase font-bold text-text-secondary">Email Address</span>
                <input
                  type="text"
                  disabled
                  value={patient.email}
                  className="w-full bg-[#FAF9F6] border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="block text-[8.5px] uppercase font-bold text-text-secondary">Phone Number</span>
                <input
                  type="text"
                  disabled
                  value={patient.phone}
                  className="w-full bg-[#FAF9F6] border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="block text-[8.5px] uppercase font-bold text-text-secondary">Age</span>
                  <input
                    type="text"
                    disabled
                    value={`${patient.age} years`}
                    className="w-full bg-[#FAF9F6] border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none text-center"
                  />
                </div>
                <div className="space-y-1">
                  <span className="block text-[8.5px] uppercase font-bold text-text-secondary">Gender</span>
                  <input
                    type="text"
                    disabled
                    value={patient.gender}
                    className="w-full bg-[#FAF9F6] border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none text-center"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[8.5px] uppercase font-bold text-text-secondary">Location</span>
                <input
                  type="text"
                  disabled
                  value={`${patient.city}, India`}
                  className="w-full bg-[#FAF9F6] border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold">
              <span>Member Account Created</span>
              <span className="text-primary">{patient.joinedDate}</span>
            </div>
          </div>
        </div>
      )}

      {/* Log Progress Modal Overlay */}
      {isLogModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-[#FAF9F6] border border-[#2E7D32]/10 rounded-3xl w-full max-w-md p-6 md:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsLogModalOpen(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-primary font-bold text-base cursor-pointer"
            >
              ✕
            </button>
            <div className="space-y-1">
              <span className="text-accent text-[9px] font-bold uppercase tracking-widest block font-sans">Patient Recovery Logging</span>
              <h3 className="font-serif text-xl font-bold text-primary">Log Clinical Progress</h3>
              <p className="text-[10px] text-text-secondary font-medium leading-relaxed">
                Add an outcome data point to update your recovery tracker logs.
              </p>
            </div>
            
            {logError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-[11px] font-semibold">
                ⚠️ {logError}
              </div>
            )}

            <form onSubmit={handleLogSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-bold text-primary uppercase text-[8px] tracking-wider">Log Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => { setLogType('weekly'); setLogName('Wk ' + (weeklyMetrics.length + 1)); }}
                    className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                      logType === 'weekly'
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white text-text-secondary border-gray-200 hover:border-primary/20'
                    }`}
                  >
                    Weekly Log
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLogType('monthly'); setLogName(''); }}
                    className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                      logType === 'monthly'
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white text-text-secondary border-gray-200 hover:border-primary/20'
                    }`}
                  >
                    Monthly Summary
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-primary uppercase text-[8px] tracking-wider">
                  {logType === 'weekly' ? 'Week Label (e.g. Wk 7)' : 'Month Label (e.g. Jul)'}
                </label>
                <input
                  type="text"
                  required
                  value={logName}
                  onChange={(e) => setLogName(e.target.value)}
                  placeholder={logType === 'weekly' ? 'Wk 7' : 'Jul'}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-primary uppercase text-[8px] tracking-wider">
                  <span>Actual Progress</span>
                  <span className="text-accent">{logProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={logProgress}
                  onChange={(e) => setLogProgress(parseInt(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-primary uppercase text-[8px] tracking-wider">
                  <span>Target Progress</span>
                  <span className="text-accent">{logTarget}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={logTarget}
                  onChange={(e) => setLogTarget(parseInt(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={logSubmitting}
                className="w-full bg-primary hover:bg-primary-light disabled:bg-primary/50 text-white font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer mt-4"
              >
                {logSubmitting ? 'Logging Point...' : 'Save Log Entry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
