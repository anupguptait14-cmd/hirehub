import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useNotification } from '../context/NotificationContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';

export const ForgotPassword = () => {
  const { addToast } = useNotification();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoToken, setDemoToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await authService.forgotPassword(email);
      addToast(res.message, 'success');
      if (res.resetToken) {
        setDemoToken(res.resetToken);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Forgot Password</h2>
          <p className="text-xs text-gray-500">Enter your registered email address to receive password reset instructions</p>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8 border shadow-xl space-y-4">
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
            <Button type="submit" size="lg" isLoading={loading} className="w-full font-semibold">
              Send Reset Link
            </Button>
          </form>

          {demoToken && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs rounded-xl space-y-2">
              <p className="font-semibold text-emerald-800 dark:text-emerald-300">Demo Reset Token Generated:</p>
              <Link
                to={`/reset-password/${demoToken}`}
                className="inline-block text-brand-600 font-mono font-bold underline break-all"
              >
                Click here to reset password with token
              </Link>
            </div>
          )}

          <div className="text-center pt-2">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-600">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
