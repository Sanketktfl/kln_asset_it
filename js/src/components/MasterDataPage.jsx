import React, { useEffect, useState } from "react";
import api from "../api/apiUtils";
import EditModal from "./EditModal";
import { EditIcon } from "./icons";

/* ── STATUS CONFIG ── */
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

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=DM+Sans:wght@400;500;600;700;800&display=swap');
  .master-trow:hover td { background: #f5f8ff !important; }
  .master-btn-edit:hover  { background: #e0e7ff !important; border-color: #a5b4fc !important; color: #4338ca !important; }
  .master-btn-del:hover   { background: #fee2e2 !important; border-color: #fca5a5 !important; color: #dc2626 !important; }
  .master-btn-view:hover  { background: #e0f2fe !important; border-color: #7dd3fc !important; color: #0369a1 !important; }
  .master-add-btn:hover   { background: #2a4a6e !important; }
  .master-pg-btn:hover    { background: #0f172a !important; border-color: #0f172a !important; }
  .master-search:focus    { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,.1) !important; }
  .view-field:hover       { background: #f8faff !important; }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes pulseDot { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(.7);opacity:.5;} }
`;

/* ── Icons ── */
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

/* ── Sub-components ── */
const TH = ({ children, mandatory }) => (
  <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "10px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", whiteSpace: "nowrap", background: "#f9fafb", borderBottom: "2px solid #f1f5f9" }}>
    {children}{mandatory && <span style={{ color: "#e11d48", marginLeft: "2px" }}>*</span>}
  </th>
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

/* ── Master Row ── */
const MasterAssetRow = ({ asset, index, onEdit, onDelete, onView }) => {
  const cell = { padding: "10px 14px", fontSize: "12.5px", color: "#334155", borderBottom: "1px solid #f1f5f9", background: index % 2 === 0 ? "white" : "#fafbfd", transition: "background .15s", verticalAlign: "middle", whiteSpace: "nowrap" };
  const mono = { fontFamily: "'IBM Plex Mono', monospace", fontSize: "11.5px" };

  return (
    <tr className="master-trow" style={{ animation: `fadeUp .3s ease ${Math.min(index,20) * 0.02}s both` }}>

      {/* Asset Tag */}
      <td style={cell}>
        <span style={{ ...mono, background: "#f0f9ff", color: "#0369a1", padding: "3px 8px", borderRadius: "6px", border: "1px solid #bae6fd", fontWeight: "600" }}>
          {asset.barcode_no || "—"}
        </span>
      </td>

      {/* RFID */}
      <td style={cell}>
        {asset.rfid_no
          ? <span style={{ ...mono, fontSize: "10.5px", color: "#0891b2", background: "#ecfeff", padding: "2px 7px", borderRadius: "5px", border: "1px solid #a5f3fc" }}>{asset.rfid_no.length > 14 ? "…" + asset.rfid_no.slice(-12) : asset.rfid_no}</span>
          : <span style={{ color: "#cbd5e1", fontSize: "11px", fontStyle: "italic" }}>No RFID</span>}
      </td>

      {/* Asset No */}
      <td style={cell}>
        <span style={{ ...mono, color: "#64748b", fontSize: "11.5px" }}>{asset.asset_no || "—"}</span>
      </td>

      {/* Asset Desc */}
      <td style={{ ...cell, maxWidth: "220px", whiteSpace: "normal", wordBreak: "break-word" }}>
        <span style={{ fontSize: "12px", color: "#334155", fontWeight: "500" }}>{asset.asset_desc || "—"}</span>
      </td>

      {/* Plant */}
      <td style={cell}><PlantPill value={asset.plant} /></td>

      {/* Custodian */}
      <td style={cell}>
        <span style={{ fontSize: "12px", color: "#475569" }}>{asset.custodian || <span style={{ color: "#cbd5e1" }}>—</span>}</span>
      </td>

      {/* Status */}
      <td style={cell}><StatusBadge value={asset.asset_status} /></td>

      {/* Qty */}
      <td style={{ ...cell, textAlign: "center" }}>
        <span style={{ ...mono, fontSize: "12px", color: "#475569" }}>{asset.quantity ?? "—"}</span>
      </td>

      {/* Actions */}
      <td style={{ ...cell, whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", gap: "5px", justifyContent: "flex-end" }}>
          <button className="master-btn-view" onClick={() => onView(asset)} title="View All Details"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", borderRadius: "7px", border: "1.5px solid #bae6fd", background: "#f0f9ff", color: "#0369a1", cursor: "pointer", transition: "all .15s" }}>
            <EyeIcon />
          </button>
          <button className="master-btn-edit" onClick={() => onEdit(asset)} title="Edit"
            style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "7px", border: "1.5px solid #e0e7ff", background: "#eef2ff", color: "#4f46e5", fontSize: "11px", fontWeight: "700", cursor: "pointer", transition: "all .15s" }}>
            <EditIcon />
          </button>
          <button className="master-btn-del" onClick={() => onDelete(asset)} title="Delete"
            style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "7px", border: "1.5px solid #fee2e2", background: "#fff1f2", color: "#f43f5e", fontSize: "11px", fontWeight: "700", cursor: "pointer", transition: "all .15s" }}>
            🗑
          </button>
        </div>
      </td>
    </tr>
  );
};

/* ── View Modal ── */
const ViewModal = ({ asset, onClose, onEdit }) => {
  if (!asset) return null;
  const sc = STATUS_CONFIG[asset.asset_status] || { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8", border: "#e2e8f0" };

  const SECTIONS = [
    {
      title: "🏷 Asset Identity", color: "#6366f1", bg: "#eef2ff", border: "#e0e7ff",
      fields: ["barcode_no","rfid_no","asset_no","asset_code","asset_class","asset_desc"]
    },
    {
      title: "🔩 Physical Details", color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc",
      fields: ["model_no","serial_no","manufacturer","mfg_year","base_of_unit","quantity"]
    },
    {
      title: "📍 Location & Ownership", color: "#059669", bg: "#ecfdf5", border: "#a7f3d0",
      fields: ["plant","location","custodian","company_code","cost_center"]
    },
    {
      title: "💰 Financial & Lifecycle", color: "#d97706", bg: "#fffbeb", border: "#fde68a",
      fields: ["acquis_val","capitalized_on","life","internal_order_no","ecc_io_no"]
    },
    {
      title: "✅ Verification", color: "#e11d48", bg: "#fff1f2", border: "#fecdd3",
      fields: ["verified_status","asset_status","comments"]
    },
  ];

  const fieldMap = Object.fromEntries(DETAIL_FIELDS.map(f => [f.key, f]));

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, padding: "20px", animation: "fadeIn .18s ease" }}>
      <div
          onClick={e => e.stopPropagation()}
          style={{
            background: "#f8fafc",
            width: "100%",
            maxWidth: "780px",
            maxHeight: "92vh",
            borderRadius: "22px",
            boxShadow: "0 40px 100px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            animation: "fadeUp .22s ease",
            overflow: "hidden"
          }}
        >

        {/* Header */}
        <div style={{ padding: "22px 26px 18px", background: "linear-gradient(100deg,#0f172a 0%,#1e3a5f 55%,#0c4a6e 100%)", display: "flex",flexWrap: "wrap",gap: "12px",justifyContent: "space-between",alignItems: "flex-start", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "2px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: "5px" }}>Asset Details</div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "14px",
              background: "#ecfeff",
              color: "#0891b2",
              padding: "6px 14px",
              borderRadius: "8px",
              border: "1px solid #a5f3fc",
              display: "inline-block",
              fontWeight: "700"
            }}>
              RFID: {asset.rfid_no || "—"}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
            <button onClick={() => { onClose(); onEdit(asset); }}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "9px", border: "1.5px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "white", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
              <EditIcon /> Edit
            </button>
            <button onClick={onClose}
              style={{ width: "34px", height: "34px", borderRadius: "9px", border: "1.5px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.6)", fontSize: "16px" }}>
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "20px 22px",
          display: "flex",
          flexDirection: "column",
          gap: "14px"
        }}>
          {SECTIONS.map(section => (
            <div key={section.title} style={{ background: "white", borderRadius: "14px", border: `1px solid ${section.border}`, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              {/* Section header */}
              <div style={{ padding: "10px 16px", background: section.bg, borderBottom: `1px solid ${section.border}`, display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: "800", color: section.color }}>{section.title}</span>
              </div>
              {/* Fields grid */}
              <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  alignItems: "start"
                }}>
                {section.fields.map(key => {
                  const meta = fieldMap[key];
                  const val = asset[key];
                  return (
                    <div
                      key={key}
                      className="view-field"
                      style={{
                        padding: "14px 16px",
                        borderBottom: "1px solid #f8fafc",
                        borderRight: "1px solid #f8fafc",
                        transition: "background .15s",
                        minHeight: "auto",
                        display: "block"
                      }}
                    >
                      <div style={{ fontSize: "9.5px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "5px" }}>
                        {meta?.label || key}
                      </div>
                      {key === "asset_status" ? (
                        <StatusBadge value={val} />
                      ) : key === "plant" ? (
                        <PlantPill value={val} />
                      ) : val ? (
                        <div style={{fontSize: "13px",color: "#1e293b",fontWeight: "600",marginTop: "2px",lineHeight: "1.35",wordBreak: "break-word", fontFamily: meta?.mono ? "'IBM Plex Mono',monospace" : "inherit", fontSize: meta?.mono ? "11.5px" : "13px" }}>
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
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   MASTER DATA PAGE
══════════════════════════════════════════════ */
export default function MasterDataPage() {
  const [assets, setAssets]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [editModal, setEditModal]         = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [viewAsset, setViewAsset]         = useState(null);
  const [search, setSearch]               = useState("");
  const [plantFilter, setPlantFilter]     = useState("All");
  const [statusFilter, setStatusFilter]   = useState("All");
  const [currentPage, setCurrentPage]     = useState(1);
  const rowsPerPage = 100;

  const fetchMaster = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/internal/asset_it_master`);
      setAssets(data.objects || []);
    } catch (err) {
      console.error("Master fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMaster(); }, []);

  const handleDelete = async (asset) => {
    if (!window.confirm(`Delete asset "${asset.barcode_no || asset.cdb_object_id}"?`)) return;
    try {
      await api.delete(`/api/v1/collection/kln_asset_master/${asset.cdb_object_id}`);
      fetchMaster();
    } catch (err) { console.error("Delete failed", err); }
  };

  const handleEdit = (asset) => {
    setSelectedAsset({
      objectId:        asset.cdb_object_id,
      assetTagNo:      asset.barcode_no,
      rfidNo:          asset.rfid_no,
      assetNo:         asset.asset_no,
      assetCode:       asset.asset_code,
      assetClass:      asset.asset_class,
      assetDesc:       asset.asset_desc,
      modelNo:         asset.model_no,
      serialNo:        asset.serial_no,
      manufacturer:    asset.manufacturer,
      mfgYear:         asset.mfg_year,
      baseOfUnit:      asset.base_of_unit,
      quantity:        asset.quantity,
      plant:           asset.plant,
      location:        asset.location,
      custodian:       asset.custodian,
      companyCode:     asset.company_code,
      costCenter:      asset.cost_center,
      acquisVal:       asset.acquis_val,
      capitalizedOn:   asset.capitalized_on,
      life:            asset.life,
      internalOrderNo: asset.internal_order_no,
      eccIoNo:         asset.ecc_io_no,
      verifiedDate:    asset.verified_status,
      assetStatus:     asset.asset_status,
      comments:        asset.comments || ""
    });
    setEditModal(true);
  };

  const handleAdd = () => {
    setSelectedAsset({
      objectId: null, assetTagNo: "", rfidNo: "", assetNo: "", assetCode: "",
      assetClass: "", assetDesc: "", modelNo: "", serialNo: "", manufacturer: "",
      mfgYear: "", baseOfUnit: "", quantity: "", plant: "", location: "",
      custodian: "", companyCode: "", costCenter: "", acquisVal: "",
      capitalizedOn: "", life: "", internalOrderNo: "", eccIoNo: "",
      verifiedDate: "", assetStatus: "Working", comments: ""
    });
    setEditModal(true);
  };

  const handleSave = async () => {
    const payload = {
      barcode_no:        selectedAsset.assetTagNo,
      rfid_no:           selectedAsset.rfidNo,
      asset_no:          selectedAsset.assetNo,
      asset_code:        selectedAsset.assetCode,
      asset_class:       selectedAsset.assetClass,
      asset_desc:        selectedAsset.assetDesc,
      model_no:          selectedAsset.modelNo,
      serial_no:         selectedAsset.serialNo,
      manufacturer:      selectedAsset.manufacturer,
      mfg_year:          selectedAsset.mfgYear,
      base_of_unit:      selectedAsset.baseOfUnit,
      quantity:          selectedAsset.quantity ? parseFloat(selectedAsset.quantity) : null,
      plant:             selectedAsset.plant,
      location:          selectedAsset.location,
      custodian:         selectedAsset.custodian,
      company_code:      selectedAsset.companyCode,
      cost_center:       selectedAsset.costCenter,
      acquis_val:        selectedAsset.acquisVal,
      capitalized_on:    selectedAsset.capitalizedOn || null,
      life:              selectedAsset.life,
      internal_order_no: selectedAsset.internalOrderNo,
      ecc_io_no:         selectedAsset.eccIoNo,
      verified_status:   selectedAsset.verifiedDate,
      asset_status:      selectedAsset.assetStatus,
      comments:          selectedAsset.comments || ""
    };
    try {
      if (selectedAsset.objectId) {
        await api.put(`/api/v1/collection/kln_asset_master/${selectedAsset.objectId}`, payload);
      } else {
        await api.post("/internal/asset_it_master", payload);
      }
      setEditModal(false);
      fetchMaster();
    } catch (err) { console.error("Save failed", err); }
  };

  /* ── Stats ── */
  const counts = {
    total:   assets.length,
    working: assets.filter(a => a.asset_status === "Working").length,
    under:   assets.filter(a => a.asset_status === "Under Utilise").length,
    idle:    assets.filter(a => a.asset_status === "Idle").length,
  };

  /* ── Filters ── */
  const plants = ["All", ...Array.from(new Set(assets.map(a => a.plant).filter(Boolean))).sort()];
  const filtered = assets.filter(a => {
    const q = search.toLowerCase();
    return (
      Object.values(a).some(v => v && String(v).toLowerCase().includes(q)) &&
      (statusFilter === "All" || a.asset_status === statusFilter) &&
      (plantFilter  === "All" || a.plant        === plantFilter)
    );
  });
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

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px", gap: "12px", color: "#64748b" }}>
      <div style={{ width: "20px", height: "20px", border: "2.5px solid #e2e8f0", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      Loading master records…
    </div>
  );

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Stat Cards ── */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "18px", flexWrap: "wrap" }}>
        {[
          { label: "Total Assets",    value: counts.total,   accent: "#3b82f6", emoji: "📦", filter: "All" },
          { label: "Working",         value: counts.working, accent: "#10b981", emoji: "✅", filter: "Working" },
          { label: "Under Utilise",   value: counts.under,   accent: "#f59e0b", emoji: "⚠️", filter: "Under Utilise" },
          { label: "Idle",            value: counts.idle,    accent: "#f43f5e", emoji: "🔴", filter: "Idle" },
        ].map(card => (
          <div key={card.label} onClick={() => { setStatusFilter(card.filter); setCurrentPage(1); }}
            style={{ cursor: "pointer", background: "white", borderRadius: "14px", padding: "16px 20px", border: statusFilter === card.filter ? `2px solid ${card.accent}` : "1px solid #f1f5f9", boxShadow: statusFilter === card.filter ? `0 0 0 4px ${card.accent}18` : "0 1px 8px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "12px", flex: "1 1 0", minWidth: "120px", transition: "all .18s", animation: "fadeUp .3s ease both" }}>
            <div style={{ position: "relative", left: 0, top: 0, bottom: 0, width: "3px", background: card.accent, borderRadius: "99px", alignSelf: "stretch", flexShrink: 0 }} />
            <div style={{ width: "40px", height: "40px", borderRadius: "11px", background: card.accent + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{card.emoji}</div>
            <div>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", fontFamily: "'IBM Plex Mono',monospace" }}>{card.value.toLocaleString()}</div>
              <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.7px" }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e8eef6", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", overflow: "hidden" }}>

        {/* Toolbar */}
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", background: "linear-gradient(180deg,#fafbff,#fff)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: "800", fontSize: "14px", color: "#0f172a" }}>Master Records</span>
            <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: "10.5px", fontWeight: "800", padding: "2px 10px", borderRadius: "20px", fontFamily: "'IBM Plex Mono',monospace" }}>{filtered.length.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <select value={plantFilter} onChange={e => { setPlantFilter(e.target.value); setCurrentPage(1); }} style={selectStyle}>
              {plants.map(p => <option key={p}>{p}</option>)}
            </select>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "13px", pointerEvents: "none" }}>🔍</span>
              <input className="master-search" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search master records…"
                style={{ paddingLeft: "32px", paddingRight: "12px", paddingTop: "7px", paddingBottom: "7px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "12px", color: "#334155", outline: "none", background: "white", width: "200px", fontFamily: "inherit", transition: "all .15s" }} />
            </div>
            <button className="master-add-btn" onClick={handleAdd}
              style={{ padding: "7px 16px", background: "#1e3a5f", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "12.5px", fontWeight: "700", fontFamily: "inherit", transition: "background .15s", display: "flex", alignItems: "center", gap: "6px" }}>
              ＋ Add Asset
            </button>
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
              {paginatedData.length > 0
                ? paginatedData.map((a, i) => (
                    <MasterAssetRow key={a.cdb_object_id || i} asset={a} index={i} onEdit={handleEdit} onDelete={handleDelete} onView={setViewAsset} />
                  ))
                : (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
                      <div style={{ fontSize: "36px", marginBottom: "12px" }}>📋</div>
                      <div style={{ fontSize: "15px", fontWeight: "700", marginBottom: "4px", color: "#64748b" }}>No master records found</div>
                      <div style={{ fontSize: "12px" }}>Try adjusting your search or filters</div>
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
            <span style={{ color: "#94a3b8", marginLeft: "8px" }}>({filtered.length.toLocaleString()} records)</span>
          </span>
          <div style={{ display: "flex", gap: "6px" }}>
            <button disabled={currentPage === 1 || totalPages <= 1} onClick={() => setCurrentPage(p => p - 1)}
              style={{ ...pgBtn, opacity: currentPage === 1 || totalPages <= 1 ? 0.45 : 1, cursor: currentPage === 1 || totalPages <= 1 ? "not-allowed" : "pointer" }}>◀ Prev</button>
            <button disabled={currentPage === totalPages || totalPages <= 1} onClick={() => setCurrentPage(p => p + 1)}
              style={{ ...pgBtn, opacity: currentPage === totalPages || totalPages <= 1 ? 0.45 : 1, cursor: currentPage === totalPages || totalPages <= 1 ? "not-allowed" : "pointer" }}>Next ▶</button>
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editModal && selectedAsset && (
        <EditModal asset={selectedAsset} onClose={() => setEditModal(false)} onSave={handleSave} onChange={setSelectedAsset} allowRfidEdit={true} />
      )}

      {/* ── View Modal ── */}
      {viewAsset && (
        <ViewModal asset={viewAsset} onClose={() => setViewAsset(null)} onEdit={(asset) => { setViewAsset(null); handleEdit(asset); }} />
      )}
    </>
  );
}