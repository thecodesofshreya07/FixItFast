import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Book from "./pages/Book";
import Bookings from "./pages/Bookings";
import Payment from "./pages/Payment";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

// Separate so Navbar can use useLocation (inside BrowserRouter)
function AppRoutes() {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <Routes>
          {/* Public routes */}
          <Route path="/"        element={<Home />}     />
          <Route path="/services" element={<Services />} />
          <Route path="/login"   element={<Login />}    />
          <Route path="/signup"  element={<Signup />}   />

          {/* Protected routes — redirect to /login if not logged in */}
          <Route path="/book" element={
            <ProtectedRoute><Book /></ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute><Bookings /></ProtectedRoute>
          } />
          <Route path="/payment" element={
            <ProtectedRoute><Payment /></ProtectedRoute>
          } />
        </Routes>
      </div>
    </>
  );
}

export default App;
