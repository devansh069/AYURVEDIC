import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Users, Activity, FileText, DollarSign,
  BarChart2, MessageSquare, Bell, User, Settings, LogOut, Sparkles,
  Search, Star, TrendingUp, TrendingDown, ChevronRight, Clock,
  CheckCircle, XCircle, AlertCircle, Phone, Video, MapPin, Send,
  Download, Eye, PlusCircle, Filter, ArrowUpRight, Heart, Award,
  Stethoscope, Leaf, Brain, Shield, RefreshCw, MoreVertical,
  Edit3, Trash2, MessageCircle, ThumbsUp, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const DOCTOR_PROFILE = {
  id: 'dr-001',
  name: 'Dr. Vikram Arun Sharma',
  specialization: 'Senior Ayurvedic Physician & Panchakarma Specialist',
  photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&q=80',
  rating: 4.9,
  totalPatients: 1847,
  experience: '14 Years',
  clinic: 'AyurVeda Wellness Center, New Delhi',
  qualifications: ['BAMS', 'MD (Ayurveda)', 'Panchakarma Certified'],
  languages: ['Hindi', 'English', 'Sanskrit'],
  phone: '+91 98765 12345',
  email: 'dr.vikram@ayurvedaconnect.com',
  consultationFee: 1200,
  joinedDate: '2020-03-15',
  specialExpertise: ['Panchakarma', 'PCOS Management', 'Digestive Disorders', 'Joint Pain'],
  bio: 'Dr. Vikram Sharma is a gold-medallist Ayurvedic physician with over 14 years of clinical experience. He specializes in Panchakarma therapies and integrative Ayurvedic treatment protocols for chronic conditions.',
};

const MOCK_APPOINTMENTS = [
  { id: 'apt-001', patientName: 'Priyanshi Sharma', patientAge: 24, patientPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80', date: '2026-06-17', time: '09:00 AM', type: 'Online', status: 'Confirmed', condition: 'PCOS Follow-up', dosha: 'Pitta-Vata', phone: '+91 98765 43210', notes: 'Patient reports improvement in cycle regularity. Review hormone panel.' },
  { id: 'apt-002', patientName: 'Rahul Verma', patientAge: 38, patientPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80', date: '2026-06-17', time: '10:30 AM', type: 'In-Clinic', status: 'Confirmed', condition: 'Chronic Back Pain', dosha: 'Vata', phone: '+91 87654 32109', notes: 'Basti therapy week 3. Assess lumbar mobility improvement.' },
  { id: 'apt-003', patientName: 'Sunita Reddy', patientAge: 45, patientPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80', date: '2026-06-17', time: '12:00 PM', type: 'In-Clinic', status: 'Pending', condition: 'Digestive Disorders', dosha: 'Pitta', phone: '+91 76543 21098', notes: 'Initial consultation. Review diet history and metabolic panel.' },
  { id: 'apt-004', patientName: 'Amit Joshi', patientAge: 32, patientPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80', date: '2026-06-17', time: '02:00 PM', type: 'Online', status: 'Confirmed', condition: 'Stress & Anxiety', dosha: 'Vata-Pitta', phone: '+91 65432 10987', notes: 'Shirodhara session 2 review. Evaluate sleep quality metrics.' },
  { id: 'apt-005', patientName: 'Meera Pillai', patientAge: 52, patientPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b78c?w=60&q=80', date: '2026-06-18', time: '09:30 AM', type: 'In-Clinic', status: 'Pending', condition: 'Arthritis & Joint Pain', dosha: 'Kapha-Vata', phone: '+91 54321 09876', notes: 'Review Abhyanga response. Adjust herbal oil formulation.' },
  { id: 'apt-006', patientName: 'Deepak Singh', patientAge: 41, patientPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&q=80', date: '2026-06-18', time: '11:00 AM', type: 'Online', status: 'Completed', condition: 'Skin Disorders', dosha: 'Pitta', phone: '+91 43210 98765', notes: 'Completed 6-week skin protocol. Discharge summary needed.' },
  { id: 'apt-007', patientName: 'Kavya Nair', patientAge: 29, patientPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&q=80', date: '2026-06-19', time: '10:00 AM', type: 'In-Clinic', status: 'Cancelled', condition: 'Thyroid Management', dosha: 'Kapha', phone: '+91 32109 87654', notes: 'Patient cancelled. Reschedule to next week.' },
  { id: 'apt-008', patientName: 'Ananya Gupta', patientAge: 35, patientPhoto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&q=80', date: '2026-06-20', time: '03:00 PM', type: 'Online', status: 'Confirmed', condition: 'Weight Management', dosha: 'Kapha', phone: '+91 21098 76543', notes: 'Month 2 review. Assess Udvartana response and BMI changes.' },
];

const MOCK_PATIENTS = [
  { id: 'pat-001', name: 'Priyanshi Sharma', age: 24, gender: 'Female', dosha: 'Pitta-Vata', condition: 'PCOS Management', lastVisit: '2026-06-10', nextVisit: '2026-06-17', totalVisits: 8, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80', status: 'Active', phone: '+91 98765 43210', progress: 74 },
  { id: 'pat-002', name: 'Rahul Verma', age: 38, gender: 'Male', dosha: 'Vata', condition: 'Chronic Back Pain', lastVisit: '2026-06-13', nextVisit: '2026-06-17', totalVisits: 12, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80', status: 'Active', phone: '+91 87654 32109', progress: 62 },
  { id: 'pat-003', name: 'Sunita Reddy', age: 45, gender: 'Female', dosha: 'Pitta', condition: 'Digestive Disorders', lastVisit: '2026-05-28', nextVisit: '2026-06-17', totalVisits: 3, photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80', status: 'New', phone: '+91 76543 21098', progress: 30 },
  { id: 'pat-004', name: 'Amit Joshi', age: 32, gender: 'Male', dosha: 'Vata-Pitta', condition: 'Stress & Anxiety', lastVisit: '2026-06-08', nextVisit: '2026-06-17', totalVisits: 6, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80', status: 'Active', phone: '+91 65432 10987', progress: 55 },
  { id: 'pat-005', name: 'Meera Pillai', age: 52, gender: 'Female', dosha: 'Kapha-Vata', condition: 'Arthritis', lastVisit: '2026-06-05', nextVisit: '2026-06-18', totalVisits: 15, photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b78c?w=60&q=80', status: 'Active', phone: '+91 54321 09876', progress: 80 },
  { id: 'pat-006', name: 'Deepak Singh', age: 41, gender: 'Male', dosha: 'Pitta', condition: 'Skin Disorders', lastVisit: '2026-06-14', nextVisit: '2026-07-15', totalVisits: 9, photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&q=80', status: 'Recovered', phone: '+91 43210 98765', progress: 95 },
  { id: 'pat-007', name: 'Ananya Gupta', age: 35, gender: 'Female', dosha: 'Kapha', condition: 'Weight Management', lastVisit: '2026-06-01', nextVisit: '2026-06-20', totalVisits: 7, photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&q=80', status: 'Active', phone: '+91 21098 76543', progress: 48 },
];

const MOCK_MESSAGES = [
  { id: 'msg-001', patientName: 'Priyanshi Sharma', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80', message: 'Doctor, my cycle has been more regular this month. Should I continue the Shatavari dose?', time: '10 mins ago', unread: true, messages: [
    { sender: 'patient', text: 'Doctor, my cycle has been more regular this month. Should I continue the Shatavari dose?', time: '10:15 AM' },
    { sender: 'doctor', text: 'Wonderful progress! Yes, continue the Shatavari 500mg twice daily with warm milk. Add Ashoka churna 1 tsp at bedtime. See you on the 17th.', time: '10:28 AM' },
  ]},
  { id: 'msg-002', patientName: 'Rahul Verma', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80', message: 'The back pain has reduced significantly after the second Basti session. Thank you!', time: '1 hr ago', unread: true, messages: [
    { sender: 'patient', text: 'The back pain has reduced significantly after the second Basti session. Thank you!', time: '09:30 AM' },
  ]},
  { id: 'msg-003', patientName: 'Amit Joshi', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80', message: 'Is it okay to do yoga in the morning before the Shirodhara session?', time: '3 hrs ago', unread: false, messages: [
    { sender: 'patient', text: 'Is it okay to do yoga in the morning before the Shirodhara session?', time: '07:00 AM' },
    { sender: 'doctor', text: 'Gentle yoga is fine, but avoid intense inversions. Prefer Shavasana and Nadi Shodhana pranayama on therapy days.', time: '08:15 AM' },
  ]},
];

const MOCK_NOTIFICATIONS = [
  { id: 'notif-001', title: 'New Appointment Booked', message: 'Sunita Reddy has booked an appointment for June 17 at 12:00 PM — Digestive Disorders consultation.', time: '5 mins ago', type: 'appointment', read: false },
  { id: 'notif-002', title: 'Appointment Cancelled', message: 'Kavya Nair cancelled her appointment scheduled for June 19. Action may be required.', time: '30 mins ago', type: 'alert', read: false },
  { id: 'notif-003', title: 'New Patient Review', message: 'Deepak Singh left a 5-star review: "Excellent treatment. Skin completely cleared."', time: '2 hrs ago', type: 'review', read: false },
  { id: 'notif-004', title: 'Payment Received', message: 'Payment of ₹1,200 received from Priyanshi Sharma for consultation on June 10.', time: '5 hrs ago', type: 'payment', read: true },
  { id: 'notif-005', title: 'Lab Report Uploaded', message: 'Rahul Verma uploaded new thyroid hormone panel results. Review before next session.', time: '1 day ago', type: 'document', read: true },
  { id: 'notif-006', title: 'Monthly Report Ready', message: 'Your performance analytics report for May 2026 is ready for download.', time: '2 days ago', type: 'report', read: true },
];

const REVENUE_DATA = [
  { month: 'Jan', revenue: 68000, patients: 42 },
  { month: 'Feb', revenue: 72000, patients: 48 },
  { month: 'Mar', revenue: 85000, patients: 55 },
  { month: 'Apr', revenue: 79000, patients: 51 },
  { month: 'May', revenue: 96000, patients: 63 },
  { month: 'Jun', revenue: 88000, patients: 58 },
];

const PATIENT_GROWTH = [
  { month: 'Jan', new: 12, returning: 30 },
  { month: 'Feb', new: 15, returning: 33 },
  { month: 'Mar', new: 18, returning: 37 },
  { month: 'Apr', new: 14, returning: 37 },
  { month: 'May', new: 22, returning: 41 },
  { month: 'Jun', new: 19, returning: 39 },
];

const DOSHA_DISTRIBUTION = [
  { name: 'Vata', value: 28, color: '#7C3AED' },
  { name: 'Pitta', value: 35, color: '#2E7D32' },
  { name: 'Kapha', value: 22, color: '#0369A1' },
  { name: 'Mixed', value: 15, color: '#D4AF37' },
];

const TREATMENT_STATS = [
  { name: 'Panchakarma', patients: 45, color: '#2E7D32' },
  { name: 'Shirodhara', patients: 38, color: '#81C784' },
  { name: 'Abhyanga', patients: 32, color: '#D4AF37' },
  { name: 'Basti', patients: 28, color: '#0369A1' },
  { name: 'Nasya', patients: 21, color: '#7C3AED' },
];

const MOCK_REVIEWS = [
  { id: 'rv-001', patientName: 'Deepak Singh', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&q=80', rating: 5, review: 'Dr. Vikram completely transformed my skin health. The 6-week Panchakarma protocol worked wonders where modern medicine failed. Extremely knowledgeable and compassionate.', date: 'June 14, 2026', condition: 'Skin Disorders' },
  { id: 'rv-002', patientName: 'Meera Pillai', photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b78c?w=60&q=80', rating: 5, review: 'Remarkable improvement in joint mobility after Abhyanga and Basti therapy. Doctor\'s approach is deeply personalized and rooted in classical texts.', date: 'June 5, 2026', condition: 'Arthritis' },
  { id: 'rv-003', patientName: 'Amit Joshi', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80', rating: 5, review: 'Shirodhara sessions completely resolved my chronic insomnia. Dr. Sharma\'s explanations of each treatment\'s mechanism built tremendous trust.', date: 'May 28, 2026', condition: 'Stress & Anxiety' },
  { id: 'rv-004', patientName: 'Priyanshi Sharma', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80', rating: 5, review: 'After 8 months of treatment, my PCOS symptoms are nearly resolved. Dr. Vikram\'s holistic protocol — diet, herbs, yoga — is exceptional.', date: 'May 20, 2026', condition: 'PCOS' },
];

const SCHEDULE_SLOTS = [
  { time: '08:00', label: 'Morning rounds / Herb prep', type: 'blocked' },
  { time: '09:00', label: 'Priyanshi Sharma — PCOS Follow-up (Online)', type: 'booked' },
  { time: '09:45', label: 'Break', type: 'break' },
  { time: '10:30', label: 'Rahul Verma — Back Pain Basti (In-Clinic)', type: 'booked' },
  { time: '11:15', label: 'Available', type: 'available' },
  { time: '12:00', label: 'Sunita Reddy — Digestive Disorders (In-Clinic)', type: 'booked' },
  { time: '13:00', label: 'Lunch Break', type: 'break' },
  { time: '14:00', label: 'Amit Joshi — Stress Assessment (Online)', type: 'booked' },
  { time: '14:45', label: 'Available', type: 'available' },
  { time: '15:30', label: 'Available', type: 'available' },
  { time: '16:00', label: 'Case Review / Documentation', type: 'blocked' },
  { time: '17:00', label: 'End of Day', type: 'break' },
];

const EARNINGS_BREAKDOWN = [
  { label: 'Online Consultations', amount: 48000, count: 40, color: '#2E7D32', pct: 55 },
  { label: 'In-Clinic Visits', amount: 30000, count: 25, color: '#81C784', pct: 34 },
  { label: 'Panchakarma Programs', amount: 10000, count: 4, color: '#D4AF37', pct: 11 },
];

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Completed: 'bg-blue-100 text-blue-700 border-blue-200',
    Cancelled: 'bg-red-100 text-red-700 border-red-200',
    Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    New: 'bg-purple-100 text-purple-700 border-purple-200',
    Recovered: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return (
    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border inline-block ${map[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {status}
    </span>
  );
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} className={`w-3 h-3 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`} />
    ))}
  </div>
);

// ─── MAIN DASHBOARD PAGE ─────────────────────────────────────────────────────

const DoctorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [chatInput, setChatInput] = useState('');
  const [conversations, setConversations] = useState(MOCK_MESSAGES);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [appointmentFilter, setAppointmentFilter] = useState('All');
  const [patientSearch, setPatientSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = conversations.filter(m => m.unread).length;
  const todayAppointments = MOCK_APPOINTMENTS.filter(a => a.date === '2026-06-17');
  const pendingAppointments = MOCK_APPOINTMENTS.filter(a => a.status === 'Pending');

  const filteredAppointments = appointmentFilter === 'All'
    ? MOCK_APPOINTMENTS
    : MOCK_APPOINTMENTS.filter(a => a.status === appointmentFilter);

  const filteredPatients = MOCK_PATIENTS.filter(p =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.condition.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeConversation) return;
    const newMsg = { sender: 'doctor', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setConversations(prev => prev.map(c =>
      c.id === activeConversation.id
        ? { ...c, messages: [...c.messages, newMsg], unread: false }
        : c
    ));
    const updated = conversations.find(c => c.id === activeConversation.id);
    if (updated) setActiveConversation({ ...updated, messages: [...updated.messages, newMsg] });
    setChatInput('');
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', name: 'Appointments', icon: Calendar, badge: pendingAppointments.length },
    { id: 'patients', name: 'My Patients', icon: Users },
    { id: 'schedule', name: 'Today\'s Schedule', icon: Clock },
    { id: 'treatments', name: 'Treatment Plans', icon: FileText },
    { id: 'earnings', name: 'Earnings', icon: DollarSign },
    { id: 'analytics', name: 'Analytics', icon: BarChart2 },
    { id: 'reviews', name: 'Patient Reviews', icon: Star },
    { id: 'messages', name: 'Messages', icon: MessageSquare, badge: unreadMessages },
    { id: 'notifications', name: 'Notifications', icon: Bell, badge: unreadNotifications },
    { id: 'profile', name: 'My Profile', icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-[#F4FAF4]">
      {/* ── SIDEBAR ── */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 shrink-0 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2E7D32] to-emerald-700 flex items-center justify-center shadow-md">
              <Sparkles className="w-4.5 h-4.5 text-[#D4AF37]" />
            </div>
            <div>
              <h1 className="font-serif text-sm font-black text-[#2E7D32] leading-none">AyurVeda</h1>
              <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">Doctor Portal</span>
            </div>
          </div>
        </div>

        {/* Doctor micro-profile */}
        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-br from-[#F8FFF8] to-white">
          <div className="flex items-center gap-2.5">
            <img src={DOCTOR_PROFILE.photo} alt="" className="w-9 h-9 rounded-xl object-cover border-2 border-[#2E7D32]/20 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-black text-gray-900 truncate">{DOCTOR_PROFILE.name.replace('Dr. ', 'Dr.')}</p>
              <p className="text-[9px] text-gray-500 truncate font-semibold">{DOCTOR_PROFILE.specialization.split(' & ')[0]}</p>
            </div>
          </div>
        </div>

        <nav className="flex-grow p-3 space-y-0.5 overflow-y-auto">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-[#2E7D32] text-white shadow-sm shadow-[#2E7D32]/30'
                    : 'text-gray-500 hover:bg-[#F8FFF8] hover:text-[#2E7D32]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#D4AF37]' : 'text-gray-400 group-hover:text-[#2E7D32]'}`} />
                  <span>{item.name}</span>
                </div>
                {(item as any).badge > 0 && (
                  <span className={`text-[9px] font-black h-4 min-w-[16px] flex items-center justify-center rounded-full px-1 ${
                    isActive ? 'bg-white text-[#2E7D32]' : 'bg-red-500 text-white'
                  }`}>{(item as any).badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[11px] font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Exit Portal</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex-1 max-w-md relative hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search patients, appointments..."
              className="w-full bg-[#F8FFF8] border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]/40 transition-all font-semibold text-gray-700"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 text-gray-500 hover:bg-[#F8FFF8] rounded-xl transition-colors"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
              )}
            </button>
            <button onClick={() => setActiveTab('messages')} className="relative p-2 text-gray-500 hover:bg-[#F8FFF8] rounded-xl transition-colors">
              <MessageSquare className="w-4.5 h-4.5" />
              {unreadMessages > 0 && (
                <span className="absolute top-1 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-white" />
              )}
            </button>
            <div className="w-px h-8 bg-gray-100" />
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => setActiveTab('profile')}
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-gray-900">{DOCTOR_PROFILE.name}</p>
                <p className="text-[9px] text-gray-400 font-semibold">Senior Ayurvedic Physician</p>
              </div>
              <img src={DOCTOR_PROFILE.photo} alt="" className="w-8 h-8 rounded-xl object-cover border-2 border-[#2E7D32]/20" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 pb-24">

          {/* ═══ DASHBOARD TAB ═══ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Welcome Banner */}
              <section className="bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-emerald-600 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#D4AF37]/10 rounded-full blur-3xl" />
                <div className="absolute -left-10 bottom-0 w-72 h-40 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute top-4 right-4 w-28 h-28 bg-white/5 rounded-full blur-xl" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full inline-block border border-[#D4AF37]/30">
                      🌿 Doctor Portal — AyurVeda Connect
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl font-black leading-tight">
                      Namaste, {DOCTOR_PROFILE.name}
                    </h2>
                    <p className="text-xs text-white/70 font-medium max-w-md">
                      You have <strong className="text-[#D4AF37]">{todayAppointments.filter(a => a.status !== 'Cancelled').length} appointments</strong> today and{' '}
                      <strong className="text-white">{pendingAppointments.length} pending</strong> consultations awaiting your confirmation.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-6 bg-white/10 backdrop-blur-sm border border-white/10 px-6 py-4 rounded-2xl shrink-0">
                    <div className="text-center">
                      <span className="text-[#D4AF37] font-black text-xl block">{DOCTOR_PROFILE.totalPatients.toLocaleString()}</span>
                      <span className="text-[9px] text-white/60 uppercase font-bold">Total Patients</span>
                    </div>
                    <div className="w-px bg-white/20" />
                    <div className="text-center">
                      <span className="text-[#D4AF37] font-black text-xl block">{DOCTOR_PROFILE.rating}</span>
                      <span className="text-[9px] text-white/60 uppercase font-bold">Avg. Rating</span>
                    </div>
                    <div className="w-px bg-white/20" />
                    <div className="text-center">
                      <span className="text-[#D4AF37] font-black text-xl block">{DOCTOR_PROFILE.experience}</span>
                      <span className="text-[9px] text-white/60 uppercase font-bold">Experience</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* KPI Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Today's Appointments", value: todayAppointments.filter(a => a.status !== 'Cancelled').length, icon: Calendar, color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-700', trend: '+12%', up: true },
                  { label: 'Pending Confirmations', value: pendingAppointments.length, icon: AlertCircle, color: 'from-amber-500/10 to-yellow-500/10 border-amber-500/20 text-amber-700', trend: '2 new', up: false },
                  { label: 'Active Patients', value: MOCK_PATIENTS.filter(p => p.status === 'Active').length, icon: Users, color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-700', trend: '+3 this week', up: true },
                  { label: 'This Month Revenue', value: '₹88,000', icon: DollarSign, color: 'from-rose-500/10 to-pink-500/10 border-rose-500/20 text-rose-700', trend: '+8.5%', up: true },
                ].map((kpi, i) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={i} className={`bg-gradient-to-br ${kpi.color} border rounded-2xl p-5 space-y-3`}>
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-xl ${kpi.color.split(' ')[0]} ${kpi.color.split(' ')[1]} flex items-center justify-center border ${kpi.color.split(' ')[2]}`}>
                          <Icon className={`w-4 h-4 ${kpi.color.split(' ')[3]}`} />
                        </div>
                        <span className={`text-[9px] font-black flex items-center gap-0.5 ${kpi.up ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {kpi.up ? <TrendingUp className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {kpi.trend}
                        </span>
                      </div>
                      <div>
                        <p className={`font-black text-2xl ${kpi.color.split(' ')[3]}`}>{kpi.value}</p>
                        <p className="text-[10px] font-bold text-gray-500 mt-0.5">{kpi.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Charts + Appointments */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Revenue Chart */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest block">2026 Revenue Trend</span>
                        <h3 className="font-bold text-gray-900 text-sm">Monthly Earnings Overview</h3>
                      </div>
                      <span className="text-xs text-gray-400 font-semibold">Jan – Jun 2026</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={REVENUE_DATA}>
                        <defs>
                          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(v: any) => [`₹${v.toLocaleString()}`, 'Revenue']} contentStyle={{ fontSize: 11, borderRadius: 12, border: '1px solid #e5e7eb' }} />
                        <Area type="monotone" dataKey="revenue" stroke="#2E7D32" strokeWidth={2.5} fill="url(#rev)" dot={{ fill: '#2E7D32', r: 3 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Today's Appointments */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest block">June 17, 2026</span>
                        <h3 className="font-bold text-gray-900 text-sm">Today's Appointments</h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('appointments')}
                        className="text-[10px] font-black text-[#2E7D32] flex items-center gap-1 hover:underline"
                      >
                        View All <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {todayAppointments.map(apt => (
                        <div
                          key={apt.id}
                          onClick={() => setSelectedAppointment(apt)}
                          className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-[#2E7D32]/20 hover:bg-[#F8FFF8] transition-all cursor-pointer group"
                        >
                          <img src={apt.patientPhoto} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0 border border-gray-100" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-black text-gray-900">{apt.patientName}</p>
                              <StatusBadge status={apt.status} />
                            </div>
                            <p className="text-[10px] text-gray-400 font-semibold mt-0.5 truncate">{apt.condition}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs font-black text-gray-700">{apt.time}</p>
                            <div className={`flex items-center gap-1 text-[9px] font-bold justify-end mt-0.5 ${apt.type === 'Online' ? 'text-blue-500' : 'text-[#2E7D32]'}`}>
                              {apt.type === 'Online' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                              {apt.type}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Patients */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest block">Clinical Records</span>
                        <h3 className="font-bold text-gray-900 text-sm">Recent Patients</h3>
                      </div>
                      <button onClick={() => setActiveTab('patients')} className="text-[10px] font-black text-[#2E7D32] flex items-center gap-1 hover:underline">
                        View All <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {MOCK_PATIENTS.slice(0, 4).map(p => (
                        <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8FFF8] transition-colors">
                          <img src={p.photo} alt="" className="w-8 h-8 rounded-xl object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-gray-900">{p.name}</p>
                            <p className="text-[10px] text-gray-400 font-semibold">{p.condition} • {p.dosha}</p>
                          </div>
                          <div className="text-right">
                            <StatusBadge status={p.status} />
                            <p className="text-[9px] text-gray-400 font-semibold mt-1">{p.progress}% Progress</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-xs mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { label: 'New Appointment', icon: PlusCircle, tab: 'appointments', color: 'bg-[#F8FFF8] text-[#2E7D32] border-[#2E7D32]/20' },
                        { label: 'View Schedule', icon: Clock, tab: 'schedule', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                        { label: 'Patient Records', icon: Users, tab: 'patients', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                        { label: 'Earnings Report', icon: DollarSign, tab: 'earnings', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                      ].map((action, i) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={i}
                            onClick={() => setActiveTab(action.tab)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all hover:scale-105 cursor-pointer ${action.color}`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-[9px] font-black leading-tight">{action.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dosha Distribution */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-xs mb-4">Patient Dosha Distribution</h3>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={DOSHA_DISTRIBUTION} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" paddingAngle={3}>
                          {DOSHA_DISTRIBUTION.map((d, i) => (
                            <Cell key={i} fill={d.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-1.5 mt-2">
                      {DOSHA_DISTRIBUTION.map((d, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                          <span className="text-[9px] font-bold text-gray-500">{d.name} ({d.value}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Latest Review */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900 text-xs">Latest Review</h3>
                      <button onClick={() => setActiveTab('reviews')} className="text-[9px] font-black text-[#2E7D32]">See All</button>
                    </div>
                    <div className="space-y-3">
                      {MOCK_REVIEWS.slice(0, 2).map(r => (
                        <div key={r.id} className="p-3 bg-[#F8FFF8] rounded-xl border border-[#2E7D32]/10">
                          <div className="flex items-center gap-2 mb-1.5">
                            <img src={r.photo} alt="" className="w-6 h-6 rounded-lg object-cover" />
                            <span className="text-[10px] font-black text-gray-800">{r.patientName}</span>
                            <StarRating rating={r.rating} />
                          </div>
                          <p className="text-[10px] text-gray-500 font-medium leading-relaxed line-clamp-2">{r.review}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-2xl p-5 text-white">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-4 h-4 text-[#D4AF37]" />
                      <h3 className="font-bold text-xs">Performance Score</h3>
                    </div>
                    {[
                      { label: 'Patient Satisfaction', value: 96 },
                      { label: 'Appointment Adherence', value: 88 },
                      { label: 'Treatment Success Rate', value: 92 },
                    ].map((m, i) => (
                      <div key={i} className="mb-3 last:mb-0">
                        <div className="flex justify-between text-[9px] font-bold mb-1">
                          <span className="text-white/70">{m.label}</span>
                          <span className="text-[#D4AF37]">{m.value}%</span>
                        </div>
                        <div className="h-1.5 bg-white/20 rounded-full">
                          <div className="h-full bg-[#D4AF37] rounded-full transition-all" style={{ width: `${m.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ APPOINTMENTS TAB ═══ */}
          {activeTab === 'appointments' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest block">Scheduling Center</span>
                  <h2 className="font-serif text-xl font-black text-gray-900">All Appointments</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-xl p-1">
                    {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map(f => (
                      <button
                        key={f}
                        onClick={() => setAppointmentFilter(f)}
                        className={`text-[9px] font-black px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          appointmentFilter === f ? 'bg-[#2E7D32] text-white shadow-sm' : 'text-gray-500 hover:text-[#2E7D32]'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {filteredAppointments.map(apt => (
                  <div key={apt.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-[#2E7D32]/20 hover:shadow-md transition-all">
                    <div className="flex items-start gap-4">
                      <img src={apt.patientPhoto} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                          <p className="font-black text-gray-900 text-sm">{apt.patientName}</p>
                          <StatusBadge status={apt.status} />
                          <span className={`text-[9px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                            apt.type === 'Online'
                              ? 'bg-blue-50 text-blue-600 border-blue-200'
                              : 'bg-[#F8FFF8] text-[#2E7D32] border-[#2E7D32]/20'
                          }`}>
                            {apt.type === 'Online' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                            {apt.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-semibold mb-2">{apt.condition} • Age {apt.patientAge} • {apt.dosha} Dosha</p>
                        <p className="text-[10px] text-gray-400 font-medium bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 leading-relaxed">
                          📝 {apt.notes}
                        </p>
                      </div>
                      <div className="text-right shrink-0 space-y-1">
                        <p className="text-xs font-black text-gray-900">{apt.time}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">{apt.date}</p>
                        <div className="flex items-center gap-1.5 justify-end mt-2">
                          {apt.status === 'Pending' && (
                            <>
                              <button className="text-[9px] font-black px-2.5 py-1.5 bg-[#2E7D32] text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Confirm
                              </button>
                              <button className="text-[9px] font-black px-2.5 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1">
                                <XCircle className="w-3 h-3" /> Cancel
                              </button>
                            </>
                          )}
                          {apt.status === 'Confirmed' && (
                            <button className="text-[9px] font-black px-2.5 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1">
                              {apt.type === 'Online' ? <Video className="w-3 h-3" /> : <Stethoscope className="w-3 h-3" />}
                              Start Session
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ PATIENTS TAB ═══ */}
          {activeTab === 'patients' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest block">Clinical Records</span>
                  <h2 className="font-serif text-xl font-black text-gray-900">My Patients ({MOCK_PATIENTS.length})</h2>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                  <input
                    type="text"
                    placeholder="Search patients or conditions..."
                    value={patientSearch}
                    onChange={e => setPatientSearch(e.target.value)}
                    className="bg-white border border-gray-100 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#2E7D32]/40 w-64"
                  />
                </div>
              </div>

              {selectedPatient ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
                  <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
                    <button
                      onClick={() => setSelectedPatient(null)}
                      className="text-[10px] font-black text-[#2E7D32] flex items-center gap-1 hover:underline"
                    >
                      ← Back to Patients
                    </button>
                  </div>
                  <div className="flex items-start gap-5">
                    <img src={selectedPatient.photo} alt="" className="w-16 h-16 rounded-2xl object-cover border border-gray-100" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-serif font-black text-xl text-gray-900">{selectedPatient.name}</h3>
                        <StatusBadge status={selectedPatient.status} />
                      </div>
                      <p className="text-xs text-gray-400 font-semibold">{selectedPatient.gender} • {selectedPatient.age} years • {selectedPatient.dosha} Dosha</p>
                      <p className="text-xs text-[#2E7D32] font-bold mt-1">📌 {selectedPatient.condition}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Visits', value: selectedPatient.totalVisits },
                      { label: 'Last Visit', value: selectedPatient.lastVisit },
                      { label: 'Next Visit', value: selectedPatient.nextVisit },
                      { label: 'Recovery Progress', value: `${selectedPatient.progress}%` },
                    ].map((info, i) => (
                      <div key={i} className="bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl p-4">
                        <p className="text-[9px] font-black uppercase text-gray-400 tracking-wide">{info.label}</p>
                        <p className="font-black text-gray-900 text-sm mt-1">{info.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-wide">Treatment Progress</p>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#2E7D32] to-emerald-400 rounded-full transition-all"
                        style={{ width: `${selectedPatient.progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 font-semibold">{selectedPatient.progress}% recovery achieved</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setActiveTab('appointments'); setSelectedPatient(null); }} className="flex items-center gap-2 px-4 py-2.5 bg-[#2E7D32] text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition-colors">
                      <Calendar className="w-3.5 h-3.5" /> Book Follow-up
                    </button>
                    <button onClick={() => { setActiveConversation(MOCK_MESSAGES.find(m => m.patientName === selectedPatient.name)); setActiveTab('messages'); setSelectedPatient(null); }} className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-xs font-black hover:bg-blue-100 transition-colors">
                      <MessageCircle className="w-3.5 h-3.5" /> Send Message
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPatients.map(p => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPatient(p)}
                      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-[#2E7D32]/20 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <img src={p.photo} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0 border border-gray-100" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-black text-sm text-gray-900">{p.name}</p>
                            <StatusBadge status={p.status} />
                          </div>
                          <p className="text-[10px] text-gray-400 font-semibold">{p.gender} • Age {p.age} • {p.dosha}</p>
                          <p className="text-[10px] font-bold text-[#2E7D32] mt-0.5">{p.condition}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 mt-1" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[9px] font-bold text-gray-400">
                          <span>Recovery Progress</span>
                          <span className="text-[#2E7D32]">{p.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#2E7D32] to-emerald-400 rounded-full" style={{ width: `${p.progress}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                        <span className="text-[9px] text-gray-400 font-semibold">Next: {p.nextVisit}</span>
                        <span className="text-[9px] text-gray-400 font-semibold">{p.totalVisits} total visits</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ SCHEDULE TAB ═══ */}
          {activeTab === 'schedule' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest block">Daily Planner</span>
                <h2 className="font-serif text-xl font-black text-gray-900">Today's Schedule — June 17, 2026</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="space-y-2">
                    {SCHEDULE_SLOTS.map((slot, i) => {
                      const colorMap = {
                        booked: 'border-l-[#2E7D32] bg-[#F8FFF8] border-[#2E7D32]/15',
                        available: 'border-l-emerald-300 bg-emerald-50/50 border-emerald-100',
                        break: 'border-l-amber-400 bg-amber-50/50 border-amber-100',
                        blocked: 'border-l-gray-400 bg-gray-50 border-gray-100',
                      };
                      const dotMap = {
                        booked: 'bg-[#2E7D32]',
                        available: 'bg-emerald-300',
                        break: 'bg-amber-400',
                        blocked: 'bg-gray-400',
                      };
                      return (
                        <div key={i} className={`flex items-center gap-4 p-3.5 rounded-xl border border-l-4 ${colorMap[slot.type]}`}>
                          <span className="text-[10px] font-black text-gray-500 w-12 shrink-0">{slot.time}</span>
                          <div className={`w-2 h-2 rounded-full shrink-0 ${dotMap[slot.type]}`} />
                          <p className={`text-xs font-bold ${slot.type === 'booked' ? 'text-gray-900' : 'text-gray-400'}`}>
                            {slot.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-xs mb-4">Daily Summary</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Total Appointments', value: '4 sessions', color: 'text-[#2E7D32]' },
                        { label: 'Online Consultations', value: '2 sessions', color: 'text-blue-600' },
                        { label: 'In-Clinic Visits', value: '2 sessions', color: 'text-[#2E7D32]' },
                        { label: 'Available Slots', value: '2 open', color: 'text-emerald-500' },
                        { label: 'Estimated Revenue', value: '₹4,800', color: 'text-amber-600' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <span className="text-[10px] font-bold text-gray-400">{item.label}</span>
                          <span className={`text-[10px] font-black ${item.color}`}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-2xl p-5 text-white">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-4 h-4 text-[#D4AF37]" />
                      <h3 className="font-bold text-xs">Doctor's Reminders</h3>
                    </div>
                    <ul className="space-y-2">
                      {[
                        'Rahul Verma — Basti therapy herbs need preparation by 10:00 AM',
                        'Review Priyanshi\'s hormone panel before 9:00 AM session',
                        'Submit monthly clinical report to AyurVeda Connect by EOD',
                      ].map((note, i) => (
                        <li key={i} className="text-[10px] text-white/70 font-medium flex gap-2">
                          <Leaf className="w-3 h-3 text-[#D4AF37] mt-0.5 shrink-0" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ TREATMENTS TAB ═══ */}
          {activeTab === 'treatments' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest block">Clinical Protocols</span>
                <h2 className="font-serif text-xl font-black text-gray-900">Active Treatment Plans</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {MOCK_PATIENTS.filter(p => p.status === 'Active').map(patient => (
                  <div key={patient.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <img src={patient.photo} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      <div className="flex-1">
                        <p className="font-black text-sm text-gray-900">{patient.name}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">{patient.condition} • {patient.dosha} Dosha</p>
                      </div>
                      <StatusBadge status={patient.status} />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-[9px] font-black">
                        <span className="text-gray-400">TREATMENT PROGRESS</span>
                        <span className="text-[#2E7D32]">{patient.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#2E7D32] to-[#81C784] rounded-full"
                          style={{ width: `${patient.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[10px]">
                      <div className="bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl p-3">
                        <span className="font-black text-gray-400 block text-[9px] uppercase">Next Visit</span>
                        <span className="font-black text-gray-900 mt-0.5 block">{patient.nextVisit}</span>
                      </div>
                      <div className="bg-[#F8FFF8] border border-[#2E7D32]/10 rounded-xl p-3">
                        <span className="font-black text-gray-400 block text-[9px] uppercase">Total Visits</span>
                        <span className="font-black text-gray-900 mt-0.5 block">{patient.totalVisits}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 py-2 text-[10px] font-black bg-[#2E7D32] text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1">
                        <Edit3 className="w-3 h-3" /> Update Plan
                      </button>
                      <button className="flex-1 py-2 text-[10px] font-black bg-[#F8FFF8] text-[#2E7D32] border border-[#2E7D32]/20 rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1">
                        <Eye className="w-3 h-3" /> View Full
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Treatment Stats */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 text-sm mb-5">Treatment Distribution This Month</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={TREATMENT_STATS} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#374151', fontWeight: 700 }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                    <Bar dataKey="patients" radius={[0, 6, 6, 0]}>
                      {TREATMENT_STATS.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ═══ EARNINGS TAB ═══ */}
          {activeTab === 'earnings' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest block">Financial Overview</span>
                <h2 className="font-serif text-xl font-black text-gray-900">Earnings Dashboard</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'This Month', value: '₹88,000', trend: '+8.5%', up: true, icon: TrendingUp },
                  { label: 'Total Earned (2026)', value: '₹4,88,000', trend: '+23% YoY', up: true, icon: Award },
                  { label: 'Avg. Per Consultation', value: '₹1,519', trend: '+₹120', up: true, icon: Star },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 bg-[#F8FFF8] border border-[#2E7D32]/20 rounded-xl flex items-center justify-center">
                          <Icon className="w-4 h-4 text-[#2E7D32]" />
                        </div>
                        <span className={`text-[10px] font-black flex items-center gap-1 ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>
                          {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {stat.trend}
                        </span>
                      </div>
                      <p className="font-black text-2xl text-gray-900">{stat.value}</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 text-xs mb-5">Revenue Breakdown</h3>
                  <div className="space-y-4">
                    {EARNINGS_BREAKDOWN.map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[10px] font-bold mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                            <span className="text-gray-600">{item.label}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-900">₹{item.amount.toLocaleString()}</span>
                            <span className="text-gray-400 ml-2">({item.count} sessions)</span>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${item.pct}%`, background: item.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 text-xs mb-5">Monthly Revenue Trend</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={REVENUE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: any) => [`₹${v.toLocaleString()}`, 'Revenue']} contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                      <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2.5} dot={{ fill: '#D4AF37', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ═══ ANALYTICS TAB ═══ */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest block">Practice Intelligence</span>
                <h2 className="font-serif text-xl font-black text-gray-900">Analytics & Insights</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patient Growth */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 text-xs mb-5">Patient Growth — New vs. Returning</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={PATIENT_GROWTH}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                      <Bar dataKey="new" name="New Patients" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="returning" name="Returning" fill="#2E7D32" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Dosha Pie */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 text-xs mb-5">Patient Dosha Profile Distribution</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={DOSHA_DISTRIBUTION} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                        {DOSHA_DISTRIBUTION.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 text-xs mb-5">Performance Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {[
                    { label: 'Patient Satisfaction', value: 96, color: '#2E7D32' },
                    { label: 'Appointment Adherence', value: 88, color: '#D4AF37' },
                    { label: 'Treatment Success Rate', value: 92, color: '#0369A1' },
                    { label: 'Repeat Visit Rate', value: 79, color: '#7C3AED' },
                  ].map((m, i) => (
                    <div key={i} className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-3">
                        <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f0f0" strokeWidth="3" />
                          <circle
                            cx="18" cy="18" r="15.9" fill="none"
                            stroke={m.color} strokeWidth="3"
                            strokeDasharray={`${m.value} ${100 - m.value}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-black text-sm text-gray-900">{m.value}%</span>
                      </div>
                      <p className="text-[10px] font-bold text-gray-500 text-center leading-tight">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ REVIEWS TAB ═══ */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest block">Patient Feedback</span>
                  <h2 className="font-serif text-xl font-black text-gray-900">Reviews & Ratings</h2>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                  <div className="text-center">
                    <span className="font-black text-3xl text-gray-900">4.9</span>
                    <StarRating rating={5} />
                    <span className="text-[9px] text-gray-400 font-semibold">1,247 reviews</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {MOCK_REVIEWS.map(r => (
                  <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <img src={r.photo} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0 border border-gray-100" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <p className="font-black text-gray-900 text-sm">{r.patientName}</p>
                          <StarRating rating={r.rating} />
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-[#F8FFF8] text-[#2E7D32] border border-[#2E7D32]/20 rounded-full">{r.condition}</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">{r.review}</p>
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                          <span className="text-[9px] text-gray-400 font-semibold">{r.date}</span>
                          <button className="text-[9px] font-black text-[#2E7D32] flex items-center gap-1 hover:underline">
                            <ThumbsUp className="w-3 h-3" /> Helpful
                          </button>
                          <button className="text-[9px] font-black text-gray-400 flex items-center gap-1 hover:underline">
                            <MessageCircle className="w-3 h-3" /> Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ MESSAGES TAB ═══ */}
          {activeTab === 'messages' && (
            <div className="space-y-0 animate-fade-in">
              <div className="mb-5">
                <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest block">Direct Communication</span>
                <h2 className="font-serif text-xl font-black text-gray-900">Patient Messages</h2>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex h-[550px]">
                {/* Conversation List */}
                <div className="w-72 border-r border-gray-100 flex flex-col shrink-0">
                  <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                      <input type="text" placeholder="Search messages..." className="w-full bg-[#F8FFF8] border border-gray-100 rounded-xl pl-9 pr-3 py-2 text-[10px] font-semibold focus:outline-none" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {conversations.map(conv => (
                      <button
                        key={conv.id}
                        onClick={() => { setActiveConversation(conv); setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unread: false } : c)); }}
                        className={`w-full flex items-center gap-3 p-4 text-left border-b border-gray-50 hover:bg-[#F8FFF8] transition-colors ${activeConversation?.id === conv.id ? 'bg-[#F8FFF8] border-l-2 border-l-[#2E7D32]' : ''}`}
                      >
                        <div className="relative shrink-0">
                          <img src={conv.photo} alt="" className="w-9 h-9 rounded-xl object-cover border border-gray-100" />
                          {conv.unread && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#2E7D32] rounded-full border border-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-xs font-black truncate ${conv.unread ? 'text-gray-900' : 'text-gray-600'}`}>{conv.patientName}</p>
                            <span className="text-[9px] text-gray-400 font-semibold shrink-0 ml-1">{conv.time}</span>
                          </div>
                          <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">{conv.message}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Area */}
                {activeConversation ? (
                  <div className="flex-1 flex flex-col">
                    <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-[#F8FFF8]">
                      <img src={activeConversation.photo} alt="" className="w-9 h-9 rounded-xl object-cover border border-gray-100" />
                      <div>
                        <p className="text-xs font-black text-gray-900">{activeConversation.patientName}</p>
                        <p className="text-[9px] text-[#2E7D32] font-bold">Online</p>
                      </div>
                      <div className="ml-auto flex gap-2">
                        <button className="p-2 text-gray-400 hover:bg-white rounded-xl transition-colors"><Phone className="w-3.5 h-3.5" /></button>
                        <button className="p-2 text-gray-400 hover:bg-white rounded-xl transition-colors"><Video className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFFF9]/30">
                      {activeConversation.messages.map((msg: any, i: number) => (
                        <div key={i} className={`flex flex-col max-w-[75%] ${msg.sender === 'doctor' ? 'ml-auto items-end' : 'items-start'}`}>
                          <div className={`px-4 py-2.5 rounded-2xl text-[11px] leading-relaxed font-semibold shadow-sm ${
                            msg.sender === 'doctor'
                              ? 'bg-[#2E7D32] text-white rounded-tr-none'
                              : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-[8px] text-gray-400 font-bold mt-1 px-1">{msg.time}</span>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 flex gap-2 bg-white">
                      <input
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        placeholder="Type your clinical advice or message..."
                        className="flex-1 bg-[#F8FFF8] border border-gray-100 rounded-xl px-4 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#2E7D32]/40"
                      />
                      <button type="submit" disabled={!chatInput.trim()} className="bg-[#2E7D32] text-white p-2.5 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-40">
                        <Send className="w-4 h-4 text-[#D4AF37]" />
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-300">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-bold text-gray-400">Select a conversation</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ NOTIFICATIONS TAB ═══ */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fade-in max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest block">Activity Center</span>
                  <h2 className="font-serif text-xl font-black text-gray-900">Notifications</h2>
                </div>
                <button
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                  className="text-[10px] font-black text-[#2E7D32] hover:underline flex items-center gap-1"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Mark all read
                </button>
              </div>
              <div className="space-y-3">
                {notifications.map(notif => {
                  const iconMap: Record<string, { icon: any; color: string }> = {
                    appointment: { icon: Calendar, color: 'bg-[#F8FFF8] text-[#2E7D32] border-[#2E7D32]/20' },
                    alert: { icon: AlertCircle, color: 'bg-red-50 text-red-500 border-red-100' },
                    review: { icon: Star, color: 'bg-amber-50 text-amber-600 border-amber-100' },
                    payment: { icon: DollarSign, color: 'bg-purple-50 text-purple-600 border-purple-100' },
                    document: { icon: FileText, color: 'bg-blue-50 text-blue-600 border-blue-100' },
                    report: { icon: BarChart2, color: 'bg-gray-50 text-gray-600 border-gray-200' },
                  };
                  const { icon: Icon, color } = iconMap[notif.type] || { icon: Bell, color: 'bg-gray-50 text-gray-500 border-gray-100' };
                  return (
                    <div key={notif.id} className={`bg-white rounded-2xl border p-4 shadow-sm flex items-start gap-4 transition-all ${!notif.read ? 'border-[#2E7D32]/20 shadow-[#2E7D32]/5' : 'border-gray-100'}`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-black text-gray-900">{notif.title}</p>
                          {!notif.read && <span className="w-2 h-2 bg-[#2E7D32] rounded-full" />}
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5 leading-relaxed">{notif.message}</p>
                        <p className="text-[9px] text-gray-400 font-semibold mt-1">{notif.time}</p>
                      </div>
                      {!notif.read && (
                        <button onClick={() => dismissNotification(notif.id)} className="text-gray-300 hover:text-gray-500 transition-colors shrink-0">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ PROFILE TAB ═══ */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in max-w-3xl">
              <div>
                <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest block">Professional Identity</span>
                <h2 className="font-serif text-xl font-black text-gray-900">Doctor Profile</h2>
              </div>

              {/* Profile Header Card */}
              <div className="bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-emerald-600 rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl" />
                <div className="relative z-10 flex items-start gap-5">
                  <img src={DOCTOR_PROFILE.photo} alt="" className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-xl shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest block mb-1">Verified Physician</span>
                    <h3 className="font-serif font-black text-xl leading-tight">{DOCTOR_PROFILE.name}</h3>
                    <p className="text-xs text-white/70 font-medium mt-1">{DOCTOR_PROFILE.specialization}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {DOCTOR_PROFILE.qualifications.map((q, i) => (
                        <span key={i} className="text-[9px] font-black px-2.5 py-1 bg-white/15 border border-white/20 rounded-full">{q}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="relative z-10 grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-white/10">
                  <div className="text-center">
                    <p className="font-black text-lg text-[#D4AF37]">{DOCTOR_PROFILE.totalPatients.toLocaleString()}</p>
                    <p className="text-[9px] text-white/60 font-bold">Total Patients</p>
                  </div>
                  <div className="text-center border-x border-white/10">
                    <p className="font-black text-lg text-[#D4AF37]">{DOCTOR_PROFILE.rating} ⭐</p>
                    <p className="text-[9px] text-white/60 font-bold">Avg. Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="font-black text-lg text-[#D4AF37]">{DOCTOR_PROFILE.experience}</p>
                    <p className="text-[9px] text-white/60 font-bold">Experience</p>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
                <h3 className="font-bold text-gray-900 text-xs border-b border-gray-50 pb-3">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', value: DOCTOR_PROFILE.name },
                    { label: 'Email Address', value: DOCTOR_PROFILE.email },
                    { label: 'Phone Number', value: DOCTOR_PROFILE.phone },
                    { label: 'Clinic', value: DOCTOR_PROFILE.clinic },
                    { label: 'Consultation Fee', value: `₹${DOCTOR_PROFILE.consultationFee} / session` },
                    { label: 'Languages', value: DOCTOR_PROFILE.languages.join(', ') },
                  ].map((field, i) => (
                    <div key={i} className="space-y-1">
                      <span className="text-[9px] uppercase font-black text-gray-400 tracking-wide">{field.label}</span>
                      <input
                        type="text"
                        disabled
                        value={field.value}
                        className="w-full bg-[#F8FFF8] border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-700 font-semibold outline-none"
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-black text-gray-400 tracking-wide">Professional Bio</span>
                  <textarea
                    disabled
                    rows={3}
                    value={DOCTOR_PROFILE.bio}
                    className="w-full bg-[#F8FFF8] border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-700 font-semibold outline-none resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-black text-gray-400 tracking-wide">Areas of Expertise</span>
                  <div className="flex flex-wrap gap-2">
                    {DOCTOR_PROFILE.specialExpertise.map((s, i) => (
                      <span key={i} className="text-[10px] font-black px-3 py-1.5 bg-[#F8FFF8] text-[#2E7D32] border border-[#2E7D32]/20 rounded-xl">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => navigate('/doctor-profile-settings')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#2E7D32] text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-[#F8FFF8] text-[#2E7D32] border border-[#2E7D32]/20 rounded-xl text-xs font-black hover:bg-emerald-50 transition-colors">
                    <Download className="w-3.5 h-3.5" /> Export Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
