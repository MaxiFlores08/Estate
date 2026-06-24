import { useState, useEffect, useCallback } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

const estilosResultado = {
  INTACTO:       { color: "#22c55e", bg: "rgba(34,197,94,0.12)",  border: "#22c55e" },
  MODIFICADO:    { color: "#ef4444", bg: "rgba(239,68,68,0.12)",  border: "#ef4444" },
  NO_REGISTRADO: { color: "#f97316", bg: "rgba(249,115,22,0.12)", border: "#f97316" },
};

const TIPOS = ["Mensura", "Arquitectónico", "Estructural"];
const TIPOS_LEGALES = ["Compraventa", "Donación", "Sucesión"];

/* ── SVG Icons ────────────────────────────────────────────────────────────── */
const IconBuilding = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
  </svg>
);
const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconDoc = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const IconCheck = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconAlert = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconInfo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);
const IconRefresh = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);
const IconChain = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
/* Íconos de tipo de plano */
const IconMensura = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
);
const IconArquitectonico = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconEstructural = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const TIPO_ICONS = { "Mensura": IconMensura, "Arquitectónico": IconArquitectonico, "Estructural": IconEstructural };

/* ── CSS ──────────────────────────────────────────────────────────────────── */
const css = `
  :root {
    --indigo:    #6366f1;
    --violet:    #8b5cf6;
    --cyan:      #06b6d4;
    --bg:        #080c14;
    --surface:   rgba(255,255,255,0.04);
    --surface2:  rgba(255,255,255,0.07);
    --border:    rgba(255,255,255,0.08);
    --border2:   rgba(255,255,255,0.14);
    --text:      #e2e8f0;
    --muted:     #64748b;
    --success:   #22c55e;
    --danger:    #ef4444;
    --warning:   #f97316;
    --grad:      linear-gradient(135deg, var(--indigo), var(--violet), var(--cyan));
    --grad2:     linear-gradient(135deg, var(--indigo), var(--violet));
    --shadow:    0 8px 32px rgba(0,0,0,0.5);
    --shadow-sm: 0 4px 16px rgba(0,0,0,0.35);
    --blur:      blur(16px);
    --radius:    16px;
    --radius-sm: 10px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: var(--bg); overflow-x: hidden; }

  /* ── Blobs ── */
  .bg-blobs { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
  .blob { position: absolute; border-radius: 50%; filter: blur(90px); }
  .blob-1 {
    width: 640px; height: 640px;
    background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
    top: -12%; left: -8%; animation: blobDrift1 22s ease-in-out infinite;
  }
  .blob-2 {
    width: 520px; height: 520px;
    background: radial-gradient(circle, rgba(139,92,246,0.16) 0%, transparent 70%);
    top: 35%; right: -10%; animation: blobDrift2 18s ease-in-out infinite;
  }
  .blob-3 {
    width: 440px; height: 440px;
    background: radial-gradient(circle, rgba(6,182,212,0.13) 0%, transparent 70%);
    bottom: 4%; left: 22%; animation: blobDrift3 25s ease-in-out infinite;
  }
  @keyframes blobDrift1 {
    0%,100%{ transform:translate(0,0) scale(1); }
    33%    { transform:translate(30px,40px) scale(1.06); }
    66%    { transform:translate(-20px,20px) scale(0.97); }
  }
  @keyframes blobDrift2 {
    0%,100%{ transform:translate(0,0) scale(1); }
    40%    { transform:translate(-35px,-25px) scale(1.08); }
    70%    { transform:translate(20px,30px) scale(0.95); }
  }
  @keyframes blobDrift3 {
    0%,100%{ transform:translate(0,0) scale(1); }
    30%    { transform:translate(25px,-30px) scale(1.05); }
    65%    { transform:translate(-30px,15px) scale(1.02); }
  }

  /* ── Page ── */
  .rp-page {
    position: relative; z-index: 1;
    min-height: 100vh;
    color: var(--text);
    font-family: -apple-system, "Segoe UI", Roboto, sans-serif;
    padding-top: 64px;
  }

  /* ── Navbar ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px;
    background: rgba(8,12,20,0.85);
    backdrop-filter: var(--blur);
    border-bottom: 1px solid var(--border);
  }
  .nav-brand { display: flex; align-items: center; gap: 10px; }
  .nav-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--grad);
    display: flex; align-items: center; justify-content: center;
    color: #fff; flex-shrink: 0;
  }
  .nav-text { display: flex; flex-direction: column; line-height: 1.2; }
  .nav-text strong { font-size: 1rem; font-weight: 700; color: #f8fafc; letter-spacing: -.3px; }
  .nav-text span   { font-size: 0.7rem; color: var(--muted); }
  .nav-badge {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 14px; border-radius: 20px;
    background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25);
    font-size: 13px; font-weight: 600; color: var(--success);
  }
  .nav-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--success); animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%,100%{ opacity:1; transform:scale(1); }
    50%    { opacity:.5; transform:scale(.8); }
  }

  /* ── Hero ── */
  .hero {
    position: relative; overflow: hidden;
    padding: 80px 32px 68px; text-align: center;
  }
  .hero::before {
    content: ""; position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 60% 40% at 80% 50%, rgba(6,182,212,0.1) 0%, transparent 60%);
    pointer-events: none;
  }
  .hero-label {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 14px; border-radius: 20px;
    background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3);
    font-size: 12px; font-weight: 600; color: #a5b4fc; letter-spacing: .5px;
    text-transform: uppercase; margin-bottom: 24px;
  }
  .hero h1 {
    font-size: clamp(2rem, 5vw, 3.4rem);
    font-weight: 800; line-height: 1.15; letter-spacing: -1px;
    background: var(--grad);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; margin-bottom: 18px;
  }
  .hero p { max-width: 560px; margin: 0 auto; font-size: 1.05rem; color: var(--muted); line-height: 1.7; }

  /* ── KPI row ── */
  .kpi-row {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
    max-width: 1366px; margin: 0 auto 44px; padding: 0 32px;
  }
  .kpi-card {
    background: var(--surface); border: 1px solid var(--border);
    backdrop-filter: var(--blur); border-radius: var(--radius);
    padding: 22px 26px; display: flex; flex-direction: column; gap: 4px;
  }
  .kpi-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .8px; font-weight: 600; }
  .kpi-value { font-size: 1.7rem; font-weight: 700; color: #f1f5f9; line-height: 1.2; }
  .kpi-sub   { font-size: 12px; color: var(--muted); display: flex; align-items: center; gap: 5px; }
  .kpi-dot   { width: 7px; height: 7px; border-radius: 50%; background: var(--success); display: inline-block; }

  /* ── Main layout — vertical stack ── */
  .main-stack {
    display: flex; flex-direction: column; gap: 24px;
    max-width: 1366px; margin: 0 auto; padding: 0 32px 72px;
  }

  /* ── Cards ── */
  .rp-card {
    background: var(--surface);
    border: 1px solid var(--border);
    backdrop-filter: var(--blur);
    border-radius: var(--radius);
    padding: 36px;
    box-shadow: var(--shadow-sm);
    transition: border-color .2s;
  }
  .rp-card:hover { border-color: var(--border2); }
  .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
  .card-icon {
    width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: var(--surface2); border: 1px solid var(--border2);
  }
  .card-icon.accent { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.3); color: #a5b4fc; }
  .card-icon.teal   { background: rgba(6,182,212,0.12);  border-color: rgba(6,182,212,0.3);  color: #67e8f9; }
  .card-header h2   { font-size: 1.2rem; font-weight: 600; color: #f1f5f9; }

  /* ── Form sections ── */
  .form-section { margin-bottom: 28px; }
  .form-section-title {
    font-size: 11px; font-weight: 700; color: var(--muted);
    text-transform: uppercase; letter-spacing: 1px;
    margin-bottom: 16px; padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }
  .fields-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0 20px;
  }
  .fields-grid .field-full { grid-column: 1 / -1; }

  /* ── Tipo cards ── */
  .tipo-cards {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
    margin-bottom: 4px;
  }
  .tipo-card {
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    padding: 20px 12px;
    background: rgba(0,0,0,0.2);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    cursor: pointer; transition: all .18s;
    color: var(--muted); font-size: 13px; font-weight: 600;
    text-align: center;
  }
  .tipo-card:hover { border-color: var(--border2); color: var(--text); background: var(--surface2); }
  .tipo-card.activo {
    border-color: var(--indigo);
    background: rgba(99,102,241,0.12);
    color: #c7d2fe;
    box-shadow: 0 0 0 1px rgba(99,102,241,0.3), 0 4px 16px rgba(99,102,241,0.2);
  }
  .tipo-card-icon { opacity: .7; transition: opacity .18s; }
  .tipo-card.activo .tipo-card-icon { opacity: 1; }

  /* ── Campos específicos con transición suave ── */
  .campos-especificos {
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: max-height .35s ease, opacity .25s ease;
  }
  .campos-especificos.visible {
    max-height: 600px;
    opacity: 1;
  }
  .campos-especificos-inner { padding-top: 20px; }

  /* ── Field label ── */
  .field-label {
    display: block; font-size: 11px; font-weight: 600; color: var(--muted);
    text-transform: uppercase; letter-spacing: .7px; margin-bottom: 6px;
  }
  .field-wrap { margin-bottom: 16px; }
  .field-wrap:last-child { margin-bottom: 0; }

  /* ── Inputs ── */
  .rp-input {
    width: 100%; padding: 13px 16px;
    font-size: 15px; color: #f1f5f9;
    background: rgba(0,0,0,0.3);
    border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: var(--radius-sm); outline: none;
    transition: border-color .15s, box-shadow .15s;
  }
  .rp-input::placeholder { color: var(--muted); }
  .rp-input:focus {
    border-color: var(--indigo);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.18);
  }
  .rp-select {
    width: 100%; padding: 13px 16px;
    font-size: 15px; color: #f1f5f9;
    background: rgba(0,0,0,0.3);
    border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: var(--radius-sm); outline: none;
    appearance: none; cursor: pointer;
    transition: border-color .15s, box-shadow .15s;
  }
  .rp-select:focus { border-color: var(--indigo); box-shadow: 0 0 0 3px rgba(99,102,241,0.18); }
  .rp-select option { background: #1e293b; }

  .rp-file {
    width: 100%; font-size: 14px; color: #94a3b8; margin-bottom: 16px; display: block;
  }
  .rp-file::file-selector-button {
    padding: 9px 16px; margin-right: 12px;
    border: 1px solid var(--border2); border-radius: 8px;
    background: var(--surface2); color: #e2e8f0;
    font-size: 13px; cursor: pointer; transition: background .15s;
  }
  .rp-file::file-selector-button:hover { background: rgba(255,255,255,0.1); }

  /* ── Buttons ── */
  .rp-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px 28px; width: 100%;
    font-size: 15px; font-weight: 600; color: #fff;
    background: var(--grad2);
    border: none; border-radius: var(--radius-sm); cursor: pointer;
    transition: opacity .15s, transform .1s, box-shadow .15s;
    box-shadow: 0 4px 20px rgba(99,102,241,0.35);
  }
  .rp-btn:hover    { opacity:.9; transform:translateY(-1px); box-shadow:0 6px 24px rgba(99,102,241,0.45); }
  .rp-btn:active   { transform:translateY(0); }
  .rp-btn:disabled { opacity:.45; cursor:not-allowed; transform:none; box-shadow:none; }
  .rp-btn-sm {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 16px; font-size: 13px; font-weight: 600; color: var(--text);
    background: var(--surface2); border: 1px solid var(--border2);
    border-radius: 8px; cursor: pointer; transition: background .15s;
  }
  .rp-btn-sm:hover    { background: rgba(255,255,255,0.1); }
  .rp-btn-sm:disabled { opacity:.45; cursor:not-allowed; }

  /* ── Spinner ── */
  .spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
    animation: spin .7s linear infinite; flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Preview iframe ── */
  .rp-preview {
    width: 100%; height: 560px; margin-bottom: 20px;
    border: 1.5px solid var(--border2); border-radius: var(--radius-sm);
    background: rgba(0,0,0,0.3);
  }
  .rp-preview-placeholder {
    width: 100%; margin-bottom: 20px; padding: 24px 20px;
    border: 1.5px solid var(--border2); border-radius: var(--radius-sm);
    background: rgba(0,0,0,0.2);
    display: flex; align-items: center; gap: 14px;
    color: var(--muted); font-size: 14px; line-height: 1.5;
  }
  .rp-preview-placeholder svg { flex-shrink: 0; opacity: .6; }

  /* ── Error / Banner ── */
  .rp-error {
    margin-top: 18px; padding: 13px 16px; border-radius: var(--radius-sm);
    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.35);
    color: #fca5a5; font-size: 14px;
  }
  .rp-banner {
    margin-top: 18px; padding: 20px 22px;
    border-radius: var(--radius-sm); border: 1px solid;
    display: flex; align-items: center; gap: 14px;
    animation: fadeSlide .3s ease;
  }
  @keyframes fadeSlide {
    from { opacity:0; transform:translateY(6px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .rp-banner-text   { display:flex; flex-direction:column; gap:2px; }
  .rp-banner-status { font-size:1.1rem; font-weight:700; }
  .rp-banner-desc   { font-size:13px; opacity:.75; }

  /* ── JSON ── */
  .rp-json-label {
    font-size:11px; color:var(--muted); margin:16px 0 6px;
    text-transform:uppercase; letter-spacing:1px;
  }
  .rp-json {
    background:rgba(0,0,0,0.4); color:var(--muted);
    border:1px solid var(--border); border-radius:var(--radius-sm);
    padding:14px; font-size:12px; line-height:1.55;
    white-space:pre-wrap; word-break:break-all;
  }

  /* ── Historial ── */
  .rp-historial-header {
    display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;
  }
  .rp-table { width:100%; border-collapse:collapse; font-size:13.5px; }
  .rp-table th {
    text-align:left; padding:9px 12px;
    color:var(--muted); font-size:11px; text-transform:uppercase;
    letter-spacing:.8px; border-bottom:1px solid var(--border);
  }
  .rp-table td {
    padding:11px 12px; border-bottom:1px solid rgba(255,255,255,0.04);
    color:#cbd5e1; vertical-align:top; word-break:break-all;
  }
  .rp-table tr:last-child td { border-bottom:none; }
  .rp-table tr:hover td      { background:rgba(255,255,255,0.02); }
  .rp-empty { text-align:center; color:var(--muted); padding:32px 0; font-size:14px; }

  /* ── Wizard paso ── */
  .wizard-step {
    overflow: hidden;
    transition: max-height .4s ease, opacity .3s ease;
  }
  .wizard-step.oculto { max-height: 0; opacity: 0; pointer-events: none; }
  .wizard-step.visible { max-height: 9999px; opacity: 1; }

  /* ── Categoria cards ── */
  .cat-cards {
    display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
    margin-bottom: 8px;
  }
  .cat-card {
    display: flex; flex-direction: column; align-items: center; gap: 14px;
    padding: 32px 20px;
    border: 2px solid transparent;
    border-radius: var(--radius);
    cursor: pointer; transition: all .2s;
    font-size: 15px; font-weight: 700; text-align: center;
  }
  .cat-card-planos {
    background: rgba(99,102,241,0.1);
    border-color: rgba(99,102,241,0.25);
    color: #a5b4fc;
  }
  .cat-card-planos:hover {
    background: rgba(99,102,241,0.18);
    border-color: var(--indigo);
    box-shadow: 0 4px 24px rgba(99,102,241,0.25);
    transform: translateY(-2px);
  }
  .cat-card-legales {
    background: rgba(6,182,212,0.08);
    border-color: rgba(6,182,212,0.2);
    color: #67e8f9;
  }
  .cat-card-legales:hover {
    background: rgba(6,182,212,0.15);
    border-color: var(--cyan);
    box-shadow: 0 4px 24px rgba(6,182,212,0.2);
    transform: translateY(-2px);
  }
  .cat-card-emoji { font-size: 2.4rem; line-height: 1; }
  .cat-card-sub { font-size: 12px; font-weight: 400; opacity: .7; margin-top: -6px; }

  /* ── Volver btn ── */
  .btn-volver {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; margin-bottom: 24px;
    font-size: 13px; font-weight: 600; color: var(--muted);
    background: transparent; border: 1px solid var(--border);
    border-radius: 8px; cursor: pointer; transition: all .15s;
  }
  .btn-volver:hover { color: var(--text); border-color: var(--border2); background: var(--surface2); }

  /* ── Placeholder legal ── */
  .legal-placeholder {
    padding: 40px 24px; text-align: center;
    color: var(--muted); font-size: 14px; line-height: 1.8;
    border: 1.5px dashed var(--border2); border-radius: var(--radius-sm);
    margin-top: 20px;
  }
  .legal-placeholder strong { display: block; font-size: 16px; color: var(--text); margin-bottom: 6px; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .cat-cards { grid-template-columns: 1fr; }

    .nav { padding: 0 16px; }
    .hero { padding: 52px 16px 44px; }
    .kpi-row    { grid-template-columns: 1fr; padding: 0 16px; }
    .main-stack { padding: 0 16px 52px; gap: 16px; }
    .rp-card    { padding: 22px; }
    .rp-preview { height: 340px; }
    .tipo-cards { grid-template-columns: 1fr; }
    .fields-grid { grid-template-columns: 1fr; }
    .fields-grid .field-full { grid-column: 1; }
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    .kpi-row    { padding: 0 24px; }
    .main-stack { padding: 0 24px 60px; }
  }
`;

/* ── Helpers ──────────────────────────────────────────────────────────────── */
const bannerMeta = {
  INTACTO:       { label: "Documento íntegro",    desc: "El archivo coincide exactamente con el registrado.", Icon: IconCheck },
  MODIFICADO:    { label: "Documento modificado", desc: "El hash no coincide. El archivo fue alterado.",      Icon: IconAlert },
  NO_REGISTRADO: { label: "No registrado",        desc: "No existe ningún registro con ese ID en la cadena.", Icon: IconInfo  },
};

const ACCEPT_PLANOS = ".pdf,.dwg,.dxf,.ifc,.rvt";
function esPDF(archivo) {
  if (!archivo) return false;
  return archivo.type === "application/pdf" || archivo.name.toLowerCase().endsWith(".pdf");
}
function PreviewArchivo({ archivo, previewUrl }) {
  if (!archivo) return null;
  if (esPDF(archivo)) {
    return <iframe className="rp-preview" src={previewUrl} title="Vista previa del PDF" />;
  }
  return (
    <div className="rp-preview-placeholder">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
      <span>
        Vista previa disponible solo para PDF.<br />
        <strong style={{ color: "var(--text)" }}>{archivo.name}</strong> listo para registrar.
      </span>
    </div>
  );
}

function camposComunesVacios() {
  return { titulo: "", propietario: "", ubicacion: "", fechaPlano: "", profesional: "", matricula: "" };
}
function camposMensura()        { return { superficie: "", inscripcion: "" }; }
function camposArquitectonico() { return { subtipo: "planta", superficieCubierta: "", escala: "" }; }
function camposEstructural()    { return { tipoEstructura: "hormigon-armado", escala: "" }; }

/* ── App ──────────────────────────────────────────────────────────────────── */
export default function App() {
  const [refreshHistorial, setRefreshHistorial] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState("—");

  return (
    <>
      <div className="bg-blobs" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <div className="rp-page">
        <style>{css}</style>

        <nav className="nav">
          <div className="nav-brand">
            <div className="nav-icon"><IconBuilding /></div>
            <div className="nav-text">
              <strong>Estate</strong>
              <span>Registro de Propiedades</span>
            </div>
          </div>
          <div className="nav-badge">
            <span className="nav-dot" />
            Sepolia
          </div>
        </nav>

        <section className="hero">
          <div className="hero-label"><IconChain /> Powered by Blockchain</div>
          <h1>Registro de Propiedades<br />en Blockchain</h1>
          <p>Certificá la integridad de documentos inmobiliarios mediante hashes SHA-256 anclados en la red Ethereum Sepolia. Inmutable, verificable y descentralizado.</p>
        </section>

        <div className="kpi-row">
          <div className="kpi-card">
            <span className="kpi-label">Total registros</span>
            <span className="kpi-value">{totalRegistros}</span>
            <span className="kpi-sub">propiedades en cadena</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Red</span>
            <span className="kpi-value" style={{ fontSize: "1.3rem" }}>Sepolia</span>
            <span className="kpi-sub">Ethereum testnet</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Estado</span>
            <span className="kpi-value" style={{ fontSize: "1.3rem", color: "var(--success)" }}>Activo</span>
            <span className="kpi-sub"><span className="kpi-dot" /> sistema operativo</span>
          </div>
        </div>

        <div className="main-stack">
          <SeccionRegistrar onExito={() => setRefreshHistorial((n) => n + 1)} />
          <SeccionVerificar />
          <Historial refreshKey={refreshHistorial} onConteo={setTotalRegistros} />
        </div>
      </div>
    </>
  );
}

function camposLegalesVacios() {
  return { nroEscritura: "", designacion: "", ubicacion: "", escribano: "", superficie: "", fecha: "" };
}
function camposCompraventa() { return { comprador: "", vendedor: "", matricula: "", monto: "" }; }
function camposDonacion()    { return { donante: "", beneficiario: "" }; }
function camposSucesion()    { return { causante: "", heredero: "", expediente: "" }; }

/* ── SeccionRegistrar ─────────────────────────────────────────────────────── */
function SeccionRegistrar({ onExito }) {
  // Wizard
  const [categoria, setCategoria] = useState(null); // null | "planos" | "legales"
  const [tipo, setTipo]           = useState(null);  // null = sin selección
  // Formulario planos
  const [nroPlano, setNroPlano]   = useState("");
  const [comunes, setComunes]     = useState(camposComunesVacios());
  const [extra, setExtra]         = useState(camposMensura());
  // Formulario legales
  const [legalesBase, setLegalesBase]   = useState(camposLegalesVacios());
  const [legalesExtra, setLegalesExtra] = useState(camposCompraventa());
  const [archivoLegal, setArchivoLegal] = useState(null);
  const [previewUrlLegal, setPreviewUrlLegal] = useState(null);
  const [resultadoLegal, setResultadoLegal]   = useState(null);
  const [cargandoLegal, setCargandoLegal]     = useState(false);
  // Compartido
  const [archivo, setArchivo]     = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultado, setResultado]   = useState(null);
  const [cargando, setCargando]     = useState(false);

  function elegirCategoria(cat) {
    setCategoria(cat);
    setTipo(null);
    setExtra(camposMensura());
    setLegalesExtra(camposCompraventa());
    setResultado(null);
    setResultadoLegal(null);
  }

  function volver() {
    setCategoria(null);
    setTipo(null);
    setExtra(camposMensura());
    setLegalesExtra(camposCompraventa());
    setResultado(null);
    setResultadoLegal(null);
  }

  function elegirTipo(t) {
    setTipo(t);
    setResultado(null);
    if (t === "Mensura")        setExtra(camposMensura());
    if (t === "Arquitectónico") setExtra(camposArquitectonico());
    if (t === "Estructural")    setExtra(camposEstructural());
  }

  function elegirTipoLegal(t) {
    setTipo(t);
    setResultadoLegal(null);
    if (t === "Compraventa") setLegalesExtra(camposCompraventa());
    if (t === "Donación")    setLegalesExtra(camposDonacion());
    if (t === "Sucesión")    setLegalesExtra(camposSucesion());
  }

  async function enviarLegal() {
    if (!tipo) { setResultadoLegal({ error: "Elegí un tipo de escritura antes de registrar." }); return; }
    if (!legalesBase.nroEscritura.trim()) {
      setResultadoLegal({ error: "El número de escritura es obligatorio." });
      return;
    }
    if (!archivoLegal) {
      setResultadoLegal({ error: "Seleccioná el archivo del documento." });
      return;
    }
    setCargandoLegal(true);
    setResultadoLegal(null);
    try {
      const metadatos = JSON.stringify({ ...legalesBase, ...legalesExtra });
      const form = new FormData();
      form.append("id", legalesBase.nroEscritura.trim());
      form.append("documento", archivoLegal);
      form.append("tipo", tipo);
      form.append("metadatos", metadatos);
      form.append("categoria", "legales");
      const res  = await fetch(API + "/registrar", { method: "POST", body: form });
      const data = await res.json();
      setResultadoLegal(data);
      if (data.ok && onExito) onExito();
    } catch (e) {
      setResultadoLegal({ error: e.message });
    } finally {
      setCargandoLegal(false);
    }
  }

  useEffect(() => {
    if (!archivo) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(archivo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [archivo]);

  useEffect(() => {
    if (!archivoLegal) { setPreviewUrlLegal(null); return; }
    const url = URL.createObjectURL(archivoLegal);
    setPreviewUrlLegal(url);
    return () => URL.revokeObjectURL(url);
  }, [archivoLegal]);

  function setComun(campo, valor) { setComunes((p) => ({ ...p, [campo]: valor })); }
  function setExtraField(campo, valor) { setExtra((p) => ({ ...p, [campo]: valor })); }
  function setLegalBase(campo, valor) { setLegalesBase((p) => ({ ...p, [campo]: valor })); }
  function setLegalExtra(campo, valor) { setLegalesExtra((p) => ({ ...p, [campo]: valor })); }

  async function enviar() {
    if (!tipo)            { setResultado({ error: "Elegí un tipo de plano antes de registrar." }); return; }
    if (!nroPlano.trim()) { setResultado({ error: "El número de plano es obligatorio." }); return; }
    if (!archivo)         { setResultado({ error: "Seleccioná el archivo del plano." }); return; }
    setCargando(true);
    setResultado(null);
    try {
      const metadatos = JSON.stringify({ ...comunes, ...extra });
      const form = new FormData();
      form.append("id", nroPlano.trim());
      form.append("documento", archivo);
      form.append("tipo", tipo);
      form.append("metadatos", metadatos);
      form.append("categoria", categoria || "planos");
      const res  = await fetch(API + "/registrar", { method: "POST", body: form });
      const data = await res.json();
      setResultado(data);
      if (data.ok && onExito) onExito();
    } catch (e) {
      setResultado({ error: e.message });
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="rp-card">
      <div className="card-header">
        <div className="card-icon accent"><IconLock /></div>
        <h2>Registrar propiedad</h2>
      </div>

      {/* ── PASO 1: elegir categoría ── */}
      <div className={"wizard-step " + (!categoria ? "visible" : "oculto")}>
        <p className="form-section-title" style={{ marginBottom: 20 }}>¿Qué querés registrar?</p>
        <div className="cat-cards">
          <button type="button" className="cat-card cat-card-planos" onClick={() => elegirCategoria("planos")}>
            <span className="cat-card-emoji">📐</span>
            Planos
            <span className="cat-card-sub">Mensura, Arquitectónico, Estructural</span>
          </button>
          <button type="button" className="cat-card cat-card-legales" onClick={() => elegirCategoria("legales")}>
            <span className="cat-card-emoji">📜</span>
            Documentos Legales
            <span className="cat-card-sub">Compraventa, Donación, Sucesión</span>
          </button>
        </div>
      </div>

      {/* ── PASO 2 (planos) ── */}
      <div className={"wizard-step " + (categoria === "planos" ? "visible" : "oculto")}>
        <button type="button" className="btn-volver" onClick={volver}>← Volver</button>

        {/* Datos base */}
        <div className="form-section">
          <p className="form-section-title">Datos base</p>
          <div className="fields-grid">
            <div className="field-wrap field-full">
              <label className="field-label">Número de plano *</label>
              <input className="rp-input" placeholder="Ej: PLN-2024-001"
                value={nroPlano} onChange={(e) => setNroPlano(e.target.value)} />
            </div>
            <div className="field-wrap field-full">
              <label className="field-label">Título / nombre de obra</label>
              <input className="rp-input" placeholder="Ej: Residencia Familia García"
                value={comunes.titulo} onChange={(e) => setComun("titulo", e.target.value)} />
            </div>
            <div className="field-wrap">
              <label className="field-label">Propietario / titular</label>
              <input className="rp-input" placeholder="Nombre o razón social"
                value={comunes.propietario} onChange={(e) => setComun("propietario", e.target.value)} />
            </div>
            <div className="field-wrap">
              <label className="field-label">Ubicación</label>
              <input className="rp-input" placeholder="Dirección o parcela"
                value={comunes.ubicacion} onChange={(e) => setComun("ubicacion", e.target.value)} />
            </div>
            <div className="field-wrap">
              <label className="field-label">Profesional responsable</label>
              <input className="rp-input" placeholder="Nombre del profesional"
                value={comunes.profesional} onChange={(e) => setComun("profesional", e.target.value)} />
            </div>
            <div className="field-wrap">
              <label className="field-label">Matrícula profesional</label>
              <input className="rp-input" placeholder="Ej: CAP-1234"
                value={comunes.matricula} onChange={(e) => setComun("matricula", e.target.value)} />
            </div>
            <div className="field-wrap">
              <label className="field-label">Fecha del plano</label>
              <input className="rp-input" type="date" style={{ colorScheme: "dark" }}
                value={comunes.fechaPlano} onChange={(e) => setComun("fechaPlano", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Tipo de plano */}
        <div className="form-section">
          <p className="form-section-title">Tipo de plano</p>
          <div className="tipo-cards">
            {TIPOS.map((t) => (
              <button key={t} type="button"
                className={"tipo-card" + (tipo === t ? " activo" : "")}
                onClick={() => elegirTipo(t)}>
                {t}
              </button>
            ))}
          </div>

          <div className={"campos-especificos" + (tipo === "Mensura" ? " visible" : "")}>
            <div className="campos-especificos-inner">
              <div className="fields-grid">
                <div className="field-wrap">
                  <label className="field-label">Superficie del terreno (m²)</label>
                  <input className="rp-input" type="number" min="0" placeholder="Ej: 450"
                    value={tipo === "Mensura" ? extra.superficie || "" : ""}
                    onChange={(e) => setExtraField("superficie", e.target.value)} />
                </div>
                <div className="field-wrap">
                  <label className="field-label">Inscripción de dominio</label>
                  <input className="rp-input" placeholder="Ej: Matrícula 12345"
                    value={tipo === "Mensura" ? extra.inscripcion || "" : ""}
                    onChange={(e) => setExtraField("inscripcion", e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className={"campos-especificos" + (tipo === "Arquitectónico" ? " visible" : "")}>
            <div className="campos-especificos-inner">
              <div className="fields-grid">
                <div className="field-wrap">
                  <label className="field-label">Subtipo</label>
                  <select className="rp-select"
                    value={tipo === "Arquitectónico" ? extra.subtipo || "planta" : "planta"}
                    onChange={(e) => setExtraField("subtipo", e.target.value)}>
                    <option value="planta">Planta</option>
                    <option value="corte">Corte</option>
                    <option value="vista">Vista</option>
                    <option value="techos">Techos</option>
                  </select>
                </div>
                <div className="field-wrap">
                  <label className="field-label">Superficie cubierta (m²)</label>
                  <input className="rp-input" type="number" min="0" placeholder="Ej: 220"
                    value={tipo === "Arquitectónico" ? extra.superficieCubierta || "" : ""}
                    onChange={(e) => setExtraField("superficieCubierta", e.target.value)} />
                </div>
                <div className="field-wrap">
                  <label className="field-label">Escala</label>
                  <input className="rp-input" placeholder="Ej: 1:100"
                    value={tipo === "Arquitectónico" ? extra.escala || "" : ""}
                    onChange={(e) => setExtraField("escala", e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className={"campos-especificos" + (tipo === "Estructural" ? " visible" : "")}>
            <div className="campos-especificos-inner">
              <div className="fields-grid">
                <div className="field-wrap">
                  <label className="field-label">Tipo de estructura</label>
                  <select className="rp-select"
                    value={tipo === "Estructural" ? extra.tipoEstructura || "hormigon-armado" : "hormigon-armado"}
                    onChange={(e) => setExtraField("tipoEstructura", e.target.value)}>
                    <option value="hormigon-armado">Hormigón armado</option>
                    <option value="metalica">Metálica</option>
                    <option value="mixta">Mixta</option>
                  </select>
                </div>
                <div className="field-wrap">
                  <label className="field-label">Escala</label>
                  <input className="rp-input" placeholder="Ej: 1:50"
                    value={tipo === "Estructural" ? extra.escala || "" : ""}
                    onChange={(e) => setExtraField("escala", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Archivo + preview + botón */}
        <div className="form-section" style={{ marginBottom: 0 }}>
          <p className="form-section-title">Archivo</p>
          <input className="rp-file" type="file" accept={ACCEPT_PLANOS}
            onChange={(e) => setArchivo(e.target.files[0] || null)} />
          <PreviewArchivo archivo={archivo} previewUrl={previewUrl} />
          <button className="rp-btn" onClick={enviar} disabled={cargando}>
            {cargando ? <><span className="spinner" />Registrando...</> : "Registrar en blockchain"}
          </button>
        </div>

        {resultado?.error && <div className="rp-error">{resultado.error}</div>}

        {resultado && !resultado.error && (
          <>
            <div className="rp-banner" style={{ color: "#22c55e", background: "rgba(34,197,94,0.12)", borderColor: "#22c55e", marginTop: 18 }}>
              <IconCheck />
              <div className="rp-banner-text">
                <span className="rp-banner-status">Plano registrado</span>
                <span className="rp-banner-desc">Hash anclado en Sepolia correctamente.</span>
              </div>
            </div>
            <p className="rp-json-label">Detalle técnico</p>
            <pre className="rp-json">{JSON.stringify(resultado, null, 2)}</pre>
          </>
        )}
      </div>

      {/* ── PASO 2 (legales) ── */}
      <div className={"wizard-step " + (categoria === "legales" ? "visible" : "oculto")}>
        <button type="button" className="btn-volver" onClick={volver}>← Volver</button>

        {/* (a) Datos base legales */}
        <div className="form-section">
          <p className="form-section-title">Datos de la escritura</p>
          <div className="fields-grid">
            <div className="field-wrap field-full">
              <label className="field-label">Número de escritura *</label>
              <input className="rp-input" placeholder="Ej: ESC-2024-001"
                value={legalesBase.nroEscritura}
                onChange={(e) => setLegalBase("nroEscritura", e.target.value)} />
            </div>
            <div className="field-wrap field-full">
              <label className="field-label">Designación del inmueble</label>
              <input className="rp-input" placeholder="Ej: Lote de terreno rústico"
                value={legalesBase.designacion}
                onChange={(e) => setLegalBase("designacion", e.target.value)} />
            </div>
            <div className="field-wrap">
              <label className="field-label">Ubicación</label>
              <input className="rp-input" placeholder="Distrito / Provincia / Departamento"
                value={legalesBase.ubicacion}
                onChange={(e) => setLegalBase("ubicacion", e.target.value)} />
            </div>
            <div className="field-wrap">
              <label className="field-label">Escribano / Notario</label>
              <input className="rp-input" placeholder="Nombre del escribano"
                value={legalesBase.escribano}
                onChange={(e) => setLegalBase("escribano", e.target.value)} />
            </div>
            <div className="field-wrap">
              <label className="field-label">Superficie (m²)</label>
              <input className="rp-input" type="number" min="0" placeholder="Ej: 320"
                value={legalesBase.superficie}
                onChange={(e) => setLegalBase("superficie", e.target.value)} />
            </div>
            <div className="field-wrap">
              <label className="field-label">Fecha</label>
              <input className="rp-input" type="date" style={{ colorScheme: "dark" }}
                value={legalesBase.fecha}
                onChange={(e) => setLegalBase("fecha", e.target.value)} />
            </div>
          </div>
        </div>

        {/* (b) Tipo de escritura + campos específicos */}
        <div className="form-section">
          <p className="form-section-title">Tipo de escritura</p>
          <div className="tipo-cards">
            {TIPOS_LEGALES.map((t) => (
              <button key={t} type="button"
                className={"tipo-card" + (tipo === t ? " activo" : "")}
                onClick={() => elegirTipoLegal(t)}>
                {t}
              </button>
            ))}
          </div>

          <div className={"campos-especificos" + (tipo === "Compraventa" ? " visible" : "")}>
            <div className="campos-especificos-inner">
              <div className="fields-grid">
                <div className="field-wrap">
                  <label className="field-label">Comprador</label>
                  <input className="rp-input" placeholder="Nombre del comprador"
                    value={tipo === "Compraventa" ? legalesExtra.comprador || "" : ""}
                    onChange={(e) => setLegalExtra("comprador", e.target.value)} />
                </div>
                <div className="field-wrap">
                  <label className="field-label">Vendedor</label>
                  <input className="rp-input" placeholder="Nombre del vendedor"
                    value={tipo === "Compraventa" ? legalesExtra.vendedor || "" : ""}
                    onChange={(e) => setLegalExtra("vendedor", e.target.value)} />
                </div>
                <div className="field-wrap">
                  <label className="field-label">Matrícula</label>
                  <input className="rp-input" placeholder="Ej: Matrícula 98765"
                    value={tipo === "Compraventa" ? legalesExtra.matricula || "" : ""}
                    onChange={(e) => setLegalExtra("matricula", e.target.value)} />
                </div>
                <div className="field-wrap">
                  <label className="field-label">Monto ($)</label>
                  <input className="rp-input" type="number" min="0" placeholder="Ej: 150000"
                    value={tipo === "Compraventa" ? legalesExtra.monto || "" : ""}
                    onChange={(e) => setLegalExtra("monto", e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className={"campos-especificos" + (tipo === "Donación" ? " visible" : "")}>
            <div className="campos-especificos-inner">
              <div className="fields-grid">
                <div className="field-wrap">
                  <label className="field-label">Donante</label>
                  <input className="rp-input" placeholder="Nombre del donante"
                    value={tipo === "Donación" ? legalesExtra.donante || "" : ""}
                    onChange={(e) => setLegalExtra("donante", e.target.value)} />
                </div>
                <div className="field-wrap">
                  <label className="field-label">Beneficiario</label>
                  <input className="rp-input" placeholder="Nombre del beneficiario"
                    value={tipo === "Donación" ? legalesExtra.beneficiario || "" : ""}
                    onChange={(e) => setLegalExtra("beneficiario", e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className={"campos-especificos" + (tipo === "Sucesión" ? " visible" : "")}>
            <div className="campos-especificos-inner">
              <div className="fields-grid">
                <div className="field-wrap">
                  <label className="field-label">Causante</label>
                  <input className="rp-input" placeholder="Nombre del causante"
                    value={tipo === "Sucesión" ? legalesExtra.causante || "" : ""}
                    onChange={(e) => setLegalExtra("causante", e.target.value)} />
                </div>
                <div className="field-wrap">
                  <label className="field-label">Heredero</label>
                  <input className="rp-input" placeholder="Nombre del heredero"
                    value={tipo === "Sucesión" ? legalesExtra.heredero || "" : ""}
                    onChange={(e) => setLegalExtra("heredero", e.target.value)} />
                </div>
                <div className="field-wrap field-full">
                  <label className="field-label">Expediente</label>
                  <input className="rp-input" placeholder="Ej: EXP-2024-0055"
                    value={tipo === "Sucesión" ? legalesExtra.expediente || "" : ""}
                    onChange={(e) => setLegalExtra("expediente", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* (c) Archivo + preview + botón */}
        <div className="form-section" style={{ marginBottom: 0 }}>
          <p className="form-section-title">Documento</p>
          <input className="rp-file" type="file" accept={ACCEPT_PLANOS}
            onChange={(e) => setArchivoLegal(e.target.files[0] || null)} />
          <PreviewArchivo archivo={archivoLegal} previewUrl={previewUrlLegal} />
          <button className="rp-btn" onClick={enviarLegal} disabled={cargandoLegal}>
            {cargandoLegal ? <><span className="spinner" />Registrando...</> : "Registrar en blockchain"}
          </button>
        </div>

        {resultadoLegal?.error && <div className="rp-error">{resultadoLegal.error}</div>}

        {resultadoLegal && !resultadoLegal.error && (
          <>
            <div className="rp-banner" style={{ color: "#22c55e", background: "rgba(34,197,94,0.12)", borderColor: "#22c55e", marginTop: 18 }}>
              <IconCheck />
              <div className="rp-banner-text">
                <span className="rp-banner-status">Escritura registrada</span>
                <span className="rp-banner-desc">Hash anclado en Sepolia correctamente.</span>
              </div>
            </div>
            <p className="rp-json-label">Detalle técnico</p>
            <pre className="rp-json">{JSON.stringify(resultadoLegal, null, 2)}</pre>
          </>
        )}
      </div>
    </div>
  );
}

/* ── SeccionVerificar ─────────────────────────────────────────────────────── */
function SeccionVerificar() {
  const [id, setId]           = useState("");
  const [archivo, setArchivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultado, setResultado]   = useState(null);
  const [cargando, setCargando]     = useState(false);

  useEffect(() => {
    if (!archivo) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(archivo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [archivo]);

  async function enviar() {
    if (!id || !archivo) { setResultado({ error: "Completa el ID y elige un PDF." }); return; }
    setCargando(true);
    setResultado(null);
    try {
      const form = new FormData();
      form.append("id", id);
      form.append("documento", archivo);
      const res  = await fetch(API + "/verificar", { method: "POST", body: form });
      const data = await res.json();
      setResultado(data);
    } catch (e) {
      setResultado({ error: e.message });
    } finally {
      setCargando(false);
    }
  }

  const est  = resultado?.resultado ? estilosResultado[resultado.resultado] : null;
  const meta = resultado?.resultado ? bannerMeta[resultado.resultado] : null;

  return (
    <div className="rp-card">
      <div className="card-header">
        <div className="card-icon teal"><IconShield /></div>
        <h2>Verificar documento</h2>
      </div>

      <input className="rp-input" placeholder="ID / número de plano"
        value={id} onChange={(e) => setId(e.target.value)}
        style={{ marginBottom: 14 }} />
      <input className="rp-file" type="file" accept={ACCEPT_PLANOS}
        onChange={(e) => setArchivo(e.target.files[0] || null)} />
      <PreviewArchivo archivo={archivo} previewUrl={previewUrl} />
      <button className="rp-btn" onClick={enviar} disabled={cargando}>
        {cargando ? <><span className="spinner" />Verificando...</> : "Verificar integridad"}
      </button>

      {resultado?.error && <div className="rp-error">{resultado.error}</div>}

      {est && meta && (
        <div className="rp-banner" style={{ color: est.color, background: est.bg, borderColor: est.border }}>
          <meta.Icon />
          <div className="rp-banner-text">
            <span className="rp-banner-status">{meta.label}</span>
            <span className="rp-banner-desc">{meta.desc}</span>
          </div>
        </div>
      )}

      {resultado && !resultado.error && (
        <>
          <p className="rp-json-label">Detalle técnico</p>
          <pre className="rp-json">{JSON.stringify(resultado, null, 2)}</pre>
        </>
      )}
    </div>
  );
}

/* ── Historial ────────────────────────────────────────────────────────────── */
function Historial({ refreshKey, onConteo }) {
  const [filas, setFilas]       = useState([]);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const res  = await fetch(API + "/historial");
      const data = await res.json();
      setFilas(data);
      if (onConteo) onConteo(data.length);
    } catch { setFilas([]); }
    finally { setCargando(false); }
  }, [onConteo]);

  useEffect(() => { cargar(); }, [cargar, refreshKey]);

  return (
    <div className="rp-card">
      <div className="rp-historial-header">
        <div className="card-header" style={{ margin: 0 }}>
          <div className="card-icon" style={{ color: "#a5b4fc" }}><IconDoc /></div>
          <h2>Historial de registros</h2>
        </div>
        <button className="rp-btn-sm" onClick={cargar} disabled={cargando}>
          {cargando ? <span className="spinner" style={{ width: 13, height: 13 }} /> : <IconRefresh />}
          {cargando ? "Cargando" : "Actualizar"}
        </button>
      </div>

      {filas.length === 0 && !cargando && (
        <p className="rp-empty">No hay registros todavía.</p>
      )}

      {filas.length > 0 && (
        <table className="rp-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Hash</th>
              <th>Archivo</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td style={{ color: "#a5b4fc" }}>{f.tipo || "—"}</td>
                <td title={f.hash} style={{ fontFamily: "monospace", color: "#94a3b8" }}>
                  {f.hash.slice(0, 16)}…
                </td>
                <td>{f.archivo}</td>
                <td style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>
                  {new Date(f.fecha).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
