import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthLayout from "@/layouts/AuthLayout";
import { AdminLayout } from "@/layouts/AdminLayout";

import ProtectedRoute from "@/components/shared/ProtectedRoute";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import BuildingListPage from "@/pages/buildings/BuildingListPage";
import BuildingFormPage from "@/pages/buildings/BuildingFormPage";
import RoomListPage from "@/pages/rooms/RoomListPage";
import RoomFormPage from "@/pages/rooms/RoomFormPage";
import TenantFormPage from "@/pages/tenants/TenantFormPage";
import TenantListPage from "@/pages/tenants/TenantListPage";
import ContractFormPage from "@/pages/contracts/ContractFormPage";
import ContractListPage from "@/pages/contracts/ContractListPage";
import ContractDetailPage from "@/pages/contracts/ContractDetailPage";
import MeterReadingHistoryPage from "@/pages/meter-readings/MeterReadingHistoryPage";
import MeterReadingPage from "@/pages/meter-readings/MeterReadingPage";
import IncidentListPage from "@/pages/incidents/IncidentListPage";
import PersistLogin from "@/components/shared/PersistLogin";

function App() {
  return (
    <>
      <Routes>
        {/* Nhóm các route xác thực vào AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Thêm các route khác như /forgot-password ở đây */}
        </Route>

        <Route element={<PersistLogin />}>
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/buildings" element={<BuildingListPage />} />
              <Route path="/buildings/add" element={<BuildingFormPage />} />
              <Route path="/buildings/edit/:id" element={<BuildingFormPage />} />
              <Route path="/rooms" element={<RoomListPage />} />
              <Route path="/rooms/add" element={<RoomFormPage />} />
              <Route path="/rooms/edit/:id" element={<RoomFormPage />} />
              <Route path="/tenants" element={<TenantListPage />} />
              <Route path="/tenants/add" element={<TenantFormPage />} />
              <Route path="/tenants/edit/:id" element={<TenantFormPage />} />
              <Route path="/contracts" element={<ContractListPage />} />
              <Route path="/contracts/add" element={<ContractFormPage />} />
              <Route path="/contracts/:id" element={<ContractDetailPage />} />
              <Route path="/meter-readings" element={<MeterReadingPage />} />
              <Route path="/meter-readings/history/:roomId" element={<MeterReadingHistoryPage />} />
              <Route path="/incidents" element={<IncidentListPage />} />

            </Route>
          </Route>
        </Route>

        {/* Route mặc định: chuyển hướng về /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000} // Tự động đóng sau 5 giây
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Hoặc "light", "dark"
      />
    </>
  );
}

export default App;