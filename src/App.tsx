import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Provider
import { WebSocketProvider } from "@/context/WebSocketContext";

// Layouts
import AuthLayout from "@/layouts/AuthLayout";
import { AdminLayout } from "@/layouts/AdminLayout";

// Route Guards
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import PersistLogin from "@/components/shared/PersistLogin";
import AdminRoute from "@/components/shared/AdminRoute";

// Pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import UnauthorizedPage from "@/pages/error/UnauthorizedPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import BuildingListPage from "@/pages/buildings/BuildingListPage";
import BuildingFormPage from "@/pages/buildings/BuildingFormPage";
import RoomListPage from "@/pages/rooms/RoomListPage";
import RoomFormPage from "@/pages/rooms/RoomFormPage";
import TenantListPage from "@/pages/tenants/TenantListPage";
import TenantFormPage from "@/pages/tenants/TenantFormPage";
import ContractListPage from "@/pages/contracts/ContractListPage";
import ContractFormPage from "@/pages/contracts/ContractFormPage";
import ContractDetailPage from "@/pages/contracts/ContractDetailPage";
import MeterReadingPage from "@/pages/meter-readings/MeterReadingPage";
import MeterReadingHistoryPage from "@/pages/meter-readings/MeterReadingHistoryPage";
import IncidentListPage from "@/pages/incidents/IncidentListPage";
import InvoiceListPage from "@/pages/invoices/InvoiceListPage";
import InvoiceDetailPage from "@/pages/invoices/InvoiceDetailPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import UserRequestListPage from "@/pages/requests/UserRequestListPage";


function App() {
  return (
    <WebSocketProvider>
      <Routes>
        {/* --- Public Routes --- */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* --- Error Route --- */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* --- Protected Routes --- */}
        <Route element={<PersistLogin />}>
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminRoute />}>
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
                <Route path="/contracts/requests" element={<UserRequestListPage />} />
                <Route path="/meter-readings" element={<MeterReadingPage />} />
                <Route path="/meter-readings/history/:roomId" element={<MeterReadingHistoryPage />} />
                <Route path="/incidents" element={<IncidentListPage />} />
                <Route path="/invoices" element={<InvoiceListPage />} />
                <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Route>
        </Route>

        {/* --- Fallback Route --- */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </WebSocketProvider>
  );
}

export default App;