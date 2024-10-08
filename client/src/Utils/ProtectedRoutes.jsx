/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
const ProtectedRoutes = ({ isLoggedIn }) => {
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
