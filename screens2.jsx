// Quark Finance — screens2.jsx
// Insights graph, Risk Radar, Digital Twin, Timeline, Missions, AI Models, Onboarding.

// ─────────────────────────────────────────────────────────────
// 3. QUANTUM INSIGHTS
// ─────────────────────────────────────────────────────────────
function ScreenInsights() {
  const [selected, setSelected] = React.useState(null);
  const [filter, setFilter] = React.useState('ALL');
  React.useEffect(() => { window.__qSelectInsight = setSelected; return () => { window.__qSelectInsight = null; }; }, []);
  const toast = (typeof useToast === 'function') ? useToast() : (() => {});

  const allCorrelations = [
    { a: 'Stress index', b: 'Liquidity risk', r: 0.81, dir: '↑', tone: 'coral', cat: 'RISK',
      why: 'When stress > P75, you draw from emergency fund within 4d (n=11).' },
    { a: 'Subscriptions', b: 'Stress index', r: 0.62, dir: '↑', tone: 'pink', cat: 'SPEND',
      why: 'Each new sub adds +0.34 to stress 30d later.' },
    { a: 'Savings', b: 'Down payment', r: 0.92, dir: '↑', tone: 'emerald', cat: 'GOALS',
      why: 'Goal velocity tracks savings rate at +1d lag.' },
    { a: 'Food spend', b: 'Sleep < 6h', r: 0.54, dir: '↑', tone: 'violet', cat: 'SPEND',
      why: '+38% delivery on low-sleep days (cross-source).' },
    { a: 'Index DCA', b: 'Twin trajectory', r: 0.88, dir: '↑', tone: 'cyan', cat: 'INCOME',
      why: 'Strongest single lever on 10y digital twin.' },
  ];
  const correlations = filter === 'ALL' ? allCorrelations : allCorrelations.filter(c => c.cat === filter);

  return (
    <QShell active="insights" topbarProps={{
      breadcrumb: 'AI / QUANTUM INSIGHTS',
      title: 'Hidden correlations',
      subtitle: '47 nodes · 184 edges · drag any sphere · tap to manage',
      actions: <>
        <button className="q-btn q-btn-ghost" onClick={()=>toast('Window: 90 days')}><QIcon name="orbit" size={12}/> 90d window</button>
        <button className="q-btn" onClick={()=>toast('Re-synthesizing graph…')}><QIcon name="sparkle" size={12}/> Re-synthesize</button>
      </>,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, height: '100%' }}>
        <div className="q-card q-card-elev" style={{ padding: 18, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <QSectionHead eyebrow="NEURAL FINANCIAL GRAPH" title="What's connected to what" ai
            action={<div style={{ display: 'flex', gap: 4 }}>
              {['ALL','INCOME','SPEND','RISK','GOALS'].map((t)=>(
                <button key={t} onClick={()=>setFilter(t)} className="q-btn q-btn-ghost" style={{ padding:'3px 9px', fontSize:10,
                  background: filter===t?'rgba(157,77,255,0.18)':'transparent',
                  color: filter===t?'var(--q-violet-300)':'var(--q-text-3)' }}>{t}</button>
              ))}
            </div>} />
          <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
            <QInteractiveInsights width={780} height={500} onSelect={(n)=>{
              if (window.__qSelectInsight) window.__qSelectInsight(n);
            }} />
          </div>
          {/* legend */}
          <div style={{ display: 'flex', gap: 16, fontSize: 10, color: 'var(--q-text-3)', flexWrap: 'wrap', marginTop: 8 }}>
            {[
              ['Income','#6DF3FF'],['Metric','#C084FF'],['Spend','#FF7AE6'],
              ['Signal','#FFB547'],['Goal','#4ADE9B'],['Risk','#FF5A6E'],
              ['Asset','#9D4DFF'],['AI','#FFFFFF'],
            ].map(([l,c])=>(
              <span key={l} style={{ display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:c, boxShadow:`0 0 4px ${c}` }} />{l}
              </span>
            ))}
          </div>
        </div>

        {/* synthesized correlations panel */}
        <div className="q-card q-card-elev" style={{ padding: 14, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {selected ? (
            <>
              <QSectionHead eyebrow="MANAGE NODE" title={selected.label} ai
                action={<button className="q-btn q-btn-ghost" style={{ padding:'3px 8px', fontSize:10 }} onClick={()=>setSelected(null)}>✕</button>} />
              <div style={{ padding:'10px 12px', background:'rgba(7,2,15,0.4)', borderRadius:10, border:'1px solid var(--q-stroke-1)', marginBottom:10 }}>
                <div className="q-eyebrow q-eyebrow-violet" style={{ marginBottom:4 }}>{selected.type.toUpperCase()}</div>
                <div className="q-num" style={{ fontSize:22, fontWeight:600, letterSpacing:'-0.02em' }}>{selected.val}</div>
                <div className="q-mono" style={{ fontSize:10, color:'var(--q-text-3)', marginTop:4 }}>weight {selected.w.toFixed(2)} · 12 connected signals</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:10 }}>
                <button className="q-btn" onClick={()=>toast(`Tracking ${selected.label}`)}><QIcon name="orbit" size={11}/> Track</button>
                <button className="q-btn q-btn-ghost" onClick={()=>toast('Alert rule created')}>Alert rule</button>
                <button className="q-btn q-btn-ghost" onClick={()=>toast('Drilling into transactions…')}>Drill in</button>
                <button className="q-btn q-btn-ghost" onClick={()=>toast('Excluded from twin')}>Mute in twin</button>
              </div>
              <div className="q-scroll q-stack-sm" style={{ overflow:'auto', flex:1, paddingRight:4 }}>
                <div style={{ padding:'10px 12px', background:'rgba(7,2,15,0.4)', borderRadius:10, border:'1px solid var(--q-stroke-1)' }}>
                  <div className="q-eyebrow" style={{ marginBottom:6 }}>QUARK · WHY THIS MATTERS</div>
                  <div style={{ fontSize:11.5, color:'var(--q-text-2)', lineHeight:1.55 }}>
                    Nudging <b style={{color:'var(--q-text-1)'}}>{selected.label}</b> by ±10% propagates through {selected.type==='income'?5:selected.type==='goal'?4:3} downstream nodes within 30d. Strongest leverage: <b style={{color:'var(--q-violet-300)'}}>Digital twin</b>.
                  </div>
                </div>
                <div style={{ padding:'10px 12px', background:'rgba(7,2,15,0.4)', borderRadius:10, border:'1px solid var(--q-stroke-1)' }}>
                  <div className="q-eyebrow" style={{ marginBottom:6 }}>RECENT</div>
                  {[
                    ['7d', '+2.4%'], ['30d', '+6.1%'], ['90d', '-1.2%'],
                  ].map(([k,v],i)=>(
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', fontSize:11.5 }}>
                      <span className="q-mono" style={{ color:'var(--q-text-3)' }}>{k}</span>
                      <span className="q-num" style={{ color: v.startsWith('-')?'var(--q-accent-coral)':'var(--q-accent-emerald)' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
          <QSectionHead eyebrow="SYNTHESIZED" title="Top correlations" ai
            action={<span className="q-mono" style={{fontSize:10,color:'var(--q-text-3)'}}>tap a sphere</span>} />
          <div className="q-scroll q-stack-sm" style={{ overflow: 'auto', flex: 1, paddingRight: 4 }}>
            {correlations.length === 0 && (
              <div style={{ textAlign:'center', padding:'40px 0', color:'var(--q-text-3)', fontSize:12 }}>No correlations in {filter} category</div>
            )}
            {correlations.map((c,i)=>(
              <div key={i} style={{ padding: '10px 12px', background: 'rgba(7,2,15,0.4)', borderRadius: 10, border: '1px solid var(--q-stroke-1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span className="q-mono q-num" style={{ fontSize: 14, fontWeight: 600, color: `var(--q-accent-${c.tone === 'violet' ? 'pink' : c.tone})` }}>r = {c.r.toFixed(2)}</span>
                  <span className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)' }}>{c.dir} causal</span>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--q-text-1)', marginBottom: 4 }}>
                  <b>{c.a}</b> ↔ <b>{c.b}</b>
                </div>
                <div style={{ fontSize: 11, color: 'var(--q-text-3)', lineHeight: 1.45 }}>{c.why}</div>
              </div>
            ))}
          </div>
            </>
          )}
        </div>
      </div>
    </QShell>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. RISK RADAR — interactive, categorized, expandable
// ─────────────────────────────────────────────────────────────
const RADAR_RISKS = [
  { id:'r1', sev:'high', cat:'rate',    t:'Loan #2 · floating rate refresh', a:310, p:0.62, days:22, since:'14d',
    desc:'Variable-rate loan resets +95bps if Fed pauses through summer. Refinance window closes soon.',
    fix:'Refi at 4.9% fixed → save $84/mo for 48mo. Worst case +$310/mo.',
    actions:['Run refi sim','Lock rate','Snooze 7d'] },
  { id:'r2', sev:'high', cat:'leak',    t:'Cloud storage 2TB · 14m unused', a:120, p:0.98, days:0,  since:'420d',
    desc:'Files have not been touched in 14 months. Auto-renewal in 18 days.',
    fix:'Downgrade to 200GB plan ($3/mo) or cancel · saves $117/mo.',
    actions:['Cancel now','Downgrade','Audit files'] },
  { id:'r3', sev:'med',  cat:'pattern', t:'Coffee streak ↑37%', a:184, p:0.81, days:14, since:'14d',
    desc:'14-day daily-cafe streak. At current pace: +$184/mo over baseline.',
    fix:'Cap to 4d/wk → -$92/mo. Habit replacement nudge available.',
    actions:['Set cap','Block weekends','Mute alert'] },
  { id:'r4', sev:'med',  cat:'fee',     t:'FX fees on intl transactions', a:22, p:0.95, days:0, since:'90d',
    desc:'Last 90d: 14 international charges, ~3% FX markup on each.',
    fix:'Switch to Wise/Schwab debit · 0% FX → saves $22/mo.',
    actions:['Connect Wise','Switch card','Tag as expected'] },
  { id:'r5', sev:'low',  cat:'subs',    t:'Streaming bundle overlap', a:48, p:0.88, days:0, since:'180d',
    desc:'HBO Max + Disney+ + Hulu Live · overlap on 4 shows last 60d.',
    fix:'Drop Hulu Live, keep two → saves $48/mo.',
    actions:['Drop Hulu Live','Switch to bundle','Keep all'] },
  { id:'r6', sev:'low',  cat:'subs',    t:'Forgotten gym membership', a:29, p:0.99, days:0, since:'240d',
    desc:'Last gym checkin: 240 days ago. Membership still active.',
    fix:'Cancel · saves $29/mo. ClassPass alternative available.',
    actions:['Cancel','Pause 3mo','Switch to ClassPass'] },
  { id:'r7', sev:'low',  cat:'overlap', t:'Insurance overlap (auto)', a:67, p:0.74, days:30, since:'365d',
    desc:'Auto policy + employer benefits overlap on rental coverage.',
    fix:'Drop rental rider on auto → saves $67/mo.',
    actions:['Drop rider','Compare quotes','Keep'] },
];

function ScreenRadar() {
  const toast = (typeof useToast === 'function') ? useToast() : (() => {});
  const [sevFilter, setSevFilter] = React.useState('ALL');
  const [catFilter, setCatFilter] = React.useState('ALL');
  const [expanded, setExpanded] = React.useState('r1');

  const filtered = RADAR_RISKS.filter(r =>
    (sevFilter === 'ALL' || r.sev === sevFilter.toLowerCase()) &&
    (catFilter === 'ALL' || r.cat === catFilter.toLowerCase())
  );
  const totalAtRisk = filtered.reduce((s, r) => s + r.a * r.p, 0);
  const totalRecovered = filtered.reduce((s, r) => s + r.a, 0);
  const sevC = (s) => s==='high'?'#FF5A6E':s==='med'?'#FFB547':'#6DF3FF';
  const catIcon = { rate:'orbit', leak:'wallet', pattern:'chart', fee:'cpu', subs:'flag', overlap:'orbit' };

  const counts = {
    high: RADAR_RISKS.filter(r => r.sev==='high').length,
    med: RADAR_RISKS.filter(r => r.sev==='med').length,
    low: RADAR_RISKS.filter(r => r.sev==='low').length,
  };
  const cats = ['ALL', ...new Set(RADAR_RISKS.map(r => r.cat.toUpperCase()))];

  return (
    <QShell active="radar" topbarProps={{
      breadcrumb: 'INTELLIGENCE / RISK RADAR',
      title: 'Active threats & leaks',
      subtitle: `${RADAR_RISKS.length} signals · $${RADAR_RISKS.reduce((s,r)=>s+r.a,0)}/mo at stake · live scan`,
      actions: <>
        <button className="q-btn q-btn-ghost" onClick={()=>toast('Window: 90d')}>Last 90d</button>
        <button className="q-btn" onClick={()=>toast(`Resolved ${counts.low} low signals`)}><QIcon name="check" size={12}/> Resolve all low</button>
      </>,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, height: '100%' }}>
        {/* LEFT — Radar viz + summary cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
          <div className="q-card q-card-elev" style={{ padding: 16 }}>
            <QSectionHead eyebrow="ORBITAL SCAN" title="Live threat map" ai
              action={<span className="q-mono" style={{ fontSize: 10, color: 'var(--q-accent-emerald)' }}>● SCANNING</span>} />
            <div style={{ position: 'relative', display:'flex', alignItems:'center', justifyContent:'center', minHeight: 280 }}>
              <QRiskRadar size={300} />
              {/* Overlay: clickable risk dots */}
              <svg width="300" height="300" viewBox="0 0 300 300" style={{ position:'absolute', inset:0, margin:'auto', pointerEvents:'none' }}>
                {RADAR_RISKS.map((r, i) => {
                  const angle = (i / RADAR_RISKS.length) * Math.PI * 2 - Math.PI/2;
                  const radius = r.sev==='high' ? 60 : r.sev==='med' ? 95 : 130;
                  const x = 150 + Math.cos(angle) * radius;
                  const y = 150 + Math.sin(angle) * radius;
                  const c = sevC(r.sev);
                  const isExp = expanded === r.id;
                  return (
                    <g key={r.id} style={{ pointerEvents:'auto', cursor:'pointer' }} onClick={() => setExpanded(r.id)}>
                      {isExp && <circle cx={x} cy={y} r={14} fill="none" stroke={c} strokeWidth="1" opacity="0.7">
                        <animate attributeName="r" values={`12;20;12`} dur="2s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="indefinite"/>
                      </circle>}
                      <circle cx={x} cy={y} r={isExp?7:5} fill={c} style={{ filter:`drop-shadow(0 0 ${isExp?10:6}px ${c})` }} />
                      <circle cx={x} cy={y} r={isExp?3:2} fill="#0B0617" />
                    </g>
                  );
                })}
              </svg>
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'center', fontSize:10.5, color:'var(--q-text-3)', marginTop:4 }}>
              <span style={{ display:'flex', gap:5, alignItems:'center' }}><span style={{ width:7, height:7, borderRadius:'50%', background:'#FF5A6E', boxShadow:'0 0 6px #FF5A6E' }} /> {counts.high} high</span>
              <span style={{ display:'flex', gap:5, alignItems:'center' }}><span style={{ width:7, height:7, borderRadius:'50%', background:'#FFB547', boxShadow:'0 0 6px #FFB547' }} /> {counts.med} med</span>
              <span style={{ display:'flex', gap:5, alignItems:'center' }}><span style={{ width:7, height:7, borderRadius:'50%', background:'#6DF3FF', boxShadow:'0 0 6px #6DF3FF' }} /> {counts.low} low</span>
            </div>
          </div>

          {/* Summary KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="q-card q-card-elev" style={{ padding: 14 }}>
              <div className="q-eyebrow q-eyebrow-coral">EXPOSURE · WEIGHTED</div>
              <div className="q-num" style={{ fontSize: 22, fontWeight: 600, color: '#FF5A6E', marginTop: 4 }}>${totalAtRisk.toFixed(0)}/mo</div>
              <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)' }}>Σ amount × probability</div>
            </div>
            <div className="q-card q-card-elev" style={{ padding: 14 }}>
              <div className="q-eyebrow q-eyebrow-emerald">RECOVERABLE · MAX</div>
              <div className="q-num" style={{ fontSize: 22, fontWeight: 600, color: '#4ADE9B', marginTop: 4 }}>${totalRecovered}/mo</div>
              <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)' }}>if all resolved</div>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="q-card q-card-elev" style={{ padding: 14, flex: 1, minHeight: 0 }}>
            <QSectionHead eyebrow="BY CATEGORY" title="Where leaks come from" />
            <div className="q-stack-sm">
              {Array.from(new Set(RADAR_RISKS.map(r => r.cat))).map(cat => {
                const items = RADAR_RISKS.filter(r => r.cat === cat);
                const total = items.reduce((s, r) => s + r.a, 0);
                const maxTotal = Math.max(...Array.from(new Set(RADAR_RISKS.map(r => r.cat)))
                  .map(c => RADAR_RISKS.filter(r => r.cat === c).reduce((s, r) => s + r.a, 0)));
                const pct = (total / maxTotal) * 100;
                const c = items.some(i=>i.sev==='high') ? '#FF5A6E' : items.some(i=>i.sev==='med') ? '#FFB547' : '#6DF3FF';
                return (
                  <button key={cat} onClick={()=>setCatFilter(cat.toUpperCase())} style={{
                    display:'flex', alignItems:'center', gap:8, padding:'7px 10px',
                    background: catFilter===cat.toUpperCase()?'rgba(157,77,255,0.12)':'rgba(7,2,15,0.4)',
                    borderRadius:8, border:`1px solid ${catFilter===cat.toUpperCase()?'var(--q-stroke-3)':'var(--q-stroke-1)'}`,
                    fontFamily:'inherit', cursor:'pointer', textAlign:'left', color:'inherit', width:'100%',
                  }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: `${c}20`, display:'grid', placeItems:'center', color: c }}>
                      <QIcon name={catIcon[cat] || 'orbit'} size={11}/>
                    </span>
                    <span style={{ width: 80, fontSize: 11.5, color: 'var(--q-text-1)', textTransform:'capitalize' }}>{cat}</span>
                    <div style={{ flex: 1, height: 4, background: 'rgba(168,85,247,0.10)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: pct + '%', height: '100%', background: c, boxShadow: `0 0 6px ${c}` }} />
                    </div>
                    <span className="q-mono q-num" style={{ fontSize: 11, color: 'var(--q-text-1)', width: 56, textAlign: 'right' }}>${total}/mo</span>
                    <span className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)', width: 18, textAlign: 'right' }}>{items.length}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — Filterable risk list with expanded detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          <div className="q-card q-card-elev" style={{ padding: 14 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
              {['ALL','HIGH','MED','LOW'].map(s => (
                <button key={s} onClick={()=>setSevFilter(s)} className="q-btn q-btn-ghost" style={{
                  padding:'4px 11px', fontSize:11,
                  background: sevFilter===s ? (s==='HIGH'?'rgba(255,90,110,0.18)':s==='MED'?'rgba(255,181,71,0.18)':s==='LOW'?'rgba(109,243,255,0.18)':'rgba(157,77,255,0.18)') : 'transparent',
                  color: sevFilter===s ? (s==='HIGH'?'#FF5A6E':s==='MED'?'#FFB547':s==='LOW'?'#6DF3FF':'var(--q-violet-300)') : 'var(--q-text-3)',
                }}>{s} {s!=='ALL' ? `· ${counts[s.toLowerCase()]}` : ''}</button>
              ))}
              <div style={{ flex: 1 }} />
              {catFilter !== 'ALL' && (
                <button className="q-btn q-btn-ghost" style={{ padding:'4px 9px', fontSize:10 }} onClick={()=>setCatFilter('ALL')}>
                  {catFilter} ✕
                </button>
              )}
            </div>
          </div>

          <div className="q-card q-card-elev q-scroll" style={{ padding: 12, flex: 1, overflow: 'auto', minHeight: 0 }}>
            <div className="q-stack-sm">
              {filtered.length === 0 && (
                <div style={{ textAlign:'center', padding:'40px 0', color:'var(--q-text-3)', fontSize: 12 }}>
                  No risks in this filter
                </div>
              )}
              {filtered.map(r => {
                const c = sevC(r.sev);
                const isExp = expanded === r.id;
                return (
                  <div key={r.id} style={{
                    background: isExp ? `linear-gradient(180deg, ${c}10, rgba(7,2,15,0.4))` : 'rgba(7,2,15,0.4)',
                    borderRadius: 10,
                    border: `1px solid ${isExp ? c+'50' : 'var(--q-stroke-1)'}`,
                    transition: 'all 0.2s',
                  }}>
                    <button onClick={()=>setExpanded(isExp ? null : r.id)} style={{
                      width:'100%', padding:'11px 13px', display:'flex', alignItems:'center', gap:10,
                      background:'transparent', border:'none', fontFamily:'inherit', cursor:'pointer',
                      color:'inherit', textAlign:'left',
                    }}>
                      <span style={{ width:8, height:8, borderRadius:'50%', background:c, boxShadow:`0 0 6px ${c}`, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, color: 'var(--q-text-1)', fontWeight: 500 }}>{r.t}</div>
                        <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)', marginTop: 2 }}>
                          {r.cat} · {r.since} old · P={r.p.toFixed(2)}{r.days>0?` · ${r.days}d window`:''}
                        </div>
                      </div>
                      <span className="q-mono q-num" style={{ fontSize: 13, fontWeight: 500, color: c }}>+${r.a}/mo</span>
                      <span style={{ color: 'var(--q-text-3)', transform: isExp?'rotate(90deg)':'rotate(0)', transition: 'transform 0.2s' }}>
                        <QIcon name="arrow-right" size={11}/>
                      </span>
                    </button>
                    {isExp && (
                      <div style={{ padding: '0 13px 13px', animation: 'q-fade-up 0.2s ease-out' }}>
                        <div style={{ fontSize: 11.5, color: 'var(--q-text-2)', lineHeight: 1.55, marginBottom: 10 }}>
                          {r.desc}
                        </div>
                        <div style={{ padding: '10px 12px', background: 'rgba(7,2,15,0.5)', borderRadius: 8, border: `1px dashed ${c}40`, marginBottom: 10 }}>
                          <div className="q-eyebrow" style={{ marginBottom: 4, color: c }}>QUARK · RECOMMENDED FIX</div>
                          <div style={{ fontSize: 11.5, color: 'var(--q-text-1)', lineHeight: 1.5 }}>{r.fix}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {r.actions.map((a, i) => (
                            <button key={i} className={i===0 ? 'q-btn q-btn-primary' : 'q-btn q-btn-ghost'}
                              style={{ padding: '5px 11px', fontSize: 11 }}
                              onClick={(e) => { e.stopPropagation(); toast(`${a}: ${r.t}`); }}>
                              {a}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </QShell>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. DIGITAL TWIN — Standard / Personalizado / Pseudo-Mateo
// ─────────────────────────────────────────────────────────────
function ScreenTwin() {
  const toast = (typeof useToast === 'function') ? useToast() : (() => {});
  const N = 36;
  const [profile, setProfile] = React.useState('standard');
  const [sliders, setSliders] = React.useState({ dca: 35, coffee: 25, equity: 72, retire: 52 });
  const setSlider = (k, v) => setSliders(s => ({ ...s, [k]: v }));
  const [prompt, setPrompt] = React.useState('');
  const [customScenario, setCustomScenario] = React.useState(null);
  const [pseudoRunning, setPseudoRunning] = React.useState(false);

  const dcaVal = () => '$' + Math.round(sliders.dca / 100 * 4000);
  const coffeeVal = () => '$' + Math.round(sliders.coffee / 100 * 300);
  const equityVal = () => sliders.equity + '%';
  const retireVal = () => Math.round(45 + sliders.retire / 100 * 25) + '';

  // Profile-driven multipliers
  const standardSpeed = 1 + (sliders.dca - 35) * 0.01 - (sliders.coffee - 25) * 0.005 + (sliders.equity - 72) * 0.008;
  const customSpeed = customScenario ? customScenario.speed : 1;
  const pseudoSpeed = 0.94; // pseudo-Mateo simulates real-life drift: mild underperformance from habit/stress

  const speedFactor = profile === 'custom' ? customSpeed : profile === 'pseudo' ? pseudoSpeed : standardSpeed;
  const volMul = profile === 'custom' ? 1.4 : profile === 'pseudo' ? 1.6 : 1;

  const base = Array.from({ length: N }, (_, i) => 172 + i * 3.2 * speedFactor + Math.sin(i / 3) * 4 * volMul);
  const bull = Array.from({ length: N }, (_, i) => 172 + i * 5.4 * speedFactor + Math.sin(i / 3) * 4 * volMul);
  const bear = Array.from({ length: N }, (_, i) => 172 + i * 1.4 * speedFactor + Math.sin(i / 4) * 5 * volMul);
  const aggressive = Array.from({ length: N }, (_, i) => 172 + i * 4.8 * speedFactor + Math.sin(i / 3) * 4 * volMul);
  const conservative = Array.from({ length: N }, (_, i) => 172 + i * 2.2 * speedFactor + Math.sin(i / 4) * 3 * volMul);
  const p50Final = Math.round(base[N-1]);
  const delta = Math.round((speedFactor - 1) * 24810);

  // Custom prompt simulator
  const runCustomPrompt = () => {
    if (!prompt.trim()) return;
    const p = prompt.toLowerCase();
    let speed = 1, summary = '';
    if (/promot|raise|bonus|increase income|aument|asciens|sub.+sueld/.test(p)) {
      speed = 1.34; summary = 'Income +18% → DCA ramps · 36mo +$78k vs base.';
    } else if (/quit|leave job|sabbatical|sabb|deja|renunc|descans/.test(p)) {
      speed = 0.42; summary = '6mo runway burn · twin recovers by mo 18, lags base by $42k.';
    } else if (/house|home|down.?payment|casa|hipotec/.test(p)) {
      speed = 0.78; summary = 'Down payment locks $50k liquid · NW pace -22% during build.';
    } else if (/baby|child|kid|hijo|nin/.test(p)) {
      speed = 0.71; summary = 'New dependent · cash flow -$1.4k/mo for 18mo.';
    } else if (/invest|crypto|aggress|inversion|cripto|riesgo/.test(p)) {
      speed = 1.22; summary = 'Higher risk allocation · variance ↑ 2.4×, expected return +$48k.';
    } else if (/save|frugal|cut|ahorr|recort/.test(p)) {
      speed = 1.18; summary = 'Frugal mode · -20% discretionary, +$32k @ 36mo.';
    } else {
      speed = 1.05; summary = 'Quark synthesized your scenario · mild upside detected.';
    }
    setCustomScenario({ prompt, speed, summary });
    toast('Scenario simulated · 10k paths');
  };

  // Pseudo-Mateo behavioral predictions
  const pseudoBehaviors = [
    { icon:'☕', label:'Coffee streak persists', impact:'-$1.2k/yr',  prob:0.84 },
    { icon:'🍣', label:'+1 dinner/mo on stress weeks', impact:'-$2.4k/yr', prob:0.71 },
    { icon:'💸', label:'Misses DCA in 2 mos/yr', impact:'-$3.8k @ 10y', prob:0.62 },
    { icon:'📺', label:'Adds 1 streaming sub/yr', impact:'-$240/yr',   prob:0.78 },
    { icon:'✈️', label:'Vacation overspend in summer', impact:'-$1.6k', prob:0.66 },
    { icon:'🎁', label:'Q4 gift season +$800', impact:'-$800/yr', prob:0.92 },
  ];

  return (
    <QShell active="twin" topbarProps={{
      breadcrumb: 'INTELLIGENCE / DIGITAL TWIN',
      title: 'Your financial twin · 36mo horizon',
      subtitle: 'Monte Carlo · 10,000 paths · refreshed nightly',
      actions: <>
        <button className="q-btn q-btn-ghost" onClick={()=>toast('Comparing all profiles')}><QIcon name="orbit" size={12}/> Compare</button>
        <button className="q-btn" onClick={()=>toast('Running fresh scenario · 10k paths')}><QIcon name="sparkle" size={12}/> Run scenario</button>
      </>,
    }}>
      {/* Profile selector */}
      <div style={{ display:'flex', gap: 8, marginBottom: 14 }}>
        {[
          { k:'standard', l:'Mateo Standard',  s:'Sliders + manual scenario', c:'#9D4DFF', icon:'⚙️' },
          { k:'custom',   l:'Personalizado',   s:'Describe a scenario in words', c:'#6DF3FF', icon:'✨' },
          { k:'pseudo',   l:'Pseudo-Mateo',    s:'AI predicts your real behavior', c:'#FF7AE6', icon:'🧠' },
        ].map(t => (
          <button key={t.k} onClick={() => setProfile(t.k)} className="q-card" style={{
            flex: 1, padding: '12px 14px', textAlign: 'left',
            borderColor: profile === t.k ? t.c+'80' : 'var(--q-stroke-1)',
            background: profile === t.k ? `linear-gradient(180deg, ${t.c}18, ${t.c}05)` : undefined,
            cursor: 'pointer', fontFamily: 'inherit', color: 'inherit',
            boxShadow: profile === t.k ? `0 0 0 1px ${t.c}40, 0 0 18px ${t.c}30` : 'none',
            transition: 'all 0.2s',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 2 }}>
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: profile===t.k?'var(--q-text-1)':'var(--q-text-2)' }}>{t.l}</span>
              {profile === t.k && <span className="q-pulse-dot" style={{ marginLeft:'auto', background: t.c }} />}
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--q-text-3)' }}>{t.s}</div>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          <div className="q-card q-card-elev" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <div>
                <div className="q-eyebrow q-eyebrow-cyan">
                  FORECAST CONE · {profile==='custom'?'CUSTOM SCENARIO':profile==='pseudo'?'PSEUDO-MATEO REAL':'STANDARD MODEL'}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4 }}>
                  <span className="q-num" style={{ fontSize: 26, fontWeight: 600 }}>${(p50Final * 1000).toLocaleString()}</span>
                  <span className="q-mono" style={{ fontSize: 11, color: 'var(--q-text-3)' }}>P50 @ Nov 2029</span>
                  {profile === 'pseudo' && <span className="q-chip q-chip-coral">behavioral drag −6%</span>}
                  {profile === 'custom' && customScenario && <span className="q-chip q-chip-cyan">simulated</span>}
                </div>
              </div>
              <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)' }}>10,000 PATHS</div>
            </div>
            <QForecastCone height={240}
              basePoints={base}
              scenarios={[
                { label: 'Bull · P90',   color: '#4ADE9B', points: bull },
                { label: 'Aggressive',   color: '#6DF3FF', points: aggressive },
                { label: 'Conservative', color: '#C084FF', points: conservative },
                { label: 'Bear · P10',   color: '#FF5A6E', points: bear },
              ]} />
          </div>

          {/* Profile-specific control panel */}
          {profile === 'standard' && (
            <div className="q-card q-card-elev" style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <QSectionHead eyebrow="DECISION SLIDERS" title="What if you change…" ai
                action={<span className="q-mono q-num" style={{ fontSize: 11, color: delta >= 0 ? 'var(--q-accent-emerald)' : 'var(--q-accent-coral)' }}>Δ {delta >= 0 ? '+' : ''}${Math.abs(delta).toLocaleString()} / 10y</span>} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, flex: 1 }}>
                {[
                  { k:'Monthly DCA',      key:'dca',     displayVal: dcaVal(),    range:'$0 – $4,000', pct: sliders.dca,    accent:'#9D4DFF' },
                  { k:'Coffee budget',    key:'coffee',  displayVal: coffeeVal(), range:'$0 – $300',   pct: sliders.coffee, accent:'#FF7AE6' },
                  { k:'Equity allocation',key:'equity',  displayVal: equityVal(), range:'0 – 100%',    pct: sliders.equity, accent:'#6DF3FF' },
                  { k:'Retirement age',   key:'retire',  displayVal: retireVal(), range:'45 – 70',     pct: sliders.retire, accent:'#4ADE9B' },
                ].map((s)=>(
                  <div key={s.key} style={{ padding: 12, background: 'rgba(7,2,15,0.4)', borderRadius: 10, border: '1px solid var(--q-stroke-1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11.5, color: 'var(--q-text-2)' }}>{s.k}</span>
                      <span className="q-mono q-num" style={{ fontSize: 12, fontWeight: 500, color: s.accent }}>{s.displayVal}</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(168,85,247,0.10)', borderRadius: 3, position: 'relative' }}>
                      <div style={{ width: s.pct + '%', height: '100%', background: s.accent, borderRadius: 3, boxShadow: `0 0 8px ${s.accent}` }} />
                      <div style={{
                        position: 'absolute', left: s.pct + '%', top: '50%',
                        width: 14, height: 14, borderRadius: '50%', background: '#fff',
                        transform: 'translate(-50%,-50%)',
                        boxShadow: `0 0 0 2px ${s.accent}, 0 0 8px ${s.accent}`,
                        pointerEvents: 'none',
                      }} />
                      <input type="range" min={0} max={100} value={s.pct}
                        onChange={e => setSlider(s.key, parseInt(e.target.value))}
                        style={{ position:'absolute', inset:0, opacity:0, cursor:'pointer', width:'100%', height:'100%' }} />
                    </div>
                    <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)', marginTop: 6 }}>{s.range}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile === 'custom' && (
            <div className="q-card q-card-elev" style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <QSectionHead eyebrow="CUSTOM SCENARIO" title="Describe what could happen" ai
                action={<span className="q-mono" style={{ fontSize: 10, color: 'var(--q-accent-cyan)' }}>NL → Monte Carlo</span>} />
              <div style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom: 12 }}>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) runCustomPrompt(); }}
                  placeholder="e.g. 'I get promoted in 6 months and increase my DCA 50%' or 'I take a 6-month sabbatical to travel'"
                  rows={3}
                  style={{
                    flex: 1, fontSize: 12, color: 'var(--q-text-1)',
                    background: 'rgba(7,2,15,0.6)', border: '1px solid var(--q-stroke-2)',
                    borderRadius: 10, padding: '10px 12px',
                    fontFamily: 'inherit', outline: 'none', resize: 'vertical',
                    boxShadow: '0 0 0 3px rgba(157,77,255,0.06), inset 0 0 12px rgba(157,77,255,0.04)',
                  }}
                />
                <button className="q-btn q-btn-primary" style={{ padding: '8px 14px', alignSelf: 'flex-start' }}
                  onClick={runCustomPrompt}>
                  <QIcon name="sparkle" size={12}/> Simulate
                </button>
              </div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom: 12 }}>
                {[
                  'I get promoted, +30% raise',
                  'I take a 6-mo sabbatical',
                  'Buy a house at $50k down',
                  'New baby in 18 months',
                  'I move 20% to crypto',
                ].map(p => (
                  <button key={p} onClick={() => setPrompt(p)} className="q-chip" style={{ cursor:'pointer' }}>{p}</button>
                ))}
              </div>
              {customScenario && (
                <div style={{ padding: 14, background: 'rgba(7,2,15,0.4)', borderRadius: 10, border: '1px solid var(--q-stroke-1)', flex: 1 }}>
                  <div className="q-eyebrow q-eyebrow-cyan" style={{ marginBottom: 8 }}>QUARK · SCENARIO RESULT</div>
                  <div style={{ fontSize: 12, color: 'var(--q-text-1)', fontStyle: 'italic', marginBottom: 8 }}>"{customScenario.prompt}"</div>
                  <div style={{ fontSize: 12.5, color: 'var(--q-text-2)', lineHeight: 1.6 }}>{customScenario.summary}</div>
                  <div style={{ display:'flex', gap:6, marginTop: 12, flexWrap:'wrap' }}>
                    <span className="q-chip q-chip-cyan">10k Monte Carlo paths</span>
                    <span className="q-chip">speed factor {customSpeed.toFixed(2)}x</span>
                    <span className="q-chip q-chip-emerald">confidence 0.84</span>
                  </div>
                </div>
              )}
              {!customScenario && (
                <div style={{ padding: 24, textAlign:'center', color:'var(--q-text-3)', fontSize:12, border:'1px dashed var(--q-stroke-1)', borderRadius:10, flex:1, display:'grid', placeItems:'center' }}>
                  Type a scenario above and Quark will simulate the impact on your twin
                </div>
              )}
            </div>
          )}

          {profile === 'pseudo' && (
            <div className="q-card q-card-elev" style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <QSectionHead eyebrow="BEHAVIORAL PREDICTIONS" title="What you'll actually do" ai
                action={<button className="q-btn q-btn-ghost" style={{ padding:'4px 10px', fontSize:11 }} onClick={() => { setPseudoRunning(true); setTimeout(()=>{ setPseudoRunning(false); toast('Re-trained on last 90d behavior'); }, 1200); }}>
                  {pseudoRunning ? '◯ Re-training…' : '↻ Re-train'}
                </button>} />
              <div style={{ fontSize: 11.5, color: 'var(--q-text-3)', lineHeight: 1.55, marginBottom: 12 }}>
                Pseudo-Mateo is trained on your last 90d transactions, sleep correlations, and stress patterns.
                It predicts the small drifts that compound — the ones you don't see coming.
              </div>
              <div style={{ display:'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1, minHeight:0, overflow:'auto' }} className="q-scroll">
                {pseudoBehaviors.map((b, i) => (
                  <div key={i} style={{ padding:'10px 12px', background:'rgba(7,2,15,0.4)', borderRadius:10, border:'1px solid var(--q-stroke-1)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom: 4 }}>
                      <span style={{ fontSize: 16 }}>{b.icon}</span>
                      <span style={{ fontSize: 11.5, color: 'var(--q-text-1)', flex: 1 }}>{b.label}</span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 6 }}>
                      <span className="q-mono q-num" style={{ fontSize: 11, color: '#FF5A6E' }}>{b.impact}</span>
                      <span className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)' }}>P={b.prob.toFixed(2)}</span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(168,85,247,0.10)', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                      <div style={{ width: (b.prob * 100) + '%', height: '100%', background: '#FF7AE6', boxShadow: '0 0 4px #FF7AE6' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* twin avatar panel */}
        <div className="q-card q-card-elev" style={{ padding: 16, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
          <QSectionHead eyebrow="TWIN PROFILE" title={
            profile==='custom'?'Custom · @ +36mo':
            profile==='pseudo'?'Pseudo-Mateo · @ +36mo':
            'Your @ +36mo'
          } ai />
          <div style={{
            background: profile==='pseudo'
              ? 'radial-gradient(circle at 50% 30%, rgba(255,122,230,0.20), transparent 70%)'
              : profile==='custom'
              ? 'radial-gradient(circle at 50% 30%, rgba(109,243,255,0.20), transparent 70%)'
              : 'radial-gradient(circle at 50% 30%, rgba(157,77,255,0.20), transparent 70%)',
            padding: '20px 0', borderRadius: 12, position: 'relative', marginBottom: 14,
          }}>
            <div style={{ position: 'relative', width: 110, height: 110, margin: '0 auto' }}>
              <svg width="110" height="110" viewBox="0 0 110 110" style={{ position: 'absolute', inset: 0, animation: 'q-orbit 20s linear infinite' }}>
                <ellipse cx="55" cy="55" rx="50" ry="22" fill="none" stroke={profile==='custom'?'#6DF3FF':profile==='pseudo'?'#FF7AE6':'#9D4DFF'} strokeWidth="0.6" opacity="0.5" strokeDasharray="2 4"/>
                <ellipse cx="55" cy="55" rx="50" ry="22" fill="none" stroke="#6DF3FF" strokeWidth="0.6" opacity="0.5" transform="rotate(60 55 55)" strokeDasharray="2 4"/>
                <ellipse cx="55" cy="55" rx="50" ry="22" fill="none" stroke="#D946EF" strokeWidth="0.6" opacity="0.5" transform="rotate(-60 55 55)" strokeDasharray="2 4"/>
              </svg>
              <div style={{ position: 'absolute', inset: 18,
                borderRadius: '50%',
                background: profile==='pseudo'
                  ? 'radial-gradient(circle at 30% 30%, #FF7AE6, #6020E0 60%, #2D0E66 100%)'
                  : profile==='custom'
                  ? 'radial-gradient(circle at 30% 30%, #6DF3FF, #2D5CFF 60%, #0E2766 100%)'
                  : 'radial-gradient(circle at 30% 30%, #C084FF, #6020E0 60%, #2D0E66 100%)',
                boxShadow: profile==='pseudo'
                  ? '0 0 24px rgba(255,122,230,0.6), inset 0 -10px 20px rgba(0,0,0,0.4)'
                  : profile==='custom'
                  ? '0 0 24px rgba(109,243,255,0.6), inset 0 -10px 20px rgba(0,0,0,0.4)'
                  : '0 0 24px rgba(157,77,255,0.6), inset 0 -10px 20px rgba(0,0,0,0.4)',
                animation: 'q-pulse 4s ease-in-out infinite',
              }} />
            </div>
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <div className="q-mono" style={{ fontSize: 10, color:
                profile==='pseudo'?'#FF7AE6':
                profile==='custom'?'#6DF3FF':
                'var(--q-violet-300)', letterSpacing: '0.2em' }}>
                {profile==='pseudo'?'PSEUDO_TWIN_v3':profile==='custom'?'CUSTOM_TWIN_v3':'QUARK_TWIN_v3'}
              </div>
              <div className="q-num" style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>${(p50Final * 1000).toLocaleString()}</div>
              <div style={{ fontSize: 11, color: 'var(--q-text-3)' }}>net worth · Nov 2029</div>
            </div>
          </div>
          <div className="q-stack-sm">
            {(profile === 'pseudo' ? [
              ['Behavioral drag', '−6.2% / yr'],
              ['Stress lapses',   '~3 / yr'],
              ['Habit decay',     '12mo half-life'],
              ['Recovery rate',   'fast (87%)'],
              ['Predictability',  '0.74 confidence'],
            ] : profile === 'custom' ? [
              ['Speed factor',    customSpeed.toFixed(2)+'x'],
              ['Variance',        '2.4σ vs base'],
              ['Confidence',      '0.84'],
              ['Reach goal',      customSpeed > 1 ? 'sooner' : 'later'],
              ['Re-runs',         '10,000 paths'],
            ] : [
              ['Retire-by',       '@ 58 · 87% prob'],
              ['Free months',     '14.2 / 36'],
              ['Hours/yr · job',  '1,610 → 1,180'],
              ['Stress index',    'declining ↓'],
              ['Goal latch',      'house · Aug 2026'],
            ]).map(([k,v],i)=>(
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, padding: '6px 0', borderBottom: '1px dashed var(--q-stroke-1)' }}>
                <span style={{ color: 'var(--q-text-3)' }}>{k}</span>
                <span className="q-mono q-num" style={{ color: 'var(--q-text-1)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </QShell>
  );
}

// ─────────────────────────────────────────────────────────────
// 5b. PREDICTIONS — distinct life-event scenario planner
// ─────────────────────────────────────────────────────────────
function ScreenPredictions() {
  const toast = (typeof useToast === 'function') ? useToast() : (() => {});
  const [active, setActive] = React.useState('house');
  const [horizon, setHorizon] = React.useState(36);

  const SCENARIOS = {
    house: {
      icon:'🏠', label:'Buy a house', cat:'major',
      cost:'$50k down · $3.2k/mo', prob:0.78, when:'Aug 2026',
      desc:'Down payment goal at 71% complete. Quark estimates close window opens Aug 2026 with current trajectory.',
      kpis:[ ['Net worth Δ @ 5y','+$48k'],['Goal milestone','Aug 2026'],['Cash reserves drop','-$50k'],['Mortgage payment','$3,200/mo'] ],
      timeline:[ {m:0,e:'Now'},{m:8,e:'Down payment locked'},{m:9,e:'Close · move in'},{m:18,e:'Refi window check'},{m:36,e:'+$58k equity'} ],
      color:'#9D4DFF',
    },
    promo: {
      icon:'💼', label:'Promotion · +30%', cat:'income',
      cost:'+$2,520/mo gross', prob:0.42, when:'Q2 2026',
      desc:'Based on tenure + role market data, Quark sees 42% probability of promotion in next 6mo. Income +30% would unlock significant DCA.',
      kpis:[ ['Net worth Δ @ 10y','+$184k'],['DCA capacity','$2,400/mo'],['Retire-by','55 (was 58)'],['Tax bracket shift','+5%'] ],
      timeline:[ {m:0,e:'Now'},{m:6,e:'Promotion event'},{m:7,e:'New tax bracket'},{m:12,e:'DCA ramp + emergency fund cap'},{m:36,e:'+$92k vs base'} ],
      color:'#4ADE9B',
    },
    sabbatical: {
      icon:'🏖️', label:'6-month sabbatical', cat:'risk',
      cost:'$32k burn · 6mo', prob:0.95, when:'on demand',
      desc:'You have a 6-month emergency fund. Taking a sabbatical now would deplete 65% of liquid reserves but is fully feasible.',
      kpis:[ ['Net worth Δ @ 5y','-$42k'],['Recovery time','18 months'],['Stress index forecast','-34%'],['Career risk','low'] ],
      timeline:[ {m:0,e:'Now'},{m:1,e:'Sabbatical starts'},{m:6,e:'Return to work'},{m:18,e:'NW recovers to baseline'},{m:36,e:'-$24k vs base'} ],
      color:'#FFB547',
    },
    baby: {
      icon:'👶', label:'New child', cat:'major',
      cost:'$1,400/mo · 18 yrs', prob:0.0, when:'planned',
      desc:'New dependent adds significant recurring cost. Quark recommends boosting emergency fund to 8mo and adding 529 plan.',
      kpis:[ ['Net worth Δ @ 5y','-$78k'],['Emergency fund need','+$8k'],['Insurance update','+$240/yr'],['529 plan suggested','$200/mo'] ],
      timeline:[ {m:0,e:'Now'},{m:9,e:'Birth'},{m:10,e:'Recurring cost begins'},{m:24,e:'529 ramp'},{m:36,e:'-$50k vs base'} ],
      color:'#FF7AE6',
    },
    retire: {
      icon:'🌅', label:'Early retire @ 50', cat:'horizon',
      cost:'requires +$340k', prob:0.31, when:'2042',
      desc:'Retire-at-50 needs $1.8M nest egg. Current trajectory hits at age 58. Pulling 8 years forward requires 3.2x DCA.',
      kpis:[ ['NW needed','$1.8M'],['Required DCA','$4,200/mo'],['Probability','31%'],['Gap to fix','$340k'] ],
      timeline:[ {m:0,e:'Now'},{m:60,e:'+$280k milestone'},{m:120,e:'+$680k'},{m:180,e:'+$1.2M'},{m:240,e:'$1.8M target'} ],
      color:'#6DF3FF',
    },
    crypto: {
      icon:'🚀', label:'25% crypto allocation', cat:'risk',
      cost:'rebalance $15k', prob:0.5, when:'now',
      desc:'Shifting 25% of portfolio to crypto increases expected return but volatility +2.4σ. Worst-case drawdown -42% in 12mo.',
      kpis:[ ['Expected NW @ 5y','+$54k'],['Worst case (P10)','-$28k'],['Best case (P90)','+$140k'],['Volatility','+2.4σ'] ],
      timeline:[ {m:0,e:'Rebalance'},{m:6,e:'First volatility cycle'},{m:18,e:'Halving event'},{m:24,e:'Re-evaluate'},{m:36,e:'+$54k median'} ],
      color:'#FFB547',
    },
    job: {
      icon:'💼', label:'Career switch', cat:'income',
      cost:'-15% income · 6mo', prob:0.25, when:'flexible',
      desc:'Lateral move with -15% short-term income but 22% higher 5-year ceiling. Net positive after month 14.',
      kpis:[ ['Net worth Δ @ 5y','+$28k'],['Break-even','month 14'],['Ceiling lift','+22%'],['Risk score','medium'] ],
      timeline:[ {m:0,e:'Switch'},{m:6,e:'Income trough'},{m:14,e:'Break-even'},{m:24,e:'New ceiling unlocked'},{m:60,e:'+$28k vs base'} ],
      color:'#C084FF',
    },
    education: {
      icon:'🎓', label:'Master\'s degree', cat:'horizon',
      cost:'$45k · 2yr', prob:0.55, when:'Sep 2026',
      desc:'Tuition + opportunity cost = $86k. Income premium +25% post-completion. Break-even year 6.',
      kpis:[ ['Tuition','$45k'],['Opportunity cost','$41k'],['Income premium','+25%'],['Break-even','year 6'] ],
      timeline:[ {m:0,e:'Now'},{m:6,e:'Enroll'},{m:30,e:'Graduate'},{m:36,e:'New role'},{m:72,e:'Break-even'} ],
      color:'#4ADE9B',
    },
  };

  const s = SCENARIOS[active];
  const cats = { major: 'Major life event', income: 'Income shift', risk: 'Risk-on bet', horizon: 'Long horizon' };

  return (
    <QShell active="predictions" topbarProps={{
      breadcrumb: 'INTELLIGENCE / PREDICTIONS',
      title: 'Life event scenarios',
      subtitle: `${Object.keys(SCENARIOS).length} forecasted paths · synthesized from your trajectory`,
      actions: <>
        <button className="q-btn q-btn-ghost" onClick={()=>toast('Comparing all scenarios')}><QIcon name="orbit" size={12}/> Compare all</button>
        <button className="q-btn" onClick={()=>toast('New custom scenario')}><QIcon name="plus" size={12}/> New scenario</button>
      </>,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 14, height: '100%' }}>
        {/* LEFT — scenario picker */}
        <div className="q-card q-card-elev q-scroll" style={{ padding: 14, overflow: 'auto' }}>
          <QSectionHead eyebrow="LIFE SCENARIOS" title="Pick what you're considering" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {Object.entries(SCENARIOS).map(([k, v]) => (
              <button key={k} onClick={() => setActive(k)} style={{
                padding: '12px', textAlign: 'left',
                background: active === k ? `linear-gradient(180deg, ${v.color}20, ${v.color}05)` : 'rgba(7,2,15,0.4)',
                border: `1px solid ${active === k ? v.color+'80' : 'var(--q-stroke-1)'}`,
                borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', color: 'inherit',
                boxShadow: active === k ? `0 0 16px ${v.color}30` : 'none',
                transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 22 }}>{v.icon}</span>
                  <span className="q-chip" style={{ fontSize: 9, marginLeft:'auto' }}>{cats[v.cat]}</span>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: active === k ? 'var(--q-text-1)' : 'var(--q-text-2)', marginBottom: 4 }}>{v.label}</div>
                <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)' }}>{v.cost}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: v.color }}>
                  <span className="q-mono">P={v.prob.toFixed(2)}</span>
                  <span className="q-mono">{v.when}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — scenario detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
          <div className="q-card q-card-elev" style={{ padding: 18, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%',
              background: `radial-gradient(circle, ${s.color}30, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ display:'flex', alignItems:'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14,
                background: `linear-gradient(135deg, ${s.color}40, ${s.color}10)`,
                display: 'grid', placeItems: 'center', fontSize: 28,
                boxShadow: `0 0 16px ${s.color}40`,
              }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div className="q-eyebrow" style={{ color: s.color }}>{cats[s.cat].toUpperCase()}</div>
                <div style={{ fontSize: 22, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                <div className="q-mono" style={{ fontSize: 11, color: 'var(--q-text-3)' }}>P={s.prob.toFixed(2)} · {s.when} · {s.cost}</div>
              </div>
              <button className="q-btn q-btn-primary" onClick={()=>toast(`Simulating ${s.label} · 10k paths`)}>
                <QIcon name="sparkle" size={12}/> Run simulation
              </button>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--q-text-2)', lineHeight: 1.6, marginTop: 6 }}>
              {s.desc}
            </div>
          </div>

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {s.kpis.map(([k, v], i) => (
              <div key={i} className="q-card q-card-elev" style={{ padding: 12 }}>
                <div className="q-eyebrow">{k}</div>
                <div className="q-num" style={{ fontSize: 16, fontWeight: 600, marginTop: 4,
                  color: typeof v === 'string' && v.startsWith('-') ? '#FF5A6E' : v.startsWith && v.startsWith('+') ? '#4ADE9B' : 'var(--q-text-1)' }}>
                  {v}
                </div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="q-card q-card-elev" style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <QSectionHead eyebrow="TIMELINE · IMPACT" title="What happens, when" ai
              action={<div style={{ display:'flex', gap: 4 }}>
                {[12, 36, 60, 120].map(h => (
                  <button key={h} onClick={() => setHorizon(h)} className="q-btn q-btn-ghost" style={{ padding: '3px 9px', fontSize: 10,
                    background: horizon===h ? 'rgba(157,77,255,0.18)':'transparent',
                    color: horizon===h ? 'var(--q-violet-300)' : 'var(--q-text-3)' }}>{h<60?h+'mo':(h/12)+'y'}</button>
                ))}
              </div>} />
            <div style={{ position: 'relative', flex: 1, paddingLeft: 28, paddingTop: 10, minHeight: 0, overflow:'auto' }} className="q-scroll">
              <div style={{ position: 'absolute', top: 14, bottom: 14, left: 24, width: 2,
                background: `linear-gradient(180deg, transparent, ${s.color}, ${s.color}40, transparent)`,
              }} />
              {s.timeline.filter(t => t.m <= horizon).map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 12, position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: -15, top: 4,
                    width: 14, height: 14, borderRadius: '50%',
                    background: 'var(--q-bg-1)', border: `2px solid ${s.color}`,
                    boxShadow: `0 0 8px ${s.color}80`,
                  }} />
                  <span className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)', minWidth: 50, paddingTop: 4 }}>
                    {t.m === 0 ? 'NOW' : t.m < 12 ? `${t.m}mo` : `${(t.m/12).toFixed(t.m%12?1:0)}y`}
                  </span>
                  <div style={{ flex: 1, padding: '6px 12px', background: 'rgba(7,2,15,0.4)', borderRadius: 8, border: '1px solid var(--q-stroke-1)' }}>
                    <span style={{ fontSize: 12, color: 'var(--q-text-1)' }}>{t.e}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              <span className="q-chip"><span className="q-pulse-dot" style={{ width:4, height:4, marginRight:4, verticalAlign:'middle' }} />Monte Carlo</span>
              <span className="q-chip q-chip-cyan">10k paths</span>
              <span className="q-chip">refreshed nightly</span>
            </div>
          </div>
        </div>
      </div>
    </QShell>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. TIMELINE
// ─────────────────────────────────────────────────────────────
function ScreenTimeline() {
  const events = [
    { date: 'TODAY', kind: 'ai', title: 'Quark synthesized 14 insights', sub: 'Coffee streak, FX leak, refi window', tone: 'violet' },
    { date: '2d',    kind: 'tx', title: 'Salary deposit · $8,400',    sub: 'Acme Corp · ACH', tone: 'cyan' },
    { date: '4d',    kind: 'risk', title: 'High-spend day detected · $312', sub: '+2.3σ vs your weekly μ · sleep <6h flag', tone: 'coral' },
    { date: '1w',    kind: 'goal', title: 'Down payment goal · 70% reached', sub: '$35,000 of $50,000 · ahead of schedule', tone: 'emerald' },
    { date: '2w',    kind: 'ai',   title: 'Habit shift detected', sub: 'Switched primary food category · -18% delivery, +24% groceries', tone: 'pink' },
    { date: '3w',    kind: 'event',title: 'Loan #2 rate refresh notice', sub: 'Window opens Q3 · Quark armed monitor', tone: 'amber' },
    { date: '5w',    kind: 'tx',   title: 'Refinanced auto loan',    sub: '6.4% → 4.9% · -$84/mo for 48mo', tone: 'emerald' },
    { date: '8w',    kind: 'ai',   title: 'New correlation discovered', sub: 'Sleep < 6h ↔ food spend +38% (r=0.54)', tone: 'violet' },
    { date: '12w',   kind: 'event',title: 'Promotion → income +14%',  sub: 'Quark recommended: split into +DCA 60% / lifestyle 40%', tone: 'emerald' },
    { date: '16w',   kind: 'risk', title: 'Subscription audit', sub: 'Cancelled 3 unused · saved $147/mo', tone: 'cyan' },
  ];
  const toneC = { violet:'#9D4DFF', cyan:'#6DF3FF', coral:'#FF5A6E', emerald:'#4ADE9B', pink:'#FF7AE6', amber:'#FFB547' };
  const kindIcon = { ai:'sparkle', tx:'wallet', risk:'warn', goal:'flag', event:'orbit' };

  return (
    <QShell active="timeline" topbarProps={{
      breadcrumb: 'TIMELINE',
      title: 'Your financial life · live thread',
      subtitle: 'Transactions, decisions, AI insights, milestones',
      actions: <>
        <button className="q-btn q-btn-ghost">All · 4,182</button>
        <button className="q-btn"><QIcon name="sparkle" size={12}/> Filter by AI</button>
      </>,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, height: '100%' }}>
        <div className="q-card q-card-elev q-scroll" style={{ padding: 24, overflow: 'auto', position: 'relative' }}>
          {/* central spine */}
          <div style={{ position: 'absolute', top: 24, bottom: 24, left: 92, width: 2,
            background: 'linear-gradient(180deg, transparent, rgba(157,77,255,0.5), rgba(157,77,255,0.2), transparent)',
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {events.map((e, i) => {
              const c = toneC[e.tone];
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 24px 1fr', alignItems: 'flex-start', gap: 8 }}>
                  <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)', textAlign: 'right', paddingTop: 6, letterSpacing: '0.1em' }}>
                    {e.date}
                  </div>
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'var(--q-bg-1)', border: `1.5px solid ${c}`,
                      display: 'grid', placeItems: 'center',
                      color: c, boxShadow: `0 0 10px ${c}80`,
                      animation: i === 0 ? 'q-pulse 2s ease-in-out infinite' : 'none',
                    }}>
                      <QIcon name={kindIcon[e.kind]} size={11} />
                    </div>
                  </div>
                  <div className="q-card" style={{ padding: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--q-text-1)' }}>{e.title}</span>
                      <span className={`q-chip q-chip-${e.tone === 'violet' ? '' : e.tone}`} style={{ marginLeft: 'auto' }}>{e.kind.toUpperCase()}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--q-text-3)', lineHeight: 1.4 }}>{e.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* filters / micro-stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="q-card q-card-elev" style={{ padding: 14 }}>
            <QSectionHead eyebrow="THIS MONTH" title="At a glance" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                ['AI insights', '47', '#9D4DFF'],
                ['Txns', '184', '#C084FF'],
                ['Milestones', '3', '#4ADE9B'],
                ['Risk events', '2', '#FF5A6E'],
              ].map(([k,v,c],i)=>(
                <div key={i} style={{ padding: 10, background: 'rgba(7,2,15,0.4)', borderRadius: 8 }}>
                  <div className="q-eyebrow" style={{ marginBottom: 4 }}>{k}</div>
                  <div className="q-num" style={{ fontSize: 18, fontWeight: 600, color: c }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="q-card q-card-elev" style={{ padding: 14 }}>
            <QSectionHead eyebrow="FILTERS" title="Layers" />
            {['AI insights','Transactions','Milestones','Risk signals','Decisions'].map((f,i)=>(
              <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 12, color: 'var(--q-text-2)' }}>
                <span style={{
                  width: 14, height: 14, borderRadius: 4,
                  background: i < 3 ? 'rgba(157,77,255,0.3)' : 'rgba(168,85,247,0.06)',
                  border: '1px solid var(--q-stroke-2)',
                  display: 'grid', placeItems: 'center', color: 'white',
                }}>{i < 3 && <QIcon name="check" size={9} />}</span>
                {f}
              </label>
            ))}
          </div>
        </div>
      </div>
    </QShell>
  );
}

Object.assign(window, { ScreenInsights, ScreenRadar, ScreenTwin, ScreenPredictions, ScreenTimeline });
