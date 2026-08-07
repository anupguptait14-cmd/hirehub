import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Mail, Lock, LogIn, Briefcase, UserCheck, Building2, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const initialRole = ['recruiter', 'admin'].includes(roleParam) ? roleParam : 'candidate';

  const { login } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await login({ email, password });

      // Validate selected role against registered user role
      if (res.role !== selectedRole) {
        const readableRole =
          res.role === 'recruiter'
            ? 'Employer / Recruiter'
            : res.role === 'admin'
            ? 'Admin'
            : 'Candidate';

        addToast(
          `Role Mismatch: This account is registered as a ${readableRole}. Please switch to the ${readableRole} tab to sign in.`,
          'warning'
        );
        setLoading(false);
        return;
      }

      addToast(`Welcome back, ${res.name}!`, 'success');

      if (res.role === 'admin') navigate('/admin/dashboard');
      else if (res.role === 'recruiter') navigate('/recruiter/dashboard');
      else navigate('/candidate/dashboard');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const roleConfigs = {
    candidate: {
      title: 'Candidate Login',
      subtitle: 'Sign in to search jobs and manage applications',
      badge: 'Job Seeker Portal',
      icon: UserCheck,
      color: 'bg-brand-600 text-white',
    },
    recruiter: {
      title: 'Employer Login',
      subtitle: 'Sign in to post jobs and review applicants',
      badge: 'Employer Portal',
      icon: Building2,
      color: 'bg-purple-600 text-white',
    },
    admin: {
      title: 'Admin Login',
      subtitle: 'Sign in for system analytics and moderation',
      badge: 'System Admin Portal',
      icon: ShieldCheck,
      color: 'bg-rose-600 text-white',
    },
  };

  const currentConfig = roleConfigs[selectedRole];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-md">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-gradient">HireHub</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentConfig.title}</h2>
          <p className="text-xs text-gray-500">{currentConfig.subtitle}</p>
        </div>

        {/* Separate Login Role Selector Tabs */}
        <div className="glass-card p-1.5 rounded-2xl border flex gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setSelectedRole('candidate')}
            className={`flex-1 py-2 px-2 sm:px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              selectedRole === 'candidate'
                ? 'bg-gradient-brand text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Candidate
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('recruiter')}
            className={`flex-1 py-2 px-2 sm:px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              selectedRole === 'recruiter'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Employer
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`flex-1 py-2 px-2 sm:px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              selectedRole === 'admin'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </button>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-dark-border">
            <span className="text-xs font-semibold text-gray-500">Signing in to:</span>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                selectedRole === 'candidate'
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-200'
                  : selectedRole === 'recruiter'
                  ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200'
              }`}
            >
              {currentConfig.badge}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder={
                selectedRole === 'candidate'
                  ? 'candidate@example.com'
                  : selectedRole === 'recruiter'
                  ? 'employer@company.com'
                  : 'admin@hirehub.com'
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
              />
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={loading}
              icon={LogIn}
              variant={selectedRole === 'admin' ? 'danger' : 'primary'}
              className="w-full mt-2 font-semibold"
            >
              Sign In as {selectedRole === 'recruiter' ? 'Employer' : selectedRole === 'admin' ? 'Admin' : 'Candidate'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-dark-border text-center text-xs text-gray-500">
            Don't have an account yet?{' '}
            <Link
              to={`/register?role=${selectedRole}`}
              className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
