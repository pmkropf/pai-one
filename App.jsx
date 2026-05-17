import { useState, useEffect, useRef } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }

  :root {
    /* Brand */
    --bg:       #071018;
    --card:     #0D1A24;
    --card2:    #122331;
    --border:   #1E3342;
    --border2:  rgba(255,255,255,0.12);

    /* Accents */
    --accent:   #18C7A1;
    --adim:     rgba(24,199,161,0.1);
    --aglow:    rgba(24,199,161,0.22);
    --green:    #22C55E;
    --gdim:     rgba(34,197,94,0.1);
    --blue:     #3AA8FF;
    --bdim:     rgba(58,168,255,0.1);
    --gold:     #F59E0B;
    --ydim:     rgba(245,158,11,0.1);
    --red:      #EF4444;
    --rdim:     rgba(239,68,68,0.1);
    --purple:   #A78BFA;
    --pdim:     rgba(167,139,250,0.1);

    /* Text */
    --t1: #F3F7FA;
    --t2: #9BB0BF;
    --t3: #6E8798;

    /* Type — Syne for UI labels only, Manrope for everything financial */
    --ui:   'Syne', sans-serif;
    --body: 'Manrope', sans-serif;

    /* Radius */
    --r1: 10px; --r2: 14px; --r3: 18px; --r4: 22px;

    /* Font sizes */
    --f-xs:  10px;
    --f-sm:  11px;
    --f-base:13px;
    --f-md:  14px;
    --f-lg:  16px;
    --f-xl:  20px;
    --f-2xl: 28px;
    --f-3xl: 36px;
  }

  body {
    background: #040C14;
    font-family: var(--body);
    color: var(--t1);
    display: flex;
    justify-content: center;
    min-height: 100vh;
  }

  .app {
    width: 100%;
    max-width: 390px;
    min-height: 100vh;
    background: var(--bg);
    position: relative;
    overflow: hidden;
  }

  /* ── SCREEN TRANSITIONS ─────────────────── */
  .sw { height:100vh; overflow-y:auto; padding-bottom:84px; scrollbar-width:none; }
  .sw::-webkit-scrollbar { display:none; }
  .sfwd { animation: sfwd .25s cubic-bezier(.32,.72,0,1) both; }
  .sbk  { animation: sbk  .25s cubic-bezier(.32,.72,0,1) both; }
  @keyframes sfwd { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
  @keyframes sbk  { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }

  /* ── SHARED ─────────────────────────────── */
  .hdr {
    display:flex; align-items:center; justify-content:space-between;
    padding: 52px 20px 16px;
  }
  .hdr-l { display:flex; align-items:center; gap:11px; }
  .pg-title { font-family:var(--ui); font-size:17px; font-weight:800; color:var(--t1); letter-spacing:-.3px; }
  .back {
    width:34px; height:34px; border-radius:11px;
    background:var(--card); border:1px solid var(--border);
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; font-size:15px; color:var(--t2); flex-shrink:0;
    transition:all .15s;
  }
  .back:active { background:var(--adim); border-color:var(--accent); }

  .card {
    background:var(--card); border:1px solid var(--border);
    border-radius:var(--r3); padding:16px;
    margin:0 20px 12px;
  }
  .card-glow {
    background:linear-gradient(135deg,#071A18,#091C2A);
    border:1px solid rgba(24,199,161,.18);
    border-radius:var(--r3); padding:16px;
    margin:0 20px 12px;
  }
  .sec-head {
    display:flex; justify-content:space-between; align-items:center;
    padding:4px 20px 10px;
  }
  .sec-title { font-family:var(--ui); font-size:var(--f-md); font-weight:700; color:var(--t1); }
  .sec-link  { font-size:var(--f-sm); color:var(--accent); font-weight:600; cursor:pointer; }
  .lbl {
    font-size:var(--f-xs); font-weight:700; letter-spacing:.8px;
    text-transform:uppercase; color:var(--t3);
  }

  /* Number styling — Manrope always */
  .num-hero { font-family:var(--body); font-size:var(--f-3xl); font-weight:800; letter-spacing:-1.5px; color:var(--t1); }
  .num-lg   { font-family:var(--body); font-size:var(--f-2xl); font-weight:800; letter-spacing:-1px;   color:var(--t1); }
  .num-md   { font-family:var(--body); font-size:var(--f-xl);  font-weight:800; letter-spacing:-.5px;  color:var(--t1); }
  .num-sm   { font-family:var(--body); font-size:var(--f-lg);  font-weight:700; color:var(--t1); }
  .num-xs   { font-family:var(--body); font-size:var(--f-base);font-weight:700; color:var(--t1); }

  /* Progress bar */
  .pb { height:4px; background:rgba(255,255,255,.06); border-radius:4px; overflow:hidden; margin-top:8px; }
  .pf { height:100%; border-radius:4px; transition:width 1.2s cubic-bezier(.4,0,.2,1); }

  /* Toggle */
  .tog { width:44px; height:24px; border-radius:12px; background:rgba(255,255,255,.08); position:relative; cursor:pointer; transition:background .2s; flex-shrink:0; }
  .tog.on { background:var(--accent); }
  .tk { position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:#fff; transition:transform .2s; box-shadow:0 1px 4px rgba(0,0,0,.3); }
  .tog.on .tk { transform:translateX(20px); }

  /* Pill badge */
  .pill { display:inline-flex; align-items:center; padding:3px 9px; border-radius:20px; font-size:var(--f-xs); font-weight:700; }

  /* Transaction row */
  .txn { display:flex; align-items:center; gap:11px; padding:11px 0; border-bottom:1px solid rgba(255,255,255,.04); }
  .txn:last-child { border-bottom:none; }
  .txn-ic { width:36px; height:36px; border-radius:11px; background:var(--card2); display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; }

  /* AI note */
  .ai-note { margin:0 20px 12px; padding:13px 14px; background:linear-gradient(135deg,#071A18,#081525); border-left:2px solid var(--accent); border-radius:0 var(--r2) var(--r2) 0; }
  .ai-lbl  { font-size:var(--f-xs); font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:var(--accent); margin-bottom:5px; }
  .ai-txt  { font-size:var(--f-sm); color:var(--t2); line-height:1.65; }
  .ai-txt strong { color:var(--t1); }

  /* ── BOTTOM NAV ──────────────────────────── */
  .bnav {
    position:fixed; bottom:0; left:50%; transform:translateX(-50%);
    width:100%; max-width:390px;
    background:rgba(7,16,24,.96); backdrop-filter:blur(20px);
    border-top:1px solid var(--border);
    display:flex; justify-content:space-around; align-items:center;
    padding:10px 8px 28px; z-index:50;
  }
  .ni {
    display:flex; flex-direction:column; align-items:center;
    gap:3px; cursor:pointer; padding:4px 12px; border-radius:12px;
    transition:all .15s;
  }
  .ni-i { font-size:20px; color:var(--t3); transition:color .15s; }
  .ni-l { font-size:9px; font-weight:700; color:var(--t3); letter-spacing:.5px; text-transform:uppercase; transition:color .15s; }
  .ni.active .ni-i, .ni.active .ni-l { color:var(--accent); }
  .nc {
    width:52px; height:52px; border-radius:18px;
    background:linear-gradient(135deg,var(--accent),#3AA8FF);
    display:flex; align-items:center; justify-content:center;
    font-size:22px; box-shadow:0 6px 20px rgba(24,199,161,.3);
    cursor:pointer; margin-top:-10px; transition:transform .15s;
  }
  .nc:active { transform:scale(.92); }

  /* ── FLOATING PAI° ───────────────────────── */
  .fpai {
    position:fixed; bottom:102px; right:calc(50% - 181px); z-index:60;
    width:46px; height:46px; border-radius:16px;
    background:linear-gradient(135deg,#071A18,#091C2A);
    border:1px solid rgba(24,199,161,.35);
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; box-shadow:0 4px 20px rgba(24,199,161,.2);
    transition:all .2s;
  }
  .fpai:active { transform:scale(.92); }
  .fdot {
    position:absolute; top:8px; right:8px;
    width:7px; height:7px; background:var(--accent);
    border-radius:50%; border:2px solid var(--bg);
    animation:fdot 2s ease-in-out infinite;
  }
  @keyframes fdot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.7)} }

  /* ── OVERLAY / SHEETS ───────────────────── */
  .overlay { position:fixed; inset:0; z-index:80; display:flex; align-items:flex-end; justify-content:center; }
  .bdrop   { position:absolute; inset:0; background:rgba(0,0,0,.7); backdrop-filter:blur(8px); animation:bdin .2s ease; }
  @keyframes bdin { from{opacity:0} to{opacity:1} }
  .sheet {
    width:100%; max-width:390px; background:var(--card);
    border-radius:24px 24px 0 0; position:relative; z-index:1;
    animation:sup .3s cubic-bezier(.32,.72,0,1);
    max-height:88vh; overflow-y:auto;
  }
  @keyframes sup { from{transform:translateY(100%)} to{transform:translateY(0)} }
  .sh-handle { width:36px; height:4px; background:rgba(255,255,255,.12); border-radius:4px; margin:12px auto 0; }
  .sh-hdr    { padding:16px 20px 14px; border-bottom:1px solid var(--border); }
  .sh-title  { font-family:var(--ui); font-size:17px; font-weight:800; color:var(--t1); margin-bottom:4px; }
  .sh-body   { padding:16px 20px; }
  .fi { width:100%; background:var(--card2); border:1px solid var(--border); border-radius:12px; padding:12px 14px; font-size:var(--f-md); color:var(--t1); font-family:var(--body); outline:none; margin-bottom:12px; }
  .fi:focus  { border-color:rgba(24,199,161,.4); }
  .fi::placeholder { color:var(--t3); }
  .fl { font-size:var(--f-xs); font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:var(--t3); margin-bottom:7px; }
  .pbtn { width:100%; background:var(--accent); border:none; border-radius:var(--r2); padding:14px; font-family:var(--ui); font-size:15px; font-weight:800; color:#000; cursor:pointer; transition:all .2s; }
  .pbtn:active { opacity:.85; }
  .sbtn { background:rgba(255,255,255,.05); color:var(--t2); border:1px solid var(--border); border-radius:var(--r2); padding:14px; font-family:var(--ui); font-size:14px; font-weight:700; cursor:pointer; width:100%; }

  /* ── CENTER MENU ─────────────────────────── */
  .menu-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; padding:16px 20px 32px; }
  .mi {
    display:flex; flex-direction:column; align-items:center; gap:6px;
    padding:14px 10px; background:var(--card2); border:1px solid var(--border);
    border-radius:16px; cursor:pointer; transition:all .15s;
  }
  .mi:active { background:var(--adim); border-color:var(--accent); }
  .mi-ic { width:40px; height:40px; border-radius:13px; display:flex; align-items:center; justify-content:center; font-size:19px; }
  .mi-l  { font-size:var(--f-xs); font-weight:700; color:var(--t2); text-align:center; font-family:var(--ui); }
  .mi-d  { font-size:9px; color:var(--t3); text-align:center; line-height:1.3; }

  /* ── PAI° CHAT ───────────────────────────── */
  .chat-sheet {
    width:100%; max-width:390px; height:72vh; background:var(--card);
    border-radius:24px 24px 0 0; display:flex; flex-direction:column;
    position:relative; z-index:1; animation:sup .3s cubic-bezier(.32,.72,0,1);
  }
  .chat-area { flex:1; overflow-y:auto; padding:12px 16px; display:flex; flex-direction:column; gap:10px; scrollbar-width:none; }
  .chat-area::-webkit-scrollbar { display:none; }
  .mr { display:flex; gap:8px; align-items:flex-end; animation:fu .25s ease both; }
  .mr.u { flex-direction:row-reverse; }
  .mav { width:26px; height:26px; border-radius:9px; background:linear-gradient(135deg,#071A18,#091C2A); border:1px solid rgba(24,199,161,.22); display:flex; align-items:center; justify-content:center; font-size:11px; flex-shrink:0; }
  .bub { max-width:82%; padding:10px 13px; border-radius:16px; font-size:var(--f-base); line-height:1.65; }
  .bub.ai { background:var(--card2); border:1px solid var(--border); color:var(--t2); border-bottom-left-radius:4px; }
  .bub.ai strong { color:var(--t1); }
  .bub.u  { background:linear-gradient(135deg,#003D38,#0A2A28); border:1px solid rgba(24,199,161,.18); color:var(--t1); border-bottom-right-radius:4px; }
  .tybub  { background:var(--card2); border:1px solid var(--border); border-radius:16px; border-bottom-left-radius:4px; padding:12px 16px; display:flex; gap:4px; align-items:center; }
  .td { width:5px; height:5px; border-radius:50%; background:var(--t3); }
  .td:nth-child(1){animation:tb 1.2s 0s infinite}
  .td:nth-child(2){animation:tb 1.2s .18s infinite}
  .td:nth-child(3){animation:tb 1.2s .36s infinite}
  @keyframes tb{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
  .ci-row { display:flex; gap:8px; padding:10px 14px 28px; border-top:1px solid var(--border); flex-shrink:0; }
  .ci { flex:1; background:var(--card2); border:1px solid var(--border); border-radius:13px; padding:10px 14px; font-size:var(--f-base); color:var(--t1); font-family:var(--body); outline:none; }
  .cs { width:38px; height:38px; border-radius:12px; background:var(--accent); border:none; display:flex; align-items:center; justify-content:center; font-size:16px; cursor:pointer; flex-shrink:0; }
  .qc { display:flex; gap:7px; padding:8px 14px; overflow-x:auto; scrollbar-width:none; flex-shrink:0; }
  .qc::-webkit-scrollbar { display:none; }
  .qch { background:var(--card2); border:1px solid var(--border2); border-radius:20px; padding:6px 13px; font-size:var(--f-sm); font-weight:600; color:var(--t2); cursor:pointer; white-space:nowrap; font-family:var(--body); flex-shrink:0; }

  /* ── SETTING ROW ─────────────────────────── */
  .sr { display:flex; align-items:center; gap:12px; padding:13px 16px; border-bottom:1px solid rgba(255,255,255,.04); cursor:pointer; }
  .sr:last-child { border-bottom:none; }
  .sr-ic { width:34px; height:34px; border-radius:11px; display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; }
  .sr-t  { font-size:var(--f-base); font-weight:600; color:var(--t1); }
  .sr-s  { font-size:var(--f-sm); color:var(--t3); margin-top:1px; }

  /* ── GOAL ROW ────────────────────────────── */
  .gi { margin-bottom:14px; }
  .gi:last-child { margin-bottom:0; }
  .gi-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; }
  .gi-name { font-size:var(--f-base); font-weight:700; color:var(--t1); }

  /* ── STAGGER ANIMS ───────────────────────── */
  @keyframes fu { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .f1{animation:fu .4s .05s ease both} .f2{animation:fu .4s .1s ease both}
  .f3{animation:fu .4s .15s ease both} .f4{animation:fu .4s .2s ease both}
  .f5{animation:fu .4s .25s ease both} .f6{animation:fu .4s .3s ease both}
  .f7{animation:fu .4s .35s ease both} .f8{animation:fu .4s .4s ease both}
`;

/* ═══════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════ */
const SYS = `You are PAI°, a paycheck intelligence system. Be concise (2-3 sentences), direct, helpful. Reference real numbers when relevant.
USER: Net Worth $47,284 · Income $3,450 bi-weekly · Checking $3,470 · Total Debt $38,400 (CC $4,500 @ 22.9%, Student $22,100 @ 5.8%, Auto $11,800 @ 4.2%) · Monthly Bills $1,380 · Debt Payments $690 · Goals $518 · Safe Spend $620 · Emergency Fund 72% · Down Payment 46% · Score 78/100.
Plain text only. No markdown. Use: helps, suggests, may, could, appears, consider. Never: guarantees, will execute, automatic.`;

const SCREEN_CTX = {
  home:    {label:"Home",     chips:["What should I do today?","Am I on track?","Safe spend explained","What's urgent?"]},
  actions: {label:"Actions",  chips:["What's most urgent?","How do I pay this?","After I pay, what next?","Remind me later"]},
  mflow:   {label:"Money Flow",chips:["Why is dining over?","Where did my money go?","Next paycheck forecast","Cut spending ideas"]},
  progress:{label:"Progress", chips:["Improve my score","Debt payoff faster","Savings strategy","What changed?"]},
  bills:   {label:"Bills",    chips:["Add a bill","Confirm due dates","What's coming up?","Bills I can wait on"]},
  debt:    {label:"Debt",     chips:["Best strategy?","Pay off faster","Interest breakdown","What-if extra payment"]},
  goals:   {label:"Goals",    chips:["Boost a goal","Where does money live?","Add new goal","Which goal first?"]},
  income:  {label:"Income",   chips:["Next paycheck","Add income source","3rd check month","Variable income"]},
  accounts:{label:"Accounts", chips:["Net worth explained","Fix connection","Upload document","Add account"]},
  alerts:  {label:"Notifications", chips:["What's urgent?","Clear all alerts","Notification settings","Snooze reminders"]},
  settings:{label:"Settings", chips:["Change buffer","Update schedule","Notification prefs","Subscription info"]},
};

/* ═══════════════════════════════════════
   FLOATING PAI° COPILOT
═══════════════════════════════════════ */
function FloatingPAI({ screen }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const ctx = SCREEN_CTX[screen] || SCREEN_CTX.home;

  useEffect(() => {
    if (open && msgs.length === 0)
      setMsgs([{ role:"ai", id:1, text:"Hey — I know your full picture. What do you want to know?" }]);
  }, [open, screen]);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [msgs, loading]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const um = { role:"user", id:Date.now(), text:text.trim() };
    setMsgs(m => [...m, um]);
    setInp(""); setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY || "",
          "anthropic-version":"2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system: SYS + "\nCurrent screen: " + ctx.label,
          messages:[...msgs, um].map(m => ({ role:m.role==="ai"?"assistant":"user", content:m.text }))
        })
      });
      const d = await res.json();
      const reply = d.content?.find(b => b.type==="text")?.text || "Try again.";
      setMsgs(m => [...m, { role:"ai", id:Date.now()+1, text:reply }]);
    } catch {
      setMsgs(m => [...m, { role:"ai", id:Date.now()+1, text:"Connection issue — try again." }]);
    } finally { setLoading(false); }
  };

  const close = () => { setOpen(false); setMsgs([]); };

  return (
    <>
      <div className="fpai" onClick={() => { setOpen(true); setMsgs([]); }}>
        <span style={{fontSize:19,color:"var(--accent)"}}>✦</span>
        <div className="fdot"/>
      </div>

      {open && (
        <div className="overlay">
          <div className="bdrop" onClick={close}/>
          <div className="chat-sheet">
            <div className="sh-handle"/>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 18px",borderBottom:"1px solid var(--border)",flexShrink:0}}>
              <div style={{width:32,height:32,borderRadius:11,background:"linear-gradient(135deg,#071A18,#091C2A)",border:"1px solid rgba(24,199,161,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>✦</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"var(--ui)",fontSize:14,fontWeight:700,color:"var(--t1)"}}>PAI° Copilot</div>
                <div style={{fontSize:"var(--f-xs)",color:"var(--accent)",fontWeight:600}}>● {ctx.label}</div>
              </div>
              <div onClick={close} style={{width:28,height:28,background:"rgba(255,255,255,.06)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"var(--t2)",fontSize:13}}>✕</div>
            </div>
            <div className="chat-area" ref={ref}>
              {msgs.map(m => (
                <div key={m.id} className={"mr "+(m.role==="user"?"u":"")}>
                  {m.role==="ai" && <div className="mav">✦</div>}
                  <div className={"bub "+(m.role==="ai"?"ai":"u")}>{m.text}</div>
                </div>
              ))}
              {loading && (
                <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                  <div className="mav">✦</div>
                  <div className="tybub"><div className="td"/><div className="td"/><div className="td"/></div>
                </div>
              )}
            </div>
            <div className="qc">
              {ctx.chips.map((c,i) => <button key={i} className="qch" onClick={() => send(c)}>{c}</button>)}
            </div>
            <div className="ci-row">
              <input className="ci" placeholder="Ask PAI° anything..." value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key==="Enter" && send(inp)} disabled={loading}/>
              <button className="cs" onClick={() => send(inp)} disabled={loading||!inp.trim()}>→</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════
   HOME — THE HUB
═══════════════════════════════════════ */
function Home({ nav, loaded }) {
  const [showSS, setShowSS] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [recDismissed, setRecDismissed] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const buckets = [
    {k:"bills", icon:"🏠", label:"Bills",      color:"var(--accent)", pct:40, amt:"$1,380",
     items:[{n:"Rent",a:"$1,200",note:"Due June 1"},{n:"Electric",a:"$94",note:"Due May 18"},{n:"Internet",a:"$86",note:"Due May 20"}]},
    {k:"debt",  icon:"📉", label:"Debt",        color:"var(--blue)",   pct:20, amt:"$690",
     items:[{n:"Credit Card Min",a:"$135",note:"Due May 25 · urgent"},{n:"Student Loan",a:"$400",note:"Due May 28"},{n:"Auto",a:"$155",note:"Due June 5"}]},
    {k:"goals", icon:"🎯", label:"Goals",       color:"var(--gold)",   pct:15, amt:"$518",
     items:[{n:"Down Payment",a:"$250",note:"On track"},{n:"Emergency Fund",a:"$168",note:"72% funded"},{n:"Europe Trip",a:"$100",note:"63% funded"}]},
    {k:"spend", icon:"💚", label:"Safe Spend",  color:"var(--green)",  pct:18, amt:"$620",
     items:[{n:"Groceries",a:"~$300",note:"Estimated"},{n:"Gas",a:"~$80",note:"Estimated"},{n:"Personal",a:"~$240",note:"Remaining"}]},
    {k:"buf",   icon:"🔒", label:"Buffer",      color:"var(--t3)",     pct:7,  amt:"$242",
     items:[{n:"Protected reserve",a:"$242",note:"Not for spending"}]},
  ];

  const scoreInputs = [
    {label:"Cash-Flow Stability", score:82, c:"var(--green)", note:"Income covers bills consistently"},
    {label:"Debt Pressure",       score:64, c:"var(--gold)",  note:"Credit card APR is high — worth prioritizing"},
    {label:"Savings Progress",    score:78, c:"var(--accent)",note:"3 active goals, all on track"},
    {label:"Bill Coverage",       score:91, c:"var(--green)", note:"All bills covered this cycle"},
    {label:"Spending Alignment",  score:71, c:"var(--gold)",  note:"Dining slightly over this period"},
    {label:"Timing Risk",         score:80, c:"var(--green)", note:"No overdraft risk detected"},
    {label:"Subscription Drag",   score:68, c:"var(--gold)",  note:"$155/mo in subscriptions"},
    {label:"Interest Leakage",    score:58, c:"var(--red)",   note:"~$87/mo in credit card interest"},
    {label:"Emergency Fund",      score:72, c:"var(--accent)",note:"72% funded — 6 months away"},
  ];

  return (
    <div>
      {/* HEADER */}
      <div className="hdr f1">
        <div style={{fontFamily:"var(--ui)",fontSize:18,fontWeight:800,color:"var(--t1)"}}>
          PAI<span style={{color:"var(--accent)"}}>°</span>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div onClick={() => nav("alerts")} style={{width:34,height:34,background:"var(--card)",border:"1px solid var(--border)",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}}>
            <span style={{fontSize:16,color:"var(--t2)"}}>🔔</span>
            <div style={{position:"absolute",top:7,right:7,width:7,height:7,background:"var(--accent)",borderRadius:"50%",border:"2px solid var(--bg)"}}/>
          </div>
          <div onClick={() => nav("settings")} style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#18C7A1,#3AA8FF)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--ui)",fontSize:11,fontWeight:800,color:"#fff",cursor:"pointer"}}>PK</div>
        </div>
      </div>

      {/* GREETING */}
      <div style={{padding:"0 20px 16px"}} className="f2">
        <div style={{fontSize:"var(--f-xs)",color:"var(--t3)",fontWeight:600,letterSpacing:".8px",textTransform:"uppercase",marginBottom:3}}>Thursday, May 8</div>
        <div style={{fontFamily:"var(--ui)",fontSize:20,fontWeight:700,color:"var(--t1)"}}>Heads up, Pascal — credit card due in 3 days 👀</div>
      </div>

      {/* ── SECTION 1: RIGHT NOW ── */}
      <div className="card-glow f3">
        {/* Balance breakdown */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <div className="lbl" style={{marginBottom:6}}>Right Now · Chase ••3847</div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              {[["Balance","$3,470","var(--t1)"],["Spoken for","-$1,380","var(--red)"],["Available","$2,090","var(--t1)"]].map(([l,v,c]) => (
                <div key={l} style={{display:"flex",justifyContent:"space-between",gap:40,alignItems:"center"}}>
                  <span style={{fontSize:"var(--f-sm)",color:"var(--t3)",fontWeight:500}}>{l}</span>
                  <span style={{fontFamily:"var(--body)",fontSize:"var(--f-sm)",fontWeight:700,color:c}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Safe Spend — HERO — more dominant */}
          <div style={{background:"rgba(0,0,0,.3)",borderRadius:14,padding:"14px 16px",textAlign:"right",minWidth:130,border:"1px solid rgba(34,197,94,.15)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:6,marginBottom:5}}>
              <div className="lbl" style={{color:"var(--green)"}}>Safe Spend</div>
              <div onClick={() => setShowSS(!showSS)} style={{width:16,height:16,borderRadius:"50%",background:"rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"var(--t3)",cursor:"pointer",fontWeight:700}}>?</div>
            </div>
            <div style={{fontFamily:"var(--body)",fontSize:36,fontWeight:800,color:"var(--green)",letterSpacing:"-2px",lineHeight:1}}>$620</div>
            <div style={{fontSize:9,color:"var(--t3)",marginTop:4,lineHeight:1.4}}>After bills, debt<br/>& savings</div>
          </div>
        </div>

        {showSS && (
          <div style={{padding:"10px 12px",background:"rgba(0,0,0,.3)",borderRadius:10,marginBottom:10,fontSize:"var(--f-xs)",color:"var(--t2)",lineHeight:1.65}}>
            This is not your bank balance. PAI° estimates what may be safe to spend after upcoming bills ($1,380), debt payments ($690), savings ($518), and your $500 buffer are accounted for.
          </div>
        )}

        {/* Allocation bar */}
        <div style={{fontSize:"var(--f-xs)",color:"var(--t3)",fontWeight:600,marginBottom:6}}>Here's where your May 8 paycheck is going</div>
        <div style={{height:8,background:"rgba(255,255,255,.05)",borderRadius:8,overflow:"hidden",display:"flex",gap:2,marginBottom:6}}>
          {buckets.map(b => (
            <div key={b.k} style={{width:loaded?b.pct+"%":"0%",height:"100%",background:b.color,transition:"width 1s cubic-bezier(.4,0,.2,1)"}}/>
          ))}
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {buckets.map(b => (
            <div key={b.k} style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:b.color}}/>
              <span style={{fontSize:9,color:"var(--t2)",fontWeight:600}}>{b.label} {b.pct}%</span>
            </div>
          ))}
        </div>
        <div style={{fontSize:"var(--f-xs)",color:"var(--t3)",marginTop:6}}>Paycheck plan · May 8 · Tap below to see full breakdown</div>
      </div>

      {/* ── SECTION 2: SUGGESTED MOVE ── moved above What's Coming */}
      {!recDismissed && (
        <div style={{margin:"0 20px 12px",background:"linear-gradient(135deg,#092C28,#0A1E30)",border:"1px solid rgba(24,199,161,.22)",borderRadius:"var(--r4)",padding:16}} className="f4">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div style={{fontSize:"var(--f-xs)",fontWeight:700,letterSpacing:".8px",textTransform:"uppercase",color:"var(--accent)"}}>⚡ Suggested Move</div>
            <div onClick={() => setRecDismissed(true)} style={{fontSize:12,color:"var(--t3)",cursor:"pointer",padding:"0 4px"}}>✕</div>
          </div>
          <p style={{fontSize:"var(--f-base)",color:"var(--t2)",lineHeight:1.65,marginBottom:12}}>Your dining spend is <strong style={{color:"var(--t1)"}}>$87 over budget</strong> this cycle. Consider directing <strong style={{color:"var(--t1)"}}>$200 from dining</strong> toward your Credit Card instead. At 22.9% APR, this may help reduce interest faster than any other move this paycheck.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <button onClick={() => setRecDismissed(true)} style={{background:"var(--accent)",border:"none",borderRadius:10,padding:"10px",fontSize:"var(--f-sm)",fontWeight:700,color:"#000",cursor:"pointer",fontFamily:"var(--body)"}}>Got It — Noted</button>
            <button onClick={() => setRecDismissed(true)} style={{background:"rgba(255,255,255,.05)",border:"1px solid var(--border)",borderRadius:10,padding:"10px",fontSize:"var(--f-sm)",fontWeight:600,color:"var(--t2)",cursor:"pointer",fontFamily:"var(--body)"}}>Not Now</button>
          </div>
        </div>
      )}

      {/* ── SECTION 3: WHAT'S COMING ── */}
      <div className="sec-head f4">
        <div className="sec-title">What's Coming</div>
        <div className="sec-link" onClick={() => nav("actions")}>See all →</div>
      </div>

      {/* Next paycheck */}
      <div style={{margin:"0 20px 10px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:"var(--r3)",padding:"13px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} className="f4" onClick={() => nav("mflow")}>
        <div style={{width:38,height:38,borderRadius:12,background:"var(--gdim)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>💰</div>
        <div style={{flex:1}}>
          <div style={{fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)",marginBottom:2}}>Next Paycheck</div>
          <div style={{fontSize:"var(--f-sm)",color:"var(--t3)"}}>Thursday, May 22 · Silverhawk Inc.</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"var(--body)",fontSize:"var(--f-lg)",fontWeight:800,color:"var(--t1)"}}>$3,450</div>
          <div style={{fontSize:"var(--f-xs)",color:"var(--accent)",fontWeight:600,marginTop:2}}>14 days</div>
        </div>
      </div>

      {/* Bills due */}
      <div className="card f4" style={{padding:"8px 16px"}}>
        {[
          {icon:"💳",name:"Credit Card Min",due:"Due May 25",amt:"$135",urgency:"var(--red)",label:"3 days"},
          {icon:"🎓",name:"Student Loan",   due:"Due May 28",amt:"$400",urgency:"var(--gold)",label:"6 days"},
          {icon:"⚡",name:"Utilities",      due:"Due May 18",amt:"$180",urgency:"var(--green)",label:"✓ Covered"},
        ].map(b => (
          <div key={b.name} className="txn" style={{cursor:"pointer"}} onClick={() => nav("actions")}>
            <div className="txn-ic">{b.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:"var(--f-base)",fontWeight:600,color:"var(--t1)"}}>{b.name}</div>
              <div style={{fontSize:"var(--f-xs)",color:"var(--t3)",marginTop:1}}>{b.due}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"var(--body)",fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)"}}>{b.amt}</div>
              <div style={{fontSize:"var(--f-xs)",fontWeight:700,color:b.urgency,marginTop:2}}>{b.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── SECTION 4: WHERE YOU'RE HEADED ── moved up */}
      <div className="sec-head f5">
        <div className="sec-title">Where You're Headed</div>
        <div className="sec-link" onClick={() => nav("progress")}>Full view →</div>
      </div>

      <div className="card f5">
        {/* Score */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,paddingBottom:14,borderBottom:"1px solid var(--border)",cursor:"pointer"}} onClick={() => setShowScore(true)}>
          <div>
            <div style={{fontSize:"var(--f-sm)",color:"var(--t3)",marginBottom:3}}>Financial Energy Score</div>
            <div style={{fontFamily:"var(--body)",fontSize:28,fontWeight:800,color:"var(--gold)",letterSpacing:"-1px"}}>78<span style={{fontSize:14,color:"var(--t3)",fontWeight:400}}>/100</span></div>
            <div style={{display:"flex",gap:7,marginTop:4}}>
              <span style={{fontSize:"var(--f-sm)",color:"var(--gold)",fontWeight:600}}>▲ Strong</span>
              <span style={{fontSize:"var(--f-xs)",color:"var(--accent)",fontWeight:600,background:"var(--adim)",padding:"2px 7px",borderRadius:6}}>Tap for breakdown</span>
            </div>
            <div style={{fontSize:"var(--f-xs)",color:"var(--t3)",marginTop:6,lineHeight:1.5}}>You're in the top 40% of users at your income and debt level.</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {[["Bills","Covered","var(--green)"],["Debt","Improving","var(--blue)"],["Savings","On Track","var(--accent)"],["Spending","Watch","var(--gold)"]].map(([l,s,c]) => (
              <div key={l} style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:c}}/>
                <span style={{fontSize:9,color:"var(--t2)",width:46}}>{l}</span>
                <span style={{fontSize:9,fontWeight:700,color:c}}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Goals */}
        {[["🏠","Down Payment",46,"#18C7A1"],["🏖️","Emergency Fund",72,"#22C55E"],["✈️","Europe Trip",63,"#F59E0B"]].map(([em,n,p,c]) => (
          <div key={n} className="gi">
            <div className="gi-top">
              <span style={{display:"flex",alignItems:"center",gap:6}}><span>{em}</span><span className="gi-name">{n}</span></span>
              <span style={{fontFamily:"var(--body)",fontSize:"var(--f-base)",fontWeight:700,color:c}}>{p}%</span>
            </div>
            <div className="pb"><div className="pf" style={{width:loaded?p+"%":"0%",background:c}}/></div>
          </div>
        ))}
      </div>

      {/* ── SECTION 5: YOUR PLAN ── moved to bottom */}
      <div className="sec-head f6">
        <div className="sec-title">Your Paycheck Plan · May 8</div>
        <span style={{fontSize:"var(--f-xs)",color:"var(--t3)"}}>Tap to expand</span>
      </div>

      {buckets.map((b,i) => (
        <div key={b.k} className={"card f"+(i+6)} style={{cursor:"pointer",borderColor:expanded===b.k?"var(--border2)":"var(--border)"}} onClick={() => setExpanded(expanded===b.k?null:b.k)}>
          <div style={{display:"flex",alignItems:"center",gap:11}}>
            <div style={{width:38,height:38,borderRadius:12,background:b.color+"1A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{b.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)",marginBottom:1}}>{b.label}</div>
              <div style={{fontSize:"var(--f-xs)",color:"var(--t3)"}}>{b.items.length} item{b.items.length>1?"s":""} · {b.pct}%</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"var(--body)",fontSize:"var(--f-lg)",fontWeight:800,color:"var(--t1)"}}>{b.amt}</div>
              <div style={{fontSize:"var(--f-xs)",color:b.color,fontWeight:600,marginTop:2}}>{expanded===b.k?"▲":"▼"}</div>
            </div>
          </div>
          {expanded===b.k && (
            <div style={{marginTop:11,borderTop:"1px solid var(--border)",paddingTop:11}}>
              {b.items.map(it => (
                <div key={it.n} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                  <div>
                    <div style={{fontSize:"var(--f-sm)",fontWeight:600,color:"var(--t1)"}}>{it.n}</div>
                    <div style={{fontSize:"var(--f-xs)",color:"var(--t3)",marginTop:1}}>{it.note}</div>
                  </div>
                  <div style={{fontFamily:"var(--body)",fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)"}}>{it.a}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="ai-note f8">
        <div className="ai-lbl">PAI° Insight</div>
        <p className="ai-txt">Credit card minimum is due in <strong>3 days</strong> — your most urgent action. After that, your next paycheck covers everything else before May 22.</p>
      </div>

      {/* Score Sheet */}
      {showScore && (
        <div className="overlay">
          <div className="bdrop" onClick={() => setShowScore(false)}/>
          <div className="sheet">
            <div className="sh-handle"/>
            <div className="sh-hdr">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div className="sh-title">Financial Energy Score</div>
                  <div style={{fontSize:"var(--f-sm)",color:"var(--t3)",marginTop:3}}>How efficiently your income builds progress</div>
                </div>
                <div style={{fontFamily:"var(--body)",fontSize:34,fontWeight:800,color:"var(--gold)",letterSpacing:"-1.5px"}}>78</div>
              </div>
            </div>
            <div style={{padding:"16px 20px"}}>
              {scoreInputs.map((s,i) => (
                <div key={i} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                    <div style={{flex:1,paddingRight:12}}>
                      <div style={{fontSize:"var(--f-base)",fontWeight:600,color:"var(--t1)"}}>{s.label}</div>
                      <div style={{fontSize:"var(--f-xs)",color:"var(--t3)",marginTop:1,lineHeight:1.4}}>{s.note}</div>
                    </div>
                    <div style={{fontFamily:"var(--body)",fontSize:15,fontWeight:800,color:s.c,flexShrink:0}}>{s.score}</div>
                  </div>
                  <div className="pb" style={{marginTop:0}}><div className="pf" style={{width:s.score+"%",background:s.c}}/></div>
                </div>
              ))}
              <div style={{padding:"11px 13px",background:"rgba(255,255,255,.03)",border:"1px solid var(--border)",borderRadius:12,fontSize:"var(--f-xs)",color:"var(--t3)",lineHeight:1.65,marginBottom:14}}>
                Interest leakage and subscription drag are your two biggest opportunities. Addressing your credit card rate first may have the most impact.
              </div>
              <button onClick={() => setShowScore(false)} className="pbtn">Got It</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   ACTIONS
═══════════════════════════════════════ */
function Actions({ nav }) {
  const [statuses, setStatuses] = useState({1:"pending",2:"pending",3:"verified"});

  const items = [
    {id:1, icon:"💳", name:"Credit Card Minimum", lender:"Chase Sapphire", due:"Due May 25", days:"3 days", amt:"$135",
     how:"Chase.com → Payments → Pay minimum balance",
     note:"Most urgent payment this cycle. Missed minimums trigger fees and can affect your credit."},
    {id:2, icon:"🎓", name:"Student Loan",        lender:"Navient",        due:"Due May 28", days:"6 days", amt:"$400",
     how:"Navient.com → Make a Payment → Standard payment",
     note:"Funds are allocated from your current paycheck. Pay through Navient directly."},
    {id:3, icon:"⚡", name:"Utilities",            lender:"APS Electric",   due:"Due May 18", days:"Paid",   amt:"$94",
     how:"",
     note:"Plaid detected this payment in your Chase account on May 8."},
  ];

  const pending  = Object.values(statuses).filter(s => s==="pending").length;
  const watching = Object.values(statuses).filter(s => s==="watching").length;
  const verified = Object.values(statuses).filter(s => s==="verified").length;

  return (
    <div>
      <div className="hdr f1">
        <div className="hdr-l">
          <div className="back" onClick={() => nav("home")}>←</div>
          <div className="pg-title">Actions</div>
        </div>
        {pending>0 && <span style={{fontSize:"var(--f-xs)",fontWeight:700,color:"var(--red)",background:"var(--rdim)",border:"1px solid rgba(239,68,68,.2)",borderRadius:20,padding:"5px 12px"}}>{pending} Urgent</span>}
      </div>

      {/* How this works */}
      <div className="card f2">
        <div className="lbl" style={{marginBottom:10}}>How This Works</div>
        <div style={{display:"flex",gap:0}}>
          {[["1","PAI° suggests","var(--accent)"],["2","You pay it","var(--gold)"],["3","Confirm","var(--blue)"],["4","Plaid verifies","var(--green)"]].map(([n,l,c],i,arr) => (
            <div key={n} style={{flex:1,textAlign:"center",padding:"0 3px",borderRight:i<arr.length-1?"1px solid var(--border)":"none"}}>
              <div style={{fontFamily:"var(--body)",fontSize:16,fontWeight:800,color:c,marginBottom:3}}>{n}</div>
              <div style={{fontSize:9,color:"var(--t2)",fontWeight:600,lineHeight:1.4}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"flex",gap:10,padding:"0 20px 14px",overflow:"auto",scrollbarWidth:"none"}} className="f3">
        {[[String(pending),"Urgent","var(--red)"],[String(watching),"Watching","var(--accent)"],[String(verified),"Verified","var(--green)"]].map(([v,l,c]) => (
          <div key={l} style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"var(--r2)",padding:"11px 14px",flexShrink:0,minWidth:90}}>
            <div className="lbl" style={{marginBottom:4}}>{l}</div>
            <div style={{fontFamily:"var(--body)",fontSize:"var(--f-xl)",fontWeight:800,color:c}}>{v}</div>
          </div>
        ))}
      </div>

      {items.map((item,i) => {
        const st = statuses[item.id];
        return (
          <div key={item.id} className={"card f"+(i+4)} style={{borderColor:st==="verified"?"rgba(34,197,94,.3)":st==="watching"?"rgba(24,199,161,.25)":item.id===1?"rgba(239,68,68,.25)":"var(--border)"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{width:42,height:42,borderRadius:13,background:st==="verified"?"var(--gdim)":"rgba(255,255,255,.04)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{item.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)",marginBottom:1}}>{item.name}</div>
                <div style={{fontSize:"var(--f-xs)",color:"var(--t3)",marginBottom:6}}>{item.lender} · {item.due}</div>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <span style={{fontFamily:"var(--body)",fontSize:15,fontWeight:800,color:"var(--t1)"}}>{item.amt}</span>
                  <span className="pill" style={{background:st==="verified"?"var(--gdim)":st==="watching"?"var(--adim)":item.id===1?"var(--rdim)":"var(--ydim)",color:st==="verified"?"var(--green)":st==="watching"?"var(--accent)":item.id===1?"var(--red)":"var(--gold)"}}>
                    {st==="verified"?"✓ Verified":st==="watching"?"Plaid watching...":item.days}
                  </span>
                </div>
              </div>
            </div>

            {item.note && (
              <div style={{marginTop:10,padding:"9px 11px",background:"rgba(255,255,255,.03)",borderRadius:10,fontSize:"var(--f-xs)",color:"var(--t3)",lineHeight:1.6}}>{item.note}</div>
            )}

            {st==="pending" && item.how && (
              <div style={{marginTop:8,padding:"9px 11px",background:"var(--card2)",border:"1px solid var(--border)",borderRadius:10}}>
                <div style={{fontSize:"var(--f-xs)",fontWeight:700,color:"var(--t3)",marginBottom:3}}>Where to pay:</div>
                <div style={{fontSize:"var(--f-xs)",color:"var(--t2)",lineHeight:1.6}}>{item.how}</div>
              </div>
            )}

            {st==="pending" && (
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:8,marginTop:12}}>
                <button onClick={() => setStatuses(s => ({...s,[item.id]:"watching"}))} style={{background:"var(--accent)",border:"none",borderRadius:11,padding:"11px",fontSize:"var(--f-sm)",fontWeight:700,color:"#000",cursor:"pointer",fontFamily:"var(--body)"}}>✓ I've Paid This</button>
                <button style={{background:"rgba(255,255,255,.04)",border:"1px solid var(--border)",borderRadius:11,padding:"11px",fontSize:"var(--f-sm)",fontWeight:600,color:"var(--t2)",cursor:"pointer",fontFamily:"var(--body)"}}>Later</button>
              </div>
            )}

            {st==="watching" && (
              <div style={{marginTop:10,padding:"10px 12px",background:"var(--adim)",border:"1px solid rgba(24,199,161,.2)",borderRadius:11}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:"var(--accent)",animation:"fdot 1.2s ease-in-out infinite",flexShrink:0}}/>
                  <span style={{fontSize:"var(--f-sm)",fontWeight:700,color:"var(--accent)"}}>Plaid is watching</span>
                </div>
                <p style={{fontSize:"var(--f-xs)",color:"var(--t3)",lineHeight:1.6}}>Once Plaid detects this payment in your account, PAI° will mark it verified and update your calendar. This usually happens within a few hours — sometimes sooner.</p>
              </div>
            )}

            {st==="verified" && (
              <div style={{marginTop:10,padding:"10px 12px",background:"var(--gdim)",border:"1px solid rgba(34,197,94,.2)",borderRadius:11,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:16}}>✓</span>
                <div>
                  <div style={{fontSize:"var(--f-sm)",fontWeight:700,color:"var(--green)"}}>Confirmed by Plaid</div>
                  <div style={{fontSize:"var(--f-xs)",color:"var(--t3)",marginTop:2}}>Detected in Chase account. Calendar updated.</div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div style={{margin:"8px 20px 20px",padding:"12px 14px",background:"#040C14",border:"1px solid var(--border)",borderRadius:"var(--r2)"}}>
        <div className="lbl" style={{marginBottom:6}}>🛡️ Important</div>
        <p style={{fontSize:"var(--f-xs)",color:"var(--t3)",lineHeight:1.7}}>PAI° does not process or initiate payments. All payments are made by you, directly through your lender. Plaid read-only access allows PAI° to detect when a payment has occurred.</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MONEY FLOW — Income + Spending merged
═══════════════════════════════════════ */
function MoneyFlow({ nav, loaded }) {
  const [view,     setView]     = useState("spending");
  const [expanded, setExpanded] = useState(null);

  const cats = [
    {icon:"🏠",name:"Housing",      spent:1200,budget:1200,pct:100,color:"var(--accent)",
     txns:[{n:"Rent",d:"May 1",a:-1200}]},
    {icon:"🍔",name:"Food & Dining",spent:487, budget:400, pct:122,color:"var(--red)",over:true,
     txns:[{n:"Whole Foods",d:"May 7",a:-87},{n:"Chipotle",d:"May 6",a:-14},{n:"Uber Eats",d:"May 5",a:-38},{n:"Trader Joe's",d:"May 3",a:-112},{n:"Starbucks",d:"May 2",a:-9},{n:"Restaurant",d:"Apr 30",a:-227}]},
    {icon:"🚗",name:"Transport",     spent:320, budget:350, pct:91, color:"var(--blue)",
     txns:[{n:"Auto Loan",d:"May 5",a:-290},{n:"Shell Gas",d:"May 4",a:-30}]},
    {icon:"📱",name:"Subscriptions", spent:155, budget:200, pct:78, color:"var(--purple)",
     txns:[{n:"Netflix",d:"May 1",a:-18},{n:"Spotify",d:"May 1",a:-11},{n:"Planet Fitness",d:"May 1",a:-45},{n:"iCloud+",d:"May 1",a:-3},{n:"Others",d:"May 1",a:-78}]},
    {icon:"⚡",name:"Utilities",     spent:180, budget:200, pct:90, color:"var(--gold)",
     txns:[{n:"APS Electric",d:"May 8",a:-94},{n:"Cox Internet",d:"May 7",a:-86}]},
    {icon:"🛍️",name:"Personal",      spent:105, budget:300, pct:35, color:"var(--green)",
     txns:[{n:"Target",d:"May 6",a:-48},{n:"CVS",d:"May 4",a:-22},{n:"Amazon",d:"May 2",a:-35}]},
  ];

  return (
    <div>
      <div className="hdr f1">
        <div className="hdr-l">
          <div className="back" onClick={() => nav("home")}>←</div>
          <div className="pg-title">Money Flow</div>
        </div>
        <span className="pill" style={{background:"var(--gdim)",color:"var(--green)",border:"1px solid rgba(34,197,94,.2)"}}>STABLE</span>
      </div>

      {/* Cycle summary */}
      <div className="card-glow f2">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <div className="lbl" style={{marginBottom:6}}>This Cycle · May 1–19</div>
            <div style={{fontFamily:"var(--body)",fontSize:32,fontWeight:800,color:"var(--green)",letterSpacing:"-1.5px"}}>$1,240</div>
            <div style={{fontSize:"var(--f-sm)",color:"var(--t2)",marginTop:3}}>Surplus · $4,200 in · $2,960 out</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div className="lbl" style={{marginBottom:4}}>Remaining</div>
            <div style={{fontFamily:"var(--body)",fontSize:"var(--f-xl)",fontWeight:800,color:"var(--t1)"}}>$620</div>
          </div>
        </div>
        <div style={{height:6,background:"rgba(255,255,255,.06)",borderRadius:6,overflow:"hidden"}}>
          <div style={{width:loaded?"70%":"0%",height:"100%",background:"linear-gradient(90deg,var(--red),#FF8C6A)",borderRadius:6,transition:"width 1s ease"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:"var(--f-xs)",color:"var(--t3)",fontWeight:600,marginTop:5}}>
          <span>Spent: 70%</span><span>Remaining: 30%</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:0,margin:"0 20px 14px",background:"var(--card)",borderRadius:13,padding:3}} className="f3">
        {[["income","Income"],["spending","Spending"],["forecast","Next Paycheck"]].map(([k,l]) => (
          <div key={k} style={{flex:1,padding:"8px",textAlign:"center",borderRadius:11,fontSize:"var(--f-sm)",fontWeight:700,cursor:"pointer",color:view===k?"#000":"var(--t3)",background:view===k?"var(--accent)":"transparent",transition:"all .2s",fontFamily:"var(--body)"}} onClick={() => { setView(k); setExpanded(null); }}>{l}</div>
        ))}
      </div>

      {/* INCOME */}
      {view==="income" && (
        <>
          <div className="card f4">
            <div style={{fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)",marginBottom:12}}>This Cycle · $4,200 total</div>
            {[["💰","Direct Deposit","Silverhawk Inc.","$3,450","var(--gdim)","var(--green)"],["💻","Freelance","Client Project","$750","var(--bdim)","var(--blue)"]].map(([ic,n,s,a,bg,c]) => (
              <div key={n} className="txn">
                <div className="txn-ic" style={{background:bg}}>{ic}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)"}}>{n}</div>
                  <div style={{fontSize:"var(--f-xs)",color:"var(--t3)"}}>{s}</div>
                </div>
                <div style={{fontFamily:"var(--body)",fontSize:"var(--f-lg)",fontWeight:800,color:c}}>{a}</div>
              </div>
            ))}
          </div>
          <div className="card f5">
            <div style={{fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)",marginBottom:12}}>Income Sources</div>
            {[["Silverhawk Inc.","Bi-weekly · $3,450/check","Plaid detected","var(--accent)"],["Freelance Work","Variable · ~$750/cycle","Manual entry","var(--gold)"]].map(([n,d,s,c]) => (
              <div key={n} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                <div>
                  <div style={{fontSize:"var(--f-base)",fontWeight:600,color:"var(--t1)",marginBottom:2}}>{n}</div>
                  <div style={{fontSize:"var(--f-xs)",color:"var(--t3)"}}>{d}</div>
                </div>
                <span className="pill" style={{background:c+"1A",color:c,alignSelf:"center"}}>{s}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* SPENDING */}
      {view==="spending" && cats.map((c,i) => (
        <div key={c.name} className={"card f"+(i+4)} style={{padding:0,marginBottom:8,overflow:"hidden",borderColor:c.over?"rgba(239,68,68,.25)":"var(--border)"}}>
          <div style={{padding:"12px 16px",cursor:"pointer"}} onClick={() => setExpanded(expanded===c.name?null:c.name)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span>{c.icon}</span>
                <span style={{fontSize:"var(--f-base)",fontWeight:600,color:"var(--t1)"}}>{c.name}</span>
                <span style={{fontSize:"var(--f-xs)",color:"var(--t3)"}}>{c.txns.length} transactions</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{textAlign:"right"}}>
                  <span style={{fontFamily:"var(--body)",fontSize:"var(--f-base)",fontWeight:800,color:c.over?"var(--red)":"var(--t1)"}}>${c.spent}</span>
                  <span style={{fontSize:"var(--f-sm)",color:"var(--t3)"}}> / ${c.budget}</span>
                  {c.over && <span className="pill" style={{background:"var(--ydim)",color:"var(--gold)",marginLeft:6}}>Watch</span>}
                </div>
                <span style={{fontSize:11,color:"var(--t3)",transition:"transform .2s",transform:expanded===c.name?"rotate(180deg)":"none"}}>▼</span>
              </div>
            </div>
            <div className="pb" style={{marginTop:0}}>
              <div className="pf" style={{width:loaded?Math.min(c.pct,100)+"%":"0%",background:c.over?"var(--gold)":c.color}}/>
            </div>
          </div>
          {expanded===c.name && (
            <div style={{borderTop:"1px solid var(--border)",background:"rgba(255,255,255,.01)"}}>
              {c.txns.map((t,j) => (
                <div key={j} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 16px",borderBottom:j<c.txns.length-1?"1px solid rgba(255,255,255,.04)":"none"}}>
                  <div>
                    <div style={{fontSize:"var(--f-sm)",fontWeight:600,color:"var(--t1)"}}>{t.n}</div>
                    <div style={{fontSize:"var(--f-xs)",color:"var(--t3)",marginTop:1}}>{t.d}</div>
                  </div>
                  <div style={{fontFamily:"var(--body)",fontSize:"var(--f-base)",fontWeight:700,color:"var(--t2)"}}>-${Math.abs(t.a)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* FORECAST */}
      {view==="forecast" && (
        <div className="card f4">
          <div style={{fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)",marginBottom:14}}>Next Paycheck · May 22 · $3,450</div>
          {[["Fixed Bills","$1,380","var(--accent)",40],["Debt Payments","$690","var(--blue)",20],["Toward Goals","$518","var(--gold)",15],["Estimated Safe Spend","$620","var(--green)",18],["Buffer","$242","var(--t3)",7]].map(([l,v,c,p]) => (
            <div key={l} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:c,flexShrink:0}}/>
              <span style={{fontSize:"var(--f-sm)",color:"var(--t2)",flex:1}}>{l}</span>
              <div style={{width:80,height:4,background:"rgba(255,255,255,.05)",borderRadius:4,overflow:"hidden"}}>
                <div style={{width:loaded?p+"%":"0%",height:"100%",background:c,borderRadius:4,transition:"width 1s ease"}}/>
              </div>
              <span style={{fontFamily:"var(--body)",fontSize:"var(--f-base)",fontWeight:800,color:c,width:46,textAlign:"right"}}>{v}</span>
            </div>
          ))}
        </div>
      )}

      <div className="ai-note f8">
        <div className="ai-lbl">PAI° Insight</div>
        <p className="ai-txt"><strong>Dining is $87 over budget</strong> this cycle. Consider reducing restaurant spending before your next paycheck to stay aligned with your plan.</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   PROGRESS — New screen
═══════════════════════════════════════ */
function Progress({ nav, loaded }) {
  const [showScore, setShowScore] = useState(false);

  const scoreInputs = [
    {label:"Cash-Flow Stability",score:82,c:"var(--green)",note:"Income covers bills consistently"},
    {label:"Debt Pressure",score:64,c:"var(--gold)",note:"Credit card APR is high"},
    {label:"Savings Progress",score:78,c:"var(--accent)",note:"3 active goals, all on track"},
    {label:"Bill Coverage",score:91,c:"var(--green)",note:"All bills covered this cycle"},
    {label:"Spending Alignment",score:71,c:"var(--gold)",note:"Dining slightly over"},
    {label:"Timing Risk",score:80,c:"var(--green)",note:"No overdraft risk detected"},
    {label:"Subscription Drag",score:68,c:"var(--gold)",note:"$155/mo in subscriptions"},
    {label:"Interest Leakage",score:58,c:"var(--red)",note:"~$87/mo in credit card interest"},
    {label:"Emergency Fund",score:72,c:"var(--accent)",note:"72% funded"},
  ];

  return (
    <div>
      <div className="hdr f1">
        <div className="hdr-l">
          <div className="back" onClick={() => nav("home")}>←</div>
          <div className="pg-title">Progress</div>
        </div>
      </div>

      {/* Financial Energy Score — hero */}
      <div className="card-glow f2" style={{cursor:"pointer"}} onClick={() => setShowScore(true)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div className="lbl" style={{marginBottom:8}}>Financial Energy Score</div>
            <div style={{fontFamily:"var(--body)",fontSize:52,fontWeight:800,color:"var(--gold)",letterSpacing:"-2px",lineHeight:1}}>78</div>
            <div style={{fontSize:"var(--f-sm)",color:"var(--t2)",marginTop:6}}>Out of 100 · <span style={{color:"var(--gold)",fontWeight:600}}>Strong</span></div>
          </div>
          <div style={{textAlign:"right"}}>
            <div className="pill" style={{background:"var(--gdim)",color:"var(--green)",marginBottom:8}}>▲ +3 this month</div>
            <div style={{fontSize:"var(--f-xs)",color:"var(--accent)",fontWeight:600,background:"var(--adim)",padding:"4px 10px",borderRadius:8}}>Tap for breakdown →</div>
          </div>
        </div>
        <div style={{marginTop:14,display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
          {[["Bills","Covered","var(--green)"],["Debt","Improving","var(--blue)"],["Savings","On Track","var(--accent)"],["Spending","Watch","var(--gold)"]].map(([l,s,c]) => (
            <div key={l} style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:c}}/>
              <span style={{fontSize:"var(--f-xs)",color:"var(--t2)",flex:1}}>{l}</span>
              <span style={{fontSize:"var(--f-xs)",fontWeight:700,color:c}}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Debt journey */}
      <div className="sec-head f3"><div className="sec-title">Debt Journey</div></div>
      <div className="card f3">
        {/* Lead with progress — not the wall */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:12}}>
          <div>
            <div className="lbl" style={{marginBottom:5}}>Paid Off So Far</div>
            <div style={{fontFamily:"var(--body)",fontSize:"var(--f-2xl)",fontWeight:800,color:"var(--green)",letterSpacing:"-1px"}}>$3,600 ▼</div>
            <div style={{fontSize:"var(--f-xs)",color:"var(--t3)",marginTop:3}}>Since you started tracking</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div className="lbl" style={{marginBottom:5}}>Still Remaining</div>
            <div style={{fontFamily:"var(--body)",fontSize:"var(--f-xl)",fontWeight:800,color:"var(--t2)"}}>$38,400</div>
          </div>
        </div>
        <div className="pb">
          <div className="pf" style={{width:loaded?"8.5%":"0%",background:"var(--green)"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:"var(--f-xs)",color:"var(--t3)",fontWeight:600,marginTop:5}}>
          <span>Started: $42,000</span>
          <span>Est. debt-free: Jun 2029</span>
        </div>
        <div style={{marginTop:12,borderTop:"1px solid var(--border)",paddingTop:12}}>
          {[["💳","Credit Card","$4,500","22.9%","var(--red)","Priority #1"],["🎓","Student Loan","$22,100","5.8%","var(--blue)","Priority #2"],["🚗","Auto Loan","$11,800","4.2%","var(--accent)","Priority #3"]].map(([ic,n,b,r,c,p]) => (
            <div key={n} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
              <div style={{width:32,height:32,borderRadius:10,background:c+"1A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{ic}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:"var(--f-base)",fontWeight:600,color:"var(--t1)"}}>{n}</div>
                <div style={{display:"flex",gap:6,marginTop:1}}>
                  <span className="pill" style={{background:c+"1A",color:c}}>{r} APR</span>
                  <span style={{fontSize:9,color:"var(--t3)",fontWeight:600,alignSelf:"center"}}>{p}</span>
                </div>
              </div>
              <div style={{fontFamily:"var(--body)",fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)"}}>{b}</div>
            </div>
          ))}
        </div>
      </div>

      {/* This month snapshot — moved up — most motivating section */}
      <div className="sec-head f4"><div className="sec-title">This Month at a Glance</div></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"0 20px 12px"}} className="f4">
        {[["💰","Income","$7,650","var(--green)"],["💸","Spent","$4,200","var(--red)"],["🎯","To Goals","$850","var(--accent)"],["📉","Debt Paid","$690","var(--blue)"]].map(([ic,l,v,c]) => (
          <div key={l} style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"var(--r3)",padding:14}}>
            <div style={{width:28,height:28,borderRadius:9,background:c+"1A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,marginBottom:8}}>{ic}</div>
            <div style={{fontSize:"var(--f-sm)",color:"var(--t3)",marginBottom:3}}>{l}</div>
            <div style={{fontFamily:"var(--body)",fontSize:"var(--f-xl)",fontWeight:800,color:c,letterSpacing:"-.3px"}}>{v}</div>
          </div>
        ))}
      </div>

      {/* Savings growth */}
      <div className="sec-head f5"><div className="sec-title">Savings Growth</div></div>
      <div className="card f5">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:14}}>
          <div>
            <div className="lbl" style={{marginBottom:5}}>Total Tracked</div>
            <div style={{fontFamily:"var(--body)",fontSize:"var(--f-2xl)",fontWeight:800,color:"var(--accent)",letterSpacing:"-1px"}}>$22,200</div>
          </div>
          <div className="pill" style={{background:"var(--gdim)",color:"var(--green)"}}>▲ $850 this cycle</div>
        </div>
        {[["🏠","Down Payment","$18,400","$40,000",46,"#18C7A1","Dec 2027"],["🏖️","Emergency Fund","$10,800","$15,000",72,"#22C55E","Nov 2026"],["✈️","Europe Trip","$3,800","$6,000",63,"#F59E0B","Mar 2027"]].map(([em,n,s,t,p,c,eta]) => (
          <div key={n} style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <span style={{display:"flex",alignItems:"center",gap:6}}>
                <span>{em}</span>
                <span style={{fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)"}}>{n}</span>
              </span>
              <div style={{textAlign:"right"}}>
                <span style={{fontFamily:"var(--body)",fontSize:"var(--f-sm)",fontWeight:700,color:c}}>{p}%</span>
                <span style={{fontSize:"var(--f-xs)",color:"var(--t3)",marginLeft:6}}>ETA {eta}</span>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"var(--f-xs)",color:"var(--t3)",marginBottom:4}}>
              <span>{s} saved</span><span>of {t}</span>
            </div>
            <div className="pb" style={{marginTop:0}}>
              <div className="pf" style={{width:loaded?p+"%":"0%",background:c}}/>
            </div>
          </div>
        ))}
      </div>

      <div className="ai-note f6">
        <div className="ai-lbl">PAI° Insight</div>
        <p className="ai-txt">Interest leakage ($87/mo on credit card) and subscription drag ($155/mo) are your two biggest opportunities to improve your score. Addressing the credit card first may have the most impact.</p>
      </div>

      {/* Score breakdown sheet */}
      {showScore && (
        <div className="overlay">
          <div className="bdrop" onClick={() => setShowScore(false)}/>
          <div className="sheet">
            <div className="sh-handle"/>
            <div className="sh-hdr">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div className="sh-title">Financial Energy Score</div>
                  <div style={{fontSize:"var(--f-sm)",color:"var(--t3)",marginTop:3}}>How efficiently your income builds progress</div>
                </div>
                <div style={{fontFamily:"var(--body)",fontSize:34,fontWeight:800,color:"var(--gold)",letterSpacing:"-1.5px"}}>78</div>
              </div>
            </div>
            <div style={{padding:"16px 20px"}}>
              {scoreInputs.map((s,i) => (
                <div key={i} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                    <div style={{flex:1,paddingRight:12}}>
                      <div style={{fontSize:"var(--f-base)",fontWeight:600,color:"var(--t1)"}}>{s.label}</div>
                      <div style={{fontSize:"var(--f-xs)",color:"var(--t3)",marginTop:1,lineHeight:1.4}}>{s.note}</div>
                    </div>
                    <div style={{fontFamily:"var(--body)",fontSize:15,fontWeight:800,color:s.c,flexShrink:0}}>{s.score}</div>
                  </div>
                  <div className="pb" style={{marginTop:0}}><div className="pf" style={{width:s.score+"%",background:s.c}}/></div>
                </div>
              ))}
              <button onClick={() => setShowScore(false)} className="pbtn" style={{marginTop:8}}>Got It</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   SECONDARY SCREENS (via center menu)
═══════════════════════════════════════ */
function Bills({ nav, loaded }) {
  const [confirmed, setConfirmed] = useState({1:true,4:true,5:true,6:true});
  const [expanded,  setExpanded]  = useState(null);
  const [showAdd,   setShowAdd]   = useState(false);
  const [addName,   setAddName]   = useState("");
  const [addAmt,    setAddAmt]    = useState("");
  const [addDue,    setAddDue]    = useState("");

  const bills = [
    {id:1,icon:"🏠",name:"Rent",          amount:1200,due:"Due 1st",   freq:"Monthly",color:"var(--accent)",bg:"var(--adim)",lender:"Property Mgmt",lastPaid:"May 1",  note:"12 months of consistent payments detected."},
    {id:2,icon:"🚗",name:"Car Payment",   amount:290, due:"Due 5th*",  freq:"Monthly",color:"var(--green)", bg:"var(--gdim)",lender:"Toyota Financial",lastPaid:"May 5",note:"Due date estimated — verify with Toyota Financial."},
    {id:3,icon:"💳",name:"Credit Card Min",amount:135,due:"Due 25th*", freq:"Monthly",color:"var(--red)",   bg:"var(--rdim)",lender:"Chase Sapphire",lastPaid:"Apr 25",note:"Minimum varies by statement. Verify with Chase."},
    {id:4,icon:"🎓",name:"Student Loan",  amount:400, due:"Due 28th",  freq:"Monthly",color:"var(--blue)",  bg:"var(--bdim)",lender:"Navient",       lastPaid:"Apr 28",note:"Consistent payment detected for 18 months."},
    {id:5,icon:"⚡",name:"Utilities",     amount:180, due:"Due 18th",  freq:"Monthly",color:"var(--gold)",  bg:"var(--ydim)",lender:"APS Electric",  lastPaid:"May 2", note:"Amount varies. PAI° uses your 6-month average."},
    {id:6,icon:"🌐",name:"Internet",      amount:86,  due:"Due 20th",  freq:"Monthly",color:"var(--blue)",  bg:"var(--bdim)",lender:"Cox",           lastPaid:"May 3", note:"Fixed monthly charge — consistent."},
  ];

  const needsReview = bills.filter(b => !confirmed[b.id]).length;
  const total       = bills.reduce((a,b) => a+b.amount, 0);

  return (
    <div>
      <div className="hdr f1">
        <div className="hdr-l"><div className="back" onClick={() => nav("home")}>←</div><div className="pg-title">Bill Manager</div></div>
        <button style={{background:"var(--accent)",border:"none",borderRadius:11,padding:"8px 14px",fontSize:"var(--f-sm)",fontWeight:700,color:"#000",cursor:"pointer",fontFamily:"var(--body)"}} onClick={() => setShowAdd(true)}>+ Add Bill</button>
      </div>

      <div style={{margin:"0 20px 14px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:"var(--r2)",padding:"11px 14px",display:"flex",alignItems:"center",gap:10}} className="f2">
        <div style={{width:8,height:8,borderRadius:"50%",background:"var(--green)",animation:"fdot 2s ease-in-out infinite",flexShrink:0}}/>
        <div style={{fontSize:"var(--f-sm)",color:"var(--t2)",flex:1}}><strong style={{color:"var(--t1)"}}>Plaid detected {bills.length} recurring bills.</strong> {needsReview>0?needsReview+" need review.":"All confirmed."}</div>
        <span style={{fontSize:"var(--f-xs)",color:"var(--accent)",fontWeight:700,cursor:"pointer"}}>Sync</span>
      </div>

      <div style={{display:"flex",gap:10,padding:"0 20px 14px",overflow:"auto",scrollbarWidth:"none"}} className="f3">
        {[[String(needsReview),needsReview>0?"Needs Review":"All Clear",needsReview>0?"var(--gold)":"var(--green)"],[""+bills.filter(b=>confirmed[b.id]).length,"Confirmed","var(--accent)"],["$"+total,"Monthly","var(--t1)"]].map(([v,l,c]) => (
          <div key={l} style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"var(--r2)",padding:"11px 14px",flexShrink:0,minWidth:90}}>
            <div className="lbl" style={{marginBottom:4}}>{l}</div>
            <div style={{fontFamily:"var(--body)",fontSize:"var(--f-xl)",fontWeight:800,color:c}}>{v}</div>
          </div>
        ))}
      </div>

      {needsReview>0 && (
        <div style={{margin:"0 20px 12px",padding:"13px 14px",background:"linear-gradient(135deg,#071A18,#091C2A)",border:"1px solid rgba(24,199,161,.2)",borderRadius:16,display:"flex",gap:10}} className="f4">
          <span style={{fontSize:16,flexShrink:0}}>🔍</span>
          <div>
            <div style={{fontSize:"var(--f-sm)",fontWeight:700,color:"var(--t1)",marginBottom:3}}>Due dates need your confirmation</div>
            <div style={{fontSize:"var(--f-sm)",color:"var(--t2)",lineHeight:1.6}}>Plaid detects when you paid — not when bills are due. Items marked with * are estimated.</div>
          </div>
        </div>
      )}

      {bills.map((b,i) => {
        const isConf = confirmed[b.id];
        const isExp  = expanded===b.id;
        return (
          <div key={b.id} className={"card f"+(i+4)} style={{cursor:"pointer",borderColor:isConf?"rgba(34,197,94,.15)":"rgba(245,158,11,.25)"}} onClick={() => setExpanded(isExp?null:b.id)}>
            <div style={{display:"flex",alignItems:"center",gap:11}}>
              <div style={{width:40,height:40,borderRadius:13,background:b.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0,position:"relative"}}>
                {b.icon}
                <div style={{position:"absolute",bottom:-2,right:-2,width:13,height:13,borderRadius:"50%",background:"var(--blue)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color:"#fff",border:"2px solid var(--bg)"}}>P</div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)",marginBottom:2}}>{b.name}</div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontSize:"var(--f-xs)",color:"var(--t3)"}}>{b.due}</span>
                  <span className="pill" style={{background:"var(--adim)",color:"var(--accent)"}}>{b.freq}</span>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"var(--body)",fontSize:"var(--f-lg)",fontWeight:800,color:"var(--t1)"}}>${b.amount}</div>
                <div className="pill" style={{marginTop:3,background:isConf?"var(--gdim)":"var(--ydim)",color:isConf?"var(--green)":"var(--gold)"}}>{isConf?"✓ Confirmed":"Review"}</div>
              </div>
            </div>
            {isExp && (
              <div style={{marginTop:12,borderTop:"1px solid var(--border)",paddingTop:12}}>
                <div style={{padding:"9px 11px",background:"rgba(58,168,255,.06)",border:"1px solid rgba(58,168,255,.15)",borderRadius:10,marginBottom:10}}>
                  <div style={{fontSize:"var(--f-xs)",fontWeight:700,color:"var(--blue)",marginBottom:3}}>P Plaid · {b.lender} · Last paid {b.lastPaid}</div>
                  <div style={{fontSize:"var(--f-xs)",color:"var(--t2)",lineHeight:1.6}}>{b.note}</div>
                </div>
                {!isConf ? (
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:8}}>
                    <button onClick={e => {e.stopPropagation();setConfirmed(c => ({...c,[b.id]:true}));setExpanded(null);}} style={{background:"var(--accent)",border:"none",borderRadius:11,padding:"10px",fontSize:"var(--f-sm)",fontWeight:700,color:"#000",cursor:"pointer",fontFamily:"var(--body)"}}>✓ Confirm Due Date</button>
                    <button onClick={e => e.stopPropagation()} style={{background:"var(--rdim)",color:"var(--red)",border:"1px solid rgba(239,68,68,.18)",borderRadius:11,padding:"10px",fontSize:"var(--f-sm)",fontWeight:700,cursor:"pointer",fontFamily:"var(--body)"}}>Remove</button>
                  </div>
                ) : (
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:"var(--f-xs)",color:"var(--green)",fontWeight:600}}>✓ Included in your paycheck plan</span>
                    <button onClick={e => {e.stopPropagation();setConfirmed(c => ({...c,[b.id]:false}));}} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"4px 10px",fontSize:"var(--f-xs)",fontWeight:600,color:"var(--t3)",cursor:"pointer",fontFamily:"var(--body)"}}>Edit</button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {showAdd && (
        <div className="overlay">
          <div className="bdrop" onClick={() => setShowAdd(false)}/>
          <div className="sheet">
            <div className="sh-handle"/>
            <div className="sh-hdr"><div className="sh-title">Add a Bill</div><div style={{fontSize:"var(--f-sm)",color:"var(--t3)",marginTop:4}}>For bills Plaid has not detected automatically</div></div>
            <div className="sh-body">
              <div className="fl">Bill Name</div><input className="fi" placeholder="e.g. Car Insurance, Gym" value={addName} onChange={e => setAddName(e.target.value)}/>
              <div className="fl">Monthly Amount</div><input className="fi" type="number" placeholder="$" value={addAmt} onChange={e => setAddAmt(e.target.value)}/>
              <div className="fl">Due Day of Month</div>
              <input className="fi" type="number" min="1" max="31" placeholder="e.g. 15" value={addDue} onChange={e => setAddDue(e.target.value)}/>
              <div style={{fontSize:"var(--f-xs)",color:"var(--t3)",marginBottom:16,lineHeight:1.5}}>Always verify the due date with your lender.</div>
              <button onClick={() => setShowAdd(false)} className="pbtn" style={{opacity:addName&&addAmt&&addDue?1:.4,cursor:addName&&addAmt&&addDue?"pointer":"not-allowed"}}>Add to Bill Calendar →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Debt({ nav, loaded }) {
  const [strat,    setStrat]    = useState("pai");
  const [extra,    setExtra]    = useState(100);
  const [expanded, setExpanded] = useState("Credit Card");

  const strategies = {
    snowball:{label:"Snowball",  icon:"❄️", eta:"Nov 2029",saved:"$1,760",desc:"Smallest balance first. Builds momentum through quick wins."},
    avalanche:{label:"Avalanche",icon:"🏔️",eta:"Sep 2029",saved:"$2,200",desc:"Highest interest first. Mathematically saves the most."},
    pai:{label:"PAI° Optimal",  icon:"✦",  eta:"Jun 2029",saved:"$2,650",desc:"Balances interest cost, due dates, and cash-flow timing each paycheck."},
  };
  const s = strategies[strat];

  const debts = [
    {icon:"💳",name:"Credit Card",lender:"Chase",bal:4500, rate:"22.9%",min:135,color:"var(--red)",  bg:"var(--rdim)",pri:1,pct:0,
     why:"Highest APR in your profile. Every extra dollar here saves more than anywhere else.",
     action:"Pay minimum $135. Consider adding extra — even $50/mo reduces payoff by ~8 months."},
    {icon:"🎓",name:"Student Loan",lender:"Navient",bal:22100,rate:"5.8%",min:400,color:"var(--blue)",bg:"var(--bdim)",pri:2,pct:21,
     why:"Fixed federal rate — much lower than your credit card. Focus extra payments on CC first.",
     action:"Pay the standard $400/mo. Do not overpay until credit card is resolved."},
    {icon:"🚗",name:"Auto Loan",lender:"Toyota",bal:11800,rate:"4.2%",min:290,color:"var(--accent)",bg:"var(--adim)",pri:3,pct:34,
     why:"Lowest rate in your profile. Minimum payments are the right move here.",
     action:"Pay the standard $290/mo. No extra payment needed at this stage."},
  ];

  return (
    <div>
      <div className="hdr f1">
        <div className="hdr-l"><div className="back" onClick={() => nav("home")}>←</div><div className="pg-title">Debt Payoff</div></div>
        <span className="pill" style={{background:"var(--adim)",color:"var(--accent)",border:"1px solid rgba(24,199,161,.2)"}}>PAI° OPTIMAL</span>
      </div>

      <div style={{margin:"4px 20px 14px",background:"linear-gradient(135deg,#1A0812,#0C0E1A)",border:"1px solid rgba(239,68,68,.15)",borderRadius:"var(--r4)",padding:20}} className="f2">
        <div className="lbl" style={{marginBottom:6}}>Total Debt</div>
        <div style={{fontFamily:"var(--body)",fontSize:36,fontWeight:800,color:"var(--t1)",letterSpacing:"-1.5px",marginBottom:6}}>$38,400</div>
        <div style={{fontSize:"var(--f-sm)",color:"var(--t2)",marginBottom:14}}>Across 3 accounts · {s.label} selected</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",borderTop:"1px solid var(--border)",paddingTop:12}}>
          {[["$690/mo","Monthly","var(--red)"],[s.eta,"Debt-Free Est.","var(--gold)"],[s.saved,"Est. Int. Saved","var(--accent)"]].map(([v,l,c]) => (
            <div key={l} style={{textAlign:"center",padding:"0 4px",borderRight:l!=="Est. Int. Saved"?"1px solid var(--border)":"none"}}>
              <div style={{fontFamily:"var(--body)",fontSize:13,fontWeight:800,color:c,letterSpacing:"-.3px"}}>{v}</div>
              <div style={{fontSize:9,color:"var(--t3)",fontWeight:600,marginTop:2,lineHeight:1.3}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,margin:"0 20px 8px"}} className="f3">
        {Object.entries(strategies).map(([k,st]) => (
          <div key={k} onClick={() => setStrat(k)} style={{borderRadius:14,padding:"11px 8px",textAlign:"center",cursor:"pointer",border:strat===k?"1.5px solid var(--accent)":"1.5px solid var(--border)",background:strat===k?"var(--adim)":"var(--card)",transition:"all .15s"}}>
            <div style={{fontSize:17,marginBottom:4}}>{st.icon}</div>
            <div style={{fontSize:10,fontWeight:700,color:strat===k?"var(--accent)":"var(--t2)",lineHeight:1.3}}>{st.label}</div>
            {k==="pai" && <div style={{fontSize:9,fontWeight:800,background:"rgba(24,199,161,.15)",color:"var(--accent)",padding:"2px 6px",borderRadius:6,marginTop:4,display:"inline-block"}}>BEST</div>}
          </div>
        ))}
      </div>

      <div style={{margin:"8px 20px 14px",padding:"11px 13px",background:"rgba(255,255,255,.03)",border:"1px solid var(--border)",borderRadius:12,fontSize:"var(--f-sm)",color:"var(--t2)",lineHeight:1.65}}>
        <strong style={{color:"var(--t1)"}}>{s.label}:</strong> {s.desc}{" "}
        {strat==="pai" && <span onClick={() => nav("home")} style={{color:"var(--accent)",cursor:"pointer",fontWeight:600}}>Questions? Ask PAI° →</span>}
      </div>

      {/* Extra payment modeler */}
      <div className="card f4">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)"}}>Model Extra Payment</div>
          <span style={{fontFamily:"var(--body)",fontSize:"var(--f-lg)",fontWeight:800,color:"var(--accent)"}}>+${extra}/mo</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
          {["-","+"].map((btn,j) => (
            <div key={btn} onClick={() => setExtra(e => j===0?Math.max(0,e-25):Math.min(500,e+25))} style={{width:34,height:34,borderRadius:11,background:"var(--card2)",border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"var(--t2)",cursor:"pointer"}}>{btn}</div>
          ))}
          <div style={{flex:1,height:4,background:"rgba(255,255,255,.06)",borderRadius:4,overflow:"hidden"}}>
            <div style={{width:Math.min((extra/500)*100,100)+"%",height:"100%",background:"linear-gradient(90deg,var(--accent),#3AA8FF)",borderRadius:4,transition:"width .2s"}}/>
          </div>
        </div>
        {extra>0 && <div style={{padding:"10px 12px",background:"var(--adim)",border:"1px solid rgba(24,199,161,.15)",borderRadius:12,fontSize:"var(--f-sm)",color:"var(--t2)",lineHeight:1.6}}>Adding <strong style={{color:"var(--accent)"}}>${extra}/mo</strong> may reduce payoff by <strong style={{color:"var(--accent)"}}>~{Math.floor(extra/35)} months</strong> and could save an estimated <strong style={{color:"var(--accent)"}}>${(extra*35).toLocaleString()}</strong> in interest.</div>}
      </div>

      <div className="sec-head f5"><div className="sec-title">Your Debts · Suggested Order</div><span style={{fontSize:"var(--f-xs)",color:"var(--t3)"}}>Tap to expand</span></div>

      {debts.map((d,i) => (
        <div key={d.name} className={"card f"+(i+5)} style={{cursor:"pointer",borderColor:expanded===d.name?"var(--border2)":"var(--border)"}} onClick={() => setExpanded(expanded===d.name?null:d.name)}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:13,background:d.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{d.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)",marginBottom:3}}>{d.name}</div>
              <div style={{display:"flex",gap:7,alignItems:"center"}}>
                <span className="pill" style={{background:d.bg,color:d.color}}>{d.rate} APR</span>
                <span style={{fontSize:"var(--f-xs)",color:"var(--t3)"}}>Priority #{d.pri} · Min ${d.min}</span>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"var(--body)",fontSize:"var(--f-lg)",fontWeight:800,color:"var(--t1)"}}>${d.bal.toLocaleString()}</div>
              <div style={{fontSize:"var(--f-xs)",color:d.color,fontWeight:600,marginTop:2}}>{expanded===d.name?"▲":"▼"}</div>
            </div>
          </div>
          <div className="pb" style={{marginTop:10}}><div className="pf" style={{width:loaded?d.pct+"%":"0%",background:d.color}}/></div>
          {expanded===d.name && (
            <div style={{marginTop:12,borderTop:"1px solid var(--border)",paddingTop:12}}>
              <div style={{padding:"10px 12px",background:"rgba(255,255,255,.03)",borderRadius:11,marginBottom:8}}>
                <div className="lbl" style={{marginBottom:5}}>Why This Priority</div>
                <p style={{fontSize:"var(--f-sm)",color:"var(--t2)",lineHeight:1.65}}>{d.why}</p>
              </div>
              <div style={{padding:"10px 12px",background:"var(--adim)",border:"1px solid rgba(24,199,161,.15)",borderRadius:11}}>
                <div className="lbl" style={{color:"var(--accent)",marginBottom:5}}>Suggested Action</div>
                <p style={{fontSize:"var(--f-sm)",color:"var(--t2)",lineHeight:1.65}}>{d.action}</p>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="ai-note f8">
        <div className="ai-lbl">PAI° Insight</div>
        <p className="ai-txt">Your credit card at 22.9% APR is costing an estimated <strong>$87/month in interest</strong>. Directing any extra funds here first may create the most progress.</p>
      </div>
    </div>
  );
}

function Goals({ nav, loaded }) {
  const [showInfo, setShowInfo] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [boosted,  setBoosted]  = useState({});

  const goals = [
    {emoji:"🏠",name:"Down Payment",  saved:18400,target:40000,color:"#18C7A1",status:"On Track",  eta:"Dec 2027",monthly:"$250/mo",
     lives:"Chase Checking ••3847",action:"Move to a dedicated savings account when ready.",history:["May 8 · $250","Apr 24 · $250","Apr 10 · $250"]},
    {emoji:"💳",name:"Debt-Free",     saved:15600,target:38400,color:"#3AA8FF",status:"Improving", eta:"Sep 2028",monthly:"$690/mo",
     lives:"Applied to your loan balances directly",action:"PAI° tracks payments toward debt as progress.",history:["May 8 · $690","Apr 24 · $690"]},
    {emoji:"🏖️",name:"Emergency Fund",saved:10800,target:15000,color:"#22C55E",status:"Almost There",eta:"Nov 2026",monthly:"$168/mo",
     lives:"Chase Checking ••3847",action:"Consider a high-yield savings account for best results.",history:["May 8 · $168","Apr 24 · $168","Apr 10 · $168"]},
    {emoji:"✈️",name:"Europe Trip",   saved:3800, target:6000, color:"#F59E0B",status:"On Track",  eta:"Mar 2027",monthly:"$100/mo",
     lives:"Chase Checking ••3847",action:"Consider a separate travel savings account.",history:["May 8 · $100","Apr 24 · $100"]},
  ];

  return (
    <div>
      <div className="hdr f1">
        <div className="hdr-l"><div className="back" onClick={() => nav("home")}>←</div><div className="pg-title">Goals</div></div>
        <button style={{background:"var(--accent)",border:"none",borderRadius:11,padding:"8px 14px",fontSize:"var(--f-sm)",fontWeight:700,color:"#000",cursor:"pointer",fontFamily:"var(--body)"}}>+ New Goal</button>
      </div>

      <div style={{display:"flex",gap:10,padding:"0 20px 14px",overflow:"auto",scrollbarWidth:"none"}} className="f2">
        {[["$48.7k","Tracked","var(--accent)"],["$1,208","Per Month","var(--green)"],["4","Active","var(--t1)"],["Nov 26","Nearest","var(--gold)"]].map(([v,l,c]) => (
          <div key={l} style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"var(--r2)",padding:"11px 14px",flexShrink:0,minWidth:90}}>
            <div className="lbl" style={{marginBottom:4}}>{l}</div>
            <div style={{fontFamily:"var(--body)",fontSize:"var(--f-xl)",fontWeight:800,color:c,letterSpacing:"-.5px"}}>{v}</div>
          </div>
        ))}
      </div>

      {/* Where money lives explainer */}
      <div style={{margin:"0 20px 14px",background:"linear-gradient(135deg,#071A18,#091C2A)",border:"1px solid rgba(24,199,161,.18)",borderRadius:16,padding:"13px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}} className="f3" onClick={() => setShowInfo(true)}>
        <span style={{fontSize:18,flexShrink:0}}>💡</span>
        <div style={{flex:1}}>
          <div style={{fontSize:"var(--f-sm)",fontWeight:700,color:"var(--t1)",marginBottom:2}}>Where does your goal money actually live?</div>
          <div style={{fontSize:"var(--f-xs)",color:"var(--t3)"}}>PAI° tracks it — you decide where to keep it. Tap to understand how this works.</div>
        </div>
        <span style={{fontSize:14,color:"var(--accent)"}}>→</span>
      </div>

      {goals.map((g,i) => {
        const pct  = Math.round((g.saved/g.target)*100);
        const isEx = expanded===g.name;
        return (
          <div key={g.name} className={"card f"+(i+4)} style={{cursor:"pointer"}} onClick={() => setExpanded(isEx?null:g.name)}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{fontSize:22,width:42,height:42,background:"rgba(255,255,255,.04)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{g.emoji}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                  <span style={{fontFamily:"var(--ui)",fontSize:"var(--f-md)",fontWeight:700,color:"var(--t1)"}}>{g.name}</span>
                  <span style={{fontFamily:"var(--body)",fontSize:"var(--f-md)",fontWeight:800,color:g.color}}>{pct}%</span>
                </div>
                <div style={{fontSize:"var(--f-xs)",color:"var(--t3)"}}>Target: ${g.target.toLocaleString()} · ETA {g.eta} · {g.monthly}</div>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontFamily:"var(--body)",fontSize:17,fontWeight:800,color:"var(--t1)"}}>${(g.saved/1000).toFixed(1)}k tracked</span>
              <span className="pill" style={{background:g.color+"1A",color:g.color}}>{g.status}</span>
            </div>
            <div className="pb"><div className="pf" style={{width:loaded?pct+"%":"0%",background:g.color}}/></div>

            {isEx && (
              <div style={{marginTop:14,borderTop:"1px solid var(--border)",paddingTop:14}}>
                <div style={{background:"rgba(255,255,255,.03)",borderRadius:12,padding:"11px 12px",marginBottom:10}}>
                  <div className="lbl" style={{marginBottom:5}}>Where This Money Lives</div>
                  <div style={{fontSize:"var(--f-sm)",fontWeight:600,color:"var(--t1)",marginBottom:3}}>{g.lives}</div>
                  <div style={{fontSize:"var(--f-xs)",color:"var(--t3)",lineHeight:1.5}}>{g.action}</div>
                </div>
                <div style={{marginBottom:12}}>
                  <div className="lbl" style={{marginBottom:7}}>Recent Allocations</div>
                  {g.history.map((h,j) => (
                    <div key={j} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:j<g.history.length-1?"1px solid rgba(255,255,255,.04)":"none"}}>
                      <span style={{fontSize:"var(--f-sm)",color:"var(--t2)"}}>{h.split("·")[0]}</span>
                      <span style={{fontFamily:"var(--body)",fontSize:"var(--f-sm)",fontWeight:700,color:g.color}}>{h.split("·")[1]}</span>
                    </div>
                  ))}
                </div>
                <button onClick={e => {e.stopPropagation();setBoosted(b => ({...b,[g.name]:true}));}} style={{width:"100%",background:boosted[g.name]?"var(--gdim)":"var(--adim)",border:boosted[g.name]?"1px solid rgba(34,197,94,.3)":"1px solid rgba(24,199,161,.25)",borderRadius:12,padding:10,fontSize:"var(--f-sm)",fontWeight:700,color:boosted[g.name]?"var(--green)":"var(--accent)",fontFamily:"var(--body)",cursor:"pointer"}}>
                  {boosted[g.name]?"✓ Extra contribution noted — ask PAI° to adjust your plan":"⚡ Suggest a Boost This Paycheck"}
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Where money lives sheet */}
      {showInfo && (
        <div className="overlay">
          <div className="bdrop" onClick={() => setShowInfo(false)}/>
          <div className="sheet">
            <div className="sh-handle"/>
            <div className="sh-hdr"><div className="sh-title">Where Does Your Goal Money Live?</div><div style={{fontSize:"var(--f-sm)",color:"var(--t3)",marginTop:4}}>An important question — here's the honest answer.</div></div>
            <div style={{padding:"16px 20px"}}>
              {[["📊","PAI° tracks it virtually","When your plan shows $250 toward Down Payment, PAI° records that allocation. The money is still in your checking account — PAI° does not move it."],["🏦","You physically move it","To truly save toward a goal, you transfer the money yourself to a separate savings account. PAI° can remind you to do this."],["✓","Plaid confirms when it moves","If you connect a savings account via Plaid, PAI° can detect when money moves there and update goal progress automatically."],["💡","Why this matters","Keeping goal money in checking works — but a separate account makes it harder to accidentally spend. PAI° works either way."]].map(([ic,title,body],i) => (
                <div key={i} style={{display:"flex",gap:12,marginBottom:18}}>
                  <div style={{width:36,height:36,borderRadius:11,background:"var(--card2)",border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{ic}</div>
                  <div>
                    <div style={{fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)",marginBottom:4}}>{title}</div>
                    <div style={{fontSize:"var(--f-sm)",color:"var(--t2)",lineHeight:1.65}}>{body}</div>
                  </div>
                </div>
              ))}
              <div style={{padding:"11px 13px",background:"rgba(255,255,255,.03)",border:"1px solid var(--border)",borderRadius:12,fontSize:"var(--f-xs)",color:"var(--t3)",lineHeight:1.65,marginBottom:14}}>PAI° does not move money, execute transfers, or access your accounts in any way other than reading balances and transactions through Plaid.</div>
              <button onClick={() => setShowInfo(false)} className="pbtn">Got It</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingItem({ item }) {
  const [tog, setTog] = useState(item.on||false);
  return (
    <div className="sr" onClick={item.action}>
      <div className="sr-ic" style={{background:item.bg}}>{item.icon}</div>
      <div style={{flex:1}}><div className="sr-t">{item.title}</div>{item.sub && <div className="sr-s">{item.sub}</div>}</div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        {item.val && <span style={{fontSize:"var(--f-sm)",color:"var(--t3)"}}>{item.val}</span>}
        {item.toggle
          ? <div className={"tog "+(tog?"on":"")} onClick={e => {e.stopPropagation();setTog(!tog);}}><div className="tk"/></div>
          : <span style={{fontSize:14,color:"var(--t3)"}}>›</span>
        }
      </div>
    </div>
  );
}

function Settings({ nav }) {
  const [buffer,    setBuffer]    = useState(500);
  const [signedOut, setSignedOut] = useState(false);

  if (signedOut) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"var(--bg)",gap:16,padding:40,textAlign:"center"}}>
      <div style={{fontSize:48}}>👋</div>
      <div style={{fontFamily:"var(--ui)",fontSize:22,fontWeight:800,color:"var(--t1)"}}>Signed out</div>
      <div style={{fontSize:"var(--f-base)",color:"var(--t3)",lineHeight:1.6}}>Your data is safe. Sign back in anytime.</div>
      <button onClick={() => nav("landing")} style={{background:"var(--accent)",border:"none",borderRadius:14,padding:"13px 32px",fontFamily:"var(--ui)",fontSize:"var(--f-md)",fontWeight:800,color:"#000",cursor:"pointer",marginTop:8}}>Sign Back In →</button>
    </div>
  );

  const groups = [
    {title:"Account & Security",items:[
      {icon:"👤",bg:"var(--card2)",title:"Edit Profile",sub:"Name, email, phone"},
      {icon:"🔒",bg:"var(--bdim)",title:"Face ID / Touch ID",sub:"Unlock with biometrics",toggle:true,on:true},
      {icon:"📱",bg:"var(--bdim)",title:"Two-Factor Auth",sub:"Extra account security",toggle:true,on:false},
      {icon:"⏱",bg:"var(--card2)",title:"Auto Lock",sub:"5 minutes",val:"5 min"},
    ]},
    {title:"PAI° Settings",items:[
      {icon:"📅",bg:"var(--bdim)",title:"Paycheck Schedule",sub:"Bi-weekly · Every Thursday"},
      {icon:"🔔",bg:"var(--ydim)",title:"Notifications",sub:"Bill reminders & paycheck alerts on",action:()=>nav("alerts")},
      {icon:"🏦",bg:"var(--gdim)",title:"Connected Accounts",sub:"4 institutions",action:()=>nav("accounts")},
      {icon:"📋",bg:"var(--card2)",title:"Bill Manager",sub:"Manage your bills",action:()=>nav("bills")},
    ]},
    {title:"Preferences",items:[
      {icon:"🌙",bg:"var(--card2)",title:"Appearance",sub:"Dark mode",val:"Dark"},
      {icon:"💲",bg:"var(--card2)",title:"Currency",sub:"Display currency",val:"USD"},
      {icon:"📳",bg:"var(--card2)",title:"Haptic Feedback",sub:"Vibration for interactions",toggle:true,on:true},
    ]},
    {title:"Support & Legal",items:[
      {icon:"💬",bg:"var(--gdim)",title:"Help Center",sub:"FAQs and guides"},
      {icon:"📄",bg:"var(--card2)",title:"Terms of Service"},
      {icon:"🔐",bg:"var(--card2)",title:"Privacy Policy"},
      {icon:"🛡️",bg:"var(--card2)",title:"Financial Disclaimer",sub:"PAI° is not a financial advisor"},
    ]},
  ];

  return (
    <div>
      <div className="hdr f1">
        <div className="hdr-l"><div className="back" onClick={() => nav("home")}>←</div><div className="pg-title">Settings</div></div>
      </div>

      {/* Profile card */}
      <div style={{margin:"0 20px 20px",background:"linear-gradient(135deg,#071A18,#091C2A)",border:"1px solid rgba(24,199,161,.18)",borderRadius:"var(--r4)",padding:20,display:"flex",gap:14,alignItems:"center"}} className="f2">
        <div style={{width:56,height:56,borderRadius:18,background:"linear-gradient(135deg,#18C7A1,#3AA8FF)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--ui)",fontSize:20,fontWeight:800,color:"#fff",flexShrink:0}}>PK</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"var(--ui)",fontSize:17,fontWeight:800,color:"var(--t1)",marginBottom:3}}>Pascal K.</div>
          <div style={{fontSize:"var(--f-sm)",color:"var(--t3)",marginBottom:8}}>pascal@silverhawk.com</div>
          <div style={{display:"inline-flex",alignItems:"center",gap:5,background:"var(--adim)",border:"1px solid rgba(24,199,161,.25)",borderRadius:20,padding:"4px 10px"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"var(--accent)"}}/>
            <span style={{fontSize:"var(--f-xs)",fontWeight:700,color:"var(--accent)"}}>PAI° Plus · $14.99/mo</span>
          </div>
        </div>
      </div>

      {/* Buffer */}
      <div className="card f3">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)"}}>🔒 Minimum Cash Buffer</div>
          <div style={{fontFamily:"var(--body)",fontSize:16,fontWeight:800,color:"var(--accent)"}}>${buffer}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {["-","+"].map((btn,j) => (
            <div key={btn} onClick={() => setBuffer(b => j===0?Math.max(100,b-100):Math.min(2000,b+100))} style={{width:32,height:32,borderRadius:10,background:"var(--card2)",border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"var(--t2)",cursor:"pointer"}}>{btn}</div>
          ))}
          <div style={{flex:1,height:4,background:"rgba(255,255,255,.06)",borderRadius:4,overflow:"hidden"}}>
            <div style={{width:(buffer/2000)*100+"%",height:"100%",background:"linear-gradient(90deg,var(--accent),#3AA8FF)",borderRadius:4,transition:"width .2s"}}/>
          </div>
        </div>
        <div style={{fontSize:"var(--f-xs)",color:"var(--t3)",marginTop:8,lineHeight:1.5}}>PAI° never suggests a possible wait that drops your account below this amount.</div>
      </div>

      {groups.map((g,gi) => (
        <div key={gi} className={"f"+(gi+4)} style={{margin:"0 20px 16px"}}>
          <div className="lbl" style={{padding:"0 0 10px"}}>{g.title}</div>
          <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"var(--r3)",overflow:"hidden"}}>
            {g.items.map((item,ii) => <SettingItem key={ii} item={item}/>)}
          </div>
        </div>
      ))}

      {/* Danger zone */}
      <div style={{margin:"0 20px 16px",background:"var(--card)",border:"1px solid rgba(239,68,68,.15)",borderRadius:"var(--r3)",overflow:"hidden"}} className="f8">
        <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(239,68,68,.1)",fontSize:"var(--f-xs)",fontWeight:700,letterSpacing:".8px",textTransform:"uppercase",color:"var(--red)"}}>⚠ Danger Zone</div>
        {[["🚪","Sign Out","You can sign back in anytime",()=>setSignedOut(true)],["🗑️","Delete Account","Permanently deletes all data",null]].map(([ic,t,s,fn]) => (
          <div key={t} className="sr" onClick={fn}>
            <div style={{width:32,height:32,borderRadius:10,background:"var(--rdim)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{ic}</div>
            <div style={{flex:1}}><div style={{fontSize:"var(--f-base)",fontWeight:600,color:"var(--red)"}}>{t}</div><div style={{fontSize:"var(--f-sm)",color:"var(--t3)",marginTop:1}}>{s}</div></div>
            <span style={{fontSize:14,color:"var(--red)"}}>›</span>
          </div>
        ))}
      </div>

      <div style={{textAlign:"center",padding:"16px 20px 20px",fontSize:"var(--f-sm)",color:"var(--t3)"}}>
        <strong style={{color:"var(--t2)"}}>PAI° ONE</strong> · Version 1.0.0<br/>© 2026 BLAINK° Technologies LLC · OPTIMPAI° Technologies LLC
      </div>
    </div>
  );
}

function Accounts({ nav, loaded }) {
  const insts = [
    {icon:"🏦",name:"Chase Bank",status:"healthy",accounts:[{icon:"💳",name:"Checking ••3847",bal:"$3,470",type:"Checking",c:"var(--accent)"},{icon:"💰",name:"Savings ••2291",bal:"$3,450",type:"Savings",c:"var(--green)"}]},
    {icon:"🔵",name:"Citi Bank",status:"healthy",accounts:[{icon:"💳",name:"Sapphire ••4821",bal:"-$4,500",type:"Credit Card",c:"var(--red)"}]},
    {icon:"🎓",name:"Navient",status:"warning",accounts:[{icon:"📋",name:"Student Loan ••7743",bal:"-$22,100",type:"Loan",c:"var(--red)"}]},
  ];
  return (
    <div>
      <div className="hdr f1"><div className="hdr-l"><div className="back" onClick={() => nav("home")}>←</div><div className="pg-title">Accounts</div></div><button style={{background:"var(--accent)",border:"none",borderRadius:11,padding:"8px 14px",fontSize:"var(--f-sm)",fontWeight:700,color:"#000",cursor:"pointer",fontFamily:"var(--body)"}}>+ Link</button></div>
      <div className="card-glow f2">
        <div className="lbl" style={{marginBottom:6}}>Net Worth · All Accounts</div>
        <div style={{fontFamily:"var(--body)",fontSize:32,fontWeight:800,color:"var(--t1)",letterSpacing:"-1.5px",marginBottom:6}}>$47,284</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,paddingTop:12,borderTop:"1px solid rgba(255,255,255,.06)"}}>
          <div><div className="lbl" style={{marginBottom:3}}>Assets</div><div style={{fontFamily:"var(--body)",fontSize:16,fontWeight:800,color:"var(--green)"}}>$6,920</div></div>
          <div><div className="lbl" style={{marginBottom:3}}>Debt</div><div style={{fontFamily:"var(--body)",fontSize:16,fontWeight:800,color:"var(--red)"}}>-$38,400</div></div>
        </div>
      </div>
      {insts.map((inst,i) => (
        <div key={inst.name} className={"card f"+(i+3)} style={{borderColor:inst.status==="warning"?"rgba(245,158,11,.25)":"rgba(34,197,94,.15)"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <div style={{width:40,height:40,borderRadius:13,background:inst.status==="warning"?"var(--ydim)":"var(--gdim)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,position:"relative"}}>
              {inst.icon}
              <div style={{position:"absolute",bottom:-2,right:-2,width:10,height:10,borderRadius:"50%",background:inst.status==="warning"?"var(--gold)":"var(--green)",border:"2px solid var(--bg)"}}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"var(--ui)",fontSize:"var(--f-md)",fontWeight:800,color:"var(--t1)"}}>{inst.name}</div>
              <div style={{fontSize:"var(--f-sm)",color:inst.status==="warning"?"var(--gold)":"var(--green)",fontWeight:600}}>{inst.status==="warning"?"⚠ Needs re-authentication":"● Live · Plaid connected"}</div>
            </div>
          </div>
          {inst.accounts.map((a,j) => (
            <div key={j} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:"1px solid var(--border)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><span>{a.icon}</span><div><div style={{fontSize:"var(--f-base)",fontWeight:600,color:"var(--t1)"}}>{a.name}</div><div className="pill" style={{background:"rgba(255,255,255,.05)",color:"var(--t3)",marginTop:2}}>{a.type}</div></div></div>
              <div style={{fontFamily:"var(--body)",fontSize:"var(--f-md)",fontWeight:800,color:a.c}}>{a.bal}</div>
            </div>
          ))}
          {inst.status==="warning" && <div style={{marginTop:10,padding:"9px 12px",background:"var(--ydim)",border:"1px solid rgba(245,158,11,.2)",borderRadius:11,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:"var(--f-sm)",color:"var(--gold)"}}>Connection needs re-authentication</span><button style={{background:"var(--gold)",border:"none",borderRadius:8,padding:"5px 12px",fontSize:"var(--f-xs)",fontWeight:700,color:"#000",cursor:"pointer",fontFamily:"var(--body)"}}>Fix</button></div>}
        </div>
      ))}
      <div style={{margin:"0 20px 14px",padding:"12px 14px",background:"#040C14",border:"1px solid var(--border)",borderRadius:"var(--r2)"}} className="f7">
        <div className="lbl" style={{marginBottom:6}}>🛡️ Security</div>
        <p style={{fontSize:"var(--f-xs)",color:"var(--t3)",lineHeight:1.7}}>PAI° has read-only access via Plaid. We never store your banking credentials. 256-bit encryption. Disconnect anytime.</p>
      </div>
    </div>
  );
}

function Alerts({ nav }) {
  const [dismissed, setDismissed] = useState([]);
  const items = [
    {id:1,icon:"💳",bg:"var(--rdim)",unread:true,tag:"URGENT",tagC:"var(--red)",title:"Credit Card due in 3 days",body:<>Chase Sapphire minimum of <strong>$135</strong> is due <strong>May 25</strong>.</>,time:"2 hours ago"},
    {id:2,icon:"✦", bg:"var(--adim)",unread:true,tag:"OPPORTUNITY",tagC:"var(--green)",title:"Timing opportunity this cycle",body:<>Internet bill may be able to wait — May 22 paycheck arrives before it's due.</>,time:"3 hours ago"},
    {id:3,icon:"💰",bg:"var(--gdim)",unread:true,tag:"PAYCHECK",tagC:"var(--accent)",title:"Paycheck received — $3,450",body:<>Direct deposit from <strong>Silverhawk Inc.</strong> Your suggested plan is ready.</>,time:"9:04 AM"},
    {id:4,icon:"🍔",bg:"var(--ydim)",unread:false,tag:"SPENDING",tagC:"var(--gold)",title:"Dining 23% over weekly budget",body:<>Spent <strong>$487</strong> vs <strong>$400 budget</strong> this period.</>,time:"Yesterday"},
    {id:5,icon:"✓", bg:"var(--gdim)",unread:false,tag:"VERIFIED",tagC:"var(--green)",title:"Student Loan payment verified",body:<>Plaid confirmed your <strong>$400 payment</strong>. Calendar updated.</>,time:"Yesterday"},
  ];
  const active = items.filter(i => !dismissed.includes(i.id));
  const unread = active.filter(i => i.unread).length;
  return (
    <div>
      <div className="hdr f1">
        <div className="hdr-l"><div className="back" onClick={() => nav("home")}>←</div>
          <div className="pg-title">Alerts {unread>0 && <span style={{marginLeft:8,background:"var(--accent)",color:"#000",fontSize:"var(--f-sm)",fontWeight:800,padding:"2px 8px",borderRadius:20}}>{unread}</span>}</div>
        </div>
        {unread>0 && <span style={{fontSize:"var(--f-sm)",color:"var(--accent)",fontWeight:600,cursor:"pointer"}} onClick={() => setDismissed(items.map(i=>i.id))}>Clear all</span>}
      </div>
      {active.length===0 && <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"60px 24px",textAlign:"center"}}><div style={{fontSize:48,marginBottom:16,opacity:.4}}>🔔</div><div style={{fontFamily:"var(--ui)",fontSize:16,fontWeight:700,color:"var(--t2)",marginBottom:8}}>All caught up</div><div style={{fontSize:"var(--f-sm)",color:"var(--t3)",lineHeight:1.6}}>PAI° will notify you when something needs your attention.</div></div>}
      {active.map((n,i) => (
        <div key={n.id} style={{margin:"0 20px 8px",borderRadius:"var(--r3)",overflow:"hidden",border:"1px solid "+(n.unread?"var(--border2)":"var(--border)"),background:n.unread?"#0D1A1F":"var(--card)",position:"relative"}} className={"f"+(i+3)}>
          {n.unread && <div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",width:3,height:"60%",background:"var(--accent)",borderRadius:"0 3px 3px 0"}}/>}
          <div style={{display:"flex",gap:11,padding:"13px 16px"}}>
            <div style={{width:38,height:38,borderRadius:12,background:n.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{n.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)",marginBottom:3}}>{n.title}</div>
              <div style={{fontSize:"var(--f-sm)",color:"var(--t2)",lineHeight:1.55}}>{n.body}</div>
              <div style={{fontSize:"var(--f-xs)",color:"var(--t3)",marginTop:4}}>{n.time}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
              <div onClick={() => setDismissed(d => [...d,n.id])} style={{width:24,height:24,borderRadius:7,background:"rgba(255,255,255,.04)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"var(--f-sm)",cursor:"pointer",color:"var(--t3)"}}>✕</div>
              <span style={{fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:6,color:n.tagC,background:n.tagC+"1A"}}>{n.tag}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Income({ nav, loaded }) {
  const [projView,  setProjView]  = useState("30");
  const [expanded,  setExpanded]  = useState("Silverhawk Inc.");

  const projData = {
    "30":[{date:"May 22",amt:3450,pct:100,c:"var(--accent)",note:null},{date:"May est.",amt:500,pct:14,c:"var(--gold)",note:"Freelance"}],
    "60":[{date:"May 22",amt:3450,pct:100,c:"var(--accent)",note:null},{date:"May est.",amt:500,pct:14,c:"var(--gold)",note:"Freelance"},{date:"June 5",amt:3450,pct:100,c:"var(--green)",note:"3rd check"},{date:"June 19",amt:3450,pct:100,c:"var(--accent)",note:null}],
    "90":[{date:"May 22",amt:3450,pct:100,c:"var(--accent)",note:null},{date:"May est.",amt:500,pct:14,c:"var(--gold)",note:"Freelance"},{date:"June 5",amt:3450,pct:100,c:"var(--green)",note:"3rd check"},{date:"June 19",amt:3450,pct:100,c:"var(--accent)",note:null},{date:"July 3",amt:3450,pct:100,c:"var(--accent)",note:null},{date:"July est.",amt:600,pct:17,c:"var(--gold)",note:"Freelance"}],
  };

  const sources = [
    {name:"Silverhawk Inc.",type:"Employment",freq:"Bi-weekly",amount:3450,source:"plaid",schedule:"Every other Thursday",next:"May 22",account:"Chase ••3847",history:["May 8 · $3,450","Apr 24 · $3,450","Apr 10 · $3,450"]},
    {name:"Freelance Work",type:"Variable",  freq:"Variable", amount:750, source:"manual",schedule:"Project-based",       next:"Varies", account:"Chase ••3847",history:["May 3 · $500","Apr 15 · $250"]},
  ];

  return (
    <div>
      <div className="hdr f1"><div className="hdr-l"><div className="back" onClick={() => nav("home")}>←</div><div className="pg-title">Income Manager</div></div><button style={{background:"var(--accent)",border:"none",borderRadius:11,padding:"8px 14px",fontSize:"var(--f-sm)",fontWeight:700,color:"#000",cursor:"pointer",fontFamily:"var(--body)"}}>+ Add Source</button></div>

      <div style={{display:"flex",gap:10,padding:"0 20px 14px",overflow:"auto",scrollbarWidth:"none"}} className="f2">
        {[["2","Sources","var(--t1)"],["$3,450","Per Check","var(--accent)"],["$7,650","This Month","var(--green)"],["May 22","Next Check","var(--gold)"]].map(([v,l,c]) => (
          <div key={l} style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"var(--r2)",padding:"11px 14px",flexShrink:0,minWidth:90}}>
            <div className="lbl" style={{marginBottom:4}}>{l}</div>
            <div style={{fontFamily:"var(--body)",fontSize:"var(--f-xl)",fontWeight:800,color:c,letterSpacing:"-.5px"}}>{v}</div>
          </div>
        ))}
      </div>

      <div className="card-glow f3">
        <div className="lbl" style={{marginBottom:8}}>Next Paycheck</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <div style={{fontFamily:"var(--body)",fontSize:"var(--f-xl)",fontWeight:800,color:"var(--t1)",marginBottom:3}}>Thursday, May 22</div>
            <div style={{fontSize:"var(--f-sm)",color:"var(--t3)"}}>Silverhawk Inc. · Chase ••3847</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"var(--body)",fontSize:30,fontWeight:800,color:"var(--t1)",letterSpacing:"-1.5px"}}>$3,450</div>
            <div style={{fontSize:"var(--f-xs)",color:"var(--t3)",marginTop:2}}>Net take-home</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:"rgba(24,199,161,.06)",borderRadius:12}}>
          <span>⏱</span>
          <span style={{fontSize:"var(--f-sm)",color:"var(--t2)",flex:1}}>PAI° will suggest a plan when this deposit arrives.</span>
          <span style={{fontFamily:"var(--body)",fontSize:16,fontWeight:800,color:"var(--accent)"}}>14d</span>
        </div>
      </div>

      {sources.map((s,i) => {
        const isEx = expanded===s.name;
        return (
          <div key={s.name} className={"card f"+(i+4)} style={{cursor:"pointer",borderColor:isEx?"var(--border2)":"var(--border)"}} onClick={() => setExpanded(isEx?null:s.name)}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:42,height:42,borderRadius:14,background:s.source==="plaid"?"var(--adim)":"var(--ydim)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                {s.source==="plaid"?"💼":"💻"}
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"var(--ui)",fontSize:"var(--f-md)",fontWeight:800,color:"var(--t1)",marginBottom:3}}>{s.name}</div>
                <div style={{display:"flex",gap:7}}>
                  <span className="pill" style={{background:"var(--adim)",color:"var(--accent)"}}>{s.freq}</span>
                  <span className="pill" style={{background:s.source==="plaid"?"var(--bdim)":"var(--ydim)",color:s.source==="plaid"?"var(--blue)":"var(--gold)"}}>{s.type}</span>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"var(--body)",fontSize:17,fontWeight:800,color:"var(--t1)"}}>${s.amount.toLocaleString()}</div>
                <div style={{fontSize:"var(--f-xs)",color:"var(--t3)",marginTop:2}}>per check</div>
              </div>
            </div>
            {isEx && (
              <div style={{marginTop:12,borderTop:"1px solid var(--border)",paddingTop:12}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
                  {[["Schedule",s.schedule],["Next Pay",s.next],["Account",s.account]].map(([k,v]) => (
                    <div key={k} style={{padding:"8px 10px",background:"rgba(255,255,255,.03)",borderRadius:10}}>
                      <div className="lbl" style={{marginBottom:2}}>{k}</div>
                      <div style={{fontSize:"var(--f-sm)",fontWeight:700,color:"var(--t1)"}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div className="lbl" style={{marginBottom:8}}>Recent Deposits</div>
                {s.history.map((h,j) => (
                  <div key={j} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:j<s.history.length-1?"1px solid rgba(255,255,255,.04)":"none"}}>
                    <span style={{fontSize:"var(--f-sm)",color:"var(--t2)"}}>{h.split("·")[0]}</span>
                    <span style={{fontFamily:"var(--body)",fontSize:"var(--f-sm)",fontWeight:700,color:"var(--green)"}}>{h.split("·")[1]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="card f6">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontFamily:"var(--ui)",fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)"}}>Income Projection</div>
          <div style={{display:"flex",gap:0,background:"var(--card2)",borderRadius:9,padding:2}}>
            {["30","60","90"].map(v => <div key={v} style={{padding:"5px 10px",borderRadius:8,fontSize:"var(--f-xs)",fontWeight:700,cursor:"pointer",color:projView===v?"#000":"var(--t3)",background:projView===v?"var(--accent)":"transparent",fontFamily:"var(--body)",transition:"all .15s"}} onClick={() => setProjView(v)}>{v}d</div>)}
          </div>
        </div>
        {projData[projView].map((p,i) => (
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{fontSize:"var(--f-sm)",fontWeight:600,color:"var(--t2)",width:68,flexShrink:0}}>{p.date}</div>
            <div style={{flex:1,height:4,background:"rgba(255,255,255,.05)",borderRadius:4,overflow:"hidden"}}><div style={{width:loaded?p.pct+"%":"0%",height:"100%",background:p.c,borderRadius:4,transition:"width 1.2s ease"}}/></div>
            <div style={{fontFamily:"var(--body)",fontSize:"var(--f-sm)",fontWeight:800,color:p.c,width:46,textAlign:"right"}}>${(p.amt/1000).toFixed(1)}k</div>
            {p.note && <span style={{fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:6,background:p.c==="var(--gold)"?"var(--ydim)":"var(--gdim)",color:p.c,whiteSpace:"nowrap"}}>{p.note}</span>}
          </div>
        ))}
        <div style={{marginTop:8,fontSize:"var(--f-xs)",color:"var(--t3)",lineHeight:1.6}}>Teal = confirmed · Green = 3rd check month · Gold = variable estimate</div>
      </div>

      <div className="ai-note f7">
        <div className="ai-lbl">PAI° Insight</div>
        <p className="ai-txt"><strong>June 5 is a 3rd check month</strong> — no major bills due before July 1 that are not already funded. Consider directing that paycheck toward credit card debt or your Down Payment goal.</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   LANDING
═══════════════════════════════════════ */
function Landing({ nav }) {
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",top:"-80px",left:"50%",transform:"translateX(-50%)",width:"500px",height:"500px",background:"radial-gradient(circle,rgba(24,199,161,.06) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{padding:"52px 24px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontFamily:"var(--ui)",fontSize:20,fontWeight:800,color:"var(--t1)"}}>PAI<span style={{color:"var(--accent)"}}>°</span></div>
        <button onClick={() => nav("onboarding")} style={{background:"none",border:"1px solid var(--border)",borderRadius:10,padding:"7px 14px",fontSize:12,fontWeight:600,color:"var(--t2)",cursor:"pointer",fontFamily:"var(--body)"}}>Sign In</button>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px 20px",textAlign:"center"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:7,background:"var(--adim)",border:"1px solid rgba(24,199,161,.25)",borderRadius:20,padding:"6px 16px",marginBottom:20}} className="f1">
          <div style={{width:6,height:6,borderRadius:"50%",background:"var(--accent)",animation:"fdot 2s ease-in-out infinite"}}/>
          <span style={{fontSize:11,fontWeight:700,color:"var(--accent)",letterSpacing:".5px"}}>EARLY ACCESS OPEN</span>
        </div>

        {/* THE HOOK — timing problem first */}
        <p style={{fontSize:16,color:"var(--t2)",lineHeight:1.65,marginBottom:8,maxWidth:300}} className="f2">
          Most people don't have a spending problem.<br/>
          <strong style={{color:"var(--t1)"}}>They have a timing problem.</strong>
        </p>
        <p style={{fontSize:14,color:"var(--t3)",lineHeight:1.65,marginBottom:16,maxWidth:300}} className="f2">
          You're probably not bad with money. Your paycheck just doesn't always line up with your bills.
        </p>

        <h1 style={{fontFamily:"var(--ui)",fontSize:40,fontWeight:800,letterSpacing:"-2px",lineHeight:1.08,marginBottom:14,color:"var(--t1)"}} className="f3">
          Make Your<br/><span style={{color:"var(--accent)"}}>Paycheck Smarter.</span>
        </h1>

        <p style={{fontSize:14,color:"var(--t3)",lineHeight:1.7,marginBottom:10,maxWidth:300}} className="f3">
          Bills, paychecks, debts, and subscriptions rarely line up. PAI° ONE maps your paycheck to your real obligations — and shows you exactly what to pay, what may be able to wait, and what appears safe to spend.
        </p>
        <p style={{fontSize:13,color:"var(--t3)",marginBottom:28,maxWidth:280}} className="f3">No spreadsheets. No guesswork. No micromanaging.</p>

        <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:320}} className="f4">
          <button onClick={() => nav("onboarding")} className="pbtn">Get Started — It's Free →</button>
          <button onClick={() => nav("home")} className="sbtn">Explore the demo first</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"0 24px 40px"}} className="f5">
        {[["📅","Bills mapped to your exact paycheck"],["💚","Know what's safe to spend before you spend it"],["📉","Debt prioritized by what costs you most"],["✓","Every action requires your approval"]].map(([v,l]) => (
          <div key={l} style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,padding:"14px 12px",textAlign:"center"}}>
            <div style={{fontFamily:"var(--body)",fontSize:22,fontWeight:800,color:"var(--accent)",marginBottom:4}}>{v}</div>
            <div style={{fontSize:"var(--f-xs)",color:"var(--t3)",fontWeight:600,lineHeight:1.4}}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ONBOARDING
═══════════════════════════════════════ */
function Onboarding({ nav }) {
  const [step,    setStep]   = useState("welcome");
  const [name,    setName]   = useState("");
  const [inp,     setInp]    = useState("");
  const [goals,   setGoals]  = useState([]);
  const [buffer,  setBuffer] = useState("balanced");
  const [plaid,   setPlaid]  = useState(false);

  const STEPS = ["welcome","income","goals","connect","debts","buffer","plan","ready"];
  const idx   = STEPS.indexOf(step);
  const pct   = Math.round((idx / (STEPS.length-1)) * 100);

  const GOAL_OPTS = [["🏠","Down Payment"],["💳","Pay Off Debt"],["🏖️","Emergency Fund"],["✈️","Travel"],["🎓","Education"],["📈","Save More"]];
  const BUF_OPTS  = [{k:"conservative",l:"Conservative",a:"$500",d:"More protection"},{k:"balanced",l:"Balanced",a:"$250",d:"Good middle ground"},{k:"flexible",l:"Flexible",a:"$100",d:"More flexibility"}];

  const go = (s) => setStep(s);

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:"var(--bg)"}}>
      {step!=="welcome" && step!=="ready" && (
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"52px 20px 20px",flexShrink:0}}>
          <button onClick={() => idx>0 && go(STEPS[idx-1])} style={{background:"none",border:"none",fontSize:18,color:"var(--t3)",cursor:"pointer",padding:"4px 8px",fontFamily:"var(--body)"}}>←</button>
          <div style={{flex:1,height:3,background:"rgba(255,255,255,.05)",borderRadius:3,overflow:"hidden"}}>
            <div style={{height:"100%",background:"linear-gradient(90deg,var(--accent),#3AA8FF)",borderRadius:3,width:pct+"%",transition:"width .5s ease"}}/>
          </div>
          <span style={{fontSize:"var(--f-xs)",color:"var(--t3)",fontWeight:600}}>{pct}%</span>
        </div>
      )}
      {(step==="welcome"||step==="ready") && <div style={{paddingTop:52}}/>}

      <div style={{flex:1,overflowY:"auto",scrollbarWidth:"none",paddingBottom:40}}>

        {step==="welcome" && (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",textAlign:"center",minHeight:"80vh"}}>
            <h1 style={{fontFamily:"var(--ui)",fontSize:38,fontWeight:800,color:"var(--t1)",letterSpacing:"-1.5px",lineHeight:1.1,marginBottom:16}}>Make Your<br/><span style={{color:"var(--accent)"}}>Paycheck Smarter.</span></h1>
            <p style={{fontSize:15,color:"var(--t2)",lineHeight:1.7,marginBottom:12,maxWidth:300}}>PAI° ONE helps you understand what to pay, what may be able to wait, and what appears safe to spend — one paycheck at a time.</p>
            <div style={{fontSize:"var(--f-sm)",color:"var(--t3)",marginBottom:32}}>Takes about 3 minutes to set up.</div>
            <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:320}}>
              <button onClick={() => go("income")} className="pbtn">Get Started →</button>
              <button onClick={() => nav("home")} className="sbtn">Skip — explore first</button>
            </div>
          </div>
        )}

        {step==="income" && (
          <div style={{padding:"0 24px"}}>
            <div style={{fontFamily:"var(--ui)",fontSize:22,fontWeight:800,color:"var(--t1)",letterSpacing:"-.5px",marginBottom:8}}>Your paycheck details</div>
            <p style={{fontSize:"var(--f-sm)",color:"var(--t3)",marginBottom:24,lineHeight:1.6}}>PAI° uses your paycheck dates and amount to build your plan. Accurate dates matter most.</p>
            <div className="fl">Your Name</div>
            <input className="fi" placeholder="First name" value={inp} onChange={e => setInp(e.target.value)}/>
            <div className="fl">Pay Frequency</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
              {[["Bi-weekly","Every 2 weeks"],["Semi-monthly","1st & 15th"],["Weekly","Every week"],["Monthly","Once a month"]].map(([f,d]) => (
                <div key={f} style={{padding:"11px 12px",borderRadius:12,border:"1.5px solid var(--border)",background:"var(--card)",cursor:"pointer"}}>
                  <div style={{fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)",marginBottom:2}}>{f}</div>
                  <div style={{fontSize:"var(--f-xs)",color:"var(--t3)"}}>{d}</div>
                </div>
              ))}
            </div>
            <div className="fl">Approx. Take-Home Per Paycheck</div>
            <input className="fi" placeholder="e.g. $2,800"/>
            <button onClick={() => {setName(inp||"there");go("goals");}} className="pbtn">Continue →</button>
          </div>
        )}

        {step==="goals" && (
          <div style={{padding:"0 24px"}}>
            <div style={{fontFamily:"var(--ui)",fontSize:22,fontWeight:800,color:"var(--t1)",letterSpacing:"-.5px",marginBottom:8}}>What matters most to you?</div>
            <p style={{fontSize:"var(--f-sm)",color:"var(--t3)",marginBottom:20,lineHeight:1.6}}>Select your top financial goals. PAI° will factor these into your paycheck plan.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
              {GOAL_OPTS.map(([ic,nm]) => (
                <div key={nm} onClick={() => setGoals(g => g.includes(nm)?g.filter(x=>x!==nm):[...g,nm])} style={{padding:"14px 12px",borderRadius:14,border:goals.includes(nm)?"1.5px solid var(--accent)":"1.5px solid var(--border)",background:goals.includes(nm)?"var(--adim)":"var(--card)",cursor:"pointer",textAlign:"center",transition:"all .15s"}}>
                  <div style={{fontSize:22,marginBottom:6}}>{ic}</div>
                  <div style={{fontSize:"var(--f-sm)",fontWeight:700,color:goals.includes(nm)?"var(--accent)":"var(--t2)"}}>{nm}</div>
                </div>
              ))}
            </div>
            <button onClick={() => go("connect")} disabled={goals.length===0} className="pbtn" style={{opacity:goals.length>0?1:.4,cursor:goals.length>0?"pointer":"not-allowed"}}>
              {goals.length>0?"Continue with "+goals.length+" goal"+(goals.length>1?"s":"")+" →":"Select at least one goal"}
            </button>
          </div>
        )}

        {step==="connect" && (
          <div style={{padding:"0 24px"}}>
            <div style={{fontFamily:"var(--ui)",fontSize:22,fontWeight:800,color:"var(--t1)",letterSpacing:"-.5px",marginBottom:8}}>Connect your accounts</div>
            <p style={{fontSize:"var(--f-sm)",color:"var(--t3)",marginBottom:20,lineHeight:1.6}}>PAI° uses Plaid to read your balances and detect recurring bills. Read-only — PAI° cannot move money.</p>
            {!plaid ? (
              <>
                <div style={{background:"linear-gradient(135deg,#071A18,#091C2A)",border:"1px solid rgba(24,199,161,.2)",borderRadius:16,padding:16,marginBottom:14}}>
                  {[["🏦","Chase Bank"],["🔵","Citi Bank"],["🏛️","Wells Fargo"]].map(([ic,n]) => (
                    <div key={n} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 12px",background:"rgba(255,255,255,.03)",borderRadius:11,marginBottom:8,cursor:"pointer",border:"1px solid var(--border)"}}>
                      <span style={{fontSize:18}}>{ic}</span>
                      <span style={{fontSize:"var(--f-base)",fontWeight:600,color:"var(--t2)"}}>{n}</span>
                      <span style={{marginLeft:"auto",fontSize:"var(--f-sm)",color:"var(--accent)",fontWeight:600}}>Connect →</span>
                    </div>
                  ))}
                  <button onClick={() => {setPlaid(true);go("debts");}} className="pbtn" style={{marginTop:4}}>Connect with Plaid →</button>
                </div>
                <button onClick={() => go("debts")} className="sbtn">Enter manually instead</button>
              </>
            ) : (
              <div style={{padding:"20px",background:"var(--gdim)",border:"1px solid rgba(34,197,94,.25)",borderRadius:16,marginBottom:20,textAlign:"center"}}>
                <div style={{fontSize:28,marginBottom:8}}>✓</div>
                <div style={{fontFamily:"var(--ui)",fontSize:16,fontWeight:700,color:"var(--green)",marginBottom:4}}>Accounts Connected</div>
                <div style={{fontSize:"var(--f-sm)",color:"var(--t2)"}}>PAI° detected your income and recurring bills.</div>
                <button onClick={() => go("debts")} className="pbtn" style={{marginTop:16}}>Continue →</button>
              </div>
            )}
            <div style={{marginTop:10,padding:"10px 12px",background:"#040C14",border:"1px solid rgba(255,255,255,.04)",borderRadius:12}}>
              <p style={{fontSize:"var(--f-xs)",color:"var(--t3)",lineHeight:1.65}}>🔒 PAI° can see your account — it cannot touch it, move it, or do anything with it. Ever. Read-only access via Plaid. Your credentials are never stored by PAI°.</p>
            </div>
          </div>
        )}

        {step==="debts" && (
          <div style={{padding:"0 24px"}}>
            <div style={{fontFamily:"var(--ui)",fontSize:22,fontWeight:800,color:"var(--t1)",letterSpacing:"-.5px",marginBottom:8}}>Let's factor in what you owe</div>
            <p style={{fontSize:"var(--f-sm)",color:"var(--t3)",marginBottom:20,lineHeight:1.6}}>No judgment here — this helps PAI° suggest which payments may be worth prioritizing and which can wait.</p>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
              {[["💳","Credit Cards","High interest — often worth prioritizing"],["🎓","Student Loans","Fixed payments — easy to plan around"],["🚗","Auto Loan","Fixed monthly, tied to your paycheck"],["🏠","Mortgage / Rent","Your biggest fixed obligation"],["📋","Other Loans","Personal, medical, or other debt"]].map(([ic,n,d]) => (
                <div key={n} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,cursor:"pointer"}}>
                  <span style={{fontSize:18}}>{ic}</span>
                  <div style={{flex:1}}><div style={{fontSize:"var(--f-base)",fontWeight:700,color:"var(--t1)"}}>{n}</div><div style={{fontSize:"var(--f-xs)",color:"var(--t3)",marginTop:1}}>{d}</div></div>
                  <div style={{width:20,height:20,borderRadius:6,border:"1.5px solid var(--border)",background:"var(--card2)"}}/>
                </div>
              ))}
            </div>
            <button onClick={() => go("buffer")} className="pbtn" style={{marginBottom:10}}>Continue →</button>
            <button onClick={() => go("buffer")} className="sbtn">I'll add this after setup</button>
          </div>
        )}

        {step==="buffer" && (
          <div style={{padding:"0 24px"}}>
            <div style={{fontFamily:"var(--ui)",fontSize:22,fontWeight:800,color:"var(--t1)",letterSpacing:"-.5px",marginBottom:8}}>Choose your cash buffer</div>
            <p style={{fontSize:"var(--f-sm)",color:"var(--t3)",marginBottom:20,lineHeight:1.6}}>PAI° will always protect this amount before suggesting where to direct extra money.</p>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
              {BUF_OPTS.map(opt => (
                <div key={opt.k} onClick={() => setBuffer(opt.k)} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 14px",background:buffer===opt.k?"var(--adim)":"var(--card)",border:buffer===opt.k?"1.5px solid var(--accent)":"1.5px solid var(--border)",borderRadius:14,cursor:"pointer",transition:"all .15s"}}>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"var(--ui)",fontSize:"var(--f-md)",fontWeight:800,color:buffer===opt.k?"var(--accent)":"var(--t1)",marginBottom:2}}>{opt.l}</div>
                    <div style={{fontSize:"var(--f-xs)",color:"var(--t3)"}}>{opt.d}</div>
                  </div>
                  <div style={{fontFamily:"var(--body)",fontSize:18,fontWeight:800,color:buffer===opt.k?"var(--accent)":"var(--t2)"}}>{opt.a}</div>
                  <div style={{width:20,height:20,borderRadius:"50%",border:"2px solid",borderColor:buffer===opt.k?"var(--accent)":"var(--border)",background:buffer===opt.k?"var(--accent)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {buffer===opt.k && <div style={{width:8,height:8,borderRadius:"50%",background:"#000"}}/>}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => go("plan")} className="pbtn">Build My Plan →</button>
          </div>
        )}

        {step==="plan" && (
          <div style={{padding:"0 24px"}}>
            <div style={{fontFamily:"var(--ui)",fontSize:22,fontWeight:800,color:"var(--t1)",letterSpacing:"-.5px",marginBottom:4}}>Here's your starting plan</div>
            <p style={{fontSize:"var(--f-sm)",color:"var(--t3)",marginBottom:20,lineHeight:1.6}}>Based on what you've shared, PAI° built this suggested plan for your next paycheck.</p>
            <div style={{background:"linear-gradient(135deg,#071A18,#091C2A)",border:"1px solid rgba(24,199,161,.2)",borderRadius:18,padding:18,marginBottom:14}}>
              <div className="lbl" style={{marginBottom:12}}>Suggested Plan · $3,450</div>
              {[{l:"Bills to cover",a:"$1,380",c:"var(--accent)",p:40,note:"Rent, utilities, internet"},{l:"Debt payments",a:"$690",c:"var(--blue)",p:20,note:"Minimums + priority"},{l:"Toward goals",a:"$518",c:"var(--gold)",p:15,note:"Based on your selections"},{l:"Estimated safe spend",a:"$620",c:"var(--green)",p:18,note:"After bills, debt, buffer"},{l:"Cash buffer",a:"$242",c:"var(--t3)",p:7,note:"Protected — not for spending"}].map(r => (
                <div key={r.l} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <div><span style={{fontSize:"var(--f-base)",fontWeight:600,color:"var(--t1)"}}>{r.l}</span><span style={{fontSize:"var(--f-xs)",color:"var(--t3)",marginLeft:8}}>{r.note}</span></div>
                    <span style={{fontFamily:"var(--body)",fontSize:"var(--f-base)",fontWeight:800,color:r.c}}>{r.a}</span>
                  </div>
                  <div style={{height:3,background:"rgba(255,255,255,.05)",borderRadius:3,overflow:"hidden"}}><div style={{width:r.p+"%",height:"100%",background:r.c,borderRadius:3}}/></div>
                </div>
              ))}
            </div>
            <div style={{padding:"11px 13px",background:"rgba(255,255,255,.03)",border:"1px solid var(--border)",borderRadius:12,marginBottom:20,fontSize:"var(--f-xs)",color:"var(--t3)",lineHeight:1.65}}>This plan is a starting point. PAI° will refine it as your data updates.</div>
            <button onClick={() => go("ready")} className="pbtn" style={{marginBottom:10}}>This Looks Right →</button>
            <button onClick={() => go("ready")} className="sbtn">I'll adjust this later</button>
          </div>
        )}

        {step==="ready" && (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",textAlign:"center",minHeight:"80vh"}}>
            <div style={{fontSize:52,marginBottom:16}}>✦</div>
            <div style={{fontFamily:"var(--ui)",fontSize:26,fontWeight:800,color:"var(--t1)",letterSpacing:"-1px",marginBottom:12}}>Your plan is ready{name&&name!=="there"?", "+name.split(" ")[0]:""}.</div>
            <p style={{fontSize:15,color:"var(--t2)",lineHeight:1.7,marginBottom:32,maxWidth:300}}>PAI° will show you what to pay, what may be able to wait, and what appears safe to spend — every paycheck.</p>
            <button onClick={() => nav("home")} style={{width:"100%",maxWidth:320,background:"linear-gradient(135deg,var(--accent),#3AA8FF)",border:"none",borderRadius:14,padding:"16px",fontFamily:"var(--ui)",fontSize:15,fontWeight:800,color:"#fff",cursor:"pointer",boxShadow:"0 8px 24px rgba(24,199,161,.25)"}}>
              Open My Command Center →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN APP
═══════════════════════════════════════ */
const MENU_ITEMS = [
  {id:"bills",   icon:"🗓️",bg:"var(--ydim)",  label:"Bills",    desc:"Manage & confirm"},
  {id:"debt",    icon:"📉",bg:"var(--rdim)",  label:"Debt",     desc:"Payoff strategy"},
  {id:"goals",   icon:"🎯",bg:"var(--adim)",  label:"Goals",    desc:"Track progress"},
  {id:"income",  icon:"💼",bg:"var(--pdim)",  label:"Income",   desc:"Paycheck sources"},
  {id:"accounts",icon:"🏦",bg:"var(--bdim)",  label:"Accounts", desc:"Linked banks"},
  {id:"alerts",  icon:"🔔",bg:"var(--card2)", label:"Notifications",desc:"Alerts & updates"},
  {id:"settings",icon:"⚙️",bg:"var(--card2)", label:"Settings", desc:"Profile & prefs"},
];

const NAV = [
  {id:"home",    icon:"🏠", label:"Home"},
  {id:"actions", icon:"✓",  label:"Actions"},
  {center:true},
  {id:"mflow",   icon:"💸", label:"Money Flow"},
  {id:"progress",icon:"📈", label:"Progress"},
];

export default function App() {
  const [screen,   setScreen]   = useState("landing");
  const [history,  setHistory]  = useState([]);
  const [dir,      setDir]      = useState("fwd");
  const [loaded,   setLoaded]   = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 150); }, []);

  const nav = (to) => {
    if (to===screen) return;
    setDir("fwd");
    setHistory(h => [...h, screen]);
    setScreen(to);
    setLoaded(false);
    setTimeout(() => setLoaded(true), 100);
    setShowMenu(false);
  };

  const goBack = () => {
    if (!history.length) return;
    setDir("bk");
    const prev = history[history.length-1];
    setHistory(h => h.slice(0,-1));
    setScreen(prev);
    setLoaded(false);
    setTimeout(() => setLoaded(true), 100);
  };

  const props = { nav, goBack, loaded };

  const screens = {
    landing:    <Landing    {...props}/>,
    onboarding: <Onboarding {...props}/>,
    home:       <Home       {...props}/>,
    actions:    <Actions    {...props}/>,
    mflow:      <MoneyFlow  {...props}/>,
    progress:   <Progress   {...props}/>,
    bills:      <Bills      {...props}/>,
    debt:       <Debt       {...props}/>,
    goals:      <Goals      {...props}/>,
    income:     <Income     {...props}/>,
    accounts:   <Accounts   {...props}/>,
    alerts:     <Alerts     {...props}/>,
    settings:   <Settings   {...props}/>,
  };

  const showNav   = !["landing","onboarding"].includes(screen);
  const showFloat = !["landing","onboarding"].includes(screen);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>
      <div className="app">
        <div className={"sw "+(dir==="fwd"?"sfwd":"sbk")}>
          {screens[screen] || screens.home}
        </div>

        {/* Floating PAI° */}
        {showFloat && <FloatingPAI screen={screen}/>}

        {/* Center Menu Sheet */}
        {showMenu && (
          <div className="overlay">
            <div className="bdrop" onClick={() => setShowMenu(false)}/>
            <div className="sheet">
              <div className="sh-handle"/>
              <div className="sh-hdr">
                <div className="sh-title">PAI° ONE</div>
                <div style={{fontSize:"var(--f-sm)",color:"var(--t3)",marginTop:3}}>Where do you want to go?</div>
              </div>
              <div className="menu-grid">
                {MENU_ITEMS.map(item => (
                  <div key={item.id} className="mi" onClick={() => nav(item.id)}>
                    <div className="mi-ic" style={{background:item.bg}}>{item.icon}</div>
                    <div className="mi-l">{item.label}</div>
                    <div className="mi-d">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Nav */}
        {showNav && (
          <div className="bnav">
            {NAV.map((n,i) =>
              n.center ? (
                <div key={i} className="nc" onClick={() => setShowMenu(!showMenu)}>⊞</div>
              ) : (
                <div key={i} className={"ni "+(screen===n.id?"active":"")} onClick={() => nav(n.id)}>
                  <span className="ni-i">{n.icon}</span>
                  <span className="ni-l">{n.label}</span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </>
  );
}
