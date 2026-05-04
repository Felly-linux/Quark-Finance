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
  const langCtx = (typeof window.useT === 'function') ? window.useT() : { lang: 'en', setLang: ()=>{} };
  const [s, setS] = useState(() => ({
    notif: true, biometric: true, autoRefresh: true, telemetry: false,
    twoFa: true,
    currency: localStorage.getItem('quark.currency') || 'USD',
    risk: 'moderate',
  }));
  const lang = langCtx.lang;
  const t = SETTINGS_I18N[lang] || SETTINGS_I18N.en;
  const set = (k, v) => {
    if (k === 'lang') {
      langCtx.setLang(v);
      toast((SETTINGS_I18N[v] || SETTINGS_I18N.en).langChanged);
      return;
    }
    setS(x => ({ ...x, [k]: v }));
    if (k === 'currency') {
      localStorage.setItem('quark.currency', v);
      window.dispatchEvent(new CustomEvent('quark-settings-changed', { detail:{ currency: v } }));
      toast((SETTINGS_I18N[lang] || SETTINGS_I18N.en).currencyChanged);
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
      title: lang === 'es' ? 'Configuración' : 'Settings',
      subtitle: lang === 'es' ? 'Workspace · privacidad · API · bóveda' : 'Workspace · privacy · API · vault',
      actions: <button className="q-btn" onClick={() => toast(lang==='es' ? 'Guardado · cambios sincronizados' : 'Saved · all changes synced', { tone:'ok' })}><QIcon name="check" size={12}/> {t.save}</button>,
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
              <button className="q-btn q-btn-ghost" onClick={() => toast(lang==='es'?'Avatar actualizado':'Avatar updated')}>{lang==='es'?'Editar':'Edit'}</button>
            </div>
            <Row k={t.currency} v={
              <Pills value={s.currency} onChange={v => set('currency', v)} options={['USD','COP','EUR','MXN']} />
            } />
            <Row k={t.language} v={
              <Pills value={lang} onChange={v => set('lang', v)} options={['en','es']} />
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
                  {lang==='es'
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
          <button className="q-btn" style={{ marginTop:10 }} onClick={() => toast(lang==='es'?'Bóveda abierta · 142ms':'Vault unlocked · 142ms')}><QIcon name="lock" size={12}/> {t.unlock}</button>
        </div>

        <div className="q-card q-card-elev" style={{ padding: 18, marginBottom: 14 }}>
          <QSectionHead eyebrow="NOTIFICATIONS" title={t.notif} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
            {(lang === 'es' ? [
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
          <QSectionHead eyebrow={lang==='es'?'ZONA DE PELIGRO':'DANGER ZONE'} title={t.danger} />
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <button className="q-btn q-btn-ghost" onClick={()=>toast(lang==='es'?'Exportación iniciada · email al terminar':'Export started · email when ready')}>{t.exportData}</button>
            <button className="q-btn q-btn-ghost" onClick={()=>toast(lang==='es'?'Caché limpiada · 142ms':'Cache cleared · 142ms')}>{t.clearCache}</button>
            <button className="q-btn q-btn-ghost" style={{ borderColor:'rgba(255,90,110,0.3)', color:'#FF5A6E' }}
              onClick={()=>toast(lang==='es'?'Eliminar cuenta requiere confirmación por email':'Account deletion requires email confirmation')}>{t.deleteAcc}</button>
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
  const tr = (typeof window.useTr === 'function') ? window.useTr() : (s)=>s;
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
      breadcrumb: tr('WORKSPACE / WALLETS'),
      title: tr('All accounts'),
      subtitle: `${wallets.length} ${tr('accounts')} · ${tr('synced')} ${new Date().toLocaleTimeString().slice(0,5)}`,
      actions: <>
        <button className="q-btn q-btn-ghost" onClick={()=>toast(tr('Refreshing all · Plaid'))}><QIcon name="orbit" size={12}/> {tr('Refresh')}</button>
        <button className="q-btn" onClick={()=>toast(tr('Add account · choose provider'))}><QIcon name="plus" size={12}/> {tr('Connect')}</button>
      </>,
    }}>
      <div className="q-scroll" style={{ height:'100%', overflow:'auto', paddingRight:4 }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:12, marginBottom:14 }}>
          <div className="q-card q-card-elev" style={{ padding:18, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(157,77,255,0.4),transparent 70%)' }} />
            <div className="q-eyebrow q-eyebrow-violet">{tr('TOTAL')} · USD</div>
            <div className="q-num" style={{ fontSize:36, fontWeight:600, letterSpacing:'-0.03em', marginTop:6,
              background:'linear-gradient(180deg,#FFFFFF,#C084FF)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              ${total.toLocaleString()}
            </div>
            <div style={{ fontSize:11, color:'var(--q-text-3)', marginTop:4 }}>{tr('across')} {wallets.length} {tr('accounts')} · {wallets.filter(w=>w.bal>0).length} {tr('positive')}</div>
          </div>
          <div className="q-card q-card-elev" style={{ padding:14 }}>
            <div className="q-eyebrow">{tr('LIQUID')}</div>
            <div className="q-num" style={{ fontSize:22, fontWeight:600, color:'var(--q-accent-cyan)', marginTop:4 }}>$41,160</div>
            <div className="q-mono" style={{ fontSize:10, color:'var(--q-text-3)', marginTop:2 }}>{tr('checking')} + HYSA</div>
          </div>
          <div className="q-card q-card-elev" style={{ padding:14 }}>
            <div className="q-eyebrow">{tr('DEBT')}</div>
            <div className="q-num" style={{ fontSize:22, fontWeight:600, color:'var(--q-accent-coral)', marginTop:4 }}>-$1,842</div>
            <div className="q-mono" style={{ fontSize:10, color:'var(--q-text-3)', marginTop:2 }}>1 {tr('card')} · {tr('paid in')} 18d</div>
          </div>
        </div>

        <div className="q-card q-card-elev" style={{ padding: 16 }}>
          <QSectionHead eyebrow={tr('ACCOUNTS')} title={tr('All wallets')} action={
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
  const tr = (typeof window.useTr === 'function') ? window.useTr() : (s)=>s;
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
      breadcrumb: tr('WORKSPACE / ANALYTICS'),
      title: tr('Deep analytics'),
      subtitle: subtitle,
      actions: <>
        <button className="q-btn q-btn-ghost" onClick={()=>toast(tr('Export CSV ready'))}>{tr('Export')}</button>
        <button className="q-btn" onClick={()=>toast(tr('Quark synthesizing patterns…'))}><QIcon name="sparkle" size={12}/> {tr('Find patterns')}</button>
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
            {[['spend',tr('Spending')],['income',tr('Income')],['merchants',tr('Merchants')]].map(([k,l])=>(
              <button key={k} onClick={()=>setView(k)} className="q-btn q-btn-ghost"
                style={{ padding:'4px 10px', fontSize:11, border:'none',
                  background:view===k?'rgba(157,77,255,0.22)':'transparent',
                  color:view===k?'var(--q-violet-300)':'var(--q-text-3)' }}>{l}</button>
            ))}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12, marginBottom:14 }}>
          <QKpi label={`${tr('Total spend')} · ${period}`} value={`$${subTotal}`} delta={pd.deltaPct} deltaLabel={tr('vs prev')} accent="pink" sparkline={<QSparkline points={[20,22,24,26,25,28,30,29,32,31,34,37].map(x => x * pd.factor / 1.5)} color="#FF7AE6" />} />
          <QKpi label={`${tr('Avg')} / ${tr('day')}`}   value={`$${pd.avg}`}   delta={pd.avgDelta} deltaLabel={pd.avgDelta.startsWith('-') ? '↓ ' + tr('trending') : '↑ ' + tr('trending')} accent="violet" sparkline={<QSparkline points={[14,13,15,14,12,13,11,12,11,10,12,11]} color="#C084FF" />} />
          <QKpi label={tr('Transactions')} value={pd.txn.toLocaleString()} delta={pd.txnDelta} deltaLabel={period==='ALL'?tr('all-time'):tr('vs prev')} accent="cyan" sparkline={<QSparkline points={[10,12,14,11,13,16,15,18,17,19,20,18].map(x => x * Math.min(pd.factor, 4))} color="#6DF3FF" />} />
          <QKpi label={tr('Top category')} value={pd.top} delta={pd.topPct + '%'} deltaLabel={tr('of total')} accent="emerald" />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:14, marginBottom:14 }}>
          <div className="q-card q-card-elev" style={{ padding:18 }}>
            <QSectionHead eyebrow={tr('BREAKDOWN')} title={tr('By category')} ai />
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
            <QSectionHead eyebrow={tr('DISTRIBUTION')} title={tr('Where it goes')} />
            <QDonut size={180} centerLabel={period.toUpperCase()} centerValue={pd.total > 9999 ? `$${(pd.total/1000).toFixed(1)}k` : `$${pd.total.toLocaleString()}`} items={cats.filter(c=>c.v>0).map(c=>({ value:c.v, color:c.c }))} />
            <div className="q-mono" style={{ fontSize:10, color:'var(--q-text-3)', marginTop:14, textAlign:'center' }}>
              {cats.filter(c=>c.v>0).length} {tr('categories')} · {tr('biggest')}: {pd.top} ({pd.topPct}%)
            </div>
          </div>
        </div>

        <div className="q-card q-card-elev" style={{ padding:18, marginBottom:14 }}>
          <QSectionHead eyebrow={`${tr('TOP MERCHANTS')} · ${period.toUpperCase()}`} title={tr('Where you actually spend')} ai />
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
                <div className="q-mono" style={{ fontSize:10, color:'var(--q-text-3)' }}>{n} {tr('txns')} · 30d</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </QShell>
  );
}

// ─────────────────────────────────────────────────────────────
// ScreenSecurity — privacy & data-protection control center
// ─────────────────────────────────────────────────────────────
const SECURITY_DEFAULTS = {
  zeroKnowledge: true,
  e2ee: true,
  localInference: false,
  vaultLockMin: 5,
  biometric: true,
  twoFa: true,
  hardwareKey: false,
  sessionTimeoutMin: 30,
  telemetry: false,
  crashReports: false,
  aiTraining: false,
  anonAggregation: false,
  marketingShare: false,
  thirdPartySharing: false,
  retentionDays: 365,
  dataRegion: 'EU',
  ipAllowlist: false,
  vpnOnly: false,
  offlineFirst: false,
  auditLog: true,
};

function loadSec() {
  try { return { ...SECURITY_DEFAULTS, ...JSON.parse(localStorage.getItem('quark.security') || '{}') }; }
  catch { return { ...SECURITY_DEFAULTS }; }
}

function ScreenSecurity() {
  const tr = (typeof window.useTr === 'function') ? window.useTr() : (s)=>s;
  const langCtx = (typeof window.useT === 'function') ? window.useT() : { lang: 'en' };
  const lang = langCtx.lang;
  const toast = useToast();
  const [sec, setSec] = useState(loadSec);
  const update = (k, v) => {
    setSec(s => {
      const next = { ...s, [k]: v };
      try { localStorage.setItem('quark.security', JSON.stringify(next)); } catch {}
      return next;
    });
    if (k === 'telemetry' && !v) toast(tr('Telemetry disabled · zero pings outbound'));
    else if (k === 'aiTraining' && !v) toast(tr('Removed from AI training pool'));
    else if (k === 'zeroKnowledge' && v) toast(tr('Zero-knowledge mode enforced'));
    else toast(`${tr(LABELS[lang][k] || k)} · ${v ? tr('on') : tr('off')}`);
  };

  const sessions = [
    { dev: 'MacBook Pro · Sonoma', loc: 'Medellín · CO', ip: '186.84.•.•', last: 'now', current: true },
    { dev: 'iPhone 15 · iOS 17.4', loc: 'Medellín · CO', ip: '186.84.•.•', last: '14m' },
    { dev: 'Chrome · Windows', loc: 'Bogotá · CO', ip: '190.27.•.•', last: '2d' },
  ];

  const auditEntries = [
    { t: 'now',   k: 'AUTH', desc: tr('Session started · biometric'),   tone: 'emerald' },
    { t: '14m',   k: 'VAULT', desc: tr('Vault opened · 142ms'),          tone: 'violet' },
    { t: '1h',    k: 'EXPORT', desc: tr('Encrypted export · 4.2 MB'),    tone: 'cyan' },
    { t: '2h',    k: 'KEY', desc: tr('Recovery code rotated'),           tone: 'violet' },
    { t: '1d',    k: 'POLICY', desc: tr('Telemetry policy: disabled'),   tone: 'emerald' },
    { t: '3d',    k: 'AUTH', desc: tr('Failed 2FA attempt · IP blocked'),tone: 'coral' },
  ];

  const dataPolicies = [
    { k: 'aiTraining',        sub: tr('Quark never trains on your transactions') },
    { k: 'anonAggregation',   sub: tr('Aggregate-only stats · k-anon ≥ 50') },
    { k: 'marketingShare',    sub: tr('No partners receive your data') },
    { k: 'thirdPartySharing', sub: tr('Plaid · CoinGecko read-only') },
  ];

  const privacyPolicies = [
    { k: 'telemetry',     sub: tr('Zero PII · usage frequencies only') },
    { k: 'crashReports',  sub: tr('Stack traces with redacted state') },
  ];

  return (
    <QShell active="security" topbarProps={{
      breadcrumb: tr('WORKSPACE') + ' / ' + tr('SECURITY'),
      title: lang === 'es' ? 'Seguridad y privacidad' : 'Security & privacy',
      subtitle: lang === 'es'
        ? 'Cifrado · zero-knowledge · sesiones · derechos sobre tus datos'
        : 'Encryption · zero-knowledge · sessions · your data rights',
      actions: <button className="q-btn" onClick={() => toast(tr('Security report regenerated'), { tone:'ok' })}><QIcon name="lock" size={12}/> {tr('Regenerate report')}</button>,
    }}>
      <div className="q-scroll" style={{ height: '100%', overflow: 'auto', paddingRight: 4 }}>

        {/* HERO · encryption status */}
        <div className="q-card q-card-elev" style={{ padding: 22, marginBottom: 14, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-60, right:-60, width:260, height:260, borderRadius:'50%',
            background: 'radial-gradient(circle, rgba(74,222,155,0.18), transparent 70%)' }} />
          <div style={{ position:'absolute', top:-30, right:80, width:160, height:160, borderRadius:'50%',
            background: 'radial-gradient(circle, rgba(157,77,255,0.20), transparent 70%)' }} />
          <div style={{ display:'grid', gridTemplateColumns:'1.1fr 0.9fr', gap: 24, alignItems:'center', position:'relative' }}>
            <div>
              <div className="q-mono q-eyebrow-violet" style={{ fontSize: 10.5, letterSpacing: '0.22em', marginBottom: 8 }}>
                {tr('VAULT INTEGRITY')} · {tr('VERIFIED')}
              </div>
              <h2 style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.025em', margin: '0 0 10px',
                background: 'linear-gradient(180deg, #FFFFFF, #4ADE9B 90%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {tr('Your data is yours. End of story.')}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--q-text-2)', lineHeight: 1.55, maxWidth: 520, margin: 0 }}>
                {tr('AES-256-GCM at rest · TLS 1.3 in transit · keys derived locally with Argon2id. Quark cannot read your vault — and neither can a court order.')}
              </p>
              <div style={{ display:'flex', gap: 8, marginTop: 14, flexWrap:'wrap' }}>
                <span className="q-chip q-chip-emerald">AES-256-GCM</span>
                <span className="q-chip q-chip-cyan">TLS 1.3</span>
                <span className="q-chip">Argon2id · 256MB</span>
                <span className="q-chip">Zero-knowledge</span>
                <span className="q-chip">SOC 2 · ISO 27001</span>
                <span className="q-chip">{tr('Audited Q3 2026')}</span>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
              {[
                { l: tr('Last vault access'), v: '142ms', sub: tr('this session') },
                { l: tr('Master key age'), v: '4d', sub: tr('rotates 30d') },
                { l: tr('Active sessions'), v: '3', sub: tr('see below') },
                { l: tr('Audit entries'), v: '124', sub: tr('last 30d') },
              ].map((b,i) => (
                <div key={i} style={{ padding: 12, background:'rgba(7,2,15,0.4)', borderRadius: 10, border: '1px solid var(--q-stroke-1)' }}>
                  <div className="q-mono" style={{ fontSize: 9.5, color:'var(--q-text-3)', letterSpacing:'0.16em', marginBottom: 4 }}>{b.l.toUpperCase()}</div>
                  <div className="q-num" style={{ fontSize: 22, fontWeight: 600, color: 'var(--q-text-1)' }}>{b.v}</div>
                  <div className="q-mono" style={{ fontSize: 9.5, color:'var(--q-text-3)' }}>{b.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ENCRYPTION + ACCESS */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div className="q-card q-card-elev" style={{ padding: 18 }}>
            <QSectionHead eyebrow={tr('ENCRYPTION')} title={tr('Vault & key custody')} />
            <Toggle k={tr('Zero-knowledge mode')} v={sec.zeroKnowledge} onChange={v=>update('zeroKnowledge',v)} sub={tr('Keys never leave your device')} />
            <Toggle k={tr('End-to-end encryption')} v={sec.e2ee} onChange={v=>update('e2ee',v)} sub={tr('AES-256-GCM · per-record nonce')} />
            <Toggle k={tr('Local-only AI inference')} v={sec.localInference} onChange={v=>update('localInference',v)} sub={tr('No prompts hit Quark servers')} />
            <Row k={tr('Vault auto-lock')} v={
              <Pills value={String(sec.vaultLockMin)} options={['1','5','15','60']} onChange={v=>update('vaultLockMin', Number(v))} />
            } />
            <Row k={tr('Data residency')} v={
              <Pills value={sec.dataRegion} options={['EU','US','LATAM']} onChange={v=>update('dataRegion', v)} />
            } />
            <div style={{ display:'flex', gap: 8, marginTop: 14, flexWrap:'wrap' }}>
              <button className="q-btn" onClick={() => toast(tr('Recovery code copied · save it offline'), { tone:'ok' })}><QIcon name="lock" size={12}/> {tr('View recovery code')}</button>
              <button className="q-btn q-btn-ghost" onClick={() => toast(tr('Master key rotation scheduled'))}><QIcon name="cpu" size={12}/> {tr('Rotate master key')}</button>
            </div>
          </div>

          <div className="q-card q-card-elev" style={{ padding: 18 }}>
            <QSectionHead eyebrow={tr('ACCESS')} title={tr('Authentication & sessions')} />
            <Toggle k={tr('Biometric unlock')} v={sec.biometric} onChange={v=>update('biometric',v)} sub="Face ID · Touch ID" />
            <Toggle k={tr('Two-factor (TOTP)')} v={sec.twoFa} onChange={v=>update('twoFa',v)} sub={tr('Authenticator · 6 backup codes')} />
            <Toggle k={tr('Hardware key (FIDO2)')} v={sec.hardwareKey} onChange={v=>update('hardwareKey',v)} sub={tr('YubiKey · Solo · TouchID Passkey')} />
            <Row k={tr('Session timeout')} v={
              <Pills value={String(sec.sessionTimeoutMin)} options={['15','30','60','240']} onChange={v=>update('sessionTimeoutMin', Number(v))} />
            } />
            <div style={{ marginTop: 10 }}>
              <div className="q-eyebrow" style={{ marginBottom: 8 }}>{tr('ACTIVE SESSIONS')}</div>
              <div className="q-stack-sm">
                {sessions.map((s,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap: 10, padding: '10px 12px', background:'rgba(7,2,15,0.4)', borderRadius: 10, border:'1px solid var(--q-stroke-1)' }}>
                    <span style={{ width: 8, height: 8, borderRadius:'50%',
                      background: s.current ? 'var(--q-accent-emerald)' : 'var(--q-text-3)',
                      boxShadow: s.current ? '0 0 8px var(--q-accent-emerald)' : 'none' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: 'var(--q-text-1)', fontWeight: 500 }}>
                        {s.dev}{s.current && <span className="q-chip q-chip-emerald" style={{ marginLeft: 6 }}>{tr('this device')}</span>}
                      </div>
                      <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)' }}>{s.loc} · {s.ip} · {s.last}</div>
                    </div>
                    {!s.current && (
                      <button className="q-btn q-btn-ghost" style={{ padding:'4px 8px', fontSize: 11 }}
                        onClick={() => toast(tr('Session revoked'))}>{tr('Revoke')}</button>
                    )}
                  </div>
                ))}
              </div>
              <button className="q-btn q-btn-ghost" style={{ marginTop: 10 }} onClick={() => toast(tr('All other sessions revoked'))}>{tr('Sign out everywhere else')}</button>
            </div>
          </div>
        </div>

        {/* DATA TREATMENT */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div className="q-card q-card-elev" style={{ padding: 18 }}>
            <QSectionHead eyebrow={tr('DATA TREATMENT')} title={tr('How Quark handles your data')} />
            {dataPolicies.map((p,i) => (
              <Toggle key={i}
                k={tr(LABELS[lang][p.k])}
                v={sec[p.k]}
                onChange={v => update(p.k, v)}
                sub={p.sub}
              />
            ))}
            <Row k={tr('Retention period')} v={
              <Pills value={String(sec.retentionDays)} options={['90','365','730','3650']} onChange={v=>update('retentionDays', Number(v))} />
            } />
            <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)', marginTop: 12, lineHeight: 1.6 }}>
              {tr('Retention applies to derived analytics. Encrypted vault is kept until you delete it.')}
            </div>
          </div>

          <div className="q-card q-card-elev" style={{ padding: 18 }}>
            <QSectionHead eyebrow={tr('TELEMETRY')} title={tr('What leaves your device')} />
            {privacyPolicies.map((p,i) => (
              <Toggle key={i}
                k={tr(LABELS[lang][p.k])}
                v={sec[p.k]}
                onChange={v => update(p.k, v)}
                sub={p.sub}
              />
            ))}
            <Toggle k={tr('Offline-first mode')} v={sec.offlineFirst} onChange={v=>update('offlineFirst',v)} sub={tr('Sync only on Wi-Fi · battery > 30%')} />
            <Toggle k={tr('VPN-only access')} v={sec.vpnOnly} onChange={v=>update('vpnOnly',v)} sub={tr('Block requests outside VPN')} />
            <Toggle k={tr('IP allowlist')} v={sec.ipAllowlist} onChange={v=>update('ipAllowlist',v)} sub={tr('Pin sessions to known networks')} />
            <Toggle k={tr('Tamper-evident audit log')} v={sec.auditLog} onChange={v=>update('auditLog',v)} sub={tr('Hash-chained · cryptographically verifiable')} />
          </div>
        </div>

        {/* DATA RIGHTS */}
        <div className="q-card q-card-elev" style={{ padding: 18, marginBottom: 14 }}>
          <QSectionHead eyebrow={tr('YOUR RIGHTS')} title={tr('Portability · access · erasure')} />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 10 }}>
            {[
              { i:'arrow-down', t:tr('Export all data'),   d:tr('Encrypted JSON · 4.2 MB'), on:() => toast(tr('Export queued · check email')) },
              { i:'cpu',        t:tr('Access log'),         d:tr('GDPR Art. 15 · who saw what'), on:() => toast(tr('Access log copied to clipboard')) },
              { i:'lock',       t:tr('Revoke all keys'),    d:tr('Forces re-authentication'), on:() => toast(tr('All keys rotated'), { tone:'ok' }) },
              { i:'flag',       t:tr('Delete account'),     d:tr('Cryptographic shred · 30d grace'), on:() => toast(tr('Confirm via email to proceed'), { tone:'warn' }), danger:true },
            ].map((x,i) => (
              <button key={i} onClick={x.on} className="q-card" style={{
                padding: 14, fontFamily:'inherit', cursor:'pointer', color:'inherit', textAlign:'left',
                border: x.danger ? '1px solid rgba(255,122,230,0.30)' : '1px solid var(--q-stroke-1)',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 6, color: x.danger ? '#FF7AE6' : 'var(--q-violet-300)' }}>
                  <QIcon name={x.i} size={14}/>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--q-text-1)' }}>{x.t}</span>
                </div>
                <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)' }}>{x.d}</div>
              </button>
            ))}
          </div>
        </div>

        {/* AUDIT LOG */}
        <div className="q-card q-card-elev" style={{ padding: 18, marginBottom: 14 }}>
          <QSectionHead eyebrow={tr('AUDIT')} title={tr('Recent security events')} ai />
          <div className="q-stack-sm">
            {auditEntries.map((e,i) => {
              const dot = { emerald:'var(--q-accent-emerald)', violet:'var(--q-violet-300)', cyan:'var(--q-accent-cyan)', coral:'#FF7AE6' }[e.tone];
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding: '10px 12px', background:'rgba(7,2,15,0.4)', borderRadius: 10, border: '1px solid var(--q-stroke-1)' }}>
                  <span className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)', width: 38 }}>{e.t}</span>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot, boxShadow: `0 0 6px ${dot}` }} />
                  <span className="q-mono" style={{ fontSize: 10, letterSpacing:'0.16em', color: dot, width: 70 }}>{e.k}</span>
                  <span style={{ flex: 1, fontSize: 12.5, color: 'var(--q-text-1)' }}>{e.desc}</span>
                </div>
              );
            })}
          </div>
          <button className="q-btn q-btn-ghost" style={{ marginTop: 12 }} onClick={() => toast(tr('Full audit log exported · signed Ed25519'))}>
            <QIcon name="arrow-down" size={12}/> {tr('Download full audit log')}
          </button>
        </div>
      </div>
    </QShell>
  );
}

const LABELS = {
  en: {
    aiTraining: 'AI training opt-in',
    anonAggregation: 'Anonymous aggregation',
    marketingShare: 'Marketing partners',
    thirdPartySharing: 'Third-party providers',
    telemetry: 'Anonymous telemetry',
    crashReports: 'Crash reports',
  },
  es: {
    aiTraining: 'Uso para entrenar IA',
    anonAggregation: 'Agregación anónima',
    marketingShare: 'Socios de marketing',
    thirdPartySharing: 'Proveedores externos',
    telemetry: 'Telemetría anónima',
    crashReports: 'Reportes de fallos',
  },
};

window.ScreenSecurity = ScreenSecurity;
window.ScreenSettings = ScreenSettings;
window.ScreenWallets = ScreenWallets;
window.ScreenAnalytics = ScreenAnalytics;
window.QToastProvider = QToastProvider;
window.useToast = useToast;
window.installRipple = installRipple;
