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
// 4. RISK RADAR
// ─────────────────────────────────────────────────────────────
function ScreenRadar() {
  return (
    <QShell active="radar" topbarProps={{
      breadcrumb: 'INTELLIGENCE / RISK RADAR',
      title: 'Active threats & leaks',
      subtitle: '7 signals · $784/mo at stake',
      actions: <>
        <button className="q-btn q-btn-ghost">Last 90d</button>
        <button className="q-btn"><QIcon name="check" size={12}/> Resolve all low</button>
      </>,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, height: '100%' }}>
        <div className="q-card q-card-elev" style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
          <QSectionHead eyebrow="ORBITAL SCAN" title="All risk signals · live" ai
            action={<span className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)' }}>SCAN @ 14:32:08</span>} />
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QRiskRadar size={460} />
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', fontSize: 11, color: 'var(--q-text-3)' }}>
            <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5A6E', boxShadow: '0 0 6px #FF5A6E' }} /> 2 high</span>
            <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFB547', boxShadow: '0 0 6px #FFB547' }} /> 2 medium</span>
            <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6DF3FF', boxShadow: '0 0 6px #6DF3FF' }} /> 3 low</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
          <div className="q-card q-card-elev" style={{ padding: 14 }}>
            <QSectionHead eyebrow="PRIORITY · HIGH" title="Loan #2 · floating rate" />
            <div style={{ background: 'rgba(255,90,110,0.06)', border: '1px solid rgba(255,90,110,0.25)', borderRadius: 10, padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                <span className="q-num" style={{ fontSize: 22, fontWeight: 600, color: '#FF5A6E' }}>+$310/mo</span>
                <span className="q-mono" style={{ fontSize: 11, color: 'var(--q-text-3)' }}>P=0.62 · Q3 refresh</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--q-text-2)', lineHeight: 1.5, marginBottom: 10 }}>
                If Fed pauses through summer, your variable-rate loan resets +95bps. Refinance window closes <b style={{color:'var(--q-text-1)'}}>22 days</b>.
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="q-btn q-btn-primary" style={{ padding: '5px 10px', fontSize: 11 }}>Run refi sim</button>
                <button className="q-btn q-btn-ghost" style={{ padding: '5px 10px', fontSize: 11 }}>Snooze 7d</button>
              </div>
            </div>
          </div>

          <div className="q-card q-card-elev" style={{ padding: 14, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <QSectionHead eyebrow="ALL SIGNALS" title="Tracked · ranked" ai />
            <div className="q-scroll q-stack-sm" style={{ overflow: 'auto', flex: 1, paddingRight: 4 }}>
              {[
                { sev:'high', cat:'leak', t:'Cloud storage 2TB · 14m unused', a:'$120/mo' },
                { sev:'med', cat:'fee', t:'FX fees on intl transactions', a:'$22/mo' },
                { sev:'med', cat:'pattern', t:'Coffee streak ↑37%', a:'$184/mo' },
                { sev:'low', cat:'subs', t:'Streaming bundle overlap', a:'$48/mo' },
                { sev:'low', cat:'subs', t:'Forgotten gym membership', a:'$29/mo' },
                { sev:'low', cat:'overlap', t:'Insurance overlap (auto)', a:'$67/mo' },
              ].map((it,i)=>{
                const sevC = it.sev==='high'?'#FF5A6E':it.sev==='med'?'#FFB547':'#6DF3FF';
                return (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
                    background: 'rgba(7,2,15,0.4)', borderRadius: 10, border: '1px solid var(--q-stroke-1)' }}>
                    <span style={{ width:8, height:8, borderRadius:'50%', background: sevC, boxShadow:`0 0 6px ${sevC}` }} />
                    <span style={{ flex:1, fontSize:12, color:'var(--q-text-1)' }}>{it.t}</span>
                    <span className="q-mono" style={{ fontSize:10, color:'var(--q-text-3)' }}>{it.cat}</span>
                    <span className="q-mono q-num" style={{ fontSize:11, color: sevC, minWidth: 70, textAlign:'right' }}>{it.a}</span>
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
// 5. DIGITAL TWIN / PREDICTIONS
// ─────────────────────────────────────────────────────────────
function ScreenTwin() {
  const N = 36;
  const [sliders, setSliders] = React.useState({ dca: 35, coffee: 25, equity: 72, retire: 52 });
  const setSlider = (k, v) => setSliders(s => ({ ...s, [k]: v }));

  const dcaVal = () => '$' + Math.round(sliders.dca / 100 * 4000);
  const coffeeVal = () => '$' + Math.round(sliders.coffee / 100 * 300);
  const equityVal = () => sliders.equity + '%';
  const retireVal = () => Math.round(45 + sliders.retire / 100 * 25) + '';

  const speedFactor = 1 + (sliders.dca - 35) * 0.01 - (sliders.coffee - 25) * 0.005 + (sliders.equity - 72) * 0.008;
  const base = Array.from({ length: N }, (_, i) => 172 + i * 3.2 * speedFactor + Math.sin(i / 3) * 4);
  const bull = Array.from({ length: N }, (_, i) => 172 + i * 5.4 * speedFactor + Math.sin(i / 3) * 4);
  const bear = Array.from({ length: N }, (_, i) => 172 + i * 1.4 * speedFactor + Math.sin(i / 4) * 5);
  const aggressive = Array.from({ length: N }, (_, i) => 172 + i * 4.8 * speedFactor + Math.sin(i / 3) * 4);
  const conservative = Array.from({ length: N }, (_, i) => 172 + i * 2.2 * speedFactor + Math.sin(i / 4) * 3);
  const p50Final = Math.round(base[N-1]);
  const delta = Math.round((speedFactor - 1) * 24810);

  return (
    <QShell active="twin" topbarProps={{
      breadcrumb: 'INTELLIGENCE / DIGITAL TWIN',
      title: 'Your financial twin · 36mo horizon',
      subtitle: 'Monte Carlo · 10,000 paths · refreshed nightly',
      actions: <>
        <button className="q-btn q-btn-ghost"><QIcon name="orbit" size={12}/> Compare</button>
        <button className="q-btn"><QIcon name="sparkle" size={12}/> Run scenario</button>
      </>,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          <div className="q-card q-card-elev" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <div>
                <div className="q-eyebrow q-eyebrow-cyan">FORECAST CONE · NET WORTH</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4 }}>
                  <span className="q-num" style={{ fontSize: 26, fontWeight: 600 }}>${(p50Final * 1000).toLocaleString()}</span>
                  <span className="q-mono" style={{ fontSize: 11, color: 'var(--q-text-3)' }}>P50 @ Nov 2029</span>
                </div>
              </div>
              <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)' }}>10,000 PATHS</div>
            </div>
            <QForecastCone height={260}
              basePoints={base}
              scenarios={[
                { label: 'Bull · P90',   color: '#4ADE9B', points: bull },
                { label: 'Aggressive',   color: '#6DF3FF', points: aggressive },
                { label: 'Conservative', color: '#C084FF', points: conservative },
                { label: 'Bear · P10',   color: '#FF5A6E', points: bear },
              ]} />
          </div>

          <div className="q-card q-card-elev" style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <QSectionHead eyebrow="DECISION SLIDERS" title="What if you change…" ai
              action={<span className="q-mono q-num" style={{ fontSize: 11, color: delta >= 0 ? 'var(--q-accent-emerald)' : 'var(--q-accent-coral)' }}>Δ {delta >= 0 ? '+' : ''}${Math.abs(delta).toLocaleString()} / 10y</span>} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, flex: 1 }}>
              {[
                { k:'Monthly DCA',      key:'dca',    displayVal: dcaVal(),    range:'$0 – $4,000', pct: sliders.dca,    accent:'#9D4DFF' },
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
        </div>

        {/* twin avatar panel */}
        <div className="q-card q-card-elev" style={{ padding: 16, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
          <QSectionHead eyebrow="TWIN PROFILE" title="Your @ +36mo" ai />
          <div style={{
            background: 'radial-gradient(circle at 50% 30%, rgba(157,77,255,0.20), transparent 70%)',
            padding: '20px 0', borderRadius: 12, position: 'relative', marginBottom: 14,
          }}>
            <div style={{ position: 'relative', width: 110, height: 110, margin: '0 auto' }}>
              <svg width="110" height="110" viewBox="0 0 110 110" style={{ position: 'absolute', inset: 0, animation: 'q-orbit 20s linear infinite' }}>
                <ellipse cx="55" cy="55" rx="50" ry="22" fill="none" stroke="#9D4DFF" strokeWidth="0.6" opacity="0.5" strokeDasharray="2 4"/>
                <ellipse cx="55" cy="55" rx="50" ry="22" fill="none" stroke="#6DF3FF" strokeWidth="0.6" opacity="0.5" transform="rotate(60 55 55)" strokeDasharray="2 4"/>
                <ellipse cx="55" cy="55" rx="50" ry="22" fill="none" stroke="#D946EF" strokeWidth="0.6" opacity="0.5" transform="rotate(-60 55 55)" strokeDasharray="2 4"/>
              </svg>
              <div style={{ position: 'absolute', inset: 18,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #C084FF, #6020E0 60%, #2D0E66 100%)',
                boxShadow: '0 0 24px rgba(157,77,255,0.6), inset 0 -10px 20px rgba(0,0,0,0.4)',
                animation: 'q-pulse 4s ease-in-out infinite',
              }} />
            </div>
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-violet-300)', letterSpacing: '0.2em' }}>QUARK_TWIN_v3</div>
              <div className="q-num" style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>$294,820</div>
              <div style={{ fontSize: 11, color: 'var(--q-text-3)' }}>net worth · Nov 2029</div>
            </div>
          </div>
          <div className="q-stack-sm">
            {[
              ['Retire-by',   '@ 58 · 87% prob'],
              ['Free months',  '14.2 / 36'],
              ['Hours/yr · job', '1,610 → 1,180'],
              ['Stress index', 'declining ↓'],
              ['Goal latch',  'house · Aug 2026'],
            ].map(([k,v],i)=>(
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

Object.assign(window, { ScreenInsights, ScreenRadar, ScreenTwin, ScreenTimeline });
