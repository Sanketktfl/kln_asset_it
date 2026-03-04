import React from "react";
import { TrashIcon, WarningIcon } from "./icons";


/* ─── DELETE CONFIRM MODAL ───────────────────────────────── */
export default function DeleteModal({ asset, onClose, onConfirm }) {
  return (
  <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "20px", animation: "fadeIn .18s ease" }}>
    <div onClick={e => e.stopPropagation()} style={{ background: "white", width: "100%", maxWidth: "400px", borderRadius: "20px", boxShadow: "0 32px 80px rgba(0,0,0,0.3)", animation: "fadeUp .22s ease" }}>
      <div style={{ padding: "30px 28px 22px", textAlign: "center" }}>
        <div style={{ width: "60px", height: "60px", borderRadius: "18px", background: "#fff1f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", border: "1.5px solid #fecdd3" }}>
          <WarningIcon />
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: "19px", fontWeight: "800", color: "#0f172a" }}>Delete Asset?</h3>
        <p style={{ margin: "0 0 10px", fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>This will permanently remove</p>
        <div style={{ display: "inline-block", padding: "5px 14px", background: "#f8fafc", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontFamily: "'IBM Plex Mono',monospace", fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "10px" }}>
          {asset.assetTagNo}
        </div>
        <p style={{ margin: 0, fontSize: "11.5px", color: "#94a3b8" }}>This action cannot be undone.</p>
      </div>
      <div style={{ padding: "0 28px 26px", display: "flex", gap: "10px" }}>
        <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "white", fontSize: "13px", fontWeight: "600", color: "#64748b", cursor: "pointer", fontFamily: "inherit" }}>Keep Asset</button>
        <button onClick={onConfirm} style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "linear-gradient(135deg,#f43f5e,#e11d48)", color: "white", border: "none", fontSize: "13px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(225,29,72,0.32)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontFamily: "inherit" }}>
          <TrashIcon /> Delete
        </button>
      </div>
    </div>
  </div>
);
}