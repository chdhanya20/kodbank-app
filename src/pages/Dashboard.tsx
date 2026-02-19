import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const API = '/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const triggerConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#14b8a6', '#0d9488', '#5eead4', '#99f6e4', '#ccfbf1'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#14b8a6', '#0d9488', '#5eead4', '#99f6e4', '#ccfbf1'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const checkBalance = async () => {
    setError('');
    setBalance(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/balance`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setBalance(data.balance);
        triggerConfetti();
      } else {
        if (res.status === 401) {
          navigate('/login');
        } else {
          setError(data.message || 'Failed to fetch balance');
        }
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    navigate('/login');
  };

  return (
    <div className="page dashboard-page">
      <div className="dashboard-header">
        <h2>User Dashboard</h2>
        <button onClick={handleLogout} className="btn btn-secondary btn-sm">
          Logout
        </button>
      </div>
      <div className="dashboard-content">
        <button
          className="btn btn-primary btn-large"
          onClick={checkBalance}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Check Balance'}
        </button>
        {error && <p className="auth-error">{error}</p>}
        {balance !== null && (
          <div className="balance-display">
            <div className="balance-text">
              Your balance is: <span className="balance-amount">₹{balance.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
