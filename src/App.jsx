import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SurveyProvider } from './context/SurveyContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import SurveyForm from './views/SurveyForm';
import VerificationList from './views/VerificationList';
import AuditLogs from './views/AuditLogs';
import UserProfile from './views/UserProfile';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <SurveyProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="survey" element={<SurveyForm />} />
                <Route path="verification" element={<VerificationList />} />
                <Route path="audit-logs" element={<AuditLogs />} />
                <Route path="profile" element={<UserProfile />} />
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </SurveyProvider>
    </AuthProvider>
  );
}

export default App;
