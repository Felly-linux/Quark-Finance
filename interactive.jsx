// Quark Finance — interactive.jsx
// Force-directed Quantum Insights, scrollable shell, ripple, new screens.

const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ─────────────────────────────────────────────────────────────
// Global ripple — every button click pulses
// ─────────────────────────────────────────────────────────────
function installRipple() {
  if (window.__qRippleInstalled) return;
  window.__qRippleInstalled = true;
  document.addEventListener('click', (e) => {
    const t = e.target.closest('button, .q-btn, [data-q-press]');
    if (!t) return;
    const r = t.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const ripple = document.createElement('span');
    ripple.className = 'q-ripple';
    ripple.style.left = x + 'px'; ripple.style.top = y + 'px';
    const oldPos = getComputedStyle(t).position;
    if (oldPos === 'static') t.style.position = 'relative';
    if (getComputedStyle(t).overflow === 'visible') t.style.overflow = 'hidden';
    t.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
    t.classList.add('q-pressed');
    setTimeout(() => t.classList.remove('q-pressed'), 200);
  }, true);
}

// ─────────────────────────────────────────────────────────────
// Toast system
// ─────────────────────────────────────────────────────────────
const QToastContext = React.createContext({ toast: () => {} });
function QToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((msg, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, msg, ...opts }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), opts.duration || 2600);
  }, []);
  return (
    <QToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 500,
        display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
        {toasts.map(t => (
          <div key={t.id} className="q-card q-card-elev" style={{
            padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
            animation: 'q-toast-in 0.32s cubic-bezier(.2,.8,.2,1)',
            boxShadow: '0 0 0 1px rgba(192,132,252,0.30), 0 12px 30px rgba(0,0,0,0.5), 0 0 24px rgba(157,77,255,0.30)',
          }}>
            <span className="q-pulse-dot" style={{ background: t.tone === 'ok' ? 'var(--q-accent-emerald)' : 'var(--q-violet-300)' }} />
            <span style={{ fontSize: 12.5, color: 'var(--q-text-1)' }}>{t.msg}</span>
          </div>
        ))}
      </div>
    </QToastContext.Provider>
  );
}
function useToast() { return React.useContext(QToastContext).toast; }

// ─────────────────────────────────────────────────────────────
// Interactive Quantum Insights Graph (force-directed, draggable)
// ─────────────────────────────────────────────────────────────
function QInteractiveInsights({ width = 760, height = 520, onSelect }) {
  const initialNodes = useMemo(() => ([
    { id: 'salary',    x: 0.10*width, y: 0.30*height, w: 1.3, type: 'income', label: 'Salary',         val: '$8,400/mo' },
    { id: 'freelance', x: 0.10*width, y: 0.70*height, w: 0.7, type: 'income', label: 'Freelance',      val: '$1,200/mo' },
    { id: 'savings',   x: 0.30*width, y: 0.18*height, w: 1.0, type: 'metric', label: 'Savings rate',   val: '32%' },
    { id: 'food',      x: 0.30*width, y: 0.50*height, w: 0.8, type: 'spend',  label: 'Food',           val: '$487/wk' },
    { id: 'subs',      x: 0.30*width, y: 0.82*height, w: 0.5, type: 'spend',  label: 'Subscriptions',  val: '$248/mo' },
    { id: 'mood',      x: 0.55*width, y: 0.32*height, w: 0.9, type: 'signal', label: 'Stress index',   val: '0.62' },
    { id: 'goal',      x: 0.55*width, y: 0.65*height, w: 1.1, type: 'goal',   label: 'Down payment',   val: '71%' },
    { id: 'risk',      x: 0.78*width, y: 0.20*height, w: 0.9, type: 'risk',   label: 'Liquidity risk', val: 'med' },
    { id: 'invest',    x: 0.78*width, y: 0.50*height, w: 1.0, type: 'asset',  label: 'Index DCA',      val: '$1,400/mo' },
    { id: 'twin',      x: 0.78*width, y: 0.80*height, w: 1.1, type: 'ai',     label: 'Digital twin',   val: '+$24.8k' },
  ]), [width, height]);

  const edges = useMemo(() => ([
    ['salary', 'savings', 'strong'], ['salary', 'food', 'med'],
    ['freelance', 'subs', 'med'], ['freelance', 'savings', 'weak'],
    ['food', 'mood', 'weak'], ['subs', 'mood', 'med'],
    ['savings', 'goal', 'strong'], ['savings', 'invest', 'strong'],
    ['mood', 'risk', 'strong'], ['goal', 'twin', 'med'],
    ['invest', 'twin', 'strong'], ['risk', 'twin', 'strong'],
  ]), []);
  const restLen = { strong: 130, med: 170, weak: 220 };
  const stiff = { strong: 0.08, med: 0.05, weak: 0.025 };

  const typeColor = { income:'#6DF3FF', metric:'#C084FF', spend:'#FF7AE6', signal:'#FFB547', goal:'#4ADE9B', risk:'#FF5A6E', asset:'#9D4DFF', ai:'#FFFFFF' };

  const stateRef = useRef(null);
  const [, force] = useState(0);
  const [drag, setDrag] = useState(null);
  const [selected, setSelected] = useState(null);
  const svgRef = useRef(null);

  if (!stateRef.current) {
    stateRef.current = initialNodes.map(n => ({ ...n, vx: 0, vy: 0 }));
  }

  // simulation loop
  useEffect(() => {
    let raf;
    const tick = () => {
      const ns = stateRef.current;
      // spring forces
      for (const [a, b, str] of edges) {
        const A = ns.find(n => n.id === a), B = ns.find(n => n.id === b);
        const dx = B.x - A.x, dy = B.y - A.y;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        const diff = dist - restLen[str];
        const f = stiff[str] * diff;
        const fx = (dx/dist) * f, fy = (dy/dist) * f;
        if (drag !== A.id) { A.vx += fx; A.vy += fy; }
        if (drag !== B.id) { B.vx -= fx; B.vy -= fy; }
      }
      // repulsion
      for (let i = 0; i < ns.length; i++) {
        for (let j = i+1; j < ns.length; j++) {
          const A = ns[i], B = ns[j];
          const dx = B.x - A.x, dy = B.y - A.y;
          const d2 = dx*dx + dy*dy + 0.1;
          const f = 1800 / d2;
          const dist = Math.sqrt(d2);
          const fx = (dx/dist) * f, fy = (dy/dist) * f;
          if (drag !== A.id) { A.vx -= fx; A.vy -= fy; }
          if (drag !== B.id) { B.vx += fx; B.vy += fy; }
        }
      }
      // damping + integrate
      for (const n of ns) {
        if (drag === n.id) { n.vx = 0; n.vy = 0; continue; }
        n.vx *= 0.82; n.vy *= 0.82;
        n.x += n.vx; n.y += n.vy;
        // walls
        const r = 8 + n.w * 5 + 12;
        if (n.x < r) { n.x = r; n.vx *= -0.4; }
        if (n.x > width - r) { n.x = width - r; n.vx *= -0.4; }
        if (n.y < r) { n.y = r; n.vy *= -0.4; }
        if (n.y > height - r) { n.y = height - r; n.vy *= -0.4; }
      }
      force(v => (v+1) % 1024);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [drag, edges, width, height]);

  const ptFromEvent = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((cx - rect.left) / rect.width) * width,
      y: ((cy - rect.top) / rect.height) * height,
    };
  };

  const onDown = (id) => (e) => {
    e.preventDefault();
    setDrag(id);
  };
  useEffect(() => {
    if (!drag) return;
    const move = (e) => {
      const { x, y } = ptFromEvent(e);
      const n = stateRef.current.find(n => n.id === drag);
      if (n) { n.x = x; n.y = y; n.vx = 0; n.vy = 0; }
    };
    const up = () => setDrag(null);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
    };
  }, [drag]);

  const ns = stateRef.current;
  const idx = Object.fromEntries(ns.map(n => [n.id, n]));
  const eW = { strong: 1.8, med: 1.0, weak: 0.5 };
  const eO = { strong: 0.85, med: 0.45, weak: 0.22 };

  return (
    <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', cursor: drag ? 'grabbing' : 'default', userSelect: 'none' }}>
      <defs>
        <radialGradient id="ig-bg" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#9D4DFF" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#7B2EFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={width} height={height} fill="url(#ig-bg)" />
      {edges.map(([a,b,str],i) => {
        const A = idx[a], B = idx[b];
        const mx = (A.x+B.x)/2, my = (A.y+B.y)/2 - 24;
        const d = `M ${A.x} ${A.y} Q ${mx} ${my} ${B.x} ${B.y}`;
        const isHot = selected && (selected===a || selected===b);
        return (
          <g key={i}>
            <path d={d} fill="none" stroke={isHot ? '#6DF3FF' : '#9D4DFF'} strokeWidth={eW[str] + (isHot?0.8:0)} opacity={eO[str] + (isHot?0.2:0)}
              style={{ filter: `drop-shadow(0 0 ${isHot?6:3}px ${isHot ? '#6DF3FF' : 'rgba(157,77,255,0.6)'})`, transition: 'stroke 0.2s, opacity 0.2s' }} />
            {str==='strong' && (
              <circle r="2.2" fill="#6DF3FF">
                <animateMotion dur={(4.5 + i*0.4)+'s'} repeatCount="indefinite" path={d} />
              </circle>
            )}
          </g>
        );
      })}
      {ns.map(n => {
        const c = typeColor[n.type];
        const r = 8 + n.w * 5;
        const isSel = selected === n.id;
        const isDrag = drag === n.id;
        return (
          <g key={n.id} transform={`translate(${n.x}, ${n.y})`}
            style={{ cursor: isDrag ? 'grabbing' : 'grab' }}
            onMouseDown={onDown(n.id)} onTouchStart={onDown(n.id)}
            onClick={(e) => { e.stopPropagation(); setSelected(n.id); onSelect && onSelect(n); }}>
            {isSel && <circle r={r+12} fill="none" stroke={c} strokeWidth="1" opacity="0.6">
              <animate attributeName="r" values={`${r+10};${r+22};${r+10}`} dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite"/>
            </circle>}
            <circle r={r+6} fill={c} opacity={isDrag?0.30:0.14} />
            <circle r={r} fill={c} opacity="0.85" style={{ filter: `drop-shadow(0 0 ${isDrag?12:6}px ${c})` }} />
            <circle r={r-3} fill="#0B0617" />
            <circle r={r-5} fill={c} />
            <text y={r+14} textAnchor="middle" fill="var(--q-text-1)" fontSize="10.5" fontFamily="Geist" fontWeight="500">{n.label}</text>
            <text y={r+26} textAnchor="middle" fill="var(--q-text-3)" fontSize="9" fontFamily="Geist Mono">{n.val}</text>
          </g>
        );
      })}
    </svg>
  );
}
window.QInteractiveInsights = QInteractiveInsights;

// ─────────────────────────────────────────────────────────────
// Settings, Wallets, Analytics screens
// ─────────────────────────────────────────────────────────────
// Currency formatter (used across screens via window.__qFmtCurrency)
const CURRENCY_RATES = { USD: 1, COP: 4180, EUR: 0.92, MXN: 17.05 };
const CURRENCY_LOCALE = { USD: 'en-US', COP: 'es-CO', EUR: 'de-DE', MXN: 'es-MX' };
function fmtCurrency(usdAmount, currency = 'USD') {
  const rate = CURRENCY_RATES[currency] || 1;
  const value = usdAmount * rate;
  const locale = CURRENCY_LOCALE[currency] || 'en-US';
  try {
    return new Intl.NumberFormat(locale, { style:'currency', currency, maximumFractionDigits: currency === 'COP' ? 0 : 2 }).format(value);
  } catch { return `${currency} ${value.toLocaleString()}`; }
}
window.fmtCurrency = fmtCurrency;

const SETTINGS_I18N = {
  en: { profile:'Profile', currency:'Currency', language:'Language', risk:'Risk profile',
    security:'Vault & access', notif:'What Quark tells you', danger:'Irreversible',
    bio:'Biometric unlock', tfa:'Two-factor auth', refresh:'Auto-refresh data', tele:'Anonymous telemetry',
    unlock:'Unlock vault', save:'Save all', exportData:'Export all data', clearCache:'Clear cache', deleteAcc:'Delete account',
    livePreview:'Live preview · with current settings', netWorth:'Net worth', monthFlow:'Monthly cash flow', burn:'Monthly burn',
    langChanged:'UI language switched to English', currencyChanged:'Currency switched · all values reformatted' },
  es: { profile:'Perfil', currency:'Divisa', language:'Idioma', risk:'Perfil de riesgo',
    security:'Bóveda y acceso', notif:'Qué te dice Quark', danger:'Irreversible',
    bio:'Desbloqueo biométrico', tfa:'Doble factor', refresh:'Auto-actualizar datos', tele:'Telemetría anónima',
    unlock:'Abrir bóveda', save:'Guardar todo', exportData:'Exportar mis datos', clearCache:'Limpiar caché', deleteAcc:'Eliminar cuenta',
    livePreview:'Vista previa en vivo · con tus ajustes', netWorth:'Patrimonio neto', monthFlow:'Flujo mensual', burn:'Gasto mensual',
    langChanged:'Idioma cambiado a Español', currencyChanged:'Divisa cambiada · valores reformateados' },
};

function ScreenSettings() {
  const toast = useToast();
  const [s, setS] = useState(() => ({
    notif: true, biometric: true, autoRefresh: true, telemetry: false,
    twoFa: true,
    currency: localStorage.getItem('quark.currency') || 'USD',
    lang: localStorage.getItem('quark.lang') || 'en',
    risk: 'moderate',
  }));
  const t = SETTINGS_I18N[s.lang] || SETTINGS_I18N.en;
  const set = (k, v) => {
    setS(x => ({ ...x, [k]: v }));
    if (k === 'currency') {
      localStorage.setItem('quark.currency', v);
      window.dispatchEvent(new CustomEvent('quark-settings-changed', { detail:{ currency: v } }));
      toast((SETTINGS_I18N[s.lang] || SETTINGS_I18N.en).currencyChanged);
    } else if (k === 'lang') {
      localStorage.setItem('quark.lang', v);
      window.dispatchEvent(new CustomEvent('quark-settings-changed', { detail:{ lang: v } }));
      toast((SETTINGS_I18N[v] || SETTINGS_I18N.en).langChanged);
    } else {
      toast(`${k} updated`);
    }
  };

  // Sample numbers for live preview (always stored as USD baseline)
  const previewSamples = [
    { k: t.netWorth,   v: 172480 },
    { k: t.monthFlow,  v: 3840 },
    { k: t.burn,       v: 6290 },
  ];

  return (
    <QShell active="settings" topbarProps={{
      breadcrumb: 'WORKSPACE / SETTINGS',
      title: s.lang === 'es' ? 'Configuración' : 'Settings',
      subtitle: s.lang === 'es' ? 'Workspace · privacidad · API · bóveda' : 'Workspace · privacy · API · vault',
      actions: <button className="q-btn" onClick={() => toast(s.lang==='es' ? 'Guardado · cambios sincronizados' : 'Saved · all changes synced', { tone:'ok' })}><QIcon name="check" size={12}/> {t.save}</button>,
    }}>
      <div className="q-scroll" style={{ height: '100%', overflow: 'auto', paddingRight: 4 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div className="q-card q-card-elev" style={{ padding: 18 }}>
            <QSectionHead eyebrow="ACCOUNT" title={t.profile} />
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
              <div style={{ width:54, height:54, borderRadius:'50%', background:'linear-gradient(135deg,#9D4DFF,#D946EF)', display:'grid', placeItems:'center', fontSize:18, fontWeight:600, boxShadow:'0 0 0 1px rgba(192,132,252,0.5), 0 0 16px rgba(157,77,255,0.5)' }}>MR</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:500 }}>Mateo Restrepo</div>
                <div className="q-mono" style={{ fontSize:11, color:'var(--q-text-3)' }}>mateo@quark.fi · plan ORBIT</div>
              </div>
              <button className="q-btn q-btn-ghost" onClick={() => toast(s.lang==='es'?'Avatar actualizado':'Avatar updated')}>{s.lang==='es'?'Editar':'Edit'}</button>
            </div>
            <Row k={t.currency} v={
              <Pills value={s.currency} onChange={v => set('currency', v)} options={['USD','COP','EUR','MXN']} />
            } />
            <Row k={t.language} v={
              <Pills value={s.lang} onChange={v => set('lang', v)} options={['en','es']} />
            } />
            <Row k={t.risk} v={
              <Pills value={s.risk} onChange={v => set('risk', v)} options={['conservative','moderate','aggressive']} />
            } />
          </div>

          {/* Live preview — shows currency formatting + language working */}
          <div className="q-card q-card-elev" style={{ padding: 18, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-30, right:-30, width:120, height:120, borderRadius:'50%',
              background: 'radial-gradient(circle, rgba(109,243,255,0.25), transparent 70%)' }} />
            <QSectionHead eyebrow="LIVE PREVIEW" title={t.livePreview} ai />
            <div className="q-stack-sm">
              {previewSamples.map((p, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 12px', background:'rgba(7,2,15,0.4)', borderRadius:10, border:'1px solid var(--q-stroke-1)' }}>
                  <span style={{ fontSize: 12, color: 'var(--q-text-2)' }}>{p.k}</span>
                  <span className="q-mono q-num" style={{ fontSize: 14, fontWeight: 500, color: 'var(--q-text-1)' }}>{fmtCurrency(p.v, s.currency)}</span>
                </div>
              ))}
              <div style={{ marginTop: 6, padding:'8px 12px', background:'rgba(157,77,255,0.08)', borderRadius:8, border:'1px dashed rgba(157,77,255,0.3)' }}>
                <div className="q-mono" style={{ fontSize: 9.5, color: 'var(--q-violet-300)', letterSpacing:'0.16em', marginBottom: 4 }}>NOTE</div>
                <div style={{ fontSize: 11, color: 'var(--q-text-2)', lineHeight: 1.45 }}>
                  {s.lang==='es'
                    ? `Divisa: ${s.currency} · idioma: Español. Los cambios se persisten y aplican al recargar.`
                    : `Currency: ${s.currency} · language: English. Changes persist and propagate on reload.`}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="q-card q-card-elev" style={{ padding: 18, marginBottom:14 }}>
          <QSectionHead eyebrow="SECURITY" title={t.security} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8, marginBottom: 4 }}>
            <Toggle k={t.bio} v={s.biometric} onChange={v=>set('biometric',v)} sub="Face ID · Touch ID" />
            <Toggle k={t.tfa}  v={s.twoFa}     onChange={v=>set('twoFa',v)}     sub="Authenticator · backup codes" />
            <Toggle k={t.refresh} v={s.autoRefresh} onChange={v=>set('autoRefresh',v)} sub="Plaid · 4h" />
            <Toggle k={t.tele} v={s.telemetry} onChange={v=>set('telemetry',v)} sub="Zero PII" />
          </div>
          <button className="q-btn" style={{ marginTop:10 }} onClick={() => toast(s.lang==='es'?'Bóveda abierta · 142ms':'Vault unlocked · 142ms')}><QIcon name="lock" size={12}/> {t.unlock}</button>
        </div>

        <div className="q-card q-card-elev" style={{ padding: 18, marginBottom: 14 }}>
          <QSectionHead eyebrow="NOTIFICATIONS" title={t.notif} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
            {(s.lang === 'es' ? [
              ['Síntesis diaria', 'Cada noche · 9pm'],
              ['Alertas de riesgo', 'Tiempo real · solo alto'],
              ['Hitos de meta', 'Cada 10%'],
              ['Anomalías de gasto', 'Cuando > 2σ'],
              ['Ventanas de refi', 'Al abrir'],
              ['Resumen semanal', 'Domingos · narrativa'],
            ] : [
              ['Daily synthesis', 'Each evening · 9pm'],
              ['Risk signals', 'Real-time · high only'],
              ['Goal milestones', 'On every 10% hit'],
              ['Spend anomalies', 'When > 2σ'],
              ['Refi windows', 'When opportunity opens'],
              ['Weekly digest', 'Sundays · narrative'],
            ]).map(([k,v],i)=>(
              <div key={i} style={{ padding:12, background:'rgba(7,2,15,0.4)', borderRadius:10, border:'1px solid var(--q-stroke-1)', display:'flex', alignItems:'center', gap:10 }}>
                <Switch initial={i!==4} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, color:'var(--q-text-1)' }}>{k}</div>
                  <div className="q-mono" style={{ fontSize:9.5, color:'var(--q-text-3)' }}>{v}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="q-card q-card-elev" style={{ padding: 18, marginBottom: 14 }}>
          <QSectionHead eyebrow={s.lang==='es'?'ZONA DE PELIGRO':'DANGER ZONE'} title={t.danger} />
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <button className="q-btn q-btn-ghost" onClick={()=>toast(s.lang==='es'?'Exportación iniciada · email al terminar':'Export started · email when ready')}>{t.exportData}</button>
            <button className="q-btn q-btn-ghost" onClick={()=>toast(s.lang==='es'?'Caché limpiada · 142ms':'Cache cleared · 142ms')}>{t.clearCache}</button>
            <button className="q-btn q-btn-ghost" style={{ borderColor:'rgba(255,90,110,0.3)', color:'#FF5A6E' }}
              onClick={()=>toast(s.lang==='es'?'Eliminar cuenta requiere confirmación por email':'Account deletion requires email confirmation')}>{t.deleteAcc}</button>
          </div>
        </div>
      </div>
    </QShell>
  );
}

function Row({ k, v }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px dashed var(--q-stroke-1)' }}>
      <span style={{ fontSize:12, color:'var(--q-text-3)' }}>{k}</span>
      <div>{v}</div>
    </div>
  );
}
function Pills({ value, options, onChange }) {
  return (
    <div style={{ display:'flex', gap:4, background:'rgba(7,2,15,0.5)', padding:3, borderRadius:8, border:'1px solid var(--q-stroke-1)' }}>
      {options.map(o => (
        <button key={o} onClick={()=>onChange(o)} className="q-btn q-btn-ghost"
          style={{ padding:'4px 10px', fontSize:11, border:'none',
            background: value===o?'rgba(157,77,255,0.22)':'transparent',
            color: value===o?'var(--q-violet-300)':'var(--q-text-3)' }}>{o}</button>
      ))}
    </div>
  );
}
function Switch({ initial=false, onChange }) {
  const [on, setOn] = useState(initial);
  const t = (v) => { setOn(v); onChange && onChange(v); };
  return (
    <button onClick={()=>t(!on)} style={{
      width:34, height:20, borderRadius:12, border:'1px solid var(--q-stroke-2)',
      background: on ? 'linear-gradient(180deg,#9D4DFF,#6020E0)' : 'rgba(7,2,15,0.5)',
      position:'relative', cursor:'pointer', padding:0, transition:'background 0.2s',
      boxShadow: on ? '0 0 12px rgba(157,77,255,0.5)' : 'none', flexShrink:0,
    }}>
      <span style={{ position:'absolute', top:1, left: on?15:1, width:16, height:16, borderRadius:'50%',
        background:'white', transition:'left 0.2s cubic-bezier(.2,.8,.2,1)',
        boxShadow:'0 2px 4px rgba(0,0,0,0.3)' }} />
    </button>
  );
}
function Toggle({ k, v, sub, onChange }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px dashed var(--q-stroke-1)' }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:12, color:'var(--q-text-1)' }}>{k}</div>
        {sub && <div className="q-mono" style={{ fontSize:9.5, color:'var(--q-text-3)', marginTop:2 }}>{sub}</div>}
      </div>
      <Switch initial={v} onChange={onChange} />
    </div>
  );
}

function ScreenWallets() {
  const toast = useToast();
  const [walletFilter, setWalletFilter] = useState('ALL');
  const allWallets = [
    { name:'Chase · Checking',    type:'bank',       bal: 12480, change:+820,  c:'#9D4DFF', last:'2m' },
    { name:'Apple Card',          type:'credit',     bal: -1842, change:-184,  c:'#FF7AE6', last:'14m' },
    { name:'HYSA · Marcus',       type:'savings',    bal: 28300, change:+105,  c:'#4ADE9B', last:'4h' },
    { name:'Fidelity · Taxable',  type:'brokerage',  bal: 48310, change:+1240, c:'#6DF3FF', last:'live' },
    { name:'Coinbase',            type:'crypto',     bal: 7842,  change:-220,  c:'#FFB547', last:'live' },
    { name:'Vanguard · 401k',     type:'retirement', bal: 76420, change:+1840, c:'#C084FF', last:'1d' },
    { name:'Cash',                type:'cash',       bal: 380,   change:0,     c:'#8B7AA8', last:'manual' },
  ];
  const filterMap = { ALL: null, BANK: ['bank','savings','cash'], CREDIT: ['credit'], INVEST: ['brokerage','retirement'], CRYPTO: ['crypto'] };
  const wallets = walletFilter === 'ALL' ? allWallets : allWallets.filter(w => filterMap[walletFilter]?.includes(w.type));
  const total = allWallets.reduce((s,w)=>s+w.bal,0);

  return (
    <QShell active="wallets" topbarProps={{
      breadcrumb: 'WORKSPACE / WALLETS',
      title: 'All accounts',
      subtitle: `${wallets.length} accounts · synced ${new Date().toLocaleTimeString().slice(0,5)}`,
      actions: <>
        <button className="q-btn q-btn-ghost" onClick={()=>toast('Refreshing all · Plaid')}><QIcon name="orbit" size={12}/> Refresh</button>
        <button className="q-btn" onClick={()=>toast('Add account · choose provider')}><QIcon name="plus" size={12}/> Connect</button>
      </>,
    }}>
      <div className="q-scroll" style={{ height:'100%', overflow:'auto', paddingRight:4 }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:12, marginBottom:14 }}>
          <div className="q-card q-card-elev" style={{ padding:18, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(157,77,255,0.4),transparent 70%)' }} />
            <div className="q-eyebrow q-eyebrow-violet">TOTAL · USD</div>
            <div className="q-num" style={{ fontSize:36, fontWeight:600, letterSpacing:'-0.03em', marginTop:6,
              background:'linear-gradient(180deg,#FFFFFF,#C084FF)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              ${total.toLocaleString()}
            </div>
            <div style={{ fontSize:11, color:'var(--q-text-3)', marginTop:4 }}>across {wallets.length} accounts · {wallets.filter(w=>w.bal>0).length} positive</div>
          </div>
          <div className="q-card q-card-elev" style={{ padding:14 }}>
            <div className="q-eyebrow">LIQUID</div>
            <div className="q-num" style={{ fontSize:22, fontWeight:600, color:'var(--q-accent-cyan)', marginTop:4 }}>$41,160</div>
            <div className="q-mono" style={{ fontSize:10, color:'var(--q-text-3)', marginTop:2 }}>checking + HYSA</div>
          </div>
          <div className="q-card q-card-elev" style={{ padding:14 }}>
            <div className="q-eyebrow">DEBT</div>
            <div className="q-num" style={{ fontSize:22, fontWeight:600, color:'var(--q-accent-coral)', marginTop:4 }}>-$1,842</div>
            <div className="q-mono" style={{ fontSize:10, color:'var(--q-text-3)', marginTop:2 }}>1 card · paid in 18d</div>
          </div>
        </div>

        <div className="q-card q-card-elev" style={{ padding: 16 }}>
          <QSectionHead eyebrow="ACCOUNTS" title="All wallets" action={
            <div style={{ display:'flex', gap:4 }}>
              {['ALL','BANK','CREDIT','INVEST','CRYPTO'].map((t)=>(
                <button key={t} onClick={()=>setWalletFilter(t)} className="q-btn q-btn-ghost" style={{ padding:'3px 9px', fontSize:10,
                  background:walletFilter===t?'rgba(157,77,255,0.18)':'transparent', color:walletFilter===t?'var(--q-violet-300)':'var(--q-text-3)' }}>{t}</button>
              ))}
            </div>
          } />
          <div className="q-stack-sm">
            {wallets.map((w,i)=>(
              <button key={i} onClick={()=>toast(`Opening ${w.name}…`)} style={{
                display:'grid', gridTemplateColumns:'40px 1fr 110px 110px 60px', gap:14, alignItems:'center',
                padding:'12px 14px', background:'rgba(7,2,15,0.4)', borderRadius:10, border:'1px solid var(--q-stroke-1)',
                fontFamily:'inherit', textAlign:'left', cursor:'pointer', color:'inherit', width:'100%',
                transition:'all .15s',
              }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(157,77,255,0.10)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(7,2,15,0.4)'}>
                <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${w.c},${w.c}30)`, boxShadow:`0 0 8px ${w.c}80`, display:'grid', placeItems:'center' }}>
                  <QIcon name="wallet" size={14}/>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:'var(--q-text-1)' }}>{w.name}</div>
                  <div className="q-mono" style={{ fontSize:10, color:'var(--q-text-3)' }}>{w.type} · {w.last}</div>
                </div>
                <div className="q-num" style={{ fontSize:14, fontWeight:500, color: w.bal<0?'var(--q-accent-coral)':'var(--q-text-1)', textAlign:'right' }}>
                  ${Math.abs(w.bal).toLocaleString()}{w.bal<0?'':''}
                </div>
                <div className="q-mono q-num" style={{ fontSize:11, color: w.change>0?'var(--q-accent-emerald)':w.change<0?'var(--q-accent-coral)':'var(--q-text-3)', textAlign:'right' }}>
                  {w.change>0?'+':''}{w.change!==0?`$${Math.abs(w.change)}`:'—'}
                </div>
                <QIcon name="arrow-right" size={12}/>
              </button>
            ))}
          </div>
        </div>
      </div>
    </QShell>
  );
}

function ScreenAnalytics() {
  const toast = useToast();
  const [period, setPeriod] = useState('30d');
  const [view, setView] = useState('spend');

  // Period-aware data (different totals + category mix per window)
  const PERIOD_DATA = {
    '7d':  { total: 945,   txn: 42,   avg: 135, top:'Food', topPct: 31, factor: 0.25, deltaPct:'+14%', avgDelta:'+5%', txnDelta:'+8',
      cats:[
        { name:'Food', v:295, pct:.31, c:'#FF7AE6' },
        { name:'Rent', v:0,   pct:0,   c:'#9D4DFF' },
        { name:'Transport', v:84, pct:.09, c:'#6DF3FF' },
        { name:'Subscriptions', v:62, pct:.07, c:'#FFB547' },
        { name:'Health', v:42, pct:.04, c:'#4ADE9B' },
        { name:'Entertainment', v:128, pct:.14, c:'#D946EF' },
        { name:'Other', v:334, pct:.35, c:'#C084FF' },
      ] },
    '30d': { total: 3745,  txn: 184,  avg: 124, top:'Rent', topPct: 49, factor: 1, deltaPct:'+8.2%', avgDelta:'-2.1%', txnDelta:'+12',
      cats:[
        { name:'Food', v:487, pct:.13, c:'#FF7AE6' },
        { name:'Rent', v:1850, pct:.49, c:'#9D4DFF' },
        { name:'Transport', v:280, pct:.07, c:'#6DF3FF' },
        { name:'Subscriptions', v:248, pct:.07, c:'#FFB547' },
        { name:'Health', v:180, pct:.05, c:'#4ADE9B' },
        { name:'Entertainment', v:320, pct:.09, c:'#D946EF' },
        { name:'Other', v:380, pct:.10, c:'#C084FF' },
      ] },
    '90d': { total: 11420, txn: 562,  avg: 127, top:'Rent', topPct: 49, factor: 3, deltaPct:'+11.6%', avgDelta:'+0.8%', txnDelta:'+34',
      cats:[
        { name:'Food', v:1480, pct:.13, c:'#FF7AE6' },
        { name:'Rent', v:5550, pct:.49, c:'#9D4DFF' },
        { name:'Transport', v:842, pct:.07, c:'#6DF3FF' },
        { name:'Subscriptions', v:744, pct:.07, c:'#FFB547' },
        { name:'Health', v:540, pct:.05, c:'#4ADE9B' },
        { name:'Entertainment', v:1098, pct:.10, c:'#D946EF' },
        { name:'Other', v:1166, pct:.10, c:'#C084FF' },
      ] },
    '1y':  { total: 42180, txn: 2240, avg: 116, top:'Rent', topPct: 53, factor: 12, deltaPct:'+18.4%', avgDelta:'-4.2%', txnDelta:'+340',
      cats:[
        { name:'Food', v:5648, pct:.13, c:'#FF7AE6' },
        { name:'Rent', v:22360, pct:.53, c:'#9D4DFF' },
        { name:'Transport', v:3208, pct:.08, c:'#6DF3FF' },
        { name:'Subscriptions', v:2840, pct:.07, c:'#FFB547' },
        { name:'Health', v:2160, pct:.05, c:'#4ADE9B' },
        { name:'Entertainment', v:3120, pct:.07, c:'#D946EF' },
        { name:'Other', v:2844, pct:.07, c:'#C084FF' },
      ] },
    'ALL': { total: 102640,txn: 4182, avg: 122, top:'Rent', topPct: 51, factor: 28, deltaPct:'+47%', avgDelta:'avg', txnDelta:'all-time',
      cats:[
        { name:'Food', v:13280, pct:.13, c:'#FF7AE6' },
        { name:'Rent', v:52460, pct:.51, c:'#9D4DFF' },
        { name:'Transport', v:8240, pct:.08, c:'#6DF3FF' },
        { name:'Subscriptions', v:6800, pct:.07, c:'#FFB547' },
        { name:'Health', v:5180, pct:.05, c:'#4ADE9B' },
        { name:'Entertainment', v:9420, pct:.09, c:'#D946EF' },
        { name:'Other', v:7260, pct:.07, c:'#C084FF' },
      ] },
  };
  const pd = PERIOD_DATA[period];
  const cats = pd.cats;
  const periodLabel = { '7d':'last 7 days', '30d':'last 30 days', '90d':'last 90 days', '1y':'last year', 'ALL':'all time' }[period];
  const subTotal = pd.total.toLocaleString();
  const subtitle = `${pd.txn.toLocaleString()} transactions · 12 banks · ${periodLabel} window`;

  return (
    <QShell active="analytics" topbarProps={{
      breadcrumb: 'WORKSPACE / ANALYTICS',
      title: 'Deep analytics',
      subtitle: subtitle,
      actions: <>
        <button className="q-btn q-btn-ghost" onClick={()=>toast('Export CSV ready')}>Export</button>
        <button className="q-btn" onClick={()=>toast('Quark synthesizing patterns…')}><QIcon name="sparkle" size={12}/> Find patterns</button>
      </>,
    }}>
      <div className="q-scroll" style={{ height:'100%', overflow:'auto', paddingRight:4 }}>
        <div style={{ display:'flex', gap:6, marginBottom:14 }}>
          {['7d','30d','90d','1y','ALL'].map(p=>(
            <button key={p} onClick={()=>{setPeriod(p); toast(`Period: ${p}`);}} className="q-btn q-btn-ghost"
              style={{ padding:'5px 12px', fontSize:11,
                background:period===p?'rgba(157,77,255,0.18)':'transparent',
                color:period===p?'var(--q-violet-300)':'var(--q-text-3)' }}>{p}</button>
          ))}
          <div style={{ flex:1 }} />
          <div style={{ display:'flex', gap:4, background:'rgba(7,2,15,0.5)', padding:3, borderRadius:8, border:'1px solid var(--q-stroke-1)' }}>
            {[['spend','Spending'],['income','Income'],['merchants','Merchants']].map(([k,l])=>(
              <button key={k} onClick={()=>setView(k)} className="q-btn q-btn-ghost"
                style={{ padding:'4px 10px', fontSize:11, border:'none',
                  background:view===k?'rgba(157,77,255,0.22)':'transparent',
                  color:view===k?'var(--q-violet-300)':'var(--q-text-3)' }}>{l}</button>
            ))}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12, marginBottom:14 }}>
          <QKpi label={`Total spend · ${period}`} value={`$${subTotal}`} delta={pd.deltaPct} deltaLabel="vs prev" accent="pink" sparkline={<QSparkline points={[20,22,24,26,25,28,30,29,32,31,34,37].map(x => x * pd.factor / 1.5)} color="#FF7AE6" />} />
          <QKpi label="Avg / day"   value={`$${pd.avg}`}   delta={pd.avgDelta} deltaLabel={pd.avgDelta.startsWith('-') ? '↓ trending' : '↑ trending'} accent="violet" sparkline={<QSparkline points={[14,13,15,14,12,13,11,12,11,10,12,11]} color="#C084FF" />} />
          <QKpi label="Transactions" value={pd.txn.toLocaleString()} delta={pd.txnDelta} deltaLabel={period==='ALL'?'all-time':'vs prev'} accent="cyan" sparkline={<QSparkline points={[10,12,14,11,13,16,15,18,17,19,20,18].map(x => x * Math.min(pd.factor, 4))} color="#6DF3FF" />} />
          <QKpi label="Top category" value={pd.top} delta={pd.topPct + '%'} deltaLabel="of total" accent="emerald" />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:14, marginBottom:14 }}>
          <div className="q-card q-card-elev" style={{ padding:18 }}>
            <QSectionHead eyebrow="BREAKDOWN" title="By category" ai />
            <div className="q-stack-sm">
              {cats.map(c => (
                <button key={c.name} onClick={()=>toast(`Drill into ${c.name} · ${c.v} txns`)} style={{
                  width:'100%', display:'flex', alignItems:'center', gap:10, padding:'8px 10px',
                  background:'rgba(7,2,15,0.3)', borderRadius:8, border:'1px solid var(--q-stroke-1)',
                  fontFamily:'inherit', cursor:'pointer', color:'inherit', textAlign:'left',
                  transition:'all .15s',
                }}
                onMouseEnter={e=>e.currentTarget.style.borderColor='var(--q-stroke-2)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='var(--q-stroke-1)'}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:c.c, boxShadow:`0 0 6px ${c.c}` }} />
                  <span style={{ width:120, fontSize:12, color:'var(--q-text-1)' }}>{c.name}</span>
                  <div style={{ flex:1, height:5, background:'rgba(168,85,247,0.10)', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ width:(c.pct*100*1.5)+'%', height:'100%', background:c.c, boxShadow:`0 0 6px ${c.c}` }} />
                  </div>
                  <span className="q-num q-mono" style={{ width:60, textAlign:'right', fontSize:11.5, color:'var(--q-text-1)' }}>${c.v}</span>
                  <span className="q-mono" style={{ width:36, textAlign:'right', fontSize:10, color:'var(--q-text-3)' }}>{(c.pct*100).toFixed(0)}%</span>
                </button>
              ))}
            </div>
          </div>
          <div className="q-card q-card-elev" style={{ padding:18, display:'flex', flexDirection:'column', alignItems:'center' }}>
            <QSectionHead eyebrow="DISTRIBUTION" title="Where it goes" />
            <QDonut size={180} centerLabel={period.toUpperCase()} centerValue={pd.total > 9999 ? `$${(pd.total/1000).toFixed(1)}k` : `$${pd.total.toLocaleString()}`} items={cats.filter(c=>c.v>0).map(c=>({ value:c.v, color:c.c }))} />
            <div className="q-mono" style={{ fontSize:10, color:'var(--q-text-3)', marginTop:14, textAlign:'center' }}>
              {cats.filter(c=>c.v>0).length} categories · biggest: {pd.top} ({pd.topPct}%)
            </div>
          </div>
        </div>

        <div className="q-card q-card-elev" style={{ padding:18, marginBottom:14 }}>
          <QSectionHead eyebrow={`TOP MERCHANTS · ${period.toUpperCase()}`} title="Where you actually spend" ai />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10 }}>
            {[
              ['Sushi Norte', 484, 4, '#FF7AE6'],
              ['Trader Joe\'s', 312, 8, '#4ADE9B'],
              ['Uber', 220, 14, '#C084FF'],
              ['Spotify', 17, 1, '#9D4DFF'],
              ['Amazon', 184, 6, '#6DF3FF'],
              ['Apple', 145, 3, '#FFB547'],
            ].map(([m,v,n,c],i)=>(
              <button key={i} onClick={()=>toast(`${m}: ${n} txns · drill in`)} className="q-card" style={{
                padding:12, fontFamily:'inherit', cursor:'pointer', color:'inherit', textAlign:'left', border:'1px solid var(--q-stroke-1)',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:c, boxShadow:`0 0 4px ${c}` }} />
                  <span style={{ fontSize:12, color:'var(--q-text-1)', fontWeight:500 }}>{m}</span>
                </div>
                <div className="q-num" style={{ fontSize:18, fontWeight:600, color:c }}>${v}</div>
                <div className="q-mono" style={{ fontSize:10, color:'var(--q-text-3)' }}>{n} txns · 30d</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </QShell>
  );
}

window.ScreenSettings = ScreenSettings;
window.ScreenWallets = ScreenWallets;
window.ScreenAnalytics = ScreenAnalytics;
window.QToastProvider = QToastProvider;
window.useToast = useToast;
window.installRipple = installRipple;
