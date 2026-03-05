import React from "react";
import { EditIcon, CloseIcon, SaveIcon } from "./icons";

/* ─── FORM FIELD ─────────────────────────────────────────── */
const FormField = ({ label, value, onChange, disabled, type = "text", children, required }) => (
  <div style={{ marginBottom: "14px" }}>
    <label style={{ display: "block", fontSize: "10px", fontWeight: "700", color: disabled ? "#cbd5e1" : "#64748b", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.7px" }}>
      {label}{required && <span style={{ color: "#e11d48", marginLeft: "3px" }}>*</span>}
    </label>
    {children || (
      <input type={type} value={value || ""} onChange={onChange} disabled={disabled}
        style={{ width: "100%", padding: "9px 12px", boxSizing: "border-box", borderRadius: "8px", fontSize: "13px", color: "#1e293b", border: `1.5px solid ${disabled ? "#f1f5f9" : "#e2e8f0"}`, background: disabled ? "#f8fafc" : "white", outline: "none", transition: "border-color 0.15s, box-shadow 0.15s", fontFamily: "inherit" }}
        onFocus={e => { if (!disabled) { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,.1)"; } }}
        onBlur={e => { e.target.style.borderColor = disabled ? "#f1f5f9" : "#e2e8f0"; e.target.style.boxShadow = "none"; }}
      />
    )}
  </div>
);

const STATUS_CONFIG = {
  Working:         { bg:"#ecfdf5", color:"#059669", dot:"#10b981", border:"#a7f3d0", glow:"rgba(16,185,129,.12)" },
  "Under Utilise": { bg:"#fffbeb", color:"#d97706", dot:"#f59e0b", border:"#fde68a", glow:"rgba(245,158,11,.12)" },
  Idle:            { bg:"#fff1f2", color:"#e11d48", dot:"#f43f5e", border:"#fecdd3", glow:"rgba(244,63,94,.12)" }
};


/* ────────── EDIT MODAL ──────────────────────────────────── */
export default function EditModal({
  asset,
  warning,
  onClose,
  onSave,
  onChange,
  saving,
  allowRfidEdit = false
}) {

  return (
  <div
    onClick={onClose}
    style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "20px", animation: "fadeIn .18s ease" }}
  >
    {/* ── Everything inside here — including the footer — is protected from backdrop clicks ── */}
    <div
      onClick={e => e.stopPropagation()}
      style={{ background: "white", width: "100%", maxWidth: "600px", maxHeight: "92vh", overflowY: "auto", borderRadius: "20px", boxShadow: "0 32px 80px rgba(0,0,0,0.35)", animation: "fadeUp .22s ease" }}
    >

      {/* Header */}
      <div style={{ padding: "22px 26px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "linear-gradient(135deg,#f8faff,#fff)", borderRadius: "20px 20px 0 0", position: "sticky", top: 0, zIndex: 10 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "11px", marginBottom: "5px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", flexShrink: 0 }}>
              <EditIcon />
            </div>
            <h2 style={{ margin: 0, fontSize: "17px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.3px" }}>
              {asset.apiUrl ? "Edit Asset" : "Register New Asset"}
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: "11.5px", color: "#94a3b8", paddingLeft: "47px" }}>
            {asset.apiUrl ? "Tag:" : "RFID:"}&nbsp;
            <code style={{ fontFamily: "'IBM Plex Mono',monospace", color: "#6366f1", background: "#eef2ff", padding: "1px 7px", borderRadius: "4px", fontSize: "12px" }}>
              {asset.apiUrl ? asset.assetTagNo : (asset.rfidNo || "—")}
            </code>
          </p>
        </div>
        <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid #e2e8f0", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94a3b8", flexShrink: 0, transition: "all .15s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#374151"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#94a3b8"; }}>
          <CloseIcon />
        </button>
      </div>

      {warning && (
      <div style={{
        background: "#fff7ed",
        border: "1px solid #fdba74",
        color: "#9a3412",
        padding: "10px 14px",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: "600",
        marginBottom: "12px",
        display: "flex",
        alignItems: "center",
        gap: "6px"
      }}>
        ⚠ {warning}
      </div>
    )}

      {/* Body */}
      <div style={{ padding: "22px 26px" }}>

        {/* Status pill buttons */}
        <div style={{ marginBottom: "18px" }}>
          <label style={{ display: "block", fontSize: "10px", fontWeight: "700", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.7px" }}>
            Asset Status <span style={{ color: "#e11d48" }}>*</span>
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            {["Working", "Under Utilise", "Idle"].map(s => {
              const cfg = STATUS_CONFIG[s]; const active = asset.assetStatus === s;
              return (
                <button key={s} type="button" onClick={() => onChange({ ...asset, assetStatus: s })} style={{ flex: 1, padding: "9px 6px", borderRadius: "9px", cursor: "pointer", border: `1.5px solid ${active ? cfg.dot : "#e2e8f0"}`, background: active ? cfg.bg : "white", color: active ? cfg.color : "#94a3b8", fontSize: "12px", fontWeight: "700", transition: "all .15s", boxShadow: active ? `0 0 0 3px ${cfg.glow}` : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontFamily: "inherit" }}>
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
          <span style={{ fontSize: "10px", fontWeight: "800", color: "#6366f1", textTransform: "uppercase", letterSpacing: "1px" }}>Asset Details</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <FormField label="Asset Tag No." value={asset.assetTagNo} required onChange={e => onChange({ ...asset, assetTagNo: e.target.value })} />
          <FormField
              label="RFID No."
              value={asset.rfidNo}
              disabled={!allowRfidEdit}
              onChange={e => onChange({ ...asset, rfidNo: e.target.value })}
            />
          <FormField label="Asset No." value={asset.assetNo} onChange={e => onChange({ ...asset, assetNo: e.target.value })} />
          <FormField label="Model No." value={asset.modelNo} onChange={e => onChange({ ...asset, modelNo: e.target.value })} />
          <FormField label="Serial No." value={asset.serialNo} onChange={e => onChange({ ...asset, serialNo: e.target.value })} />
          <FormField label="Mfg Year" value={asset.mfgYear} onChange={e => onChange({ ...asset, mfgYear: e.target.value })} />
          <FormField label="Plant" value={asset.plant} required onChange={e => onChange({ ...asset, plant: e.target.value })} />
          <FormField label="Location" value={asset.location} onChange={e => onChange({ ...asset, location: e.target.value })} />
          <FormField label="Custodian" value={asset.custodian} onChange={e => onChange({ ...asset, custodian: e.target.value })} />
          <FormField label="Verified Date" value={asset.verifiedDate} onChange={e => onChange({ ...asset, verifiedDate: e.target.value })} />
          <div style={{ gridColumn: "1 / -1" }}>
            <FormField label="Comments">
              <textarea
                value={asset.comments || ""}
                onChange={e => onChange({ ...asset, comments: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", boxSizing: "border-box", borderRadius: "9px", fontSize: "13px", color: "#1e293b", border: "1.5px solid #e2e8f0", background: "white", outline: "none", resize: "vertical", minHeight: "90px", fontFamily: "inherit", lineHeight: "1.6", transition: "border-color .15s, box-shadow .15s" }}
                onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,.1)"; }}
                onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* Footer — kept INSIDE stopPropagation div */}
      <div style={{ padding: "14px 26px 22px", display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #f8fafc", background: "linear-gradient(0deg,#fafafa,#fff)", borderRadius: "0 0 20px 20px" }}>
        <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: "9px", border: "1.5px solid #e2e8f0", background: "white", fontSize: "13px", fontWeight: "600", color: "#64748b", cursor: "pointer", fontFamily: "inherit" }}>
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          style={{ padding: "9px 22px", borderRadius: "9px", background: saving ? "#c7d2fe" : "linear-gradient(135deg,#6366f1,#4f46e5)", color: "white", border: "none", fontSize: "13px", fontWeight: "700", cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "7px", boxShadow: saving ? "none" : "0 4px 14px rgba(99,102,241,0.35)", fontFamily: "inherit", transition: "all .15s", opacity: saving ? 0.8 : 1 }}
        >
          {saving
            ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin .7s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Saving…</>
            : <><SaveIcon />{asset.apiUrl ? "Save Changes" : "Register Asset"}</>
          }
        </button>
      </div>

    </div>
  </div>
);
}