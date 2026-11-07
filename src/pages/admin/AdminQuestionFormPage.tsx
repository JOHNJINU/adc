import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { QuestionAdmin } from '../../api/types';

const empty: QuestionAdmin = {
  questionCode: '', cluster: '', discipline: '', topic: '', difficulty: 'Medium',
  scenarioText: '', questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', optionE: '',
  correctOption: 'A', explanationCorrect: '', clinicalPearl: '', references: '', imageUrl: '', status: 'Draft',
};

export function AdminQuestionFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';
  const [form, setForm] = useState<QuestionAdmin>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/admin/questions/${id}`).then((res) => setForm(res.data));
    }
  }, [id]);

  function update<K extends keyof QuestionAdmin>(key: K, value: QuestionAdmin[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/admin/questions/${id}`, form);
      } else {
        await api.post('/admin/questions', form);
      }
      navigate('/admin/questions');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>{isEdit ? 'Edit Question' : 'New Question'}</h2>

      <div style={styles.grid}>
        <Field label="Question Code" value={form.questionCode} onChange={(v) => update('questionCode', v)} placeholder="ENDO-001" />
        <Field label="Cluster" value={form.cluster || ''} onChange={(v) => update('cluster', v)} />
        <Field label="Discipline" value={form.discipline} onChange={(v) => update('discipline', v)} placeholder="Endodontics" />
        <Field label="Topic" value={form.topic} onChange={(v) => update('topic', v)} placeholder="Pulpal diagnosis" />
        <div style={styles.field}>
          <label style={styles.label}>Difficulty</label>
          <select value={form.difficulty} onChange={(e) => update('difficulty', e.target.value)} style={styles.input}>
            <option>Easy</option><option>Medium</option><option>Hard</option>
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Correct Option</label>
          <select value={form.correctOption} onChange={(e) => update('correctOption', e.target.value)} style={styles.input}>
            <option>A</option><option>B</option><option>C</option><option>D</option><option>E</option>
          </select>
        </div>
      </div>

      <TextArea label="Scenario Text" value={form.scenarioText || ''} onChange={(v) => update('scenarioText', v)} />
      <TextArea label="Question Text" value={form.questionText} onChange={(v) => update('questionText', v)} />

      <div style={styles.grid}>
        <Field label="Option A" value={form.optionA} onChange={(v) => update('optionA', v)} />
        <Field label="Option B" value={form.optionB} onChange={(v) => update('optionB', v)} />
        <Field label="Option C" value={form.optionC} onChange={(v) => update('optionC', v)} />
        <Field label="Option D" value={form.optionD} onChange={(v) => update('optionD', v)} />
        <Field label="Option E (optional)" value={form.optionE || ''} onChange={(v) => update('optionE', v)} />
      </div>

      <TextArea label="Explanation (Correct Answer)" value={form.explanationCorrect} onChange={(v) => update('explanationCorrect', v)} />
      <TextArea label="Clinical Pearl" value={form.clinicalPearl || ''} onChange={(v) => update('clinicalPearl', v)} />
      <TextArea label="References" value={form.references || ''} onChange={(v) => update('references', v)} />
      <Field label="Image URL (optional)" value={form.imageUrl || ''} onChange={(v) => update('imageUrl', v)} />

      <div style={styles.field}>
        <label style={styles.label}>Status</label>
        <select value={form.status} onChange={(e) => update('status', e.target.value)} style={styles.input}>
          <option>Draft</option><option>Published</option>
        </select>
      </div>

      <div style={styles.actions}>
        <button onClick={save} disabled={saving} style={styles.saveBtn}>{saving ? 'Saving...' : 'Save Question'}</button>
        <button onClick={() => navigate('/admin/questions')} style={styles.cancelBtn}>Cancel</button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <input style={styles.input} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={styles.label}>{label}</label>
      <textarea style={styles.textarea} rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { padding: 32, maxWidth: 800, margin: '0 auto' },
  title: { color: '#0B2340', marginBottom: 20 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 12, color: '#555', marginBottom: 4 },
  input: { width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box', fontFamily: 'inherit' },
  actions: { display: 'flex', gap: 12, marginTop: 20 },
  saveBtn: { background: '#0B2340', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  cancelBtn: { background: 'none', border: '1px solid #ddd', padding: '12px 24px', borderRadius: 8, cursor: 'pointer' },
};
