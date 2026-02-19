import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API = '/api/auth';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    uid: '',
    uname: '',
    password: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: form.uid,
          uname: form.uname,
          password: form.password,
          email: form.email,
          phone: form.phone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Register as a customer. Initial balance: ₹1,00,000</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="User ID (uid)"
            value={form.uid}
            onChange={(e) => setForm((f) => ({ ...f, uid: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Username (uname)"
            value={form.uname}
            onChange={(e) => setForm((f) => ({ ...f, uname: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
