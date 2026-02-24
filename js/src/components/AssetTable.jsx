import React from "react";
import AssetRow from "./AssetRow";

const AssetTable = ({ assets }) => {
  if (assets.length === 0) {
    return (
      <div className="bg-white p-10 rounded-lg shadow text-center text-gray-500">
        No assets found.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border">

      <table className="min-w-full text-sm text-left">

        <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs uppercase tracking-wider">
          <tr>
            <th className="p-4">Object ID</th>
            <th className="p-4">Plant</th>
            <th className="p-4">Location</th>
            <th className="p-4">Custodian</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {assets.map((asset) => (
            <AssetRow
              key={asset.cdb_object_id}
              asset={asset}
            />
          ))}
        </tbody>

      </table>

    </div>
  );
};

export default AssetTable;