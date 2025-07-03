// vibeCodeSpace_clone/frontend/components/ui/PromptInput.js
import { useState } from 'react';
import styles from './PromptInput.module.css';

const PromptInput = () => {
    const [prompt, setPrompt] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [followUpQuestions, setFollowUpQuestions] = useState([]);

    const handleInitialSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) {
            setError('Please enter a description for your application.');
            return;
        }
        setError('');
        setIsLoading(true);

        // --- Mock API Call ---
        // In a real application, you would send the prompt to your backend here.
        // The backend would then return either the result or follow-up questions.
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

        // Mock response: AI needs more information
        setFollowUpQuestions([
            { id: 1, text: 'What color scheme would you like for the app? (e.g., light, dark, blue-themed)', answer: '' },
            { id: 2, text: 'Do you need user authentication (sign-up/sign-in)?', answer: '' },
            { id: 3, text: 'What is the primary goal of the application?', answer: '' },
        ]);
        // --- End Mock API Call ---

        setIsLoading(false);
    };

    const handleFollowUpChange = (id, newAnswer) => {
        setFollowUpQuestions(currentQuestions =>
            currentQuestions.map(q => (q.id === id ? { ...q, answer: newAnswer } : q))
        );
    };

    const handleFinalSubmit = async () => {
        const unanswered = followUpQuestions.find(q => !q.answer.trim());
        if (unanswered) {
            setError(`Please answer the question: "${unanswered.text}"`);
            return;
        }
        setError('');
        setIsLoading(true);

        // --- Mock Final API Call ---
        // Here you would send the original prompt and the answers to the follow-up questions.
        const finalContext = {
            initialPrompt: prompt,
            clarifications: followUpQuestions.map(({ text, answer }) => ({ question: text, answer })),
        };
        console.log('Submitting final context:', finalContext);
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('Application generation started!');
        // --- End Mock Final API Call ---

        setIsLoading(false);
        setFollowUpQuestions([]); // Clear questions after submission
    };

    return (
        <div className={styles.container}>
            {!followUpQuestions.length ? (
                <form onSubmit={handleInitialSubmit}>
                    <textarea
                        className={styles.textarea}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe the web application you want to build..."
                        disabled={isLoading}
                    />
                    <button type="submit" className={styles.button} disabled={isLoading}>
                        {isLoading ? 'Analyzing...' : 'Generate App'}
                    </button>
                </form>
            ) : (
                <div className={styles.followUpSection}>
                    <h3 className={styles.followUpTitle}>The AI has a few questions:</h3>
                    {followUpQuestions.map(q => (
                        <div key={q.id} className={styles.questionBox}>
                            <label className={styles.questionLabel}>{q.text}</label>
                            <input
                                type="text"
                                className={styles.followUpInput}
                                value={q.answer}
                                onChange={(e) => handleFollowUpChange(q.id, e.target.value)}
                                placeholder="Your answer..."
                                disabled={isLoading}
                            />
                        </div>
                    ))}
                    <button onClick={handleFinalSubmit} className={styles.button} disabled={isLoading}>
                        {isLoading ? 'Generating...' : 'Submit Answers & Generate'}
                    </button>
                </div>
            )}
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
};

export default PromptInput;
