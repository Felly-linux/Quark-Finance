// Quark Finance — auth.jsx
// Interactive login + i18n dictionary + first-run flag.

const { useState: aState, useEffect: aEffect, useRef: aRef, useCallback: aCb, useMemo: aMemo } = React;

// ─────────────────────────────────────────────────────────────
// i18n
// ─────────────────────────────────────────────────────────────
const Q_I18N = {
  en: {
    'login.eyebrow': 'WELCOME BACK',
    'login.title': 'Sign in to Quark',
    'login.subtitle': 'Your financial intelligence layer.',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.signin': 'Sign in',
    'login.continue': 'Continue with',
    'login.forgot': 'Forgot password?',
    'login.new': 'First time here?',
    'login.create': 'Create account',
    'login.demo': 'Continue as demo',
    'login.secure': 'AES-256 · zero-knowledge · audited Q3 2026',
    'login.tagline': 'See every dollar. Predict every drift.',
    'login.feature.1': 'Synthesize 90 days of transactions',
    'login.feature.2': 'Find leaks before they cost you',
    'login.feature.3': 'Simulate any decision in your digital twin',
    'lang.label': 'Language',
    'common.skip': 'Skip',
    'common.next': 'Next',
    'common.back': 'Back',
    'common.done': 'Done',
    'common.continue': 'Continue',
  },
  es: {
    'login.eyebrow': 'BIENVENIDO DE NUEVO',
    'login.title': 'Inicia sesión en Quark',
    'login.subtitle': 'Tu capa de inteligencia financiera.',
    'login.email': 'Correo',
    'login.password': 'Contraseña',
    'login.signin': 'Iniciar sesión',
    'login.continue': 'Continúa con',
    'login.forgot': '¿Olvidaste tu contraseña?',
    'login.new': '¿Primera vez aquí?',
    'login.create': 'Crear cuenta',
    'login.demo': 'Continuar como demo',
    'login.secure': 'AES-256 · cero-conocimiento · auditado Q3 2026',
    'login.tagline': 'Ve cada dólar. Predice cada desvío.',
    'login.feature.1': 'Sintetiza 90 días de transacciones',
    'login.feature.2': 'Encuentra fugas antes de que te cuesten',
    'login.feature.3': 'Simula cualquier decisión en tu gemelo digital',
    'lang.label': 'Idioma',
    'common.skip': 'Saltar',
    'common.next': 'Siguiente',
    'common.back': 'Atrás',
    'common.done': 'Listo',
    'common.continue': 'Continuar',
  },
};
const QLangContext = React.createContext({ lang: 'en', t: (k)=>k, setLang: ()=>{} });
function QLangProvider({ children }) {
  const [lang, setLang] = aState(() => localStorage.getItem('quark.lang') || 'en');
  const t = aCb((k) => (Q_I18N[lang] && Q_I18N[lang][k]) || Q_I18N.en[k] || k, [lang]);
  const set = aCb((l) => { setLang(l); localStorage.setItem('quark.lang', l); }, []);
  return <QLangContext.Provider value={{ lang, t, setLang: set }}>{children}</QLangContext.Provider>;
}
function useT() { return React.useContext(QLangContext); }
window.QLangProvider = QLangProvider;
window.useT = useT;

// ─────────────────────────────────────────────────────────────
// Mouse-reactive ambient field
// ─────────────────────────────────────────────────────────────
function MouseAmbient() {
  const ref = aRef(null);
  aEffect(() => {
    const el = ref.current; if (!el) return;
    let raf, tx = 50, ty = 50, x = 50, y = 50;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 100;
      ty = ((e.clientY - r.top) / r.height) * 100;
    };
    const tick = () => {
      x += (tx - x) * 0.06; y += (ty - y) * 0.06;
      el.style.setProperty('--mx', x + '%');
      el.style.setProperty('--my', y + '%');
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove);
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); };
  }, []);
  return (
    <div ref={ref} style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0,
    }}>
      <div style={{ position:'absolute', inset:0,
        background: 'radial-gradient(circle 600px at var(--mx,50%) var(--my,50%), rgba(157,77,255,0.32), transparent 70%)',
        transition: 'background 0.05s linear',
      }} />
      <div style={{ position:'absolute', inset:0,
        background: 'radial-gradient(circle 900px at calc(100% - var(--mx,50%)) calc(100% - var(--my,50%)), rgba(109,243,255,0.18), transparent 70%)',
      }} />
      <div style={{ position:'absolute', inset:0,
        background: 'radial-gradient(circle 400px at var(--mx,50%) var(--my,50%), rgba(255,122,230,0.16), transparent 65%)',
      }} />
      {/* Grid */}
      <svg width="100%" height="100%" style={{ position:'absolute', inset:0, opacity:0.10 }}>
        <defs>
          <pattern id="login-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#C084FF" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#login-grid)"/>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Animated input
// ─────────────────────────────────────────────────────────────
function QField({ label, type='text', value, onChange, icon, autoFocus }) {
  const [focus, setFocus] = aState(false);
  const has = value && value.length > 0;
  const lifted = focus || has;
  return (
    <label style={{ position: 'relative', display: 'block', marginBottom: 14 }}>
      <div style={{
        position: 'relative',
        background: 'rgba(7,2,15,0.55)',
        border: `1px solid ${focus ? 'rgba(192,132,252,0.65)' : 'var(--q-stroke-2)'}`,
        borderRadius: 12,
        padding: '18px 14px 8px',
        transition: 'all 0.22s cubic-bezier(.2,.8,.2,1)',
        boxShadow: focus ? '0 0 0 3px rgba(157,77,255,0.18), 0 0 24px rgba(157,77,255,0.25)' : 'none',
      }}>
        <span style={{
          position: 'absolute',
          top: lifted ? 6 : 18,
          left: 14,
          fontSize: lifted ? 9.5 : 13,
          letterSpacing: lifted ? '0.18em' : 'normal',
          textTransform: lifted ? 'uppercase' : 'none',
          fontFamily: lifted ? 'Geist Mono, monospace' : 'inherit',
          color: lifted ? 'var(--q-violet-300)' : 'var(--q-text-3)',
          pointerEvents: 'none',
          transition: 'all 0.22s cubic-bezier(.2,.8,.2,1)',
        }}>{label}</span>
        {icon && <span style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', color: focus?'var(--q-violet-300)':'var(--q-text-3)', transition:'color 0.2s' }}>{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          autoFocus={autoFocus}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--q-text-1)',
            fontSize: 14,
            fontFamily: 'inherit',
            padding: 0,
          }}
        />
        {/* underline glow */}
        <div style={{
          position: 'absolute', bottom: -1, left: '50%', transform: 'translateX(-50%)',
          width: focus ? '90%' : '0%', height: 1.5, borderRadius: 1,
          background: 'linear-gradient(90deg, transparent, #C084FF, transparent)',
          boxShadow: '0 0 8px #9D4DFF',
          transition: 'width 0.32s cubic-bezier(.2,.8,.2,1)',
        }} />
      </div>
    </label>
  );
}

// ─────────────────────────────────────────────────────────────
// Login screen
// ─────────────────────────────────────────────────────────────
function ScreenLogin({ onAuth }) {
  const { t, lang, setLang } = useT();
  const [email, setEmail] = aState('mateo@quark.fi');
  const [pw, setPw] = aState('••••••••••');
  const [loading, setLoading] = aState(false);
  const toast = (typeof useToast === 'function') ? useToast() : (() => {});

  const submit = (e) => {
    e && e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onAuth({ email, mode: 'signin' }); }, 900);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'var(--q-bg-0)',
      overflow: 'hidden',
      display: 'grid', gridTemplateColumns: '1.05fr 1fr',
      animation: 'q-fade-up 0.4s ease-out',
    }}>
      <MouseAmbient />

      {/* Left — visual */}
      <div style={{ position: 'relative', zIndex: 1, padding: 56, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <QLogo size={28} />
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>Quark Finance</span>
          <span className="q-chip" style={{ marginLeft: 4 }}>v0.42</span>
          <div style={{ flex: 1 }} />
          <LangSwitch lang={lang} setLang={setLang} />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 540, position: 'relative' }}>
          <div className="q-mono" style={{ fontSize: 11, letterSpacing: '0.24em', color: 'var(--q-violet-300)', marginBottom: 18 }}>
            QUARK · FINANCIAL INTELLIGENCE
          </div>
          <h1 style={{ fontSize: 60, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.02, margin: 0, marginBottom: 18,
            background: 'linear-gradient(180deg, #FFFFFF, #C084FF 80%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('login.tagline')}
          </h1>
          <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
            {['login.feature.1','login.feature.2','login.feature.3'].map((k,i) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(157,77,255,0.30), rgba(123,46,255,0.10))',
                  border: '1px solid var(--q-stroke-2)',
                  display: 'grid', placeItems: 'center',
                  boxShadow: '0 0 12px rgba(157,77,255,0.30)',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C084FF', boxShadow: '0 0 6px #C084FF' }} />
                </span>
                <span style={{ fontSize: 14, color: 'var(--q-text-2)' }}>{t(k)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating orb */}
        <div style={{ position: 'absolute', right: -120, top: '40%', width: 320, height: 320, pointerEvents: 'none' }}>
          {[180, 240, 320].map((s, i) => (
            <div key={i} style={{
              position: 'absolute', top: '50%', left: '50%',
              width: s, height: s * 0.5, marginLeft: -s/2, marginTop: -s*0.25,
              border: `1px ${i===1?'solid':'dashed'} rgba(192,132,252,${0.30 - i*0.06})`,
              borderRadius: '50%',
              transform: `rotate(${i*30}deg)`,
              animation: `q-orbit ${22 + i*8}s linear ${i%2 ? 'reverse' : ''} infinite`,
            }}>
              <div style={{ position:'absolute', top:-3, left:'50%', width:7, height:7, borderRadius:'50%',
                background: ['#9D4DFF','#6DF3FF','#FF7AE6'][i],
                boxShadow:`0 0 8px ${['#9D4DFF','#6DF3FF','#FF7AE6'][i]}` }} />
            </div>
          ))}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
            width: 80, height: 80, borderRadius:'50%',
            background:'radial-gradient(circle at 35% 30%, #FFFFFF, #C084FF 30%, #6020E0 70%)',
            boxShadow:'0 0 30px rgba(157,77,255,0.7)',
            animation:'q-pulse 4s ease-in-out infinite',
          }} />
        </div>

        <div className="q-mono" style={{ fontSize: 10, color: 'var(--q-text-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <QIcon name="lock" size={11} /> {t('login.secure')}
        </div>
      </div>

      {/* Right — form card */}
      <div style={{ position: 'relative', zIndex: 2, display: 'grid', placeItems: 'center', padding: 40 }}>
        <form onSubmit={submit} className="q-card q-card-elev" style={{
          width: 420, padding: 36, borderRadius: 20,
          background: 'linear-gradient(180deg, rgba(11,6,23,0.85), rgba(11,6,23,0.92))',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 0 0 1px rgba(192,132,252,0.20), 0 30px 80px rgba(0,0,0,0.5), 0 0 80px rgba(157,77,255,0.15)',
          animation: 'q-fade-up 0.5s 0.1s both cubic-bezier(.2,.8,.2,1)',
        }}>
          <div className="q-mono q-eyebrow-violet" style={{ fontSize: 10.5, letterSpacing: '0.22em', marginBottom: 8 }}>
            {t('login.eyebrow')}
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', margin: '0 0 6px' }}>
            {t('login.title')}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--q-text-3)', margin: '0 0 22px' }}>{t('login.subtitle')}</p>

          <QField label={t('login.email')} value={email} onChange={setEmail} type="email" autoFocus
            icon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="2" y="3.5" width="12" height="9" rx="1.5"/><path d="M2.5 4.5L8 9 13.5 4.5"/></svg>} />
          <QField label={t('login.password')} value={pw} onChange={setPw} type="password"
            icon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 015 0v2"/></svg>} />

          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 4, marginBottom: 18 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <span style={{ width: 14, height: 14, borderRadius: 4, border: '1px solid var(--q-stroke-2)', background:'rgba(157,77,255,0.14)', display:'grid', placeItems:'center' }}>
                <QIcon name="check" size={9}/>
              </span>
              <span style={{ fontSize: 11.5, color: 'var(--q-text-3)' }}>Remember device</span>
            </label>
            <button type="button" onClick={()=>toast('Reset link sent to ' + email)} className="q-btn q-btn-ghost" style={{ padding:'4px 8px', fontSize: 11.5, border:'none' }}>
              {t('login.forgot')}
            </button>
          </div>

          <button type="submit" disabled={loading} className="q-btn q-btn-primary" style={{
            width: '100%', padding: '12px 16px', fontSize: 13.5, justifyContent: 'center',
            opacity: loading ? 0.7 : 1, cursor: loading?'progress':'pointer',
            position: 'relative', overflow: 'hidden',
          }}>
            {loading ? (<><span className="q-pulse-dot"/> Verifying…</>) : (<>{t('login.signin')} <QIcon name="arrow-right" size={12}/></>)}
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:10, margin:'20px 0 14px' }}>
            <span style={{ flex:1, height:1, background:'var(--q-stroke-1)' }}/>
            <span className="q-mono" style={{ fontSize:10, letterSpacing:'0.18em', color:'var(--q-text-3)' }}>{t('login.continue')}</span>
            <span style={{ flex:1, height:1, background:'var(--q-stroke-1)' }}/>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { k:'apple', l:'Apple', svg: <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M11.4 8.5c0-1.5 1.2-2.2 1.3-2.3-0.7-1-1.8-1.2-2.2-1.2-0.9-0.1-1.8 0.5-2.3 0.5-0.5 0-1.2-0.5-2-0.5-1 0-2 0.6-2.5 1.5-1.1 1.9-0.3 4.6 0.7 6.1 0.5 0.7 1.1 1.5 1.9 1.5 0.8 0 1-0.5 2-0.5 1 0 1.2 0.5 2 0.5 0.8 0 1.4-0.7 1.9-1.5 0.6-0.9 0.9-1.7 0.9-1.7-0.1 0-1.7-0.7-1.7-2.4zM10 4c0.4-0.5 0.7-1.2 0.6-2-0.6 0-1.4 0.4-1.8 0.9-0.4 0.4-0.8 1.2-0.7 1.9 0.7 0.1 1.4-0.4 1.9-0.8z"/></svg> },
              { k:'google', l:'Google', svg: <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M14.4 8.2c0-0.5 0-1-0.1-1.4H8v2.6h3.6c-0.2 0.9-0.6 1.6-1.4 2.1v1.7h2.2c1.3-1.2 2-2.9 2-5z"/><path d="M8 14.5c1.9 0 3.5-0.6 4.6-1.7l-2.2-1.7c-0.6 0.4-1.4 0.7-2.4 0.7-1.8 0-3.4-1.2-3.9-2.9H1.8v1.8C2.9 12.9 5.3 14.5 8 14.5z"/><path d="M4.1 9c-0.1-0.4-0.2-0.8-0.2-1.2 0-0.4 0.1-0.8 0.2-1.2V4.7H1.8C1.3 5.6 1 6.7 1 7.8s0.3 2.2 0.8 3.1L4.1 9z"/><path d="M8 4.1c1 0 2 0.4 2.7 1l2-2C11.5 2 9.9 1.5 8 1.5c-2.7 0-5.1 1.6-6.2 3.9l2.3 1.8C4.6 5.4 6.2 4.1 8 4.1z"/></svg> },
              { k:'wallet', l:'Web3', svg: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3.5" width="12" height="9" rx="1.5"/><path d="M11 8h2"/></svg> },
            ].map(p => (
              <button key={p.k} type="button" onClick={()=>toast(`Auth via ${p.l} · sandbox`)} className="q-btn q-btn-ghost"
                style={{ padding:'10px 8px', fontSize: 11.5, justifyContent:'center', gap:6 }}>
                {p.svg} {p.l}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px dashed var(--q-stroke-1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 11.5, color: 'var(--q-text-3)' }}>{t('login.new')}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" onClick={()=>{ localStorage.removeItem('quark.firstrun'); onAuth({email:'demo@quark.fi', mode: 'create'}); }} className="q-btn q-btn-ghost" style={{ padding:'5px 10px', fontSize:11.5 }}>
                {t('login.create')}
              </button>
              <button type="button" onClick={()=>onAuth({email:'demo@quark.fi', mode: 'demo'})} className="q-btn" style={{ padding:'5px 10px', fontSize:11.5 }}>
                {t('login.demo')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function LangSwitch({ lang, setLang }) {
  return (
    <div style={{ display:'flex', gap:3, background:'rgba(7,2,15,0.5)', padding:3, borderRadius:8, border:'1px solid var(--q-stroke-1)' }}>
      {[['en','EN'],['es','ES']].map(([k,l])=>(
        <button key={k} onClick={()=>setLang(k)} className="q-btn q-btn-ghost"
          style={{ padding:'4px 10px', fontSize:10.5, border:'none', fontWeight:500,
            background: lang===k?'rgba(157,77,255,0.22)':'transparent',
            color: lang===k?'var(--q-violet-300)':'var(--q-text-3)' }}>{l}</button>
      ))}
    </div>
  );
}

window.ScreenLogin = ScreenLogin;
window.LangSwitch = LangSwitch;
