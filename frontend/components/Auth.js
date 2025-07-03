// vibeCodeSpace_clone/frontend/components/Auth.js
import { useState } from 'react';
import { supabase } from '../lib/supabase/client'; // Using the existing Supabase client

const API_URL = 'http://localhost:8080/api/auth'; // Your backend API URL

// --- 1. Sign-Up Component ---
export const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setMessage(data.message);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Sign Up</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

// --- 2. Sign-In Component ---
export const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${API_URL}/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            // The session is returned from the backend. You should store the access_token securely.
            // For simplicity, we'll just log it here. In a real app, use context or state management.
            console.log('Session:', data.session);
            alert('Sign-in successful!');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Sign In</h2>
            <form onSubmit={handleSignIn}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Sign In</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

// --- 3. Social Login Component ---
export const SocialLogin = () => {
    const handleOAuthSignIn = async (provider) => {
        try {
            const response = await fetch(`${API_URL}/signin/${provider}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            // Redirect the user to the provider's authentication page
            window.location.href = data.url;
        } catch (err) {
            console.error(`Error with ${provider} sign-in:`, err.message);
        }
    };

    return (
        <div>
            <h2>Social Login</h2>
            <button onClick={() => handleOAuthSignIn('google')}>Sign In with Google</button>
            <button onClick={() => handleOAuthSignIn('github')}>Sign In with GitHub</button>
        </div>
    );
};

// --- 4. Password Reset Component ---
export const RequestPasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleRequest = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const response = await fetch(`${API_URL}/request-password-reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setMessage(data.message);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleRequest}>
                <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

// --- 5. Update Password Component (for the page the user lands on from the email link) ---
// This component interacts directly with the Supabase client-side library, as the user session is established in the browser by the time they reach this page.
export const UpdatePassword = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError(error.message);
        } else {
            setMessage('Password updated successfully!');
        }
    };

    return (
        <div>
            <h2>Update Your Password</h2>
            <form onSubmit={handleUpdatePassword}>
                <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Update Password</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};
