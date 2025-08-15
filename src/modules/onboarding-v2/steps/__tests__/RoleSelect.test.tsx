import { render, screen, fireEvent } from '@/__tests__/utils/test-utils';
import RoleSelect from '../RoleSelect';

// Mock the role engine
jest.mock('@/role-engine/registry', () => ({
  getAvailableRoles: () => [
    { id: 'bartender', label: 'Bartender', family: 'bar' },
    { id: 'server', label: 'Server', family: 'service' },
    { id: 'manager', label: 'Manager', family: 'management' },
    { id: 'chef', label: 'Chef', family: 'kitchen' },
  ],
}));

describe('RoleSelect Component', () => {
  const mockRouter = {
    signals: {
      roleId: '',
      roleFamily: '',
      shineKeys: [],
      busyKeys: [],
      responsibilities: [],
    },
    updateSignals: jest.fn(),
    goNext: jest.fn(),
    goPrev: jest.fn(),
    goToStep: jest.fn(),
    saveProgress: jest.fn(),
    loadProgress: jest.fn(),
    clearProgress: jest.fn(),
    currentStep: 'ROLE_SELECT' as const,
    flow: 'FULL' as const,
  };

  const mockUser = {
    firstName: 'John',
    email: 'john@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders role selection dropdown', () => {
    render(<RoleSelect router={mockRouter} user={mockUser} />);
    
    expect(screen.getByText('Select your role...')).toBeInTheDocument();
    expect(screen.getByText('Your recent role')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', () => {
    render(<RoleSelect router={mockRouter} user={mockUser} />);
    
    const dropdownButton = screen.getByText('Select your role...');
    fireEvent.click(dropdownButton);
    
    expect(screen.getByText('Bartender')).toBeInTheDocument();
    expect(screen.getByText('Server')).toBeInTheDocument();
  });

  it('updates signals when role is selected', () => {
    render(<RoleSelect router={mockRouter} user={mockUser} />);
    
    // Open dropdown
    const dropdownButton = screen.getByText('Select your role...');
    fireEvent.click(dropdownButton);
    
    // Select bartender
    const bartenderOption = screen.getByText('Bartender');
    fireEvent.click(bartenderOption);
    
    expect(mockRouter.updateSignals).toHaveBeenCalledWith({
      roleId: 'bartender',
      roleFamily: 'bar',
    });
  });
});
