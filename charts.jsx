// Quark Finance — charts.jsx
// Specialized data-viz: net worth curve, sankey, risk radar, insights graph, sparkline,
// forecast cone, twin scenarios, donut, sankey-light, mission ring.

const { useMemo: useMemo2, useEffect: useEffect2, useState: useState2, useRef: useRef2 } = React;

// ─────────────────────────────────────────────────────────────
// 1. Net worth / patrimony — animated area chart with grid
// ─────────────────────────────────────────────────────────────
function QNetWorthChart({ height = 220, points, forecastFrom = 0.7 }) {
  const w = 600, h = height;
  const pad = { l: 12, r: 12, t: 18, b: 22 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const xs = points.map((_, i) => pad.l + (i / (points.length - 1)) * innerW);
  const ys = points.map(p => pad.t + innerH - ((p - min) / range) * innerH);

  let d = `M ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < xs.length; i++) {
    const cx = (xs[i - 1] + xs[i]) / 2;
    d += ` Q ${cx} ${ys[i - 1]} ${xs[i]} ${ys[i]}`;
  }

  const splitIdx = Math.floor(points.length * forecastFrom);
  const realD = (() => {
    let r = `M ${xs[0]} ${ys[0]}`;
    for (let i = 1; i <= splitIdx; i++) {
      const cx = (xs[i - 1] + xs[i]) / 2;
      r += ` Q ${cx} ${ys[i - 1]} ${xs[i]} ${ys[i]}`;
    }
    return r;
  })();
  const forecastD = (() => {
    let r = `M ${xs[splitIdx]} ${ys[splitIdx]}`;
    for (let i = splitIdx + 1; i < points.length; i++) {
      const cx = (xs[i - 1] + xs[i]) / 2;
      r += ` Q ${cx} ${ys[i - 1]} ${xs[i]} ${ys[i]}`;
    }
    return r;
  })();
  const fillD = realD + ` L ${xs[splitIdx]} ${pad.t + innerH} L ${xs[0]} ${pad.t + innerH} Z`;

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="nw-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9D4DFF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#9D4DFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nw-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C084FF" />
          <stop offset="70%" stopColor="#9D4DFF" />
          <stop offset="100%" stopColor="#6DF3FF" />
        </linearGradient>
      </defs>

      {/* horizontal grid */}
      {[0, 0.25, 0.5, 0.75, 1].map(t => (
        <line key={t} x1={pad.l} x2={w - pad.r}
          y1={pad.t + innerH * t} y2={pad.t + innerH * t}
          stroke="rgba(192,132,252,0.08)" strokeDasharray="2 4" />
      ))}
      {/* months */}
      {months.map((m, i) => (
        <text key={m} x={pad.l + (i / (months.length - 1)) * innerW} y={h - 6}
          fill="rgba(139,122,168,0.6)" fontSize="9" fontFamily="Geist Mono" textAnchor="middle">{m}</text>
      ))}

      {/* fill */}
      <path d={fillD} fill="url(#nw-fill)" />
      {/* real line */}
      <path d={realD} fill="none" stroke="url(#nw-line)" strokeWidth="2" strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 4px rgba(157,77,255,0.6))' }} />
      {/* forecast — dashed */}
      <path d={forecastD} fill="none" stroke="#6DF3FF" strokeWidth="1.4" strokeDasharray="3 3" strokeLinecap="round" opacity="0.8" />

      {/* split marker */}
      <line x1={xs[splitIdx]} x2={xs[splitIdx]} y1={pad.t} y2={pad.t + innerH}
        stroke="rgba(109,243,255,0.3)" strokeWidth="1" strokeDasharray="2 2" />
      <text x={xs[splitIdx] + 4} y={pad.t + 9} fill="#6DF3FF" fontSize="8" fontFamily="Geist Mono" letterSpacing="1">FORECAST →</text>

      {/* current dot */}
      <circle cx={xs[splitIdx]} cy={ys[splitIdx]} r="4" fill="#C084FF"
        style={{ filter: 'drop-shadow(0 0 8px #9D4DFF)' }} />
      <circle cx={xs[splitIdx]} cy={ys[splitIdx]} r="9" fill="none" stroke="#C084FF" opacity="0.4">
        <animate attributeName="r" values="4;14;4" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="2.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Cash flow sankey-light
// ─────────────────────────────────────────────────────────────
function QCashFlowSankey({ height = 200 }) {
  const sources = [
    { id: 'salary', label: 'Salary',     amount: 8400, color: '#9D4DFF' },
    { id: 'free',   label: 'Freelance',  amount: 1850, color: '#C084FF' },
    { id: 'inv',    label: 'Investments',amount:  720, color: '#6DF3FF' },
  ];
  const targets = [
    { id: 'rent',   label: 'Housing',    amount: 2400, color: '#7B2EFF' },
    { id: 'food',   label: 'Food',       amount: 1180, color: '#9D4DFF' },
    { id: 'sub',    label: 'Subscript.', amount:  340, color: '#D946EF' },
    { id: 'transp', label: 'Transport',  amount:  580, color: '#B266FF' },
    { id: 'save',   label: 'Savings',    amount: 4200, color: '#4ADE9B' },
    { id: 'other',  label: 'Other',      amount: 2270, color: '#8B7AA8' },
  ];
  const totalIn = sources.reduce((s, x) => s + x.amount, 0);
  const totalOut = targets.reduce((s, x) => s + x.amount, 0);
  const w = 600, h = height;
  const colW = 14;
  const gap = 4;

  // stack heights
  let yIn = 10;
  const sIn = sources.map(s => {
    const sh = ((s.amount / totalIn) * (h - 20));
    const o = { ...s, y: yIn, h: sh };
    yIn += sh + gap;
    return o;
  });
  let yOut = 10;
  const sOut = targets.map(t => {
    const sh = ((t.amount / totalOut) * (h - 20));
    const o = { ...t, y: yOut, h: sh };
    yOut += sh + gap;
    return o;
  });

  // flows: each source distributes to each target proportionally
  const flows = [];
  sIn.forEach(s => {
    let sOff = 0;
    sOut.forEach(t => {
      const flowAmt = (s.amount / totalIn) * t.amount;
      const flowH = (flowAmt / totalIn) * (h - 20);
      flows.push({
        s, t,
        sy: s.y + sOff,
        ty: t.y + (t.h * (s.amount / totalIn)) * 0,
        h: flowH,
      });
      sOff += flowH;
    });
  });
  // recompute target stacking offsets
  const tOffsets = {};
  sOut.forEach(t => { tOffsets[t.id] = 0; });
  flows.forEach(f => {
    f.ty = f.t.y + tOffsets[f.t.id];
    tOffsets[f.t.id] += f.h;
  });

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        {flows.map((f, i) => (
          <linearGradient key={i} id={`sf-${i}`} x1="0" x2="1">
            <stop offset="0%" stopColor={f.s.color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={f.t.color} stopOpacity="0.4" />
          </linearGradient>
        ))}
      </defs>

      {/* flows */}
      {flows.map((f, i) => {
        const x1 = colW, x2 = w - colW;
        const cx = (x1 + x2) / 2;
        const d = `M ${x1} ${f.sy}
                   C ${cx} ${f.sy}, ${cx} ${f.ty}, ${x2} ${f.ty}
                   L ${x2} ${f.ty + f.h}
                   C ${cx} ${f.ty + f.h}, ${cx} ${f.sy + f.h}, ${x1} ${f.sy + f.h} Z`;
        return <path key={i} d={d} fill={`url(#sf-${i})`} opacity="0.55" />;
      })}

      {/* source bars */}
      {sIn.map(s => (
        <g key={s.id}>
          <rect x="0" y={s.y} width={colW} height={s.h} fill={s.color} rx="2"
            style={{ filter: `drop-shadow(0 0 4px ${s.color})` }} />
          <text x={colW + 6} y={s.y + s.h / 2 + 3} fill="var(--q-text-2)" fontSize="10" fontFamily="Geist">{s.label}</text>
          <text x={colW + 6} y={s.y + s.h / 2 + 14} fill="var(--q-text-3)" fontSize="9" fontFamily="Geist Mono">${s.amount.toLocaleString()}</text>
        </g>
      ))}
      {/* target bars */}
      {sOut.map(t => (
        <g key={t.id}>
          <rect x={w - colW} y={t.y} width={colW} height={t.h} fill={t.color} rx="2"
            style={{ filter: `drop-shadow(0 0 4px ${t.color})` }} />
          <text x={w - colW - 6} y={t.y + t.h / 2 + 3} fill="var(--q-text-2)" fontSize="10" fontFamily="Geist" textAnchor="end">{t.label}</text>
        </g>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Risk Radar — orbital radar
// ─────────────────────────────────────────────────────────────
function QRiskRadar({ size = 360 }) {
  const cx = size / 2, cy = size / 2;
  const rings = [0.25, 0.5, 0.75, 1.0];
  const items = [
    { angle: 25,  dist: 0.35, label: 'Streaming bundle',       severity: 'low',  amount: '$48/mo', kind: 'subscription' },
    { angle: 75,  dist: 0.55, label: 'Forgotten gym',          severity: 'low',  amount: '$29/mo', kind: 'subscription' },
    { angle: 130, dist: 0.85, label: 'Cloud storage 2TB · 14m unused', severity: 'high', amount: '$120/mo', kind: 'leak' },
    { angle: 185, dist: 0.42, label: 'Coffee streak ↑37%',     severity: 'med',  amount: '$184/mo', kind: 'pattern' },
    { angle: 245, dist: 0.62, label: 'FX fee · intl txn',      severity: 'med',  amount: '$22/mo', kind: 'fee' },
    { angle: 305, dist: 0.78, label: 'Loan rate change Q3',    severity: 'high', amount: '+$310/mo', kind: 'risk' },
    { angle: 355, dist: 0.30, label: 'Insurance overlap',      severity: 'low',  amount: '$67/mo', kind: 'overlap' },
  ];
  const sevColor = { low: '#6DF3FF', med: '#FFB547', high: '#FF5A6E' };

  const maxR = size * 0.45;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <defs>
        <radialGradient id="radar-bg" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#9D4DFF" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#7B2EFF" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#7B2EFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="radar-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6DF3FF" stopOpacity="0" />
          <stop offset="100%" stopColor="#6DF3FF" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* core glow */}
      <circle cx={cx} cy={cy} r={maxR} fill="url(#radar-bg)" />

      {/* rings */}
      {rings.map((r, i) => (
        <circle key={i} cx={cx} cy={cy} r={maxR * r}
          fill="none" stroke="rgba(192,132,252,0.18)" strokeWidth="0.7"
          strokeDasharray={i === rings.length - 1 ? 'none' : '2 4'} />
      ))}
      {/* spokes */}
      {[0, 60, 120, 180, 240, 300].map(a => {
        const x = cx + Math.cos((a - 90) * Math.PI / 180) * maxR;
        const y = cy + Math.sin((a - 90) * Math.PI / 180) * maxR;
        return <line key={a} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(192,132,252,0.10)" strokeWidth="0.5" />;
      })}

      {/* sweep */}
      <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'q-orbit 8s linear infinite' }}>
        <path d={`M ${cx} ${cy} L ${cx + maxR} ${cy} A ${maxR} ${maxR} 0 0 0 ${cx + Math.cos(-Math.PI / 3) * maxR} ${cy + Math.sin(-Math.PI / 3) * maxR} Z`}
          fill="url(#radar-sweep)" opacity="0.5" />
      </g>

      {/* center core */}
      <circle cx={cx} cy={cy} r="3" fill="#FFFFFF" style={{ filter: 'drop-shadow(0 0 6px #C084FF)' }} />
      <circle cx={cx} cy={cy} r="6" fill="none" stroke="#C084FF" opacity="0.6" />

      {/* items */}
      {items.map((it, i) => {
        const r = it.dist * maxR;
        const x = cx + Math.cos((it.angle - 90) * Math.PI / 180) * r;
        const y = cy + Math.sin((it.angle - 90) * Math.PI / 180) * r;
        const c = sevColor[it.severity];
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke={c} strokeWidth="0.6" opacity="0.25" strokeDasharray="1 3" />
            <circle cx={x} cy={y} r={it.severity === 'high' ? 5 : it.severity === 'med' ? 4 : 3} fill={c}
              style={{ filter: `drop-shadow(0 0 6px ${c})`, animation: it.severity === 'high' ? 'q-pulse 1.6s ease-in-out infinite' : 'none' }} />
            {it.severity === 'high' && (
              <circle cx={x} cy={y} r="9" fill="none" stroke={c} opacity="0.6">
                <animate attributeName="r" values="5;15;5" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0;0.7" dur="1.8s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function QRiskRadarPanel({ size = 360 }) {
  const items = [
    { label: 'Loan rate change Q3', sev: 'high', delta: '+$310/mo', cat: 'rate-risk' },
    { label: 'Cloud storage · 14m unused', sev: 'high', delta: '$120/mo', cat: 'leak' },
    { label: 'Coffee streak ↑37%', sev: 'med',  delta: '$184/mo', cat: 'pattern' },
    { label: 'FX fee · intl txns', sev: 'med',  delta: '$22/mo',  cat: 'fee' },
    { label: 'Streaming bundle overlap', sev: 'low', delta: '$48/mo', cat: 'subs' },
  ];
  const sevColor = { low: '#6DF3FF', med: '#FFB547', high: '#FF5A6E' };
  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <QRiskRadar size={size} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="q-mono" style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--q-text-3)', marginBottom: 8 }}>
          7 SIGNALS · TRACKING
        </div>
        <div className="q-stack-sm">
          {items.map((it, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
              background: 'rgba(7,2,15,0.4)', borderRadius: 8,
              border: `1px solid ${it.sev === 'high' ? 'rgba(255,90,110,0.25)' : 'var(--q-stroke-1)'}`,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: sevColor[it.sev],
                boxShadow: `0 0 6px ${sevColor[it.sev]}`, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 12, color: 'var(--q-text-1)' }}>{it.label}</span>
              <span className="q-mono q-num" style={{ fontSize: 11, color: sevColor[it.sev] }}>{it.delta}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Quantum Insights — neural graph
// ─────────────────────────────────────────────────────────────
function QInsightsGraph({ width = 720, height = 420 }) {
  const nodes = [
    { id: 'salary',    x: 0.10, y: 0.30, label: 'Salary',         w: 1.3, type: 'income' },
    { id: 'freelance', x: 0.10, y: 0.70, label: 'Freelance',      w: 0.7, type: 'income' },
    { id: 'savings',   x: 0.32, y: 0.18, label: 'Savings rate',   w: 1.0, type: 'metric' },
    { id: 'food',      x: 0.30, y: 0.50, label: 'Food',           w: 0.8, type: 'spend' },
    { id: 'subs',      x: 0.32, y: 0.82, label: 'Subscriptions',  w: 0.5, type: 'spend' },
    { id: 'mood',      x: 0.55, y: 0.32, label: 'Stress index',   w: 0.9, type: 'signal' },
    { id: 'goal',      x: 0.55, y: 0.65, label: 'Down payment',   w: 1.1, type: 'goal' },
    { id: 'risk',      x: 0.78, y: 0.20, label: 'Liquidity risk', w: 0.9, type: 'risk' },
    { id: 'invest',    x: 0.78, y: 0.50, label: 'Index DCA',      w: 1.0, type: 'asset' },
    { id: 'twin',      x: 0.78, y: 0.80, label: 'Digital twin',   w: 1.1, type: 'ai' },
  ];
  const edges = [
    ['salary', 'savings', 'strong'],
    ['salary', 'food', 'med'],
    ['freelance', 'subs', 'med'],
    ['freelance', 'savings', 'weak'],
    ['food', 'mood', 'weak'],
    ['subs', 'mood', 'med'],
    ['savings', 'goal', 'strong'],
    ['savings', 'invest', 'strong'],
    ['mood', 'risk', 'strong'],
    ['goal', 'twin', 'med'],
    ['invest', 'twin', 'strong'],
    ['risk', 'twin', 'strong'],
  ];
  const typeColor = {
    income: '#6DF3FF', metric: '#C084FF', spend: '#FF7AE6', signal: '#FFB547',
    goal: '#4ADE9B', risk: '#FF5A6E', asset: '#9D4DFF', ai: '#FFFFFF',
  };
  const w = width, h = height;
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, { ...n, px: n.x * w, py: n.y * h }]));
  const eW = { strong: 1.6, med: 0.9, weak: 0.5 };
  const eO = { strong: 0.8, med: 0.45, weak: 0.25 };

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <defs>
        <radialGradient id="g-bg" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#9D4DFF" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#7B2EFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={w} height={h} fill="url(#g-bg)" />

      {/* edges */}
      {edges.map(([a, b, str], i) => {
        const A = nodeMap[a], B = nodeMap[b];
        const mx = (A.px + B.px) / 2, my = (A.py + B.py) / 2 - 30;
        const d = `M ${A.px} ${A.py} Q ${mx} ${my} ${B.px} ${B.py}`;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke="#9D4DFF" strokeWidth={eW[str]} opacity={eO[str]}
              style={{ filter: 'drop-shadow(0 0 3px rgba(157,77,255,0.6))' }} />
            {str === 'strong' && (
              <circle r="2" fill="#6DF3FF">
                <animateMotion dur={(5 + i * 0.4) + 's'} repeatCount="indefinite" path={d} />
              </circle>
            )}
          </g>
        );
      })}

      {/* nodes */}
      {nodes.map(n => {
        const c = typeColor[n.type];
        const r = 6 + n.w * 4;
        return (
          <g key={n.id} transform={`translate(${n.x * w}, ${n.y * h})`}>
            <circle r={r + 6} fill={c} opacity="0.10" />
            <circle r={r} fill={c} opacity="0.85" style={{ filter: `drop-shadow(0 0 6px ${c})` }} />
            <circle r={r - 3} fill="#0B0617" />
            <circle r={r - 5} fill={c} />
            <text y={r + 14} textAnchor="middle" fill="var(--q-text-1)" fontSize="10" fontFamily="Geist" fontWeight="500">
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. Spending donut
// ─────────────────────────────────────────────────────────────
function QDonut({ size = 200, items, centerLabel, centerValue }) {
  const total = items.reduce((s, x) => s + x.value, 0);
  const cx = size / 2, cy = size / 2;
  const r = size * 0.4, sw = size * 0.10;
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <filter id="donut-glow"><feGaussianBlur stdDeviation="2" /></filter>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(168,85,247,0.08)" strokeWidth={sw} />
      {items.map((it, i) => {
        const frac = it.value / total;
        const start = acc;
        acc += frac;
        const c = 2 * Math.PI * r;
        const dash = c * frac;
        const offset = -c * start;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={it.color} strokeWidth={sw}
            strokeDasharray={`${dash - 2} ${c}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${it.color})` }} />
        );
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--q-text-3)" fontSize="9" fontFamily="Geist Mono" letterSpacing="1.5">{centerLabel}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--q-text-1)" fontSize="20" fontFamily="Geist" fontWeight="600">{centerValue}</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. Forecast cone
// ─────────────────────────────────────────────────────────────
function QForecastCone({ height = 260, basePoints, scenarios }) {
  const w = 600, h = height;
  const pad = { l: 10, r: 80, t: 14, b: 22 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const all = [...basePoints, ...scenarios.flatMap(s => s.points)];
  const min = Math.min(...all), max = Math.max(...all);
  const range = max - min || 1;
  const N = basePoints.length;
  const xAt = (i) => pad.l + (i / (N - 1)) * innerW;
  const yAt = (v) => pad.t + innerH - ((v - min) / range) * innerH;
  const splitAt = Math.floor(N * 0.4);

  const path = (pts) => {
    let d = `M ${xAt(0)} ${yAt(pts[0])}`;
    for (let i = 1; i < pts.length; i++) {
      const cx = (xAt(i - 1) + xAt(i)) / 2;
      d += ` Q ${cx} ${yAt(pts[i - 1])} ${xAt(i)} ${yAt(pts[i])}`;
    }
    return d;
  };

  const conePath = (() => {
    const top = scenarios[0].points;
    const bot = scenarios[scenarios.length - 1].points;
    let d = `M ${xAt(splitAt)} ${yAt(top[splitAt])}`;
    for (let i = splitAt + 1; i < N; i++) {
      const cx = (xAt(i - 1) + xAt(i)) / 2;
      d += ` Q ${cx} ${yAt(top[i - 1])} ${xAt(i)} ${yAt(top[i])}`;
    }
    for (let i = N - 1; i >= splitAt; i--) {
      const cx = (xAt(i + 1) + xAt(i)) / 2;
      d += ` L ${xAt(i)} ${yAt(bot[i])}`;
    }
    return d + ' Z';
  })();

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="cone" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9D4DFF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#9D4DFF" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {/* grid */}
      {[0, 0.5, 1].map(t => (
        <line key={t} x1={pad.l} x2={w - pad.r} y1={pad.t + innerH * t} y2={pad.t + innerH * t}
          stroke="rgba(192,132,252,0.08)" />
      ))}
      <path d={conePath} fill="url(#cone)" stroke="none" />
      {/* scenarios */}
      {scenarios.map((s, i) => (
        <path key={i} d={path(s.points)} fill="none" stroke={s.color} strokeWidth="1.2"
          strokeDasharray="3 3" opacity="0.7" />
      ))}
      {/* base */}
      <path d={path(basePoints.slice(0, splitAt + 1))} fill="none" stroke="#C084FF" strokeWidth="2.2"
        style={{ filter: 'drop-shadow(0 0 4px #9D4DFF)' }} />
      <path d={path(basePoints.slice(splitAt))} fill="none" stroke="#C084FF" strokeWidth="1.8"
        strokeDasharray="2 3" transform={`translate(${xAt(splitAt) - xAt(0)}, 0)`} opacity="0.8" />
      {/* split line */}
      <line x1={xAt(splitAt)} y1={pad.t} x2={xAt(splitAt)} y2={pad.t + innerH}
        stroke="rgba(109,243,255,0.4)" strokeDasharray="2 2" />
      <text x={xAt(splitAt) + 4} y={pad.t + 9} fill="#6DF3FF" fontSize="8" fontFamily="Geist Mono" letterSpacing="1">NOW</text>

      {/* end labels */}
      {scenarios.map((s, i) => (
        <g key={i}>
          <circle cx={xAt(N - 1)} cy={yAt(s.points[N - 1])} r="3" fill={s.color}
            style={{ filter: `drop-shadow(0 0 4px ${s.color})` }} />
          <text x={xAt(N - 1) + 8} y={yAt(s.points[N - 1]) + 3}
            fill={s.color} fontSize="10" fontFamily="Geist" fontWeight="500">{s.label}</text>
          <text x={xAt(N - 1) + 8} y={yAt(s.points[N - 1]) + 14}
            fill="var(--q-text-3)" fontSize="9" fontFamily="Geist Mono">${(s.points[N - 1] / 1000).toFixed(0)}k</text>
        </g>
      ))}
    </svg>
  );
}

Object.assign(window, {
  QNetWorthChart, QCashFlowSankey, QRiskRadar, QRiskRadarPanel,
  QInsightsGraph, QDonut, QForecastCone,
});
