import React, { useState } from "react";

/* ─── GLOBAL STYLES ─────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=DM+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  body { font-family: 'DM Sans', 'Segoe UI', sans-serif; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #f8fafc; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
  @keyframes fadeUp   { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes slideDown{ from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin     { to { transform: rotate(360deg); } }
  @keyframes pulseDot { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(.7);opacity:.5;} }
  .trow:hover td      { background: #f5f8ff !important; }
  .btn-edit:hover     { background: #e0e7ff !important; border-color: #a5b4fc !important; }
  .btn-del:hover      { background: #fee2e2 !important; border-color: #fca5a5 !important; }
  .scan-item:hover    { background: #f8fafc !important; }
`;

/* ─── CONFIG ─────────────────────────────────────────────── */
const STATUS_CONFIG = {
  Working:         { bg: "#ecfdf5", color: "#059669", dot: "#10b981", border: "#a7f3d0", glow: "rgba(16,185,129,.12)" },
  "Under Utilise": { bg: "#fffbeb", color: "#d97706", dot: "#f59e0b", border: "#fde68a", glow: "rgba(245,158,11,.12)" },
  Idle:            { bg: "#fff1f2", color: "#e11d48", dot: "#f43f5e", border: "#fecdd3", glow: "rgba(244,63,94,.12)" },
};
const PLANT_COLORS = {
  Mundhwa:  { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  Baramati: { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  R1:       { color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc" },
  R2:       { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
};

/* ─── ICONS ──────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const LayersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
);
const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const SaveIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);
const WarningIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const ScanIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
  </svg>
);

/* ─── STAT CARD ──────────────────────────────────────────── */
const StatCard = ({ label, value, accent, emoji, onClick, active }) => (
  <div
    onClick={onClick}
    style={{
      cursor: onClick ? "pointer" : "default",
      background: "white",
      borderRadius: "14px",
      padding: "18px 22px",
      border: active ? `2px solid ${accent}` : "1px solid #f1f5f9",
      boxShadow: active
        ? `0 0 0 4px ${accent}15`
        : "0 1px 8px rgba(0,0,0,0.05)",
      display: "flex",
      alignItems: "center",
      gap: "14px",
      flex: "1 1 0",
      minWidth: "130px",
      position: "relative",
      overflow: "hidden",
      animation: "fadeUp .35s ease both",
      transition: "all .2s"
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "3px",
        background: accent,
        borderRadius: "14px 0 0 14px"
      }}
    />
    <div
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        background: accent + "15",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px"
      }}
    >
      {emoji}
    </div>
    <div>
      <div
        style={{
          fontSize: "27px",
          fontWeight: "800",
          color: "#0f172a",
          fontFamily: "'IBM Plex Mono', monospace"
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "10.5px",
          color: "#94a3b8",
          fontWeight: "700",
          marginTop: "4px",
          textTransform: "uppercase",
          letterSpacing: "0.7px"
        }}
      >
        {label}
      </div>
    </div>
  </div>
);

/* ─── STATUS BADGE ───────────────────────────────────────── */
const StatusBadge = ({ value }) => {
  const cfg = STATUS_CONFIG[value] || { bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8", border: "#e2e8f0", glow: "transparent" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "3px 10px", borderRadius: "20px",
      background: cfg.bg, color: cfg.color,
      fontSize: "11px", fontWeight: "700",
      border: `1px solid ${cfg.border}`,
      boxShadow: `0 0 0 2px ${cfg.glow}`,
      whiteSpace: "nowrap"
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: cfg.dot, flexShrink: 0, animation: value === "Working" ? "pulseDot 2s infinite" : "none" }} />
      {value}
    </span>
  );
};

/* ─── RFID CHIP ──────────────────────────────────────────── */
const RfidChip = ({ value }) => {
  if (!value) return <span style={{ color: "#cbd5e1", fontSize: "11px", fontStyle: "italic" }}>Not scanned</span>;
  const short = value.length > 14 ? "…" + value.slice(-12) : value;
  return (
    <span title={value} style={{
      fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace",
      fontSize: "10.5px", color: "#0891b2",
      background: "#ecfeff", padding: "2px 7px",
      borderRadius: "5px", border: "1px solid #a5f3fc",
      display: "inline-block"
    }}>
      {short}
    </span>
  );
};

/* ─── PLANT PILL ─────────────────────────────────────────── */
const PlantPill = ({ value }) => {
  const cfg = PLANT_COLORS[value] || { color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "3px 8px", borderRadius: "6px",
      background: cfg.bg, color: cfg.color,
      fontSize: "11px", fontWeight: "700",
      border: `1px solid ${cfg.border}`
    }}>
      {value}
    </span>
  );
};

/* ─── FORM FIELD ─────────────────────────────────────────── */
const FormField = ({ label, value, onChange, disabled, type = "text", children, required }) => (
  <div style={{ marginBottom: "14px" }}>
    <label style={{
      display: "block", fontSize: "10px", fontWeight: "700",
      color: disabled ? "#cbd5e1" : "#64748b",
      marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.7px"
    }}>
      {label}{required && <span style={{ color: "#e11d48", marginLeft: "3px" }}>*</span>}
    </label>
    {children || (
      <input type={type} value={value || ""} onChange={onChange} disabled={disabled}
        style={{
          width: "100%", padding: "9px 12px", boxSizing: "border-box",
          borderRadius: "8px", fontSize: "13px", color: "#1e293b",
          border: `1.5px solid ${disabled ? "#f1f5f9" : "#e2e8f0"}`,
          background: disabled ? "#f8fafc" : "white",
          outline: "none", transition: "border-color 0.15s, box-shadow 0.15s",
          fontFamily: "inherit"
        }}
        onFocus={e => { if (!disabled) { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,.1)"; } }}
        onBlur={e => { e.target.style.borderColor = disabled ? "#f1f5f9" : "#e2e8f0"; e.target.style.boxShadow = "none"; }}
      />
    )}
  </div>
);

/* ─── EDIT MODAL ─────────────────────────────────────────── */
const EditModal = ({ asset, onClose, onSave, onChange }) => (
  <div onClick={onClose} style={{
    position: "fixed", inset: 0,
    background: "rgba(15,23,42,0.65)",
    backdropFilter: "blur(8px)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 9999, padding: "20px", animation: "fadeIn .18s ease"
  }}>
    <div onClick={e => e.stopPropagation()} style={{
      background: "white", width: "100%", maxWidth: "600px",
      maxHeight: "92vh", overflowY: "auto",
      borderRadius: "20px",
      boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
      animation: "fadeUp .22s ease"
    }}>
      {/* Header */}
      <div style={{
        padding: "22px 26px 18px", borderBottom: "1px solid #f1f5f9",
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        background: "linear-gradient(135deg,#f8faff,#fff)",
        borderRadius: "20px 20px 0 0", position: "sticky", top: 0, zIndex: 10
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "11px", marginBottom: "5px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", flexShrink: 0 }}>
              <EditIcon />
            </div>
            <h2 style={{ margin: 0, fontSize: "17px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.3px" }}>
              Edit Asset
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: "11.5px", color: "#94a3b8", paddingLeft: "47px" }}>
            Tag:&nbsp;
            <code style={{ fontFamily: "'IBM Plex Mono',monospace", color: "#6366f1", background: "#eef2ff", padding: "1px 7px", borderRadius: "4px", fontSize: "12px" }}>
              {asset.assetTagNo}
            </code>
          </p>
        </div>
        <button onClick={onClose} style={{
          width: "32px", height: "32px", borderRadius: "8px",
          border: "1.5px solid #e2e8f0", background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "#94a3b8", flexShrink: 0, transition: "all .15s"
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#374151"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#94a3b8"; }}
        >
          <CloseIcon />
        </button>
      </div>

      <div style={{ padding: "22px 26px" }}>
        {/* Status selector — pill buttons instead of dropdown */}
        <div style={{ marginBottom: "6px" }}>
          <label style={{ display: "block", fontSize: "10px", fontWeight: "700", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.7px" }}>
            Asset Status <span style={{ color: "#e11d48" }}>*</span>
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            {["Working", "Under Utilise", "Idle"].map(s => {
              const cfg = STATUS_CONFIG[s]; const active = asset.assetStatus === s;
              return (
                <button key={s} type="button" onClick={() => onChange({ ...asset, assetStatus: s })} style={{
                  flex: 1, padding: "9px 6px", borderRadius: "9px", cursor: "pointer",
                  border: `1.5px solid ${active ? cfg.dot : "#e2e8f0"}`,
                  background: active ? cfg.bg : "white",
                  color: active ? cfg.color : "#94a3b8",
                  fontSize: "12px", fontWeight: "700", transition: "all .15s",
                  boxShadow: active ? `0 0 0 3px ${cfg.glow}` : "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  fontFamily: "inherit"
                }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: active ? cfg.dot : "#d1d5db" }}/>
                  {s}
                </button>
              );
            })}
          </div>
        </div>
        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "16px" }}>
          <div style={{ width: "3px", height: "14px", background: "#6366f1", borderRadius: "2px" }}/>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <FormField label="Asset Tag No." value={asset.assetTagNo} required onChange={e => onChange({ ...asset, assetTagNo: e.target.value })} />
          <FormField label="RFID No." value={asset.rfidNo} disabled />
          <FormField label="Asset No." value={asset.assetNo} onChange={e => onChange({ ...asset, assetNo: e.target.value })} />
          <FormField label="Model No." value={asset.modelNo} onChange={e => onChange({ ...asset, modelNo: e.target.value })} />
          <FormField label="Serial No." value={asset.serialNo} onChange={e => onChange({ ...asset, serialNo: e.target.value })} />
          <FormField label="Mfg Year" value={asset.mfgYear} onChange={e => onChange({ ...asset, mfgYear: e.target.value })} />
          <FormField label="Plant" value={asset.plant} required onChange={e => onChange({ ...asset, plant: e.target.value })} />
          <FormField label="Location" value={asset.location} onChange={e => onChange({ ...asset, location: e.target.value })} />
          <FormField label="Custodian" value={asset.custodian} onChange={e => onChange({ ...asset, custodian: e.target.value })} />
          <FormField label="Verified Date" value={asset.verifiedDate} onChange={e => onChange({ ...asset, verifiedDate: e.target.value })} />
          <FormField label="Comments">
            <textarea value={asset.comments || ""} onChange={e => onChange({ ...asset, comments: e.target.value })} rows={4}
              style={{
                width: "100%", padding: "10px 12px", boxSizing: "border-box",
                borderRadius: "9px", fontSize: "13px", color: "#1e293b",
                border: "1.5px solid #e2e8f0", background: "white",
                outline: "none", resize: "vertical", minHeight: "90px",
                fontFamily: "inherit", lineHeight: "1.6", transition: "border-color .15s, box-shadow .15s"
              }}
              onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,.1)"; }}
              onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
            />
          </FormField>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "14px 26px 22px", display: "flex", justifyContent: "flex-end", gap: "10px",
        borderTop: "1px solid #f8fafc",
        background: "linear-gradient(0deg,#fafafa,#fff)", borderRadius: "0 0 20px 20px"
      }}>
        <button onClick={onClose} style={{
          padding: "9px 20px", borderRadius: "9px",
          border: "1.5px solid #e2e8f0", background: "white",
          fontSize: "13px", fontWeight: "600", color: "#64748b",
          cursor: "pointer", fontFamily: "inherit"
        }}>
          Cancel
        </button>
        <button onClick={onSave} style={{
          padding: "9px 20px", borderRadius: "9px",
          background: "linear-gradient(135deg,#6366f1,#4f46e5)",
          color: "white", border: "none",
          fontSize: "13px", fontWeight: "700",
          cursor: "pointer", display: "flex", alignItems: "center", gap: "7px",
          boxShadow: "0 4px 14px rgba(99,102,241,0.35)", fontFamily: "inherit"
        }}>
          <SaveIcon /> Save Changes
        </button>
      </div>
    </div>
  </div>
);

/* ─── DELETE CONFIRM MODAL ───────────────────────────────── */
const DeleteModal = ({ asset, onClose, onConfirm }) => (
  <div onClick={onClose} style={{
    position: "fixed", inset: 0,
    background: "rgba(15,23,42,0.65)",
    backdropFilter: "blur(8px)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 9999, padding: "20px", animation: "fadeIn .18s ease"
  }}>
    <div onClick={e => e.stopPropagation()} style={{
      background: "white", width: "100%", maxWidth: "400px",
      borderRadius: "20px", boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
      animation: "fadeUp .22s ease"
    }}>
      <div style={{ padding: "30px 28px 22px", textAlign: "center" }}>
        <div style={{
          width: "60px", height: "60px", borderRadius: "18px",
          background: "#fff1f2", display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 18px", border: "1.5px solid #fecdd3"
        }}>
          <WarningIcon />
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: "19px", fontWeight: "800", color: "#0f172a" }}>
          Delete Asset?
        </h3>
        <p style={{ margin: "0 0 10px", fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>
          This will permanently remove
        </p>
        <div style={{
          display: "inline-block", padding: "5px 14px", background: "#f8fafc",
          borderRadius: "8px", border: "1.5px solid #e2e8f0",
          fontFamily: "'IBM Plex Mono',monospace", fontSize: "14px", fontWeight: "700", color: "#0f172a",
          marginBottom: "10px"
        }}>
          {asset.assetTagNo}
        </div>
        <p style={{ margin: 0, fontSize: "11.5px", color: "#94a3b8" }}>
          This action cannot be undone.
        </p>
      </div>
      <div style={{ padding: "0 28px 26px", display: "flex", gap: "10px" }}>
        <button onClick={onClose} style={{
          flex: 1, padding: "10px", borderRadius: "10px",
          border: "1.5px solid #e2e8f0", background: "white",
          fontSize: "13px", fontWeight: "600", color: "#64748b",
          cursor: "pointer", fontFamily: "inherit"
        }}>
          Keep Asset
        </button>
        <button onClick={onConfirm} style={{
          flex: 1, padding: "10px", borderRadius: "10px",
          background: "linear-gradient(135deg,#f43f5e,#e11d48)",
          color: "white", border: "none", fontSize: "13px", fontWeight: "700",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(225,29,72,0.32)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
          fontFamily: "inherit"
        }}>
          <TrashIcon /> Delete
        </button>
      </div>
    </div>
  </div>
);

/* ─── TH ─────────────────────────────────────────────────── */
const TH = ({ children, mandatory }) => (
  <th style={{
    padding: "10px 14px", textAlign: "left",
    fontSize: "10px", fontWeight: "800", color: "#94a3b8",
    textTransform: "uppercase", letterSpacing: "0.8px",
    whiteSpace: "nowrap", background: "#f9fafb",
    borderBottom: "2px solid #f1f5f9"
  }}>
    {children}
    {mandatory && <span style={{ color: "#e11d48", marginLeft: "2px" }}>*</span>}
  </th>
);

/* ─── ASSET ROW ──────────────────────────────────────────── */
const AssetRow = ({ asset, index, handleEdit, handleDelete }) => {
  const cell = {
    padding: "10px 14px", verticalAlign: "middle",
    borderBottom: "1px solid #f8fafc", fontSize: "12.5px",
    background: index % 2 === 0 ? "#fff" : "#fafbfd",
    whiteSpace: "nowrap"
  };
  return (
    <tr className="trow" style={{ transition: "background .1s" }}>
      <td style={cell}>
        <span style={{ fontWeight: "800", color: "#0f172a", fontSize: "12px", fontFamily: "'IBM Plex Mono',monospace" }}>
          {asset.assetTagNo}
        </span>
      </td>
      <td style={{ ...cell, maxWidth: "140px" }}><RfidChip value={asset.rfidNo} /></td>
      <td style={{ ...cell, fontFamily: "'IBM Plex Mono',monospace", color: "#64748b", fontSize: "11.5px" }}>{asset.assetNo || "—"}</td>
      <td style={{ ...cell, fontWeight: "600", color: "#334155" }}>{asset.modelNo || "—"}</td>
      <td style={{ ...cell, fontFamily: "'IBM Plex Mono',monospace", color: "#94a3b8", fontSize: "11px" }}>{asset.serialNo || "—"}</td>
      <td style={cell}><PlantPill value={asset.plant} /></td>
      <td style={{ ...cell, color: "#475569" }}>{asset.location || <span style={{ color: "#e2e8f0" }}>—</span>}</td>
      <td style={{ ...cell, color: "#334155" }}>{asset.custodian || <span style={{ color: "#e2e8f0" }}>—</span>}</td>
      <td style={{ ...cell, textAlign: "center", fontFamily: "'IBM Plex Mono',monospace", color: "#64748b" }}>{asset.mfgYear || "—"}</td>
      <td style={{ ...cell, color: "#1d4ed8", fontWeight: "600", fontFamily: "'IBM Plex Mono',monospace", fontSize: "11.5px" }}>
        {asset.verifiedDate || <span style={{ color: "#cbd5e1", fontStyle: "italic", fontWeight: 400, fontFamily: "inherit" }}>—</span>}
      </td>
      <td style={cell}><StatusBadge value={asset.assetStatus} /></td>
      <td style={{ ...cell, maxWidth: "180px", whiteSpace: "normal", wordBreak: "break-word", color: "#475569" }}>
        {asset.comments || <span style={{ color: "#e2e8f0" }}>—</span>}
      </td>
      <td style={{ ...cell, textAlign: "right" }}>
        <div style={{ display: "flex", gap: "5px", justifyContent: "flex-end" }}>
          <button className="btn-edit" onClick={() => handleEdit(asset)} style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            padding: "5px 10px", borderRadius: "7px",
            border: "1.5px solid #e0e7ff", background: "#eef2ff",
            color: "#4f46e5", fontSize: "11px", fontWeight: "700",
            cursor: "pointer", transition: "all .15s"
          }}>
            <EditIcon />
          </button>
          <button className="btn-del" onClick={() => handleDelete(asset)} style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            padding: "5px 10px", borderRadius: "7px",
            border: "1.5px solid #fecdd3", background: "#fff5f5",
            color: "#e11d48", fontSize: "11px", fontWeight: "700",
            cursor: "pointer", transition: "all .15s"
          }}>
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
};

/* ─── MAIN DASHBOARD ─────────────────────────────────────── */
export default function MainDashboard() {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [plantFilter, setPlantFilter] = useState("All");
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [scannedAssets, setScannedAssets] = useState([]);
  const [showScanPanel, setShowScanPanel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [verifiedDateFilter, setVerifiedDateFilter] = useState("");

  const handleEdit = (asset) => { setSelectedAsset({ ...asset }); setEditModal(true); };
  const handleDeleteClick = (asset) => { setSelectedAsset({ ...asset }); setDeleteModal(true); };


const getAuthHeadersWithCSRF = async (method = "GET", contentType = true) => {
  const credentials = btoa("caddok:");

  // Step 1: Trigger cookie set
  await fetch("https://ktfrancesrv2.kalyanicorp.com/api/v1/collection/kln_asset_scan?$filter=is_scanned eq 0", {
    method: "GET",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
    credentials: "include",
  });

  const csrfToken = getCookie("CSRFToken");
  console.log("Fetched CSRF Token from cookie:", csrfToken);

  if (!csrfToken) {
    throw new Error("CSRF token not found in cookies.");
  }

  const headers = {
    Authorization: `Basic ${credentials}`,
    "X-CSRF-Token": csrfToken,
  };

  if (contentType) {
    headers["Content-Type"] = "application/json";
  }

  return {
    headers,
    credentials: "include",
  };
};

  /* ─── fetch scans ─── */
  React.useEffect(() => {
    const fetchScans = async () => {
      try {
        const res = await fetch("https://ktfrancesrv2.kalyanicorp.com/api/v1/collection/kln_asset_scan?$filter=is_scanned eq 0");
        const data = await res.json();
        const mapped = (data.objects || [])
          .filter(scan => !assets.some(a => a.rfidNo === scan.rfid))
          .map(scan => ({ scanId: scan["@id"], barcode: scan.barcode, rfid: scan.rfid, department: scan.department, plantCode: scan.plant_code, dateTime: scan.date_time }));
        setScannedAssets(mapped);
      } catch (err) { console.error("Scan API error:", err); }
    };
    fetchScans();
    const interval = setInterval(fetchScans, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ─── save edit ─── */
  const handleSaveEdit = async () => {

    if (!selectedAsset.assetTagNo?.trim()) {
      alert("Asset Tag No is mandatory");
      return;
    }
    if (!selectedAsset.plant?.trim()) {
      alert("Plant is mandatory");
      return;
    }
    if (!selectedAsset.assetStatus?.trim()) {
      alert("Status is mandatory");
      return;
    }
    let formattedDate = null;
    if (selectedAsset.verifiedDate) {
      const parts = selectedAsset.verifiedDate.split(".");
      if (parts.length === 3) formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    const payload = {
      barcode_no: selectedAsset.assetTagNo, rfid_no: selectedAsset.rfidNo,
      asset_no: selectedAsset.assetNo, model_no: selectedAsset.modelNo,
      serial_no: selectedAsset.serialNo, plant: selectedAsset.plant,
      location: selectedAsset.location, custodian: selectedAsset.custodian,
      mfg_year: parseInt(selectedAsset.mfgYear || 0), verified_status: formattedDate,
      asset_status: selectedAsset.assetStatus, comments: selectedAsset.comments
    };
    try {
      if (selectedAsset.apiUrl) {
          const authOptions = await getAuthHeadersWithCSRF("PUT");
        await fetch(selectedAsset.apiUrl, { method: "PUT",...authOptions, body: JSON.stringify(payload) });
      } else {
          const authOptions = await getAuthHeadersWithCSRF("POST");
        await fetch("https://ktfrancesrv2.kalyanicorp.com/internal/asset_it_master", { method: "POST",...authOptions, body: JSON.stringify(payload) });
      }
      if (selectedAsset.scanId) {
          const authOptions = await getAuthHeadersWithCSRF("PUT");
        await fetch(selectedAsset.scanId, { method: "PUT", ...authOptions, body: JSON.stringify({ is_scanned: 1 }) });
      }
      setScannedAssets(prev => prev.filter(s => String(s.rfid).trim() !== String(selectedAsset.rfidNo).trim()));
      setEditModal(false); setSelectedAsset(null); await fetchMatchedAssets();
    } catch (err) { console.error("Save error:", err); }
  };

  /* ─── open scan for edit ─── */
  const openScanForEdit = async (scan) => {
  try {
    const res = await fetch(
      `https://ktfrancesrv2.kalyanicorp.com/api/v1/collection/kln_asset_master?$filter=rfid_no eq '${scan.rfid}'`
    );
    const data = await res.json();

    const vd = scan.dateTime
      ? new Date(scan.dateTime).toLocaleDateString("en-GB").replace(/\//g, ".")
      : "";

    if (data.objects && data.objects.length > 0) {
      const item = data.objects[0];

      setSelectedAsset({
        apiUrl: item["@id"],
        scanId: scan.scanId,
        assetTagNo: item.barcode_no,
        rfidNo: item.rfid_no,
        assetNo: item.asset_no,
        modelNo: item.model_no,
        serialNo: item.serial_no,
        plant: item.plant,
        location: item.location,
        custodian: item.custodian,
        mfgYear: item.mfg_year,
        verifiedDate: vd,
        assetStatus: item.asset_status,
        comments: item.comments || ""
      });
    } else {
      // New asset mode
      setSelectedAsset({
        scanId: scan.scanId,
        apiUrl: null,
        assetTagNo: scan.barcode,
        rfidNo: scan.rfid,
        assetNo: "",
        modelNo: "",
        serialNo: "",
        plant: "",
        location: "",
        custodian: "",
        mfgYear: "",
        verifiedDate: vd,
        assetStatus: "Working"
      });
    }

    setEditModal(true);
    setShowScanPanel(false);

  } catch (err) {
    console.error("Master fetch error:", err);
  }
};

  /* ─── delete ─── */
  const handleConfirmDelete = async () => {
    try {
        const authOptions = await getAuthHeadersWithCSRF("DELETE");
      if (selectedAsset.apiUrl) await fetch(selectedAsset.apiUrl, { method: "DELETE",...authOptions});
      if (selectedAsset.rfidNo) {
        const scanRes = await fetch(`https://ktfrancesrv2.kalyanicorp.com/api/v1/collection/kln_asset_scan?$filter=rfid eq '${selectedAsset.rfidNo}'`);
        const scanData = await scanRes.json();
        if (scanData.objects && scanData.objects.length > 0)
          await fetch(scanData.objects[0]["@id"], { method: "DELETE" });
      }
      setDeleteModal(false); setSelectedAsset(null); await fetchMatchedAssets();
    } catch (err) { console.error("Delete error:", err); }
  };


    const fetchMatchedAssets = async () => {
      try {
        const scanRes = await fetch(
          "https://ktfrancesrv2.kalyanicorp.com/api/v1/collection/kln_asset_scan?$filter=is_scanned eq 1"
        );
        const scanData = await scanRes.json();

        const scannedRfids = (scanData.objects || []).map(s =>
          String(s.rfid).trim()
        );

        if (scannedRfids.length === 0) {
          setAssets([]);
          return;
        }

        const masterRes = await fetch(
          "https://ktfrancesrv2.kalyanicorp.com/api/v1/collection/kln_asset_master"
        );
        const masterData = await masterRes.json();

        const matched = (masterData.objects || [])
          .filter(item =>
            scannedRfids.includes(String(item.rfid_no).trim())
          )
          .map(item => ({
            apiUrl: item["@id"],
            assetTagNo: item.barcode_no,
            rfidNo: item.rfid_no,
            assetNo: item.asset_no,
            modelNo: item.model_no,
            serialNo: item.serial_no,
            plant: item.plant,
            location: item.location,
            custodian: item.custodian,
            mfgYear: item.mfg_year,
            verifiedDate: item.verified_status
              ? new Date(item.verified_status)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, ".")
              : "",
            assetStatus: item.asset_status,
            comments: item.comments || ""
          }));

        setAssets(matched);

      } catch (err) {
        console.error("Match API Error:", err);
      }
    };

  /* ─── fetch master ─── */
  React.useEffect(() => {
    fetchMatchedAssets();
  }, []);

  const plants = ["All", ...Array.from(new Set(assets.map(a => a.plant).filter(Boolean)))];
  const filtered = assets.filter(a => {
  const q = search.toLowerCase();

  const matchesSearch =
    Object.values(a).some(v =>
      String(v).toLowerCase().includes(q)
    );

  const matchesStatus =
    statusFilter === "All" || a.assetStatus === statusFilter;

  const matchesPlant =
    plantFilter === "All" || a.plant === plantFilter;

  const matchesVerifiedDate =
    !verifiedDateFilter || a.verifiedDate === verifiedDateFilter;

  return (
    matchesSearch &&
    matchesStatus &&
    matchesPlant &&
    matchesVerifiedDate
  );
});
  const counts = {
    total: assets.length,
    working: assets.filter(a => a.assetStatus === "Working").length,
    under: assets.filter(a => a.assetStatus === "Under Utilise").length,
    idle: assets.filter(a => a.assetStatus === "Idle").length,
    scanned: assets.filter(a => a.rfidNo).length,
  };

  const selectStyle = {
    padding: "7px 30px 7px 11px", borderRadius: "8px",
    border: "1.5px solid #e2e8f0", fontSize: "12px",
    color: "#334155", background: "white",
    cursor: "pointer", fontWeight: "600", outline: "none",
    appearance: "none", fontFamily: "inherit",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 9px center"
  };
  const paginationBtnStyle = {
  padding: "6px 12px",
  borderRadius: "8px",
  border: "1.5px solid #e2e8f0",
  background: "white",
  fontSize: "12px",
  fontWeight: "600",
  cursor: "pointer"
};

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

const paginatedData = filtered.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
);

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ minHeight: "100vh", background: "#f0f2f5", fontFamily: "'DM Sans','Segoe UI',sans-serif", position: "relative" }}>

        {/* ── HEADER ── */}
        <div style={{
          background: "linear-gradient(100deg,#0f172a 0%,#1e3a5f 55%,#0c4a6e 100%)",
          height: "60px", padding: "0 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 4px 24px rgba(0,0,0,0.28)",
          position: "sticky", top: 0, zIndex: 100
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "13px" }}>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "11px", padding: "7px", display: "flex", border: "1px solid rgba(255,255,255,.08)" }}>
              <LayersIcon />
            </div>
            <div>
              <div style={{ color: "white", fontWeight: "800", fontSize: "15px", letterSpacing: "-0.4px" }}>
                Asset Management System
              </div>
              <div style={{ color: "rgba(255,255,255,0.38)", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase" }}>
                RFID · TRACK · AUDIT
              </div>
            </div>
          </div>

          {/* New Asset button */}
          <button onClick={() => setShowScanPanel(!showScanPanel)} style={{
            position: "relative",
            background: scannedAssets.length ? "rgba(239,68,68,.15)" : "rgba(255,255,255,.08)",
            border: `1px solid ${scannedAssets.length ? "rgba(239,68,68,.45)" : "rgba(255,255,255,.18)"}`,
            borderRadius: "9px", padding: "7px 16px",
            color: scannedAssets.length ? "#fca5a5" : "rgba(255,255,255,.85)",
            fontSize: "12.5px", fontWeight: "700", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "7px",
            fontFamily: "inherit", transition: "all .2s"
          }}>
            <ScanIcon />
            New Asset
            {scannedAssets.length > 0 && (
              <span style={{
                background: "#ef4444", color: "white", borderRadius: "99px",
                fontSize: "10px", padding: "1px 7px", fontWeight: "800",
                animation: "pulseDot 2s infinite", minWidth: "20px", textAlign: "center"
              }}>
                {scannedAssets.length}
              </span>
            )}
          </button>
        </div>

        {/* ── SCAN PANEL ── */}
        {showScanPanel && (
          <div style={{
            position: "absolute", right: "24px", top: "68px", width: "330px",
            background: "white", borderRadius: "16px",
            boxShadow: "0 16px 50px rgba(0,0,0,.18), 0 0 0 1px #e2e8f0",
            zIndex: 999, overflow: "hidden", animation: "slideDown .18s ease"
          }}>
            <div style={{
              padding: "14px 16px", borderBottom: "1px solid #f1f5f9",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "linear-gradient(135deg,#f8f9ff,#fff)"
            }}>
              <div>
                <div style={{ fontWeight: "800", fontSize: "13px", color: "#0f172a" }}>Newly Scanned Assets</div>
                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "1px" }}>Click to register or update</div>
              </div>
              <button onClick={() => setShowScanPanel(false)} style={{
                width: "28px", height: "28px", borderRadius: "7px",
                border: "1.5px solid #e2e8f0", background: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#94a3b8"
              }}>
                <CloseIcon />
              </button>
            </div>

            {scannedAssets.length === 0 ? (
              <div style={{ padding: "28px", textAlign: "center", color: "#94a3b8", fontSize: "12px" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>📡</div>
                No new scans yet
              </div>
            ) : (
              <div style={{ maxHeight: "340px", overflowY: "auto" }}>
                {scannedAssets.map(scan => (
                  <div key={scan.scanId} className="scan-item" onClick={() => openScanForEdit(scan)}
                    style={{ padding: "11px 16px", borderBottom: "1px solid #f8fafc", background: "white", cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>

                      <div style={{
                        fontSize: "12px",
                        color: "#0f172a",
                        fontWeight: "600"
                      }}>
                        <span style={{ color: "#64748b", fontWeight: "700" }}>
                          Asset Tag No. :
                        </span>{" "}
                        <span style={{ fontFamily: "'IBM Plex Mono',monospace" }}>
                          {scan.barcode || "—"}
                        </span>
                      </div>

                      <div style={{
                        fontSize: "11.5px",
                        color: "#334155"
                      }}>
                        <span style={{ color: "#64748b", fontWeight: "700" }}>
                          RFID :
                        </span>{" "}
                        <span style={{
                          fontFamily: "'IBM Plex Mono',monospace",
                          color: "#0891b2"
                        }}>
                          {scan.rfid || "Not Available"}
                        </span>
                      </div>

                    </div>
                      {scan.plantCode && (
                        <span style={{ fontSize: "10px", background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: "5px", fontWeight: "700" }}>
                          {scan.plantCode}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ padding: "22px 26px" }}>

          {/* Title Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "21px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>
                Asset Registry
              </h2>
              <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#94a3b8" }}>
                Track and manage all RFID-tagged assets across plants
              </p>
            </div>
            <div style={{
              background: "#fff7ed", color: "#c2410c", padding: "6px 14px",
              borderRadius: "8px", fontSize: "11px", fontWeight: "700",
              display: "flex", alignItems: "center", gap: "5px", border: "1px solid #fed7aa"
            }}>
              <span style={{ color: "#ef4444" }}>*</span> Mandatory Fields
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "10px", flexWrap: "wrap" }}>
          <StatCard
            label="Total Assets"
            value={counts.total}
            accent="#3b82f6"
            emoji="📦"
            onClick={() => setStatusFilter("All")}
            active={statusFilter === "All"}
          />

          <StatCard
            label="Working"
            value={counts.working}
            accent="#10b981"
            emoji="✅"
            onClick={() => setStatusFilter("Working")}
            active={statusFilter === "Working"}
          />

          <StatCard
            label="Under Utilise"
            value={counts.under}
            accent="#f59e0b"
            emoji="⚠️"
            onClick={() => setStatusFilter("Under Utilise")}
            active={statusFilter === "Under Utilise"}
          />

          <StatCard
            label="Idle"
            value={counts.idle}
            accent="#f43f5e"
            emoji="🔴"
            onClick={() => setStatusFilter("Idle")}
            active={statusFilter === "Idle"}
          />

          <StatCard
            label="RFID Scanned"
            value={counts.scanned}
            accent="#0ea5e9"
            emoji="📡"
          />
        </div>
        {statusFilter !== "All" && (
          <div style={{ marginBottom: "18px", textAlign: "right" }}>
            <button
              onClick={() => setStatusFilter("All")}
              style={{
                padding: "7px 16px",
                borderRadius: "8px",
                border: "1.5px solid #e2e8f0",
                background: "white",
                fontSize: "12px",
                fontWeight: "700",
                color: "#475569",
                cursor: "pointer",
                transition: "all .15s"
              }}
            >
              ✖ Clear Filter
            </button>
          </div>
        )}

          {/* Table Card */}
          <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e8eef6", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", overflow: "hidden" }}>

            {/* Toolbar */}
            <div style={{
              padding: "14px 18px", borderBottom: "1px solid #f1f5f9",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: "12px", flexWrap: "wrap",
              background: "linear-gradient(180deg,#fafbff,#fff)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontWeight: "800", fontSize: "14px", color: "#0f172a" }}>Asset Records</span>
                <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: "10.5px", fontWeight: "800", padding: "2px 10px", borderRadius: "20px", fontFamily: "'IBM Plex Mono',monospace" }}>
                  {filtered.length}
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <select value={plantFilter} onChange={e => setPlantFilter(e.target.value)} style={selectStyle}>
                  {plants.map(p => <option key={p}>{p}</option>)}
                </select>
                <input
                  type="text"
                  placeholder="Verified Date (dd.mm.yyyy)"
                  value={verifiedDateFilter}
                  onChange={e => {
                    setVerifiedDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: "7px 10px",
                    borderRadius: "8px",
                    border: "1.5px solid #e2e8f0",
                    fontSize: "12px",
                    width: "170px"
                  }}
                />
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", display: "flex", pointerEvents: "none" }}>
                    <SearchIcon />
                  </span>
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search any field…"
                    style={{
                      paddingLeft: "32px", paddingRight: "12px", paddingTop: "7px", paddingBottom: "7px",
                      borderRadius: "8px", border: "1.5px solid #e2e8f0",
                      fontSize: "12px", color: "#334155", outline: "none",
                      background: "white", width: "200px", fontFamily: "inherit",
                      transition: "border-color .15s, box-shadow .15s"
                    }}
                    onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <TH mandatory>Asset Tag No.</TH>
                    <TH>RFID No.</TH>
                    <TH>Asset No.</TH>
                    <TH>Model No.</TH>
                    <TH>Serial No.</TH>
                    <TH mandatory>Plant</TH>
                    <TH>Location</TH>
                    <TH>Custodian</TH>
                    <TH>Mfg Year</TH>
                    <TH>Verified Date</TH>
                    <TH mandatory>Status</TH>
                    <TH>Comments</TH>
                    <TH>Actions</TH>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0
                    ? paginatedData.map((asset, i) => (
                      <AssetRow key={i} asset={asset} index={i} handleEdit={handleEdit} handleDelete={handleDeleteClick} />
                    ))
                    : (
                      <tr>
                        <td colSpan={13} style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
                          <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔍</div>
                          <div style={{ fontSize: "15px", fontWeight: "700", marginBottom: "4px", color: "#64748b" }}>No assets found</div>
                          <div style={{ fontSize: "12px" }}>Try adjusting your search or filters</div>
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div style={{
              padding: "14px 18px",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px"
            }}>

              <span style={{ fontSize: "12px", color: "#64748b" }}>
                Page {currentPage} of {totalPages || 1}
              </span>

              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  disabled={currentPage === 1 || totalPages <= 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  style={{
                    ...paginationBtnStyle,
                    opacity: currentPage === 1 || totalPages <= 1 ? 0.5 : 1,
                    cursor: currentPage === 1 || totalPages <= 1 ? "not-allowed" : "pointer"
                  }}
                >
                  ◀ Prev
                </button>
                <button
                  disabled={currentPage === totalPages || totalPages <= 1}
                  onClick={() => setCurrentPage(p => p + 1)}
                  style={{
                    ...paginationBtnStyle,
                    opacity: currentPage === totalPages || totalPages <= 1 ? 0.5 : 1,
                    cursor: currentPage === totalPages || totalPages <= 1 ? "not-allowed" : "pointer"
                  }}
                >
                  Next ▶
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* EDIT MODAL */}
        {editModal && selectedAsset && (
          <EditModal
            asset={selectedAsset}
            onClose={() => { setEditModal(false); setSelectedAsset(null); }}
            onSave={handleSaveEdit}
            onChange={setSelectedAsset}
          />
        )}

        {/* DELETE MODAL */}
        {deleteModal && selectedAsset && (
          <DeleteModal
            asset={selectedAsset}
            onClose={() => { setDeleteModal(false); setSelectedAsset(null); }}
            onConfirm={handleConfirmDelete}
          />
        )}
      </div>
    </>
  );
}