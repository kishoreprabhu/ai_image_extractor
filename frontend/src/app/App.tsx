import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

import LoginPage from "../pages/Login";
import DashboardPage from "../pages/Receipts";


import "antd/dist/reset.css"; 

function App() {
  return (
    <Router>
      <Routes>
         {/* by default replacing path to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>} />
        </Route>

        <Route element={<DashboardLayout/>}>
          <Route path="/receipts" element={
            <ProtectedRoute>
                <DashboardPage/>
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
