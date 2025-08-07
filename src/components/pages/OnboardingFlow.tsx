'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/context/AuthContext';
import { CheckCircle } from 'lucide-react';

interface PageProps {
  setCurrentPage: (page: string) => void;
}

interface ProfileData {
  latest_position: string;
  is_current: boolean;
  start_date: string;
  end_date: string;
  location: string;
  skills: string[];
  phone: string;
  bio: string;
}

export const OnboardingFlow: React.FC<PageProps> = ({ setCurrentPage }) => {
  const { updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    latest_position: '',
    is_current: false,
    start_date: '',
    end_date: '',
    location: '',
    skills: [],
    phone: '',
    bio: '',
  });

  const skills = [
    'Customer Service', 'Cash Handling', 'POS Systems', 'Wine Knowledge',
    'Cocktail Making', 'Food Safety', 'Team Leadership', 'Event Management',
    'Inventory Management', 'Cleaning & Sanitization', 'Fine Dining',
    'Catering', 'Hotel Operations', 'Conflict Resolution'
  ];

  const handleSkillToggle = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleComplete = async () => {
    setLoading(true);
    const updates = {
      current_position: profileData.latest_position,
      location: profileData.location,
      skills: profileData.skills,
      phone: profileData.phone,
      bio: profileData.bio,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    };
    const { error } = await updateProfile(updates);
    if (!error) setCurrentPage('dashboard');
    setLoading(false);
  };

  if (step === 1) {
    return (
      <div className="p-4 max-w-2xl mx-auto bg-white shadow rounded-lg mt-10">
        <h2 className="text-xl font-semibold mb-4">Your Most Recent Role</h2>
        <input type="text" placeholder="Position (e.g. Barista)" className="input mb-4"
          value={profileData.latest_position}
          onChange={(e) => setProfileData({ ...profileData, latest_position: e.target.value })}
        />
        <input type="text" placeholder="Location (e.g. Hobart - TAS)" className="input mb-4"
          value={profileData.location}
          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
        />
        <div className="flex gap-4 mb-4">
          <input type="date" className="input" value={profileData.start_date}
            onChange={(e) => setProfileData({ ...profileData, start_date: e.target.value })}
          />
          {!profileData.is_current && (
            <input type="date" className="input" value={profileData.end_date}
              onChange={(e) => setProfileData({ ...profileData, end_date: e.target.value })}
            />
          )}
        </div>
        <label className="inline-flex items-center mb-6">
          <input type="checkbox" className="mr-2"
            checked={profileData.is_current}
            onChange={(e) => setProfileData({ ...profileData, is_current: e.target.checked })}
          />
          I currently work here
        </label>
        <button className="btn w-full" onClick={() => setStep(2)}>Next</button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="p-4 max-w-2xl mx-auto bg-white shadow rounded-lg mt-10">
        <h2 className="text-xl font-semibold mb-4">Select Your Skills</h2>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {skills.map(skill => (
            <button key={skill} onClick={() => handleSkillToggle(skill)}
              className={`px-3 py-2 rounded border text-sm ${profileData.skills.includes(skill)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-100 text-gray-800 border-gray-300'}`}>
              {skill}
            </button>
          ))}
        </div>
        <div className="flex justify-between">
          <button className="btn bg-gray-300" onClick={() => setStep(1)}>Back</button>
          <button className="btn" onClick={() => setStep(3)}>Next</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white shadow rounded-lg mt-10">
      <h2 className="text-xl font-semibold mb-4">Final Details</h2>
      <input type="tel" className="input mb-4" placeholder="Phone (optional)"
        value={profileData.phone}
        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
      />
      <textarea rows={4} className="input mb-4" placeholder="Short bio"
        value={profileData.bio}
        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
      />
      <div className="flex justify-between">
        <button className="btn bg-gray-300" onClick={() => setStep(2)}>Back</button>
        <button className="btn" disabled={loading} onClick={handleComplete}>
          {loading ? 'Submitting...' : 'Finish Onboarding'}
        </button>
      </div>
    </div>
  );
};
