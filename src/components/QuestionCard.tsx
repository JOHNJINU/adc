import { useState } from 'react';
import { api } from '../api/client';
import { QuestionListItem, AnswerResult } from '../api/types';

interface Props {
  question: QuestionListItem;
  attemptId: number;
  onAnswered?: (result: AnswerResult) => void;
}

const optionKeys = ['A', 'B', 'C', 'D', 'E'] as const;

export function QuestionCard({ question, attemptId, onAnswered }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [bookmarked, setBookmarked] = useState(question.isBookmarked);
  const [submitting, setSubmitting] = useState(false);

  const options: Record<string, string | null | undefined> = {
    A: question.optionA, B: question.optionB, C: question.optionC,
    D: question.optionD, E: question.optionE,
  };

  async function submit() {
    if (!selected || submitting) return;
    setSubmitting(true);
    try {
      const res = await api.post('/questions/submit', {
        attemptId, questionId: question.id, selectedOption: selected,
      });
      setResult(res.data);
      onAnswered?.(res.data);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleBookmark() {
    if (bookmarked) {
      await api.delete(`/bookmarks/${question.id}`);
    } else {
      await api.post(`/bookmarks/${question.id}`);
    }
    setBookmarked(!bookmarked);
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.code}>{question.discipline} — {question.topic}</span>
        <button onClick={toggleBookmark} style={styles.bookmarkBtn}>
          {bookmarked ? '🔖 Saved' : '🔖 Save'}
        </button>
      </div>

      {question.scenarioText && (
        <div style={styles.scenario}>
          <strong>CASE</strong>
          <p>{question.scenarioText}</p>
        </div>
      )}

      <p style={styles.questionText}>{question.questionText}</p>

      <div style={styles.options}>
        {optionKeys.map((key) => {
          const text = options[key];
          if (!text) return null;
          const isSelected = selected === key;
          const isCorrectOpt = result && result.correctOption === key;
          const isWrongSelected = result && isSelected && !result.isCorrect;

          let bg = '#fff';
          if (result) {
            if (isCorrectOpt) bg = '#E6F4EA';
            else if (isWrongSelected) bg = '#FBEAEA';
          } else if (isSelected) {
            bg = '#EAF1FB';
          }

          return (
            <button
              key={key}
              disabled={!!result}
              onClick={() => setSelected(key)}
              style={{ ...styles.option, background: bg }}
            >
              <strong>{key}.</strong> {text}
            </button>
          );
        })}
      </div>

      {!result ? (
        <button onClick={submit} disabled={!selected || submitting} style={styles.submitBtn}>
          {submitting ? 'Submitting...' : 'Submit Answer'}
        </button>
      ) : (
        <div style={styles.resultBox}>
          <p style={{ color: result.isCorrect ? '#1A7A3C' : '#B3261E', fontWeight: 700 }}>
            {result.isCorrect ? '✅ Correct' : `❌ Incorrect — Correct answer: ${result.correctOption}`}
          </p>
          <p><strong>🧠 Explanation:</strong> {result.explanationCorrect}</p>
          {result.explanationWrong && Object.entries(result.explanationWrong).map(([k, v]) => (
            <p key={k}><strong>❌ Why not {k}?</strong> {v}</p>
          ))}
          {result.clinicalPearl && (
            <p><strong>⭐ Clinical Pearl:</strong> {result.clinicalPearl}</p>
          )}
          {result.references && (
            <p style={styles.references}><strong>References:</strong> {result.references}</p>
          )}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: { background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 20 },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: 12 },
  code: { fontSize: 12, color: '#555', textTransform: 'uppercase', letterSpacing: 0.5 },
  bookmarkBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 },
  scenario: { background: '#F7F5EF', padding: 14, borderRadius: 8, marginBottom: 14 },
  questionText: { fontWeight: 600, marginBottom: 16 },
  options: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 },
  option: { textAlign: 'left', padding: '12px 14px', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer', fontSize: 14 },
  submitBtn: { background: '#0B2340', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer' },
  resultBox: { borderTop: '1px solid #eee', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 },
  references: { color: '#666', fontSize: 12 },
};
