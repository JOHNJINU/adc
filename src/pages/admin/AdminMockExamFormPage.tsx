import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { QuestionPickerItem } from '../../api/types';

export function AdminMockExamFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';

  const [title, setTitle] = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(60);
  const [status, setStatus] = useState('Draft');
  const [allQuestions, setAllQuestions] = useState<QuestionPickerItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [disciplineFilter, setDisciplineFilter] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/questions-picker').then((res) => setAllQuestions(res.data));
    if (isEdit) {
      api.get(`/admin/mockexams/${id}`).then((res) => {
        setTitle(res.data.title);
        setTimeLimitMinutes(res.data.timeLimitMinutes);
        setStatus(res.data.status);
        setSelectedIds(new Set(res.data.questions.map((q: any) => q.questionId)));
      });
    }
  }, [id]);

  function toggle(qid: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(qid)) next.delete(qid); else next.add(qid);
      return next;
    });
  }

  const disciplines = Array.from(new Set(allQuestions.map((q) => q.discipline))).sort();
  const filtered = disciplineFilter ? allQuestions.filter((q) => q.discipline === disciplineFilter) : allQuestions;

  async function save() {
    setSaving(true);
    try {
      const payload = { title, timeLimitMinutes, status, questionIds: Array.from(selectedIds) };
      if (isEdit) {
        await api.put(`/admin/mockexams/${id}`, payload);
      } else {
        await api.post('/admin/mockexams', payload);
      }
      navigate('/admin/mock-exams');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>{isEdit ? 'Edit Mock Exam' : 'New Mock Exam'}</h2>

      <div style={styles.grid}>
        <div style={styles.field}>
          <label style={styles.label}>Title</label>
          <input style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mock 01 — Full Paper" />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Time Limit (minutes)</label>
          <input style={styles.input} type="number" value={timeLimitMinutes}
                 onChange={(e) => setTimeLimitMinutes(Number(e.target.value))} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Status</label>
          <select style={styles.input} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Draft</option><option>Published</option>
          </select>
        </div>
      </div>

      <h3 style={styles.subTitle}>Select Questions ({selectedIds.size} selected)</h3>
      <select style={{ ...styles.input, marginBottom: 12, maxWidth: 280 }} value={disciplineFilter}
              onChange={(e) => setDisciplineFilter(e.target.value)}>
        <option value="">All Disciplines</option>
        {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>

      <div style={styles.questionList}>
        {filtered.map((q) => (
          <label key={q.id} style={styles.questionRow}>
            <input type="checkbox" checked={selectedIds.has(q.id)} onChange={() => toggle(q.id)} />
            <span style={styles.qCode}>{q.questionCode}</span>
            <span style={styles.qMeta}>{q.discipline} · {q.topic} · {q.difficulty}</span>
            <span style={{ color: q.status === 'Published' ? '#1A7A3C' : '#B38600', fontSize: 12 }}>{q.status}</span>
          </label>
        ))}
        {filtered.length === 0 && <p>No questions found.</p>}
      </div>

      <div style={styles.actions}>
        <button onClick={save} disabled={saving || !title || selectedIds.size === 0} style={styles.saveBtn}>
          {saving ? 'Saving...' : 'Save Mock Exam'}
        </button>
        <button onClick={() => navigate('/admin/mock-exams')} style={styles.cancelBtn}>Cancel</button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { padding: 32, maxWidth: 800, margin: '0 auto' },
  title: { color: '#0B2340', marginBottom: 20 },
  subTitle: { color: '#0B2340', marginTop: 24, marginBottom: 8, fontSize: 16 },
  grid: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16, marginBottom: 8 },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 12, color: '#555', marginBottom: 4 },
  input: { width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' },
  questionList: { background: '#fff', borderRadius: 10, padding: 8, maxHeight: 400, overflowY: 'auto' },
  questionRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px', borderBottom: '1px solid #f0f0f0', fontSize: 13, cursor: 'pointer' },
  qCode: { fontWeight: 600, width: 100 },
  qMeta: { flex: 1, color: '#666' },
  actions: { display: 'flex', gap: 12, marginTop: 20 },
  saveBtn: { background: '#0B2340', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  cancelBtn: { background: 'none', border: '1px solid #ddd', padding: '12px 24px', borderRadius: 8, cursor: 'pointer' },
};
