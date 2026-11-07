import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { QuestionListItem } from '../api/types';
import { QuestionCard } from '../components/QuestionCard';

export function MockExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuestionListItem[]>([]);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [result, setResult] = useState<{ total: number; correct: number; scorePercent: number } | null>(null);

  useEffect(() => {
    api.post(`/mockexams/${id}/start`).then((res) => {
      setAttemptId(res.data.attemptId);
      setQuestions(res.data.questions);
      setTimeLimitMinutes(res.data.timeLimitMinutes);
    });
  }, [id]);

  async function finishExam() {
    if (!attemptId) return;
    const res = await api.post(`/mockexams/attempts/${attemptId}/finish`);
    setResult(res.data);
  }

  if (result) {
    return (
      <div style={styles.wrap}>
        <h2 style={styles.title}>Your Mock Result</h2>
        <div style={styles.resultCard}>
          <div style={styles.scoreBig}>{result.scorePercent}%</div>
          <p>Correct: {result.correct} / {result.total}</p>
        </div>
        <button style={styles.backBtn} onClick={() => navigate('/mock-exams')}>Back to Mock Exams</button>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={styles.title}>Mock Exam</h2>
        <span style={styles.timer}>Time limit: {timeLimitMinutes} min</span>
      </div>
      {attemptId && questions.map((q) => (
        <QuestionCard key={q.id} question={q} attemptId={attemptId} onAnswered={() => setAnsweredCount((c) => c + 1)} />
      ))}
      <button style={styles.finishBtn} onClick={finishExam}>
        Finish Exam ({answeredCount}/{questions.length} answered)
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { padding: 32, maxWidth: 760, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { color: '#0B2340', margin: 0 },
  timer: { fontSize: 13, color: '#777' },
  finishBtn: { background: '#1E8F6F', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  resultCard: { background: '#fff', padding: 32, borderRadius: 12, textAlign: 'center', marginBottom: 20 },
  scoreBig: { fontSize: 48, fontWeight: 700, color: '#0B2340' },
  backBtn: { background: '#0B2340', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, cursor: 'pointer' },
};
