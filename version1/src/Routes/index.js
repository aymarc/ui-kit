import React from "react";
import { Routes, Route } from "react-router-dom";
import SelectMatrix from "../components/SelectMatrix";

const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route exact path="/" element={Home} /> */}
      <Route path="/select-matrix" element={SelectMatrix} />
    </Routes>
  );
};

export default AppRoutes;
