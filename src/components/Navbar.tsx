import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>DR SULFATH ADC</div>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/practice" style={styles.link}>Practice</Link>
        <Link to="/mock-exams" style={styles.link}>Mock Exams</Link>
        <Link to="/mistakes" style={styles.link}>My Mistakes</Link>
        <Link to="/bookmarks" style={styles.link}>Bookmarks</Link>
        {user.role === 'Admin' && <Link to="/admin/questions" style={styles.link}>Questions</Link>}
        {user.role === 'Admin' && <Link to="/admin/mock-exams" style={styles.link}>Manage Mocks</Link>}
        {user.role === 'Admin' && <Link to="/admin/students" style={styles.link}>Students</Link>}
        {user.role === 'Admin' && <Link to="/admin/analytics" style={styles.link}>Analytics</Link>}
      </div>
      <div style={styles.right}>
        <span style={styles.userName}>{user.fullName}</span>
        <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 24px', background: '#0B2340', color: '#F7F5EF',
    fontFamily: 'Inter, sans-serif'
  },
  brand: { fontWeight: 700, letterSpacing: 1 },
  links: { display: 'flex', gap: 20 },
  link: { color: '#F7F5EF', textDecoration: 'none', fontSize: 14 },
  right: { display: 'flex', alignItems: 'center', gap: 12 },
  userName: { fontSize: 14 },
  logoutBtn: {
    background: 'transparent', border: '1px solid #F7F5EF', color: '#F7F5EF',
    padding: '6px 12px', borderRadius: 6, cursor: 'pointer'
  }
};
