import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';
import { jobService } from '../../services/jobService';
import { recruiterService } from '../../services/recruiterService';
import { useNotification } from '../../context/NotificationContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { WORK_MODES, JOB_TYPES, EXPERIENCE_LEVELS } from '../../utils/constants';
import { Briefcase, Send, Plus } from 'lucide-react';

export const PostJob = () => {
  const [searchParams] = useSearchParams();
  const editJobId = searchParams.get('edit');

  const navigate = useNavigate();
  const { addToast } = useNotification();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('On-site');
  const [jobType, setJobType] = useState('Full-time');
  const [experienceLevel, setExperienceLevel] = useState('Mid');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editJobId) {
      fetchEditJob();
    }
  }, [editJobId]);

  const fetchEditJob = async () => {
    try {
      const data = await jobService.getJobById(editJobId);
      setTitle(data.title || '');
      setLocation(data.location || '');
      setWorkMode(data.workMode || 'On-site');
      setJobType(data.jobType || 'Full-time');
      setExperienceLevel(data.experienceLevel || 'Mid');
      setSalaryMin(data.salaryMin || '');
      setSalaryMax(data.salaryMax || '');
      setSkills(Array.isArray(data.skills) ? data.skills.join(', ') : '');
      setDescription(data.description || '');
      setResponsibilities(Array.isArray(data.responsibilities) ? data.responsibilities.join('\n') : '');
      setRequirements(Array.isArray(data.requirements) ? data.requirements.join('\n') : '');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        title,
        location,
        workMode,
        jobType,
        experienceLevel,
        salaryMin,
        salaryMax,
        skills,
        description,
        responsibilities,
        requirements,
      };

      if (editJobId) {
        await jobService.updateJob(editJobId, payload);
        addToast('Job listing updated successfully!', 'success');
      } else {
        await jobService.createJob(payload);
        addToast('Job listing published successfully!', 'success');
      }

      navigate('/recruiter/manage-jobs');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {editJobId ? 'Edit Job Listing' : 'Post a New Job'}
            </h1>
            <p className="text-xs text-gray-500">Reach qualified tech professionals across the global HireHub network</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 border space-y-6">
            <Input
              label="Job Title"
              placeholder="e.g. Senior Full Stack Engineer (MERN)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Config Selectors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Work Mode</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card"
                >
                  {WORK_MODES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Job Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card"
                >
                  {JOB_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card"
                >
                  {EXPERIENCE_LEVELS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location & Salary Range */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Location"
                placeholder="Bengaluru, Karnataka or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <Input
                label="Min Salary (₹/year)"
                type="number"
                placeholder="1200000 (12 LPA)"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
              />
              <Input
                label="Max Salary (₹/year)"
                type="number"
                placeholder="1800000 (18 LPA)"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
              />
            </div>

            {/* Skills CSV */}
            <Input
              label="Required Skills (Comma separated)"
              placeholder="React.js, Node.js, Express.js, MongoDB, Tailwind CSS"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />

            {/* Overview Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Job Description</label>
              <textarea
                rows={4}
                placeholder="Provide a comprehensive summary of the team, product goals, and position overview..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card"
                required
              />
            </div>

            {/* Responsibilities */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Key Responsibilities (One per line)</label>
              <textarea
                rows={4}
                placeholder="- Design and develop clean API microservices&#10;- Optimize database queries&#10;- Collaborate in agile sprints"
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card"
              />
            </div>

            {/* Requirements */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Requirements & Qualifications (One per line)</label>
              <textarea
                rows={4}
                placeholder="- 4+ years software development experience&#10;- Strong knowledge of React and Node.js&#10;- Degree in Computer Science or equivalent"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => navigate('/recruiter/manage-jobs')}>
                Cancel
              </Button>
              <Button type="submit" size="lg" isLoading={submitting} icon={Send} className="font-semibold shadow-md">
                {editJobId ? 'Update Job Listing' : 'Publish Job Listing'}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
