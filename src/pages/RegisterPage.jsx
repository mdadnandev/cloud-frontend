import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong creating your account.');
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
        <h1>Create</h1>
        <p>Start keeping your files in order.</p>
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
            <span>Full name</span>
            <input
              type="text"
              placeholder="Maya Kessler"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Confirm password</span>
            <input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="auth-foot">
          Already have an account? <Link to="/login" className="link">Sign in</Link>
        </div>
      </div>
    </div>
  );
}