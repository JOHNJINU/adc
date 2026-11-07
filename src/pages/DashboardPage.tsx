import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { DashboardStats } from '../api/types';
import { useAuth } from '../context/AuthContext';

type Topic = DashboardStats['topicBreakdown'][number];

const WEAK_BELOW = 60;
const STRONG_FROM = 75;
const VISIBLE_TOPICS = 8;

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function tone(pct: number) {
  if (pct < 50) return 'low';
  if (pct < STRONG_FROM) return 'mid';
  return 'high';
}

function level(pct: number) {
  if (pct >= 80) return 'Exam-ready range';
  if (pct >= 65) return 'Building well';
  if (pct >= 50) return 'Gaining ground';
  return 'Early days';
}

const topicLink = (topic: string) => `/practice?topic=${encodeURIComponent(topic)}`;

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    api
      .get('/dashboard/stats')
      .then((res) => {
        if (!cancelled) setStats(res.data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) return null;

  const firstName = user.fullName?.split(' ')[0] ?? '';
  const solved = stats?.questionsSolved ?? 0;
  const toReview = stats?.questionsToReview ?? 0;
  const accuracy = stats ? Math.round(stats.accuracyPercent) : null;

  const topics: Topic[] = (stats?.topicBreakdown ?? []).map((t) => ({
    ...t,
    accuracyPercent: Math.round(t.accuracyPercent),
  }));
  const ascending = [...topics].sort((a, b) => a.accuracyPercent - b.accuracyPercent);
  const weak = ascending.filter((t) => t.accuracyPercent < WEAK_BELOW).slice(0, 5);
  const noneWeak = weak.length === 0 && ascending.length > 0;
  const focus = noneWeak ? ascending.slice(0, 3) : weak;
  const strong = [...ascending].reverse().filter((t) => t.accuracyPercent >= STRONG_FROM).slice(0, 3);
  const chartTopics = showAll ? ascending : ascending.slice(0, VISIBLE_TOPICS);

  const subline = loading
    ? 'Loading your progress…'
    : solved === 0
    ? 'Your preparation starts with one question. Pick a topic and begin.'
    : toReview > 0
    ? `You have solved ${solved.toLocaleString()} questions and ${toReview} are waiting for review.`
    : `You have solved ${solved.toLocaleString()} questions. Keep the momentum going.`;

  return (
    <div className="sd">
      <style>{CSS}</style>

      {/* Hero */}
      <section className="sd-hero">
        <div className="sd-hero-main">
          <div className="sd-hero-copy">
            <h1>
              {greeting()}
              {firstName ? `, ${firstName}` : ''}
            </h1>
            <p>{subline}</p>
            <div className="sd-actions">
              <Link to="/practice" className="sd-btn sd-btn-gold">Start practice session</Link>
              <Link to="/mock-exams" className="sd-btn sd-btn-ghost">Start mock test</Link>
            </div>
          </div>

          <div className="sd-ring-wrap">
            <Ring pct={accuracy} />
            <div className="sd-ring-note">
              {accuracy === null ? 'Overall accuracy' : level(accuracy)}
            </div>
          </div>
        </div>

        <dl className="sd-strip">
          <Figure label="Questions solved" value={stats ? solved.toLocaleString() : '—'} />
          <Figure label="Accuracy" value={accuracy === null ? '—' : `${accuracy}%`} />
          <Figure label="To review" value={stats ? toReview : '—'} />
          <Figure label="Mock exams taken" value={stats ? stats.mockExamsTaken : '—'} />
        </dl>
      </section>

      {failed && (
        <div className="sd-alert" role="alert">
          We could not load your progress. Refresh the page to try again.
        </div>
      )}

      {/* Focus + quick links */}
      <div className="sd-grid">
        <section className="sd-panel">
          <div className="sd-panel-head">
            <h2>{noneWeak ? 'Next topics to strengthen' : 'Areas to strengthen'}</h2>
            <p>
              {noneWeak
                ? 'No topic is below 60% right now. These are your lowest, so keep them sharp.'
                : `Topics where your accuracy is below ${WEAK_BELOW}%.`}
            </p>
          </div>

          {focus.length > 0 ? (
            <ul className="sd-list">
              {focus.map((t) => (
                <li key={t.topic} className="sd-focus">
                  <div className="sd-focus-top">
                    <span className="sd-focus-name">{t.topic}</span>
                    <span className={`sd-pct tone-${tone(t.accuracyPercent)}-text`}>{t.accuracyPercent}%</span>
                  </div>
                  <div className="sd-track">
                    <i className={`tone-${tone(t.accuracyPercent)}`} style={{ width: `${t.accuracyPercent}%` }} />
                  </div>
                  <Link to={topicLink(t.topic)} className="sd-link">Practise {t.topic}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="sd-empty">
              <p>
                {loading
                  ? 'Working out your focus areas…'
                  : 'Solve a few questions and your weak areas will show up here, ranked by what needs work first.'}
              </p>
              {!loading && <Link to="/practice" className="sd-btn sd-btn-solid">Solve your first questions</Link>}
            </div>
          )}
        </section>

        <aside className="sd-side">
          <section className="sd-panel">
            <div className="sd-panel-head">
              <h2>Jump back in</h2>
            </div>
            <ul className="sd-rows">
              <li>
                <Link to="/mistakes">
                  <span>
                    <b>Review your mistakes</b>
                    <small>Turn missed questions into marks</small>
                  </span>
                  {toReview > 0 && <em className="sd-count">{toReview}</em>}
                </Link>
              </li>
              <li>
                <Link to="/bookmarks">
                  <span>
                    <b>Bookmarked questions</b>
                    <small>Your saved questions to revisit</small>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/mock-exams">
                  <span>
                    <b>Mock exams</b>
                    <small>Practise under exam conditions</small>
                  </span>
                </Link>
              </li>
            </ul>
          </section>

          <section className="sd-panel">
            <div className="sd-panel-head">
              <h2>Your strongest topics</h2>
            </div>
            {strong.length > 0 ? (
              <ul className="sd-strong">
                {strong.map((t) => (
                  <li key={t.topic}>
                    <span>{t.topic}</span>
                    <b>{t.accuracyPercent}%</b>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="sd-muted">
                {loading ? 'Loading…' : `Topics above ${STRONG_FROM}% will appear here as you improve.`}
              </p>
            )}
          </section>
        </aside>
      </div>

      {/* Topic chart */}
      <section className="sd-panel sd-chart">
        <div className="sd-panel-head sd-chart-head">
          <div>
            <h2>Accuracy by topic</h2>
            <p>Lowest first, so the work that matters most is at the top.</p>
          </div>
          <ul className="sd-legend" aria-label="Colour key">
            <li><i className="tone-low" />Below 50%</li>
            <li><i className="tone-mid" />50 to 74%</li>
            <li><i className="tone-high" />75% and above</li>
          </ul>
        </div>

        {chartTopics.length > 0 ? (
          <>
            <div className="sd-bars">
              {chartTopics.map((t) => (
                <div key={t.topic} className="sd-bar">
                  <span className="sd-bar-name">{t.topic}</span>
                  <div className="sd-track">
                    <i className={`tone-${tone(t.accuracyPercent)}`} style={{ width: `${t.accuracyPercent}%` }} />
                  </div>
                  <span className="sd-bar-pct">{t.accuracyPercent}%</span>
                </div>
              ))}
            </div>
            {ascending.length > VISIBLE_TOPICS && (
              <button type="button" className="sd-toggle" onClick={() => setShowAll((v) => !v)}>
                {showAll ? 'Show fewer topics' : `Show all ${ascending.length} topics`}
              </button>
            )}
          </>
        ) : (
          <p className="sd-muted">
            {loading ? 'Loading…' : 'Your topic chart appears after you answer your first questions.'}
          </p>
        )}
      </section>
    </div>
  );
}

function Figure({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="sd-fig">
      <dd>{value}</dd>
      <dt>{label}</dt>
    </div>
  );
}

function Ring({ pct }: { pct: number | null }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const value = pct === null ? 0 : Math.max(0, Math.min(100, pct));
  return (
    <svg
      viewBox="0 0 128 128"
      className="sd-ring"
      role="img"
      aria-label={pct === null ? 'Overall accuracy not available yet' : `Overall accuracy ${value}%`}
    >
      <circle cx="64" cy="64" r={r} className="sd-ring-bg" />
      <circle
        cx="64"
        cy="64"
        r={r}
        className="sd-ring-fg"
        transform="rotate(-90 64 64)"
        style={{ strokeDasharray: c, strokeDashoffset: c * (1 - value / 100), ['--c' as string]: c } as React.CSSProperties}
      />
      <text x="64" y="62" textAnchor="middle" className="sd-ring-num">
        {pct === null ? '—' : `${value}%`}
      </text>
      <text x="64" y="82" textAnchor="middle" className="sd-ring-label">
        accuracy
      </text>
    </svg>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');

.sd{
  --navy:#0F2A4A; --navy-2:#173A63; --teal:#0F6B6B; --gold:#D4AE5A; --coral:#C0504D;
  --ink:#1B2A3D; --muted:#66758A; --line:#E2DFD5; --card:#fff;
  font-family:'Inter',system-ui,sans-serif; color:var(--ink);
  max-width:1080px; margin:0 auto; padding:24px 20px 56px;
}
.sd *{box-sizing:border-box}
.sd h1,.sd h2,.sd p,.sd ul,.sd dl,.sd dd,.sd dt{margin:0; padding:0}
.sd ul{list-style:none}
.sd a{color:inherit; text-decoration:none}
.sd a:focus-visible,.sd button:focus-visible{outline:3px solid var(--gold); outline-offset:2px}

/* hero */
.sd-hero{background:linear-gradient(135deg,var(--navy) 0%,var(--navy-2) 100%); color:#fff; border-radius:20px; overflow:hidden}
.sd-hero-main{display:grid; grid-template-columns:1.5fr 1fr; align-items:center; gap:24px; padding:36px 36px 28px}
.sd-hero h1{font-family:'Playfair Display',serif; font-weight:700; font-size:38px; line-height:1.15}
.sd-hero p{margin-top:12px; font-size:15px; line-height:1.55; color:#d3deec; max-width:46ch}
.sd-actions{display:flex; flex-wrap:wrap; gap:12px; margin-top:26px}
.sd-btn{display:inline-flex; align-items:center; justify-content:center; padding:12px 22px; border-radius:10px; font-size:14px; font-weight:600; border:1.5px solid transparent; cursor:pointer; transition:background .15s,border-color .15s}
.sd-btn-gold{background:var(--gold); color:var(--navy)}
.sd-btn-gold:hover{background:#e0bd72}
.sd-btn-ghost{border-color:rgba(255,255,255,.55); color:#fff}
.sd-btn-ghost:hover{background:rgba(255,255,255,.1)}
.sd-btn-solid{background:var(--navy); color:#fff}
.sd-btn-solid:hover{background:var(--navy-2)}

.sd-ring-wrap{display:flex; flex-direction:column; align-items:center; gap:8px}
.sd-ring{width:190px; height:190px}
.sd-ring-bg{fill:none; stroke:rgba(255,255,255,.14); stroke-width:9}
.sd-ring-fg{fill:none; stroke:var(--gold); stroke-width:9; stroke-linecap:round; animation:sd-fill 1.2s cubic-bezier(.3,.7,.2,1) both}
.sd-ring-num{fill:#fff; font:700 28px 'Inter',sans-serif}
.sd-ring-label{fill:#b9c8dc; font:500 10px 'Inter',sans-serif; letter-spacing:.04em}
.sd-ring-note{font-size:13px; color:#d3deec}
@keyframes sd-fill{from{stroke-dashoffset:var(--c)}}

.sd-strip{display:grid; grid-template-columns:repeat(4,1fr); border-top:1px solid rgba(255,255,255,.14)}
.sd-fig{padding:18px 36px; border-right:1px solid rgba(255,255,255,.14)}
.sd-fig:last-child{border-right:0}
.sd-fig dd{font-size:26px; font-weight:600}
.sd-fig dt{font-size:12px; color:#b9c8dc; margin-top:2px}

.sd-alert{margin-top:16px; padding:12px 16px; border-radius:10px; background:#fbe9e7; color:#8a2f2a; font-size:13px}

/* layout */
.sd-grid{display:grid; grid-template-columns:1.5fr 1fr; gap:20px; margin-top:20px; align-items:start}
.sd-side{display:grid; gap:20px}
.sd-panel{background:var(--card); border:1px solid var(--line); border-radius:14px; padding:24px}
.sd-panel-head h2{font-size:17px; font-weight:600}
.sd-panel-head p{font-size:13px; color:var(--muted); margin-top:4px}
.sd-muted{font-size:13px; color:var(--muted); margin-top:14px}

/* focus list */
.sd-list{margin-top:18px; display:grid; gap:20px}
.sd-focus-top{display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px}
.sd-focus-name{font-size:14px; font-weight:600}
.sd-pct{font-size:14px; font-weight:600}
.sd-link{display:inline-block; margin-top:8px; font-size:13px; font-weight:500; color:var(--teal); border-bottom:1px solid transparent}
.sd-link:hover{border-color:var(--teal)}
.sd-empty{margin-top:18px; display:grid; gap:16px; justify-items:start}
.sd-empty p{font-size:14px; color:var(--muted); line-height:1.55; max-width:48ch}

/* bars */
.sd-track{height:8px; background:#ECEAE2; border-radius:999px; overflow:hidden}
.sd-track i{display:block; height:100%; border-radius:999px}
.tone-low{background:var(--coral)}
.tone-mid{background:var(--gold)}
.tone-high{background:var(--teal)}
.tone-low-text{color:var(--coral)}
.tone-mid-text{color:#9a7a2c}
.tone-high-text{color:var(--teal)}

/* side rows */
.sd-rows{margin-top:10px}
.sd-rows li + li{border-top:1px solid var(--line)}
.sd-rows a{display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 8px; margin:0 -8px; border-radius:8px}
.sd-rows a:hover{background:#F6F4EE}
.sd-rows b{display:block; font-size:14px; font-weight:600}
.sd-rows small{display:block; font-size:12px; color:var(--muted); margin-top:2px}
.sd-count{font-style:normal; font-size:12px; font-weight:600; background:var(--navy); color:#fff; border-radius:999px; padding:3px 10px}

.sd-strong{margin-top:12px; display:grid; gap:10px}
.sd-strong li{display:flex; justify-content:space-between; font-size:14px}
.sd-strong b{color:var(--teal)}

/* chart */
.sd-chart{margin-top:20px}
.sd-chart-head{display:flex; justify-content:space-between; align-items:flex-start; gap:16px; flex-wrap:wrap}
.sd-legend{display:flex; gap:16px; flex-wrap:wrap; font-size:12px; color:var(--muted)}
.sd-legend li{display:flex; align-items:center; gap:6px}
.sd-legend i{width:10px; height:10px; border-radius:50%; display:inline-block}
.sd-bars{margin-top:20px; display:grid; gap:12px}
.sd-bar{display:grid; grid-template-columns:minmax(120px,220px) 1fr 44px; align-items:center; gap:14px}
.sd-bar-name{font-size:13px}
.sd-bar-pct{font-size:13px; font-weight:600; text-align:right}
.sd-toggle{margin-top:18px; background:none; border:0; padding:0; font:500 13px 'Inter',sans-serif; color:var(--teal); cursor:pointer}
.sd-toggle:hover{text-decoration:underline}

/* responsive */
@media (max-width:860px){
  .sd-hero-main{grid-template-columns:1fr; padding:28px 22px 22px; text-align:left}
  .sd-ring-wrap{align-items:flex-start}
  .sd-hero h1{font-size:30px}
  .sd-strip{grid-template-columns:repeat(2,1fr)}
  .sd-fig{padding:16px 22px}
  .sd-fig:nth-child(2){border-right:0}
  .sd-fig:nth-child(-n+2){border-bottom:1px solid rgba(255,255,255,.14)}
  .sd-grid{grid-template-columns:1fr}
}
@media (max-width:520px){
  .sd{padding:16px 14px 40px}
  .sd-bar{grid-template-columns:1fr 44px; row-gap:6px}
  .sd-bar-name{grid-column:1 / -1}
  .sd-btn{width:100%}
}
@media (prefers-reduced-motion:reduce){
  .sd-ring-fg{animation:none}
}
`;