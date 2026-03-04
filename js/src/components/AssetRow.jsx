import React from "react";
import { EditIcon } from "./icons";

/* ─── CONFIG ─────────────────────────────────────────────── */
const STATUS_CONFIG = {
  Working:         { bg: "#ecfdf5", color: "#059669", dot: "#10b981", border: "#a7f3d0", glow: "rgba(16,185,129,.12)" },
  "Under Utilise": { bg: "#fffbeb", color: "#d97706", dot: "#f59e0b", border: "#fde68a", glow: "rgba(245,158,11,.12)" },
  Idle:            { bg: "#fff1f2", color: "#e11d48", dot: "#f43f5e", border: "#fecdd3", glow: "rgba(244,63,94,.12)" },
};

const PLANT_COLORS = {
  Mundhwa:  { color:"#2563eb", bg:"#eff6ff", border:"#bfdbfe" },
  Baramati: { color:"#7c3aed", bg:"#f5f3ff", border:"#ddd6fe" },
  R1:       { color:"#0891b2", bg:"#ecfeff", border:"#a5f3fc" },
  R2:       { color:"#ea580c", bg:"#fff7ed", border:"#fed7aa" }
};

/* ─── STATUS BADGE ───────────────────────────────────────── */
const StatusBadge = ({ value }) => {
  const cfg = STATUS_CONFIG[value] || { bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8", border: "#e2e8f0", glow: "transparent" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 10px",
      borderRadius: "20px", background: cfg.bg, color: cfg.color,
      fontSize: "11px", fontWeight: "700", border: `1px solid ${cfg.border}`,
      boxShadow: `0 0 0 2px ${cfg.glow}`, whiteSpace: "nowrap"
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
    <span title={value} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10.5px", color: "#0891b2", background: "#ecfeff", padding: "2px 7px", borderRadius: "5px", border: "1px solid #a5f3fc", display: "inline-block" }}>
      {short}
    </span>
  );
};

/* ─── PLANT PILL ─────────────────────────────────────────── */
const PlantPill = ({ value }) => {
  const cfg = PLANT_COLORS[value] || { color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 8px", borderRadius: "6px", background: cfg.bg, color: cfg.color, fontSize: "11px", fontWeight: "700", border: `1px solid ${cfg.border}` }}>
      {value}
    </span>
  );
};

/* ─── ASSET ROW ──────────────────────────────────────────── */
export default function AssetRow ({ asset, index, handleEdit })
 {
  const cell = { padding: "10px 14px", verticalAlign: "middle", borderBottom: "1px solid #f8fafc", fontSize: "12.5px", background: index % 2 === 0 ? "#fff" : "#fafbfd", whiteSpace: "nowrap" };
  return (
    <tr className="trow" style={{ transition: "background .1s" }}>
      <td style={cell}><span style={{ fontWeight: "800", color: "#0f172a", fontSize: "12px", fontFamily: "'IBM Plex Mono',monospace" }}>{asset.assetTagNo}</span></td>
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
      <td style={{ ...cell, maxWidth: "180px", whiteSpace: "normal", wordBreak: "break-word", color: "#475569" }}>{asset.comments || <span style={{ color: "#e2e8f0" }}>—</span>}</td>
      <td style={{ ...cell, textAlign: "right" }}>
        <div style={{ display: "flex", gap: "5px", justifyContent: "flex-end" }}>
          <button className="btn-edit" onClick={() => handleEdit(asset)}
            style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "5px 10px",
              borderRadius: "7px", border: "1.5px solid #e0e7ff", background: "#eef2ff", color: "#4f46e5",
              fontSize: "11px", fontWeight: "700", cursor: "pointer", transition: "all .15s" }}>
            <EditIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}