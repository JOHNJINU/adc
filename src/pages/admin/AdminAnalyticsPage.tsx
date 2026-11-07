import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';

interface MostMissed {
  questionId: number;
  questionCode: string;
  topic: string;
  totalAttempts: number;
  wrongCount: number;
  missRatePercent: number;
}

export function AdminAnalyticsPage() {
  const [rows, setRows] = useState<MostMissed[]>([]);

  useEffect(() => {
    api.get('/admin/analytics/most-missed').then((res) => setRows(res.data));
  }, []);

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Most-Missed Questions</h2>
      <p style={styles.sub}>
        High miss-rate questions are worth reviewing — either the concept is genuinely hard,
        or the question itself may be ambiguous or mis-keyed.
      </p>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Code</th>
            <th style={styles.th}>Topic</th>
            <th style={styles.th}>Attempts</th>
            <th style={styles.th}>Wrong</th>
            <th style={styles.th}>Miss Rate</th>
            <th style={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.questionId}>
              <td style={styles.td}>{r.questionCode}</td>
              <td style={styles.td}>{r.topic}</td>
              <td style={styles.td}>{r.totalAttempts}</td>
              <td style={styles.td}>{r.wrongCount}</td>
              <td style={styles.td}>
                <strong style={{ color: r.missRatePercent > 60 ? '#B3261E' : '#B38600' }}>
                  {r.missRatePercent}%
                </strong>
              </td>
              <td style={styles.td}>
                <Link to={`/admin/questions/${r.questionId}`} style={styles.link}>Review</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p>Not enough attempt data yet.</p>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { padding: 32, maxWidth: 900, margin: '0 auto' },
  title: { color: '#0B2340', marginBottom: 4 },
  sub: { color: '#777', fontSize: 13, marginBottom: 20 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 10, overflow: 'hidden' },
  th: { textAlign: 'left', padding: 12, background: '#F7F5EF', fontSize: 13 },
  td: { padding: 12, borderTop: '1px solid #eee', fontSize: 13 },
  link: { color: '#0B2340' },
};
