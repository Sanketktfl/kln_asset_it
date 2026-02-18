import React from "react";

const AssetRow = ({ asset }) => {
  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="p-3">{asset.assetTagNo}</td>
      <td className="p-3">{asset.rfidNo}</td>
      <td className="p-3">{asset.assetNo}</td>
      <td className="p-3">{asset.modelNo}</td>
      <td className="p-3">{asset.serialNo}</td>
      <td className="p-3">{asset.plant}</td>
      <td className="p-3">{asset.location}</td>
      <td className="p-3">{asset.custodian}</td>
      <td className="p-3">{asset.mfgYear}</td>

      <td className="p-3">
        <span className={`px-2 py-1 rounded text-sm font-medium ${
          asset.verifiedStatus === "Verified"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}>
          {asset.verifiedStatus}
        </span>
      </td>

      <td className="p-3">
        <span className={`px-2 py-1 rounded text-sm font-medium ${
          asset.assetStatus === "Active"
            ? "bg-blue-100 text-blue-700"
            : "bg-red-100 text-red-700"
        }`}>
          {asset.assetStatus}
        </span>
      </td>
    </tr>
  );
};

export default AssetRow;
