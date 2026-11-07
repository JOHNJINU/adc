import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';

interface AdminQuestionRow {
  id: number;
  questionCode: string;
  discipline: string;
  topic: string;
  status: string;
}

export function AdminQuestionListPage() {
  const [questions, setQuestions] = useState<AdminQuestionRow[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const [importing, setImporting] = useState(false);

  function load() {
    api.get('/admin/questions').then((res) => setQuestions(res.data));
  }

  useEffect(load, []);

  async function publish(id: number) {
    await api.post(`/admin/questions/${id}/publish`);
    load();
  }

  async function remove(id: number) {
    if (!confirm('Delete this question?')) return;
    await api.delete(`/admin/questions/${id}`);
    load();
  }

  async function handleImport() {
    if (!file) return;
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/admin/questions/bulk-import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImportResult(res.data);
      load();
    } finally {
      setImporting(false);
    }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Question Bank — Admin</h2>
        <Link to="/admin/questions/new" style={styles.newBtn}>+ Add Question</Link>
      </div>

      <div style={styles.importBox}>
        <h4 style={{ margin: '0 0 8px' }}>Bulk Import (CSV)</h4>
        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button onClick={handleImport} disabled={!file || importing} style={styles.importBtn}>
          {importing ? 'Importing...' : 'Import'}
        </button>
        {importResult && (
          <p style={styles.importResult}>
            Imported: {importResult.imported}, Skipped: {importResult.skipped}
          </p>
        )}
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Code</th>
            <th style={styles.th}>Discipline</th>
            <th style={styles.th}>Topic</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id}>
              <td style={styles.td}>{q.questionCode}</td>
              <td style={styles.td}>{q.discipline}</td>
              <td style={styles.td}>{q.topic}</td>
              <td style={styles.td}>
                <span style={{ color: q.status === 'Published' ? '#1A7A3C' : '#B38600' }}>{q.status}</span>
              </td>
              <td style={styles.td}>
                <Link to={`/admin/questions/${q.id}`} style={styles.actionLink}>Edit</Link>
                {' · '}
                {q.status !== 'Published' && (
                  <button onClick={() => publish(q.id)} style={styles.actionBtn}>Publish</button>
                )}
                {' · '}
                <button onClick={() => remove(q.id)} style={styles.actionBtnDanger}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { padding: 32, maxWidth: 1000, margin: '0 auto' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { color: '#0B2340', margin: 0 },
  newBtn: { background: '#0B2340', color: '#fff', padding: '10px 18px', borderRadius: 8, textDecoration: 'none' },
  importBox: { background: '#fff', padding: 16, borderRadius: 10, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 },
  importBtn: { background: '#1E8F6F', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer' },
  importResult: { fontSize: 13, color: '#555', margin: 0 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 10, overflow: 'hidden' },
  th: { textAlign: 'left', padding: 12, background: '#F7F5EF', fontSize: 13 },
  td: { padding: 12, borderTop: '1px solid #eee', fontSize: 13 },
  actionLink: { color: '#0B2340' },
  actionBtn: { background: 'none', border: 'none', color: '#1A7A3C', cursor: 'pointer', fontSize: 13, padding: 0 },
  actionBtnDanger: { background: 'none', border: 'none', color: '#B3261E', cursor: 'pointer', fontSize: 13, padding: 0 },
};
