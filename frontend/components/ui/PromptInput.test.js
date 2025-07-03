// vibeCodeSpace_clone/frontend/components/ui/PromptInput.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import PromptInput from './PromptInput';

describe('PromptInput', () => {
  it('should display an error if the prompt is submitted empty', () => {
    render(<PromptInput />);
    
    const submitButton = screen.getByRole('button', { name: /generate app/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/please enter a description/i)).toBeInTheDocument();
  });

  it('should show follow-up questions after a successful initial prompt', async () => {
    render(<PromptInput />);
    
    const textArea = screen.getByPlaceholderText(/describe the web application/i);
    const submitButton = screen.getByRole('button', { name: /generate app/i });

    fireEvent.change(textArea, { target: { value: 'A cool new app' } });
    fireEvent.click(submitButton);

    // RTL's `findBy` queries are async and wait for the element to appear
    const followUpTitle = await screen.findByText(/the ai has a few questions/i);
    expect(followUpTitle).toBeInTheDocument();
  });
});
