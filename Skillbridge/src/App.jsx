import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastProvider } from "./components/ToastContext";
import ToastContainer from "./components/ToastContainer";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

import WorkerDashboard from "./pages/WorkerDashboard";
import WorkerProfile from "./pages/WorkerProfile";
import CustomerDashboard from "./pages/CustomerDashboard";
import WorkerPublicProfile from "./pages/WorkerPublicProfile";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />

        <div className="flex flex-col min-h-screen">
          <Header />

          <div className="flex-1">
            <Routes>
              {/* Public pages */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Worker Routes */}
              <Route path="/worker/dashboard" element={<WorkerDashboard />} />
              <Route path="/worker/profile" element={<WorkerProfile />} />

              {/* Protected Customer Routes */}
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />

              {/* Public Worker Profile */}
              <Route
                path="/workers/:workerId"
                element={<WorkerPublicProfile />}
              />

              {/* Protected User Routes */}
              <Route path="/settings" element={<Settings />} />
              <Route path="/messages" element={<Messages />} />
            </Routes>
          </div>

          <Footer />
        </div>

        <ToastContainer />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;