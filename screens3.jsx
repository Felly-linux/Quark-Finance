// Quark Finance — screens3.jsx
// Missions, AI Models, Onboarding, Mobile.

// ─────────────────────────────────────────────────────────────
// 7. AI MISSIONS
// ─────────────────────────────────────────────────────────────
const MISSIONS_INIT = [
  { id:'m1', rank:'A', tier:'CRITICAL', title:'Refinance Loan #2', sub:'Save $310/mo before Q3 rate refresh', xp: 1200, prog: 0.40, days: 22, color: '#FF5A6E',
    desc:'Variable-rate loan resets +95bps in Q3. Refinancing at 4.9% locks $84/mo for 48mo.', steps:[
      { t:'Pull current loan terms', done:true }, { t:'Compare 3 lender quotes', done:true },
      { t:'Submit application', done:false }, { t:'Sign + close', done:false } ] },
  { id:'m2', rank:'A', tier:'COMPOUND', title:'Build 6-mo emergency fund', sub:'$28k of $32k · 87.5%', xp: 800, prog: 0.875, days: 60, color: '#9D4DFF',
    desc:'Target: $32k (6 months of essential expenses). Currently auto-saving $1.2k/mo.', steps:[
      { t:'Open HYSA', done:true }, { t:'Auto-deposit $1.2k/mo', done:true },
      { t:'Reach $32k milestone', done:false } ] },
  { id:'m3', rank:'B', tier:'HABIT', title:'Reduce delivery streak to <3/wk', sub:'Currently 5.2/wk · 14d window', xp: 350, prog: 0.55, days: 14, color: '#FF7AE6',
    desc:'Behavior nudge · streak detector flagged 14-day pattern. Target: 3 deliveries/wk max.', steps:[
      { t:'Block delivery apps mon-thu', done:true }, { t:'Meal-prep Sunday', done:false },
      { t:'Hold streak 4 weeks', done:false } ] },
  { id:'m4', rank:'B', tier:'GROWTH', title:'Index DCA · automate +$110/mo', sub:'Reallocated from coffee budget', xp: 600, prog: 0.10, days: 30, color: '#6DF3FF',
    desc:'Set up automated $110/mo into VTI from coffee savings. 10y impact: +$24.8k P50.', steps:[
      { t:'Choose broker', done:true }, { t:'Enable auto-DCA', done:false }, { t:'Verify first transfer', done:false } ] },
  { id:'m5', rank:'S', tier:'LEGENDARY', title:'Down payment · house 2026', sub:'71% complete · ahead of plan', xp: 4000, prog: 0.71, days: 280, color: '#4ADE9B',
    desc:'Goal: $50k down payment by Aug 2026. Current pace: 4 weeks ahead.', steps:[
      { t:'Open dedicated savings', done:true }, { t:'$3.8k/mo auto-save', done:true },
      { t:'Reach $35k', done:true }, { t:'Reach $50k', done:false }, { t:'Get pre-approval', done:false } ] },
  { id:'m6', rank:'C', tier:'CLEANUP', title:'Cancel 3 zombie subscriptions', sub:'$144/mo recoverable', xp: 200, prog: 0.0, days: 7, color: '#FFB547',
    desc:'Quark identified 3 subscriptions unused 60d+: cloud, gym, streaming overlap.', steps:[
      { t:'Cancel cloud 2TB', done:false }, { t:'Cancel gym', done:false }, { t:'Drop Hulu Live', done:false } ] },
  { id:'m7', rank:'B', tier:'COMPLETED', title:'Audit 90d transactions', sub:'Done · 4 leaks found', xp: 250, prog: 1, days: 0, color: '#4ADE9B',
    desc:'Quark scanned 4,182 transactions. Surfaced FX fees, gym, streaming overlaps.', steps:[
      { t:'Scan complete', done:true }, { t:'Review findings', done:true }, { t:'Action on top 3', done:true } ] },
];

function ScreenMissions() {
  const toast = (typeof useToast === 'function') ? useToast() : (() => {});
  const [missions, setMissions] = React.useState(MISSIONS_INIT);
  const [filter, setFilter] = React.useState('ACTIVE');
  const [expanded, setExpanded] = React.useState(null);

  const counts = {
    ALL: missions.length,
    ACTIVE: missions.filter(m => m.prog < 1).length,
    COMPLETED: missions.filter(m => m.prog >= 1).length,
    CRITICAL: missions.filter(m => m.rank === 'A' || m.rank === 'S').length,
  };
  const filtered = missions.filter(m => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return m.prog < 1;
    if (filter === 'COMPLETED') return m.prog >= 1;
    if (filter === 'CRITICAL') return (m.rank === 'A' || m.rank === 'S') && m.prog < 1;
    return true;
  });

  const totalXp = missions.filter(m => m.prog >= 1).reduce((s, m) => s + m.xp, 0) + 1390;

  const toggleStep = (mid, si) => {
    setMissions(arr => arr.map(m => {
      if (m.id !== mid) return m;
      const newSteps = m.steps.map((st, i) => i === si ? { ...st, done: !st.done } : st);
      const prog = newSteps.filter(s => s.done).length / newSteps.length;
      return { ...m, steps: newSteps, prog };
    }));
  };
  const completeMission = (mid) => {
    setMissions(arr => arr.map(m => m.id === mid ? { ...m, prog: 1, steps: m.steps.map(s => ({ ...s, done: true })) } : m));
    toast('Mission completed · XP awarded');
  };

  return (
    <QShell active="missions" topbarProps={{
      breadcrumb: 'PROGRESSION / MISSIONS',
      title: 'Active financial missions',
      subtitle: `${counts.ACTIVE} active · ${counts.COMPLETED} completed · ${totalXp.toLocaleString()} XP · Level 14 Architect`,
      actions: <>
        <button className="q-btn q-btn-ghost" onClick={()=>toast('Browsing completed · 23 total')}>Completed · 23</button>
        <button className="q-btn" onClick={()=>toast('Generating new mission from your patterns…')}><QIcon name="sparkle" size={12}/> Generate mission</button>
      </>,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
          {/* Filter tabs */}
          <div style={{ display:'flex', gap: 6, padding: 4, background:'rgba(7,2,15,0.5)', borderRadius: 10, border:'1px solid var(--q-stroke-1)' }}>
            {[
              { k:'ACTIVE',    l:'Active' },
              { k:'CRITICAL',  l:'Critical' },
              { k:'COMPLETED', l:'Completed' },
              { k:'ALL',       l:'All' },
            ].map(t => (
              <button key={t.k} onClick={() => setFilter(t.k)} className="q-btn q-btn-ghost" style={{
                flex: 1, padding:'6px 10px', fontSize: 11.5, border: 'none',
                background: filter===t.k ? 'rgba(157,77,255,0.20)' : 'transparent',
                color: filter===t.k ? 'var(--q-violet-300)' : 'var(--q-text-3)',
              }}>{t.l} · {counts[t.k]}</button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignContent: 'start', overflow: 'auto', flex: 1, minHeight: 0 }} className="q-scroll">
            {filtered.length === 0 && (
              <div style={{ gridColumn:'1 / -1', textAlign:'center', padding:'40px 0', color:'var(--q-text-3)', fontSize: 13 }}>
                No missions in this filter
              </div>
            )}
            {filtered.map(m => {
              const isExp = expanded === m.id;
              const isComplete = m.prog >= 1;
              return (
                <div key={m.id} className="q-card q-card-elev" style={{
                  padding: 14, position: 'relative', overflow: 'hidden',
                  gridColumn: isExp ? '1 / -1' : 'auto',
                  borderColor: isExp ? m.color+'60' : 'var(--q-stroke-1)',
                  boxShadow: isExp ? `0 0 0 1px ${m.color}40, 0 0 20px ${m.color}30` : undefined,
                  transition: 'all 0.2s',
                }}>
                  <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%',
                    background: `radial-gradient(circle, ${m.color}40, transparent 70%)`, pointerEvents: 'none' }} />
                  <button onClick={() => setExpanded(isExp ? null : m.id)} style={{
                    width:'100%', display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10,
                    background:'transparent', border:'none', fontFamily:'inherit', cursor:'pointer', color:'inherit', textAlign:'left', padding: 0,
                  }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 10,
                      background: `linear-gradient(135deg, ${m.color}, ${m.color}40)`,
                      display: 'grid', placeItems: 'center',
                      fontFamily: 'Geist Mono', fontSize: 18, fontWeight: 600,
                      boxShadow: `0 0 20px ${m.color}80`, color: '#0B0617', flexShrink: 0,
                    }}>{m.rank}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="q-mono" style={{ fontSize: 9.5, letterSpacing: '0.18em', color: m.color }}>{m.tier} {isComplete && '· DONE'}</div>
                      <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{m.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--q-text-3)', marginTop: 2 }}>{m.sub}</div>
                    </div>
                    <span style={{ color:'var(--q-text-3)', transform: isExp?'rotate(90deg)':'rotate(0)', transition:'transform 0.2s' }}>
                      <QIcon name="arrow-right" size={11}/>
                    </span>
                  </button>
                  {/* progress */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ position: 'relative', width: 48, height: 48 }}>
                      <svg width="48" height="48" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(168,85,247,0.10)" strokeWidth="3.5" />
                        <circle cx="24" cy="24" r="20" fill="none" stroke={m.color} strokeWidth="3.5" strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 20 * m.prog} ${2 * Math.PI * 20}`}
                          transform="rotate(-90 24 24)"
                          style={{ filter: `drop-shadow(0 0 4px ${m.color})`, transition: 'stroke-dasharray 0.3s' }} />
                      </svg>
                      <div className="q-num" style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
                        fontSize: 11, fontWeight: 600, color: m.color }}>{Math.round(m.prog * 100)}%</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--q-text-3)' }}>
                        <span>{isComplete ? 'Completed' : `${m.days}d remaining`}</span>
                        <span className="q-mono">+{m.xp} XP</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(168,85,247,0.10)', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                        <div style={{ width: m.prog * 100 + '%', height: '100%', background: m.color, boxShadow: `0 0 6px ${m.color}`, transition: 'width 0.3s' }} />
                      </div>
                    </div>
                  </div>
                  {/* expanded */}
                  {isExp && (
                    <div style={{ marginTop: 14, animation: 'q-fade-up 0.2s ease-out' }}>
                      <div style={{ fontSize: 12, color: 'var(--q-text-2)', lineHeight: 1.55, marginBottom: 10 }}>{m.desc}</div>
                      <div className="q-eyebrow" style={{ marginBottom: 6 }}>STEPS · {m.steps.filter(s => s.done).length}/{m.steps.length}</div>
                      <div className="q-stack-sm" style={{ marginBottom: 12 }}>
                        {m.steps.map((st, si) => (
                          <button key={si} onClick={() => toggleStep(m.id, si)} disabled={isComplete} style={{
                            display:'flex', alignItems:'center', gap: 10, padding:'7px 10px',
                            background:'rgba(7,2,15,0.4)', borderRadius: 8,
                            border: `1px solid ${st.done ? m.color+'40' : 'var(--q-stroke-1)'}`,
                            fontFamily:'inherit', cursor: isComplete?'default':'pointer', color:'inherit', textAlign:'left', width:'100%',
                          }}>
                            <span style={{
                              width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                              background: st.done ? m.color+'90' : 'transparent',
                              border: `1px solid ${st.done ? m.color : 'var(--q-stroke-2)'}`,
                              display: 'grid', placeItems: 'center', color:'#0B0617',
                            }}>{st.done && <QIcon name="check" size={9} />}</span>
                            <span style={{
                              fontSize: 12,
                              color: st.done ? 'var(--q-text-3)' : 'var(--q-text-1)',
                              textDecoration: st.done ? 'line-through' : 'none',
                            }}>{st.t}</span>
                          </button>
                        ))}
                      </div>
                      <div style={{ display:'flex', gap: 6, flexWrap:'wrap' }}>
                        {!isComplete && <button className="q-btn q-btn-primary" style={{ padding:'5px 12px', fontSize: 11 }} onClick={() => completeMission(m.id)}><QIcon name="check" size={11}/> Mark complete</button>}
                        {!isComplete && <button className="q-btn q-btn-ghost" style={{ padding:'5px 12px', fontSize: 11 }} onClick={() => toast(`Continuing ${m.title}…`)}>Continue</button>}
                        <button className="q-btn q-btn-ghost" style={{ padding:'5px 12px', fontSize: 11 }} onClick={() => toast(`${m.title} pinned to top`)}>Pin</button>
                        {!isComplete && <button className="q-btn q-btn-ghost" style={{ padding:'5px 12px', fontSize: 11 }} onClick={() => toast('Quark · breaking down sub-tasks')}><QIcon name="sparkle" size={11}/> Ask Quark</button>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* level / stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="q-card q-card-elev" style={{ padding: 16, textAlign: 'center', position: 'relative' }}>
            <div className="q-eyebrow q-eyebrow-violet">YOUR ARCHETYPE</div>
            <div style={{ position: 'relative', width: 100, height: 100, margin: '14px auto' }}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ animation: 'q-orbit 30s linear infinite' }}>
                <polygon points="50,5 60,20 80,18 70,38 90,50 70,62 80,82 60,80 50,95 40,80 20,82 30,62 10,50 30,38 20,18 40,20"
                  fill="none" stroke="#9D4DFF" strokeWidth="0.6" opacity="0.4" />
              </svg>
              <div style={{ position: 'absolute', inset: 18, borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #C084FF, #6020E0 60%)',
                display: 'grid', placeItems: 'center',
                boxShadow: '0 0 20px rgba(157,77,255,0.6)',
                fontSize: 24, fontWeight: 600, fontFamily: 'Geist Mono' }}>14</div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Architect</div>
            <div style={{ fontSize: 11, color: 'var(--q-text-3)' }}>Builder of compounding systems</div>
            <div style={{ marginTop: 12, height: 5, background: 'rgba(168,85,247,0.10)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: '67%', height: '100%', background: 'linear-gradient(90deg, #9D4DFF, #6DF3FF)' }} />
            </div>
            <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)', marginTop: 4 }}>2,840 / 4,200 XP → Lv.15</div>
          </div>

          <div className="q-card q-card-elev" style={{ padding: 14 }}>
            <QSectionHead eyebrow="STATS" title="Discipline matrix" />
            {[
              ['Consistency', 87, '#9D4DFF'],
              ['Precision',   72, '#6DF3FF'],
              ['Patience',    91, '#4ADE9B'],
              ['Adaptability',64, '#FFB547'],
            ].map(([k,v,c])=>(
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                <span style={{ fontSize: 11, color: 'var(--q-text-2)', width: 88 }}>{k}</span>
                <div style={{ flex: 1, height: 4, background: 'rgba(168,85,247,0.10)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: v + '%', height: '100%', background: c, boxShadow: `0 0 6px ${c}` }} />
                </div>
                <span className="q-mono q-num" style={{ fontSize: 10.5, color: 'var(--q-text-1)', width: 22, textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </QShell>
  );
}

// ─────────────────────────────────────────────────────────────
// 8. AI MODELS / PROVIDERS
// ─────────────────────────────────────────────────────────────
function ScreenModels() {
  const providers = [
    { name:'Anthropic',  model:'claude-haiku-4.5', status:'active',  lat: 142, cost: '$0.0012', usage: 0.62, color:'#9D4DFF' },
    { name:'Anthropic',  model:'claude-sonnet-4.5',status:'fallback',lat: 380, cost: '$0.0085', usage: 0.18, color:'#C084FF' },
    { name:'OpenAI',     model:'gpt-5-mini',        status:'standby', lat: 210, cost: '$0.0019', usage: 0.10, color:'#4ADE9B' },
    { name:'Google',     model:'gemini-2.5-flash',  status:'standby', lat: 168, cost: '$0.0008', usage: 0.05, color:'#6DF3FF' },
    { name:'OpenRouter', model:'auto-route',        status:'paused',  lat: '—', cost: 'var',      usage: 0,    color:'#FFB547' },
    { name:'Ollama · local', model:'llama-3.3-70b', status:'offline', lat: '—', cost: '$0.000',  usage: 0,    color:'#FF7AE6' },
  ];

  const sevDot = (s) => ({
    active:'#4ADE9B', fallback:'#FFB547', standby:'#6DF3FF', paused:'#8B7AA8', offline:'#FF5A6E',
  }[s]);

  return (
    <QShell active="models" topbarProps={{
      breadcrumb: 'INFRASTRUCTURE / AI MODELS',
      title: 'Multi-provider routing',
      subtitle: '6 providers configured · intelligent fallback enabled',
      actions: <>
        <button className="q-btn q-btn-ghost"><QIcon name="lock" size={12}/> Vault</button>
        <button className="q-btn"><QIcon name="plus" size={12}/> Add provider</button>
      </>,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
          {/* routing graph */}
          <div className="q-card q-card-elev" style={{ padding: 16 }}>
            <QSectionHead eyebrow="LIVE ROUTING" title="Intelligent fallback chain" ai
              action={<span className="q-mono" style={{ fontSize:11, color:'var(--q-accent-emerald)' }}>● healthy</span>} />
            <svg width="100%" height="120" viewBox="0 0 700 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="rt-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#9D4DFF"/><stop offset="100%" stopColor="#6DF3FF"/>
                </linearGradient>
              </defs>
              {[
                { x: 30,  label:'REQUEST', c:'#FFFFFF' },
                { x: 180, label:'ROUTER',  c:'#C084FF' },
                { x: 330, label:'haiku-4.5',c:'#9D4DFF', primary:true },
                { x: 480, label:'sonnet-4.5',c:'#C084FF' },
                { x: 620, label:'gemini-2.5',c:'#6DF3FF' },
              ].map((n,i)=>(
                <g key={i}>
                  {i > 0 && <path d={`M ${i===1?30+30:[180,330,480][i-2]+30} 60 L ${n.x-30} 60`}
                    stroke="url(#rt-line)" strokeWidth="1.4" strokeDasharray={i>2?'3 3':'0'} opacity={i>2?0.5:0.9} />}
                  <circle cx={n.x} cy={60} r={n.primary?16:12} fill={n.c} opacity="0.18" />
                  <circle cx={n.x} cy={60} r={n.primary?9:7} fill={n.c}
                    style={{ filter: `drop-shadow(0 0 6px ${n.c})`, animation: n.primary?'q-pulse 2s ease-in-out infinite':'none' }} />
                  <text x={n.x} y={n.primary?92:88} fill="var(--q-text-2)" fontSize="10" fontFamily="Geist Mono" textAnchor="middle">{n.label}</text>
                  {n.primary && <text x={n.x} y={36} fill="#9D4DFF" fontSize="9" fontFamily="Geist Mono" textAnchor="middle" letterSpacing="1">PRIMARY</text>}
                </g>
              ))}
              {/* moving particles */}
              <circle r="3" fill="#6DF3FF">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 30 60 L 180 60 L 330 60" />
              </circle>
            </svg>
          </div>

          {/* provider list */}
          <div className="q-card q-card-elev" style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <QSectionHead eyebrow="CONFIGURED" title="6 providers · 9 models" />
            <div className="q-scroll q-stack-sm" style={{ overflow: 'auto', flex: 1, paddingRight: 4 }}>
              {providers.map((p,i)=>(
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '32px 1fr 80px 80px 100px 90px',
                  gap: 12, alignItems: 'center', padding: '12px 14px',
                  background: 'rgba(7,2,15,0.4)', borderRadius: 10, border: '1px solid var(--q-stroke-1)',
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: `linear-gradient(135deg, ${p.color}, ${p.color}30)`,
                    boxShadow: `0 0 8px ${p.color}80`,
                  }} />
                  <div>
                    <div style={{ fontSize: 12.5, color: 'var(--q-text-1)', fontWeight: 500 }}>{p.name}</div>
                    <div className="q-mono" style={{ fontSize: 10.5, color: 'var(--q-text-3)' }}>{p.model}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: 'var(--q-text-2)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: sevDot(p.status), boxShadow: `0 0 4px ${sevDot(p.status)}` }} />
                    {p.status}
                  </div>
                  <div className="q-mono q-num" style={{ fontSize: 11, color: 'var(--q-text-1)', textAlign:'right' }}>
                    {p.lat === '—' ? '—' : `${p.lat}ms`}
                  </div>
                  <div className="q-mono q-num" style={{ fontSize: 11, color: 'var(--q-text-1)', textAlign:'right' }}>
                    {p.cost} <span style={{ color:'var(--q-text-3)', fontSize:9 }}>/req</span>
                  </div>
                  {/* usage bar */}
                  <div>
                    <div style={{ height: 4, background: 'rgba(168,85,247,0.10)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: p.usage*100 + '%', height: '100%', background: p.color, boxShadow: `0 0 4px ${p.color}` }} />
                    </div>
                    <div className="q-mono" style={{ fontSize: 9, color: 'var(--q-text-3)', marginTop: 2 }}>{(p.usage*100).toFixed(0)}% traffic</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* metrics rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="q-card q-card-elev" style={{ padding: 14 }}>
            <div className="q-eyebrow q-eyebrow-cyan" style={{ marginBottom: 8 }}>24H · CONSUMPTION</div>
            <div className="q-num" style={{ fontSize: 24, fontWeight: 600 }}>$2.84</div>
            <div className="q-mono" style={{ fontSize: 10.5, color: 'var(--q-text-3)' }}>1,184 reqs · avg 168ms · μ$0.0024</div>
            <div style={{ marginTop: 10 }}>
              <QSparkline points={[2,3,3,4,3,5,6,5,7,8,7,9]} color="#6DF3FF" height={36} width={260} />
            </div>
          </div>
          <div className="q-card q-card-elev" style={{ padding: 14 }}>
            <QSectionHead eyebrow="POLICY" title="Routing rules" />
            {[
              ['Default', 'haiku-4.5'],
              ['Reasoning > 4 steps', 'sonnet-4.5'],
              ['Bulk classification', 'gemini-flash'],
              ['Sensitive (PII)', 'ollama local'],
              ['Cost cap / day', '$5.00'],
            ].map(([k,v],i)=>(
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0',
                borderBottom: i < 4 ? '1px dashed var(--q-stroke-1)' : 'none', fontSize: 11.5 }}>
                <span style={{ color: 'var(--q-text-3)' }}>{k}</span>
                <span className="q-mono" style={{ color: 'var(--q-violet-300)' }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="q-card q-card-elev" style={{ padding: 14, position: 'relative', overflow: 'hidden' }}>
            <div className="q-eyebrow q-eyebrow-violet" style={{ marginBottom: 6 }}>API KEYS</div>
            <div style={{ fontSize: 11.5, color: 'var(--q-text-2)', marginBottom: 10 }}>Encrypted at rest · zero-knowledge vault</div>
            <div className="q-mono" style={{ fontSize: 10.5, color: 'var(--q-text-3)' }}>
              sk-ant-api03-•••••••••<span style={{ color:'var(--q-violet-300)' }}>•••</span><br/>
              sk-•••••••••<span style={{ color:'var(--q-violet-300)' }}>•••</span><br/>
              AIza•••••••••<span style={{ color:'var(--q-violet-300)' }}>•••</span>
            </div>
          </div>
        </div>
      </div>
    </QShell>
  );
}

// ─────────────────────────────────────────────────────────────
// ONBOARDING — orbital visual (top-level so React never remounts it)
// ─────────────────────────────────────────────────────────────
function OrbVisual({ step, connected }) {
  const CONN_COLORS = { Banking:'#9D4DFF', Cards:'#C084FF', Crypto:'#6DF3FF', Brokerage:'#4ADE9B', Loans:'#FFB547', Manual:'#FF7AE6' };
  const ORBIT_MAP   = { Banking: 0, Loans: 0, Cards: 1, Manual: 1, Brokerage: 2, Crypto: 3 };
  const ORBIT_DURS  = [20, 28, 36, 44];
  const ORBIT_SIZES = [[80,36],[110,50],[150,68],[190,86]];
  const ORBIT_ROTS  = [0, 30, 60, 90];
  const CX = 220, CY = 220;

  const rotPath = (rx, ry, rotDeg) => {
    const a = rotDeg * Math.PI / 180;
    const x0 = (CX + rx * Math.cos(a)).toFixed(2);
    const y0 = (CY + rx * Math.sin(a)).toFixed(2);
    const x1 = (CX - rx * Math.cos(a)).toFixed(2);
    const y1 = (CY - rx * Math.sin(a)).toFixed(2);
    return `M ${x0} ${y0} A ${rx} ${ry} ${rotDeg} 1 1 ${x1} ${y1} A ${rx} ${ry} ${rotDeg} 1 1 ${x0} ${y0}`;
  };

  const activeConns = Object.entries(connected || {}).filter(([, v]) => v).map(([k]) => k);
  const orbitBuckets = [[], [], [], []];
  activeConns.forEach(name => { orbitBuckets[ORBIT_MAP[name] ?? 0].push(name); });
  const hasElectrons = activeConns.length > 0;
  const DEFAULT_COLORS = ['#9D4DFF', '#6DF3FF', '#FF7AE6', '#4ADE9B'];

  return (
    <div style={{ display: 'grid', placeItems: 'center', position: 'relative' }}>
      <div style={{ position: 'relative', width: 440, height: 440 }}>
        {[160, 220, 300, 380].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: s, height: s * 0.45, marginLeft: -s/2, marginTop: -s*0.225,
            border: `1px ${i===1?'solid':'dashed'} rgba(192,132,252,${0.30 - i*0.05})`,
            borderRadius: '50%', transform: `rotate(${i*30}deg)`,
            animation: `q-orbit ${20 + i*8}s linear ${i%2?'reverse':''} infinite`,
          }} />
        ))}

        <svg viewBox="0 0 440 440" style={{ position:'absolute', inset:0, width:'100%', height:'100%', overflow:'visible' }}>
          <defs>
            {ORBIT_SIZES.map(([rx,ry], i) => (
              <path key={i} id={`qop-${i}`} d={rotPath(rx, ry, ORBIT_ROTS[i])} />
            ))}
          </defs>
          {!hasElectrons && DEFAULT_COLORS.map((c, i) => (
            <circle key={i} r={4} fill={c} style={{ filter:`drop-shadow(0 0 8px ${c})` }}>
              <animateMotion dur={`${ORBIT_DURS[i]}s`} repeatCount="indefinite" begin={`${-i*4}s`}>
                <mpath href={`#qop-${i}`} />
              </animateMotion>
            </circle>
          ))}
          {hasElectrons && orbitBuckets.flatMap((names, oi) =>
            names.map((name, idx) => {
              const dur = ORBIT_DURS[oi];
              const begin = names.length > 1 ? -(idx * dur / names.length) : 0;
              return (
                <circle key={name} r={5} fill={CONN_COLORS[name]} style={{ filter:`drop-shadow(0 0 10px ${CONN_COLORS[name]})` }}>
                  <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${begin}s`}>
                    <mpath href={`#qop-${oi}`} />
                  </animateMotion>
                </circle>
              );
            })
          )}
        </svg>

        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 130, height: 130, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #FFFFFF, #C084FF 30%, #6020E0 70%, #2D0E66 100%)',
          boxShadow: '0 0 40px rgba(157,77,255,0.7), inset 0 -20px 40px rgba(0,0,0,0.4)',
          animation: 'q-pulse 4s ease-in-out infinite',
        }} />

        <div className="q-card" style={{
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          padding: '10px 14px', minWidth: 220, textAlign: 'center',
        }}>
          <div className="q-mono" style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--q-violet-300)' }}>
            QUARK_CORE · {step < 5 ? 'INITIALIZING' : 'READY'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--q-text-2)', marginTop: 4 }}>
            {step < 5 ? 'Awaiting your data signature.' : 'All systems online.'}
          </div>
          <div style={{ height: 2, background: 'rgba(168,85,247,0.10)', borderRadius: 1, marginTop: 8, overflow: 'hidden' }}>
            <div className="q-shimmer" style={{ height: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 9. ONBOARDING — multi-step
// ─────────────────────────────────────────────────────────────
function ScreenOnboarding() {
  const [step, setStep] = React.useState(1);
  const [connected, setConnected] = React.useState({ Banking: true, Cards: true, Crypto: false, Brokerage: false, Loans: false, Manual: false });
  const [risk, setRisk] = React.useState('Moderate');
  const [goals, setGoals] = React.useState({ 'Buy a home': true, 'Retire early': false, 'Emergency fund': true, 'Pay off debt': false, 'Travel fund': false, 'FIRE by 45': false });
  const toggleConn = (k) => setConnected(c => ({ ...c, [k]: !c[k] }));
  const toggleGoal = (k) => setGoals(g => ({ ...g, [k]: !g[k] }));
  const nav = () => window.__qNav && window.__qNav('dashboard');

  const STEPS = ['Welcome','Connect','Profile','Goals','Meet Quark','Done'];
  const connCount = Object.values(connected).filter(Boolean).length;
  const goalCount = Object.values(goals).filter(Boolean).length;

  return (
    <div className="q-app" style={{
      width: ARTBOARD_W, height: ARTBOARD_H,
      position: 'relative', overflow: 'hidden',
      background: 'var(--q-bg-0)', display: 'flex',
    }}>
      <QAmbient intensity={1.4} />
      <QParticles count={48} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1, pointerEvents: 'none' }}>
        <div style={{ width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(157,77,255,0.20), transparent 60%)',
          animation: 'q-pulse 8s ease-in-out infinite' }} />
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: '0 80px', position: 'relative', zIndex: 2 }}>
        {/* LEFT — content changes by step */}
        <div style={{ animation: 'q-fade-up 0.4s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 30 }}>
            <QLogo size={32} />
            <span style={{ fontSize: 16, fontWeight: 600 }}>Quark Finance</span>
            <span className="q-chip">v0.42 · BETA</span>
          </div>
          <div className="q-mono" style={{ fontSize: 11, letterSpacing: '0.24em', color: 'var(--q-violet-300)', marginBottom: 14 }}>
            STEP {String(step).padStart(2,'0')} / 06 · {STEPS[step-1].toUpperCase()}
          </div>

          {step === 1 && <>
            <h1 style={{ fontSize: 58, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.05, margin: '0 0 18px',
              background: 'linear-gradient(180deg, #FFFFFF, #C084FF 80%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Your financial<br/>quantum leap.
            </h1>
            <p style={{ fontSize: 16, color: 'var(--q-text-2)', lineHeight: 1.55, maxWidth: 460, margin: '0 0 32px' }}>
              Quark synthesizes your finances using AI — patterns, risks, and opportunities you'd never spot manually.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="q-btn q-btn-primary" style={{ padding: '12px 24px', fontSize: 14 }} onClick={() => setStep(2)}>
                Get started <QIcon name="arrow-right" size={13}/>
              </button>
              <button className="q-btn q-btn-ghost" style={{ padding: '12px 16px', fontSize: 13 }} onClick={nav}>I already have an account</button>
            </div>
          </>}

          {step === 2 && <>
            <h1 style={{ fontSize: 52, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.05, margin: '0 0 14px',
              background: 'linear-gradient(180deg, #FFFFFF, #C084FF 80%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Let me see<br/>your money.
            </h1>
            <p style={{ fontSize: 15, color: 'var(--q-text-2)', lineHeight: 1.55, maxWidth: 460, margin: '0 0 24px' }}>
              Connect accounts and I'll synthesize 90 days of patterns in under a minute. Read-only. Encrypted.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, maxWidth: 460, marginBottom: 28 }}>
              {Object.entries({ Banking:'#9D4DFF · Plaid · 12,000+ banks', Cards:'#C084FF · Visa · MC · Amex',
                Crypto:'#6DF3FF · Coinbase · Kraken · self-cust', Brokerage:'#4ADE9B · Fidelity · Schwab · IBKR',
                Loans:'#FFB547 · Mortgage · auto · student', Manual:'#FF7AE6 · CSV · receipts · cash' }).map(([name, meta]) => {
                const [dot, ...desc] = meta.split(' · ');
                const on = connected[name];
                return (
                  <div key={name} onClick={() => toggleConn(name)} className="q-card" style={{ padding: 12, cursor: 'pointer',
                    borderColor: on ? 'var(--q-stroke-3)' : 'var(--q-stroke-1)',
                    background: on ? 'linear-gradient(180deg, rgba(157,77,255,0.14), rgba(157,77,255,0.04))' : undefined,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot, boxShadow: `0 0 6px ${dot}` }} />
                      <span style={{ fontSize: 12.5, fontWeight: 500 }}>{name}</span>
                      {on && <span style={{ marginLeft: 'auto', color: 'var(--q-accent-emerald)' }}><QIcon name="check" size={11} /></span>}
                    </div>
                    <div style={{ fontSize: 10.5, color: 'var(--q-text-3)' }}>{desc.join(' · ')}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button className="q-btn q-btn-ghost" style={{ padding: '9px 14px', fontSize: 12 }} onClick={() => setStep(1)}>← Back</button>
              <button className="q-btn q-btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={() => setStep(3)}>
                Connect {connCount} selected <QIcon name="arrow-right" size={12}/>
              </button>
              <button className="q-btn q-btn-ghost" style={{ padding: '9px 14px', fontSize: 12 }} onClick={() => setStep(3)}>Skip for now</button>
            </div>
            <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)', marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <QIcon name="lock" size={11} /> AES-256 · zero-knowledge · audited Q3 2026
            </div>
          </>}

          {step === 3 && <>
            <h1 style={{ fontSize: 52, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.05, margin: '0 0 14px',
              background: 'linear-gradient(180deg, #FFFFFF, #C084FF 80%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Your risk<br/>profile.
            </h1>
            <p style={{ fontSize: 15, color: 'var(--q-text-2)', lineHeight: 1.55, maxWidth: 460, margin: '0 0 24px' }}>
              Quark adapts every recommendation to your comfort with volatility.
            </p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
              {['Conservative','Moderate','Aggressive'].map(r => (
                <div key={r} onClick={() => setRisk(r)} style={{
                  flex: 1, padding: '14px 12px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                  background: risk === r ? 'linear-gradient(180deg, rgba(157,77,255,0.20), rgba(157,77,255,0.06))' : 'rgba(7,2,15,0.4)',
                  border: `1px solid ${risk === r ? 'var(--q-stroke-3)' : 'var(--q-stroke-1)'}`,
                }}>
                  <div style={{ fontSize: { Conservative: 22, Moderate: 24, Aggressive: 26 }[r], marginBottom: 6 }}>
                    {{ Conservative: '🛡️', Moderate: '⚖️', Aggressive: '🚀' }[r]}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: risk === r ? 'var(--q-text-1)' : 'var(--q-text-2)' }}>{r}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--q-text-3)', marginTop: 4 }}>
                    {{ Conservative: 'Capital preservation', Moderate: 'Balanced growth', Aggressive: 'Maximum growth' }[r]}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="q-btn q-btn-ghost" style={{ padding: '9px 14px', fontSize: 12 }} onClick={() => setStep(2)}>← Back</button>
              <button className="q-btn q-btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={() => setStep(4)}>
                Continue <QIcon name="arrow-right" size={12}/>
              </button>
            </div>
          </>}

          {step === 4 && <>
            <h1 style={{ fontSize: 52, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.05, margin: '0 0 14px',
              background: 'linear-gradient(180deg, #FFFFFF, #C084FF 80%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              What are you<br/>working toward?
            </h1>
            <p style={{ fontSize: 15, color: 'var(--q-text-2)', lineHeight: 1.55, maxWidth: 460, margin: '0 0 24px' }}>
              Pick your goals. Quark will build a mission plan for each one.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, maxWidth: 460, marginBottom: 28 }}>
              {Object.keys(goals).map(g => (
                <div key={g} onClick={() => toggleGoal(g)} style={{
                  padding: '11px 14px', borderRadius: 10, cursor: 'pointer',
                  background: goals[g] ? 'linear-gradient(180deg, rgba(157,77,255,0.14), rgba(157,77,255,0.04))' : 'rgba(7,2,15,0.4)',
                  border: `1px solid ${goals[g] ? 'var(--q-stroke-3)' : 'var(--q-stroke-1)'}`,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                    background: goals[g] ? 'rgba(157,77,255,0.5)' : 'rgba(168,85,247,0.06)',
                    border: `1px solid ${goals[g] ? 'var(--q-stroke-3)' : 'var(--q-stroke-2)'}`,
                    display: 'grid', placeItems: 'center', color: 'white',
                  }}>{goals[g] && <QIcon name="check" size={10} />}</span>
                  <span style={{ fontSize: 12.5, color: goals[g] ? 'var(--q-text-1)' : 'var(--q-text-2)' }}>{g}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="q-btn q-btn-ghost" style={{ padding: '9px 14px', fontSize: 12 }} onClick={() => setStep(3)}>← Back</button>
              <button className="q-btn q-btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={() => setStep(5)}>
                Set {goalCount} goals <QIcon name="arrow-right" size={12}/>
              </button>
            </div>
          </>}

          {step === 5 && <>
            <h1 style={{ fontSize: 52, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.05, margin: '0 0 14px',
              background: 'linear-gradient(180deg, #FFFFFF, #C084FF 80%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Meet Quark,<br/>your AI analyst.
            </h1>
            <p style={{ fontSize: 15, color: 'var(--q-text-2)', lineHeight: 1.55, maxWidth: 460, margin: '0 0 24px' }}>
              Quark runs continuously in the background — synthesizing insights, spotting risks, and surfacing opportunities before you ask.
            </p>
            <div className="q-card" style={{ padding: 16, maxWidth: 420, marginBottom: 28, borderColor: 'rgba(109,243,255,0.30)' }}>
              <div className="q-mono" style={{ fontSize: 9.5, letterSpacing: '0.18em', color: 'var(--q-accent-cyan)', marginBottom: 8 }}>QUARK · PREVIEW</div>
              <div style={{ fontSize: 13, color: 'var(--q-text-1)', lineHeight: 1.5 }}>
                "I've already spotted 2 risks and 1 opportunity in your connected accounts. Ready when you are."
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                <span className="q-chip">risk · floating rate</span>
                <span className="q-chip q-chip-cyan">opportunity · HYSA</span>
                <span className="q-chip q-chip-coral">leak · cloud storage</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="q-btn q-btn-ghost" style={{ padding: '9px 14px', fontSize: 12 }} onClick={() => setStep(4)}>← Back</button>
              <button className="q-btn q-btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={() => setStep(6)}>
                Talk to Quark <QIcon name="sparkle" size={13}/>
              </button>
            </div>
          </>}

          {step === 6 && <>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 20 }}>
              <span className="q-pulse-dot" />
              <span className="q-mono" style={{ fontSize: 11, color: 'var(--q-accent-emerald)', letterSpacing: '0.14em' }}>QUARK ONLINE · SYNTHESIZING</span>
            </div>
            <h1 style={{ fontSize: 52, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.05, margin: '0 0 14px',
              background: 'linear-gradient(180deg, #FFFFFF, #4ADE9B 80%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              You're all set,<br/>Mateo.
            </h1>
            <p style={{ fontSize: 15, color: 'var(--q-text-2)', lineHeight: 1.55, maxWidth: 460, margin: '0 0 24px' }}>
              {connCount} account{connCount !== 1 ? 's' : ''} connected · {goalCount} goal{goalCount !== 1 ? 's' : ''} set · {risk} profile.
              Quark has already started synthesizing your financial picture.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="q-btn q-btn-primary" style={{ padding: '12px 24px', fontSize: 14 }} onClick={nav}>
                Enter your finances <QIcon name="arrow-right" size={13}/>
              </button>
            </div>
          </>}
        </div>

        <OrbVisual step={step} connected={connected} />
      </div>

      {/* progress strip */}
      <div style={{ position: 'absolute', top: 32, right: 40, display: 'flex', gap: 4, zIndex: 3 }}>
        {[1,2,3,4,5,6].map(s => (
          <div key={s} onClick={() => setStep(s)} style={{
            width: 28, height: 3, borderRadius: 2, cursor: 'pointer',
            background: s <= step ? '#9D4DFF' : 'rgba(168,85,247,0.18)',
            boxShadow: s === step ? '0 0 6px #9D4DFF' : 'none',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 10. MOBILE — Dashboard
// ─────────────────────────────────────────────────────────────
function ScreenMobileDashboard() {
  const W = 390, H = 844;
  return (
    <div className="q-app" style={{ width: W, height: H, background: 'var(--q-bg-0)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <QAmbient intensity={0.9} />
      <QParticles count={14} seed={3} />

      {/* status bar */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', padding: '14px 22px 4px', fontSize: 13, fontWeight: 600 }}>
        <span className="q-mono">9:41</span>
        <span style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: 11 }}>● ● ● ⚡ 87</span>
      </div>

      {/* header */}
      <div style={{ position: 'relative', zIndex: 2, padding: '14px 22px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <QLogo size={28}/>
          <div style={{ flex: 1 }}>
            <div className="q-mono" style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--q-text-3)' }}>WED · NOV 18</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>Hi, Mateo</div>
          </div>
          <button className="q-btn q-btn-ghost" style={{ padding: 7 }}><QIcon name="bell" size={14}/></button>
        </div>

        <div className="q-card q-card-elev" style={{ padding: 18, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(157,77,255,0.4), transparent 70%)' }} />
          <div className="q-eyebrow q-eyebrow-violet">NET WORTH · USD</div>
          <div className="q-num" style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.03em', marginTop: 4,
            background: 'linear-gradient(180deg, #FFFFFF, #C084FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            $172,480
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <span style={{ color: 'var(--q-accent-emerald)', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <QIcon name="arrow-up" size={10}/> <span className="q-num">+4.8%</span>
            </span>
            <span style={{ fontSize: 11, color: 'var(--q-text-3)' }}>vs 30d</span>
          </div>
          <div style={{ marginTop: 12 }}>
            <QSparkline points={[82,86,89,92,97,101,104,112,121,131,148,172]} color="#C084FF" height={48} width={300} />
          </div>
        </div>
      </div>

      {/* AI nudge */}
      <div style={{ position: 'relative', zIndex: 2, padding: '8px 22px' }}>
        <div className="q-card" style={{ padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start',
          borderColor: 'rgba(109,243,255,0.30)' }}>
          <div style={{ width: 28, height: 28, flexShrink: 0 }}><QLogo size={28}/></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="q-mono" style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--q-accent-cyan)', marginBottom: 2 }}>QUARK · 14m</div>
            <div style={{ fontSize: 12, color: 'var(--q-text-1)', lineHeight: 1.4 }}>
              You spent <b>+38%</b> on food this week. Want a 60s breakdown?
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <button className="q-btn q-btn-primary" style={{ padding: '4px 10px', fontSize: 11 }}>Show me</button>
              <button className="q-btn q-btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }}>Later</button>
            </div>
          </div>
        </div>
      </div>

      {/* quick stats */}
      <div style={{ position: 'relative', zIndex: 2, padding: '8px 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { l:'CASH FLOW', v:'+$3.8k', c:'#4ADE9B', d:'+12%' },
          { l:'BURN', v:'$6.3k', c:'#FF7AE6', d:'-3.4%' },
        ].map((s,i)=>(
          <div key={i} className="q-card" style={{ padding: 12 }}>
            <div className="q-eyebrow">{s.l}</div>
            <div className="q-num" style={{ fontSize: 18, fontWeight: 600, color: s.c, marginTop: 2 }}>{s.v}</div>
            <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)', marginTop: 1 }}>{s.d} · 30d</div>
          </div>
        ))}
      </div>

      {/* recent */}
      <div style={{ position: 'relative', zIndex: 2, padding: '12px 22px', flex: 1, overflow: 'hidden' }}>
        <div className="q-eyebrow" style={{ marginBottom: 8 }}>RECENT · TODAY</div>
        <div className="q-stack-sm">
          {[
            { m:'Sushi Norte',     a:-184, t:'19:42', c:'#FF7AE6' },
            { m:'Salary · Acme',   a:+8400, t:'09:00', c:'#4ADE9B' },
            { m:'Spotify Family',  a:-17,  t:'07:12', c:'#C084FF' },
            { m:'Mercado del Río', a:-96,  t:'12:30', c:'#FF7AE6' },
          ].map((tx,i)=>(
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
              borderBottom: i < 3 ? '1px dashed var(--q-stroke-1)' : 'none' }}>
              <span style={{ width: 32, height: 32, borderRadius: 8, background: `${tx.c}20`, display: 'grid', placeItems: 'center', color: tx.c, flexShrink: 0 }}>
                <QIcon name="wallet" size={13}/>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: 'var(--q-text-1)' }}>{tx.m}</div>
                <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)' }}>{tx.t}</div>
              </div>
              <div className="q-mono q-num" style={{ fontSize: 13, fontWeight: 500,
                color: tx.a > 0 ? 'var(--q-accent-emerald)' : 'var(--q-text-1)' }}>
                {tx.a > 0 ? '+' : ''}${Math.abs(tx.a).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* tab bar */}
      <div style={{ position: 'relative', zIndex: 2, padding: '8px 14px 26px',
        background: 'linear-gradient(180deg, transparent, rgba(11,6,23,0.8))',
        borderTop: '1px solid var(--q-stroke-1)' }}>
        <div className="q-card" style={{ padding: '8px 6px', display: 'flex', justifyContent: 'space-around' }}>
          {[
            { i:'home',     l:'Home',     a:true },
            { i:'chart',    l:'Stats' },
            { i:'spark',    l:'Quark', highlight:true },
            { i:'flag',     l:'Goals' },
            { i:'gear',     l:'More' },
          ].map((t,i)=>(
            <button key={i} style={{ background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 10px',
              color: t.a ? 'var(--q-violet-300)' : 'var(--q-text-3)',
              fontFamily: 'inherit', fontSize: 9.5,
              position: 'relative',
            }}>
              {t.highlight && (
                <span style={{ position: 'absolute', top: -16, width: 40, height: 40, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #9D4DFF, #6020E0)',
                  display: 'grid', placeItems: 'center', boxShadow: '0 0 16px rgba(157,77,255,0.7)' }}>
                  <QIcon name="sparkle" size={18}/>
                </span>
              )}
              {!t.highlight && <QIcon name={t.i} size={18}/>}
              <span style={{ marginTop: t.highlight ? 24 : 0 }}>{t.l}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Mobile · Quark chat
function ScreenMobileQuark() {
  const W = 390, H = 844;
  return (
    <div className="q-app" style={{ width: W, height: H, background: 'var(--q-bg-0)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <QAmbient intensity={1.2} />
      <QParticles count={20} seed={4} />

      {/* status */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', padding: '14px 22px 4px', fontSize: 13, fontWeight: 600 }}>
        <span className="q-mono">9:41</span>
        <span style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: 11 }}>● ● ● ⚡ 87</span>
      </div>

      {/* header */}
      <div style={{ position: 'relative', zIndex: 2, padding: '12px 22px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className="q-btn q-btn-ghost" style={{ padding: 6 }}><QIcon name="arrow-right" size={13}/></button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <QLogo size={26}/>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Quark</div>
            <div className="q-mono" style={{ fontSize: 9, color: 'var(--q-accent-emerald)', letterSpacing: '0.14em' }}>● ONLINE · 142ms</div>
          </div>
        </div>
        <button className="q-btn q-btn-ghost" style={{ padding: 6 }}><QIcon name="cpu" size={13}/></button>
      </div>

      {/* core orb */}
      <div style={{ position: 'relative', zIndex: 2, padding: '0 22px', display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
        <div style={{ position: 'relative', width: 120, height: 120 }}>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="60" cy="60" r="55" fill="none" stroke="rgba(192,132,252,0.18)" strokeDasharray="2 4" />
            {[0,1,2].map(i=>(
              <circle key={i} cx="60" cy="60" r={20+i*12} fill="none" stroke="#9D4DFF" opacity="0.3">
                <animate attributeName="r" values={`${20+i*12};${50+i*4};${20+i*12}`} dur="4s" begin={`${i*0.6}s`} repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.4;0;0.4" dur="4s" begin={`${i*0.6}s`} repeatCount="indefinite"/>
              </circle>
            ))}
          </svg>
          <div style={{ position: 'absolute', inset: 28, borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #FFFFFF, #C084FF 35%, #6020E0 80%)',
            boxShadow: '0 0 30px rgba(157,77,255,0.7)',
            animation: 'q-pulse 3s ease-in-out infinite' }} />
        </div>
      </div>

      {/* messages */}
      <div className="q-stack-md" style={{ position: 'relative', zIndex: 2, flex: 1, padding: '8px 22px', overflow: 'auto' }}>
        <QMsg from="user">am I going to make rent next month?</QMsg>
        <QMsg from="ai">
          <div className="q-num" style={{ fontSize: 22, fontWeight: 600, color: 'var(--q-accent-emerald)', marginBottom: 2 }}>Yes · P=0.97</div>
          <div style={{ fontSize: 12, color: 'var(--q-text-2)', lineHeight: 1.5 }}>
            Buffer of <b className="q-num">$3,184</b> after rent and recurring. Salary lands Dec 1, rent due Dec 5. Tightest day: Nov 28.
          </div>
          <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
            <span className="q-chip">trace · 6 sources</span>
            <span className="q-chip q-chip-emerald">conf 0.97</span>
          </div>
        </QMsg>
        <QMsg from="user">how do I improve next month?</QMsg>
        <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 4 }}>
          {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--q-violet-300)', animation: `q-typing-dot 1.4s ${i*0.18}s ease-in-out infinite` }} />)}
        </div>
      </div>

      {/* input */}
      <div style={{ position: 'relative', zIndex: 2, padding: '8px 14px 24px', borderTop: '1px solid var(--q-stroke-1)',
        background: 'linear-gradient(180deg, transparent, rgba(11,6,23,0.6))' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center',
          background: 'rgba(7,2,15,0.6)', border: '1px solid var(--q-stroke-2)',
          borderRadius: 22, padding: '8px 10px',
          boxShadow: '0 0 0 3px rgba(157,77,255,0.06), inset 0 0 12px rgba(157,77,255,0.04)' }}>
          <QIcon name="sparkle" size={13}/>
          <span style={{ flex: 1, fontSize: 13, color: 'var(--q-text-3)' }}>Ask anything…</span>
          <button className="q-btn q-btn-primary" style={{ padding: '6px 12px', borderRadius: 18 }}><QIcon name="send" size={11}/></button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenMissions, ScreenModels, ScreenOnboarding, ScreenMobileDashboard, ScreenMobileQuark });
