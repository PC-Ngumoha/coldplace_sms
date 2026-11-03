import { Routes, Route } from "react-router";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import GuestRoute from "./components/routes/GuestRoute";
import {
  Home,
  Login,
  Dashboard,
  NotFound,
  Products,
  Receiving,
  Transfers,
  Sales,
  Damages,
  Pricing,
  Reports,
  Settings,
  ManageUsers,
  ManageLocations,
} from "@/pages";
import { useLocation } from "react-router";

export default function App() {
  const location = useLocation();
  // Keep track of previous page when opening modal route
  const background = location.state?.background;

  return (
    <>
      <Routes location={background || location}>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Home />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/receiving" element={<Receiving />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/damage" element={<Damages />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Modal routes: Add User, Edit User, Add Location, Edit Location */}
      {background && (
        <Routes>
          <Route path="/add/users" element={<ManageUsers />} />
          <Route path="/edit/users/:id" element={<ManageUsers />} />
          <Route path="/add/locations" element={<ManageLocations />} />
          <Route path="/edit/locations/:id" element={<ManageLocations />} />
        </Routes>
      )}
    </>
  );
}
