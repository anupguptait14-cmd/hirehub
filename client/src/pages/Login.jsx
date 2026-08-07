import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Mail, Lock, LogIn, Briefcase, Sparkles } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await login({ email, password });
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

  const autofill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome Back</h2>
          <p className="text-xs text-gray-500">Sign in to access your recruitment portal</p>
        </div>

        {/* Demo Credentials Helper Box */}
        <div className="glass-card rounded-2xl p-4 border bg-gradient-to-br from-brand-50/50 to-transparent dark:from-brand-950/20 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300">
            <Sparkles className="w-4 h-4 text-brand-500" />
            Quick Demo Login Accounts:
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <button
              onClick={() => autofill('aarav@candidate.com', 'password123')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-dark-card border font-medium text-gray-700 dark:text-gray-300 hover:border-brand-500 transition-colors"
            >
              Candidate
            </button>
            <button
              onClick={() => autofill('recruiter@techcorp.com', 'password123')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-dark-card border font-medium text-gray-700 dark:text-gray-300 hover:border-brand-500 transition-colors"
            >
              Recruiter
            </button>
            <button
              onClick={() => autofill('admin@hirehub.com', 'password123')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-dark-card border font-medium text-gray-700 dark:text-gray-300 hover:border-brand-500 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
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

            <Button type="submit" size="lg" isLoading={loading} icon={LogIn} className="w-full mt-2 font-semibold">
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-dark-border text-center text-xs text-gray-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
