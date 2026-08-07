import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { recruiterService } from '../../services/recruiterService';
import { companyService } from '../../services/companyService';
import { useNotification } from '../../context/NotificationContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Building2, Globe, MapPin, Save, Upload } from 'lucide-react';

export const CompanyProfile = () => {
  const { addToast } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('11-50');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [foundedYear, setFoundedYear] = useState('');
  const [description, setDescription] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const prof = await recruiterService.getProfile();
      if (prof && prof.company) {
        const comp = prof.company;
        setCompanyId(comp._id);
        setName(comp.name || '');
        setIndustry(comp.industry || '');
        setCompanySize(comp.companySize || '11-50');
        setWebsite(comp.website || '');
        setLocation(comp.location || '');
        setFoundedYear(comp.foundedYear || '');
        setDescription(comp.description || '');
        setLogoPreview(comp.logo?.url || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('industry', industry);
      formData.append('companySize', companySize);
      formData.append('website', website);
      formData.append('location', location);
      formData.append('foundedYear', foundedYear);
      formData.append('description', description);

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      if (companyId) {
        await companyService.updateCompany(companyId, formData);
        addToast('Company profile updated successfully!', 'success');
      } else {
        const newComp = await companyService.createCompany(formData);
        setCompanyId(newComp._id);
        addToast('Company profile created successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Company Branding</h1>
            <p className="text-xs text-gray-500">Configure your company identity, logo, and description for candidates</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 border space-y-6">
            {/* Logo Uploader */}
            <div className="flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-dark-border">
              <img
                src={logoPreview || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200'}
                alt="Company Logo"
                className="w-20 h-20 rounded-2xl object-cover border p-1 bg-white"
              />
              <div className="space-y-2">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 font-semibold text-xs border border-brand-200">
                  <Upload className="w-4 h-4" /> Upload Company Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setLogoFile(file);
                        setLogoPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-gray-400">Recommended size: 400x400px (PNG or JPG)</p>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                placeholder="e.g. TechCorp Nexus"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={Building2}
                required
              />
              <Input
                label="Industry Domain"
                placeholder="e.g. Information Technology"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Size</label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card"
                >
                  <option value="1-10">1-10 Employees</option>
                  <option value="11-50">11-50 Employees</option>
                  <option value="51-200">51-200 Employees</option>
                  <option value="201-500">201-500 Employees</option>
                  <option value="501-1000">501-1000 Employees</option>
                  <option value="1000+">1000+ Employees</option>
                </select>
              </div>
              <Input
                label="Headquarters Location"
                placeholder="Bengaluru, Karnataka"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                icon={MapPin}
                required
              />
              <Input
                label="Official Website"
                placeholder="https://company.example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                icon={Globe}
              />
              <Input
                label="Founded Year"
                type="number"
                placeholder="2020"
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Overview & Culture</label>
              <textarea
                rows={5}
                placeholder="Describe your company mission, product vision, engineering principles, and work culture..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card"
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg" isLoading={saving} icon={Save} className="font-semibold shadow-md">
                Save Company Profile
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
