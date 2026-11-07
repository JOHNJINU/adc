import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { StudentListItem } from '../../api/types';

export function AdminStudentListPage() {
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [search, setSearch] = useState('');

  function load(q?: string) {
    api.get('/admin/students', { params: q ? { search: q } : {} }).then((res) => setStudents(res.data));
  }
  useEffect(() => load(), []);

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Students</h2>

      <div style={styles.searchRow}>
        <input
          style={styles.searchInput}
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load(search)}
        />
        <button style={styles.searchBtn} onClick={() => load(search)}>Search</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Joined</th>
            <th style={styles.th}>Solved</th>
            <th style={styles.th}>Accuracy</th>
            <th style={styles.th}>Mocks Taken</th>
            <th style={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td style={styles.td}>{s.fullName}</td>
              <td style={styles.td}>{s.email}</td>
              <td style={styles.td}>{new Date(s.createdAt).toLocaleDateString()}</td>
              <td style={styles.td}>{s.questionsSolved}</td>
              <td style={styles.td}>{s.accuracyPercent}%</td>
              <td style={styles.td}>{s.mockExamsTaken}</td>
              <td style={styles.td}><Link to={`/admin/students/${s.id}`} style={styles.link}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
      {students.length === 0 && <p>No students found.</p>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { padding: 32, maxWidth: 1000, margin: '0 auto' },
  title: { color: '#0B2340', marginBottom: 20 },
  searchRow: { display: 'flex', gap: 10, marginBottom: 20 },
  searchInput: { flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ddd' },
  searchBtn: { background: '#0B2340', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 10, overflow: 'hidden' },
  th: { textAlign: 'left', padding: 12, background: '#F7F5EF', fontSize: 13 },
  td: { padding: 12, borderTop: '1px solid #eee', fontSize: 13 },
  link: { color: '#0B2340' },
};
