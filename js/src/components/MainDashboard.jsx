import React, { useState } from "react";
import MasterDataPage from "./MasterDataPage";
import api from "../api/apiUtils";
import EditModal from "./EditModal";
import { SearchIcon, LayersIcon, EditIcon, CloseIcon, ScanIcon } from "./icons";

/* ─── GLOBAL STYLES ─────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=DM+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  body { font-family: 'DM Sans', 'Segoe UI', sans-serif; margin: 0; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #f8fafc; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
  @keyframes fadeUp   { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes slideDown{ from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin     { to { transform: rotate(360deg); } }
  @keyframes pulseDot { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(.7);opacity:.5;} }
  .trow:hover td        { background: #f5f8ff !important; }
  .btn-edit:hover       { background: #e0e7ff !important; border-color: #a5b4fc !important; color: #4338ca !important; }
  .btn-del:hover        { background: #fee2e2 !important; border-color: #fca5a5 !important; color: #dc2626 !important; }
  .btn-view:hover       { background: #e0f2fe !important; border-color: #7dd3fc !important; color: #0369a1 !important; }
  .scan-item:hover      { background: #f5f8ff !important; }
  .nav-tab:hover        { background: rgba(255,255,255,0.08) !important; }
  .scan-btn-inline:hover{ background: #2a4a6e !important; border-color: #2a4a6e !important; }
  .pg-btn:hover         { background: #1e3a5f !important; color: white !important; border-color: #1e3a5f !important; }
  .view-field:hover     { background: #f8faff !important; }
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

const DETAIL_FIELDS = [
  { key: "barcode_no",        label: "Asset Tag No",      mono: true },
  { key: "rfid_no",           label: "RFID No",           mono: true },
  { key: "asset_no",          label: "Asset No",          mono: true },
  { key: "asset_code",        label: "Asset Code",        mono: true },
  { key: "asset_class",       label: "Asset Class" },
  { key: "asset_desc",        label: "Asset Description" },
  { key: "model_no",          label: "Model No" },
  { key: "serial_no",         label: "Serial No",         mono: true },
  { key: "manufacturer",      label: "Manufacturer" },
  { key: "mfg_year",          label: "Mfg Year" },
  { key: "base_of_unit",      label: "Base Unit" },
  { key: "quantity",          label: "Quantity" },
  { key: "plant",             label: "Plant" },
  { key: "location",          label: "Location" },
  { key: "custodian",         label: "Custodian" },
  { key: "company_code",      label: "Company Code",      mono: true },
  { key: "cost_center",       label: "Cost Center",       mono: true },
  { key: "acquis_val",        label: "Acquisition Value" },
  { key: "capitalized_on",    label: "Capitalized On" },
  { key: "life",              label: "Life" },
  { key: "internal_order_no", label: "Internal Order No", mono: true },
  { key: "ecc_io_no",         label: "ECC IO No",         mono: true },
  { key: "verified_status",   label: "Verified Date" },
  { key: "asset_status",      label: "Status" },
  { key: "comments",          label: "Comments" },
];

const VIEW_SECTIONS = [
  { title: "🏷 Asset Identity",        color: "#6366f1", bg: "#eef2ff", border: "#e0e7ff", fields: ["barcode_no","rfid_no","asset_no","asset_code","asset_class","asset_desc"] },
  { title: "🔩 Physical Details",      color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc", fields: ["model_no","serial_no","manufacturer","mfg_year","base_of_unit","quantity"] },
  { title: "📍 Location & Ownership",  color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", fields: ["plant","location","custodian","company_code","cost_center"] },
  { title: "💰 Financial & Lifecycle", color: "#d97706", bg: "#fffbeb", border: "#fde68a", fields: ["acquis_val","capitalized_on","life","internal_order_no","ecc_io_no"] },
  { title: "✅ Verification",           color: "#e11d48", bg: "#fff1f2", border: "#fecdd3", fields: ["verified_status","asset_status","comments"] },
];

/* ─── SHARED UI COMPONENTS ───────────────────────────────── */
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const StatusBadge = ({ value }) => {
  if (!value) return <span style={{ color: "#cbd5e1", fontSize: "11px", fontStyle: "italic" }}>—</span>;
  const cfg = STATUS_CONFIG[value] || { bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8", border: "#e2e8f0", glow: "transparent" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 10px", borderRadius: "20px", background: cfg.bg, color: cfg.color, fontSize: "11px", fontWeight: "700", border: `1px solid ${cfg.border}`, boxShadow: `0 0 0 2px ${cfg.glow}`, whiteSpace: "nowrap" }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: cfg.dot, flexShrink: 0, animation: value === "Working" ? "pulseDot 2s infinite" : "none" }} />
      {value}
    </span>
  );
};

const PlantPill = ({ value }) => {
  if (!value) return <span style={{ color: "#cbd5e1", fontSize: "11px" }}>—</span>;
  const cfg = PLANT_COLORS[value] || { color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: "6px", background: cfg.bg, color: cfg.color, fontSize: "11px", fontWeight: "700", border: `1px solid ${cfg.border}` }}>
      {value}
    </span>
  );
};

const RfidChip = ({ value }) => {
  if (!value) return <span style={{ color: "#cbd5e1", fontSize: "11px", fontStyle: "italic" }}>No RFID</span>;
  const short = value.length > 14 ? "…" + value.slice(-12) : value;
  return (
    <span title={value} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", color: "#0891b2", background: "#ecfeff", padding: "2px 7px", borderRadius: "5px", border: "1px solid #a5f3fc", display: "inline-block" }}>
      {short}
    </span>
  );
};

/* ─── STAT CARD ──────────────────────────────────────────── */
const StatCard = ({ label, value, accent, emoji, onClick, active }) => (
  <div onClick={onClick} style={{
    cursor: onClick ? "pointer" : "default",
    background: "white", borderRadius: "14px", padding: "18px 22px",
    border: active ? `2px solid ${accent}` : "1px solid #f1f5f9",
    boxShadow: active ? `0 0 0 4px ${accent}15` : "0 1px 8px rgba(0,0,0,0.05)",
    display: "flex", alignItems: "center", gap: "14px",
    flex: "1 1 0", minWidth: "130px", position: "relative", overflow: "hidden",
    animation: "fadeUp .35s ease both", transition: "all .2s",
  }}>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", background: accent, borderRadius: "14px 0 0 14px" }} />
    <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: accent + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{emoji}</div>
    <div>
      <div style={{ fontSize: "27px", fontWeight: "800", color: "#0f172a", fontFamily: "'IBM Plex Mono', monospace" }}>{value}</div>
      <div style={{ fontSize: "10.5px", color: "#94a3b8", fontWeight: "700", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.7px" }}>{label}</div>
    </div>
  </div>
);

/* ─── TH ─────────────────────────────────────────────────── */
const TH = ({ children, mandatory }) => (
  <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "10px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", whiteSpace: "nowrap", background: "#f9fafb", borderBottom: "2px solid #f1f5f9" }}>
    {children}{mandatory && <span style={{ color: "#e11d48", marginLeft: "2px" }}>*</span>}
  </th>
);

/* ─── ASSET ROW (unified) ────────────────────────────────── */
const AssetRow = ({ asset, index, onEdit, onView }) => {
  const cell = {
    padding: "10px 14px", fontSize: "12.5px", color: "#334155", borderBottom: "1px solid #f1f5f9",
    background: index % 2 === 0 ? "white" : "#fafbfd", transition: "background .15s",
    verticalAlign: "middle", whiteSpace: "nowrap"
  };
  const mono = { fontFamily: "'IBM Plex Mono', monospace", fontSize: "11.5px" };

  return (
    <tr className="trow" style={{ animation: `fadeUp .3s ease ${Math.min(index,20) * 0.02}s both` }}>
      <td style={cell}>
        <span style={{ ...mono, background: "#f0f9ff", color: "#0369a1", padding: "3px 8px", borderRadius: "6px", border: "1px solid #bae6fd", fontWeight: "600" }}>
          {asset.barcode_no || "—"}
        </span>
      </td>
      <td style={cell}>
        {asset.rfid_no
          ? <span style={{ ...mono, fontSize: "10.5px", color: "#0891b2", background: "#ecfeff", padding: "2px 7px", borderRadius: "5px", border: "1px solid #a5f3fc" }}>{asset.rfid_no.length > 14 ? "…" + asset.rfid_no.slice(-12) : asset.rfid_no}</span>
          : <span style={{ color: "#cbd5e1", fontSize: "11px", fontStyle: "italic" }}>No RFID</span>}
      </td>
      <td style={cell}><span style={{ ...mono, color: "#64748b" }}>{asset.asset_no || "—"}</span></td>
      <td style={{ ...cell, maxWidth: "220px", whiteSpace: "normal", wordBreak: "break-word" }}>
        <span style={{ fontSize: "12px", color: "#334155", fontWeight: "500" }}>{asset.asset_desc || "—"}</span>
      </td>
      <td style={cell}><PlantPill value={asset.plant} /></td>
      <td style={cell}><span style={{ fontSize: "12px", color: "#475569" }}>{asset.custodian || <span style={{ color: "#cbd5e1" }}>—</span>}</span></td>
      <td style={cell}><StatusBadge value={asset.asset_status} /></td>
      <td style={{ ...cell, textAlign: "center" }}>
        <span style={{ ...mono, fontSize: "12px", color: "#475569" }}>{asset.quantity ?? "—"}</span>
      </td>
      <td style={{ ...cell, whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", gap: "5px", justifyContent: "flex-end" }}>
          <button className="btn-view" onClick={() => onView(asset)} title="View Details"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", borderRadius: "7px", border: "1.5px solid #bae6fd", background: "#f0f9ff", color: "#0369a1", cursor: "pointer", transition: "all .15s" }}>
            <EyeIcon />
          </button>
          <button className="btn-edit" onClick={() => onEdit(asset)} title="Edit"
            style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "7px", border: "1.5px solid #e0e7ff", background: "#eef2ff", color: "#4f46e5", fontSize: "11px", fontWeight: "700", cursor: "pointer", transition: "all .15s" }}>
            <EditIcon />
          </button>
        </div>
      </td>
    </tr>
  );
};

/* ─── VIEW MODAL (unified) ───────────────────────────────── */
const ViewModal = ({ asset, onClose, onEdit }) => {
  if (!asset) return null;
  const fieldMap = Object.fromEntries(DETAIL_FIELDS.map(f => [f.key, f]));

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, padding: "20px", animation: "fadeIn .18s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#f8fafc", width: "100%", maxWidth: "780px", maxHeight: "92vh", borderRadius: "22px", boxShadow: "0 40px 100px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", animation: "fadeUp .22s ease", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "22px 26px 18px", background: "linear-gradient(100deg,#0f172a 0%,#1e3a5f 55%,#0c4a6e 100%)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "2px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: "5px" }}>Asset Details</div>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "white", fontFamily: "'IBM Plex Mono',monospace" }}>
              {asset.barcode_no || "—"}
            </h2>
            {asset.asset_desc && <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", marginTop: "4px", maxWidth: "500px" }}>{asset.asset_desc}</div>}
            <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {asset.plant && <PlantPill value={asset.plant} />}
              <StatusBadge value={asset.asset_status} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
            {onEdit && (
              <button onClick={() => { onClose(); onEdit(asset); }}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "9px", border: "1.5px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "white", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                <EditIcon /> Edit
              </button>
            )}
            <button onClick={onClose}
              style={{ width: "34px", height: "34px", borderRadius: "9px", border: "1.5px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.6)", fontSize: "16px" }}>
              ✕
            </button>
          </div>
        </div>

        {/* Body — sections */}
        <div style={{ overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {VIEW_SECTIONS.map(section => (
            <div key={section.title} style={{ background: "white", borderRadius: "14px", border: `1px solid ${section.border}`, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: "10px 16px", background: section.bg, borderBottom: `1px solid ${section.border}` }}>
                <span style={{ fontSize: "12px", fontWeight: "800", color: section.color }}>{section.title}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
                {section.fields.map(key => {
                  const meta = fieldMap[key];
                  const val = asset[key];
                  return (
                    <div key={key} className="view-field" style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc", borderRight: "1px solid #f8fafc", transition: "background .15s" }}>
                      <div style={{ fontSize: "9.5px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "5px" }}>
                        {meta?.label || key}
                      </div>
                      {key === "asset_status" ? <StatusBadge value={val} />
                        : key === "plant" ? <PlantPill value={val} />
                        : val ? (
                          <div style={{ fontSize: meta?.mono ? "11.5px" : "13px", color: "#1e293b", fontWeight: "500", wordBreak: "break-word", fontFamily: meta?.mono ? "'IBM Plex Mono',monospace" : "inherit" }}>
                            {val}
                          </div>
                        ) : (
                          <span style={{ color: "#cbd5e1", fontSize: "12px", fontStyle: "italic" }}>—</span>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: "8px", background: "white", flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: "8px 22px", borderRadius: "9px", border: "1.5px solid #e2e8f0", background: "white", fontSize: "13px", fontWeight: "600", color: "#64748b", cursor: "pointer" }}>
            Close
          </button>
          {onEdit && (
            <button onClick={() => { onClose(); onEdit(asset); }}
              style={{ padding: "8px 22px", borderRadius: "9px", border: "none", background: "#1e3a5f", fontSize: "13px", fontWeight: "700", color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
              <EditIcon /> Edit Asset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════════════════ */
export default function MainDashboard() {
  const [assets, setAssets]                   = useState([]);
  const [search, setSearch]                   = useState("");
  const [statusFilter, setStatusFilter]       = useState("All");
  const [plantFilter, setPlantFilter]         = useState("All");
  const [editModal, setEditModal]             = useState(false);
  const [selectedAsset, setSelectedAsset]     = useState(null);
  const [viewAsset, setViewAsset]             = useState(null);
  const [scannedAssets, setScannedAssets]     = useState([]);
  const [showScanPanel, setShowScanPanel]     = useState(false);
  const [noMasterWarning, setNoMasterWarning] = useState("");
  const [currentPage, setCurrentPage]         = useState(1);
  const [rowsPerPage]                         = useState(10);
  const [verifiedDateFilter, setVerifiedDateFilter] = useState("");
  const [saving, setSaving]                   = useState(false);
  const [activePage, setActivePage]           = useState("registry");

  /* ─── fetchMatchedAssets — uses /internal/asset_it_master ─── */
  const fetchMatchedAssets = async () => {
  try {
    const scanData = await api.get("/api/v1/collection/kln_asset_scan?$filter=is_scanned eq 1");
    const scanObjects = scanData.objects || [];

    if (scanObjects.length === 0) { setAssets([]); return; }

    const scannedRfids    = new Set(scanObjects.map(s => String(s.rfid || "").trim()).filter(Boolean));
    const scannedBarcodes = new Set(scanObjects.map(s => String(s.barcode || "").trim()).filter(Boolean));

    const masterData = await api.get("/internal/asset_it_master");
    const matched = (masterData.objects || []).filter(item => {
      const itemRfid    = String(item.rfid_no    || "").trim();
      const itemBarcode = String(item.barcode_no || "").trim();
      return (itemRfid    && scannedRfids.has(itemRfid)) ||
             (itemBarcode && scannedBarcodes.has(itemBarcode));
    });

    setAssets(matched);
  } catch (err) { console.error("Match API Error:", err); }
};

  /* ─── poll unscanned badges ─── */
  React.useEffect(() => {
    const fetchScans = async () => {
      try {
        const data = await api.get("/api/v1/collection/kln_asset_scan?$filter=is_scanned eq 0");
        const mapped = (data.objects || [])
          .filter(scan => !assets.some(a => String(a.rfid_no).trim() === String(scan.rfid).trim()))
          .map(scan => ({ scanId: scan["@id"], barcode: scan.barcode, rfid: scan.rfid, department: scan.department, plantCode: scan.plant_code, dateTime: scan.date_time }));
        setScannedAssets(mapped);
      } catch (err) { console.error("Scan API error:", err); }
    };
    fetchScans();
    const interval = setInterval(fetchScans, 10000);
    return () => clearInterval(interval);
  }, [assets]);

  React.useEffect(() => { fetchMatchedAssets(); }, []);

  /* ─── handleEdit — asset is raw master object ─── */
  const handleEdit = (asset) => {
    setSelectedAsset({
      objectId:        asset.cdb_object_id || asset.objectId,
      apiUrl:          asset["@id"] || null,
      scanId:          asset.scanId || null,
      assetTagNo:      asset.barcode_no   ?? asset.assetTagNo   ?? "",
      rfidNo:          asset.rfid_no      ?? asset.rfidNo       ?? "",
      assetNo:         asset.asset_no     ?? asset.assetNo      ?? "",
      assetCode:       asset.asset_code   ?? asset.assetCode    ?? "",
      assetClass:      asset.asset_class  ?? asset.assetClass   ?? "",
      assetDesc:       asset.asset_desc   ?? asset.assetDesc    ?? "",
      modelNo:         asset.model_no     ?? asset.modelNo      ?? "",
      serialNo:        asset.serial_no    ?? asset.serialNo     ?? "",
      manufacturer:    asset.manufacturer ?? "",
      mfgYear:         asset.mfg_year     ?? asset.mfgYear      ?? "",
      baseOfUnit:      asset.base_of_unit ?? asset.baseOfUnit   ?? "",
      quantity:        asset.quantity     ?? "",
      plant:           asset.plant        ?? "",
      location:        asset.location     ?? "",
      custodian:       asset.custodian    ?? "",
      companyCode:     asset.company_code ?? asset.companyCode  ?? "",
      costCenter:      asset.cost_center  ?? asset.costCenter   ?? "",
      acquisVal:       asset.acquis_val   ?? asset.acquisVal    ?? "",
      capitalizedOn:   asset.capitalized_on ?? asset.capitalizedOn ?? "",
      life:            asset.life         ?? "",
      internalOrderNo: asset.internal_order_no ?? asset.internalOrderNo ?? "",
      eccIoNo:         asset.ecc_io_no    ?? asset.eccIoNo      ?? "",
      verifiedDate:    asset.verified_status ?? asset.verifiedDate ?? "",
      assetStatus:     asset.asset_status ?? asset.assetStatus  ?? "Working",
      comments:        asset.comments     ?? "",
    });
    setEditModal(true);
  };

  // Add this helper above handleSaveEdit
const toISODate = (val) => {
  if (!val) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(val)) {
    const [d, m, y] = val.split(".");
    return `${y}-${m}-${d}`;
  }
  return null;
};

  /* ─── handleSaveEdit ─── */
  const handleSaveEdit = async () => {
    if (!selectedAsset.assetTagNo?.trim()) { alert("Asset Tag No is mandatory"); return; }
    if (!selectedAsset.plant?.trim())       { alert("Plant is mandatory"); return; }
    if (!selectedAsset.assetStatus?.trim()) { alert("Status is mandatory"); return; }

    const payload = {
      barcode_no:        selectedAsset.assetTagNo,
      rfid_no:           selectedAsset.rfidNo,
      asset_no:          selectedAsset.assetNo || "",
      asset_code:        selectedAsset.assetCode || "",
      asset_class:       selectedAsset.assetClass || "",
      asset_desc:        selectedAsset.assetDesc || "",
      model_no:          selectedAsset.modelNo || "",
      serial_no:         selectedAsset.serialNo || "",
      manufacturer:      selectedAsset.manufacturer || "",
      mfg_year:          selectedAsset.mfgYear ? parseInt(selectedAsset.mfgYear) : null,
      base_of_unit:      selectedAsset.baseOfUnit || "",
      quantity:          selectedAsset.quantity ? parseFloat(selectedAsset.quantity) : null,
      plant:             selectedAsset.plant,
      location:          selectedAsset.location || "",
      custodian:         selectedAsset.custodian || "",
      company_code:      selectedAsset.companyCode || "",
      cost_center:       selectedAsset.costCenter || "",
      acquis_val:        selectedAsset.acquisVal || "",
      capitalized_on:  toISODate(selectedAsset.capitalizedOn),
      life:              selectedAsset.life || "",
      internal_order_no: selectedAsset.internalOrderNo || "",
      ecc_io_no:         selectedAsset.eccIoNo || "",
      verified_status: toISODate(selectedAsset.verifiedDate),
      asset_status:      selectedAsset.assetStatus,
      comments:          selectedAsset.comments || ""
    };

    setSaving(true);
try {
  if (selectedAsset.objectId) {
    // UPDATE existing master record
    await api.put(`/api/v1/collection/kln_asset_master/${selectedAsset.objectId}`, payload);
  } else {
      const created = await api.post("/internal/asset_it_master", payload);
      console.log("POST raw response:", JSON.stringify(created));
      if (created?.status === "error") {
        alert("Create failed: " + created.message);
        setSaving(false);
        return;
      }
    }

  // Mark scan as processed
  if (selectedAsset.scanId) {
    try {
      const scanPath = selectedAsset.scanId.replace(/^https?:\/\/[^/]+/, "");
      await api.put(scanPath, { is_scanned: 1 });
      console.log("Scan marked as processed:", scanPath);
    } catch (scanErr) {
      console.error("Failed to mark scan:", scanErr);
      // Don't block — asset was saved, just log the scan error
    }
  }

  setScannedAssets(prev => prev.filter(s =>
    String(s.rfid).trim()    !== String(selectedAsset.rfidNo).trim() &&
    String(s.barcode).trim() !== String(selectedAsset.assetTagNo).trim()
  ));
  setEditModal(false);
  setSelectedAsset(null);
  setNoMasterWarning("");
  await fetchMatchedAssets();
} catch (err) {
  alert("Save failed — check console for details.");
  console.error("Save error:", err);
} finally { setSaving(false); }
};

  /* ─── openScanForEdit ─── */
  const openScanForEdit = async (scan) => {
  try {
    const vd = scan.dateTime ? new Date(scan.dateTime).toLocaleDateString("en-GB").replace(/\//g, ".") : "";

    // First try matching by RFID
    let item = null;
    if (scan.rfid) {
      const rfidData = await api.get(`/api/v1/collection/kln_asset_master?$filter=rfid_no eq '${scan.rfid}'`);
      if (rfidData.objects && rfidData.objects.length > 0) {
        item = rfidData.objects[0];
      }
    }

    // Fallback: match by barcode_no if no RFID match
    if (!item && scan.barcode) {
      const barcodeData = await api.get(`/api/v1/collection/kln_asset_master?$filter=barcode_no eq '${scan.barcode}'`);
      if (barcodeData.objects && barcodeData.objects.length > 0) {
        item = barcodeData.objects[0];
      }
    }

    if (item) {
      setSelectedAsset({
        objectId:        item.cdb_object_id,
        apiUrl:          item["@id"],
        scanId:          scan.scanId,
        assetTagNo:      item.barcode_no || "",
        rfidNo:          item.rfid_no || "",
        assetNo:         item.asset_no || "",
        assetCode:       item.asset_code || "",
        assetClass:      item.asset_class || "",
        assetDesc:       item.asset_desc || "",
        modelNo:         item.model_no || "",
        serialNo:        item.serial_no || "",
        manufacturer:    item.manufacturer || "",
        mfgYear:         item.mfg_year || "",
        baseOfUnit:      item.base_of_unit || "",
        quantity:        item.quantity || "",
        plant:           item.plant || "",
        location:        item.location || "",
        custodian:       item.custodian || "",
        companyCode:     item.company_code || "",
        costCenter:      item.cost_center || "",
        acquisVal:       item.acquis_val || "",
        capitalizedOn:   item.capitalized_on || "",
        life:            item.life || "",
        internalOrderNo: item.internal_order_no || "",
        eccIoNo:         item.ecc_io_no || "",
        verifiedDate:    vd,
        assetStatus:     item.asset_status || "Working",
        comments:        item.comments || ""
      });
    } else {
      setNoMasterWarning("No master data found for scanned asset. Please enter details manually.");
        setSelectedAsset({
          objectId: null, apiUrl: null, scanId: scan.scanId,
          assetTagNo: scan.barcode || "", rfidNo: scan.rfid || "",
          assetNo: "", assetCode: "", assetClass: "", assetDesc: "",
          modelNo: "", serialNo: "", manufacturer: "", mfgYear: "",
          baseOfUnit: "", quantity: "", plant: "", location: "",
          custodian: "", companyCode: "", costCenter: "", acquisVal: "",
          capitalizedOn: "", life: "", internalOrderNo: "", eccIoNo: "",
          verifiedDate: vd, assetStatus: "Working", comments: ""
        });
    }
    setEditModal(true);
    setShowScanPanel(false);
  } catch (err) { console.error("Master fetch error:", err); }
};

  /* ─── Computed ─── */
  const plants = ["All", ...Array.from(new Set(assets.map(a => a.plant).filter(Boolean)))];
  const filtered = assets.filter(a => {
    const q = search.toLowerCase();
    return (
      Object.values(a).some(v => v && String(v).toLowerCase().includes(q)) &&
      (statusFilter === "All" || a.asset_status      === statusFilter) &&
      (plantFilter  === "All" || a.plant             === plantFilter) &&
      (!verifiedDateFilter    || (a.verified_status || "").includes(verifiedDateFilter))
    );
  });
  const counts = {
    total:   assets.length,
    working: assets.filter(a => a.asset_status === "Working").length,
    under:   assets.filter(a => a.asset_status === "Under Utilise").length,
    idle:    assets.filter(a => a.asset_status === "Idle").length,
    scanned: assets.filter(a => a.rfid_no).length,
  };
  const totalPages    = Math.ceil(filtered.length / rowsPerPage);
  const paginatedData = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const selectStyle = {
    padding: "7px 30px 7px 11px", borderRadius: "8px", border: "1.5px solid #e2e8f0",
    fontSize: "12px", color: "#334155", background: "white", cursor: "pointer",
    fontWeight: "600", outline: "none", appearance: "none", fontFamily: "inherit",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 9px center"
  };
  const pgBtn = { padding: "6px 12px", borderRadius: "8px", border: "1.5px solid #1e3a5f", background: "#1e3a5f", color: "white", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", transition: "all .18s" };

  /* ─── Render ─── */
  return (
    <>
      <style>{STYLES}</style>
      <div style={{ minHeight: "100vh", background: "#f0f2f5", fontFamily: "'DM Sans','Segoe UI',sans-serif", position: "relative" }}>

        {/* ══ HEADER ══ */}
        <div style={{ background: "linear-gradient(100deg,#0f172a 0%,#1e3a5f 55%,#0c4a6e 100%)", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 24px rgba(0,0,0,0.28)", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "13px", height: "60px" }}>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "11px", padding: "7px", display: "flex", border: "1px solid rgba(255,255,255,.08)" }}>
              <LayersIcon />
            </div>
            <div>
              <div style={{ color: "white", fontWeight: "800", fontSize: "15px", letterSpacing: "-0.4px" }}>Asset Management System</div>
              <div style={{ color: "rgba(255,255,255,0.38)", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase" }}>RFID · TRACK · AUDIT</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", height: "60px" }}>
            <div style={{ display: "flex", gap: "2px", background: "rgba(0,0,0,0.2)", borderRadius: "10px", padding: "3px" }}>
              {[{ id: "registry", label: "📦 Verified Assets" }, { id: "master", label: "🗂 Master Data" }].map(tab => (
                <button key={tab.id} className="nav-tab" onClick={() => setActivePage(tab.id)} style={{
                  padding: "5px 14px", borderRadius: "8px", border: "none", cursor: "pointer",
                  fontSize: "12px", fontWeight: "700", fontFamily: "inherit", transition: "all .18s",
                  background: activePage === tab.id ? "rgba(255,255,255,0.14)" : "transparent",
                  color: activePage === tab.id ? "white" : "rgba(255,255,255,0.5)",
                  boxShadow: activePage === tab.id ? "0 1px 4px rgba(0,0,0,0.18)" : "none"
                }}>{tab.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ══ SCAN PANEL ══ */}
        {showScanPanel && (
          <div style={{ position: "fixed", right: "26px", top: "128px", width: "340px", background: "white", borderRadius: "16px", boxShadow: "0 16px 50px rgba(0,0,0,.18), 0 0 0 1px #e2e8f0", zIndex: 999, overflow: "hidden", animation: "slideDown .18s ease" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg,#f8f9ff,#fff)" }}>
              <div>
                <div style={{ fontWeight: "800", fontSize: "13px", color: "#0f172a" }}>Newly Scanned Assets</div>
                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "1px" }}>Click an item to register or update</div>
              </div>
              <button onClick={() => setShowScanPanel(false)} style={{ width: "28px", height: "28px", borderRadius: "7px", border: "1.5px solid #e2e8f0", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94a3b8" }}>
                <CloseIcon />
              </button>
            </div>
            {scannedAssets.length === 0 ? (
              <div style={{ padding: "36px", textAlign: "center", color: "#94a3b8" }}>
                <div style={{ fontSize: "32px", marginBottom: "10px" }}>📡</div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>No new scans yet</div>
                <div style={{ fontSize: "11px", marginTop: "4px" }}>Waiting for RFID signals…</div>
              </div>
            ) : (
              <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                {scannedAssets.map(scan => (
                  <div key={scan.scanId} className="scan-item" onClick={() => openScanForEdit(scan)} style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc", background: "white", cursor: "pointer", transition: "background .15s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <div style={{ fontSize: "12px", color: "#0f172a", fontWeight: "600" }}>
                          <span style={{ color: "#64748b", fontWeight: "700", fontSize: "10.5px" }}>ASSET TAG</span>
                          <span style={{ fontFamily: "'IBM Plex Mono',monospace", display: "block", fontSize: "13px", marginTop: "2px" }}>{scan.barcode || "—"}</span>
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                          <span style={{ fontWeight: "700", fontSize: "10.5px" }}>RFID: </span>
                          <span style={{ fontFamily: "'IBM Plex Mono',monospace", color: "#0891b2", fontWeight: "600" }}>{scan.rfid || "Not Available"}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px" }}>
                        {scan.plantCode && <span style={{ fontSize: "10px", background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: "5px", fontWeight: "700" }}>{scan.plantCode}</span>}
                        <span style={{ fontSize: "10px", color: "#94a3b8", background: "#f1f5f9", padding: "2px 8px", borderRadius: "5px" }}>Click to edit →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ PAGE CONTENT ══ */}
        <div style={{ padding: "22px 26px" }}>

          {/* Page title + scan button */}
          <div style={{ marginBottom: "20px", animation: "fadeUp .3s ease", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.7px" }}>
                  {activePage === "registry" ? "Asset Registry" : "Master Data"}
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>
                {activePage === "registry" ? "Verified Assets" : "Master Data Management"}
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "#64748b" }}>
                {activePage === "registry"
                  ? "Track and manage all RFID-verified assets across plants"
                  : "Manage asset master records — add, edit, and remove entries"}
              </p>
            </div>
            <button className="scan-btn-inline" onClick={() => setShowScanPanel(!showScanPanel)} style={{
              flexShrink: 0, display: "flex", alignItems: "center", gap: "8px",
              padding: "9px 16px", borderRadius: "10px",
              background: showScanPanel ? "#0f172a" : "#1e3a5f",
              border: "1.5px solid #1e3a5f", color: "white",
              fontSize: "12.5px", fontWeight: "700", cursor: "pointer",
              fontFamily: "inherit", transition: "all .18s",
              boxShadow: "0 2px 8px rgba(15,23,42,0.25)",
            }}>
              <ScanIcon />
              <span>Scanned Assets</span>
              {scannedAssets.length > 0 && (
                <span style={{ background: "linear-gradient(135deg,#f97316,#ef4444)", color: "white", borderRadius: "99px", fontSize: "10px", padding: "1px 8px", fontWeight: "800", animation: "pulseDot 1.6s infinite", minWidth: "20px", textAlign: "center", boxShadow: "0 2px 6px rgba(239,68,68,0.55)", border: "1.5px solid rgba(255,255,255,0.25)" }}>
                  {scannedAssets.length}
                </span>
              )}
            </button>
          </div>

          {/* ── REGISTRY PAGE ── */}
          {activePage === "registry" && (
            <>
              {/* Stat Cards */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "18px", flexWrap: "wrap" }}>
                <StatCard label="Total Assets"  value={counts.total}   accent="#3b82f6" emoji="📦" onClick={() => setStatusFilter("All")}           active={statusFilter === "All"} />
                <StatCard label="Working"       value={counts.working} accent="#10b981" emoji="✅" onClick={() => setStatusFilter("Working")}        active={statusFilter === "Working"} />
                <StatCard label="Under Utilise" value={counts.under}   accent="#f59e0b" emoji="⚠️" onClick={() => setStatusFilter("Under Utilise")} active={statusFilter === "Under Utilise"} />
                <StatCard label="Idle"          value={counts.idle}    accent="#f43f5e" emoji="🔴" onClick={() => setStatusFilter("Idle")}           active={statusFilter === "Idle"} />
                <StatCard label="RFID Scanned"  value={counts.scanned} accent="#0ea5e9" emoji="📡" />
              </div>

              {/* Table Card */}
              <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e8eef6", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                {/* Toolbar */}
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", background: "linear-gradient(180deg,#fafbff,#fff)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontWeight: "800", fontSize: "14px", color: "#0f172a" }}>Asset Records</span>
                    <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: "10.5px", fontWeight: "800", padding: "2px 10px", borderRadius: "20px", fontFamily: "'IBM Plex Mono',monospace" }}>{filtered.length}</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <select value={plantFilter} onChange={e => { setPlantFilter(e.target.value); setCurrentPage(1); }} style={selectStyle}>
                      {plants.map(p => <option key={p}>{p}</option>)}
                    </select>
                    <input type="text" placeholder="Filter by verified date…" value={verifiedDateFilter}
                      onChange={e => { setVerifiedDateFilter(e.target.value); setCurrentPage(1); }}
                      style={{ padding: "7px 10px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "12px", width: "170px", fontFamily: "inherit", outline: "none" }}
                    />
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", display: "flex", pointerEvents: "none" }}><SearchIcon /></span>
                      <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search any field…"
                        style={{ paddingLeft: "32px", paddingRight: "12px", paddingTop: "7px", paddingBottom: "7px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "12px", color: "#334155", outline: "none", background: "white", width: "200px", fontFamily: "inherit" }}
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
                        <TH>Description</TH>
                        <TH mandatory>Plant</TH>
                        <TH>Custodian</TH>
                        <TH mandatory>Status</TH>
                        <TH>Qty</TH>
                        <TH>Actions</TH>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length > 0
                        ? paginatedData.map((asset, i) => (
                            <AssetRow key={asset.cdb_object_id || i} asset={asset} index={i} onEdit={handleEdit} onView={setViewAsset} />
                          ))
                        : (
                          <tr>
                            <td colSpan={9} style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
                              <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔍</div>
                              <div style={{ fontSize: "15px", fontWeight: "700", marginBottom: "4px", color: "#64748b" }}>No verified assets found</div>
                              <div style={{ fontSize: "12px" }}>Assets appear here after RFID scan verification</div>
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div style={{ padding: "14px 18px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    Page <strong>{currentPage}</strong> of <strong>{totalPages || 1}</strong>
                    <span style={{ color: "#94a3b8", marginLeft: "8px" }}>({filtered.length} records)</span>
                  </span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button disabled={currentPage === 1 || totalPages <= 1} onClick={() => setCurrentPage(p => p - 1)} style={{ ...pgBtn, opacity: currentPage === 1 || totalPages <= 1 ? 0.45 : 1, cursor: currentPage === 1 || totalPages <= 1 ? "not-allowed" : "pointer" }}>◀ Prev</button>
                    <button disabled={currentPage === totalPages || totalPages <= 1} onClick={() => setCurrentPage(p => p + 1)} style={{ ...pgBtn, opacity: currentPage === totalPages || totalPages <= 1 ? 0.45 : 1, cursor: currentPage === totalPages || totalPages <= 1 ? "not-allowed" : "pointer" }}>Next ▶</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── MASTER DATA PAGE ── */}
          {activePage === "master" && <MasterDataPage />}
        </div>

        {/* ══ EDIT MODAL ══ */}
        {editModal && selectedAsset && (
          <EditModal
            asset={selectedAsset}
            warning={noMasterWarning}
            onClose={() => { setEditModal(false); setSelectedAsset(null); setNoMasterWarning(""); }}
            onSave={handleSaveEdit}
            onChange={setSelectedAsset}
            saving={saving}
          />
        )}

        {/* ══ VIEW MODAL ══ */}
        {viewAsset && (
          <ViewModal
            asset={viewAsset}
            onClose={() => setViewAsset(null)}
            onEdit={(asset) => { setViewAsset(null); handleEdit(asset); }}
          />
        )}
      </div>
    </>
  );
}