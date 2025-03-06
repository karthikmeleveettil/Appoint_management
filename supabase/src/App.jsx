import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppointmentManagementUI from "./Components/Appointmanagement";
import LoginSignupPage from "./Components/login";
import AddAppointmentPage from "./Components/Createappointment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignupPage />} />
        <Route path="/login" element={<LoginSignupPage />} /> {/* ✅ Fixed login route */}
        <Route path="/appointments" element={<AppointmentManagementUI />} />
        <Route path="/add-appointment" element={<AddAppointmentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
