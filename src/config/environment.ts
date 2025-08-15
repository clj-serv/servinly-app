// Environment configuration for Servinly
export const config = {
  // Production environment
  production: {
    hostname: 'servinly.com',
    showComingSoon: true,
    redirectTo: '/coming-soon'
  },
  
  // Test environment
  test: {
    hostname: 'test.servinly.com',
    showComingSoon: false,
    passwordProtected: true,
    testPassword: 'servinly2024'
  },
  
  // Development environment
  development: {
    hostname: 'localhost',
    showComingSoon: false,
    passwordProtected: false
  }
};

// Helper function to get current environment
export function getCurrentEnvironment(hostname: string) {
  if (hostname === 'servinly.com' || hostname === 'www.servinly.com') {
    return config.production;
  } else if (hostname === 'test.servinly.com') {
    return config.test;
  } else {
    return config.development;
  }
}

// Helper function to check if user has test access
export function hasTestAccess(cookies: { [key: string]: string }): boolean {
  return cookies.testAccess === 'granted';
}
