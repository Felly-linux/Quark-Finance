// Quark Finance — screens.jsx
const ARTBOARD_W = 1440;
const ARTBOARD_H = 900;

function getQuarkResp(msg) {
  const m = msg.toLowerCase();
  if (/food|eat|restaurant|coffee|delivery|streak/.test(m))
    return '+38% vs 12-week median. 3 events: $184 Sushi Norte (Sat), $96 Mercado del Río, $72 delivery (Wed–Thu). Remove Sat dinner → back to baseline. Confidence 0.91.';
  if (/invest|dca|index|etf|stock|portfolio|vti|voo|splg|bond/.test(m))
    return 'Reallocating $110/mo to VTI DCA over 10y → P10 +$14.2k · P50 +$24.8k · P90 +$38.4k. 7.0% CAGR, 0.03% ER, monthly DCA, taxable. 10k Monte Carlo paths.';
  if (/forecast|predict|future|project|twin/.test(m))
    return 'Twin P50: $294,820 by Nov 2029. Key levers: DCA (r=0.88), savings rate (r=0.92 with goal). Specify a scenario to model.';
  if (/loan|refi|refinanc|mortgage|rate|interest/.test(m))
    return 'Loan #2 — +95bps at Q3 reset if Fed pauses → +$310/mo. Window closes in 22 days. Fix at 4.9% → saves $84/mo over 48mo.';
  if (/goal|house|home|down.?payment|saving/.test(m))
    return 'Down payment 71% complete ($35,500 / $50,000). At current $3,840/mo net → Jul 2026, 4 weeks ahead of plan.';
  if (/subscription|sub|streaming|cancel|zombie/.test(m))
    return '3 low-usage subs: cloud 2TB 14m unused ($120/mo), streaming overlap ($48/mo), gym ($29/mo). Recoverable: $197/mo.';
  if (/retire|retirement|fire|quit|financial.?independence/.test(m))
    return 'Retire-by-58 probability: 87%. Add $200/mo to DCA → 94%, timeline shifts to age 56.';
  if (/rent|housing|apartment/.test(m))
    return 'Salary Dec 1, rent Dec 5. Buffer: $3,184. Tightest day Nov 28. P(make rent) = 0.97.';
  if (/stress|mood|sleep/.test(m))
    return 'Stress index 0.62 (elevated). Top drivers: subscription count, delivery on low-sleep nights. Automate bills to reduce decision fatigue.';
  if (/salary|income|earn|pay|wage/.test(m))
    return 'Gross $8,400/mo → net ~$6,290/mo. Real hourly ~$46/h. With freelance: $9,600/mo total.';
  if (/budget|allocat|split/.test(m))
    return 'Surplus $3,840/mo. Recommend: shift 25% to HYSA (4.6% APY → +$47.5/mo passive).';
  return 'Analyzed 90d history — no strong signal for that query. Try /forecast, /explain, or /audit.';
}

// ─────────────────────────────────────────────────────────────
// Shared shell wrapper
// ─────────────────────────────────────────────────────────────
function QShell({ active, children, topbarProps }) {
  return (
    <div className="q-app" style={{
      width: ARTBOARD_W, height: ARTBOARD_H,
      display: 'flex', position: 'relative', overflow: 'hidden',
      background: 'var(--q-bg-0)',
    }}>
      <QAmbient intensity={1} />
      <QParticles count={28} />
      <QSidebar active={active} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2, minWidth: 0 }}>
        <QTopbar {...topbarProps} />
        <div style={{ flex: 1, padding: '20px 24px', overflow: 'hidden', position: 'relative' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. DASHBOARD
// ─────────────────────────────────────────────────────────────
function ScreenDashboard() {
  const tr = (typeof window.useTr === 'function') ? window.useTr() : (s)=>s;
  const [range, setRange] = React.useState('1Y');
  const nwAll = [82,84,83,86,89,88,92,94,93,97,101,100,104,108,112,116,121,125,131,136,140,144,148,153,158,162,167,172];
  const sliceMap = { '1M': 4, '3M': 13, '6M': 18, '1Y': 24, 'ALL': 99 };
  const nwPoints = nwAll.slice(-Math.min(nwAll.length, sliceMap[range]));
  const sparkA = [3,4,4,5,5,6,7,7,8,9,10,11];
  const sparkB = [12,11,13,12,14,15,14,16,17,16,18,19];
  const sparkD = [4,5,4,5,4,3,4,3,4,5,3,4];
  const nav = (s) => window.__qNav && window.__qNav(s);

  return (
    <QShell active="dashboard" topbarProps={{
      breadcrumb: 'WORKSPACE / OVERVIEW',
      title: 'Good evening, Mateo',
      subtitle: 'Quark synthesized 14 signals while you were away',
      actions: <>
        <button className="q-btn q-btn-ghost" onClick={() => nav('wallets')}><QIcon name="plus" size={12}/> {tr('Connect')}</button>
        <button className="q-btn" onClick={() => nav('copilot')}><QIcon name="sparkle" size={12}/> {tr('Ask Quark')}</button>
      </>,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, minHeight: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <QKpi label="Net worth" value="$172,480" delta="+4.8%" deltaLabel="vs last 30d" accent="violet"
              sparkline={<QSparkline points={nwPoints.slice(-12)} color="#C084FF" />} />
            <QKpi label="Liquid · USD" value="$48,310" delta="+1.2%" deltaLabel="last 7d" accent="cyan"
              sparkline={<QSparkline points={sparkA} color="#6DF3FF" />} />
            <QKpi label="Cash flow / mo" value="+$3,840" delta="+12%" deltaLabel="vs avg" accent="emerald"
              sparkline={<QSparkline points={sparkB} color="#4ADE9B" />} />
            <QKpi label="Burn rate" value="$6,290" delta="-3.4%" deltaLabel="↓ improving" accent="pink"
              sparkline={<QSparkline points={sparkD} color="#FF7AE6" />} />
          </div>

          <div className="q-card q-card-elev" style={{ padding: 18, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div className="q-eyebrow q-eyebrow-violet">{tr('PATRIMONY · WITH FORECAST')}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4 }}>
                  <span className="q-num" style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.025em' }}>$172,480</span>
                  <span className="q-mono q-num" style={{ fontSize: 12, color: 'var(--q-accent-emerald)' }}>+ $7,920 / 30d</span>
                  <span style={{ fontSize: 11, color: 'var(--q-text-3)' }}>USD · @ now</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {['1M','3M','6M','1Y','ALL'].map(t => (
                  <button key={t} onClick={() => setRange(t)} className="q-btn q-btn-ghost"
                    style={{ padding: '4px 10px', fontSize: 11,
                      background: range === t ? 'rgba(157,77,255,0.18)' : 'transparent',
                      borderColor: range === t ? 'var(--q-stroke-3)' : 'var(--q-stroke-1)',
                      color: range === t ? 'var(--q-violet-300)' : 'var(--q-text-3)',
                    }}>{t}</button>
                ))}
              </div>
            </div>
            <QNetWorthChart points={nwPoints} height={180} forecastFrom={0.65} />
            <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 10, color: 'var(--q-text-3)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 2, background: '#9D4DFF' }}/>{tr('Real')}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 1, background: '#6DF3FF', borderTop: '1px dashed #6DF3FF' }}/>{tr('Quark forecast (P50)')}</span>
              <span style={{ marginLeft: 'auto' }} className="q-mono">σ = 4.2% · n={nwPoints.length}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12, flex: 1, minHeight: 0 }}>
            <div className="q-card q-card-elev" style={{ padding: 16, display: 'flex', flexDirection: 'column' }}>
              <QSectionHead eyebrow="MONTHLY FLOW" title={tr('Sources → Destinations')} ai
                action={<span className="q-mono q-num" style={{ fontSize: 11, color: 'var(--q-text-3)' }}>NOV · $10,970 in</span>} />
              <div style={{ flex: 1, minHeight: 0 }}><QCashFlowSankey height={220} /></div>
            </div>
            <div className="q-card q-card-elev" style={{ padding: 16, display: 'flex', flexDirection: 'column' }}>
              <QSectionHead eyebrow="HEALTH" title={tr('Financial vitals')} ai />
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                <QDonut size={150} centerLabel="SCORE" centerValue="84"
                  items={[
                    { value: 38, color: '#9D4DFF' },
                    { value: 22, color: '#6DF3FF' },
                    { value: 18, color: '#4ADE9B' },
                    { value: 14, color: '#FFB547' },
                    { value: 8,  color: '#FF5A6E' },
                  ]} />
                <div className="q-stack-sm" style={{ flex: 1 }}>
                  {[
                    { label: 'Liquidity',    val: 92, color: '#6DF3FF' },
                    { label: 'Savings rate', val: 88, color: '#9D4DFF' },
                    { label: 'Debt ratio',   val: 76, color: '#4ADE9B' },
                    { label: 'Diversif.',    val: 64, color: '#FFB547' },
                    { label: 'Volatility',   val: 48, color: '#FF5A6E' },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: 'var(--q-text-2)', width: 78 }}>{tr(r.label)}</span>
                      <div style={{ flex: 1, height: 4, background: 'rgba(168,85,247,0.10)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: r.val + '%', height: '100%', background: r.color, boxShadow: `0 0 6px ${r.color}` }} />
                      </div>
                      <span className="q-mono q-num" style={{ fontSize: 11, color: 'var(--q-text-1)', width: 24, textAlign: 'right' }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
          <QCopilotPanel compact />
          <QInsightFeed />
        </div>
      </div>
    </QShell>
  );
}

// ─────────────────────────────────────────────────────────────
// AI Copilot panel
// ─────────────────────────────────────────────────────────────
function QCopilotPanel({ compact, onSuggest }) {
  const tr = (typeof window.useTr === 'function') ? window.useTr() : (s)=>s;
  const SEED = [
    { from: 'user', text: 'Why did spending on food spike this week?' },
    { from: 'ai', seed: true },
  ];
  const [msgs, setMsgs] = React.useState(SEED);
  const [input, setInput] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, thinking]);

  const send = (text) => {
    const t = (typeof text === 'string' ? text : input).trim();
    if (!t || thinking) return;
    setInput('');
    setMsgs(m => [...m, { from: 'user', text: t }]);
    setThinking(true);
    setTimeout(() => {
      setMsgs(m => [...m, { from: 'ai', text: getQuarkResp(t) }]);
      setThinking(false);
    }, 800 + Math.random() * 500);
  };

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <div className="q-card q-card-elev" style={{ padding: 14, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 60,
          background: 'linear-gradient(180deg, transparent, rgba(157,77,255,0.06), transparent)',
          animation: 'q-scan 6s linear infinite',
        }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ position: 'relative', width: 32, height: 32 }}>
          <QLogo size={32} />
          <span style={{
            position: 'absolute', bottom: -2, right: -2, width: 9, height: 9,
            borderRadius: '50%', background: 'var(--q-accent-emerald)',
            boxShadow: '0 0 0 2px var(--q-bg-1), 0 0 6px var(--q-accent-emerald)',
          }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            Quark <span className="q-chip q-chip-cyan">{tr('analyst · terse')}</span>
          </div>
          <div className="q-mono" style={{ fontSize: 9.5, color: 'var(--q-text-3)' }}>
            claude-haiku-4.5 · 142ms · ctx 12.4k
          </div>
        </div>
        <button className="q-btn q-btn-ghost" style={{ padding: 4 }}><QIcon name="cpu" size={12} /></button>
      </div>

      <div ref={scrollRef} className="q-stack-sm q-scroll" style={{ overflow: 'auto', maxHeight: compact ? 260 : 600, paddingRight: 4 }}>
        {msgs.map((msg, i) => {
          if (msg.seed) {
            return (
              <React.Fragment key={i}>
                <QMsg from="ai">
                  <div style={{ marginBottom: 6 }}>
                    <span className="q-num" style={{ color: 'var(--q-violet-300)', fontWeight: 600 }}>+38%</span> vs your 12-week median.
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--q-text-2)', lineHeight: 1.55 }}>
                    Driven by <b style={{ color: 'var(--q-text-1)' }}>3 events</b>: <span className="q-mono q-num">$184</span> at <i>Sushi Norte</i> (Sat), <span className="q-mono q-num">$96</span> at <i>Mercado del Río</i>, and <span className="q-mono q-num">$72</span> on delivery (Wed–Thu). Removing the Sat dinner brings the week back to baseline.
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    <span className="q-chip">trace · 4 sources</span>
                    <span className="q-chip q-chip-cyan">confidence 0.91</span>
                  </div>
                </QMsg>
                <QMsg from="ai" reasoning>
                  <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-violet-300)', letterSpacing: '0.14em', marginBottom: 4 }}>{tr('REASONING ↓')}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--q-text-3)', lineHeight: 1.5 }}>
                    ① grouped txns by merchant_category=FOOD<br/>
                    ② weekly aggregate: $487 vs median $352<br/>
                    ③ z-score 2.31 → flagged outlier<br/>
                    ④ decomposed top 3 contributors
                  </div>
                </QMsg>
              </React.Fragment>
            );
          }
          return <QMsg key={i} from={msg.from}>{msg.text}</QMsg>;
        })}
        {thinking && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0' }}>
            <span className="q-mono" style={{ fontSize: 9, letterSpacing: '0.14em', color: 'var(--q-violet-300)' }}>{tr('QUARK SYNTHESIZING')}</span>
            <span style={{ display: 'inline-flex', gap: 3 }}>
              {[0,1,2].map(i => <span key={i} style={{ width: 4, height: 4, borderRadius: 2, background: 'var(--q-violet-300)', animation: `q-typing-dot 1.4s ${i * 0.18}s ease-in-out infinite` }} />)}
            </span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center',
        background: 'rgba(7,2,15,0.6)', border: '1px solid var(--q-stroke-2)',
        borderRadius: 10, padding: '6px 8px', marginTop: 8,
        boxShadow: '0 0 0 3px rgba(157,77,255,0.06), inset 0 0 12px rgba(157,77,255,0.05)' }}>
        <QIcon name="sparkle" size={13} />
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder={tr('Ask Quark anything · /forecast /explain')}
          style={{
            flex: 1, fontSize: 12, color: 'var(--q-text-1)',
            background: 'transparent', border: 'none', outline: 'none',
            fontFamily: 'var(--q-font-sans)',
          }}
        />
        <button className="q-btn q-btn-primary" style={{ padding: '4px 10px', fontSize: 11 }} onClick={send}>
          <QIcon name="send" size={11} />
        </button>
      </div>
    </div>
  );
}

function QMsg({ from, children, reasoning }) {
  if (from === 'user') {
    return (
      <div style={{ alignSelf: 'flex-end', textAlign: 'right' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(157,77,255,0.10)',
          border: '1px solid var(--q-stroke-1)',
          borderRadius: '12px 12px 2px 12px',
          padding: '7px 11px',
          fontSize: 12, color: 'var(--q-text-1)',
          maxWidth: '92%', textAlign: 'left',
        }}>{children}</div>
      </div>
    );
  }
  return (
    <div style={{
      display: 'inline-block',
      background: reasoning ? 'transparent' : 'linear-gradient(180deg, rgba(155,89,255,0.08), rgba(155,89,255,0.02))',
      border: reasoning ? '1px dashed rgba(157,77,255,0.20)' : '1px solid var(--q-stroke-1)',
      borderRadius: '12px 12px 12px 2px',
      padding: '8px 11px',
      fontSize: 12, color: 'var(--q-text-1)',
    }}>{children}</div>
  );
}

function QInsightFeed() {
  const tr = (typeof window.useTr === 'function') ? window.useTr() : (s)=>s;
  const items = [
    { tag: 'PATTERN', tone: 'violet', title: 'Coffee streak ↑37% in 14d', body: 'You\'re on a 14-day daily-cafe streak. At current pace: +$184/mo.' },
    { tag: 'OPPORTUNITY', tone: 'cyan', title: 'Move idle to HYSA', body: '$12,400 idle in checking. At 4.6% APY → +$47.5/mo passive.' },
    { tag: 'RISK', tone: 'coral', title: 'Floating rate · loan #2', body: 'Q3 rate refresh model: +$310/mo if Fed pauses (P=0.62).' },
    { tag: 'GOAL', tone: 'emerald', title: 'Down payment · 71% there', body: 'Projected hit: Aug 2026 · 4 weeks ahead of plan.' },
  ];
  const toneClass = { violet: 'q-chip', cyan: 'q-chip q-chip-cyan', coral: 'q-chip q-chip-coral', emerald: 'q-chip q-chip-emerald' };
  return (
    <div className="q-card q-card-elev" style={{ padding: 14, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <QSectionHead eyebrow={tr('QUANTUM INSIGHTS')} title={tr('Synthesized · last 24h')} ai
        action={<span className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)' }}>14 NEW</span>} />
      <div className="q-stack-sm q-scroll" style={{ overflow: 'auto', flex: 1, paddingRight: 4 }}>
        {items.map((it, i) => (
          <div key={i} style={{ padding: '10px 12px', background: 'rgba(7,2,15,0.4)', borderRadius: 10, border: '1px solid var(--q-stroke-1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
              <span className={toneClass[it.tone]}>{tr(it.tag)}</span>
              <span className="q-mono" style={{ fontSize: 9.5, color: 'var(--q-text-3)', marginLeft: 'auto' }}>{i + 1}m</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--q-text-1)', marginBottom: 3 }}>{it.title}</div>
            <div style={{ fontSize: 11, color: 'var(--q-text-3)', lineHeight: 1.45 }}>{it.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. AI COPILOT FULL SCREEN
// ─────────────────────────────────────────────────────────────
function ScreenCopilot() {
  const tr = (typeof window.useTr === 'function') ? window.useTr() : (s)=>s;
  const THREADS = [
    { t: 'Why is food spend up?',          time: '2m' },
    { t: 'Forecast retirement at 55',      time: '1h' },
    { t: 'Should I refi loan #2?',         time: '3h' },
    { t: 'Decompose Q3 variance',          time: 'yest' },
    { t: 'Tax-optimal Dec moves',          time: '2d' },
    { t: 'Compare ETFs · QQQM vs SPLG',    time: '3d' },
  ];
  const SUGGESTED = [
    'Find subscriptions I haven\'t used in 60d',
    'What\'s my real hourly rate after taxes?',
    'Simulate quitting in 18 months',
    'Where do I leak money I don\'t notice?',
  ];

  const [activeThread, setActiveThread] = React.useState(0);
  const [msgs, setMsgs] = React.useState([
    { from: 'user', text: 'If I redirect 60% of my coffee budget into the index DCA, what\'s the 10y delta?' },
    { from: 'ai', seed: 'full' },
  ]);
  const [thinking, setThinking] = React.useState(false);
  const [input, setInput] = React.useState('');
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, thinking]);

  const send = (text) => {
    const t = (typeof text === 'string' ? text : input).trim();
    if (!t || thinking) return;
    setInput('');
    setMsgs(m => [...m, { from: 'user', text: t }]);
    setThinking(true);
    setTimeout(() => {
      setMsgs(m => [...m, { from: 'ai', text: getQuarkResp(t) }]);
      setThinking(false);
    }, 900 + Math.random() * 600);
  };

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  const newThread = () => {
    setMsgs([]);
    setThinking(false);
    setInput('');
    setActiveThread(-1);
  };

  return (
    <QShell active="copilot" topbarProps={{
      breadcrumb: 'AI / COPILOT · SESSION 0142',
      title: 'Quark · financial reasoning',
      subtitle: '12.4k tokens · 4 tools available',
      actions: <>
        <button className="q-btn q-btn-ghost"><QIcon name="cpu" size={12}/> claude-haiku-4.5</button>
        <button className="q-btn" onClick={newThread}><QIcon name="plus" size={12}/> {tr('New thread')}</button>
      </>,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 320px', gap: 14, height: '100%' }}>
        {/* threads */}
        <div className="q-card" style={{ padding: 12, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div className="q-eyebrow" style={{ marginBottom: 10 }}>{tr('THREADS')}</div>
          <div className="q-stack-sm">
            {THREADS.map((t, i) => (
              <div key={i} onClick={() => setActiveThread(i)} style={{
                padding: '8px 10px', borderRadius: 8, fontSize: 12,
                background: activeThread === i ? 'rgba(157,77,255,0.14)' : 'transparent',
                border: activeThread === i ? '1px solid var(--q-stroke-2)' : '1px solid transparent',
                color: activeThread === i ? 'var(--q-text-1)' : 'var(--q-text-2)',
                cursor: 'pointer',
              }}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.t}</div>
                <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)', marginTop: 2 }}>{t.time}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 12 }}>
            <div className="q-eyebrow" style={{ marginBottom: 8 }}>{tr('TOOLS · ACTIVE')}</div>
            {['fetch_txns','run_forecast','price_quote','tax_calc'].map(t => (
              <div key={t} className="q-mono" style={{ fontSize: 10.5, color: 'var(--q-violet-300)', padding: '3px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 4, height: 4, background: 'currentColor', borderRadius: '50%' }} />{t}
              </div>
            ))}
          </div>
        </div>

        {/* main convo */}
        <div className="q-card q-card-elev" style={{ padding: 18, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div style={{
              position: 'absolute', left: 0, right: 0, height: 90,
              background: 'linear-gradient(180deg, transparent, rgba(109,243,255,0.04), transparent)',
              animation: 'q-scan 8s linear infinite',
            }} />
          </div>

          <div ref={scrollRef} className="q-stack-md q-scroll" style={{ overflow: 'auto', flex: 1, paddingRight: 8, paddingBottom: 8 }}>
            {msgs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--q-text-3)' }}>
                <div style={{ marginBottom: 12 }}><QLogo size={40} /></div>
                <div style={{ fontSize: 14, color: 'var(--q-text-2)', marginBottom: 6 }}>{tr('New thread')}</div>
                <div style={{ fontSize: 12 }}>{tr('Ask anything about your finances')}</div>
              </div>
            )}
            {msgs.map((msg, i) => {
              if (msg.seed === 'full') {
                return (
                  <React.Fragment key={i}>
                    <div style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
                      <QMsg from="ai">
                        <div style={{ marginBottom: 10 }}>
                          <span className="q-num" style={{ color: 'var(--q-accent-cyan)', fontWeight: 600, fontSize: 18, letterSpacing: '-0.02em' }}>+ $24,810</span>
                          <span style={{ color: 'var(--q-text-3)', fontSize: 12, marginLeft: 8 }}>by Nov 2036 · P50</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--q-text-2)', lineHeight: 1.55 }}>
                          Coffee budget: <span className="q-mono q-num">$184/mo</span> → reallocate <span className="q-mono q-num">$110/mo</span> to your existing VTI DCA.
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 12, padding: 12, background: 'rgba(7,2,15,0.5)', borderRadius: 8, border: '1px solid var(--q-stroke-1)' }}>
                          <div style={{ flex: 1 }}>
                            <div className="q-eyebrow" style={{ marginBottom: 4 }}>P10 · BEAR</div>
                            <div className="q-num" style={{ fontSize: 16, fontWeight: 500, color: 'var(--q-accent-coral)' }}>+$14.2k</div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div className="q-eyebrow q-eyebrow-violet" style={{ marginBottom: 4 }}>P50 · BASE</div>
                            <div className="q-num" style={{ fontSize: 16, fontWeight: 500, color: 'var(--q-violet-300)' }}>+$24.8k</div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div className="q-eyebrow q-eyebrow-cyan" style={{ marginBottom: 4 }}>P90 · BULL</div>
                            <div className="q-num" style={{ fontSize: 16, fontWeight: 500, color: 'var(--q-accent-emerald)' }}>+$38.4k</div>
                          </div>
                        </div>
                        <div style={{ marginTop: 10, fontSize: 11, color: 'var(--q-text-3)' }}>
                          Assumptions: 7.0% nominal CAGR · 0.03% expense ratio · monthly DCA · taxable account.
                        </div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                          <span className="q-chip"><span className="q-pulse-dot" style={{ width: 4, height: 4, marginRight: 4, verticalAlign: 'middle' }} />tool · run_forecast</span>
                          <span className="q-chip q-chip-cyan">Monte Carlo · 10k paths</span>
                          <span className="q-chip q-chip-emerald">confidence 0.94</span>
                        </div>
                      </QMsg>
                    </div>
                    <QMsg from="ai" reasoning>
                      <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-violet-300)', letterSpacing: '0.14em', marginBottom: 6 }}>{tr('REASONING TRACE ↓ 4 STEPS · 1.2s')}</div>
                      <div className="q-mono" style={{ fontSize: 10.5, color: 'var(--q-text-3)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
{`① pulled 90d txns where category=COFFEE  →  μ = $184/mo
② built shifted-DCA scenario: VTI, +$110/mo, 10y horizon
③ ran 10,000 Monte Carlo paths  →  P10/P50/P90 distribution
④ subtracted base-case to isolate marginal effect`}
                      </div>
                    </QMsg>
                  </React.Fragment>
                );
              }
              return <QMsg key={i} from={msg.from}>{msg.text}</QMsg>;
            })}
            {thinking && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-flex', gap: 3 }}>
                  {[0,1,2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: 3, background: 'var(--q-violet-300)', animation: `q-typing-dot 1.4s ${i * 0.18}s ease-in-out infinite` }} />)}
                </span>
                <span className="q-mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--q-violet-300)' }}>{tr('SYNTHESIZING')}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end',
            background: 'rgba(7,2,15,0.6)', border: '1px solid var(--q-stroke-2)',
            borderRadius: 12, padding: '10px 12px',
            boxShadow: '0 0 0 3px rgba(157,77,255,0.08), inset 0 0 16px rgba(157,77,255,0.06)' }}>
            <QIcon name="sparkle" size={14} />
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              rows={1}
              placeholder={tr('Ask Quark anything…')}
              style={{
                flex: 1, fontSize: 13, color: 'var(--q-text-1)',
                background: 'transparent', border: 'none', outline: 'none',
                fontFamily: 'var(--q-font-sans)', resize: 'none', minHeight: 22,
              }}
            />
            <span className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)', whiteSpace: 'nowrap' }}>{tr('↵ send')}</span>
            <button className="q-btn q-btn-primary" style={{ padding: '6px 14px' }} onClick={() => send()}><QIcon name="send" size={12} /></button>
          </div>
        </div>

        {/* context rail */}
        <div className="q-card" style={{ padding: 14, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div className="q-eyebrow q-eyebrow-cyan" style={{ marginBottom: 8 }}>{tr('CONTEXT · ATTACHED')}</div>
          <div className="q-stack-sm" style={{ marginBottom: 16 }}>
            {[
              { t: '90d transactions', sub: '4,182 rows · 12 banks' },
              { t: 'Portfolio · taxable', sub: '$48,310 · 8 positions' },
              { t: 'Goal · house 2026', sub: '71% complete' },
              { t: 'Quark profile', sub: 'risk: moderate · horiz: 12y' },
            ].map((c, i) => (
              <div key={i} style={{ padding: '8px 10px', background: 'rgba(7,2,15,0.4)', borderRadius: 8, border: '1px solid var(--q-stroke-1)' }}>
                <div style={{ fontSize: 11, color: 'var(--q-text-1)', fontWeight: 500 }}>{c.t}</div>
                <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)', marginTop: 2 }}>{c.sub}</div>
              </div>
            ))}
          </div>
          <div className="q-eyebrow" style={{ marginBottom: 8 }}>{tr('SUGGESTED PROMPTS')}</div>
          <div className="q-stack-sm">
            {SUGGESTED.map((p, i) => (
              <div key={i} onClick={() => send(p)} style={{
                padding: '8px 10px', borderRadius: 8, fontSize: 11.5,
                color: 'var(--q-text-2)',
                border: '1px dashed var(--q-stroke-1)',
                cursor: 'pointer',
                transition: 'border-color .15s, color .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--q-stroke-3)'; e.currentTarget.style.color = 'var(--q-text-1)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--q-stroke-1)'; e.currentTarget.style.color = 'var(--q-text-2)'; }}
              >{p}</div>
            ))}
          </div>
        </div>
      </div>
    </QShell>
  );
}

Object.assign(window, { QShell, ScreenDashboard, ScreenCopilot, QCopilotPanel, QInsightFeed, QMsg, ARTBOARD_W, ARTBOARD_H });
