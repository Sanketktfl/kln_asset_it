import React from "react";

const AssetRow = ({ asset, index }) => {

  const verifiedStyle =
    asset.verifiedStatus === "Verified"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  const statusStyle =
    asset.assetStatus === "Active"
      ? "bg-blue-100 text-blue-700"
      : "bg-red-100 text-red-700";

  return (
    <tr className={`
      border-b transition duration-200 hover:bg-blue-50
      ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
    `}>

      <td className="p-4 font-medium text-gray-800">
        {asset.assetTagNo}
      </td>

      <td className="p-4 text-gray-600">
        {asset.rfidNo}
      </td>

      <td className="p-4 text-gray-600">
        {asset.assetNo}
      </td>

      <td className="p-4 text-gray-600">
        {asset.modelNo}
      </td>

      <td className="p-4 text-gray-600">
        {asset.serialNo}
      </td>

      <td className="p-4 text-gray-600">
        {asset.plant}
      </td>

      <td className="p-4 text-gray-600">
        {asset.location}
      </td>

      <td className="p-4 text-gray-600">
        {asset.custodian}
      </td>

      <td className="p-4 text-gray-600">
        {asset.mfgYear}
      </td>

      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${verifiedStyle}`}>
          {asset.verifiedStatus}
        </span>
      </td>

      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle}`}>
          {asset.assetStatus}
        </span>
      </td>

    </tr>
  );
};

export default AssetRow;
