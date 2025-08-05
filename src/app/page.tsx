"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User, MapPin, Clock, Briefcase, Users, LogOut, Menu, X, Phone, Mail, Award, Plus, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

// Supabase configuration
const SUPABASE_URL = 'https://fpcyvhbjpwtubwbkrwde.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwY3l2aGJqcHd0dWJ3Ymtyd2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNjM5MzgsImV4cCI6MjA2OTkzOTkzOH0.hS8uTcXOdNRlpYNtEm5e239uHHWprUdCzmncQW7A9X8';

// Real Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  auth: {
    signUp: async ({ email, password, options }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful signup
      const user = {
        id: `user_${Date.now()}`,
        email,
        user_metadata: options?.data || {},
        created_at: new Date().toISOString()
      };
      
      return {
        data: { user, session: { access_token: 'mock_token', user } },
        error: null
      };
    },
    
    signInWithPassword: async ({ email, password }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful signin
      const user = {
        id: 'user_123',
        email,
        user_metadata: { firstName: 'Alex', lastName: 'Johnson' },
        created_at: '2024-01-01T00:00:00Z'
      };
      
      return {
        data: { user, session: { access_token: 'mock_token', user } },
        error: null
      };
    },
    
    signOut: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { error: null };
    },
    
    getSession: async () => {
      return { data: { session: null }, error: null };
    },
    
    onAuthStateChange: (callback) => {
      // Mock auth state changes
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  
  from: (table) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null })
      })
    }),
    insert: async (data) => ({ data, error: null }),
    update: async (data) => ({ data, error: null }),
    upsert: async (data) => ({ data, error: null })
  })
});

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Check for existing session
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const signUp = async (userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            userType: userData.userType
          }
        }
      });

      if (error) throw error;
      
      // Create profile record
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          user_type: userData.userType,
          onboarding_completed: false,
          profile_completion: 10
        });
      }

      return { data, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Signin error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Signout error:', error);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (!error) {
        setProfile(prev => ({ ...prev, ...updates }));
      }
      
      return { data, error };
    } catch (error) {
      console.error('Profile update error:', error);
      return { data: null, error };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signUp, 
      signIn, 
      signOut, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Main App Component
const ServinlyApp = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AppRouter currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </AuthProvider>
  );
};

// Router Component
const AppRouter = ({ currentPage, setCurrentPage }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // Not authenticated
  if (!user) {
    switch (currentPage) {
      case 'signup':
        return <SignUpPage setCurrentPage={setCurrentPage} />;
      case 'signin':
        return <SignInPage setCurrentPage={setCurrentPage} />;
      default:
        return <LandingPage setCurrentPage={setCurrentPage} />;
    }
  }

  // Authenticated but not onboarded
  if (user && profile && !profile.onboarding_completed) {
    return <OnboardingFlow setCurrentPage={setCurrentPage} />;
  }

  // Authenticated and onboarded
  switch (currentPage) {
    case 'profile':
      return <ProfilePage setCurrentPage={setCurrentPage} />;
    case 'network':
      return <NetworkPage setCurrentPage={setCurrentPage} />;
    case 'jobs':
      return <JobsPage setCurrentPage={setCurrentPage} />;
    default:
      return <Dashboard setCurrentPage={setCurrentPage} />;
  }
};

// Loading Screen
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      <h2 className="text-2xl font-bold text-white mb-2">Servinly</h2>
      <p className="text-blue-100">Loading your professional platform...</p>
    </div>
  </div>
);

// Landing Page
const LandingPage = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">Servinly</span>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => setCurrentPage('signin')}
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => setCurrentPage('signup')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Your Hospitality Career<br />
            <span className="text-blue-200">Starts Here</span>
          </h1>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Build your professional profile, connect with industry peers, and discover opportunities that match your skills. 
            Take control of your hospitality career with Servinly.
          </p>
          <button 
            onClick={() => setCurrentPage('signup')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 shadow-lg transition-all transform hover:scale-105"
          >
            Start Building Your Profile
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for Hospitality Professionals</h2>
            <p className="text-xl text-gray-600">Everything you need to advance your career in one platform</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 hover:shadow-lg transition-shadow rounded-lg">
              <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Professional Profiles</h3>
              <p className="text-gray-600">Showcase your skills, certifications, and experience. Build a professional identity that follows you between jobs.</p>
            </div>
            
            <div className="text-center p-6 hover:shadow-lg transition-shadow rounded-lg">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Industry Network</h3>
              <p className="text-gray-600">Connect with other hospitality professionals. Share opportunities, advice, and grow your career network.</p>
            </div>
            
            <div className="text-center p-6 hover:shadow-lg transition-shadow rounded-lg">
              <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Smart Opportunities</h3>
              <p className="text-gray-600">Find shifts and positions that match your skills and availability. Work with multiple employers seamlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control?</h2>
          <p className="text-xl mb-8 text-gray-300">Join thousands of hospitality professionals building their careers on Servinly</p>
          <button 
            onClick={() => setCurrentPage('signup')}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  );
};

// Sign Up Page
const SignUpPage = ({ setCurrentPage }) => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: 'worker'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { data, error } = await signUp(formData);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Success - user will be redirected by the auth state change
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Join Servinly</h2>
          <p className="text-gray-600">Start building your hospitality career</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required
            />
          </div>
          
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (min 6 characters)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="worker"
                  checked={formData.userType === 'worker'}
                  onChange={(e) => setFormData({...formData, userType: e.target.value})}
                  className="mr-2"
                />
                Hospitality Professional
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="employer"
                  checked={formData.userType === 'employer'}
                  onChange={(e) => setFormData({...formData, userType: e.target.value})}
                  className="mr-2"
                />
                Employer
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <button 
            onClick={() => setCurrentPage('signin')}
            className="text-blue-600 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

// Sign In Page
const SignInPage = ({ setCurrentPage }) => {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await signIn(formData.email, formData.password);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your Servinly account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <button 
            onClick={() => setCurrentPage('signup')}
            className="text-blue-600 hover:underline"
          >
            Join Now
          </button>
        </p>
      </div>
    </div>
  );
};

// Onboarding Flow
const OnboardingFlow = ({ setCurrentPage }) => {
  const { updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    current_position: '',
    experience_level: '',
    location: '',
    skills: [],
    phone: '',
    bio: '',
    availability: []
  });

  const skills = [
    'Customer Service', 'Cash Handling', 'POS Systems', 'Wine Knowledge', 
    'Cocktail Making', 'Food Safety', 'Team Leadership', 'Event Management',
    'Inventory Management', 'Cleaning & Sanitization', 'Fine Dining', 
    'Catering', 'Hotel Operations', 'Conflict Resolution'
  ];

  const handleSkillToggle = (skill) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleComplete = async () => {
    setLoading(true);
    
    // Calculate profile completion percentage
    const completion = calculateCompletion();
    
    const updates = {
      ...profileData,
      onboarding_completed: true,
      profile_completion: completion,
      updated_at: new Date().toISOString()
    };

    const { error } = await updateProfile(updates);
    
    if (!error) {
      setCurrentPage('dashboard');
    }
    setLoading(false);
  };

  const calculateCompletion = () => {
    let score = 10; // Base score for signup
    
    if (profileData.current_position) score += 15;
    if (profileData.experience_level) score += 10;
    if (profileData.location) score += 10;
    if (profileData.skills.length > 0) score += 20;
    if (profileData.phone) score += 10;
    if (profileData.bio) score += 15;
    if (profileData.availability.length > 0) score += 10;
    
    return Math.min(score, 100);
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center mb-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Welcome to Servinly!</h2>
              <p className="text-gray-600">Let&apos;s build your professional profile in just a few steps</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <div className="flex-1 bg-blue-600 h-2 rounded-full"></div>
                <div className="flex-1 bg-gray-200 h-2 rounded-full ml-2"></div>
                <div className="flex-1 bg-gray-200 h-2 rounded-full ml-2"></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Step 1 of 3 - Basic Information</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Position</label>
                <input
                  type="text"
                  placeholder="e.g., Server, Bartender, Chef, Hotel Receptionist"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={profileData.current_position}
                  onChange={(e) => setProfileData({...profileData, current_position: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={profileData.experience_level}
                  onChange={(e) => setProfileData({...profileData, experience_level: e.target.value})}
                >
                  <option value="">Select your experience level</option>
                  <option value="entry">Entry Level (0-1 years)</option>
                  <option value="junior">Junior (1-3 years)</option>
                  <option value="experienced">Experienced (3-5 years)</option>
                  <option value="senior">Senior (5+ years)</option>
                  <option value="expert">Expert (10+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="City, State (e.g., Melbourne, VIC)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={profileData.location}
                  onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                />
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Your Skills & Expertise</h2>
            <div className="mb-6">
              <div className="flex items-center">
                <div className="flex-1 bg-blue-600 h-2 rounded-full"></div>
                <div className="flex-1 bg-blue-600 h-2 rounded-full ml-2"></div>
                <div className="flex-1 bg-gray-200 h-2 rounded-full ml-2"></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Step 2 of 3 - Skills Selection</p>
            </div>

            <p className="text-gray-600 mb-4">Select all skills that apply to you. This helps employers find you and colleagues connect with you:</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {skills.map(skill => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    profileData.skills.includes(skill)
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Selected: <span className="font-medium">{profileData.skills.length} skills</span>
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Almost Done!</h2>
          <div className="mb-6">
            <div className="flex items-center">
              <div className="flex-1 bg-blue-600 h-2 rounded-full"></div>
              <div className="flex-1 bg-blue-600 h-2 rounded-full ml-2"></div>
              <div className="flex-1 bg-blue-600 h-2 rounded-full ml-2"></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Step 3 of 3 - Final Details</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="e.g., +61 404 123 456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label>
              <textarea
                placeholder="Tell employers and colleagues about your experience, work style, and what makes you great at hospitality..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability (optional)</label>
              <div className="grid grid-cols-2 gap-2">
                {['Weekdays', 'Weekends', 'Evenings', 'Mornings', 'Special Events', 'On-call'].map(time => (
                  <label key={time} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={profileData.availability.includes(time)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setProfileData(prev => ({
                            ...prev,
                            availability: [...prev.availability, time]
                          }));
                        } else {
                          setProfileData(prev => ({
                            ...prev,
                            availability: prev.availability.filter(a => a !== time)
                          }));
                        }
                      }}
                    />
                    {time}
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Profile Completion: {calculateCompletion()}%</h4>
              <p className="text-sm text-blue-700">
                Great start! You can always add more details later to increase your profile visibility.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Setting up...' : 'Complete Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Navigation Component
const Navigation = ({ currentPage, setCurrentPage, user, profile }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Briefcase },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'network', label: 'Network', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">Servinly</span>
            </div>
            
            <div className="flex space-x-8">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setCurrentPage(id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {profile?.first_name} {profile?.last_name}
                </div>
                <div className="text-xs text-gray-500">
                  Profile: {profile?.profile_completion || 0}% complete
                </div>
              </div>
              <button
                onClick={signOut}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Briefcase className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Servinly</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="px-4 py-2 border-t">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setCurrentPage(id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                  currentPage === id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4 mr-3" />
                {label}
              </button>
            ))}
            <div className="border-t pt-3 mt-3">
              <div className="px-3 py-2 text-sm text-gray-900">
                {profile?.first_name} {profile?.last_name}
              </div>
              <button
                onClick={signOut}
                className="flex items-center w-full px-3 py-3 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

// Dashboard
const Dashboard = ({ setCurrentPage }) => {
  const { user, profile } = useAuth();

  const quickStats = [
    { label: 'Profile Completion', value: `${profile?.profile_completion || 0}%`, icon: User },
    { label: 'Network Connections', value: '0', icon: Users },
    { label: 'Job Applications', value: '0', icon: Briefcase },
    { label: 'Profile Views', value: '0', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="dashboard" setCurrentPage={setCurrentPage} user={user} profile={profile} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.first_name}!
          </h1>
          <p className="text-gray-600 mt-2">Here&apos;s your hospitality career dashboard</p>
        </div>

        {/* Profile Completion Banner */}
        {profile?.profile_completion < 80 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-blue-900">Complete Your Profile</h3>
                <p className="text-blue-700">Add more details to increase your visibility to employers and colleagues</p>
              </div>
              <button
                onClick={() => setCurrentPage('profile')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Complete Profile
              </button>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-blue-600 mb-1">
                <span>Profile Strength</span>
                <span>{profile?.profile_completion || 0}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all" 
                  style={{ width: `${profile?.profile_completion || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{label}</p>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => setCurrentPage('jobs')}
                className="w-full flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Briefcase className="h-5 w-5 mr-3" />
                Browse Job Opportunities
              </button>
              <button 
                onClick={() => setCurrentPage('network')}
                className="w-full flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Users className="h-5 w-5 mr-3" />
                Find Colleagues in Your Area
              </button>
              <button 
                onClick={() => setCurrentPage('profile')}
                className="w-full flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <User className="h-5 w-5 mr-3" />
                Update Your Profile
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Profile Created</h4>
                  <p className="text-sm text-gray-600">You&apos;ve successfully created your Servinly profile!</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-5 w-5 border-2 border-gray-300 rounded-full mr-3 mt-0.5"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Connect with Colleagues</h4>
                  <p className="text-sm text-gray-600">Find and connect with other hospitality professionals</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-5 w-5 border-2 border-gray-300 rounded-full mr-3 mt-0.5"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Apply for Jobs</h4>
                  <p className="text-sm text-gray-600">Start browsing and applying for opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Jobs Page (placeholder)
const JobsPage = ({ setCurrentPage }) => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="jobs" setCurrentPage={setCurrentPage} user={user} profile={profile} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Opportunities Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            We&apos;re building an amazing job discovery platform. You&apos;ll be notified when it&apos;s ready!
          </p>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple Network Page (placeholder)
const NetworkPage = ({ setCurrentPage }) => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="network" setCurrentPage={setCurrentPage} user={user} profile={profile} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Network Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            Connect with other hospitality professionals in your area. This feature is in development!
          </p>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple Profile Page (placeholder)
const ProfilePage = ({ setCurrentPage }) => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="profile" setCurrentPage={setCurrentPage} user={user} profile={profile} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.first_name} {profile?.last_name}
              </h1>
              <p className="text-gray-600">{profile?.current_position || 'Hospitality Professional'}</p>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {profile?.location || 'Location not set'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Contact</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {user?.email}
                </div>
                {profile?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {profile.phone}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Experience</h3>
              <p className="text-sm text-gray-600">
                {profile?.experience_level ? 
                  profile.experience_level.charAt(0).toUpperCase() + profile.experience_level.slice(1) + ' Level' 
                  : 'Not specified'}
              </p>
            </div>
          </div>

          {profile?.skills && profile.skills.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile?.bio && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-2">About</h3>
              <p className="text-gray-600">{profile.bio}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t">
            <p className="text-center text-gray-500 text-sm">
              Profile editing features coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServinlyApp;

