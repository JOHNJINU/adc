import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { AdminMockExamListItem } from '../../api/types';

export function AdminMockExamListPage() {
  const [exams, setExams] = useState<AdminMockExamListItem[]>([]);
  const navigate = useNavigate();

  function load() {
    api.get('/admin/mockexams').then((res) => setExams(res.data));
  }
  useEffect(load, []);

  async function publish(id: number) {
    await api.post(`/admin/mockexams/${id}/publish`);
    load();
  }

  async function remove(id: number) {
    if (!confirm('Delete this mock exam?')) return;
    await api.delete(`/admin/mockexams/${id}`);
    load();
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Mock Exams — Admin</h2>
        <button style={styles.newBtn} onClick={() => navigate('/admin/mock-exams/new')}>+ New Mock Exam</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Questions</th>
            <th style={styles.th}>Time Limit</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((e) => (
            <tr key={e.id}>
              <td style={styles.td}>{e.title}</td>
              <td style={styles.td}>{e.questionCount}</td>
              <td style={styles.td}>{e.timeLimitMinutes} min</td>
              <td style={styles.td}>
                <span style={{ color: e.status === 'Published' ? '#1A7A3C' : '#B38600' }}>{e.status}</span>
              </td>
              <td style={styles.td}>
                <Link to={`/admin/mock-exams/${e.id}`} style={styles.link}>Edit</Link>
                {' · '}
                {e.status !== 'Published' && (
                  <button onClick={() => publish(e.id)} style={styles.actionBtn}>Publish</button>
                )}
                {' · '}
                <button onClick={() => remove(e.id)} style={styles.actionBtnDanger}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {exams.length === 0 && <p>No mock exams yet.</p>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { padding: 32, maxWidth: 900, margin: '0 auto' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { color: '#0B2340', margin: 0 },
  newBtn: { background: '#0B2340', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 10, overflow: 'hidden' },
  th: { textAlign: 'left', padding: 12, background: '#F7F5EF', fontSize: 13 },
  td: { padding: 12, borderTop: '1px solid #eee', fontSize: 13 },
  link: { color: '#0B2340' },
  actionBtn: { background: 'none', border: 'none', color: '#1A7A3C', cursor: 'pointer', fontSize: 13, padding: 0 },
  actionBtnDanger: { background: 'none', border: 'none', color: '#B3261E', cursor: 'pointer', fontSize: 13, padding: 0 },
};
