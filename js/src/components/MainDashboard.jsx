import React, { useState } from "react";

/* ─── CONFIG ─────────────────────────────────────────────── */
const STATUS_CONFIG = {
  Working:         { bg: "#ecfdf5", color: "#059669", dot: "#10b981", border: "#a7f3d0" },
  "Under Utilise": { bg: "#fffbeb", color: "#d97706", dot: "#f59e0b", border: "#fde68a" },
  Idle:            { bg: "#fff1f2", color: "#e11d48", dot: "#f43f5e", border: "#fecdd3" },
};
const PLANT_COLORS = {
  Mundhwa: { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  Baramati: { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  R1: { color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc" },
  R2: { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
};

/* ─── ICONS ──────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);
const WarningIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

/* ─── STAT CARD ──────────────────────────────────────────── */
const StatCard = ({ label, value, accent, emoji, sub }) => (
  <div style={{
    background: "white",
    borderRadius: "14px",
    padding: "18px 22px",
    border: "1px solid #f1f5f9",
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
    display: "flex", alignItems: "center",
    gap: "14px",
    flex: "1 1 0", minWidth: "130px",
    position: "relative", overflow: "hidden"
  }}>
    <div style={{
      position: "absolute", right: "-10px", top: "-10px",
      width: "70px", height: "70px", borderRadius: "50%",
      background: accent + "0d"
    }}/>
    <div style={{
      width: "44px", height: "44px", borderRadius: "12px",
      background: accent + "15",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "20px", flexShrink: 0
    }}>
      {emoji}
    </div>
    <div>
      <div style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", lineHeight: 1, letterSpacing: "-1px" }}>{value}</div>
      <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", marginTop: "3px", textTransform: "uppercase", letterSpacing: "0.6px" }}>{label}</div>
    </div>
  </div>
);

/* ─── STATUS BADGE ───────────────────────────────────────── */
const StatusBadge = ({ value }) => {
  const cfg = STATUS_CONFIG[value] || { bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8", border: "#e2e8f0" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      gap: "5px", padding: "4px 10px",
      borderRadius: "20px", background: cfg.bg, color: cfg.color,
      fontSize: "11px", fontWeight: "700",
      border: `1px solid ${cfg.border}`,
      whiteSpace: "nowrap", letterSpacing: "0.2px"
    }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
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
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: "11px", color: "#475569",
      background: "#f8fafc", padding: "3px 7px",
      borderRadius: "5px", border: "1px solid #e2e8f0",
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
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "3px 9px", borderRadius: "20px",
      background: cfg.bg, color: cfg.color,
      fontSize: "11px", fontWeight: "700",
      border: `1px solid ${cfg.border}`
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: cfg.color }} />
      {value}
    </span>
  );
};

/* ─── FORM FIELD ─────────────────────────────────────────── */
const FormField = ({ label, value, onChange, disabled, type = "text", children, required }) => (
  <div style={{ marginBottom: "14px" }}>
    <label style={{
      display: "block", fontSize: "11px", fontWeight: "700",
      color: disabled ? "#94a3b8" : "#475569",
      marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.5px"
    }}>
      {label}{required && <span style={{ color: "#e11d48", marginLeft: "3px" }}>*</span>}
    </label>
    {children || (
      <input
        type={type} value={value || ""} onChange={onChange} disabled={disabled}
        style={{
          width: "100%", padding: "9px 12px", boxSizing: "border-box",
          borderRadius: "8px", fontSize: "13px", color: "#1e293b",
          border: disabled ? "1px solid #f1f5f9" : "1px solid #e2e8f0",
          background: disabled ? "#f8fafc" : "white",
          outline: "none", transition: "border-color 0.15s",
          fontFamily: "inherit"
        }}
        onFocus={e => { if (!disabled) e.target.style.borderColor = "#6366f1"; }}
        onBlur={e => { e.target.style.borderColor = disabled ? "#f1f5f9" : "#e2e8f0"; }}
      />
    )}
  </div>
);

/* ─── EDIT MODAL ─────────────────────────────────────────── */
const EditModal = ({ asset, onClose, onSave, onChange }) => (
  <div style={{
    position: "fixed", inset: 0,
    background: "rgba(15,23,42,0.6)",
    backdropFilter: "blur(6px)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 9999, padding: "20px"
  }}>
    <div style={{
      background: "white", width: "100%", maxWidth: "560px",
      maxHeight: "90vh", overflowY: "auto",
      borderRadius: "18px",
      boxShadow: "0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)"
    }}>
      {/* Modal Header */}
      <div style={{
        padding: "22px 26px 18px",
        borderBottom: "1px solid #f1f5f9",
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        background: "linear-gradient(135deg, #f8faff, #fff)",
        borderRadius: "18px 18px 0 0"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#6366f115", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <EditIcon />
            </div>
            <h2 style={{ margin: 0, fontSize: "17px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.3px" }}>
              Edit Asset
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", paddingLeft: "42px" }}>
            Tag: <strong style={{ color: "#6366f1" }}>{asset.assetTagNo}</strong>
          </p>
        </div>
        <button onClick={onClose} style={{
          width: "32px", height: "32px", borderRadius: "8px",
          border: "1px solid #e2e8f0", background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "#64748b", flexShrink: 0
        }}>
          <CloseIcon />
        </button>
      </div>

      <div style={{ padding: "22px 26px" }}>

        {/* Editable section */}
        <div style={{ fontSize: "10px", fontWeight: "800", color: "#6366f1", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>
          ✏️ Editable Fields
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <FormField
            label="Asset Tag No."
            value={asset.assetTagNo}
            onChange={e => onChange({ ...asset, assetTagNo: e.target.value })}
            required
          />

          <FormField
            label="Asset No."
            value={asset.assetNo}
            onChange={e => onChange({ ...asset, assetNo: e.target.value })}
          />

          <FormField
            label="Model No."
            value={asset.modelNo}
            onChange={e => onChange({ ...asset, modelNo: e.target.value })}
          />

          <FormField
            label="Serial No."
            value={asset.serialNo}
            onChange={e => onChange({ ...asset, serialNo: e.target.value })}
          />

          <FormField
            label="Mfg Year"
            value={asset.mfgYear}
            onChange={e => onChange({ ...asset, mfgYear: e.target.value })}
          />
          <FormField
            label="RFID No."
            value={asset.rfidNo}
            disabled={true}
          />
          <FormField label="Plant" value={asset.plant} required
            onChange={e => onChange({ ...asset, plant: e.target.value })} />
          <FormField label="Location" value={asset.location}
            onChange={e => onChange({ ...asset, location: e.target.value })} />
          <FormField label="Custodian" value={asset.custodian}
            onChange={e => onChange({ ...asset, custodian: e.target.value })} />
          <FormField label="Verified Date" value={asset.verifiedDate}
            onChange={e => onChange({ ...asset, verifiedDate: e.target.value })} />
          <FormField label="Comments">
            <textarea
              value={asset.comments || ""}
              onChange={e => onChange({ ...asset, comments: e.target.value })}
              rows={4}
              style={{
                width: "100%",
                padding: "10px 12px",
                boxSizing: "border-box",
                borderRadius: "10px",
                fontSize: "13px",
                color: "#1e293b",
                border: "1px solid #e2e8f0",
                background: "white",
                outline: "none",
                resize: "vertical",
                minHeight: "90px",
                fontFamily: "inherit",
                lineHeight: "1.5"
              }}
              onFocus={e => e.target.style.borderColor = "#6366f1"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
          </FormField>
        </div>

        <FormField label="Asset Status" required>
          <select
            value={asset.assetStatus || ""}
            onChange={e => onChange({ ...asset, assetStatus: e.target.value })}
            style={{
              width: "100%", padding: "9px 12px", boxSizing: "border-box",
              borderRadius: "8px", fontSize: "13px", color: "#1e293b",
              border: "1px solid #e2e8f0", background: "white",
              outline: "none", fontFamily: "inherit", cursor: "pointer"
            }}
          >
            <option value="Working">✅ Working</option>
            <option value="Under Utilise">⚠️ Under Utilise</option>
            <option value="Idle">🔴 Idle</option>
          </select>
        </FormField>
      </div>

      {/* Modal Footer */}
      <div style={{
        padding: "16px 26px 22px",
        display: "flex", justifyContent: "flex-end", gap: "10px",
        borderTop: "1px solid #f8fafc"
      }}>
        <button onClick={onClose} style={{
          padding: "9px 18px", borderRadius: "9px",
          border: "1px solid #e2e8f0", background: "white",
          fontSize: "13px", fontWeight: "600", color: "#64748b",
          cursor: "pointer"
        }}>
          Cancel
        </button>
        <button onClick={onSave} style={{
          padding: "9px 20px", borderRadius: "9px",
          background: "linear-gradient(135deg, #6366f1, #4f46e5)",
          color: "white", border: "none",
          fontSize: "13px", fontWeight: "700",
          cursor: "pointer", display: "flex", alignItems: "center", gap: "7px",
          boxShadow: "0 4px 12px rgba(99,102,241,0.35)"
        }}>
          <SaveIcon /> Save Changes
        </button>
      </div>
    </div>
  </div>
);

/* ─── DELETE CONFIRM MODAL ───────────────────────────────── */
const DeleteModal = ({ asset, onClose, onConfirm }) => (
  <div style={{
    position: "fixed", inset: 0,
    background: "rgba(15,23,42,0.6)",
    backdropFilter: "blur(6px)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 9999, padding: "20px"
  }}>
    <div style={{
      background: "white", width: "100%", maxWidth: "400px",
      borderRadius: "18px",
      boxShadow: "0 25px 60px rgba(0,0,0,0.3)"
    }}>
      <div style={{ padding: "28px 28px 22px", textAlign: "center" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "16px",
          background: "#fff1f2", display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", border: "1px solid #fecdd3"
        }}>
          <WarningIcon />
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>
          Delete Asset?
        </h3>
        <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>
          This will permanently remove asset
        </p>
        <div style={{
          display: "inline-block", padding: "4px 12px", background: "#f8fafc",
          borderRadius: "6px", border: "1px solid #e2e8f0",
          fontFamily: "monospace", fontSize: "14px", fontWeight: "700", color: "#0f172a",
          marginBottom: "8px"
        }}>
          {asset.assetTagNo}
        </div>
        <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
          This action cannot be undone.
        </p>
      </div>
      <div style={{
        padding: "16px 28px 24px",
        display: "flex", gap: "10px"
      }}>
        <button onClick={onClose} style={{
          flex: 1, padding: "10px", borderRadius: "9px",
          border: "1px solid #e2e8f0", background: "white",
          fontSize: "13px", fontWeight: "600", color: "#64748b",
          cursor: "pointer"
        }}>
          Keep Asset
        </button>
        <button onClick={onConfirm} style={{
          flex: 1, padding: "10px", borderRadius: "9px",
          background: "linear-gradient(135deg, #f43f5e, #e11d48)",
          color: "white", border: "none",
          fontSize: "13px", fontWeight: "700",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(225,29,72,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
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
    padding: "9px 12px", textAlign: "left",
    fontSize: "10.5px", fontWeight: "700", color: "#64748b",
    textTransform: "uppercase", letterSpacing: "0.6px",
    whiteSpace: "nowrap", background: "#f8fafc",
    borderBottom: "1px solid #f1f5f9"
  }}>
    {children}
    {mandatory && <span style={{ color: "#e11d48", marginLeft: "2px" }}>*</span>}
  </th>
);

/* ─── ASSET ROW ──────────────────────────────────────────── */
const AssetRow = ({ asset, index, handleEdit, handleDelete }) => {
  const [hovered, setHovered] = useState(false);
  const cell = {
    padding: "10px 14px", verticalAlign: "middle",
    borderBottom: "1px solid #f8fafc",
    fontSize: "12.5px"
  };
  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? "#f8faff" : index % 2 === 0 ? "#fff" : "#fafbfd", transition: "background 0.1s" }}
    >
      <td style={cell}>
        <span style={{ fontWeight: "800", color: "#0f172a", fontSize: "12.5px", fontFamily: "monospace" }}>
          {asset.assetTagNo}
        </span>
      </td>
      <td style={{ ...cell, maxWidth: "140px" }}><RfidChip value={asset.rfidNo} /></td>
      <td style={{ ...cell, fontFamily: "monospace", color: "#64748b" }}>{asset.assetNo || "—"}</td>
      <td style={{ ...cell, fontWeight: "600", color: "#334155" }}>{asset.modelNo || "—"}</td>
      <td style={{ ...cell, fontFamily: "monospace", color: "#94a3b8", fontSize: "11px" }}>{asset.serialNo || "—"}</td>
      <td style={cell}><PlantPill value={asset.plant} /></td>
      <td style={{ ...cell, color: "#475569", fontWeight: "500" }}>{asset.location || <span style={{ color: "#e2e8f0" }}>—</span>}</td>
      <td style={{ ...cell, color: "#334155" }}>{asset.custodian || <span style={{ color: "#e2e8f0" }}>—</span>}</td>
      <td style={{ ...cell, textAlign: "center", fontWeight: "700", color: "#64748b" }}>{asset.mfgYear || "—"}</td>
      <td style={{ ...cell, color: "#0369a1", fontWeight: "600" }}>{asset.verifiedDate || <span style={{ color: "#cbd5e1", fontStyle: "italic", fontWeight: 400 }}>—</span>}</td>
      <td style={cell}><StatusBadge value={asset.assetStatus} /></td>
      <td style={{ ...cell, maxWidth: "180px", whiteSpace: "normal", wordBreak: "break-word", color: "#475569" }}>
  {asset.comments || <span style={{ color: "#e2e8f0" }}>—</span>}
</td>
      <td style={cell}>
        <div style={{ display: "flex", gap: "6px" }}>
          <button onClick={() => handleEdit(asset)} style={{
            display: "flex", alignItems: "center", gap: "5px",
            padding: "5px 10px", borderRadius: "7px",
            border: "1px solid #e0e7ff", background: "#f0f1ff",
            color: "#4f46e5", fontSize: "11px", fontWeight: "700",
            cursor: "pointer", transition: "all 0.15s"
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#e0e7ff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#f0f1ff"; }}
          >
            <EditIcon /> Edit
          </button>
          <button onClick={() => handleDelete(asset)} style={{
            display: "flex", alignItems: "center", gap: "5px",
            padding: "5px 10px", borderRadius: "7px",
            border: "1px solid #fecdd3", background: "#fff1f2",
            color: "#e11d48", fontSize: "11px", fontWeight: "700",
            cursor: "pointer", transition: "all 0.15s"
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fecdd3"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff1f2"; }}
          >
            <TrashIcon /> Delete
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

  const handleEdit = (asset) => { setSelectedAsset({ ...asset }); setEditModal(true); };
  const handleDeleteClick = (asset) => { setSelectedAsset({ ...asset }); setDeleteModal(true); };


  React.useEffect(() => {
    const fetchScans = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/collection/kln_asset_scan?$filter=is_scanned eq 0");
        const data = await res.json();
        const mapped = (data.objects || [])
          .filter(scan =>
            !assets.some(a => a.rfidNo === scan.rfid)
          )
          .map(scan => ({
            scanId: scan["@id"],
            barcode: scan.barcode,
            rfid: scan.rfid,
            department: scan.department,
            plantCode: scan.plant_code,
            dateTime: scan.date_time
          }));
        setScannedAssets(mapped);
      } catch (err) {
        console.error("Scan API error:", err);
      }
    };
    fetchScans();
    const interval = setInterval(fetchScans, 5000);
    return () => clearInterval(interval);
  }, []);


  const handleSaveEdit = async () => {
    let formattedDate = null;

    if (selectedAsset.verifiedDate) {
      const parts = selectedAsset.verifiedDate.split(".");
      if (parts.length === 3) {
        formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    const payload = {
      barcode_no: selectedAsset.assetTagNo,
      rfid_no: selectedAsset.rfidNo,
      asset_no: selectedAsset.assetNo,
      model_no: selectedAsset.modelNo,
      serial_no: selectedAsset.serialNo,
      plant: selectedAsset.plant,
      location: selectedAsset.location,
      custodian: selectedAsset.custodian,
      mfg_year: parseInt(selectedAsset.mfgYear || 0),
      verified_status: formattedDate,
      asset_status: selectedAsset.assetStatus,
      comments: selectedAsset.comments
    };
    try {
      if (selectedAsset.apiUrl) {
        // ✅ EXISTING → UPDATE
        await fetch(selectedAsset.apiUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        // ✅ NEW → CREATE
        await fetch("http://localhost:8080/internal/asset_it_master", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
        if (selectedAsset.scanId) {
          await fetch(selectedAsset.scanId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_scanned: 1 })
          });
        }
      // Remove from scan badge list
      setScannedAssets(prev =>
        prev.filter(s =>
          String(s.rfid).trim() !== String(selectedAsset.rfidNo).trim()
        )
      );
      setEditModal(false);
      setSelectedAsset(null);
      // Refresh master table
      window.location.reload();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const openScanForEdit = (scan) => {

  const match = assets.find(a =>
    (a.rfidNo && scan.rfid && a.rfidNo.trim() === scan.rfid.trim()) ||
    (a.assetTagNo && scan.barcode && a.assetTagNo.trim() === scan.barcode.trim()) ||
    (a.assetNo && scan.barcode && a.assetNo.trim() === scan.barcode.trim()) ||
    (a.serialNo && scan.barcode && a.serialNo.trim() === scan.barcode.trim())
  );

  let prepared;

  if (match) {
      prepared = {
        ...match,
        scanId: scan.scanId,   // 🔥 ADD THIS
        verifiedDate: scan.dateTime
          ? new Date(scan.dateTime)
              .toLocaleDateString("en-GB")
              .replace(/\//g, ".")
          : match.verifiedDate
      };
    } else {
      prepared = {
        scanId: scan.scanId,   // 🔥 ADD THIS
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
        verifiedDate: scan.dateTime
          ? new Date(scan.dateTime)
              .toLocaleDateString("en-GB")
              .replace(/\//g, ".")
          : "",
        assetStatus: "Working"
      };
    }

  setSelectedAsset(prepared);
  setEditModal(true);
  setShowScanPanel(false);
};

  const handleConfirmDelete = async () => {
  try {
    // 1️⃣ Delete from MASTER
    if (selectedAsset.apiUrl) {
      await fetch(selectedAsset.apiUrl, { method: "DELETE" });
    }

    // 2️⃣ Delete from SCAN table using RFID
    if (selectedAsset.rfidNo) {
      const scanRes = await fetch(
        `http://localhost:8080/api/v1/collection/kln_asset_scan?$filter=rfid eq '${selectedAsset.rfidNo}'`
      );

      const scanData = await scanRes.json();

      if (scanData.objects && scanData.objects.length > 0) {
        const scanApiUrl = scanData.objects[0]["@id"];

        await fetch(scanApiUrl, {
          method: "DELETE"
        });
      }
    }

    setDeleteModal(false);
    setSelectedAsset(null);

    // Auto refresh UI
    window.location.reload();

  } catch (err) {
    console.error("Delete error:", err);
  }
};

  React.useEffect(() => {
  const fetchMatchedAssets = async () => {
    try {
      // 1️⃣ Get scanned assets (only unsaved)
      const scanRes = await fetch(
        "http://localhost:8080/api/v1/collection/kln_asset_scan?$filter=is_scanned eq 1"
      );
      const scanData = await scanRes.json();

      const scannedRfids = (scanData.objects || [])
        .map(s => String(s.rfid).trim());

      if (scannedRfids.length === 0) {
        setAssets([]);
        return;
      }

      // 2️⃣ Get master assets
      const masterRes = await fetch(
        "http://localhost:8080/api/v1/collection/kln_asset_master"
      );
      const masterData = await masterRes.json();

      // 3️⃣ Filter master where rfid matches scan rfid
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
          comments: item.comments || "",
        }));

      setAssets(matched);

    } catch (err) {
      console.error("Match API Error:", err);
    }
  };

  fetchMatchedAssets();
  const interval = setInterval(fetchMatchedAssets, 5000);
  return () => clearInterval(interval);

}, []);

  const plants = ["All", ...Array.from(new Set(assets.map(a => a.plant).filter(Boolean)))];
  const filtered = assets.filter(a => {
    const q = search.toLowerCase();
    return (
      Object.values(a).some(v => String(v).toLowerCase().includes(q)) &&
      (statusFilter === "All" || a.assetStatus === statusFilter) &&
      (plantFilter === "All" || a.plant === plantFilter)
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
    padding: "7px 11px", borderRadius: "8px",
    border: "1px solid #e2e8f0", fontSize: "12px",
    color: "#334155", background: "white",
    cursor: "pointer", fontWeight: "600", outline: "none"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* HEADER */}
      <div style={{
        background: "linear-gradient(90deg, #0f172a 0%, #1e3a5f 50%, #0c4a6e 100%)",
        height: "58px", padding: "0 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 20px rgba(0,0,0,0.25)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: "10px", padding: "7px", display: "flex" }}>
            <LayersIcon />
          </div>
          <div>
            <div style={{ color: "white", fontWeight: "800", fontSize: "15px", letterSpacing: "-0.3px" }}>
              Asset Management System
            </div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "10px", letterSpacing: "0.5px" }}>
              RFID · TRACK · AUDIT
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowScanPanel(!showScanPanel)}
          style={{
            position: "relative",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            padding: "7px 16px",
            color: "white",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          + New Asset
          {scannedAssets.length > 0 && (
            <span style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              background: "#ef4444",
              color: "white",
              borderRadius: "50%",
              fontSize: "10px",
              padding: "3px 6px",
              fontWeight: "700"
            }}>
              +{scannedAssets.length}
            </span>
          )}
        </button>
      </div>
      {showScanPanel && (
        <div style={{
          position: "absolute",
          right: "40px",
          top: "70px",
          width: "340px",
          background: "white",
          borderRadius: "14px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          border: "1px solid #e2e8f0",
          zIndex: 999
        }}>
          <div style={{
            padding: "12px 16px",
            borderBottom: "1px solid #f1f5f9",
            fontWeight: "700",
            fontSize: "13px"
          }}>
            Newly Scanned Assets
          </div>

          {scannedAssets.length === 0 ? (
            <div style={{ padding: "14px", fontSize: "12px", color: "#94a3b8" }}>
              No new scans
            </div>
          ) : (
            scannedAssets.map(scan => (
              <div
                key={scan.scanId}
                onClick={() => openScanForEdit(scan)}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f8fafc",
                  fontSize: "12px"
                }}
              >
                <div style={{ fontWeight: "700" }}>{scan.barcode}</div>
                <div style={{ color: "#64748b", fontSize: "11px" }}>{scan.rfid}</div>
              </div>
            ))
          )}
        </div>
      )}

      <div style={{ padding: "22px 26px", maxWidth: "100%" }}>

        {/* Title Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>
              Asset Registry
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#94a3b8" }}>
              Track and manage all RFID-tagged assets across plants
            </p>
          </div>
          <div style={{
            background: "#fff1f2", color: "#be123c", padding: "6px 14px",
            borderRadius: "8px", fontSize: "11px", fontWeight: "700",
            display: "flex", alignItems: "center", gap: "5px", border: "1px solid #fecdd3"
          }}>
            <span style={{ color: "#e11d48" }}>*</span> Mandatory Fields
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <StatCard label="Total Assets"  value={counts.total}   accent="#3b82f6" emoji="📦" />
          <StatCard label="Working"       value={counts.working} accent="#10b981" emoji="✅" />
          <StatCard label="Under Utilise" value={counts.under}   accent="#f59e0b" emoji="⚠️" />
          <StatCard label="Idle"          value={counts.idle}    accent="#f43f5e" emoji="🔴" />
          <StatCard label="RFID Scanned"  value={counts.scanned} accent="#0ea5e9" emoji="📡" />
        </div>

        {/* Table Card */}
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e8eef6", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", overflow: "hidden" }}>

          {/* Toolbar */}
          <div style={{
            padding: "14px 18px", borderBottom: "1px solid #f1f5f9",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: "12px", flexWrap: "wrap", background: "#fafbff"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontWeight: "800", fontSize: "14px", color: "#0f172a" }}>Asset Records</span>
              <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: "11px", fontWeight: "700", padding: "2px 10px", borderRadius: "20px" }}>
                {filtered.length}
              </span>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
                {["All", "Working", "Under Utilise", "Idle"].map(s => <option key={s}>{s}</option>)}
              </select>
              <select value={plantFilter} onChange={e => setPlantFilter(e.target.value)} style={selectStyle}>
                {plants.map(p => <option key={p}>{p}</option>)}
              </select>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", display: "flex" }}>
                  <SearchIcon />
                </span>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search any field…"
                  style={{
                    paddingLeft: "32px", paddingRight: "12px", paddingTop: "7px", paddingBottom: "7px",
                    borderRadius: "8px", border: "1px solid #e2e8f0",
                    fontSize: "12px", color: "#334155", outline: "none",
                    background: "white", width: "190px"
                  }}
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
                  ? filtered.map((asset, i) => (
                    <AssetRow key={i} asset={asset} index={i}
                      handleEdit={handleEdit} handleDelete={handleDeleteClick} />
                  ))
                  : (
                    <tr>
                      <td colSpan={13} style={{ textAlign: "center", padding: "52px", color: "#94a3b8" }}>
                        <div style={{ fontSize: "32px", marginBottom: "10px" }}>🔍</div>
                        <div style={{ fontSize: "14px", fontWeight: "700" }}>No assets found</div>
                        <div style={{ fontSize: "12px", marginTop: "4px" }}>Try adjusting your search or filters</div>
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{
            padding: "10px 18px", borderTop: "1px solid #f1f5f9",
            background: "#fafbff", display: "flex", justifyContent: "space-between",
            alignItems: "center", flexWrap: "wrap", gap: "8px"
          }}>
            <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "500" }}>
              Showing <strong style={{ color: "#334155" }}>{filtered.length}</strong> of <strong style={{ color: "#334155" }}>{assets.length}</strong> assets
            </span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {["Working", "Under Utilise", "Idle"].map(s => {
                const cfg = STATUS_CONFIG[s];
                return (
                  <span key={s} style={{
                    fontSize: "11px", padding: "3px 10px",
                    borderRadius: "20px", background: cfg.bg, color: cfg.color,
                    fontWeight: "700", border: `1px solid ${cfg.border}`
                  }}>
                    {assets.filter(a => a.assetStatus === s).length} {s}
                  </span>
                );
              })}
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
  );
}