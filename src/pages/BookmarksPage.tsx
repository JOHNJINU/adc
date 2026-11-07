import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { QuestionListItem } from '../api/types';
import { QuestionCard } from '../components/QuestionCard';

export function BookmarksPage() {
  const [questions, setQuestions] = useState<QuestionListItem[]>([]);
  const [attemptId, setAttemptId] = useState<number | null>(null);

  useEffect(() => {
    api.post('/questions/start-attempt').then((res) => setAttemptId(res.data.id));
    api.get('/bookmarks').then((res) => setQuestions(res.data));
  }, []);

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Saved for Revision</h2>
      {questions.length === 0 && <p>You haven't bookmarked any questions yet.</p>}
      {attemptId && questions.map((q) => (
        <QuestionCard key={q.id} question={q} attemptId={attemptId} />
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { padding: 32, maxWidth: 760, margin: '0 auto' },
  title: { color: '#0B2340', marginBottom: 20 },
};
