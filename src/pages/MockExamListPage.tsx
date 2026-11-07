import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { MockExamListItem } from '../api/types';

export function MockExamListPage() {
  const [exams, setExams] = useState<MockExamListItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/mockexams').then((res) => setExams(res.data));
  }, []);

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Mock Exams</h2>
      <p style={styles.sub}>Test yourself under timed conditions. This is a preparation tool, not an official ADC exam.</p>
      <div style={styles.list}>
        {exams.map((exam) => (
          <div key={exam.id} style={styles.card}>
            <div>
              <h3 style={styles.examTitle}>{exam.title}</h3>
              <p style={styles.meta}>{exam.questionCount} Questions · {exam.timeLimitMinutes} min</p>
            </div>
            <button style={styles.startBtn} onClick={() => navigate(`/mock-exams/${exam.id}`)}>
              Start Mock
            </button>
          </div>
        ))}
        {exams.length === 0 && <p>No mock exams published yet.</p>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { padding: 32, maxWidth: 760, margin: '0 auto' },
  title: { color: '#0B2340', marginBottom: 4 },
  sub: { color: '#777', marginBottom: 24, fontSize: 13 },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: '#fff', padding: 20, borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  examTitle: { margin: 0, color: '#0B2340' },
  meta: { margin: 0, color: '#777', fontSize: 13 },
  startBtn: { background: '#0B2340', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, cursor: 'pointer' },
};
