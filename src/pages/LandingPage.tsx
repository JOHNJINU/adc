import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * HomePage – public landing page (shown before login / registration)
 * Dr Sulfath ADC
 *

 * Props (all optional) are described in HomePageProps below.
 *
 * No dependencies other than React. Styles are scoped under .ds-home.
 */

interface IconProps {
  d: string | string[];
  size?: number;
}

const Icon = ({ d, size = 22 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const ICONS = {
  doc: ["M7 3h8l4 4v14H7z", "M15 3v4h4", "M10 12h6M10 16h6"],
  list: ["M5 6h14M5 12h14M5 18h9"],
  brain: ["M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 3 5 3 3 0 0 0 5 1V5a2 2 0 0 0-3-1z", "M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-3 5 3 3 0 0 1-2 1"],
  chart: ["M4 20V4", "M4 20h16", "M7 15l4-4 3 3 5-6"],
  bulb: ["M9 18h6M10 21h4", "M12 3a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10z"],
  search: ["M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z", "M21 21l-5-5"],
  layers: ["M12 3l9 5-9 5-9-5z", "M3 13l9 5 9-5"],
  tooth: ["M7 4c-2 0-3 2-3 4 0 3 2 4 2 8 0 3 1 5 2 5s1-4 3-4 2 4 3 4 2-2 2-5c0-4 2-5 2-8 0-2-1-4-3-4-2 0-3 1-4 1S9 4 7 4z"],
  book: ["M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3z", "M21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z"],
  image: ["M4 5h16v14H4z", "M4 16l5-5 4 4 3-3 4 4", "M9 9h.01"],
  user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M4 21c0-4 4-6 8-6s8 2 8 6"],
  globe: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M3 12h18", "M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"],
  check: ["M5 12l5 5 9-10"],
  arrow: ["M5 12h14M13 6l6 6-6 6"],
};

type IconName = keyof typeof ICONS;

interface HeroFeature { icon: IconName; label: string }
interface Stat { icon: IconName; value: string; label: string }
interface Pillar { icon: IconName; title: string; text: string }
interface Testimonial { name: string; text: string }

const HERO_FEATURES: HeroFeature[] = [
  { icon: "doc", label: "Scenario-Based Practice" },
  { icon: "list", label: "Detailed Explanations" },
  { icon: "brain", label: "Clinical Reasoning" },
  { icon: "chart", label: "Performance Tracking" },
];

const STATS: Stat[] = [
  { icon: "doc", value: "10,000+", label: "Practice Questions" },
  { icon: "layers", value: "100+", label: "Topics & Concepts" },
  { icon: "globe", value: "24/7", label: "Access Anywhere" },
];

const WHY: Pillar[] = [
  { icon: "brain", title: "Practice", text: "Solve realistic clinical scenarios." },
  { icon: "bulb", title: "Understand", text: "Learn why the answer is correct." },
  { icon: "search", title: "Analyse", text: "Understand why the other options are less appropriate." },
  { icon: "chart", title: "Improve", text: "Track your weaknesses and revise strategically." },
];

const STEPS: Pillar[] = [
  { icon: "doc", title: "Solve", text: "Choose your answer and commit to your clinical reasoning." },
  { icon: "bulb", title: "Understand", text: "Get a clear explanation of the concept behind the question." },
  { icon: "search", title: "Analyse", text: "Review the key clues and understand the distractors." },
  { icon: "chart", title: "Master", text: "Save, revise and retest until the concept becomes strong." },
];

const BANK: Pillar[] = [
  { icon: "layers", title: "Cluster Practice", text: "Practice questions mapped to the competency clusters." },
  { icon: "tooth", title: "Discipline Practice", text: "Focus on specific areas of dentistry." },
  { icon: "book", title: "Topic Practice", text: "Go deeper into individual concepts." },
  { icon: "image", title: "Image-Based Questions", text: "Train your visual interpretation skills." },
  { icon: "user", title: "Clinical Scenarios", text: "Build clinical reasoning through case-based questions." },
];

const MOCKS: string[] = [
  "Full Mock – 280 Questions (4 Sections)",
  "Mini Mock – 35 Questions",
  "Cluster Mock – 70 Questions",
  "Rapid Revision – 20 Questions",
  "Weak Area Test – Custom",
];

const TESTIMONIALS: Testimonial[] = [
  { name: "Ayesha K.", text: "The explanations helped me understand why the answer was correct, rather than just memorising it." },
  { name: "Rahul S.", text: "The mistake review feature completely changed the way I revised. It helped me focus on what really matters." },
  { name: "Maria J.", text: "I finally understood how to approach scenario-based questions. The platform is easy to use and very effective." },
];

const NAV: string[] = ["Home", "Question Bank", "Mock Exams", "Courses", "About", "Pricing", "Resources"];

const initials = (n: string): string => n.split(" ").map((s) => s[0]).join("");

export interface HomePageProps {
  /** Called when the Login button is clicked (default: go to /login) */
  onLogin?: () => void;
  /** Called by every "Get Started" button (default: go to /register) */
  onRegister?: () => void;
  /** Called with a route path, e.g. "/question-bank" */
  onNavigate?: (path: string) => void;
  /** URL of the hero photo (right side of the hero) */
  heroImage?: string;
}

// Maps landing-page paths to real app routes
const PATH_MAP: Record<string, string> = {
  "/": "/",
  "/home": "/",
  "/question-bank": "/practice",
  "/mock-exams": "/mock-exams",
};

export default function LandingPage({
  onLogin,
  onRegister,
  onNavigate,
  heroImage,
}: HomePageProps) {
  const navigate = useNavigate();

  // Defaults: Login -> /login, Get Started -> /register
  const handleLogin = onLogin ?? (() => navigate("/login"));
  const handleRegister = onRegister ?? (() => navigate("/register"));
  const handleNavigate =
    onNavigate ??
    ((path: string) => {
      const target = PATH_MAP[path];
      if (target) navigate(target);
    });

  const go = (path: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handleNavigate(path);
  };

  return (
    <div className="ds-home">
      <style>{CSS}</style>

      {/* ───────── Header ───────── */}
      <header className="hd">
        <div className="wrap hd-in">
          <a href="/" className="brand" onClick={go("/")}>
            <span className="logo">DS</span>
            <span className="brand-name">DR SULFATH<br />— ADC</span>
          </a>
          <span className="tagline">Practice. Reason. Master.</span>
          <nav className="nav" aria-label="Primary">
            {NAV.map((n, i) => (
              <a key={n} href="#" className={i === 0 ? "active" : ""}
                onClick={go("/" + n.toLowerCase().replace(/\s+/g, "-"))}>{n}</a>
            ))}
          </nav>
          <div className="hd-actions">
            <button className="icon-btn" aria-label="Search"><Icon d={ICONS.search} size={18} /></button>
            <button className="btn btn-outline sm" onClick={handleLogin}>Login</button>
            <button className="btn btn-solid sm" onClick={handleRegister}>Get Started</button>
          </div>
        </div>
      </header>

      {/* ───────── Hero ───────── */}
      <section className="hero">
        <div className="wrap hero-in">
          <div className="hero-copy">
            <span className="pill">ADC WRITTEN EXAM PREPARATION</span>
            <h1>Master the ADC<br />Written Examination</h1>
            <p className="lead">
              Practice scenario-based questions. Understand the reasoning.<br />
              Build clinical confidence.
            </p>
            <div className="row">
              <button className="btn btn-solid" onClick={handleRegister}>Get Started <Icon d={ICONS.arrow} size={16} /></button>
              <button className="btn btn-outline" onClick={() => handleNavigate("/question-bank")}>Explore Question Bank</button>
            </div>
            <ul className="hero-feats">
              {HERO_FEATURES.map((f) => (
                <li key={f.label}><Icon d={ICONS[f.icon]} size={26} /><span>{f.label}</span></li>
              ))}
            </ul>
          </div>

          <div className="hero-visual">
            {heroImage
              ? <img src={heroImage} alt="Student practising ADC questions on a laptop" />
              : <div className="hero-ph" aria-hidden="true" />}
            <div className="q-card" role="img" aria-label="Sample practice question">
              <div className="q-top"><b>Endodontics → Pulpal Diagnosis</b><span>12 / 30</span></div>
              <div className="bar"><i style={{ width: "40%" }} /></div>
              <p>A 45-year-old patient presents with spontaneous pain in the mandibular first molar. The tooth is vital and the radiograph shows no obvious periapical changes. What is the MOST appropriate diagnosis?</p>
              {["Reversible pulpitis", "Symptomatic irreversible pulpitis", "Pulp necrosis", "Previously treated", "Normal pulp"].map((o, i) => (
                <div className="opt" key={o}><span />{String.fromCharCode(65 + i)}. {o}</div>
              ))}
              <div className="q-foot"><button className="btn btn-solid xs" tabIndex={-1}>Submit Answer</button><small>Bookmark &nbsp; Report</small></div>
            </div>
            <span className="scribble">Learn<br />from every<br />question</span>
          </div>
        </div>
      </section>

      {/* ───────── Stats band ───────── */}
      <section className="stats">
        <div className="wrap stats-in">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <Icon d={ICONS[s.icon]} size={34} />
              <div><strong>{s.value}</strong><span>{s.label}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Why ───────── */}
      <section className="sec wrap why">
        <div className="why-copy">
          <span className="eyebrow">WHY DR SULFATH ADC?</span>
          <h2>Don’t Just Memorise Answers.<br />Learn How to Think.</h2>
          <p>ADC preparation is not only about knowing facts. It is about understanding clinical information, identifying the key clues, applying your knowledge and choosing the most appropriate answer.</p>
          <p>Dr Sulfath ADC helps you turn every question into a learning opportunity.</p>
          <hr className="gold-rule" />
        </div>
        <div className="why-grid">
          {WHY.map((w, i) => (
            <article className="card" key={w.title}>
              <span className={"badge " + (i % 2 ? "warm" : "")}><Icon d={ICONS[w.icon]} /></span>
              <small className="num">0{i + 1}</small>
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ───────── How it works ───────── */}
      <section className="sec wrap">
        <span className="eyebrow">HOW IT WORKS</span>
        <h2>Your Question. Your Reasoning. Your Progress.</h2>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className={"badge lg " + (i % 2 ? "warm" : "")}><Icon d={ICONS[s.icon]} size={26} /></span>
              <div>
                <small className="num">0{i + 1}</small>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
              {i < STEPS.length - 1 && <span className="step-arrow"><Icon d={ICONS.arrow} size={18} /></span>}
            </li>
          ))}
        </ol>
      </section>

      {/* ───────── Question bank ───────── */}
      <section className="sec wrap bank">
        <div className="bank-copy">
          <span className="eyebrow">EXPLORE QUESTION BANK</span>
          <h2>Practice Your Way</h2>
          <p>Choose a topic, cluster, discipline or difficulty level and start practising instantly.</p>
          <button className="btn btn-solid" onClick={() => handleNavigate("/question-bank")}>Explore Question Bank <Icon d={ICONS.arrow} size={16} /></button>
        </div>
        <div className="bank-grid">
          {BANK.map((b) => (
            <article className="card sm" key={b.title}>
              <span className="badge"><Icon d={ICONS[b.icon]} size={20} /></span>
              <h4>{b.title}</h4>
              <p>{b.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ───────── Progress + Mock exams ───────── */}
      <section className="wrap panel">
        <div className="dash">
          <div className="laptop">
            <b>Your Progress</b>
            <div className="dash-row">
              <div className="ring"><span>76%</span><small>Overall Accuracy</small></div>
              <svg viewBox="0 0 160 70" className="spark" aria-hidden="true">
                <polyline points="0,60 20,50 40,54 60,38 80,44 100,26 120,32 140,14 160,8" fill="none" stroke="#0f6b6b" strokeWidth="2" />
              </svg>
            </div>
            <div className="dash-stats">
              <div><small>Questions Solved</small><b>1,248</b></div>
              <div><small>Mock Exams</small><b>4</b></div>
              <div><small>Questions to Review</small><b>86</b></div>
            </div>
          </div>
        </div>
        <div className="progress-copy">
          <span className="eyebrow">SEE YOUR PROGRESS</span>
          <h2>Track. Analyse. Improve.</h2>
          <p>Know your strengths, find your weaknesses and build a study plan that works for you.</p>
          <button className="btn btn-solid sm" onClick={handleLogin}>View Dashboard <Icon d={ICONS.arrow} size={14} /></button>
        </div>
        <div className="mock-copy">
          <span className="eyebrow">MOCK EXAMS</span>
          <h2 className="h3">Test Yourself Under Exam Conditions</h2>
          <ul className="ticks">
            {MOCKS.map((m) => <li key={m}><Icon d={ICONS.check} size={14} />{m}</li>)}
          </ul>
          <button className="btn btn-solid sm" onClick={() => handleNavigate("/mock-exams")}>Explore Mock Exams <Icon d={ICONS.arrow} size={14} /></button>
        </div>
      </section>

      {/* ───────── Testimonials ───────── */}
      <section className="sec wrap">
        <span className="eyebrow">STUDENT TESTIMONIALS</span>
        <h2 className="tes-h">Real Students. Real Experiences.</h2>
        <div className="tes-grid">
          {TESTIMONIALS.map((t) => (
            <figure className="tes" key={t.name}>
              <span className="avatar" aria-hidden="true">{initials(t.name)}</span>
              <blockquote>“{t.text}”</blockquote>
              <figcaption><b>{t.name}</b><small>ADC Aspirant</small></figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ───────── Final CTA ───────── */}
      <footer className="cta">
        <div className="wrap cta-in">
          <div>
            <span className="eyebrow gold">READY TO START?</span>
            <h2>Your ADC Preparation Starts With One Question.</h2>
            <p>Don’t just collect questions. Learn how to solve them.</p>
          </div>
          <div className="cta-brand">
            <span className="logo light">DS</span>
            <span className="brand-name light">DR SULFATH<br />— ADC</span>
            <span className="tagline light">Practice. Reason. Master.</span>
          </div>
          <button className="btn btn-gold" onClick={handleRegister}>Get Started <Icon d={ICONS.arrow} size={16} /></button>
        </div>
      </footer>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');

.ds-home{
  --teal:#0f6b6b; --teal-d:#0b5555; --navy:#0f2a4a; --gold:#c9993a; --gold-l:#f0c674;
  --cream:#fbf8f3; --mist:#e8f2f3; --ink:#14243a; --muted:#5b6878; --line:#e9e4da; --card:#fffdf9;
  font-family:'Inter',system-ui,sans-serif; color:var(--ink); background:var(--cream); line-height:1.5;
}
.ds-home *{box-sizing:border-box}
.ds-home h1,.ds-home h2,.ds-home h3{font-family:'Playfair Display',Georgia,serif; color:var(--navy); margin:0; font-weight:700}
.ds-home p{margin:0}
.ds-home a{color:inherit; text-decoration:none}
.ds-home .wrap{max-width:1180px; margin:0 auto; padding:0 24px}
.ds-home .sec{padding:56px 24px}
.ds-home .eyebrow{display:block; font-size:11px; letter-spacing:.08em; color:var(--gold); font-weight:600; margin-bottom:8px}
.ds-home .eyebrow.gold{color:var(--gold-l)}
.ds-home h2{font-size:32px; line-height:1.2}
.ds-home h2.h3{font-size:22px}
.ds-home .num{display:block; font-size:11px; font-weight:600; color:var(--navy); margin:10px 0 2px}

/* buttons */
.ds-home .btn{display:inline-flex; align-items:center; gap:8px; border-radius:999px; font:600 14px 'Inter',sans-serif; padding:13px 24px; cursor:pointer; border:1.5px solid transparent; transition:background .15s, color .15s}
.ds-home .btn.sm{padding:9px 20px; font-size:13px}
.ds-home .btn.xs{padding:6px 14px; font-size:11px}
.ds-home .btn-solid{background:var(--teal); color:#fff}
.ds-home .btn-solid:hover{background:var(--teal-d)}
.ds-home .btn-outline{background:transparent; color:var(--teal); border-color:var(--teal)}
.ds-home .btn-outline:hover{background:var(--mist)}
.ds-home .btn-gold{background:var(--gold-l); color:var(--navy)}
.ds-home .btn:focus-visible,.ds-home a:focus-visible,.ds-home .icon-btn:focus-visible{outline:3px solid var(--gold); outline-offset:2px}

/* header */
.ds-home .hd{background:var(--cream); border-bottom:1px solid var(--line); position:sticky; top:0; z-index:20}
.ds-home .hd-in{display:flex; align-items:center; gap:24px; height:62px}
.ds-home .brand{display:flex; align-items:center; gap:10px}
.ds-home .logo{font-family:'Playfair Display',serif; font-size:34px; font-weight:700; color:var(--navy); letter-spacing:-3px; line-height:1}
.ds-home .logo.light{color:#fff}
.ds-home .brand-name{font-size:11px; font-weight:700; letter-spacing:.08em; color:var(--navy); line-height:1.3}
.ds-home .brand-name.light{color:#fff}
.ds-home .tagline{font-size:11px; color:var(--muted); border-left:1px solid var(--line); padding-left:18px}
.ds-home .tagline.light{color:#c9d4e3}
.ds-home .nav{display:flex; gap:22px; margin:0 auto; font-size:12px; font-weight:500}
.ds-home .nav a{padding:6px 0; border-bottom:2px solid transparent}
.ds-home .nav a.active{color:var(--teal); border-color:var(--teal)}
.ds-home .nav a:hover{color:var(--teal)}
.ds-home .hd-actions{display:flex; align-items:center; gap:10px}
.ds-home .icon-btn{background:none; border:0; color:var(--ink); cursor:pointer; padding:6px; border-radius:50%}

/* hero */
.ds-home .hero{background:linear-gradient(90deg,var(--cream) 40%,#efeee9); overflow:hidden}
.ds-home .hero-in{display:grid; grid-template-columns:1.05fr 1fr; align-items:center; gap:24px; padding-top:44px; padding-bottom:44px}
.ds-home .pill{display:inline-block; font-size:10px; letter-spacing:.06em; font-weight:600; color:var(--teal); background:var(--mist); padding:6px 14px; border-radius:999px}
.ds-home h1{font-size:44px; line-height:1.12; margin:18px 0 16px}
.ds-home .lead{font-size:15px; margin-bottom:24px}
.ds-home .row{display:flex; gap:14px; flex-wrap:wrap}
.ds-home .hero-feats{list-style:none; display:flex; gap:32px; padding:0; margin:34px 0 0; flex-wrap:wrap}
.ds-home .hero-feats li{display:flex; flex-direction:column; gap:8px; color:var(--teal); font-size:11px; max-width:90px}
.ds-home .hero-feats span{color:var(--ink)}
.ds-home .hero-visual{position:relative; min-height:360px}
.ds-home .hero-visual img,.ds-home .hero-ph{position:absolute; inset:0 0 0 -10%; width:110%; height:100%; object-fit:cover; border-radius:0}
.ds-home .hero-ph{background:radial-gradient(circle at 35% 40%,#cfd9db,#e9ecea 70%)}
.ds-home .q-card{position:absolute; right:8%; top:8%; width:300px; background:#fff; border-radius:12px; padding:14px 16px; box-shadow:0 12px 36px rgba(15,42,74,.18); font-size:9.5px}
.ds-home .q-top{display:flex; justify-content:space-between; margin-bottom:6px}
.ds-home .bar{height:3px; background:#e3e8ea; border-radius:3px; margin-bottom:10px}
.ds-home .bar i{display:block; height:100%; background:var(--teal); border-radius:3px}
.ds-home .q-card p{margin-bottom:8px; color:#3a4a5f; line-height:1.45}
.ds-home .opt{display:flex; align-items:center; gap:8px; padding:3px 0; color:#3a4a5f}
.ds-home .opt span{width:9px; height:9px; border:1px solid #b9c3c9; border-radius:50%}
.ds-home .q-foot{display:flex; justify-content:space-between; align-items:center; margin-top:10px}
.ds-home .scribble{position:absolute; right:-2%; top:18%; font-family:'Playfair Display',serif; font-style:italic; font-size:13px; color:var(--navy); text-align:center; transform:rotate(-6deg); line-height:1.2}

/* stats */
.ds-home .stats{background:var(--mist)}
.ds-home .stats-in{display:flex; justify-content:space-around; padding-top:22px; padding-bottom:22px; gap:20px; flex-wrap:wrap}
.ds-home .stat{display:flex; align-items:center; gap:14px; color:var(--teal)}
.ds-home .stat strong{display:block; font:600 22px 'Inter',sans-serif; color:var(--navy)}
.ds-home .stat span{font-size:12px; color:var(--muted)}

/* cards */
.ds-home .why{display:grid; grid-template-columns:.9fr 1.6fr; gap:40px; align-items:center}
.ds-home .why-copy p{font-size:13px; color:#33435a; margin-top:16px}
.ds-home .gold-rule{width:48px; border:0; border-top:3px solid var(--gold-l); margin:20px 0 0; text-align:left}
.ds-home .why-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:14px}
.ds-home .card{background:var(--card); border:1px solid var(--line); border-radius:10px; padding:22px 18px}
.ds-home .card h3{font-size:17px; font-family:'Inter',sans-serif; font-weight:600}
.ds-home .card p{font-size:12px; color:var(--muted); margin-top:6px}
.ds-home .card.sm{padding:16px 14px}
.ds-home .card.sm h4{margin:10px 0 4px; font-size:12px; font-weight:600}
.ds-home .badge{display:inline-grid; place-items:center; width:44px; height:44px; border-radius:50%; background:var(--mist); color:var(--teal)}
.ds-home .badge.warm{background:#fbeccd; color:var(--gold)}
.ds-home .badge.lg{width:56px; height:56px; flex:none}

/* steps */
.ds-home .steps{list-style:none; padding:0; margin:28px 0 0; display:grid; grid-template-columns:repeat(4,1fr); gap:24px}
.ds-home .steps li{display:flex; gap:14px; position:relative}
.ds-home .steps h3{font-size:17px}
.ds-home .steps p{font-size:12px; color:var(--muted); margin-top:6px; max-width:150px}
.ds-home .step-arrow{position:absolute; right:-6px; top:18px; color:#c9d0d6}

/* bank */
.ds-home .bank{display:grid; grid-template-columns:.7fr 2.3fr; gap:28px; align-items:center; border-top:1px solid var(--line)}
.ds-home .bank-copy p{font-size:12px; color:var(--muted); margin:10px 0 20px}
.ds-home .bank-copy h2{font-size:26px}
.ds-home .bank-grid{display:grid; grid-template-columns:repeat(5,1fr); gap:12px}

/* panel */
.ds-home .panel{display:grid; grid-template-columns:1.05fr 1fr 1fr; background:#f1f4f3; border-radius:10px; overflow:hidden; padding:0}
.ds-home .dash{background:linear-gradient(135deg,#dfe9e7,#eef2f0); padding:28px 24px; display:grid; place-items:center}
.ds-home .laptop{background:#fff; border:6px solid #1d2733; border-radius:8px; padding:14px; width:100%; max-width:300px; font-size:11px}
.ds-home .dash-row{display:flex; align-items:center; gap:14px; margin:10px 0}
.ds-home .ring{width:72px; height:72px; border-radius:50%; background:conic-gradient(var(--teal) 76%,#e1e8e8 0); display:grid; place-content:center; text-align:center; position:relative; flex:none}
.ds-home .ring::before{content:""; position:absolute; inset:9px; background:#fff; border-radius:50%}
.ds-home .ring span,.ds-home .ring small{position:relative; line-height:1.1}
.ds-home .ring span{font-weight:700; font-size:15px}
.ds-home .ring small{font-size:6px; color:var(--muted)}
.ds-home .spark{flex:1; height:56px}
.ds-home .dash-stats{display:grid; grid-template-columns:repeat(3,1fr); gap:6px; text-align:center}
.ds-home .dash-stats div{background:#f4f6f6; border-radius:4px; padding:5px 2px}
.ds-home .dash-stats small{display:block; font-size:7px; color:var(--muted)}
.ds-home .progress-copy,.ds-home .mock-copy{padding:32px 26px}
.ds-home .progress-copy h2{font-size:24px}
.ds-home .progress-copy p{font-size:13px; color:#33435a; margin:12px 0 20px}
.ds-home .ticks{list-style:none; padding:0; margin:14px 0 18px; font-size:12px; display:grid; gap:8px}
.ds-home .ticks li{display:flex; align-items:center; gap:8px}
.ds-home .ticks svg{color:var(--teal); flex:none}

/* testimonials */
.ds-home .tes-h{font-size:24px; margin-bottom:18px}
.ds-home .tes-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:20px}
.ds-home .tes{margin:0; background:var(--card); border:1px solid var(--line); border-radius:8px; padding:18px; display:grid; grid-template-columns:44px 1fr; gap:6px 14px}
.ds-home .avatar{grid-row:span 2; width:44px; height:44px; border-radius:50%; background:var(--mist); color:var(--teal); display:grid; place-items:center; font-weight:600; font-size:13px}
.ds-home .tes blockquote{margin:0; font-size:12px; color:#33435a}
.ds-home .tes figcaption{display:flex; flex-direction:column; font-size:11px}
.ds-home .tes small{color:var(--muted)}

/* CTA */
.ds-home .cta{background:var(--navy); color:#fff; margin-top:24px}
.ds-home .cta-in{display:flex; align-items:center; justify-content:space-between; gap:28px; padding-top:44px; padding-bottom:44px; flex-wrap:wrap}
.ds-home .cta h2{color:#fff; font-size:26px}
.ds-home .cta p{font-size:12px; margin-top:12px; color:#dbe4f0}
.ds-home .cta-brand{display:flex; align-items:center; gap:12px}

/* responsive */
@media (max-width:1000px){
  .ds-home .nav,.ds-home .tagline{display:none}
  .ds-home .hd-actions{margin-left:auto}
  .ds-home .hero-in,.ds-home .why,.ds-home .bank,.ds-home .panel{grid-template-columns:1fr}
  .ds-home .why-grid,.ds-home .steps{grid-template-columns:repeat(2,1fr)}
  .ds-home .bank-grid{grid-template-columns:repeat(2,1fr)}
  .ds-home .tes-grid{grid-template-columns:1fr}
  .ds-home .step-arrow{display:none}
  .ds-home .hero-visual{min-height:420px}
  .ds-home .q-card{right:auto; left:50%; transform:translateX(-50%)}
  .ds-home .scribble{display:none}
}
@media (max-width:560px){
  .ds-home h1{font-size:34px}
  .ds-home h2{font-size:26px}
  .ds-home .why-grid,.ds-home .steps,.ds-home .bank-grid{grid-template-columns:1fr}
  .ds-home .q-card{width:90%}
}
`;