// vibeCodeSpace_clone/frontend/components/PromptInterface.js
import { useState } from "react";
import styles from "./PromptInterface.module.css";

const PromptInterface = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResult(null);

    // This is where you would make the API call to your backend
    // For now, we'll simulate a delay and a mock response.
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

      // Mock success response
      setResult({
        url: "https://example-generated-app.com",
        message: "Your application has been generated successfully!",
      });
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Describe Your Application</h1>
      <p className={styles.subtitle}>
        Enter a detailed description of the web application you want to create.
        The more specific you are, the better the result will be.
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          className={styles.textarea}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'A to-do list app with user authentication and a dark mode toggle.'"
          required
          disabled={isLoading}
        />
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Application"}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {result && (
        <div className={styles.result}>
          <h3 className={styles.resultTitle}>{result.message}</h3>
          <p>You can view your generated application here:</p>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.resultLink}
          >
            {result.url}
          </a>
        </div>
      )}
    </div>
  );
};

export default PromptInterface;
