import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// common components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// guest / public pages
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookRoom from "./pages/BookRoom";
import MyBookings from "./pages/MyBookings";
import MyInvoices from "./pages/MyInvoices";
import Services from "./pages/Services";
import GiveFeedback from "./pages/GiveFeedback";
import Profile from "./pages/Profile";

// admin pages
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import ManageRooms from "./admin/ManageRooms";
import ManageBookings from "./admin/ManageBookings";
import ManageUsers from "./admin/ManageUsers";
import ManageHousekeeping from "./admin/ManageHousekeeping";
import ManageInvoices from "./admin/ManageInvoices";
import ManageFeedback from "./admin/ManageFeedback";
import Notifications from "./admin/Notifications";
import SettingsPage from "./admin/SettingsPage";

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* public */}
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

        {/* guest routes (login required) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/book/:roomId" element={<BookRoom />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/my-invoices" element={<MyInvoices />} />
          <Route path="/services" element={<Services />} />
          <Route path="/feedback" element={<GiveFeedback />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* admin / staff routes */}
        <Route element={<ProtectedRoute roles={["admin", "staff"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="rooms" element={<ManageRooms />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="housekeeping" element={<ManageHousekeeping />} />
            <Route path="invoices" element={<ManageInvoices />} />
            <Route path="feedback" element={<ManageFeedback />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}
