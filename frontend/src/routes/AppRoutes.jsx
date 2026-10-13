import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Jobs from '../pages/Jobs.jsx';
import JobDetail from '../pages/JobDetail.jsx';
import PostJob from '../pages/PostJob.jsx';
import JobApplicants from '../pages/JobApplicants.jsx';
import Applications from '../pages/Applications.jsx';
import Alumni from '../pages/Alumni.jsx';
import Mentorship from '../pages/Mentorship.jsx';
import Events from '../pages/Events.jsx';
import Notifications from '../pages/Notifications.jsx';
import Profile from '../pages/Profile.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import AdminStudents from '../pages/AdminStudents.jsx';
import AdminApprovals from '../pages/AdminApprovals.jsx';
import NotFound from '../pages/NotFound.jsx';

const guard = (roles, element) => <ProtectedRoute roles={roles}>{element}</ProtectedRoute>;

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Shared (any authenticated role) */}
      <Route path="/dashboard" element={guard(undefined, <Dashboard />)} />
      <Route path="/jobs" element={guard(undefined, <Jobs />)} />
      <Route path="/jobs/:id" element={guard(undefined, <JobDetail />)} />
      <Route path="/alumni" element={guard(undefined, <Alumni />)} />
      <Route path="/events" element={guard(undefined, <Events />)} />
      <Route path="/notifications" element={guard(undefined, <Notifications />)} />
      <Route path="/profile" element={guard(undefined, <Profile />)} />

      {/* Student */}
      <Route path="/applications" element={guard(['student'], <Applications />)} />

      {/* Alumni / Admin */}
      <Route path="/post-job" element={guard(['alumni', 'admin'], <PostJob />)} />
      <Route path="/jobs/:id/applicants" element={guard(['alumni', 'admin'], <JobApplicants />)} />
      <Route path="/mentorship" element={guard(['student', 'alumni'], <Mentorship />)} />

      {/* Admin only */}
      <Route path="/admin" element={guard(['admin'], <AdminDashboard />)} />
      <Route path="/admin/students" element={guard(['admin'], <AdminStudents />)} />
      <Route path="/admin/alumni" element={guard(['admin'], <AdminApprovals />)} />

      {/* Fallbacks */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
