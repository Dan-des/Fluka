import React, { useState } from 'react';
import { ShieldAlert, Lock, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import type { ThemeMode } from '../types/store';

interface AdminLoginScreenProps {
  onLoginSuccess: () => void;
  theme?: ThemeMode;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({
  onLoginSuccess,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toUpperCase() === 'ADMIN' && password.trim().toUpperCase() === 'ADMIN') {
      setErrorMsg('');
      onLoginSuccess();
    } else {
      setErrorMsg('Access Denied: Invalid Admin Username or Password. (Hint: ADMIN / ADMIN)');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 animate-in fade-in duration-300">
      <div
        className={`border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Security Lock Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 via-indigo-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-xl shadow-rose-500/20">
            <div className={`h-full w-full rounded-[14px] flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
              <ShieldAlert className="w-8 h-8 text-rose-500 animate-pulse" />
            </div>
          </div>

          <div>
            <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-md text-[10px] font-bold font-mono tracking-wider">
              RESTRICTED ROOT ACCESS
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">Admin Portal Authentication</h2>
            <p className="text-xs text-slate-400 mt-1">
              Please enter your administrator credentials to manage merchants and marketplace products.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-400 text-xs font-semibold flex items-center gap-2 animate-in shake duration-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin Username</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. ADMIN"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Admin Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-600 via-indigo-600 to-cyan-600 hover:from-rose-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Unlock Admin Control Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-1 border-t border-slate-800/80">
          <p className="text-[10px] text-slate-500">Default Credentials: Username <strong>ADMIN</strong> | Password <strong>ADMIN</strong></p>
        </div>
      </div>
    </div>
  );
};
