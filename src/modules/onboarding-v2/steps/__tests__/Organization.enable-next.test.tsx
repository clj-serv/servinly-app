import { render, screen, fireEvent } from '@testing-library/react';
import Organization from '../Organization';
import type { UseStepRouterReturn } from '@/lib/useStepRouter';

// Mock the router hook
const mockRouter: UseStepRouterReturn = {
  currentStep: 'ORG',
  flow: 'FULL',
  signals: {
    roleId: 'test-role',
    roleFamily: 'service',
    shineKeys: ['friendly'],
    busyKeys: [],
    vibeKey: undefined,
    orgName: '',
    startDate: undefined,
    endDate: undefined,
    highlightText: undefined,
    responsibilities: [],
  },
  goNext: jest.fn(),
  goPrev: jest.fn(),
  goToStep: jest.fn(),
  updateSignals: jest.fn(),
  saveProgress: jest.fn(),
  loadProgress: jest.fn(),
  clearProgress: jest.fn(),
};

// Mock storage
jest.mock('@/lib/storage', () => ({
  getLastRoleData: jest.fn(() => null),
}));

describe('Organization - Enable Next Button', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should disable Next button when orgName is empty', () => {
    render(<Organization router={mockRouter} />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('should enable Next button when orgName has content', () => {
    const routerWithOrgName = {
      ...mockRouter,
      signals: { ...mockRouter.signals, orgName: 'Test Restaurant' }
    };
    
    render(<Organization router={routerWithOrgName} />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).not.toBeDisabled();
  });

  it('should disable Next button when orgName is only spaces', () => {
    const routerWithSpaces = {
      ...mockRouter,
      signals: { ...mockRouter.signals, orgName: '   ' }
    };
    
    render(<Organization router={routerWithSpaces} />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('should call updateSignals immediately when typing', () => {
    render(<Organization router={mockRouter} />);
    
    const input = screen.getByLabelText(/organization name/i);
    fireEvent.change(input, { target: { value: 'A' } });
    
    expect(mockRouter.updateSignals).toHaveBeenCalledWith({ orgName: 'A' });
  });

  it('should trim orgName on blur', () => {
    render(<Organization router={mockRouter} />);
    
    const input = screen.getByLabelText(/organization name/i);
    fireEvent.blur(input, { target: { value: '  Test Restaurant  ' } });
    
    expect(mockRouter.updateSignals).toHaveBeenCalledWith({ orgName: 'Test Restaurant' });
  });

  it('should not make network calls during render', () => {
    // Spy on fetch to ensure no network calls
    const fetchSpy = jest.spyOn(global, 'fetch');
    
    render(<Organization router={mockRouter} />);
    
    expect(fetchSpy).not.toHaveBeenCalled();
    
    fetchSpy.mockRestore();
  });
});
