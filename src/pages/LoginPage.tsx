import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrap}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>DR SULFATH ADC</h1>
        <p style={styles.subtitle}>Practice. Reason. Master.</p>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} type="email" placeholder="Email" value={email}
               onChange={(e) => setEmail(e.target.value)} required />
        <input style={styles.input} type="password" placeholder="Password" value={password}
               onChange={(e) => setPassword(e.target.value)} required />
        <button style={styles.button} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        <p style={styles.footer}>No account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7F5EF' },
  form: { background: '#fff', padding: 40, borderRadius: 12, width: 360, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  title: { textAlign: 'center', color: '#0B2340', marginBottom: 4 },
  subtitle: { textAlign: 'center', color: '#888', marginBottom: 24, fontSize: 13 },
  input: { width: '100%', padding: 12, marginBottom: 14, borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' },
  button: { width: '100%', padding: 12, background: '#0B2340', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  error: { color: '#B3261E', fontSize: 13, marginBottom: 12 },
  footer: { textAlign: 'center', marginTop: 16, fontSize: 13 },
};
