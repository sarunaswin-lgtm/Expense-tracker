import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  AtSign, 
  Phone, 
  Camera, 
  Check, 
  X, 
  Save, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  Upload
} from 'lucide-react';
import { api } from '../api';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

export function ProfileSettings({ initialProfile, onProfileUpdated, onCancel }) {
  const [formData, setFormData] = useState({
    name: 'Arunaswin S',
    email: 'arunaswin@wealthpulse.app',
    username: 'sarunaswin',
    phone_number: '+91 98765 43210',
    avatar_url: ''
  });

  const [initialData, setInitialData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [customAvatarInput, setCustomAvatarInput] = useState('');

  // Fetch strictly personal details from /api/user/profile
  useEffect(() => {
    async function loadPersonalProfile() {
      try {
        setFetching(true);
        const res = await api.getUserProfile();
        if (res.success && res.data) {
          const profile = {
            name: res.data.name || 'Arunaswin S',
            email: res.data.email || 'arunaswin@wealthpulse.app',
            username: res.data.username || 'sarunaswin',
            phone_number: res.data.phone_number || '+91 98765 43210',
            avatar_url: res.data.avatar_url || ''
          };
          setFormData(profile);
          setInitialData(profile);
        }
      } catch (err) {
        console.error('Failed to load personal profile:', err);
      } finally {
        setFetching(false);
      }
    }
    loadPersonalProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectPresetAvatar = (url) => {
    setFormData(prev => ({ ...prev, avatar_url: url }));
    setShowAvatarPicker(false);
  };

  const handleCustomAvatarSubmit = (e) => {
    e.preventDefault();
    if (customAvatarInput.trim()) {
      setFormData(prev => ({ ...prev, avatar_url: customAvatarInput.trim() }));
      setCustomAvatarInput('');
      setShowAvatarPicker(false);
    }
  };

  const handleReset = () => {
    setFormData(initialData);
    setStatusMessage({ type: 'info', text: 'Changes reverted.' });
    setTimeout(() => setStatusMessage(null), 3000);
    if (onCancel) onCancel();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await api.updateUserProfile(formData);
      if (res.success) {
        setInitialData(formData);
        setStatusMessage({ type: 'success', text: 'Personal profile updated successfully!' });
        if (onProfileUpdated) onProfileUpdated(res.data);
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Failed to update profile.' });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Error saving changes.' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // Helper for initials
  const getInitials = (name) => {
    if (!name) return 'AS';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (fetching) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
        <p className="text-xs text-slate-400">Loading personal profile details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Toast Alert */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-glow-emerald' 
            : statusMessage.type === 'error'
            ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 shadow-glow-rose'
            : 'bg-blue-950/40 border-blue-500/40 text-blue-300'
        }`}>
          {statusMessage.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden shadow-2xl">
        
        {/* Decorative ambient background */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/10 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <User className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
                Personal Profile Details
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage your personal identity, contact details, and account profile.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Account
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6 relative z-10">
          
          {/* 1. Avatar Section */}
          <div className="p-5 rounded-2xl bg-surface-card border border-white/5 flex flex-col sm:flex-row items-center gap-5">
            
            {/* Avatar Circle */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-glow-cyan flex items-center justify-center">
                {formData.avatar_url ? (
                  <img 
                    src={formData.avatar_url} 
                    alt={formData.name} 
                    className="w-full h-full object-cover rounded-[14px]"
                  />
                ) : (
                  <div className="w-full h-full bg-[#080c15] rounded-[14px] flex items-center justify-center font-bold font-heading text-xl sm:text-2xl text-cyan-400">
                    {getInitials(formData.name)}
                  </div>
                )}
              </div>

              {/* Camera Trigger */}
              <button
                type="button"
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                title="Change Avatar"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar Details & Preset Toggles */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="font-bold text-base text-white font-heading">Profile Photo</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                  {formData.avatar_url ? 'Custom URL' : 'Initials Avatar'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Customize your avatar using presets, an image link, or default initials.
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Choose Photo</span>
                </button>
                {formData.avatar_url && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, avatar_url: '' }))}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-300 transition-all"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Avatar Picker Drawer */}
          {showAvatarPicker && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-blue-500/30 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Select a preset avatar or paste image URL:</span>
                <button 
                  type="button" 
                  onClick={() => setShowAvatarPicker(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-3">
                {PRESET_AVATARS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectPresetAvatar(url)}
                    className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/10 hover:border-cyan-400 transition-all hover:scale-105"
                  >
                    <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* URL Input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={customAvatarInput}
                  onChange={(e) => setCustomAvatarInput(e.target.value)}
                  className="flex-1 bg-surface-card border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={handleCustomAvatarSubmit}
                  className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* 2. Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                Full Name
              </label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Arunaswin S"
                className="w-full bg-surface-card border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <AtSign className="w-3.5 h-3.5 text-indigo-400" />
                Username Handle
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-500 text-xs sm:text-sm font-semibold">@</span>
                <input
                  type="text"
                  required
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="sarunaswin"
                  className="w-full bg-surface-card border border-white/10 rounded-xl pl-8 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  Email Address
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> Verified
                </span>
              </label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-surface-card border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-surface-card border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>

          </div>

          {/* 3. Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
