// Quark Finance — app-shell.jsx
// Functional app shell. One screen at a time, sidebar navigates between them.

const QNavContext = React.createContext({ active: 'dashboard', go: () => {} });

function useQNav() { return React.useContext(QNavContext); }

// Screen registry — desktop screens routed by sidebar key
const DESKTOP_SCREENS = {
  dashboard:   () => <ScreenDashboard />,
  copilot:     () => <ScreenCopilot />,
  insights:    () => <ScreenInsights />,
  radar:       () => <ScreenRadar />,
  twin:        () => <ScreenTwin />,
  predictions: () => <ScreenTwin />,        // alias
  timeline:    () => <ScreenTimeline />,
  missions:    () => <ScreenMissions />,
  models:      () => <ScreenModels />,
  wallets:     () => <ScreenWallets />,
  analytics:   () => <ScreenAnalytics />,
  settings:    () => <ScreenSettings />,
};

// Stub for screens not yet implemented — looks finished, not placeholder-y.
function ScreenStub({ title, subtitle, active }) {
  return (
    <QShell active={active} topbarProps={{
      breadcrumb: 'WORKSPACE / ' + title.toUpperCase(),
      title, subtitle,
      actions: <button className="q-btn"><QIcon name="sparkle" size={12}/> Ask Quark</button>,
    }}>
      <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
        <div style={{ textAlign: 'center', maxWidth: 380 }}>
          <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 20px' }}>
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ animation: 'q-orbit 30s linear infinite', position: 'absolute', inset: 0 }}>
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(192,132,252,0.25)" strokeDasharray="2 5"/>
              <circle cx="60" cy="60" r="40" fill="none" stroke="rgba(109,243,255,0.25)" strokeDasharray="2 5"/>
            </svg>
            <div style={{ position: 'absolute', inset: 36, borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #FFFFFF, #C084FF 35%, #6020E0 80%)',
              boxShadow: '0 0 28px rgba(157,77,255,0.6)',
              animation: 'q-pulse 4s ease-in-out infinite' }} />
          </div>
          <div className="q-mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--q-violet-300)', marginBottom: 8 }}>
            QUARK · INDEXING
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 8px' }}>
            Synthesizing your {title.toLowerCase()}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--q-text-3)', lineHeight: 1.5, margin: 0 }}>
            This surface streams from your live data layer. Open it from the spotlight (⌘K) or wait for Quark's next pass.
          </p>
        </div>
      </div>
    </QShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Patched sidebar that respects nav context
// ─────────────────────────────────────────────────────────────
function QSidebarNav() {
  const { active, go } = useQNav();
  return <QSidebar active={active} onNav={go} />;
}

// Monkey-patch QShell to use the navigating sidebar instead of static one.
// We replace QSidebar inside the rendered tree by re-rendering on top.
// Simpler: re-export a wrapped version of QShell.
const _OriginalQShell = window.QShell;
function QShellRouted({ active, children, topbarProps }) {
  const { go } = useQNav();
  return (
    <div className="q-app" style={{
      width: '100%', height: '100%',
      minWidth: 1280, minHeight: 800,
      display: 'flex', position: 'relative', overflow: 'hidden',
      background: 'var(--q-bg-0)',
    }}>
      <QAmbient intensity={1} />
      <QParticles count={28} />
      <QSidebar active={active} onNav={go} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2, minWidth: 0 }}>
        <QTopbar {...topbarProps} />
        <div style={{ flex: 1, padding: '20px 24px', overflow: 'auto', position: 'relative' }} className="q-scroll">
          {children}
        </div>
      </div>
    </div>
  );
}
// Override the global QShell so all existing screen code uses the routed version.
window.QShell = QShellRouted;

// ─────────────────────────────────────────────────────────────
// Mobile floating device frame (visible on demand)
// ─────────────────────────────────────────────────────────────
function MobilePreview({ open, onClose, screen, setScreen }) {
  if (!open) return null;
  const Comp = screen === 'quark' ? ScreenMobileQuark : ScreenMobileDashboard;
  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 460,
      zIndex: 200,
      background: 'linear-gradient(180deg, rgba(7,2,15,0.96), rgba(11,6,23,0.96))',
      borderLeft: '1px solid var(--q-stroke-2)',
      backdropFilter: 'blur(24px)',
      display: 'flex', flexDirection: 'column',
      animation: 'q-fade-up 0.3s ease-out',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
        borderBottom: '1px solid var(--q-stroke-1)' }}>
        <div className="q-mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--q-violet-300)' }}>
          MOBILE PREVIEW · iPhone 14
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 4, background: 'rgba(7,2,15,0.5)', padding: 3, borderRadius: 8, border: '1px solid var(--q-stroke-1)' }}>
          {[
            { k: 'dash', l: 'Home' },
            { k: 'quark', l: 'Quark' },
          ].map(t => (
            <button key={t.k} onClick={() => setScreen(t.k)} style={{
              padding: '4px 10px', fontSize: 10.5, borderRadius: 6, border: 'none', cursor: 'pointer',
              fontFamily: 'inherit',
              background: screen === t.k ? 'rgba(157,77,255,0.22)' : 'transparent',
              color: screen === t.k ? 'var(--q-violet-300)' : 'var(--q-text-3)',
            }}>{t.l}</button>
          ))}
        </div>
        <button onClick={onClose} style={{
          background: 'transparent', border: '1px solid var(--q-stroke-1)', color: 'var(--q-text-2)',
          fontFamily: 'inherit', fontSize: 12, padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
        }}>✕</button>
      </div>
      <div style={{ flex: 1, display: 'grid', placeItems: 'center', overflow: 'hidden', padding: 20 }}>
        <div style={{
          position: 'relative',
          width: 390, height: 720,
          borderRadius: 44, padding: 8,
          background: 'linear-gradient(180deg, #1A0F2E, #07020F)',
          boxShadow: '0 0 0 1px rgba(192,132,252,0.20), 0 0 60px rgba(157,77,255,0.25), 0 30px 80px rgba(0,0,0,0.6)',
        }}>
          {/* notch */}
          <div style={{
            position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
            width: 110, height: 22, borderRadius: 14,
            background: '#000', zIndex: 10,
          }} />
          <div style={{
            position: 'relative', width: '100%', height: '100%',
            borderRadius: 36, overflow: 'hidden',
            transform: 'scale(0.85)', transformOrigin: 'top center',
            // The mobile screens are 390x844 — at scale 0.85 they fit ~720h frame.
          }}>
            <div style={{ width: 390, height: 844 }}>
              <Comp />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Onboarding modal — first-run only (skippable)
// ─────────────────────────────────────────────────────────────
function OnboardingOverlay({ open, onClose }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(7,2,15,0.92)', backdropFilter: 'blur(8px)',
      animation: 'q-fade-up 0.4s ease-out',
    }}>
      <div style={{ position: 'absolute', top: 16, right: 20, zIndex: 310 }}>
        <button onClick={onClose} className="q-btn q-btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }}>
          Skip · Esc
        </button>
      </div>
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <ScreenOnboarding />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Spotlight (⌘K) — quick nav
// ─────────────────────────────────────────────────────────────
function Spotlight({ open, onClose }) {
  const { go } = useQNav();
  const [q, setQ] = React.useState('');
  React.useEffect(() => { if (open) setQ(''); }, [open]);
  if (!open) return null;
  const items = SIDEBAR_ITEMS.filter(it =>
    !q || it.label.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: 'rgba(7,2,15,0.6)', backdropFilter: 'blur(6px)',
      display: 'grid', placeItems: 'start center', paddingTop: '12vh',
      animation: 'q-fade-up 0.18s ease-out',
    }}>
      <div onClick={e => e.stopPropagation()} className="q-card q-card-elev" style={{
        width: 560, padding: 0, overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(192,132,252,0.30), 0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(157,77,255,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--q-stroke-1)' }}>
          <QIcon name="sparkle" size={14}/>
          <input autoFocus value={q} onChange={e => setQ(e.target.value)}
            placeholder="Ask Quark or jump to a surface…"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--q-text-1)', fontFamily: 'inherit', fontSize: 14,
            }} />
          <span className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)', padding: '2px 6px', border: '1px solid var(--q-stroke-1)', borderRadius: 4 }}>ESC</span>
        </div>
        <div className="q-scroll" style={{ maxHeight: 360, overflow: 'auto', padding: 6 }}>
          {items.map(it => (
            <button key={it.key} onClick={() => { go(it.key); onClose(); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', border: 'none', borderRadius: 8, cursor: 'pointer',
                background: 'transparent', color: 'var(--q-text-1)', fontFamily: 'inherit',
                fontSize: 13, textAlign: 'left',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(157,77,255,0.10)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: 'var(--q-violet-300)' }}><QIcon name={it.icon} size={14}/></span>
              <span style={{ flex: 1 }}>{it.label}</span>
              <span className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)' }}>{it.key}</span>
            </button>
          ))}
          {items.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--q-text-3)', fontSize: 13 }}>
              No surfaces match "{q}". Press ↵ to ask Quark instead.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// QuarkApp — the functional shell
// ─────────────────────────────────────────────────────────────
function QuarkApp({ tweaks }) {
  const [active, setActive] = React.useState('dashboard');
  const [transitionKey, setTransitionKey] = React.useState(0);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileScreen, setMobileScreen] = React.useState('dash');
  const [onboardingOpen, setOnboardingOpen] = React.useState(false);
  const [spotlightOpen, setSpotlightOpen] = React.useState(false);

  React.useEffect(() => { if (window.installRipple) window.installRipple(); }, []);

  const go = React.useCallback((key) => {
    setActive(key);
    setTransitionKey(k => k + 1);
  }, []);

  React.useEffect(() => {
    window.__qOpenSpotlight = () => setSpotlightOpen(true);
    window.__qNav = go;
    return () => { window.__qOpenSpotlight = null; window.__qNav = null; };
  }, [go]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); setSpotlightOpen(o => !o);
      } else if (e.key === 'Escape') {
        setSpotlightOpen(false); setOnboardingOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const Screen = DESKTOP_SCREENS[active] || DESKTOP_SCREENS.dashboard;

  return (
    <QNavContext.Provider value={{ active, go }}>
      <div style={{
        position: 'fixed', inset: 0,
        background: 'var(--q-bg-0)',
        overflow: 'hidden',
      }}>
        <div key={transitionKey} style={{
          width: '100%', height: '100%',
          animation: 'q-screen-in 0.42s cubic-bezier(.2,.8,.2,1)',
        }}>
          <Screen />
        </div>

        {/* Floating action: open mobile preview */}
        <button onClick={() => setMobileOpen(true)} style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 150,
          width: 44, height: 44, borderRadius: 22,
          border: '1px solid var(--q-stroke-3)',
          background: 'linear-gradient(135deg, rgba(157,77,255,0.30), rgba(123,46,255,0.20))',
          color: 'var(--q-text-1)', cursor: 'pointer',
          display: 'grid', placeItems: 'center',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 0 24px rgba(157,77,255,0.35), 0 8px 24px rgba(0,0,0,0.5)',
        }} title="Mobile preview">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4.5" y="2" width="7" height="12" rx="1.4"/>
            <path d="M7 12.5h2"/>
          </svg>
        </button>

        {/* Floating: replay onboarding */}
        <button onClick={() => setOnboardingOpen(true)} style={{
          position: 'fixed', bottom: 76, right: 24, zIndex: 150,
          padding: '6px 12px', borderRadius: 18,
          border: '1px solid var(--q-stroke-2)',
          background: 'rgba(11,6,23,0.7)',
          color: 'var(--q-text-2)', cursor: 'pointer',
          fontFamily: 'inherit', fontSize: 11,
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', gap: 6,
        }} title="View onboarding">
          <QIcon name="sparkle" size={11}/> Onboarding
        </button>

        <MobilePreview open={mobileOpen} onClose={() => setMobileOpen(false)}
          screen={mobileScreen} setScreen={setMobileScreen} />
        <OnboardingOverlay open={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
        <Spotlight open={spotlightOpen} onClose={() => setSpotlightOpen(false)} />
      </div>
    </QNavContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
// QuarkRoot — gates: login → (first-run onboarding) → app
// ─────────────────────────────────────────────────────────────
function QuarkRoot({ tweaks }) {
  const [phase, setPhase] = React.useState(() => {
    if (localStorage.getItem('quark.session') === '1') {
      return localStorage.getItem('quark.firstrun') === 'done' ? 'app' : 'app';
    }
    return 'login';
  });

  const onAuth = (info) => {
    localStorage.setItem('quark.session', '1');
    if (info.mode === 'create' || localStorage.getItem('quark.firstrun') !== 'done') {
      setPhase('onboarding');
    } else {
      setPhase('app');
    }
  };
  const finishOnboarding = () => {
    localStorage.setItem('quark.firstrun', 'done');
    setPhase('app');
  };
  const logout = () => {
    localStorage.removeItem('quark.session');
    setPhase('login');
  };

  React.useEffect(() => { window.__qLogout = logout; return () => { window.__qLogout = null; }; }, []);

  if (phase === 'login') return <ScreenLogin onAuth={onAuth} />;
  if (phase === 'onboarding') return (
    <div style={{ position:'fixed', inset:0, zIndex:50, animation:'q-fade-up 0.4s ease-out' }}>
      <div style={{ position:'absolute', top:16, right:20, zIndex:60, display:'flex', gap:8 }}>
        <button onClick={finishOnboarding} className="q-btn q-btn-ghost" style={{ padding:'6px 12px', fontSize:12 }}>Skip · Esc</button>
        <button onClick={finishOnboarding} className="q-btn" style={{ padding:'6px 12px', fontSize:12 }}>Enter Quark <QIcon name="arrow-right" size={11}/></button>
      </div>
      <ScreenOnboarding />
    </div>
  );
  return <QuarkApp tweaks={tweaks} />;
}
Object.assign(window, { QuarkApp, QNavContext, useQNav, DESKTOP_SCREENS, QuarkRoot });

