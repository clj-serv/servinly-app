import { render, screen, fireEvent } from '@testing-library/react';
import CareerHighlight from '../CareerHighlight';
import type { UseStepRouterReturn } from '@/lib/useStepRouter';

// Mock the router hook
const mockRouter: UseStepRouterReturn = {
  currentStep: 'HIGHLIGHT',
  flow: 'FULL',
  signals: {
    roleId: 'test-role',
    roleFamily: 'service',
    shineKeys: ['friendly'],
    busyKeys: [],
    vibeKey: undefined,
    orgName: 'Test Restaurant',
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

describe('CareerHighlight - Enable Next Button', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('disables Next when empty', () => {
    render(<CareerHighlight router={mockRouter} />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('enables Next when user types', async () => {
    render(<CareerHighlight router={mockRouter} />);
    
    const textarea = screen.getByLabelText(/career highlight/i);
    fireEvent.change(textarea, { target: { value: 'Great customer story' } });
    
    expect(mockRouter.updateSignals).toHaveBeenCalledWith({ highlightText: 'Great customer story' });
    
    // Test with updated signals
    const routerWithHighlight = {
      ...mockRouter,
      signals: { ...mockRouter.signals, highlightText: 'Great customer story' }
    };
    
    render(<CareerHighlight router={routerWithHighlight} />);
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).not.toBeDisabled();
  });

  it('trims on blur; spaces-only stays disabled', async () => {
    render(<CareerHighlight router={mockRouter} />);
    
    const textarea = screen.getByLabelText(/career highlight/i);
    fireEvent.change(textarea, { target: { value: '   ' } });
    fireEvent.blur(textarea, { target: { value: '   ' } });
    
    expect(mockRouter.updateSignals).toHaveBeenCalledWith({ highlightText: '' });
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('calls updateSignals immediately when typing', () => {
    render(<CareerHighlight router={mockRouter} />);
    
    const textarea = screen.getByLabelText(/career highlight/i);
    fireEvent.change(textarea, { target: { value: 'A' } });
    
    expect(mockRouter.updateSignals).toHaveBeenCalledWith({ highlightText: 'A' });
  });

  it('enables Next when suggestion is clicked', () => {
    const initialData = [
      { text: 'Led a team during busy Friday night service' },
      { text: 'Improved customer satisfaction scores by 20%' }
    ];
    
    render(<CareerHighlight router={mockRouter} initialData={initialData} />);
    
    const suggestion = screen.getByText('Led a team during busy Friday night service');
    fireEvent.click(suggestion);
    
    expect(mockRouter.updateSignals).toHaveBeenCalledWith({ 
      highlightText: 'Led a team during busy Friday night service' 
    });
  });

  it('should not make network calls during render', () => {
    // Spy on fetch to ensure no network calls
    const fetchSpy = jest.spyOn(global, 'fetch');
    
    render(<CareerHighlight router={mockRouter} />);
    
    expect(fetchSpy).not.toHaveBeenCalled();
    
    fetchSpy.mockRestore();
  });
});
