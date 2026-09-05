import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || "That email and password don't match. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="auth-mark icon">
          <svg viewBox="0 0 20 20">
            <path d="M2.5 6.5 10 2.5l7.5 4v7l-7.5 4-7.5-4z" />
            <path d="M2.5 6.5 10 10.5l7.5-4M10 10.5v7" />
          </svg>
        </div>
        <h1>Cloud Storage</h1>
        <p>Every file, exactly where you left it.</p>
      </div>

      <div className="auth-card tick">
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error show">
              <span className="icon">
                <svg viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="7.5" />
                  <path d="M10 6.5v4.2M10 13.3v.1" />
                </svg>
              </span>
              <span>{error}</span>
            </div>
          )}

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              placeholder="you@studio.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <div className="auth-row">
            <label className="checkbox">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span>Stay signed in</span>
            </label>
            <a href="#" className="link" onClick={(e) => e.preventDefault()}>Forgot password</a>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="auth-foot">
          New to Cloud Storage? <Link to="/register" className="link">Create an account</Link>
        </div>
      </div>
    </div>
  );
}