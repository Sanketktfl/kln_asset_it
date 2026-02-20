import React from "react";
import AssetRow from "./AssetRow";

const AssetTable = ({ assets }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">

      <div className="px-6 py-4 border-b bg-gray-50 rounded-t-xl">
        <h3 className="text-lg font-semibold text-gray-700">
          Asset Records
        </h3>
      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full text-sm">

          <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0">
            <tr>
              <th className="p-4 text-left">Asset Tag</th>
              <th className="p-4 text-left">RFID</th>
              <th className="p-4 text-left">Asset No</th>
              <th className="p-4 text-left">Model</th>
              <th className="p-4 text-left">Serial</th>
              <th className="p-4 text-left">Plant</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Custodian</th>
              <th className="p-4 text-left">Year</th>
              <th className="p-4 text-left">Verified</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {assets.map((asset, index) => (
              <AssetRow
                key={index}
                asset={asset}
                index={index}
              />
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AssetTable;
