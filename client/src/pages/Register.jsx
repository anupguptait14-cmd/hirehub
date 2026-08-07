import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Mail, Lock, User, UserPlus, Briefcase, UserCheck, Building2, ShieldCheck } from 'lucide-react';

export const Register = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const initialRole = ['recruiter', 'admin'].includes(roleParam) ? roleParam : 'candidate';

  const { register } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const cleanEmail = email.trim();
      const cleanPass = password.trim();

      const res = await register({ name, email: cleanEmail, password: cleanPass, role });
      addToast(`Account created successfully! Welcome to HireHub, ${res.name}.`, 'success');

      if (res.role === 'admin') navigate('/admin/dashboard');
      else if (res.role === 'recruiter') navigate('/recruiter/dashboard');
      else navigate('/candidate/dashboard');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-md">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-gradient">HireHub</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create an Account</h2>
          <p className="text-xs text-gray-500">Join thousands of professionals and hiring companies</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="glass-card p-1.5 rounded-2xl border flex gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setRole('candidate')}
            className={`flex-1 py-2 px-2 sm:px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              role === 'candidate'
                ? 'bg-gradient-brand text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Candidate
          </button>

          <button
            type="button"
            onClick={() => setRole('recruiter')}
            className={`flex-1 py-2 px-2 sm:px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              role === 'recruiter'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Employer
          </button>

          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 px-2 sm:px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              role === 'admin'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </button>
        </div>

        {/* Form */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border shadow-xl space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Aarav Patel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              minLength={6}
              required
            />

            <Button
              type="submit"
              size="lg"
              isLoading={loading}
              icon={UserPlus}
              variant={role === 'admin' ? 'danger' : 'primary'}
              className="w-full mt-2 font-semibold"
            >
              Create {role === 'recruiter' ? 'Employer' : role === 'admin' ? 'Admin' : 'Candidate'} Account
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-dark-border text-center text-xs text-gray-500">
            Already have an account?{' '}
            <Link to={`/login?role=${role}`} className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
