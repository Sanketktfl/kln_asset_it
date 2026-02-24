import React, { useState } from "react";


/* ─── CONFIG ─────────────────────────────────────────────── */
const STATUS_CONFIG = {
  Working:         { bg: "#dcfce7", color: "#16a34a", dot: "#22c55e" },
  "Under Utilise": { bg: "#fef9c3", color: "#a16207", dot: "#eab308" },
  Idle:            { bg: "#fee2e2", color: "#dc2626", dot: "#ef4444" },
};
const PLANT_COLORS = {
  Mundhwa: "#3b82f6", Baramati: "#8b5cf6", R1: "#0ea5e9", R2: "#f59e0b",
};

/* ─── ICONS ──────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg width="1.1vw" height="1.1vw" style={{ minWidth: "14px", minHeight: "14px" }}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const LayersIcon = () => (
  <svg width="1.4vw" height="1.4vw" style={{ minWidth: "16px", minHeight: "16px" }}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
);

/* ─── STAT CARD ──────────────────────────────────────────── */
const StatCard = ({ label, value, accent, emoji }) => (
  <div style={{
    background: "white",
    borderRadius: "clamp(10px, 1vw, 16px)",
    padding: "clamp(12px, 1.4vw, 22px) clamp(14px, 1.6vw, 26px)",
    border: "1px solid #e8eef6",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    display: "flex", alignItems: "center",
    gap: "clamp(10px, 1vw, 16px)",
    flex: "1 1 0", minWidth: "clamp(120px, 12vw, 180px)"
  }}>
    <div style={{
      width: "clamp(36px, 3.2vw, 48px)", height: "clamp(36px, 3.2vw, 48px)",
      borderRadius: "clamp(8px, 0.8vw, 14px)",
      background: accent + "18",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "clamp(16px, 1.4vw, 22px)", flexShrink: 0
    }}>
      {emoji}
    </div>
    <div>
      <div style={{ fontSize: "clamp(18px, 2vw, 28px)", fontWeight: "800", color: "#0f172a", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "clamp(9px, 0.75vw, 12px)", color: "#94a3b8", fontWeight: "600", marginTop: "3px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
    </div>
  </div>
);

/* ─── STATUS BADGE ───────────────────────────────────────── */
const StatusBadge = ({ value }) => {
  const cfg = STATUS_CONFIG[value] || { bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      gap: "clamp(3px, 0.4vw, 6px)",
      padding: "clamp(2px, 0.3vh, 5px) clamp(6px, 0.7vw, 12px)",
      borderRadius: "20px", background: cfg.bg, color: cfg.color,
      fontSize: "clamp(9px, 0.75vw, 12px)", fontWeight: "700",
      minWidth: "clamp(90px, 8vw, 120px)",   // 🔥 width of "Under Utilise"
      boxSizing: "border-box", whiteSpace: "nowrap"
    }}>
      <span style={{
        width: "clamp(5px, 0.5vw, 8px)", height: "clamp(5px, 0.5vw, 8px)",
        borderRadius: "50%", background: cfg.dot,
        display: "inline-block", flexShrink: 0
      }} />
      {value}
    </span>
  );
};

/* ─── RFID CHIP ──────────────────────────────────────────── */
const RfidChip = ({ value }) => {
  if (!value) return <span style={{ color: "#cbd5e1", fontSize: "clamp(9px, 0.75vw, 12px)", fontStyle: "italic" }}>Not scanned</span>;
  const short = value.length > 16 ? value.slice(-16) : value;
  return (
    <span title={value} style={{
      fontFamily: "monospace",
      fontSize: "clamp(9px, 0.75vw, 12px)",
      color: "#475569", background: "#f1f5f9",
      padding: "clamp(2px, 0.2vh, 4px) clamp(4px, 0.4vw, 8px)",
      borderRadius: "clamp(3px, 0.3vw, 6px)",
      border: "1px solid #e2e8f0",
      display: "inline-block", maxWidth: "clamp(100px, 11vw, 180px)",
      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
    }}>
      …{short}
    </span>
  );
};

/* ─── PLANT PILL ─────────────────────────────────────────── */
const PlantPill = ({ value }) => {
  const color = PLANT_COLORS[value] || "#64748b";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      gap: "clamp(3px, 0.4vw, 6px)",
      padding: "clamp(2px, 0.25vh, 4px) clamp(6px, 0.65vw, 10px)",
      borderRadius: "clamp(8px, 0.8vw, 14px)",
      background: color + "15", color,
      fontSize: "clamp(9px, 0.8vw, 13px)", fontWeight: "700",
      minWidth: "clamp(72px, 6.5vw, 100px)",  // 🔥 width of "Baramati"
      boxSizing: "border-box"
    }}>
      <span style={{
        width: "clamp(4px, 0.45vw, 7px)", height: "clamp(4px, 0.45vw, 7px)",
        borderRadius: "50%", background: color,
        display: "inline-block", flexShrink: 0
      }} />
      {value}
    </span>
  );
};

/* ─── VERIFIED DATE ──────────────────────────────────────── */
const VerifiedDate = ({ value }) => {
  if (!value) return <span style={{ color: "#cbd5e1", fontSize: "clamp(9px, 0.75vw, 12px)", fontStyle: "italic" }}>Not verified</span>;
  return (
    <span style={{ fontSize: "clamp(9px, 0.8vw, 13px)", color: "#0369a1", fontWeight: "600" }}>
      {value}
    </span>
  );
};

/* ─── AVATAR ─────────────────────────────────────────────── */
const Avatar = ({ name }) => {
  if (!name) return <span style={{ color: "#cbd5e1" }}>—</span>;
  return (
    <span style={{ fontSize: "clamp(9px, 0.8vw, 13px)", color: "#334155", whiteSpace: "nowrap" }}>
      {name}
    </span>
  );
};

/* ─── TH ─────────────────────────────────────────────────── */
const TH = ({ children, mandatory }) => (
  <th style={{
    padding: "clamp(7px, 0.7vh, 12px) clamp(8px, 1vw, 16px)",
    textAlign: "left",
    fontSize: "clamp(9px, 0.72vw, 11.5px)",
    fontWeight: "700", color: "#64748b",
    textTransform: "uppercase", letterSpacing: "0.5px",
    whiteSpace: "nowrap", background: "#f8fafc",
    borderBottom: "2px solid #e8eef6"
  }}>
    {children}
    {mandatory && (
      <span title="Mandatory" style={{ color: "#ef4444", marginLeft: "3px", fontSize: "clamp(9px, 0.8vw, 12px)" }}>*</span>
    )}
  </th>
);

/* ─── ASSET ROW ──────────────────────────────────────────── */
const AssetRow = ({ asset, index }) => {
  const [hovered, setHovered] = useState(false);

  const cellStyle = {
    padding: "clamp(7px, 0.75vh, 13px) clamp(8px, 1vw, 16px)",
    verticalAlign: "middle", whiteSpace: "nowrap",
    borderBottom: "1px solid #f1f5f9"
  };

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#eff6ff" : index % 2 === 0 ? "#ffffff" : "#fafbfd",
        transition: "background 0.12s ease"
      }}
    >
      <td style={cellStyle}>
        <span style={{ fontWeight: "800", color: "#0f172a", fontSize: "clamp(10px, 0.9vw, 14px)", fontFamily: "monospace" }}>
          {asset.assetTagNo}
        </span>
      </td>
      <td style={cellStyle}><RfidChip value={asset.rfidNo} /></td>
      <td style={cellStyle}>
        <span style={{ fontFamily: "monospace", fontSize: "clamp(9px, 0.8vw, 13px)", color: "#475569" }}>
          {asset.assetNo || "—"}
        </span>
      </td>
      <td style={cellStyle}>
        <span style={{ fontWeight: "600", color: "#334155", fontSize: "clamp(9px, 0.8vw, 13px)" }}>
          {asset.modelNo || "—"}
        </span>
      </td>
      <td style={cellStyle}>
        <span style={{
          fontFamily: "monospace", fontSize: "clamp(9px, 0.75vw, 12px)", color: "#64748b",
          background: "#f8fafc", padding: "clamp(1px, 0.2vh, 3px) clamp(4px, 0.4vw, 7px)",
          borderRadius: "clamp(3px, 0.3vw, 5px)", border: "1px solid #e2e8f0"
        }}>
          {asset.serialNo || "—"}
        </span>
      </td>
      <td style={cellStyle}><PlantPill value={asset.plant} /></td>
      <td style={cellStyle}>
        <span style={{ fontSize: "clamp(9px, 0.8vw, 13px)", color: "#475569", fontWeight: "600" }}>
          {asset.location || <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>—</span>}
        </span>
      </td>
      <td style={cellStyle}><Avatar name={asset.custodian} /></td>
      <td style={{ ...cellStyle, textAlign: "center" }}>
        <span style={{ fontWeight: "700", color: "#64748b", fontSize: "clamp(9px, 0.8vw, 13px)" }}>
          {asset.mfgYear || "—"}
        </span>
      </td>
      <td style={cellStyle}><VerifiedDate value={asset.verifiedDate} /></td>
      <td style={cellStyle}><StatusBadge value={asset.assetStatus} /></td>
    </tr>
  );
};

/* ─── MAIN DASHBOARD ─────────────────────────────────────── */
export default function MainDashboard() {

  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [plantFilter, setPlantFilter] = useState("All");

  // 🔥 Fetch real data
  React.useEffect(() => {
    fetch("http://localhost:8080/api/v1/collection/kln_asset_master")
      .then(res => res.json())
      .then(data => {

        const formatted = (data.objects || []).map(item => ({
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
          assetStatus: item.asset_status
        }));

        setAssets(formatted);
      })
      .catch(err => {
        console.error("API Error:", err);
      });
  }, []);

  // 🔥 Use real assets
  const plants = ["All", ...Array.from(new Set(assets.map(a => a.plant)))];
  const statuses = ["All", "Working", "Under Utilise", "Idle"];

  const filtered = assets.filter(a => {
    const matchSearch = Object.values(a).some(v =>
      String(v).toLowerCase().includes(search.toLowerCase())
    );
    const matchStatus = statusFilter === "All" || a.assetStatus === statusFilter;
    const matchPlant  = plantFilter === "All" || a.plant === plantFilter;
    return matchSearch && matchStatus && matchPlant;
  });

  const counts = {
    total: assets.length,
    working: assets.filter(a => a.assetStatus === "Working").length,
    underUtilise: assets.filter(a => a.assetStatus === "Under Utilise").length,
    idle: assets.filter(a => a.assetStatus === "Idle").length,
    scanned: assets.filter(a => a.rfidNo).length,
  };
  const selectStyle = {
    padding: "clamp(4px, 0.5vh, 8px) clamp(8px, 0.8vw, 14px)",
    borderRadius: "clamp(6px, 0.6vw, 10px)",
    border: "1px solid #e2e8f0",
    fontSize: "clamp(9px, 0.75vw, 12px)",
    color: "#334155", background: "white",
    cursor: "pointer", fontWeight: "600", outline: "none"
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#f0f4ff 0%,#f8fafc 60%,#f0fdf4 100%)",
      fontFamily: "'Segoe UI',system-ui,sans-serif"
    }}>

      {/* ── HEADER ── */}
      <div style={{
        background: "linear-gradient(90deg,#0c4a6e 0%,#0369a1 50%,#0284c7 100%)",
        height: "clamp(48px, 5vh, 64px)",
        padding: "0 clamp(16px, 2vw, 32px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 4px 18px rgba(3,105,161,0.4)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 0.9vw, 14px)" }}>
          <div style={{
            background: "rgba(255,255,255,0.18)",
            borderRadius: "clamp(7px, 0.7vw, 12px)",
            padding: "clamp(5px, 0.5vw, 8px)",
            display: "flex"
          }}>
            <LayersIcon />
          </div>
          <div>
            <div style={{ color: "white", fontWeight: "800", fontSize: "clamp(13px, 1.2vw, 18px)", letterSpacing: "-0.3px" }}>
              Asset Management System
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(9px, 0.75vw, 12px)" }}>
              RFID · Track · Audit
            </div>
          </div>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.14)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: "clamp(6px, 0.6vw, 10px)",
          padding: "clamp(4px, 0.4vh, 7px) clamp(10px, 1vw, 16px)",
          color: "white", fontSize: "clamp(9px, 0.75vw, 12px)", fontWeight: "600"
        }}>
          New Assets
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{
        padding: "clamp(14px, 2vh, 28px) clamp(14px, 2vw, 30px)",
        maxWidth: "100%", margin: "0 auto"
      }}>

        {/* Page title */}
        <div style={{
          marginBottom: "clamp(12px, 1.6vh, 22px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "clamp(6px, 0.6vw, 10px)"
        }}>

          <div>
            <h2 style={{
              margin: 0,
              fontSize: "clamp(15px, 1.5vw, 22px)",
              fontWeight: "800",
              color: "#0f172a",
              letterSpacing: "-0.4px"
            }}>
              Asset Registry
            </h2>

            <p style={{
              margin: "3px 0 0",
              fontSize: "clamp(9px, 0.75vw, 12px)",
              color: "#94a3b8",
              fontWeight: "500"
            }}>
              Track and manage all RFID-tagged assets across plants
            </p>
          </div>

          {/* 🔥 Mandatory label on right */}
          <div style={{
            background: "#fee2e2",
            color: "#b91c1c",
            padding: "clamp(4px, 0.4vh, 7px) clamp(8px, 0.8vw, 14px)",
            borderRadius: "clamp(6px, 0.6vw, 10px)",
            fontSize: "clamp(9px, 0.75vw, 12px)",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            border: "1px solid #fecaca"
          }}>
            <span>*</span> Mandatory Fields
          </div>

        </div>

        {/* Stat cards */}
        <div style={{ display: "flex", gap: "clamp(8px, 0.9vw, 14px)", marginBottom: "clamp(12px, 1.6vh, 22px)", flexWrap: "wrap" }}>
          <StatCard label="Total Assets"   value={counts.total}        accent="#3b82f6" emoji="📦" />
          <StatCard label="Working"        value={counts.working}      accent="#16a34a" emoji="✅" />
          <StatCard label="Under Utilise"  value={counts.underUtilise} accent="#d97706" emoji="⚠️" />
          <StatCard label="Idle"           value={counts.idle}         accent="#dc2626" emoji="🔴" />
          <StatCard label="RFID Scanned"   value={counts.scanned}      accent="#0ea5e9" emoji="📡" />
        </div>

        {/* Table card */}
        <div style={{
          background: "white",
          borderRadius: "clamp(10px, 1vw, 18px)",
          border: "1px solid #e8eef6",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          overflow: "hidden"
        }}>

          {/* Toolbar */}
          <div style={{
            padding: "clamp(8px, 1vh, 16px) clamp(10px, 1.2vw, 20px)",
            borderBottom: "1px solid #f1f5f9",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: "clamp(8px, 0.9vw, 14px)", flexWrap: "wrap",
            background: "linear-gradient(135deg,#ffffff,#f8faff)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(6px, 0.7vw, 12px)" }}>
              <span style={{ fontWeight: "700", fontSize: "clamp(11px, 1vw, 16px)", color: "#0f172a" }}>Asset Records</span>
              <span style={{
                background: "#dbeafe", color: "#1d4ed8",
                fontSize: "clamp(9px, 0.7vw, 12px)", fontWeight: "700",
                padding: "clamp(1px, 0.2vh, 3px) clamp(6px, 0.6vw, 10px)",
                borderRadius: "20px"
              }}>
                {filtered.length} results
              </span>
            </div>

            <div style={{ display: "flex", gap: "clamp(6px, 0.6vw, 10px)", alignItems: "center", flexWrap: "wrap" }}>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
                {statuses.map(s => <option key={s}>{s}</option>)}
              </select>
              <select value={plantFilter} onChange={e => setPlantFilter(e.target.value)} style={selectStyle}>
                {plants.map(p => <option key={p}>{p}</option>)}
              </select>

              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: "clamp(7px, 0.6vw, 10px)",
                  top: "50%", transform: "translateY(-50%)",
                  color: "#94a3b8", display: "flex"
                }}>
                  <SearchIcon />
                </span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search any field…"
                  style={{
                    paddingLeft: "clamp(24px, 2vw, 32px)",
                    paddingRight: "clamp(8px, 0.8vw, 14px)",
                    paddingTop: "clamp(5px, 0.5vh, 8px)",
                    paddingBottom: "clamp(5px, 0.5vh, 8px)",
                    borderRadius: "clamp(7px, 0.7vw, 11px)",
                    border: "1px solid #e2e8f0",
                    fontSize: "clamp(9px, 0.75vw, 12px)",
                    color: "#334155", outline: "none",
                    background: "#f8fafc",
                    width: "clamp(130px, 14vw, 220px)"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "clamp(9px, 0.8vw, 13px)" }}>
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
                  <TH mandatory>Asset Status</TH>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0
                  ? filtered.map((asset, i) => <AssetRow key={i} asset={asset} index={i} />)
                  : (
                    <tr>
                      <td colSpan={11} style={{ textAlign: "center", padding: "clamp(24px, 5vh, 52px)", color: "#94a3b8" }}>
                        <div style={{ fontSize: "clamp(20px, 2.5vw, 34px)", marginBottom: "clamp(4px, 0.8vh, 10px)" }}>🔍</div>
                        <div style={{ fontSize: "clamp(11px, 1vw, 15px)", fontWeight: "600" }}>No assets found</div>
                        <div style={{ fontSize: "clamp(9px, 0.8vw, 13px)", marginTop: "4px" }}>Try adjusting your search or filters</div>
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{
            padding: "clamp(7px, 0.8vh, 12px) clamp(10px, 1.2vw, 20px)",
            borderTop: "1px solid #f1f5f9",
            background: "#fafbfd",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap",
            gap: "clamp(6px, 0.6vw, 10px)"
          }}>
            <span style={{ fontSize: "clamp(9px, 0.7vw, 12px)", color: "#94a3b8", fontWeight: "500" }}>
              Showing {filtered.length} of {assets.length} assets
            </span>
            <div style={{ display: "flex", gap: "clamp(4px, 0.5vw, 8px)", flexWrap: "wrap" }}>
              {["Working","Under Utilise","Idle"].map(s => {
                const cfg = STATUS_CONFIG[s];
                return (
                  <span key={s} style={{
                    fontSize: "clamp(9px, 0.7vw, 12px)",
                    padding: "clamp(2px, 0.25vh, 4px) clamp(6px, 0.7vw, 11px)",
                    borderRadius: "clamp(8px, 0.8vw, 14px)",
                    background: cfg.bg, color: cfg.color, fontWeight: "700"
                  }}>
                    {assets.filter(a => a.assetStatus === s).length} {s}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}