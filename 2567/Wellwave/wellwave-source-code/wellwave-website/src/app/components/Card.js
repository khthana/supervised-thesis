import React from "react";

const Card = ({ title, count, children }) => {
  return (
    <div className="card bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-2xl font-semibold text-blue-500">{count}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
};

export default Card;
