import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/Toast';
import { ProtectedRoute } from './components/protected/ProtectedRoute';
import { RoleRoute } from './components/protected/RoleRoute';

// Public Pages
import { Home } from './pages/Home';
import { Jobs } from './pages/Jobs';
import { JobDetails } from './pages/JobDetails';
import { Companies } from './pages/Companies';
import { CompanyDetails } from './pages/CompanyDetails';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { NotFound } from './pages/NotFound';

// Unified Profile Settings Page
import { ProfileSettings } from './pages/ProfileSettings';

// Candidate Pages
import { CandidateDashboard } from './pages/candidate/Dashboard';
import { CandidateProfile } from './pages/candidate/Profile';
import { CandidateApplications } from './pages/candidate/Applications';
import { CandidateSavedJobs } from './pages/candidate/SavedJobs';

// Recruiter Pages
import { RecruiterDashboard } from './pages/recruiter/Dashboard';
import { CompanyProfile } from './pages/recruiter/CompanyProfile';
import { PostJob } from './pages/recruiter/PostJob';
import { ManageJobs } from './pages/recruiter/ManageJobs';
import { JobApplicants } from './pages/recruiter/JobApplicants';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { ManageUsers } from './pages/admin/ManageUsers';
import { ManageAdminJobs } from './pages/admin/ManageJobs';
import { ManageCompanies } from './pages/admin/ManageCompanies';

export function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/jobs/:id" element={<JobDetails />} />
                  <Route path="/companies" element={<Companies />} />
                  <Route path="/companies/:id" element={<CompanyDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />

                  {/* Authenticated User Settings (Candidate, Recruiter, Admin) */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/profile-settings" element={<ProfileSettings />} />
                  </Route>

                  {/* Protected Candidate Routes */}
                  <Route element={<RoleRoute allowedRoles={['candidate']} />}>
                    <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
                    <Route path="/candidate/profile" element={<CandidateProfile />} />
                    <Route path="/candidate/applications" element={<CandidateApplications />} />
                    <Route path="/candidate/saved-jobs" element={<CandidateSavedJobs />} />
                  </Route>

                  {/* Protected Recruiter Routes */}
                  <Route element={<RoleRoute allowedRoles={['recruiter']} />}>
                    <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
                    <Route path="/recruiter/company-profile" element={<CompanyProfile />} />
                    <Route path="/recruiter/post-job" element={<PostJob />} />
                    <Route path="/recruiter/manage-jobs" element={<ManageJobs />} />
                    <Route path="/recruiter/jobs/:jobId/applicants" element={<JobApplicants />} />
                  </Route>

                  {/* Protected Admin Routes */}
                  <Route element={<RoleRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<ManageUsers />} />
                    <Route path="/admin/jobs" element={<ManageAdminJobs />} />
                    <Route path="/admin/companies" element={<ManageCompanies />} />
                  </Route>

                  {/* Fallback 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Footer />
              <ToastContainer />
            </div>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
