import { useState, useEffect, useRef } from "react";

const STEPS = [
  { id: "welcome", type: "welcome" },
  {
    id: "q1", type: "single", step: 1, total: 8,
    label: "When you think about making art right now, what comes up first?",
    options: [
      { id: "a", letter: "A", text: "An inner critic. A voice that says it\u2019s not good enough, I\u2019m not ready, I need to do it better.", pattern: "fight" },
      { id: "b", letter: "B", text: "A sudden urge to do anything else \u2014 clean, scroll, stay busy. Anything but sit down with it.", pattern: "flight" },
      { id: "c", letter: "C", text: "A kind of freeze. I want to create but I feel stuck, overwhelmed, and unable to begin.", pattern: "freeze" },
      { id: "d", letter: "D", text: "Worry about what others will think \u2014 whether I\u2019ll disappoint someone or lose their approval.", pattern: "fawn" },
      { id: "e", letter: "E", text: "Heaviness. Numbness. An absence of desire where the wanting used to be.", pattern: "collapse" },
    ],
  },
  {
    id: "q2", type: "single", step: 2, total: 8,
    label: "When you try to sit down and begin, what usually happens?",
    options: [
      { id: "a", letter: "A", text: "I start and restart. Nothing feels right. I\u2019m too hard on myself to let anything be imperfect.", pattern: "fight" },
      { id: "b", letter: "B", text: "I find reasons to delay \u2014 a chore, an errand, one more thing to do first.", pattern: "flight" },
      { id: "c", letter: "C", text: "I open the sketchbook or file and just\u2026 sit there. I can\u2019t quite make the first move.", pattern: "freeze" },
      { id: "d", letter: "D", text: "I think about who might see it and what they\u2019ll think. That thought stops me.", pattern: "fawn" },
      { id: "e", letter: "E", text: "I don\u2019t really try. There\u2019s not enough drive left to get me to the starting point.", pattern: "collapse" },
    ],
  },
  {
    id: "q3", type: "single", step: 3, total: 8,
    label: "The voice inside your head when it comes to your art \u2014 which sounds most familiar?",
    options: [
      { id: "a", letter: "A", text: "\u201cThis isn\u2019t good enough. You can do better. Why aren\u2019t you further along?\u201d", pattern: "fight" },
      { id: "b", letter: "B", text: "\u201cI\u2019ll get to it later. I\u2019m just too busy right now. Maybe tomorrow.\u201d", pattern: "flight" },
      { id: "c", letter: "C", text: "\u201cI don\u2019t even know where to start. What if I choose wrong?\u201d", pattern: "freeze" },
      { id: "d", letter: "D", text: "\u201cWhat will people think? Will this let anyone down?\u201d", pattern: "fawn" },
      { id: "e", letter: "E", text: "\u201cI used to care about this. Now I\u2019m not sure I feel anything about it at all.\u201d", pattern: "collapse" },
    ],
  },
  {
    id: "q4", type: "single", step: 4, total: 8,
    label: "When you go a long stretch without creating, what tends to happen?",
    options: [
      { id: "a", letter: "A", text: "I get frustrated with myself. The self-criticism gets louder.", pattern: "fight" },
      { id: "b", letter: "B", text: "I stay busy enough that I can almost not notice \u2014 until I do, and feel guilty.", pattern: "flight" },
      { id: "c", letter: "C", text: "I feel frozen in it. The longer I wait, the harder it feels to come back.", pattern: "freeze" },
      { id: "d", letter: "D", text: "I feel like I\u2019m letting people down \u2014 a teacher, a community, someone who believed in me.", pattern: "fawn" },
      { id: "e", letter: "E", text: "Not much. There\u2019s a flatness. I notice the absence but I can\u2019t feel moved by it.", pattern: "collapse" },
    ],
  },
  {
    id: "q5", type: "single", step: 5, total: 8,
    label: "On the rare occasion you do create \u2014 what happens?",
    options: [
      { id: "a", letter: "A", text: "I pick it apart before it\u2019s finished. Nothing I make feels good enough to keep going.", pattern: "fight" },
      { id: "b", letter: "B", text: "I feel a brief relief, then immediately move on to something else. I don\u2019t sit with it.", pattern: "flight" },
      { id: "c", letter: "C", text: "I feel overwhelmed by how much I\u2019ve lost. The gap between where I am and where I was feels enormous.", pattern: "freeze" },
      { id: "d", letter: "D", text: "I immediately wonder if it\u2019s good enough to share. The audience shows up in my head before the paint dries.", pattern: "fawn" },
      { id: "e", letter: "E", text: "I feel almost nothing. Like I\u2019m going through the motions but I\u2019m not really in the room.", pattern: "collapse" },
    ],
  },
  {
    id: "q6", type: "single", step: 6, total: 8,
    label: "Your relationship to other people\u2019s opinions of your work \u2014 which fits best?",
    options: [
      { id: "a", letter: "A", text: "I\u2019m my own harshest critic \u2014 other people\u2019s opinions barely get a chance before mine does.", pattern: "fight" },
      { id: "b", letter: "B", text: "I avoid sharing so I never have to find out what people think.", pattern: "flight" },
      { id: "c", letter: "C", text: "The thought of sharing feels overwhelming. I\u2019m not sure I\u2019ll ever feel ready.", pattern: "freeze" },
      { id: "d", letter: "D", text: "I create with an audience in mind. Their approval feels like the point.", pattern: "fawn" },
      { id: "e", letter: "E", text: "I\u2019ve stopped thinking about it. I\u2019m not creating enough to share anything.", pattern: "collapse" },
    ],
  },
  {
    id: "q7", type: "single", step: 7, total: 8,
    label: "How long has this been your creative experience?",
    options: [
      { id: "a", letter: "A", text: "A few weeks to a few months." },
      { id: "b", letter: "B", text: "Around 6 months to a year." },
      { id: "c", letter: "C", text: "Over a year \u2014 it\u2019s been building." },
      { id: "d", letter: "D", text: "As long as I can remember. This feels like my default." },
    ],
  },
  {
    id: "q8", type: "single", step: 8, total: 8,
    label: "What feels most true about what you need right now?",
    options: [
      { id: "a", letter: "A", text: "Permission to create without it being perfect or impressive.", pattern: "fight" },
      { id: "b", letter: "B", text: "A safe, low-pressure space to return to art slowly.", pattern: "flight" },
      { id: "c", letter: "C", text: "Someone to help me take the first step and stay present.", pattern: "freeze" },
      { id: "d", letter: "D", text: "Support to create for myself, not for anyone else\u2019s approval.", pattern: "fawn" },
      { id: "e", letter: "E", text: "Something gentle to remind me why I loved making art.", pattern: "collapse" },
    ],
  },
  { id: "result", type: "result" },
];

const PATTERN_META = {
  collapse: { level: 1, label: "The Hollowed Out",      subtitle: "No feeling. No fuel. The well has run dry.", tagline: "The desire isn\u2019t gone. It\u2019s buried under exhaustion.", awareness: "UNKNOWN TO SELF. INVISIBLE TO OTHERS.", color: "#7A9E9E", bg: "#1C2625" },
  freeze:   { level: 2, label: "The Paralyzed Creator",  subtitle: "Wanting without moving. Stuck at the door.", tagline: "You want to create. Your body won\u2019t let you start.", awareness: "KNOWN TO SELF. HIDDEN FROM OTHERS.", color: "#8AABBF", bg: "#1A2329" },
  flight:   { level: 3, label: "The Escape Artist",      subtitle: "Always in motion. Never in the studio.", tagline: "You\u2019re not avoiding your art. You\u2019re avoiding what it asks of you.", awareness: "HIDDEN FROM SELF. VISIBLE TO OTHERS.", color: "#C4A24A", bg: "#1E2418" },
  fawn:     { level: 4, label: "The People\u2019s Artist", subtitle: "Creating for everyone. Connected to no one.", tagline: "You\u2019ve been creating for everyone except yourself.", awareness: "KNOWN TO OTHERS. LOST TO SELF.", color: "#A08C72", bg: "#241C22" },
  fight:    { level: 5, label: "The Perfectionist",      subtitle: "All output. No permission. The critic runs the show.", tagline: "All pressure. No permission. Your inner critic has taken the wheel.", awareness: "VISIBLE TO ALL. EXHAUSTING TO SELF.", color: "#D4845A", bg: "#261C16" },
};

const SYSTEM_PROMPT = [
  "You are a compassionate guide for burned-out artists. The five creative block profiles you work with are: The Perfectionist, The Escape Artist, The Paralyzed Creator, The People's Artist, and The Hollowed Out.",
  "",
  "- The Perfectionist: perfectionism, inner critic, urgency, over-efforting, fear of not being good enough",
  "- The Escape Artist: avoidance, busyness, procrastination, staying in motion to escape the discomfort of creating",
  "- The Paralyzed Creator: paralysis, overwhelm, unable to begin, stuck at the starting line",
  "- The People's Artist: creating for others approval, people-pleasing, losing touch with personal creative desire",
  "- The Hollowed Out: shutdown, numbness, heaviness, disconnection from creative desire, flatness",
  "",
  "Based on the quiz answers, write a personalized result. Use second person (you). Write in short, punchy paragraphs. Be poetic but grounded. Use this EXACT format and these EXACT headings:",
  "",
  "THE RESULT",
  "[One powerful sentence. A diagnosis-like statement. No softening.]",
  "",
  "WHAT THIS LOOKS LIKE",
  "- [specific behavior from their answers]",
  "- [specific behavior from their answers]",
  "- [specific behavior from their answers]",
  "- [specific behavior from their answers]",
  "",
  "WHAT YOU TELL YOURSELF",
  "[3-4 short quotes the artist says to themselves. Each on its own line starting with a dash.]",
  "",
  "THE INNER EXPERIENCE",
  "[2-3 sentences. Short. Visceral. Name the felt sense.]",
  "",
  "IN YOUR CREATIVE LIFE",
  "[2-3 sentences about the practical impact on their art practice.]",
  "",
  "WHAT THIS PATTERN IS PROTECTING YOU FROM",
  "[2-3 sentences. Reframe the block as intelligent. Name what the nervous system is guarding against.]",
  "",
  "A SMALL STEP YOU CAN TAKE TODAY",
  "[1-2 sentences. One gentle action. Not about output. About reconnection.]",
  "",
  "WHAT THIS DOES NOT MEAN",
  "[2-3 sentences dispelling shame. What this pattern does NOT say about them.]",
  "",
  "A MESSAGE FOR THE HARD DAYS",
  "[2-3 sentences they can return to. Warm. Real. Not saccharine.]",
  "",
  "Rules: Write like a poet who understands trauma. Short paragraphs. No clinical jargon. No preamble or sign-offs. Frame patterns as protective intelligence. Never frame the artist as lazy or broken. Include ALL nine sections.",
].join("\n");

function scoreAnswers(answers) {
  const counts = { fight: 0, flight: 0, freeze: 0, fawn: 0, collapse: 0 };
  ["q1","q2","q3","q4","q5","q6","q8"].forEach(qid => {
    const step = STEPS.find(s => s.id === qid);
    if (!step) return;
    const chosen = step.options.find(o => o.id === answers[qid]);
    if (chosen && chosen.pattern) counts[chosen.pattern]++;
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const topCount = sorted[0][1];
  const topPatterns = sorted.filter(e => e[1] === topCount).map(e => e[0]);
  let pattern;
  if (topPatterns.length === 1) {
    pattern = topPatterns[0];
  } else {
    const q8step = STEPS.find(s => s.id === "q8");
    const q8chosen = q8step ? q8step.options.find(o => o.id === answers.q8) : null;
    pattern = (q8chosen && q8chosen.pattern && topPatterns.includes(q8chosen.pattern)) ? q8chosen.pattern : topPatterns[0];
  }
  return { pattern, counts };
}

function buildFallbackText(patternKey) {
  const meta = PATTERN_META[patternKey];
  const desc = LEVEL_DESCRIPTIONS[patternKey];
  const quotesByPattern = {
    collapse: ["- I don't feel anything about it anymore.", "- Maybe I'm just not an artist right now.", "- It'll come back when it comes back.", "- I used to care about this so much."],
    freeze: ["- I don't know where to even start.", "- What if I choose the wrong thing?", "- I'll figure it out once I sit down.", "- There's too much to decide."],
    flight: ["- I'll get to it once things calm down.", "- I'm just so busy right now.", "- I'll make time for it next week.", "- I did enough today already."],
    fawn: ["- I hope they like this.", "- What will people think?", "- I should make something they'd want.", "- This isn't really for me anyway."],
    fight: ["- This isn't good enough yet.", "- I should be further along by now.", "- I can always do better.", "- Why does this feel so hard?"],
  };
  return [
    "THE RESULT",
    "You are " + meta.label + " \u2014 " + meta.tagline,
    "",
    "WHAT THIS LOOKS LIKE",
    desc.signs.map(s => "- " + s).join("\n"),
    "",
    "WHAT YOU TELL YOURSELF",
    quotesByPattern[patternKey].join("\n"),
    "",
    "THE INNER EXPERIENCE",
    desc.innerExperience,
    "",
    "IN YOUR CREATIVE LIFE",
    desc.inCreativeLife,
    "",
    "WHAT THIS PATTERN IS PROTECTING YOU FROM",
    "This pattern isn't a flaw \u2014 it's a form of protection your nervous system built to keep you safe. It showed up for a reason, even if it no longer serves you the way it used to.",
    "",
    "A SMALL STEP YOU CAN TAKE TODAY",
    "Spend five minutes near your creative materials without any pressure to produce anything. Let proximity be enough for today.",
    "",
    "WHAT THIS DOES NOT MEAN",
    "This does not mean you are lazy, broken, or incapable. It means part of you is trying to protect you from something that once felt unsafe.",
    "",
    "A MESSAGE FOR THE HARD DAYS",
    "You have not lost your creativity. It is waiting for you, exactly as it always has. There is no deadline on coming back to it.",
  ].join("\n");
}

const CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #0D0D0D; }
.qr { min-height: 100vh; background: #0D0D0D; color: #E8E4DF; font-family: 'Jost', sans-serif; font-weight: 300; }
.qr-inner { max-width: 720px; margin: 0 auto; padding: 0 1.5rem; }

.welcome { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 3rem 1.5rem; }
.welcome-pre { font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase; color: #888; margin-bottom: 1rem; font-weight: 400; }
.welcome h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 2.8rem; font-weight: 400; line-height: 1.15; color: #FFFFFF; margin-bottom: 1rem; max-width: 600px; }
.welcome h1 em { font-style: italic; color: #9A7B2E; }
.welcome-sub { font-size: 0.95rem; color: #888; line-height: 1.7; margin-bottom: 2.5rem; max-width: 480px; }
.welcome-cta { display: inline-block; width: 320px; text-align: center; background: #9A7B2E; color: #FFFFFF; border: none; padding: 1rem 0; font-size: 0.85rem; font-family: 'Jost', sans-serif; font-weight: 600; border-radius: 0; cursor: pointer; letter-spacing: 0.18em; text-transform: uppercase; transition: opacity 0.2s; box-sizing: border-box; white-space: nowrap; }
.welcome-cta:hover { opacity: 0.85; }

.progress-wrap { padding: 2rem 0 0; }
.progress-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.progress-label { font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: #666; font-weight: 500; }
.progress-pct { font-size: 0.7rem; color: #666; font-weight: 500; }
.progress-bar { width: 100%; height: 2px; background: #222; border-radius: 1px; overflow: hidden; }
.progress-fill { height: 100%; background: #E8E4DF; transition: width 0.4s ease; border-radius: 1px; }

.question-wrap { padding: 2.5rem 0 4rem; }
.question-text { font-family: 'Jost', sans-serif; font-size: 1.5rem; font-weight: 300; line-height: 1.4; color: #FFFFFF; margin-bottom: 2rem; }
.options { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 2.5rem; }
.opt { display: flex; align-items: flex-start; gap: 1rem; padding: 1.1rem 1.25rem; border: 0.5px solid #1A1A1A; border-left: 1px solid transparent; cursor: pointer; transition: border-color 0.15s, background 0.15s; }
.opt:hover { border-color: #9A7B2E; background: rgba(154,123,46,0.06); }
.opt.sel { border-color: #9A7B2E; border-left: 1px solid #9A7B2E; background: rgba(154,123,46,0.18); }
.opt-letter { font-size: 0.75rem; font-weight: 600; color: #555; flex-shrink: 0; width: 18px; margin-top: 2px; }
.opt.sel .opt-letter { color: #9A7B2E; }
.opt-text { font-size: 0.92rem; color: #AAA; line-height: 1.6; }
.opt.sel .opt-text { color: #FFFFFF; }

.nav { display: flex; justify-content: space-between; align-items: center; }
.nav-back { background: none; border: none; color: #555; font-size: 0.85rem; font-family: 'Jost', sans-serif; cursor: pointer; padding: 0.5rem 0; }
.nav-back:hover { color: #E8E4DF; }
.nav-next { background: #FFFFFF; color: #0D0D0D; border: none; padding: 0.75rem 2rem; font-size: 0.85rem; font-family: 'Jost', sans-serif; font-weight: 600; cursor: pointer; letter-spacing: 0.03em; transition: opacity 0.15s; }
.nav-next:disabled { opacity: 0.2; cursor: default; }
.nav-next:not(:disabled):hover { opacity: 0.85; }

/* ── LEVEL SCALE BAR (above result page) ── */
/* ── RESULT PAGE HEADER (reuses the exact Explore the Framework tab bar) ── */
.result-top-header { position: sticky; top: 0; z-index: 12; }
.result-top-header-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; max-width: 620px; margin: 0 auto; padding: 1.25rem 1.5rem 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.result-take-quiz-btn { flex-shrink: 0; background: transparent; border: 1px solid rgba(255,255,255,0.3); color: #F2EFE9; padding: 0.55rem 1.2rem; font-size: 0.7rem; font-family: 'Jost', sans-serif; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; white-space: nowrap; transition: background 0.15s, border-color 0.15s; }
.result-take-quiz-btn:hover { background: rgba(255,255,255,0.08); border-color: #F2EFE9; }

/* ── RESULT PAGE ── */
.result-page { transition: background 0.4s ease; min-height: 100vh; }

.result-hero { text-align: left; padding: 5rem 1.5rem 3rem; max-width: 700px; margin: 0 auto; border-bottom: 1px solid rgba(255,255,255,0.08); }
.result-nav { font-size: 0.9rem; letter-spacing: 0.25em; text-transform: uppercase; color: #F2EFE9; font-weight: 500; }
.result-level-num { font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 0.75rem; font-weight: 600; }
.result-subtitle-line { font-size: 1rem; color: #666; line-height: 1.6; margin-bottom: 0.75rem; font-weight: 300; }
.result-awareness { font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 1.5rem; font-weight: 600; }
.result-title { font-family: 'Playfair Display', Georgia, serif; font-size: 3rem; font-weight: 400; font-style: italic; color: #FFFFFF; line-height: 1.1; margin-bottom: 0.75rem; }

.result-tagline { font-family: 'Playfair Display', Georgia, serif; font-size: 1.05rem; color: #777; font-style: italic; line-height: 1.6; max-width: 480px; margin: 0 0 0.9rem; }

.result-body { max-width: 700px; margin: 0 auto; padding: 0 1.5rem; }

.result-section { padding: 2.5rem 0; }
.result-section:last-of-type { border-bottom: none; }
.rs-body-highlight-center { text-align: center; }

.rs-label { font-size: 0.85rem; letter-spacing: 0.15em; font-weight: 300; text-transform: uppercase; font-weight: 600; margin-bottom: 1rem; }
.rs-sublabel { font-family: 'Playfair Display', Georgia, serif; font-size: 1.4rem; font-weight: 400; color: #FFFFFF; line-height: 1.3; margin-bottom: 1rem; }
.rs-body { font-size: 1.05rem; color: #888; line-height: 1.9; }
.rs-body p { margin-bottom: 0.75rem; }
.rs-body ul { padding-left: 1.5rem; list-style: disc; margin: 0; }
.rs-body li { margin-bottom: 0.75rem; color: #BBB; }
.rs-body li::marker { color: #888; }
.rs-body-highlight { font-size: 1.25rem; color: #AAA; line-height: 1.85; font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic; }

.result-cta { text-align: left; padding: 4rem 1.5rem; max-width: 560px; margin: 0 auto; border-top: 1px solid rgba(255,255,255,0.08); }
.cta-pre { font-size: 0.95rem; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 1.5rem; font-weight: 600; }
.cta-message { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.1rem; color: #C9C4BC; font-style: italic; line-height: 1.8; margin-bottom: 1.5rem; }
.cta-title { font-family: 'Playfair Display', Georgia, serif; font-size: 1.8rem; font-weight: 400; color: #FFFFFF; margin-bottom: 1.25rem; line-height: 1.25; }
.cta-body { font-size: 0.98rem; color: #C9C4BC; line-height: 1.85; margin-bottom: 1.25rem; }
.cta-btn { display: inline-block; background: #FFFFFF; color: #0D0D0D; text-decoration: none; padding: 1rem 3rem; font-size: 0.8rem; font-family: 'Jost', sans-serif; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; border: none; cursor: pointer; transition: opacity 0.15s; }
.cta-btn:hover { opacity: 0.85; }

.reset-wrap { text-align: left; padding: 2rem 0 4rem; }
.reset-btn { background: none; border: none; color: #333; font-size: 0.75rem; font-family: 'Jost', sans-serif; cursor: pointer; letter-spacing: 0.1em; text-transform: uppercase; }
.reset-btn:hover { color: #E8E4DF; }
.quote-box { border: 0.5px solid #1A1A1A; padding: 1.1rem 1.25rem; margin-bottom: 0.6rem; font-size: 1.25rem; color: #AAA; line-height: 1.6; font-family: 'Cormorant Garamond', Georgia, serif; font-style: normal; }
.quote-box:last-child { margin-bottom: 0; }

.fw-bar { display: flex; justify-content: center; gap: 0; border-bottom: 1px solid rgba(255,255,255,0.08); padding: 0; margin-bottom: 0; position: sticky; top: 0; background: inherit; z-index: 10; max-width: 620px; margin-left: auto; margin-right: auto; }
.fw-tab { padding: 1rem 1rem; font-size: 0.85rem; flex: 0; letter-spacing: 0.15em; text-transform: uppercase; color: #777; cursor: pointer; border-bottom: 2px solid transparent; transition: color 0.2s, border-color 0.2s; text-align: center; flex: 1; }
.fw-tab:hover { color: #888; }
.fw-tab.active { border-bottom-color: currentColor; }
.fw-tab-num { display: block; font-size: 0.7rem; color: #777; margin-bottom: 0.25rem; font-weight: 500; }
.fw-page { max-width: 620px; margin: 0 auto; padding: 3rem 1.5rem 4rem; }
.fw-level-num { font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; font-weight: 600; margin-bottom: 0.5rem; }
.fw-title { font-family: 'Playfair Display', Georgia, serif; font-size: 2.4rem; font-weight: 400; font-style: italic; color: #FFFFFF; line-height: 1.15; margin-bottom: 0.5rem; }
.fw-subtitle { font-size: 1rem; color: #666; margin-bottom: 0.75rem; font-weight: 300; }
.fw-awareness { font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; font-weight: 600; margin-bottom: 1.5rem; }
.fw-tagline { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.3rem; color: #777; font-style: italic; line-height: 1.7; margin-bottom: 2rem; max-width: 480px; }
.fw-section { margin-bottom: 1.75rem; }
.fw-section-label { font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 300; margin-bottom: 0.6rem; }
.fw-section-body { font-size: 1.05rem; color: #AAA; line-height: 1.85; }
.fw-nav-row { display: flex; justify-content: space-between; padding: 2rem 0; border-top: 1px solid #1A1A1A; margin-top: 2rem; }
.fw-nav-btn { background: none; border: none; color: #E8E4DF; font-size: 0.8rem; font-family: 'Jost', sans-serif; cursor: pointer; letter-spacing: 0.05em; text-transform: uppercase; }
.fw-nav-btn:hover { color: #FFFFFF; }
.fw-back-quiz { display: block; text-align: center; margin-top: 2rem; font-size: 0.75rem; color: #E8E4DF; cursor: pointer; letter-spacing: 0.1em; text-transform: uppercase; border: none; background: none; font-family: 'Jost', sans-serif; }
.fw-back-quiz:hover { color: #FFFFFF; }
.explore-link { display: inline-block; width: 320px; text-align: center; border: 1px solid rgba(255,255,255,0.35); color: #FFFFFF; font-size: 0.85rem; font-weight: 600; padding: 1rem 0; cursor: pointer; letter-spacing: 0.18em; text-transform: uppercase; transition: background 0.2s, border-color 0.2s; background: none; font-family: 'Jost', sans-serif; box-sizing: border-box; white-space: nowrap; }
.explore-link:hover { background: rgba(255,255,255,0.08); border-color: #FFFFFF; }
.shimmer { height: 12px; background: linear-gradient(90deg, #1A1A1A 25%, #252525 50%, #1A1A1A 75%); background-size: 200% 100%; animation: shm 1.4s infinite; margin-bottom: 0.6rem; border-radius: 2px; }
@keyframes shm { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
`;

function ProgressBar({ step, total }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="progress-wrap">
      <div className="progress-top">
        <span className="progress-label">Question {step} of {total}</span>
        <span className="progress-pct">{pct}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: pct + "%" }} />
      </div>
    </div>
  );
}

function WelcomeScreen({ onStart, onExplore }) {
  return (
    <div className="welcome">
      <div className="welcome-pre">A Reading By Nicole Lau</div>
      <h1>Your Creative Block <em>Reading</em></h1>
      <p className="welcome-sub">Most artists think the problem is discipline. It isn't. The question is: what is your nervous system doing with your creativity right now?</p>
      <button className="welcome-cta" onClick={onStart}>TAKE THE READING</button>
      <div style={{ marginTop: "1rem" }}>
        <button className="explore-link" onClick={onExplore}>Explore the Framework</button>
      </div>
    </div>
  );
}

function QuestionScreen({ step, onNext, onBack, answers, setAnswer }) {
  const selected = answers[step.id];
  return (
    <div className="qr-inner">
      <ProgressBar step={step.step} total={step.total} />
      <div className="question-wrap">
        <div className="question-text">{step.label}</div>
        <div className="options">
          {step.options.map(opt => (
            <div key={opt.id} className={"opt" + (selected === opt.id ? " sel" : "")} onClick={() => setAnswer(step.id, opt.id)}>
              <span className="opt-letter">{opt.letter}</span>
              <span className="opt-text">{opt.text}</span>
            </div>
          ))}
        </div>
        <div className="nav">
          <button className="nav-back" onClick={onBack}>{"\u2190"} Back</button>
          {step.step === step.total
            ? <button className="nav-next" disabled={!selected} onClick={onNext}>See My Results {"\u2192"}</button>
            : <button className="nav-next" disabled={!selected} onClick={onNext}>Next {"\u2192"}</button>
          }
        </div>
      </div>
    </div>
  );
}

function ResultTopHeader({ activeLevel, onTakeQuiz, bg }) {
  return (
    <div className="result-top-header" style={{ background: bg }}>
      <div className="result-top-header-row">
        <div className="result-nav">{"\u2190"} YOUR CREATIVE BLOCK READING</div>
        <button className="result-take-quiz-btn" onClick={onTakeQuiz}>Take Quiz</button>
      </div>
      <div className="fw-bar">
        {LEVEL_ORDER.map((k, i) => {
          const m = PATTERN_META[k];
          const isActive = m.level === activeLevel;
          return (
            <div
              key={k}
              className={"fw-tab" + (isActive ? " active" : "")}
              style={isActive ? { color: m.color } : {}}
            >
              <span className="fw-tab-num">Level {i + 1}</span>
              {m.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResultScreen({ answers, onReset }) {
  const [loading, setLoading] = useState(true);
  const [aiText, setAiText] = useState("");
  const [error, setError] = useState("");
  const ref = useRef(null);

  const { pattern, counts } = scoreAnswers(answers);
  const meta = PATTERN_META[pattern];

  useEffect(() => {
    const qSteps = STEPS.filter(s => s.type === "single");
    const summary = qSteps.map(s => {
      const opt = s.options.find(o => o.id === answers[s.id]);
      return "Q" + s.step + ": " + (opt ? opt.text : "no answer");
    }).join("\n");

    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: "Quiz answers:\n" + summary + "\n\nIdentified pattern: " + meta.label + " (" + pattern + ")\n\nPlease write the personalized result sections now." }],
      }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.error) { setAiText(buildFallbackText(pattern)); setError("Showing sample content \u2014 live personalization unavailable right now."); setLoading(false); return; }
        const block = d.content && d.content.find(b => b.type === "text");
        setAiText(block ? block.text : buildFallbackText(pattern));
        setLoading(false);
      })
      .catch(err => { setAiText(buildFallbackText(pattern)); setError("Showing sample content \u2014 live personalization unavailable right now."); setLoading(false); });
  }, []);

  useEffect(() => {
    document.body.style.background = meta.bg;
    document.querySelector(".qr").style.background = meta.bg;
    return () => { document.body.style.background = "#0D0D0D"; if (document.querySelector(".qr")) document.querySelector(".qr").style.background = "#0D0D0D"; };
  }, []);

  useEffect(() => {
    if (!loading && ref.current) {
      setTimeout(() => ref.current.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }
  }, [loading]);

  function parseSection(text, heading) {
    if (!text) return "";
    const lines = text.split("\n");
    let inside = false;
    const out = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().toUpperCase() === heading.toUpperCase()) { inside = true; continue; }
      if (inside) {
        if (line.trim().length > 4 && line.trim() === line.trim().toUpperCase() && /^[A-Z]/.test(line.trim())) break;
        out.push(line);
      }
    }
    return out.join("\n").trim();
  }

  const SECTIONS = [
    { key: "THE RESULT", label: "The Result", sublabel: null, style: "highlight" },
    { key: "WHAT THIS LOOKS LIKE", label: "What This Looks Like", sublabel: null, style: "bullets" },
    { key: "WHAT YOU TELL YOURSELF", label: "What You Tell Yourself", sublabel: null, style: "quotes" },
    { key: "THE INNER EXPERIENCE", label: "The Inner Experience", sublabel: null, style: "normal" },
    { key: "IN YOUR CREATIVE LIFE", label: "In Your Creative Life", sublabel: null, style: "normal" },
    { key: "WHAT THIS PATTERN IS PROTECTING YOU FROM", label: "What This Pattern Is Protecting You From", sublabel: null, style: "normal" },
    { key: "A SMALL STEP YOU CAN TAKE TODAY", label: "A Small Step You Can Take Today", sublabel: null, style: "normal" },
    { key: "WHAT THIS DOES NOT MEAN", label: "What This Does Not Mean", sublabel: null, style: "normal" },
    { key: "A MESSAGE FOR THE HARD DAYS", label: "A Message for the Hard Days", sublabel: null, style: "italic" },
  ];

  return (
    <div className="result-page" ref={ref} style={{ background: meta.bg }}>

      <ResultTopHeader activeLevel={meta.level} onTakeQuiz={onReset} bg={meta.bg} />

      <div className="result-hero">
        <div className="result-level-num" style={{ color: meta.color }}>{"Level " + meta.level}</div>
        <div className="result-title">{meta.label}</div>
        <div className="result-subtitle-line">{meta.subtitle}</div>
        <div className="result-tagline">{meta.tagline}</div>
        <div className="result-awareness" style={{ color: meta.color }}>{meta.awareness}</div>
      </div>

      <div className="result-body">

        {error && <div style={{ color: "#C9C4BC", fontSize: "0.78rem", fontStyle: "italic", padding: "1.5rem 0 0" }}>{error}</div>}

        {loading ? (
          <div style={{ padding: "3rem 0" }}>
            <p style={{ fontSize: "0.82rem", color: "#444", marginBottom: "1.5rem" }}>Reading your answers{"\u2026"}</p>
            {[85, 65, 75, 50, 80, 55, 70, 60, 90, 45].map((w, i) => <div key={i} className="shimmer" style={{ width: w + "%" }} />)}
          </div>
        ) : (
          <>
            {SECTIONS.map(sec => {
              const content = parseSection(aiText, sec.key);
              if (!content) return null;
              const lines = content.split("\n").filter(l => l.trim());
              return (
                <div key={sec.key} className="result-section">
                  <div className="rs-label" style={{ color: meta.color }}>{sec.label}</div>
                  {sec.style === "highlight" ? (
                    <div className={"rs-body-highlight" + (sec.key === "THE RESULT" ? " rs-body-highlight-center" : "")}>
                      {lines.map((l, i) => <p key={i}>{l.replace(/^-\s*/, "")}</p>)}
                    </div>
                  ) : sec.style === "bullets" ? (
                    <div className="rs-body">
                      <ul>
                        {lines.filter(l => l.trim().startsWith("-")).map((l, i) => <li key={i} style={{ listStyleType: "disc", display: "list-item", marginBottom: "0.75rem", color: "#BBB" }}>{l.replace(/^-\s*/, "")}</li>)}
                      </ul>
                    </div>
                  ) : sec.style === "quotes" ? (
                    <div className="rs-body">
                      {lines.map((l, i) => (
                        <div key={i} className="quote-box">
                          {l.replace(/^-\s*/, "").replace(/^[""\u201c\u201d]/g, "\u201c").replace(/[""\u201c\u201d]$/g, "\u201d")}
                        </div>
                      ))}
                    </div>
                  ) : sec.style === "italic" ? (
                    <div className="rs-body-highlight">
                      {lines.map((l, i) => <p key={i}>{l.replace(/^-\s*/, "").replace(/^[""\u201c\u201d]/g, "\u201c").replace(/[""\u201c\u201d]$/g, "\u201d")}</p>)}
                    </div>
                  ) : (
                    <div className="rs-body">
                      {lines.map((l, i) => <p key={i}>{l.replace(/^-\s*/, "")}</p>)}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="result-cta">
              <div className="cta-pre" style={{ color: meta.color }}>YOUR NEXT STEP</div>
              <div className="cta-message">Your current pattern is like a location on a map. But reading the map and leaving the territory are two different things.</div>
              <div className="cta-title">The Art of Unblocking</div>
              <p className="cta-body">For the first time ever, I{"\u2019"}m teaching a small, select group of 20 students how to become creatively unblocked and move through burnout by understanding their nervous system design {"\u2014"} so they can return to their creative practice with more consistency, safety, and self-trust.</p>
              <p className="cta-body">The Art of Unblocking is currently in beta, which means founding members join at a significantly lower rate than the full $99/month price. Each time the membership opens, the price moves closer to $99. This is the lowest it will ever be {"\u2014"} and once these 20 spots are filled, it closes until the next round.</p>
              <p className="cta-body">If you{"\u2019"}re ready for a gentler, nervous-system-led path back to your creativity,</p>
              <a href="https://www.nicolelau.ca/art-of-unblocking-membership" target="_blank" rel="noopener noreferrer" className="cta-btn">JOIN THE WAITLIST {"\u2192"}</a>
            </div>

            <div className="reset-wrap">
              <button className="reset-btn" onClick={onReset}>RETAKE READING</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const LEVEL_ORDER = ["collapse", "freeze", "flight", "fawn", "fight"];

const LEVEL_DESCRIPTIONS = {
  collapse: {
    signs: [
      "Has stopped creating without fully realizing it",
      "Feels disconnected from the desire that once drove them",
      "Mistakes numbness for acceptance",
      "Cannot locate the loss because it happened so gradually",
      "Experiences a quiet absence where passion used to live",
    ],
    innerExperience: "Flatness. A life where the creative impulse has gone silent. Not dramatic pain. Just… nothing. The emptiest rooms are the ones that used to be full.",
    inCreativeLife: "No output. No attempts. The studio gathers dust. Supplies feel like artifacts from someone else’s life. The gap between the last piece and now has become so wide it feels permanent.",
  },
  freeze: {
    signs: [
      "Wants to create but cannot begin",
      "Opens the blank page and stares",
      "Feels paralyzed by the number of possible starting points",
      "The longer the gap, the heavier the return feels",
      "Overthinks every first move until no move is made",
    ],
    innerExperience: "Overwhelm that masquerades as confusion. The body is braced. The mind is spinning. Every creative impulse gets intercepted by a wall of “what if.”",
    inCreativeLife: "Sporadic attempts that stall before they start. Half-opened sketchbooks. Supplies purchased but never touched. A growing shame about the distance between intention and action.",
  },
  flight: {
    signs: [
      "Fills time with everything except creating",
      "Stays productive in every area but the one that matters",
      "Uses busyness as an unconscious escape from the vulnerability of art",
      "Feels a flicker of guilt they immediately override with another task",
      "Has convinced themselves they will get to it ‘when things slow down’",
    ],
    innerExperience: "Restlessness wearing the mask of responsibility. A constant low hum of avoidance they have learned to call being busy. The art waits. They keep moving.",
    inCreativeLife: "Always almost starting. The creative practice lives in the future tense. “Next week.” “After this project.” “When I have more time.” The time never arrives.",
  },
  fawn: {
    signs: [
      "Creates primarily for external validation or approval",
      "Adjusts their artistic voice to match what others expect",
      "Feels lost when no one is watching or requesting their work",
      "Has difficulty creating without an audience in mind",
      "Mistakes others’ approval for creative fulfillment",
    ],
    innerExperience: "A quiet betrayal of self that looks like generosity. The art serves everyone else’s taste, timeline, and opinion. The personal voice has been crowded out by applause.",
    inCreativeLife: "Produces work that gets praised but feels hollow. Commissions feel safer than personal projects. The portfolio looks impressive from the outside but foreign from the inside.",
  },
  fight: {
    signs: [
      "Holds every piece to an impossible standard",
      "Starts and restarts, unable to let anything be finished",
      "Equates imperfection with failure",
      "Creates from urgency and pressure rather than curiosity",
      "Is their own harshest critic before anyone else sees the work",
    ],
    innerExperience: "A relentless internal pressure that turns every creative act into a performance review. The joy of making has been replaced by the anxiety of measuring up.",
    inCreativeLife: "Produces work but never feels satisfied. The inner critic arrives before the paint dries. Output may be high, but fulfillment is low. Creating feels like proving, not playing.",
  },
};

function FrameworkScreen({ onBack, onTakeQuiz }) {
  const [activeLevel, setActiveLevel] = useState(0);
  const key = LEVEL_ORDER[activeLevel];
  const meta = PATTERN_META[key];
  const desc = LEVEL_DESCRIPTIONS[key];

  useEffect(() => {
    document.body.style.background = meta.bg;
    return () => { document.body.style.background = "#0D0D0D"; };
  }, [activeLevel]);

  return (
    <div className="qr" style={{ background: meta.bg, transition: "background 0.4s ease" }}>
      <div className="fw-bar" style={{ background: meta.bg }}>
        {LEVEL_ORDER.map((k, i) => (
          <div
            key={k}
            className={"fw-tab" + (i === activeLevel ? " active" : "")}
            style={i === activeLevel ? { color: PATTERN_META[k].color } : {}}
            onClick={() => setActiveLevel(i)}
          >
            <span className="fw-tab-num">Level {i + 1}</span>
            {PATTERN_META[k].label}
          </div>
        ))}
      </div>

      <div className="fw-page">
        <div className="fw-level-num" style={{ color: meta.color }}>{"Level " + meta.level}</div>
        <div className="fw-title">{meta.label}</div>
        <div className="fw-subtitle">{meta.subtitle}</div>
        <div className="fw-awareness" style={{ color: meta.color }}>{meta.awareness}</div>
        <div className="fw-tagline">{meta.tagline}</div>

        <div className="fw-section">
          <div className="fw-section-label" style={{ color: meta.color }}>What This Looks Like</div>
          <div className="fw-section-body">
            {desc.signs.map((s, i) => (
              <div key={i} style={{ paddingLeft: "1.25rem", position: "relative", marginBottom: "0.5rem" }}>
                <span style={{ position: "absolute", left: 0, color: "#333" }}>{"—"}</span>
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="fw-section">
          <div className="fw-section-label" style={{ color: meta.color }}>The Inner Experience</div>
          <div className="fw-section-body">{desc.innerExperience}</div>
        </div>

        <div className="fw-section">
          <div className="fw-section-label" style={{ color: meta.color }}>In Your Creative Life</div>
          <div className="fw-section-body">{desc.inCreativeLife}</div>
        </div>

        <div style={{ borderTop: "1px solid #1A1A1A", padding: "2rem 0", marginTop: "2rem", textAlign: "center" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1rem", color: "#C9C4BC", fontStyle: "italic", lineHeight: 1.8, marginBottom: "1.5rem" }}>
            Your current level is like a location on a map. But reading the map and leaving the territory are two different things.
          </p>
          <button className="welcome-cta" onClick={onTakeQuiz}>TAKE THE READING</button>
        </div>

        <div className="fw-nav-row">
          <div>
            {activeLevel > 0 && (
              <button className="fw-nav-btn" onClick={() => { setActiveLevel(activeLevel - 1); window.scrollTo(0, 0); }}>{"←"} PREVIOUS</button>
            )}
          </div>
          <div>
            {activeLevel < LEVEL_ORDER.length - 1 && (
              <button className="fw-nav-btn" onClick={() => { setActiveLevel(activeLevel + 1); window.scrollTo(0, 0); }}>NEXT {"→"}</button>
            )}
          </div>
        </div>

        <button className="fw-back-quiz" onClick={onBack}>{"←"} BACK</button>
      </div>
    </div>
  );
}

export default function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFramework, setShowFramework] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Jost:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const step = STEPS[stepIndex];

  function setAnswer(id, val) { setAnswers(a => ({ ...a, [id]: val })); }
  function next() { setStepIndex(i => i + 1); window.scrollTo(0, 0); }
  function back() { setStepIndex(i => Math.max(0, i - 1)); window.scrollTo(0, 0); }
  function reset() { setStepIndex(0); setAnswers({}); window.scrollTo(0, 0); }

  return (
    <>
      <style>{CSS}</style>
      {showFramework ? (
        <FrameworkScreen onBack={() => setShowFramework(false)} onTakeQuiz={() => { setShowFramework(false); setStepIndex(1); }} />
      ) : (
      <div className="qr">
        {step.type === "welcome" && <WelcomeScreen onStart={next} onExplore={() => setShowFramework(true)} />}
        {step.type === "single" && <QuestionScreen step={step} answers={answers} setAnswer={setAnswer} onNext={next} onBack={back} />}
        {step.type === "result" && <ResultScreen answers={answers} onReset={reset} />}
      </div>
      )}
    </>
  );
}
