import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import VoiceAdvisor from "./pages/VoiceAdvisor";
import LocalBusiness from "./pages/LocalBusiness";
import Opportunity from "./pages/Opportunity";
import Simulator from "./pages/Simulator";
import MoneyPlanner from "./pages/MoneyPlanner";
import SchemeMatcher from "./pages/SchemeMatcher";
import Reports from "./pages/Reports";
import Inventory from "./pages/Inventory";

import FinancialAnalysis from "./pages/FinancialAnalysis";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/voice-advisor" element={<ProtectedRoute><VoiceAdvisor /></ProtectedRoute>} />
          <Route path="/advisor" element={<ProtectedRoute><VoiceAdvisor /></ProtectedRoute>} />
          <Route path="/local-business" element={<ProtectedRoute><LocalBusiness /></ProtectedRoute>} />
          <Route path="/opportunity" element={<ProtectedRoute><Opportunity /></ProtectedRoute>} />
          <Route path="/simulator" element={<ProtectedRoute><Simulator /></ProtectedRoute>} />
          <Route path="/money-planner" element={<ProtectedRoute><MoneyPlanner /></ProtectedRoute>} />
          <Route path="/schemes" element={<ProtectedRoute><SchemeMatcher /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="/financial-analysis" element={<ProtectedRoute><FinancialAnalysis /></ProtectedRoute>} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
