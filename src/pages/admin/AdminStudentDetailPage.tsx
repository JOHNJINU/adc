import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { StudentDetail } from '../../api/types';

export function AdminStudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentDetail | null>(null);

  useEffect(() => {
    api.get(`/admin/students/${id}`).then((res) => setStudent(res.data));
  }, [id]);

  if (!student) return <div style={styles.wrap}>Loading...</div>;

  return (
    <div style={styles.wrap}>
      <button onClick={() => navigate('/admin/students')} style={styles.backBtn}>← Back to Students</button>
      <h2 style={styles.title}>{student.fullName}</h2>
      <p style={styles.sub}>{student.email} · Joined {new Date(student.createdAt).toLocaleDateString()}</p>

      <div style={styles.statsRow}>
        <StatCard label="Questions Solved" value={student.questionsSolved} />
        <StatCard label="Accuracy" value={`${student.accuracyPercent}%`} />
        <StatCard label="Mock Exams" value={student.mockAttempts.length} />
      </div>

      <h3 style={styles.sectionTitle}>Mock Exam Attempts</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Exam</th>
            <th style={styles.th}>Started</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Score</th>
          </tr>
        </thead>
        <tbody>
          {student.mockAttempts.map((m) => (
            <tr key={m.attemptId}>
              <td style={styles.td}>{m.mockExamTitle}</td>
              <td style={styles.td}>{new Date(m.startedAt).toLocaleString()}</td>
              <td style={styles.td}>{m.completedAt ? 'Completed' : 'In Progress'}</td>
              <td style={styles.td}>{m.scorePercent != null ? `${m.scorePercent}%` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {student.mockAttempts.length === 0 && <p style={styles.empty}>No mock exams attempted yet.</p>}

      <h3 style={styles.sectionTitle}>Recent Answers</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Question</th>
            <th style={styles.th}>Topic</th>
            <th style={styles.th}>Answer</th>
            <th style={styles.th}>Result</th>
            <th style={styles.th}>When</th>
          </tr>
        </thead>
        <tbody>
          {student.recentAnswers.map((a, i) => (
            <tr key={i}>
              <td style={styles.td}>{a.questionCode}</td>
              <td style={styles.td}>{a.topic}</td>
              <td style={styles.td}>{a.selectedOption}</td>
              <td style={styles.td}>
                <span style={{ color: a.isCorrect ? '#1A7A3C' : '#B3261E' }}>{a.isCorrect ? 'Correct' : 'Incorrect'}</span>
              </td>
              <td style={styles.td}>{new Date(a.answeredAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {student.recentAnswers.length === 0 && <p style={styles.empty}>No practice activity yet.</p>}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { padding: 32, maxWidth: 900, margin: '0 auto' },
  backBtn: { background: 'none', border: 'none', color: '#0B2340', cursor: 'pointer', marginBottom: 16, fontSize: 14, padding: 0 },
  title: { color: '#0B2340', margin: '0 0 4px' },
  sub: { color: '#777', fontSize: 13, marginBottom: 20 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 },
  statCard: { background: '#fff', borderRadius: 10, padding: 20, textAlign: 'center' },
  statValue: { fontSize: 24, fontWeight: 700, color: '#0B2340' },
  statLabel: { fontSize: 12, color: '#777', marginTop: 4 },
  sectionTitle: { color: '#0B2340', marginTop: 28, marginBottom: 10 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 10, overflow: 'hidden' },
  th: { textAlign: 'left', padding: 10, background: '#F7F5EF', fontSize: 12 },
  td: { padding: 10, borderTop: '1px solid #eee', fontSize: 13 },
  empty: { color: '#999', fontSize: 13, marginTop: 8 },
};
