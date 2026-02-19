import React from "react";
import Navbar from "./Navbar";
import CardGrid from "./CardGrid";
const Dashboard = () => {
  return (
    <div className="min-h-screen  bg-gray-100">
      {/* Main Content */}

      <Navbar />
      {/* <div className=" bg-gray-100"> */}
      <CardGrid />
      {/* </div> */}
    </div>
  );
};

export default Dashboard;
