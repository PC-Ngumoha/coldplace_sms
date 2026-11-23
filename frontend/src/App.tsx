import { Routes, Route, useNavigate, useLocation } from "react-router";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import GuestRoute from "./components/routes/GuestRoute";
import {
  Home,
  Login,
  AuditLogs,
  Adjustments,
  Dashboard,
  NotFound,
  Products,
  Received,
  ReceivedLinesDetails,
  Transfers,
  Sales,
  Damages,
  Pricing,
  Reports,
  Settings,
  ManageUsers,
  ManageLocations,
  ManageSuppliers,
  AdminChangePassword,
  UserChangePassword,
  Suppliers,
  Customers,
  UserProfile,
} from "@/pages";
import { useAuth } from "@/contexts/auth_context";
import { RequirePermission } from "@/components/permissions";
import { useEffect } from "react";

export default function App() {
  const { user: currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // Keep track of previous page when opening modal route
  const background = location.state?.background;
  const mustChange = currentUser?.must_change_password;

  // Detect if a user is still using an admin issued password
  const CHANGE_PASSWORD_PATH = "/edit/users/me/changePassword";
  useEffect(() => {
    if (mustChange && location.pathname !== CHANGE_PASSWORD_PATH) {
      navigate(CHANGE_PASSWORD_PATH, {
        state: {
          background: location,
          mustChangePassword: true,
        },
        replace: true,
      });
    }
  }, [mustChange, location, navigate]);

  return (
    <>
      <Routes location={background || location}>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Home />}>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/products"
              element={
                <RequirePermission permission="products:list">
                  <Products />
                </RequirePermission>
              }
            />
            <Route
              path="/received"
              element={
                <RequirePermission permission="receipts:list">
                  <Received />
                </RequirePermission>
              }
            />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/damage" element={<Damages />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/reports" element={<Reports />} />
            <Route
              path="/settings"
              element={
                <RequirePermission permission="settings:view">
                  <Settings />
                </RequirePermission>
              }
            />
            <Route
              path="/logs"
              element={
                <RequirePermission permission="audit:view">
                  <AuditLogs />
                </RequirePermission>
              }
            />
            <Route path="/adjustments" element={<Adjustments />} />
            <Route
              path="/suppliers"
              element={
                <RequirePermission permission="suppliers:view">
                  <Suppliers />
                </RequirePermission>
              }
            />
            <Route path="/customers" element={<Customers />} />
            <Route path="/me" element={<UserProfile />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Modal routes: Add User, Edit User, Add Location, Edit Location */}
      {background && (
        <Routes>
          <Route path="/add/users" element={<ManageUsers />} />
          <Route path="/edit/users/:id" element={<ManageUsers />} />
          <Route
            path="/edit/users/:id/changePassword"
            element={<AdminChangePassword />}
          />
          <Route
            path="/edit/users/me/changePassword"
            element={<UserChangePassword />}
          />
          <Route path="/add/locations" element={<ManageLocations />} />
          <Route path="/edit/locations/:id" element={<ManageLocations />} />
          <Route path="/add/suppliers" element={<ManageSuppliers />} />
          <Route path="/edit/suppliers/:id" element={<ManageSuppliers />} />
          <Route
            path="/received/details/:id"
            element={<ReceivedLinesDetails />}
          />
        </Routes>
      )}
    </>
  );
}
