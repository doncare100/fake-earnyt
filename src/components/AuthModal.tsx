import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, MapPin, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!name || !email || !password || !zipCode) {
          setError('Please fill out all fields.');
          setLoading(false);
          return;
        }

        if (!/^\d{5}$/.test(zipCode.trim())) {
          setError('Please enter a valid 5-digit US ZIP Code.');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, zipCode })
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Failed to create account.');
        } else {
          onLoginSuccess(data.user);
          onClose();
        }
      } else {
        if (!email || !password) {
          setError('Please enter your email and password.');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Invalid email or password.');
        } else {
          onLoginSuccess(data.user);
          onClose();
        }
      }
    } catch (err) {
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'alex.morgan@us-earner.com', password: 'password123' })
      });
      const data = await res.json();
      if (data.user) {
        onLoginSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setError('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#12141c] border border-[#232738] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#1f2332] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#141e33] border border-[#233558] flex items-center justify-center font-bold text-sm text-[#3b82f6]">
              e
            </div>
            <span className="text-lg font-extrabold text-white">
              earn<span className="text-[#3b82f6]">yt</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1c202d] hover:bg-[#282f42] text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#1f2332] bg-[#0c0d12]">
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
              mode === 'register'
                ? 'border-[#3b82f6] text-[#3b82f6] bg-[#12141c]'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Create USA Account
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
              mode === 'login'
                ? 'border-[#3b82f6] text-[#3b82f6] bg-[#12141c]'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-950/60 border border-rose-800/60 rounded-xl p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-[#0b0c10] border border-[#202433] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#0b0c10] border border-[#202433] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0b0c10] border border-[#202433] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
                US ZIP Code (Verification)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="10001 (5 digits)"
                  className="w-full bg-[#0b0c10] border border-[#202433] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Required to verify United States residential region.
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20 mt-2"
          >
            {loading ? (
              <span>Processing...</span>
            ) : mode === 'register' ? (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Quick Demo Login Option */}
          <div className="pt-3 border-t border-[#1f2332] text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2 px-3 rounded-xl bg-[#161a26] hover:bg-[#202638] border border-[#262f45] text-zinc-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Quick Demo Sign In (Alex Morgan)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
