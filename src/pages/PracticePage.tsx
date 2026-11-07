import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { QuestionListItem } from '../api/types';
import { QuestionCard } from '../components/QuestionCard';

export function PracticePage() {
  const [questions, setQuestions] = useState<QuestionListItem[]>([]);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [discipline, setDiscipline] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [unattemptedOnly, setUnattemptedOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadQuestions() {
    setLoading(true);
    try {
      const attemptRes = await api.post('/questions/start-attempt');
      setAttemptId(attemptRes.data.id);

      const params: Record<string, string> = {};
      if (discipline) params.discipline = discipline;
      if (difficulty) params.difficulty = difficulty;
      if (unattemptedOnly) params.unattempted = 'true';

      const res = await api.get('/questions', { params });
      setQuestions(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadQuestions(); }, []);

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Practice</h2>

      <div style={styles.filters}>
        <input
          placeholder="Discipline (e.g. Endodontics)"
          value={discipline}
          onChange={(e) => setDiscipline(e.target.value)}
          style={styles.filterInput}
        />
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={styles.filterInput}>
          <option value="">Any Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={unattemptedOnly} onChange={(e) => setUnattemptedOnly(e.target.checked)} />
          Unattempted only
        </label>
        <button onClick={loadQuestions} style={styles.applyBtn} disabled={loading}>
          {loading ? 'Loading...' : 'Apply Filters'}
        </button>
      </div>

      {attemptId && questions.map((q) => (
        <QuestionCard key={q.id} question={q} attemptId={attemptId} />
      ))}

      {!loading && questions.length === 0 && <p>No questions match these filters yet.</p>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { padding: 32, maxWidth: 760, margin: '0 auto' },
  title: { color: '#0B2340', marginBottom: 20 },
  filters: { display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' },
  filterInput: { padding: 10, borderRadius: 8, border: '1px solid #ddd' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 },
  applyBtn: { background: '#0B2340', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8, cursor: 'pointer' },
};
