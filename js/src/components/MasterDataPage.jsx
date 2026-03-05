import React, { useEffect, useState } from "react";
import api from "../api/apiUtils";
import EditModal from "./EditModal";

/* ── STATUS CONFIG (mirrors MainDashboard) ── */
const STATUS_CONFIG = {
  Working:         { bg: "#ecfdf5", color: "#059669", dot: "#10b981", border: "#a7f3d0" },
  "Under Utilise": { bg: "#fffbeb", color: "#d97706", dot: "#f59e0b", border: "#fde68a" },
  Idle:            { bg: "#fff1f2", color: "#e11d48", dot: "#f43f5e", border: "#fecdd3" },
};

const PLANT_COLORS = {
  Mundhwa:  { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  Baramati: { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  R1:       { color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc" },
  R2:       { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=DM+Sans:wght@400;500;600;700;800&display=swap');
  .master-trow:hover td { background: #f5f8ff !important; }
  .master-btn-edit:hover { background: #e0e7ff !important; border-color: #a5b4fc !important; color: #4338ca !important; }
  .master-btn-del:hover  { background: #fee2e2 !important; border-color: #fca5a5 !important; color: #dc2626 !important; }
  .master-add-btn:hover  { background: #4338ca !important; }
  .master-search:focus   { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,.1) !important; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
`;

/* ── TH ── */
const TH = ({ children, mandatory }) => (
  <th style={{
    padding: "10px 14px", textAlign: "left", fontSize: "10px", fontWeight: "800",
    color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px",
    whiteSpace: "nowrap", background: "#f9fafb", borderBottom: "2px solid #f1f5f9"
  }}>
    {children}{mandatory && <span style={{ color: "#e11d48", marginLeft: "2px" }}>*</span>}
  </th>
);

/* ── MASTER ASSET ROW (same quality as MainDashboard's AssetRow) ── */
const MasterAssetRow = ({ asset, index, onEdit, onDelete }) => {
  const status = asset.asset_status || "Working";
  const sc = STATUS_CONFIG[status] || STATUS_CONFIG.Working;
  const pc = PLANT_COLORS[asset.plant] || { color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" };

  const cell = {
    padding: "11px 14px", fontSize: "12.5px", color: "#334155",
    borderBottom: "1px solid #f1f5f9", background: "white",
    transition: "background .15s", verticalAlign: "middle"
  };
  const mono = { fontFamily: "'IBM Plex Mono', monospace", fontSize: "11.5px" };

  return (
    <tr className="master-trow" style={{ animation: `fadeUp .3s ease ${index * 0.03}s both` }}>
      {/* Barcode */}
      <td style={cell}>
        <span style={{ ...mono, background: "#f0f9ff", color: "#0369a1", padding: "3px 8px", borderRadius: "6px", border: "1px solid #bae6fd", fontWeight: "600" }}>
          {asset.barcode_no || "—"}
        </span>
      </td>

      {/* RFID */}
      <td style={cell}>
        {asset.rfid_no
          ? <span style={{ ...mono, color: "#0891b2", fontWeight: "600" }}>{asset.rfid_no}</span>
          : <span style={{ color: "#cbd5e1", fontSize: "11px" }}>No RFID</span>}
      </td>

      {/* Asset No */}
      <td style={cell}>
        <span style={{ fontWeight: "600", color: "#0f172a", ...mono }}>{asset.asset_no || "—"}</span>
      </td>

      {/* Model */}
      <td style={cell}>
        <span style={{ color: "#475569", fontSize: "12px" }}>{asset.model_no || "—"}</span>
      </td>

      {/* Serial */}
      <td style={cell}>
        <span style={{ ...mono, fontSize: "11px", color: "#64748b" }}>{asset.serial_no || "—"}</span>
      </td>

      {/* Plant */}
      <td style={cell}>
        {asset.plant
          ? <span style={{ fontSize: "11px", fontWeight: "700", color: pc.color, background: pc.bg, border: `1px solid ${pc.border}`, padding: "3px 9px", borderRadius: "6px" }}>{asset.plant}</span>
          : <span style={{ color: "#cbd5e1", fontSize: "11px" }}>—</span>}
      </td>

      {/* Location */}
      <td style={cell}>
        <span style={{ color: "#475569", fontSize: "12px" }}>{asset.location || "—"}</span>
      </td>

      {/* Custodian */}
      <td style={cell}>
        {asset.custodian ? (
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "10px", fontWeight: "800", flexShrink: 0 }}>
              {asset.custodian.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: "12px", fontWeight: "500", color: "#334155" }}>{asset.custodian}</span>
          </div>
        ) : <span style={{ color: "#cbd5e1", fontSize: "11px" }}>—</span>}
      </td>

      {/* Mfg Year */}
      <td style={cell}>
        <span style={{ ...mono, fontSize: "12px", color: "#475569" }}>{asset.mfg_year || "—"}</span>
      </td>

      {/* Verified Date */}
      <td style={cell}>
        {asset.verified_status
          ? <span style={{ fontSize: "11.5px", color: "#0369a1", background: "#f0f9ff", padding: "3px 8px", borderRadius: "6px", border: "1px solid #bae6fd", ...mono }}>
              {new Date(asset.verified_status).toLocaleDateString("en-GB").replace(/\//g, ".")}
            </span>
          : <span style={{ color: "#cbd5e1", fontSize: "11px" }}>—</span>}
      </td>

      {/* Status */}
      <td style={cell}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
          padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", whiteSpace: "nowrap"
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
          {status}
        </span>
      </td>

      {/* Actions */}
      <td style={{ ...cell, whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <button className="master-btn-edit" onClick={() => onEdit(asset)} style={{
            padding: "5px 12px", borderRadius: "7px", border: "1.5px solid #e0e7ff",
            background: "#f5f3ff", color: "#6366f1", fontSize: "11.5px", fontWeight: "700",
            cursor: "pointer", fontFamily: "inherit", transition: "all .15s", display: "flex", alignItems: "center", gap: "5px"
          }}>
            ✏️ Edit
          </button>
          <button className="master-btn-del" onClick={() => onDelete(asset)} style={{
            padding: "5px 12px", borderRadius: "7px", border: "1.5px solid #fee2e2",
            background: "#fff1f2", color: "#f43f5e", fontSize: "11.5px", fontWeight: "700",
            cursor: "pointer", fontFamily: "inherit", transition: "all .15s", display: "flex", alignItems: "center", gap: "5px"
          }}>
            🗑 Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

/* ══════════════════════════════════════════════
   MASTER DATA PAGE
══════════════════════════════════════════════ */
export default function MasterDataPage() {
  const [assets, setAssets]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [editModal, setEditModal]       = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [search, setSearch]             = useState("");
  const [plantFilter, setPlantFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage]   = useState(1);
  const rowsPerPage = 10;

  const fetchMaster = async () => {
    try {
      const data = await api.get("/api/v1/collection/kln_asset_master");
      setAssets(data.objects || []);
    } catch (err) {
      console.error("Master fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMaster(); }, []);

  const handleDelete = async (asset) => {
    if (!window.confirm("Delete this asset?")) return;
    try {
      await api.delete(asset["@id"].replace(api.getBaseURL(), ""));
      fetchMaster();
    } catch (err) { console.error("Delete failed", err); }
  };

  const handleEdit = (asset) => {
    setSelectedAsset({
      apiUrl: asset["@id"],
      assetTagNo: asset.barcode_no,
      rfidNo: asset.rfid_no,
      assetNo: asset.asset_no,
      modelNo: asset.model_no,
      serialNo: asset.serial_no,
      plant: asset.plant,
      location: asset.location,
      custodian: asset.custodian,
      mfgYear: asset.mfg_year,
      verifiedDate: asset.verified_status,
      assetStatus: asset.asset_status,
      comments: asset.comments || ""
    });
    setEditModal(true);
  };

  const handleAdd = () => {
    setSelectedAsset({
      apiUrl: null, assetTagNo: "", rfidNo: "", assetNo: "", modelNo: "",
      serialNo: "", plant: "", location: "", custodian: "", mfgYear: "",
      verifiedDate: "", assetStatus: "Working", comments: ""
    });
    setEditModal(true);
  };

  const handleSave = async () => {
    const payload = {
      barcode_no: selectedAsset.assetTagNo, rfid_no: selectedAsset.rfidNo,
      asset_no: selectedAsset.assetNo, model_no: selectedAsset.modelNo,
      serial_no: selectedAsset.serialNo, plant: selectedAsset.plant,
      location: selectedAsset.location, custodian: selectedAsset.custodian,
      mfg_year: selectedAsset.mfgYear, verified_status: selectedAsset.verifiedDate,
      asset_status: selectedAsset.assetStatus, comments: selectedAsset.comments || ""
    };
    try {
      if (selectedAsset.apiUrl) {
        await api.put(selectedAsset.apiUrl.replace(api.getBaseURL(), ""), payload);
      } else {
        await api.post("/internal/asset_it_master", payload);
      }
      setEditModal(false);
      fetchMaster();
    } catch (err) { console.error("Save failed", err); }
  };

  /* ── computed ── */
  const plants = ["All", ...Array.from(new Set(assets.map(a => a.plant).filter(Boolean)))];
  const filtered = assets.filter(a => {
    const q = search.toLowerCase();
    return (
      Object.values(a).some(v => String(v).toLowerCase().includes(q)) &&
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
  const pgBtn = {
    padding: "6px 12px", borderRadius: "8px", border: "1.5px solid #e2e8f0",
    background: "white", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit"
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px", gap: "12px", color: "#64748b" }}>
      <div style={{ width: "20px", height: "20px", border: "2.5px solid #e2e8f0", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      Loading master records…
    </div>
  );

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Table Card ── */}
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e8eef6", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", overflow: "hidden" }}>

        {/* Toolbar */}
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", background: "linear-gradient(180deg,#fafbff,#fff)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: "800", fontSize: "14px", color: "#0f172a" }}>Master Records</span>
            <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: "10.5px", fontWeight: "800", padding: "2px 10px", borderRadius: "20px", fontFamily: "'IBM Plex Mono',monospace" }}>{filtered.length}</span>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <select value={plantFilter} onChange={e => { setPlantFilter(e.target.value); setCurrentPage(1); }} style={selectStyle}>
              {plants.map(p => <option key={p}>{p}</option>)}
            </select>

            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "13px", pointerEvents: "none" }}>🔍</span>
              <input
                className="master-search"
                value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search master records…"
                style={{ paddingLeft: "32px", paddingRight: "12px", paddingTop: "7px", paddingBottom: "7px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "12px", color: "#334155", outline: "none", background: "white", width: "200px", fontFamily: "inherit", transition: "all .15s" }}
              />
            </div>

            <button className="master-add-btn" onClick={handleAdd} style={{
              padding: "7px 16px", background: "#4f46e5", color: "white", border: "none",
              borderRadius: "8px", cursor: "pointer", fontSize: "12.5px", fontWeight: "700",
              fontFamily: "inherit", transition: "background .15s", display: "flex", alignItems: "center", gap: "6px"
            }}>
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
                <TH>Model No.</TH>
                <TH>Serial No.</TH>
                <TH mandatory>Plant</TH>
                <TH>Location</TH>
                <TH>Custodian</TH>
                <TH>Mfg Year</TH>
                <TH>Verified Date</TH>
                <TH mandatory>Status</TH>
                <TH>Actions</TH>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0
                ? paginatedData.map((a, i) => (
                    <MasterAssetRow key={a["@id"] || i} asset={a} index={i} onEdit={handleEdit} onDelete={handleDelete} />
                  ))
                : (
                  <tr>
                    <td colSpan={12} style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
                      <div style={{ fontSize: "36px", marginBottom: "12px" }}>📋</div>
                      <div style={{ fontSize: "15px", fontWeight: "700", marginBottom: "4px", color: "#64748b" }}>No master records found</div>
                      <div style={{ fontSize: "12px" }}>Try adjusting your search or add a new asset</div>
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
            <button disabled={currentPage === 1 || totalPages <= 1}
              onClick={() => setCurrentPage(p => p - 1)}
              style={{ ...pgBtn, opacity: currentPage === 1 || totalPages <= 1 ? 0.45 : 1, cursor: currentPage === 1 || totalPages <= 1 ? "not-allowed" : "pointer" }}>◀ Prev</button>
            <button disabled={currentPage === totalPages || totalPages <= 1}
              onClick={() => setCurrentPage(p => p + 1)}
              style={{ ...pgBtn, opacity: currentPage === totalPages || totalPages <= 1 ? 0.45 : 1, cursor: currentPage === totalPages || totalPages <= 1 ? "not-allowed" : "pointer" }}>Next ▶</button>
          </div>
        </div>
      </div>

      {editModal && selectedAsset && (
        <EditModal
          asset={selectedAsset}
          onClose={() => setEditModal(false)}
          onSave={handleSave}
          onChange={setSelectedAsset}
          allowRfidEdit={true}
        />
      )}
    </>
  );
}