import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Diseases from './pages/Diseases';
import Doctors from './pages/Doctors';
import DoctorProfile from './pages/DoctorProfile';
import Treatments from './pages/Treatments';
import TreatmentDetails from './pages/TreatmentDetails';
import Clinics from './pages/Clinics';
import ClinicProfile from './pages/ClinicProfile';
import Dashboard from './pages/Dashboard';
import RecoveryDashboard from './pages/RecoveryDashboard';
import DoshaAnalysisDashboard from './pages/DoshaAnalysisDashboard';
import DietPlannerDashboard from './pages/DietPlannerDashboard';
import AIAssistantDashboard from './pages/AIAssistantDashboard';
import ProfileSettingsDashboard from './pages/ProfileSettingsDashboard';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import About from './pages/About';
import DoctorProfileSettingsPage from './pages/DoctorProfileSettingsPage';

function App() {
  return (
    <Router>
      <div className="font-sans bg-background min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow pt-20"> {/* PT matches Navbar height roughly */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/diseases" element={<Diseases />} />
            <Route path="/treatments" element={<Treatments />} />
            <Route path="/treatments/:id" element={<TreatmentDetails />} />
            <Route path="/clinics" element={<Clinics />} />
            <Route path="/clinics/:id" element={<ClinicProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/recovery-tracker" element={<RecoveryDashboard />} />
            <Route path="/dosha-analysis" element={<DoshaAnalysisDashboard />} />
            <Route path="/diet-planner" element={<DietPlannerDashboard />} />
            <Route path="/ai-assistant" element={<AIAssistantDashboard />} />
            <Route path="/profile-settings" element={<ProfileSettingsDashboard />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboardPage />} />
            <Route path="/doctor-profile-settings" element={<DoctorProfileSettingsPage />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctor/:id" element={<DoctorProfile />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;