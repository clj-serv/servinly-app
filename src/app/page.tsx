"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, MapPin, Briefcase, Users, LogOut, Menu, X, Phone, Mail, Award } from 'lucide-react';

// Auth Context
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const signUp = (userData) => {
    setUser(userData);
  };

  const signIn = (email, password) => {
    setUser({
      id: '1',
      email,
      firstName: 'Alex',
      lastName: 'Johnson',
      userType: 'worker',
      profileComplete: true
    });
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
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

const AppRouter = ({ currentPage, setCurrentPage }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Servinly</h2>
          <p className="text-blue-100">Loading your professional platform...</p>
        </div>
      </div>
    );
  }

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

  if (user && !user.profileComplete) {
    return <ProfileSetup setCurrentPage={setCurrentPage} />;
  }

  // Authenticated user pages
  switch (currentPage) {
    case 'profile':
      return <ProfilePage setCurrentPage={setCurrentPage} />;
    case 'opportunities':
      return <OpportunitiesPage setCurrentPage={setCurrentPage} />;
    case 'network':
      return <NetworkPage setCurrentPage={setCurrentPage} />;
    default:
      return <Dashboard setCurrentPage={setCurrentPage} />;
  }
};

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
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md"
              >
                Sign In
              </button>
              <button 
                onClick={() => setCurrentPage('signup')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
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
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 shadow-lg"
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
            <div className="text-center p-6">
              <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Professional Profiles</h3>
              <p className="text-gray-600">Showcase your skills, certifications, and experience. Build a professional identity that follows you between jobs.</p>
            </div>
            
            <div className="text-center p-6">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Industry Network</h3>
              <p className="text-gray-600">Connect with other hospitality professionals. Share opportunities, advice, and grow your career network.</p>
            </div>
            
            <div className="text-center p-6">
              <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Opportunities</h3>
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
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  );
};

const SignUpPage = ({ setCurrentPage }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: 'worker'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signUp({ ...formData, id: Date.now().toString(), profileComplete: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Join Servinly</h2>
          <p className="text-gray-600">Start building your hospitality career</p>
        </div>

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
          
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

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
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-4"
          >
            Create Account
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

const SignInPage = ({ setCurrentPage }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your Servinly account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-4"
          >
            Sign In
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

const ProfileSetup = ({ setCurrentPage }) => {
  const { user, signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    position: '',
    experience: '',
    skills: [],
    availability: [],
    location: '',
    phone: '',
    bio: ''
  });

  const skills = [
    'Customer Service', 'Cash Handling', 'POS Systems', 'Wine Knowledge', 
    'Cocktail Making', 'Food Safety', 'Team Leadership', 'Event Management',
    'Inventory Management', 'Cleaning & Sanitization'
  ];

  const handleSkillToggle = (skill) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleComplete = () => {
    signUp({ ...user, profileComplete: true, profile: profileData });
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
            <div className="mb-6">
              <div className="flex items-center">
                <div className="flex-1 bg-blue-600 h-2 rounded-full"></div>
                <div className="flex-1 bg-gray-200 h-2 rounded-full ml-2"></div>
                <div className="flex-1 bg-gray-200 h-2 rounded-full ml-2"></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Step 1 of 3</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Position</label>
                <input
                  type="text"
                  placeholder="e.g., Server, Bartender, Chef"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={profileData.position}
                  onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={profileData.experience}
                  onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                >
                  <option value="">Select experience level</option>
                  <option value="entry">Entry Level (0-1 years)</option>
                  <option value="junior">Junior (1-3 years)</option>
                  <option value="experienced">Experienced (3-5 years)</option>
                  <option value="senior">Senior (5+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="City, State"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={profileData.location}
                  onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                />
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
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
            <h2 className="text-2xl font-bold mb-6">Your Skills</h2>
            <div className="mb-6">
              <div className="flex items-center">
                <div className="flex-1 bg-blue-600 h-2 rounded-full"></div>
                <div className="flex-1 bg-blue-600 h-2 rounded-full ml-2"></div>
                <div className="flex-1 bg-gray-200 h-2 rounded-full ml-2"></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Step 2 of 3</p>
            </div>

            <p className="text-gray-600 mb-4">Select all skills that apply to you:</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {skills.map(skill => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`p-3 rounded-lg border text-left ${
                    profileData.skills.includes(skill)
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
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
            <p className="text-sm text-gray-600 mt-2">Step 3 of 3</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label>
              <textarea
                placeholder="Tell employers about your experience and what makes you great..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navigation = ({ currentPage, setCurrentPage, user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Briefcase },
    { id: 'opportunities', label: 'Opportunities', icon: Search },
    { id: 'network', label: 'Network', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
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
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
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
              <span className="text-sm text-gray-600">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={signOut}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

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
                className={`flex items-center w-full px-3 py-3 rounded-md text-sm font-medium ${
                  currentPage === id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4 mr-3" />
                {label}
              </button>
            ))}
            <button
              onClick={signOut}
              className="flex items-center w-full px-3 py-3 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

const Dashboard = ({ setCurrentPage }) => {
  const { user } = useAuth();

  const quickStats = [
    { label: 'Profile Views', value: '23', icon: User },
    { label: 'Active Applications', value: '5', icon: Briefcase },
    { label: 'Network Connections', value: '47', icon: Users },
    { label: 'Skills Verified', value: '8', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="dashboard" setCurrentPage={setCurrentPage} user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your career today</p>
        </div>

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

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setCurrentPage('profile')}
              className="flex items-center justify-center px-6 py-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
            >
              <User className="h-5 w-5 mr-3" />
              Update Profile
            </button>
            <button 
              onClick={() => setCurrentPage('opportunities')}
              className="flex items-center justify-center px-6 py-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Search className="h-5 w-5 mr-3" />
              Browse Jobs
            </button>
            <button 
              onClick={() => setCurrentPage('network')}
              className="flex items-center justify-center px-6 py-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Users className="h-5 w-5 mr-3" />
              Expand Network
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OpportunitiesPage = ({ setCurrentPage }) => {
  const { user } = useAuth();

  const opportunities = [
    {
      id: 1,
      title: 'Senior Bartender',
      company: 'Rooftop Lounge',
      location: 'Downtown',
      type: 'Full-time',
      pay: '$22-28/hr + tips',
      posted: '2 hours ago',
    },
    {
      id: 2,
      title: 'Weekend Server',
      company: 'The Local Tavern',
      location: 'Midtown',
      type: 'Part-time',
      pay: '$15/hr + tips',
      posted: '4 hours ago',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="opportunities" setCurrentPage={setCurrentPage} user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Opportunities</h1>
          <p className="text-gray-600">Find your next opportunity in hospitality</p>
        </div>

        <div className="space-y-6">
          {opportunities.map((opportunity) => (
            <div key={opportunity.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{opportunity.title}</h3>
                  <p className="text-lg text-gray-700 mb-2">{opportunity.company}</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {opportunity.location}
                    </span>
                    <span>{opportunity.type}</span>
                    <span className="font-semibold text-green-600">{opportunity.pay}</span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{opportunity.posted}</span>
              </div>
              
              <div className="flex space-x-3">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
                  Apply Now
                </button>
                <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 font-medium">
                  Save Job
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NetworkPage = ({ setCurrentPage }) => {
  const { user } = useAuth();

  const connections = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      position: 'Head Bartender',
      company: 'The Rooftop',
      avatar: 'SM',
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      position: 'Restaurant Manager',
      company: 'City Bistro',
      avatar: 'MR',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="network" setCurrentPage={setCurrentPage} user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Network</h1>
          <p className="text-gray-600">Connect with other hospitality professionals</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Connections</h2>
          <div className="space-y-4">
            {connections.map((connection) => (
              <div key={connection.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {connection.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{connection.name}</h3>
                    <p className="text-gray-600">{connection.position} at {connection.company}</p>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  Message
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = ({ setCurrentPage }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="profile" setCurrentPage={setCurrentPage} user={user} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold mr-6">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h1>
              <p className="text-xl text-gray-600">Senior Server</p>
              <div className="flex items-center text-gray-500 mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Melbourne, VIC</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center text-gray-600">
              <Mail className="h-5 w-5 mr-3" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Phone className="h-5 w-5 mr-3" />
              <span>+61 404 123 456</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServinlyApp;
