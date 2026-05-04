// Quark Finance — primitives.jsx
// Ambient background, particle field, glass surfaces, sidebar, generic charts.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ─────────────────────────────────────────────────────────────
// Ambient nebula background — multiple radial gradients drifting slowly
// ─────────────────────────────────────────────────────────────
function QAmbient({ intensity = 1 }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{
        position: 'absolute', inset: '-20%',
        background:
          'radial-gradient(ellipse 60% 40% at 18% 22%, rgba(123,46,255,' + (0.32 * intensity) + ') 0%, transparent 60%),' +
          'radial-gradient(ellipse 50% 35% at 82% 78%, rgba(217,70,239,' + (0.20 * intensity) + ') 0%, transparent 55%),' +
          'radial-gradient(ellipse 70% 50% at 50% 110%, rgba(109,243,255,' + (0.10 * intensity) + ') 0%, transparent 50%)',
        animation: 'q-nebula 24s ease-in-out infinite',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute', inset: '-30%',
        background:
          'radial-gradient(ellipse 30% 20% at 70% 30%, rgba(192,132,252,' + (0.18 * intensity) + ') 0%, transparent 55%),' +
          'radial-gradient(ellipse 40% 25% at 25% 75%, rgba(155,89,255,' + (0.18 * intensity) + ') 0%, transparent 60%)',
        animation: 'q-nebula 38s ease-in-out infinite reverse',
        filter: 'blur(60px)',
      }} />
      {/* fine grid */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.10 }}>
        <defs>
          <pattern id="q-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(192,132,252,0.4)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#q-grid)" />
      </svg>
      {/* noise */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 0.7 0 0 0 0 1 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        opacity: 0.04,
        mixBlendMode: 'overlay',
      }} />
    </div>
  );
}

// Particle field (pure SVG, deterministic)
function QParticles({ count = 24, seed = 1 }) {
  const points = useMemo(() => {
    const arr = [];
    let s = seed * 9301;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < count; i++) {
      arr.push({
        x: rnd() * 100, y: rnd() * 100,
        r: 0.5 + rnd() * 1.4,
        d: 4 + rnd() * 8, // animation duration s
        delay: rnd() * 6,
        c: rnd() > 0.7 ? 'var(--q-accent-cyan)' : 'var(--q-violet-300)',
      });
    }
    return arr;
  }, [count, seed]);
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r * 0.05}
          fill={p.c} opacity={0.6}
          style={{ animation: `q-float ${p.d}s ease-in-out ${p.delay}s infinite` }} />
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────────
const SIDEBAR_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home' },
  { key: 'timeline', label: 'Timeline', icon: 'timeline' },
  { key: 'copilot', label: 'AI Copilot', icon: 'spark', glow: true },
  { key: 'wallets', label: 'Wallets', icon: 'wallet' },
  { key: 'analytics', label: 'Analytics', icon: 'chart' },
  { key: 'predictions', label: 'Predictions', icon: 'forecast' },
  { key: 'twin', label: 'Digital Twin', icon: 'twin' },
  { key: 'missions', label: 'Missions', icon: 'flag' },
  { key: 'radar', label: 'Risk Radar', icon: 'radar' },
  { key: 'insights', label: 'Quantum Insights', icon: 'graph' },
  { key: 'security', label: 'Security', icon: 'lock' },
  { key: 'models', label: 'AI Models', icon: 'cpu' },
  { key: 'settings', label: 'Settings', icon: 'gear' },
];

function QIcon({ name, size = 16 }) {
  const stroke = 'currentColor';
  const sw = 1.5;
  const common = { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home': return <svg {...common}><path d="M2.5 7L8 2.5 13.5 7v6.5h-3v-4h-4v4h-3z"/></svg>;
    case 'timeline': return <svg {...common}><circle cx="3" cy="8" r="1.4"/><circle cx="8" cy="8" r="1.4"/><circle cx="13" cy="8" r="1.4"/><path d="M4.4 8h2.2M9.4 8h2.2"/></svg>;
    case 'spark': return <svg {...common}><path d="M8 1.5v4M8 10.5v4M1.5 8h4M10.5 8h4M3.5 3.5l2 2M10.5 10.5l2 2M3.5 12.5l2-2M10.5 5.5l2-2"/></svg>;
    case 'wallet': return <svg {...common}><rect x="2" y="4" width="12" height="9" rx="1.5"/><path d="M2 7h12M11 9.5h1.5"/></svg>;
    case 'chart': return <svg {...common}><path d="M2 13V3M2 13h12"/><path d="M5 11V8M8 11V5M11 11V7"/></svg>;
    case 'forecast': return <svg {...common}><path d="M2 11l3-4 3 2 5-6"/><path d="M11 3h2v2"/></svg>;
    case 'twin': return <svg {...common}><circle cx="6" cy="8" r="3"/><circle cx="10" cy="8" r="3"/></svg>;
    case 'flag': return <svg {...common}><path d="M3.5 14V2.5M3.5 3h7l-1.5 2.5L11 8H3.5"/></svg>;
    case 'radar': return <svg {...common}><circle cx="8" cy="8" r="5.5"/><circle cx="8" cy="8" r="2.5"/><path d="M8 8l4-3"/></svg>;
    case 'graph': return <svg {...common}><circle cx="3.5" cy="4" r="1.4"/><circle cx="12.5" cy="5" r="1.4"/><circle cx="8" cy="11" r="1.4"/><circle cx="3.5" cy="12" r="1.2"/><path d="M4.5 4.5l3 5.5M11 5.5L9 10M4.5 11.4L7 11"/></svg>;
    case 'cpu': return <svg {...common}><rect x="3.5" y="3.5" width="9" height="9" rx="1.2"/><rect x="6" y="6" width="4" height="4"/><path d="M6 1.5v2M10 1.5v2M6 12.5v2M10 12.5v2M1.5 6h2M1.5 10h2M12.5 6h2M12.5 10h2"/></svg>;
    case 'gear': return <svg {...common}><circle cx="8" cy="8" r="2"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4"/></svg>;
    case 'search': return <svg {...common}><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5l3 3"/></svg>;
    case 'bell': return <svg {...common}><path d="M3.5 11h9l-1-1.5V7a3.5 3.5 0 0 0-7 0v2.5z"/><path d="M6.5 13a1.5 1.5 0 0 0 3 0"/></svg>;
    case 'plus': return <svg {...common}><path d="M8 3v10M3 8h10"/></svg>;
    case 'send': return <svg {...common}><path d="M14 2L7 9M14 2l-4.5 12L7 9 2 6.5z"/></svg>;
    case 'arrow-up': return <svg {...common}><path d="M8 13V3M4 7l4-4 4 4"/></svg>;
    case 'arrow-down': return <svg {...common}><path d="M8 3v10M4 9l4 4 4-4"/></svg>;
    case 'arrow-right': return <svg {...common}><path d="M3 8h10M9 4l4 4-4 4"/></svg>;
    case 'check': return <svg {...common}><path d="M3 8.5l3 3 7-7"/></svg>;
    case 'warn': return <svg {...common}><path d="M8 2l6.5 11.5h-13z"/><path d="M8 7v3M8 12v.5"/></svg>;
    case 'lock': return <svg {...common}><rect x="3.5" y="7" width="9" height="6.5" rx="1"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/></svg>;
    case 'sparkle': return <svg {...common}><path d="M8 2l1.4 4.6L14 8l-4.6 1.4L8 14l-1.4-4.6L2 8l4.6-1.4z"/></svg>;
    case 'orbit': return <svg {...common}><ellipse cx="8" cy="8" rx="6" ry="3" transform="rotate(-30 8 8)"/><circle cx="8" cy="8" r="1.4"/></svg>;
    default: return <svg {...common}><circle cx="8" cy="8" r="5"/></svg>;
  }
}

function QSidebar({ active = 'dashboard', onNav, collapsed = false }) {
  const tr = (typeof window.useTr === 'function') ? window.useTr() : (s)=>s;
  return (
    <aside style={{
      width: collapsed ? 60 : 220,
      flexShrink: 0,
      borderRight: '1px solid var(--q-stroke-1)',
      background: 'linear-gradient(180deg, rgba(11,6,23,0.85), rgba(7,2,15,0.6))',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* logo */}
      <div style={{ padding: '18px 16px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <QLogo size={26} />
        {!collapsed && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>Quark</div>
            <div className="q-mono" style={{ fontSize: 9, color: 'var(--q-text-3)', letterSpacing: '0.16em' }}>{tr('FINANCE')} / v0.42</div>
          </div>
        )}
      </div>
      <div className="q-hr" style={{ margin: '0 12px' }} />

      {/* search */}
      {!collapsed && (
        <div style={{ padding: '12px 12px 8px' }}>
          <div onClick={() => window.__qOpenSpotlight?.()} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(7,2,15,0.5)',
            border: '1px solid var(--q-stroke-1)',
            borderRadius: 8, padding: '6px 10px',
            color: 'var(--q-text-3)', fontSize: 12,
            cursor: 'pointer', transition: 'border-color .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--q-stroke-2)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--q-stroke-1)'}>
            <QIcon name="search" size={13} />
            <span style={{ flex: 1 }}>{tr('Ask Quark')}…</span>
            <span className="q-mono" style={{ fontSize: 10, padding: '1px 5px', border: '1px solid var(--q-stroke-1)', borderRadius: 4 }}>⌘K</span>
          </div>
        </div>
      )}

      {/* nav */}
      <nav style={{ flex: 1, padding: '6px 8px', overflow: 'auto' }} className="q-scroll">
        {SIDEBAR_ITEMS.map(it => {
          const isActive = it.key === active;
          return (
            <button
              key={it.key}
              onClick={() => onNav && onNav(it.key)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', marginBottom: 1,
                border: 'none', borderRadius: 8, cursor: 'pointer',
                background: isActive
                  ? 'linear-gradient(90deg, rgba(157,77,255,0.18), rgba(157,77,255,0.04))'
                  : 'transparent',
                color: isActive ? 'var(--q-text-1)' : 'var(--q-text-2)',
                fontSize: 12.5, fontWeight: isActive ? 500 : 400,
                fontFamily: 'inherit',
                textAlign: 'left',
                position: 'relative',
                transition: 'all .12s',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(157,77,255,0.06)'; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              {isActive && <span style={{ position: 'absolute', left: -8, top: 6, bottom: 6, width: 2, background: 'var(--q-violet-400)', borderRadius: 2, boxShadow: '0 0 8px var(--q-violet-400)' }} />}
              <span style={{ color: isActive ? 'var(--q-violet-300)' : 'var(--q-text-3)' }}><QIcon name={it.icon} /></span>
              {!collapsed && <span style={{ flex: 1 }}>{tr(it.label)}</span>}
              {it.glow && !collapsed && <span className="q-pulse-dot" style={{ width: 5, height: 5 }} />}
            </button>
          );
        })}
      </nav>

      {/* AI status footer */}
      {!collapsed && (
        <div style={{ padding: 12, borderTop: '1px solid var(--q-stroke-1)' }}>
          <div className="q-card" style={{ padding: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="q-pulse-dot" style={{ background: 'var(--q-accent-emerald)', boxShadow: '0 0 8px var(--q-accent-emerald)' }} />
              <span className="q-mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--q-text-2)' }}>QUARK · ONLINE</span>
            </div>
            <div className="q-mono" style={{ fontSize: 10.5, color: 'var(--q-text-3)' }}>
              claude-haiku-4.5<br/>
              <span style={{ color: 'var(--q-violet-300)' }}>↓ 142ms</span> · <span>$0.0012/req</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

// Quark Q logo — circle with orbit and core
function QLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" style={{ filter: 'drop-shadow(0 0 6px rgba(157,77,255,0.6))' }}>
      <defs>
        <radialGradient id="qcore" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#C084FF" />
          <stop offset="100%" stopColor="#7B2EFF" />
        </radialGradient>
        <linearGradient id="qring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C084FF" />
          <stop offset="60%" stopColor="#9D4DFF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#6DF3FF" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="12" fill="none" stroke="url(#qring)" strokeWidth="1" opacity="0.7"/>
      <ellipse cx="14" cy="14" rx="11" ry="4" fill="none" stroke="url(#qring)" strokeWidth="0.8" transform="rotate(-30 14 14)"/>
      <circle cx="14" cy="14" r="4" fill="url(#qcore)" />
      <circle cx="22" cy="9" r="1.2" fill="#6DF3FF" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// QLoadingScreen — fullscreen atom animation between auth/onboarding/app
// ─────────────────────────────────────────────────────────────
function QLoadingScreen({ message, sublabel, onDone, duration = 1400 }) {
  const tr = (typeof window.useTr === 'function') ? window.useTr() : (s)=>s;
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!onDone) return;
    const t = setTimeout(onDone, duration);
    return () => clearTimeout(t);
  }, [onDone, duration]);
  useEffect(() => {
    const i = setInterval(() => setTick(t => (t + 1) % 4), 380);
    return () => clearInterval(i);
  }, []);

  // Atom geometry — three rotated orbits + nucleus
  const CX = 110, CY = 110;
  const ORBITS = [
    { rx: 90, ry: 32, rot: 0,   dur: 3.2, color: '#C084FF' },
    { rx: 90, ry: 32, rot: 60,  dur: 4.0, color: '#6DF3FF' },
    { rx: 90, ry: 32, rot: 120, dur: 4.8, color: '#FF7AE6' },
  ];
  const rotPath = (rx, ry, rotDeg) => {
    const a = rotDeg * Math.PI / 180;
    const x0 = (CX + rx * Math.cos(a)).toFixed(2);
    const y0 = (CY + rx * Math.sin(a)).toFixed(2);
    const x1 = (CX - rx * Math.cos(a)).toFixed(2);
    const y1 = (CY - rx * Math.sin(a)).toFixed(2);
    return `M ${x0} ${y0} A ${rx} ${ry} ${rotDeg} 1 1 ${x1} ${y1} A ${rx} ${ry} ${rotDeg} 1 1 ${x0} ${y0}`;
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'radial-gradient(ellipse at center, rgba(40,15,80,0.55), #07020F 70%)',
      display: 'grid', placeItems: 'center',
      animation: 'q-fade-up 0.28s ease-out',
      overflow: 'hidden',
    }}>
      <QAmbient intensity={1.1} />
      <QParticles count={36} seed={7} />

      {/* outer halo */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 540, height: 540, marginLeft: -270, marginTop: -270,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(157,77,255,0.22), transparent 60%)',
        animation: 'q-pulse 3.2s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', display: 'grid', placeItems: 'center', gap: 28, zIndex: 2 }}>
        <svg width="220" height="220" viewBox="0 0 220 220" style={{ overflow: 'visible' }}>
          <defs>
            {ORBITS.map((o, i) => (
              <path key={i} id={`qls-orbit-${i}`} d={rotPath(o.rx, o.ry, o.rot)} />
            ))}
            <radialGradient id="qls-core" cx="35%" cy="30%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#C084FF" />
              <stop offset="75%" stopColor="#6020E0" />
              <stop offset="100%" stopColor="#2D0E66" />
            </radialGradient>
            <radialGradient id="qls-glow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="rgba(192,132,252,0.55)" />
              <stop offset="100%" stopColor="rgba(157,77,255,0)" />
            </radialGradient>
          </defs>

          {/* expanding rings */}
          {[0,1,2].map(i => (
            <circle key={`r${i}`} cx={CX} cy={CY} r={28} fill="none" stroke="#9D4DFF" opacity="0.4">
              <animate attributeName="r" values="28;96;28" dur="3.4s" begin={`${i*0.55}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="3.4s" begin={`${i*0.55}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* orbit paths */}
          {ORBITS.map((o, i) => (
            <ellipse key={`e${i}`} cx={CX} cy={CY} rx={o.rx} ry={o.ry}
              fill="none" stroke={o.color} strokeOpacity="0.22" strokeWidth="0.8"
              strokeDasharray="2 4"
              transform={`rotate(${o.rot} ${CX} ${CY})`} />
          ))}

          {/* glow halo */}
          <circle cx={CX} cy={CY} r={60} fill="url(#qls-glow)" />

          {/* nucleus */}
          <circle cx={CX} cy={CY} r={22} fill="url(#qls-core)" style={{
            filter: 'drop-shadow(0 0 18px rgba(157,77,255,0.85))',
          }}>
            <animate attributeName="r" values="20;24;20" dur="2.4s" repeatCount="indefinite" />
          </circle>

          {/* electrons travelling along the orbits */}
          {ORBITS.map((o, i) => (
            <circle key={`p${i}`} r={4.2} fill={o.color} style={{ filter: `drop-shadow(0 0 8px ${o.color})` }}>
              <animateMotion dur={`${o.dur}s`} repeatCount="indefinite" begin={`${-i*0.4}s`}>
                <mpath href={`#qls-orbit-${i}`} />
              </animateMotion>
            </circle>
          ))}
        </svg>

        {/* label */}
        <div style={{ display: 'grid', placeItems: 'center', gap: 8, textAlign: 'center' }}>
          <div className="q-mono" style={{
            fontSize: 11, letterSpacing: '0.28em',
            color: 'var(--q-violet-300)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--q-accent-cyan)',
              boxShadow: '0 0 8px var(--q-accent-cyan)',
              animation: 'q-blink 1.2s ease-in-out infinite',
            }} />
            QUARK · {tr('SYNTHESIZING')}{'.'.repeat(tick)}
          </div>
          {message && (
            <div style={{
              fontSize: 18, fontWeight: 500, letterSpacing: '-0.015em',
              background: 'linear-gradient(180deg, #FFFFFF, #C084FF 80%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{tr(message)}</div>
          )}
          {sublabel && (
            <div style={{ fontSize: 12.5, color: 'var(--q-text-3)', maxWidth: 320 }}>{tr(sublabel)}</div>
          )}
          <div style={{
            marginTop: 6, width: 180, height: 2, borderRadius: 1,
            background: 'rgba(168,85,247,0.10)', overflow: 'hidden',
          }}>
            <div className="q-shimmer" style={{ height: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

window.QLoadingScreen = QLoadingScreen;

// Topbar
function QTopbar({ title, subtitle, breadcrumb, actions }) {
  const tr = (typeof window.useTr === 'function') ? window.useTr() : (s)=>s;
  const trStr = (s) => (typeof s === 'string' ? tr(s) : s);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '14px 24px',
      borderBottom: '1px solid var(--q-stroke-1)',
      background: 'linear-gradient(180deg, rgba(11,6,23,0.6), rgba(11,6,23,0.2))',
      backdropFilter: 'blur(12px)',
      position: 'relative', zIndex: 5,
    }}>
      <div style={{ flex: 1 }}>
        {breadcrumb && (
          <div className="q-mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--q-text-3)', marginBottom: 4 }}>
            {trStr(breadcrumb)}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>{trStr(title)}</h1>
          {subtitle && <div style={{ fontSize: 12, color: 'var(--q-text-3)' }}>{trStr(subtitle)}</div>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {actions}
        <button className="q-btn q-btn-ghost" style={{ padding: '7px 8px' }}><QIcon name="bell" size={14} /></button>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'linear-gradient(135deg, #9D4DFF, #D946EF)',
          display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600,
          boxShadow: '0 0 0 1px rgba(192,132,252,0.5), 0 0 12px rgba(157,77,255,0.5)',
        }}>MR</div>
      </div>
    </div>
  );
}

// KPI tile
function QKpi({ label, value, delta, deltaLabel, accent = 'violet', sparkline, suffix }) {
  const accentMap = {
    violet: 'var(--q-violet-300)',
    cyan: 'var(--q-accent-cyan)',
    pink: 'var(--q-accent-pink)',
    emerald: 'var(--q-accent-emerald)',
    coral: 'var(--q-accent-coral)',
  };
  const positive = delta && !String(delta).startsWith('-');
  const tr = (typeof window.useTr === 'function') ? window.useTr() : (s)=>s;
  const trStr = (s) => (typeof s === 'string' ? tr(s) : s);
  return (
    <div className="q-card q-card-elev" style={{ padding: 16, position: 'relative' }}>
      <div className="q-eyebrow" style={{ marginBottom: 8 }}>{trStr(label)}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
        <span className="q-num" style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', color: accentMap[accent] }}>{value}</span>
        {suffix && <span className="q-mono" style={{ fontSize: 11, color: 'var(--q-text-3)' }}>{suffix}</span>}
      </div>
      {delta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            color: positive ? 'var(--q-accent-emerald)' : 'var(--q-accent-coral)',
            fontSize: 11, fontWeight: 500,
          }}>
            <QIcon name={positive ? 'arrow-up' : 'arrow-down'} size={10} />
            <span className="q-num">{delta}</span>
          </span>
          <span style={{ fontSize: 11, color: 'var(--q-text-3)' }}>{trStr(deltaLabel)}</span>
        </div>
      )}
      {sparkline && <div style={{ marginTop: 10 }}>{sparkline}</div>}
    </div>
  );
}

// Sparkline (deterministic from points array)
function QSparkline({ points, color = 'var(--q-violet-400)', height = 28, fill = true, width = 120 }) {
  if (!points || points.length < 2) return null;
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const w = width, h = height;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map(p => h - ((p - min) / range) * (h - 4) - 2);
  // smooth-ish path via quadratic
  let d = `M ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < xs.length; i++) {
    const cx = (xs[i - 1] + xs[i]) / 2;
    d += ` Q ${cx} ${ys[i - 1]} ${xs[i]} ${ys[i]}`;
  }
  const fillD = d + ` L ${xs[xs.length - 1]} ${h} L ${xs[0]} ${h} Z`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {fill && (
        <>
          <defs>
            <linearGradient id={`spk-${color.replace(/[^a-z]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={fillD} fill={`url(#spk-${color.replace(/[^a-z]/gi, '')})`} />
        </>
      )}
      <path d={d} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="2.2" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
    </svg>
  );
}

// Generic glass section header
function QSectionHead({ eyebrow, title, action, ai }) {
  const tr = (typeof window.useTr === 'function') ? window.useTr() : (s)=>s;
  const trStr = (s) => (typeof s === 'string' ? tr(s) : s);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
      <div>
        {eyebrow && <div className="q-eyebrow q-eyebrow-violet" style={{ marginBottom: 4 }}>{trStr(eyebrow)}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em' }}>{trStr(title)}</h3>
          {ai && (
            <span className="q-chip q-chip-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span className="q-pulse-dot" style={{ width: 4, height: 4 }} />
              AI
            </span>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

Object.assign(window, {
  QAmbient, QParticles, QSidebar, QTopbar, QIcon, QLogo,
  QKpi, QSparkline, QSectionHead,
  SIDEBAR_ITEMS,
});
