import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useRole } from './hooks/useRole';
import LoginPage            from './pages/LoginPage';
import GlobalDashboard      from './pages/GlobalDashboard';
import CeoDashboard         from './pages/CeoDashboard';
import ManagerDashboard     from './pages/ManagerDashboard';
import EmployeeDashboard    from './pages/EmployeeDashboard';
import AllLeads             from './pages/AllLeads';
import MyLeads              from './pages/MyLeads';
import LeadDetailsPage      from './pages/LeadDetailsPage';
import LeadAssignment       from './pages/LeadAssignment';
import MeetingSchedulerPage from './pages/MeetingSchedulerPage';
import TeamPerformancePage  from './pages/TeamPerformancePage';

function RoleGuard({ deny, children }) {
  const role = useRole();
  if (deny.includes(role)) return <Navigate to={`/dashboard/${role}`} replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                   element={<Navigate to="/login" replace />} />
        <Route path="/login"              element={<LoginPage />} />
        <Route path="/dashboard/global"   element={<GlobalDashboard />} />
        <Route path="/dashboard/ceo"      element={<RoleGuard deny={['manager','employee']}><CeoDashboard /></RoleGuard>} />
        <Route path="/dashboard/manager"  element={<RoleGuard deny={['ceo','employee']}><ManagerDashboard /></RoleGuard>} />
        <Route path="/dashboard/employee" element={<RoleGuard deny={['ceo','manager']}><EmployeeDashboard /></RoleGuard>} />
        <Route path="/leads"              element={<AllLeads />} />
        <Route path="/leads/my"           element={<MyLeads />} />
        <Route path="/leads/assign"       element={<RoleGuard deny={['ceo','employee']}><LeadAssignment /></RoleGuard>} />
        <Route path="/leads/:id"          element={<LeadDetailsPage />} />
        <Route path="/meetings"           element={<MeetingSchedulerPage />} />
        <Route path="/team"               element={<TeamPerformancePage />} />
        <Route path="*"                   element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
