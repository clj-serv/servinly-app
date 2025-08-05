"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { createClient, User, Session } from '@supabase/supabase-js';
import { 
  User as UserIcon, 
  MapPin, 
  Clock, 
  Briefcase, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  Award, 
  Plus, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';

// Types and Interfaces
interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'worker' | 'employer';
  current_position?: string;
  location?: string;
  skills: string[];
  phone?: string;
  bio?: string;
  onboarding_completed: boolean;
  profile_completion: number;
  created_at: string;
  updated_at?: string;
}

interface Position {
  id: string;
  user_id: string;
  title: string;
  is_current: boolean;
  start_date: string;
  end_date?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signUp: (userData: SignUpData) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ data: any; error: any }>;
  retryConnection: () => void;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: 'worker' | 'employer';
}

interface PageProps {
  setCurrentPage: (page: string) => void;
}

interface NavProps extends PageProps {
  currentPage: string;
  user: User | null;
  profile: Profile | null;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: 'worker' | 'employer';
}

interface SignInFormData {
  email: string;
  password: string;
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

// Supabase configuration
const SUPABASE_URL = 'https://fpcyvhbjpwtubwbkrwde.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwY3l2aGJqcHd0dWJ3Ymtyd2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNjM5MzgsImV4cCI6MjA2OTkzOTkzOH0.hS8uTcXOdNRlpYNtEm5e239uHHWprUdCzmncQW7A9X8';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set maximum loading time of 10 seconds
    const loadingTimeout = setTimeout(() => {
      console.warn('Auth check timed out, continuing without authentication');
      setLoading(false);
    }, 10000);

    // Check for existing session
    checkUser().finally(() => {
      clearTimeout(loadingTimeout);
    });
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session: Session | null) => {
      console.log('Auth state changed:', event);
      setError(null);
      
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(loadingTimeout);
      subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async (): Promise<void> => {
    try {
      console.log('Checking user session...');
      
      // Add timeout to session check
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Session check timeout')), 8000)
      );
      
      const { data: { session }, error } = await Promise.race([
        sessionPromise,
        timeoutPromise
      ]);
      
      if (error) {
        console.error('Session check error:', error);
        setError('Connection issue. Please try refreshing.');
        return;
      }
      
      if (session?.user) {
        console.log('User session found');
        setUser(session.user);
        await loadUserProfile(session.user.id);
      } else {
        console.log('No user session found');
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setError('Unable to verify login status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string): Promise<void> => {
    try {
      console.log('Loading user profile...');
      
      // Add timeout to profile loading
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Profile load timeout')), 5000)
      );
      
      const { data, error } = await Promise.race([
        profilePromise,
        timeoutPromise
      ]);
      
      if (!error && data) {
        setProfile(data as Profile);
        console.log('Profile loaded successfully');
      } else {
        console.warn('Profile not found or error:', error);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const signUp = async (userData: SignUpData) => {
    try {
      setLoading(true);
      setError(null);
      
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
          profile_completion: 10,
          skills: []
        });
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Signin error:', error);
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } catch (error: any) {
      console.error('Signout error:', error);
      setError('Sign out failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) return { data: null, error: 'No user found' };
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (!error) {
        setProfile(prev => prev ? { ...prev, ...updates } : null);
      }
      
      return { data, error };
    } catch (error) {
      console.error('Profile update error:', error);
      return { data: null, error };
    }
  };

  const retryConnection = (): void => {
    setError(null);
    setLoading(true);
    checkUser();
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    retryConnection
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Main App Component
const ServinlyApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AppRouter currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </AuthProvider>
  );
};

// Router Component
const AppRouter: React.FC<{ currentPage: string; setCurrentPage: (page: string) => void }> = ({ 
  currentPage, 
  setCurrentPage 
}) => {
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

// Loading Screen with Error Handling
const LoadingScreen: React.FC = () => {
  const { error, retryConnection } = useAuth();
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-lg p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Issue</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={retryConnection}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-white mb-2">Servinly</h2>
        <p className="text-blue-100">Loading your professional platform...</p>
        <div className="mt-4 text-sm text-blue-200">
          <p>Taking longer than usual? Check your internet connection.</p>
        </div>
      </div>
    </div>
  );
};

// Landing Page
const LandingPage: React.FC<PageProps> = ({ setCurrentPage }) => {
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
              <UserIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
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
const SignUpPage: React.FC<PageProps> = ({ setCurrentPage }) => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: 'worker'
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
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
                  onChange={(e) => setFormData({...formData, userType: e.target.value as 'worker' | 'employer'})}
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
                  onChange={(e) => setFormData({...formData, userType: e.target.value as 'worker' | 'employer'})}
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
const SignInPage: React.FC<PageProps> = ({ setCurrentPage }) => {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
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

// Enhanced Onboarding Flow - Ready for AI Integration
const OnboardingFlow: React.FC<PageProps> = ({ setCurrentPage }) => {
  const { updateProfile } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [profileData, setProfileData] = useState<ProfileData>({
    latest_position: '',
    is_current: false,
    start_date: '',
    end_date: '',
    location: '',
    skills: [],
    phone: '',
    bio: ''
  });

  // Temporary static skills - will be replaced with AI generation
  const skills = [
    'Customer Service', 'Cash Handling', 'POS Systems', 'Wine Knowledge', 
    'Cocktail Making', 'Food Safety', 'Team Leadership', 'Event Management',
    'Inventory Management', 'Cleaning & Sanitization', 'Fine Dining', 
    'Catering', 'Hotel Operations', 'Conflict Resolution'
  ];

  const handleSkillToggle = (skill: string): void => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleComplete = async (): Promise<void> => {
    setLoading(true);
    
    const updates = {
      current_position: profileData.latest_position,
      location: profileData.location,
      skills: profileData.skills,
      phone: profileData.phone,
      bio: profileData.bio,
      onboarding_completed: true,
      updated_at: new Date().toISOString()
    };

    const { error } = await updateProfile(updates);
    
    if (!error) {
      setCurrentPage('dashboard');
    }
    setLoading(false);
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
              <p className="text-sm text-gray-600 mt-2">Step 1 of 3 - Work Experience</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latest Position</label>
                <input
                  type="text"
                  placeholder="e.g., Server, Bartender, Chef, Hotel Receptionist"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={profileData.latest_position}
                  onChange={(e) => setProfileData({...profileData, latest_position: e.target.value})}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_current"
                  checked={profileData.is_current}
                  onChange={(e) => setProfileData({...profileData, is_current: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="is_current" className="text-sm text-gray-700">This is my current position</label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={profileData.start_date}
                    onChange={(e) => setProfileData({...profileData, start_date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date {profileData.is_current && <span className="text-gray-400">(Current)</span>}
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={profileData.end_date}
                    onChange={(e) => setProfileData({...profileData, end_date: e.target.value})}
                    disabled={profileData.is_current}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="City, State (e.g., Melbourne, VIC - AU)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={profileData.location}
                  onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                />
                <p className="text-xs text-gray-500 mt-1">Location autocomplete coming soon!</p>
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

            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                🤖 <strong>AI Enhancement Coming Soon:</strong> Skills will be automatically suggested based on your position!
              </p>
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
          <h2 className="text-2xl font-bold mb-6">Final Details</h2>
          <div className="mb-6">
            <div className="flex items-center">
              <div className="flex-1 bg-blue-600 h-2 rounded-full"></div>
              <div className="flex-1 bg-blue-600 h-2 rounded-full ml-2"></div>
              <div className="flex-1 bg-blue-600 h-2 rounded-full ml-2"></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Step 3 of 3 - Professional Bio</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
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
              <div className="relative">
                <textarea
                  placeholder="Tell employers and colleagues about your experience, work style, and what makes you great at hospitality..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                />
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-xs font-medium hover:bg-purple-200 transition-colors"
                    disabled
                  >
                    ✨ AI Assist (Coming Soon)
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">AI will help generate and improve your bio based on your position and skills!</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Ready to launch your career!</h4>
              <p className="text-sm text-green-700">
                You can always add more positions and update your profile later.
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
const Navigation: React.FC<NavProps> = ({ currentPage, setCurrentPage, user, profile }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { signOut } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Briefcase },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'network', label: 'Network', icon: Users },
    { id: 'profile', label: 'Profile', icon: UserIcon },
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
                  {profile?.current_position || 'Hospitality Professional'}
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
const Dashboard: React.FC<PageProps> = ({ setCurrentPage }) => {
  const { user, profile } = useAuth();

  const quickStats = [
    { label: 'Network Connections', value: '0', icon: Users },
    { label: 'Job Applications', value: '0', icon: Briefcase },
    { label: 'Profile Views', value: '0', icon: UserIcon },
    { label: 'Skills Listed', value: profile?.skills.length.toString() || '0', icon: Award }
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
                <UserIcon className="h-5 w-5 mr-3" />
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

        {/* Coming Soon Features */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Coming Soon</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs mr-2">AI</span>
              Bio Generation & Skills Suggestions
            </div>
            <div className="flex items-center">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">SMART</span>
              Location Autocomplete
            </div>
            <div className="flex items-center">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">NETWORK</span>
              Professional Connections
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder Pages - Ready for Enhancement
const JobsPage: React.FC<PageProps> = ({ setCurrentPage }) => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="jobs" setCurrentPage={setCurrentPage} user={user} profile={profile} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Opportunities Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            We&apos;re building an amazing job discovery platform with AI-powered matching!
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

const NetworkPage: React.FC<PageProps> = ({ setCurrentPage }) => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="network" setCurrentPage={setCurrentPage} user={user} profile={profile} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Network Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            Connect with other hospitality professionals and build your career network!
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

const ProfilePage: React.FC<PageProps> = ({ setCurrentPage }) => {
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
              <h3 className="font-medium text-gray-900 mb-2">Account Type</h3>
              <p className="text-sm text-gray-600 capitalize">
                {profile?.user_type === 'worker' ? 'Hospitality Professional' : 'Employer'}
              </p>
            </div>
          </div>

          {profile?.skills && profile.skills.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string, index: number) => (
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
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">🚀 Enhanced Profile Features Coming Soon!</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Multiple work positions and history</li>
                <li>• AI-powered bio enhancement</li>
                <li>• Skills verification and endorsements</li>
                <li>• Professional photo upload</li>
                <li>• Certifications and achievements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServinlyApp;