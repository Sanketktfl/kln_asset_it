import React from "react";
import Header from "../components/Header";
import AssetTable from "../components/AssetTable";
import dummyAssets from "../data/dummyAssets";
import "../index.css";


class MainDashboard extends React.Component {

  render() {
    return (
      <div className="min-h-screen bg-gray-100">

        <Header />

        <div className="p-6">

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Asset List
            </h2>
          </div>

          <AssetTable assets={dummyAssets} />

        </div>

      </div>
    );
  }

}

export default MainDashboard;
