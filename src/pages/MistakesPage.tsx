import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { MistakeTopic, QuestionListItem } from '../api/types';
import { QuestionCard } from '../components/QuestionCard';

export function MistakesPage() {
  const [topics, setTopics] = useState<MistakeTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionListItem[]>([]);
  const [attemptId, setAttemptId] = useState<number | null>(null);

  useEffect(() => {
    api.get('/mistakes').then((res) => setTopics(res.data));
  }, []);

  async function openTopic(topic: string) {
    setSelectedTopic(topic);
    const attemptRes = await api.post('/questions/start-attempt');
    setAttemptId(attemptRes.data.id);
    const res = await api.get('/mistakes/questions', { params: { topic } });
    setQuestions(res.data);
  }

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>My Mistakes</h2>
      <p style={styles.sub}>Turn your mistakes into your strongest topics.</p>

      {!selectedTopic && (
        <div style={styles.topicList}>
          {topics.length === 0 && <p>No mistakes yet — nice work, or you haven't practised yet.</p>}
          {topics.map((t) => (
            <div key={t.topic} style={styles.topicCard} onClick={() => openTopic(t.topic)}>
              <span>{t.topic}</span>
              <span style={styles.wrongCount}>{t.wrongCount} to review</span>
            </div>
          ))}
        </div>
      )}

      {selectedTopic && attemptId && (
        <div>
          <button onClick={() => setSelectedTopic(null)} style={styles.backBtn}>← Back to topics</button>
          {questions.map((q) => (
            <QuestionCard key={q.id} question={q} attemptId={attemptId} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { padding: 32, maxWidth: 760, margin: '0 auto' },
  title: { color: '#0B2340', marginBottom: 4 },
  sub: { color: '#777', marginBottom: 24, fontSize: 14 },
  topicList: { display: 'flex', flexDirection: 'column', gap: 10 },
  topicCard: {
    display: 'flex', justifyContent: 'space-between', background: '#fff', padding: 16,
    borderRadius: 10, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  wrongCount: { color: '#B3261E', fontWeight: 600 },
  backBtn: { background: 'none', border: 'none', color: '#0B2340', cursor: 'pointer', marginBottom: 16, fontSize: 14 },
};
