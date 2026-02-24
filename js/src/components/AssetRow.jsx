import React from "react";

const AssetRow = ({ asset }) => {
  return (
    <tr className="border-b hover:bg-blue-50 transition duration-200">

      <td className="p-4 font-medium text-gray-700">
        {asset.cdb_object_id}
      </td>

      <td className="p-4">
        {asset.plant}
      </td>

      <td className="p-4">
        {asset.location}
      </td>

      <td className="p-4">
        {asset.custodian}
      </td>

    </tr>
  );
};

export default AssetRow;