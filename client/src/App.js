import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// Components
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Hero from "./Components/Home";
import About from "./Components/About";
import Tracks from "./Components/Tracks";
import TrackDetail from "./Components/TrackDetail";
import Scholarship from "./Components/Scholarship";
import Testimonials from "./Components/Testimonials";
import Blog from "./Components/Blog";
import Events from "./Components/Events";
import FAQ from "./Components/FAQ";
import Contact from "./Components/Contact";
import Careers from "./Components/Careers";
import Admin from "./Components/Admin";
import AdminLogin from "./Components/Admin/AdminLogin";
import AdminDashboard from "./Components/Admin/AdminDashboard";

import CertificateForm from "./Components/CertificateForm";
import VerifyCertificate from "./Components/VerifyCertificate";

import StudentRegister from "./Components/StudentRegister";
import StudentLogin from "./Components/StudentLogin";
import StudentApply from "./Components/StudentApply";

// 🔒 Protected Route (admin)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin-login" replace />;
};

// Footer shows on every public page, but not inside the admin area
const FooterGate = () => {
  const { pathname } = useLocation();
  return pathname.startsWith("/admin") ? null : <Footer />;
};

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* HOME - the Navbar and Footer are rendered once, globally, by App. */}
        <Route path="/" element={<Hero />} />

        {/* PUBLIC ROUTES */}
        <Route path="/about" element={<About />} />
        <Route path="/tracks" element={<Tracks />} />
        <Route path="/tracks/:slug" element={<TrackDetail />} />
        <Route path="/scholarship" element={<Scholarship />} />
        {/* Old URLs keep working */}
        <Route path="/programs" element={<Navigate to="/tracks" replace />} />
        <Route path="/courses" element={<Navigate to="/tracks" replace />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/events" element={<Events />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* STUDENT ROUTES */}
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-apply" element={<StudentApply />} />

        {/* DASHBOARD */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* CERTIFICATE */}
        <Route path="/certificate-form" element={<CertificateForm />} />

        {/* FIXED VERIFY ROUTE */}
        <Route path="/verify" element={<VerifyCertificate />} />
        <Route path="/verify/:certId" element={<VerifyCertificate />} />
      </Routes>

      <FooterGate />
    </Router>
  );
}

export default App;
