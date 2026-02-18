import React from "react";
import AssetRow from "./AssetRow";

const AssetTable = ({ assets }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">

      <table className="min-w-full text-sm text-left">

        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="p-3">Asset Tag No</th>
            <th className="p-3">RFID No</th>
            <th className="p-3">Asset No</th>
            <th className="p-3">Model No</th>
            <th className="p-3">Serial No</th>
            <th className="p-3">Plant</th>
            <th className="p-3">Location</th>
            <th className="p-3">Custodian</th>
            <th className="p-3">Mfg Year</th>
            <th className="p-3">Verified Status</th>
            <th className="p-3">Asset Status</th>
          </tr>
        </thead>

        <tbody>
          {assets.map((asset, index) => (
            <AssetRow key={index} asset={asset} />
          ))}
        </tbody>

      </table>

    </div>
  );
};

export default AssetTable;
