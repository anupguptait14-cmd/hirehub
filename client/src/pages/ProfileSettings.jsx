import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { authService } from '../services/authService';
import { candidateService } from '../services/candidateService';
import { recruiterService } from '../services/recruiterService';
import { Sidebar } from '../components/layout/Sidebar';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import {
  User,
  Mail,
  Lock,
  Camera,
  Save,
  ShieldCheck,
  Building2,
  Briefcase,
  FileText,
  KeyRound,
  MapPin,
  Upload,
  Globe,
  Github,
  Linkedin,
  Plus,
} from 'lucide-react';

export const ProfileSettings = () => {
  const { user, updateUser, role, checkAuth } = useAuth();
  const { addToast } = useNotification();

  const [activeTab, setActiveTab] = useState('account'); // 'account' | 'security' | 'role_profile'

  // Basic Info state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [updatingAccount, setUpdatingAccount] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Security / Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Recruiter Profile state
  const [designation, setDesignation] = useState('');
  const [recruiterPhone, setRecruiterPhone] = useState('');
  const [savingRecruiter, setSavingRecruiter] = useState(false);

  // Candidate Profile state
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [resumeInfo, setResumeInfo] = useState(null);
  const [savingCandidate, setSavingCandidate] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatarPreview(user.avatar?.url || '');
    }
    fetchRoleDetails();
  }, [user]);

  const fetchRoleDetails = async () => {
    try {
      if (role === 'recruiter') {
        const prof = await recruiterService.getProfile();
        if (prof) {
          setDesignation(prof.designation || '');
          setRecruiterPhone(prof.phone || '');
        }
      } else if (role === 'candidate') {
        const prof = await candidateService.getProfile();
        if (prof) {
          setHeadline(prof.headline || '');
          setBio(prof.bio || '');
          setLocation(prof.location || '');
          setPhone(prof.phone || '');
          setWebsite(prof.website || '');
          setGithub(prof.github || '');
          setLinkedin(prof.linkedin || '');
          setSkills(prof.skills || []);
          setResumeInfo(prof.resume || null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Basic Account Profile Save (Name, Email)
  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    try {
      setUpdatingAccount(true);
      const updated = await authService.updateProfile({ name, email });
      updateUser(updated);
      addToast('Profile name and email updated successfully!', 'success');
      await checkAuth();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setUpdatingAccount(false);
    }
  };

  // Handle Avatar Image Upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await authService.uploadAvatar(formData);
      updateUser({ avatar: res.avatar });
      addToast('Profile picture updated successfully!', 'success');
      await checkAuth();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle Password Update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }

    try {
      setUpdatingPassword(true);
      await authService.updatePassword({ currentPassword, newPassword });
      addToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Handle Recruiter Profile Update
  const handleSaveRecruiterProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingRecruiter(true);
      await recruiterService.updateProfile({ designation, phone: recruiterPhone });
      addToast('Recruiter profile details saved successfully!', 'success');
      await checkAuth();
      await fetchRoleDetails();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSavingRecruiter(false);
    }
  };

  // Handle Candidate Profile Update
  const handleSaveCandidateProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingCandidate(true);
      await candidateService.updateProfile({
        headline,
        bio,
        location,
        phone,
        website,
        github,
        linkedin,
        skills,
      });
      addToast('Candidate details saved successfully!', 'success');
      await checkAuth();
      await fetchRoleDetails();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSavingCandidate(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await candidateService.uploadResume(formData);
      setResumeInfo(res.resume);
      addToast('Resume uploaded successfully!', 'success');
      await checkAuth();
      await fetchRoleDetails();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (s) => setSkills(skills.filter((item) => item !== s));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />

        <main className="flex-1 space-y-6">
          {/* Top Header Card */}
          <div className="glass-card rounded-3xl p-6 border flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <img
                  src={avatarPreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                  alt={name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-brand-500 shadow-md"
                />
                <label className="absolute bottom-0 right-0 p-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full cursor-pointer shadow-lg transition-transform group-hover:scale-110">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{user?.name}</h1>
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300">
                    {user?.role}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <p className="text-[11px] text-gray-400">Click camera icon to update profile picture</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="glass-card p-1.5 rounded-2xl border flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('account')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'account'
                  ? 'bg-gradient-brand text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover'
              }`}
            >
              <User className="w-4 h-4" /> Basic Account Profile
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'security'
                  ? 'bg-gradient-brand text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover'
              }`}
            >
              <KeyRound className="w-4 h-4" /> Password & Security
            </button>

            <button
              onClick={() => setActiveTab('role_profile')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'role_profile'
                  ? 'bg-gradient-brand text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover'
              }`}
            >
              {role === 'candidate' && <FileText className="w-4 h-4" />}
              {role === 'recruiter' && <Building2 className="w-4 h-4" />}
              {role === 'admin' && <ShieldCheck className="w-4 h-4" />}
              {role === 'candidate' ? 'Candidate Bio & Resume' : role === 'recruiter' ? 'Recruiter Details' : 'Admin Privileges'}
            </button>
          </div>

          {/* TAB 1: Basic Account Profile */}
          {activeTab === 'account' && (
            <div className="glass-card rounded-2xl p-6 border space-y-6 animate-fade-in">
              <div className="pb-3 border-b border-gray-100 dark:border-dark-border">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Personal Details</h2>
                <p className="text-xs text-gray-500">Update your account display name and primary email address</p>
              </div>

              <form onSubmit={handleUpdateAccount} className="space-y-4 max-w-lg">
                <Input
                  label="Full Display Name"
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

                <div className="pt-2">
                  <Button type="submit" isLoading={updatingAccount} icon={Save} className="font-semibold shadow-md">
                    Update Account Info
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Password & Security */}
          {activeTab === 'security' && (
            <div className="glass-card rounded-2xl p-6 border space-y-6 animate-fade-in">
              <div className="pb-3 border-b border-gray-100 dark:border-dark-border">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Change Account Password</h2>
                <p className="text-xs text-gray-500">Ensure your password is at least 6 characters long</p>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  icon={Lock}
                  required
                />

                <Input
                  label="New Password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  icon={Lock}
                  minLength={6}
                  required
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={Lock}
                  minLength={6}
                  required
                />

                <div className="pt-2">
                  <Button type="submit" isLoading={updatingPassword} icon={KeyRound} className="font-semibold shadow-md">
                    Change Password
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: Role-Specific Profile */}
          {activeTab === 'role_profile' && (
            <div className="space-y-6 animate-fade-in">
              {/* RECRUITER ROLE PROFILE */}
              {role === 'recruiter' && (
                <div className="glass-card rounded-2xl p-6 border space-y-6">
                  <div className="pb-3 border-b border-gray-100 dark:border-dark-border">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recruiter Profile Information</h2>
                    <p className="text-xs text-gray-500">Update your hiring title and contact details shown to job applicants</p>
                  </div>

                  <form onSubmit={handleSaveRecruiterProfile} className="space-y-4 max-w-lg">
                    <Input
                      label="Designation / Hiring Title"
                      placeholder="e.g. Senior Talent Acquisition Lead"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      icon={Briefcase}
                      required
                    />

                    <Input
                      label="Contact Phone Number"
                      placeholder="+91 98765 43210"
                      value={recruiterPhone}
                      onChange={(e) => setRecruiterPhone(e.target.value)}
                    />

                    <div className="pt-2">
                      <Button type="submit" isLoading={savingRecruiter} icon={Save} className="font-semibold shadow-md">
                        Save Recruiter Profile
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* CANDIDATE ROLE PROFILE */}
              {role === 'candidate' && (
                <div className="space-y-6">
                  {/* Resume Upload Box */}
                  <div className="glass-card rounded-2xl p-6 border space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <FileText className="w-5 h-5 text-brand-500" />
                      Resume Document
                    </h2>

                    {resumeInfo?.url ? (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-dark-hover border">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-brand-600 shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{resumeInfo.fileName || 'Resume.pdf'}</p>
                            <p className="text-xs text-gray-400">Uploaded on {new Date(resumeInfo.uploadedAt || Date.now()).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <a
                            href={resumeInfo.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                          >
                            View / Download
                          </a>
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold hover:bg-gray-100 dark:hover:bg-dark-border">
                            <Upload className="w-3.5 h-3.5" /> Replace
                            <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 dark:border-dark-border rounded-xl p-6 text-center space-y-3">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">Upload your resume in PDF or DOC format (Max 10MB)</p>
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gradient-brand text-white rounded-xl text-xs font-semibold shadow">
                          Browse Resume File
                          <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Candidate Bio & Details Form */}
                  <form onSubmit={handleSaveCandidateProfile} className="space-y-6">
                    <div className="glass-card rounded-2xl p-6 border space-y-4">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Bio & Social Connections</h2>

                      <Input
                        label="Professional Headline"
                        placeholder="e.g. Full Stack MERN Developer | React & Node Specialist"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                      />

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Short Bio</label>
                        <textarea
                          rows={4}
                          placeholder="Summarize your technical background, passions, and key achievements..."
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="Location" placeholder="Bengaluru, Karnataka" value={location} onChange={(e) => setLocation(e.target.value)} icon={MapPin} />
                        <Input label="Phone Number" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Input label="Website / Portfolio" placeholder="https://aaravpatel.dev" value={website} onChange={(e) => setWebsite(e.target.value)} icon={Globe} />
                        <Input label="GitHub URL" placeholder="https://github.com/aaravpatel" value={github} onChange={(e) => setGithub(e.target.value)} icon={Github} />
                        <Input label="LinkedIn URL" placeholder="https://linkedin.com/in/aaravpatel" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} icon={Linkedin} />
                      </div>
                    </div>

                    {/* Skills Tag Manager */}
                    <div className="glass-card rounded-2xl p-6 border space-y-4">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Skills & Tech Stack</h2>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type a skill (e.g. React.js, Express, MongoDB)..."
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addSkill();
                            }
                          }}
                          className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card"
                        />
                        <Button type="button" onClick={addSkill} icon={Plus}>Add</Button>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-200"
                          >
                            {s}
                            <button type="button" onClick={() => removeSkill(s)} className="hover:text-rose-500">
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" size="lg" isLoading={savingCandidate} icon={Save} className="font-semibold shadow-md">
                        Save Candidate Profile
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* ADMIN ROLE PROFILE */}
              {role === 'admin' && (
                <div className="glass-card rounded-2xl p-6 border space-y-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-rose-500" />
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Super Administrator Privileges</h2>
                      <p className="text-xs text-gray-500">System governance, user moderation, and platform oversight active.</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    As an Admin, you can update your basic account details and password above, as well as moderate users, jobs, and companies via the Admin Sidebar menu.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
