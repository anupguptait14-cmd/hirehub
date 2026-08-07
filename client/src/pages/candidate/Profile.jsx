import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { candidateService } from '../../services/candidateService';
import { useNotification } from '../../context/NotificationContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Upload,
  Plus,
  Trash2,
  Save,
  FileText,
  Globe,
  Github,
  Linkedin,
} from 'lucide-react';

export const CandidateProfile = () => {
  const { addToast } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);

  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [resumeInfo, setResumeInfo] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await candidateService.getProfile();
      if (data) {
        setHeadline(data.headline || '');
        setBio(data.bio || '');
        setLocation(data.location || '');
        setPhone(data.phone || '');
        setWebsite(data.website || '');
        setGithub(data.github || '');
        setLinkedin(data.linkedin || '');
        setSkills(data.skills || []);
        setExperience(data.experience || []);
        setEducation(data.education || []);
        setResumeInfo(data.resume || null);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await candidateService.updateProfile({
        headline,
        bio,
        location,
        phone,
        website,
        github,
        linkedin,
        skills,
        experience,
        education,
      });
      addToast('Candidate profile saved successfully!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
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

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const addExperience = () => {
    setExperience([
      ...experience,
      { company: '', position: '', startDate: '', endDate: '', current: false, description: '' },
    ]);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  const removeExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducation([
      ...education,
      { institution: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' },
    ]);
  };

  const updateEducation = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />

        <main className="flex-1 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Profile Builder</h1>
            <p className="text-xs text-gray-500">Manage your skills, experience, portfolio links, and resume</p>
          </div>

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

          {/* Main Profile Details Form */}
          <form onSubmit={handleSaveProfile} className="space-y-8">
            {/* Basic Info */}
            <div className="glass-card rounded-2xl p-6 border space-y-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Basic Information</h2>

              <Input
                label="Professional Headline"
                placeholder="e.g. Senior Full Stack Engineer (MERN / React / Node)"
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
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-200"
                  >
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-rose-500">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div className="glass-card rounded-2xl p-6 border space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-500" /> Work Experience
                </h2>
                <Button type="button" variant="outline" size="sm" icon={Plus} onClick={addExperience}>
                  Add Experience
                </Button>
              </div>

              {experience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-dark-border space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeExperience(idx)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input label="Company Name" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} required />
                    <Input label="Job Title / Position" value={exp.position} onChange={(e) => updateExperience(idx, 'position', e.target.value)} required />
                    <Input label="Start Date (YYYY-MM)" value={exp.startDate} onChange={(e) => updateExperience(idx, 'startDate', e.target.value)} required />
                    <Input label="End Date (YYYY-MM)" value={exp.endDate} onChange={(e) => updateExperience(idx, 'endDate', e.target.value)} disabled={exp.current} />
                  </div>
                </div>
              ))}
            </div>

            {/* Education Section */}
            <div className="glass-card rounded-2xl p-6 border space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-purple-500" /> Education
                </h2>
                <Button type="button" variant="outline" size="sm" icon={Plus} onClick={addEducation}>
                  Add Education
                </Button>
              </div>

              {education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-dark-border space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input label="Institution / University" value={edu.institution} onChange={(e) => updateEducation(idx, 'institution', e.target.value)} required />
                    <Input label="Degree / Certificate" value={edu.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} required />
                    <Input label="Start Year" value={edu.startYear} onChange={(e) => updateEducation(idx, 'startYear', e.target.value)} />
                    <Input label="End Year" value={edu.endYear} onChange={(e) => updateEducation(idx, 'endYear', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg" isLoading={saving} icon={Save} className="font-semibold shadow-md">
                Save Candidate Profile
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
