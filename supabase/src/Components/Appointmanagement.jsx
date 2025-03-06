import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AppointmentManagementUI = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation

  // State variables
  const [allAppointments, setAllAppointments] = useState([]);
  const [singleAppointment, setSingleAppointment] = useState(null);
  const [allTreatments, setAllTreatments] = useState([]);
  const [appointmentId, setAppointmentId] = useState("");
  const [activeView, setActiveView] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Fetch all appointments
  const fetchAllAppointments = async () => {
    setLoading(true);
    setError(null);
    setActiveView("allAppointments");

    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("id, user_id(full_name), appointment_date, status");

      if (error) throw error;

      const formattedData = data.map((appointment) => ({
        id: appointment.id,
        patientName: appointment.user_id?.full_name || "Unknown",
        date: new Date(appointment.appointment_date).toISOString().split("T")[0],
        status: appointment.status,
      }));

      setAllAppointments(formattedData);
    } catch (error) {
      console.error("Supabase Error:", error);
      setError(error.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch single appointment by ID
  const fetchSingleAppointment = async () => {
    if (!appointmentId) {
      setError("Please enter an appointment ID");
      return;
    }

    setLoading(true);
    setError(null);
    setActiveView("singleAppointment");

    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*, user_id!inner(full_name), staff_id!inner(role, specialty)")
        .eq("id", appointmentId)
        .single();

      if (error) throw error;

      const formattedData = {
        id: data.id,
        patientName: data.user_id.full_name,
        date: new Date(data.appointment_date).toISOString().split("T")[0],
        time: new Date(data.appointment_date).toLocaleTimeString(),
        duration: "60 minutes",
        status: data.status,
        treatment: data.notes,
        notes: data.notes,
        doctor: `${data.staff_id.role} (${data.staff_id.specialty})`,
        room: "B-103",
      };

      setSingleAppointment(formattedData);
    } catch (error) {
      console.error("Supabase Error:", error);
      setError(error.message || "Failed to fetch appointment details");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch all treatments
  const fetchAllTreatments = async () => {
    setLoading(true);
    setError(null);
    setActiveView("allTreatments");

    try {
      const { data, error } = await supabase.from("treatments").select("*");

      if (error) throw error;

      const formattedData = data.map((treatment) => ({
        id: treatment.id,
        name: treatment.name,
        duration: treatment.duration,
        cost: `$${treatment.cost}`,
        description: treatment.description,
      }));

      setAllTreatments(formattedData);
    } catch (error) {
      console.error("Supabase Error:", error);
      setError(error.message || "Failed to fetch treatments");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Redirect function for creating new appointments
  const handleCreateAppointment = () => {
    navigate("/add-appointment"); // ✅ Redirects to AddAppointmentPage
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", color: "#333" }}>
        Appointment Management System
      </h1>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={handleCreateAppointment} style={buttonStyle}>Create New Appointment</button>
        <button onClick={fetchAllAppointments} style={buttonStyle}>Get All Appointments</button>
        <button onClick={fetchAllTreatments} style={buttonStyle}>Get All Treatments</button>
      </div>

      {/* Input for searching appointment by ID */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
          placeholder="Enter Appointment ID"
          style={inputStyle}
        />
        <button onClick={fetchSingleAppointment} style={buttonStyle}>Search Appointment</button>
      </div>

      {loading && <p style={{ color: "#666", fontStyle: "italic" }}>Loading data...</p>}
      {error && <p style={{ color: "#e74c3c", marginTop: "10px" }}>{error}</p>}

      {/* Render Appointments Table */}
      {!loading && activeView === "allAppointments" && allAppointments.length > 0 && (
        <Table data={allAppointments} columns={["ID", "Patient Name", "Date", "Status"]} />
      )}

      {/* Render Single Appointment Details */}
      {!loading && activeView === "singleAppointment" && singleAppointment && (
        <div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "4px", marginTop: "20px" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "15px" }}>Appointment Details</h3>
          {Object.entries(singleAppointment).map(([key, value]) => (
            <div key={key} style={{ margin: "10px 0" }}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
            </div>
          ))}
        </div>
      )}

      {/* Render Treatments Table */}
      {!loading && activeView === "allTreatments" && allTreatments.length > 0 && (
        <Table data={allTreatments} columns={["ID", "Treatment Name", "Duration", "Cost", "Description"]} />
      )}
    </div>
  );
};

// Reusable styles
const buttonStyle = {
  padding: "10px 15px",
  backgroundColor: "#4a90e2",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};

const inputStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  width: "200px",
};

// Reusable Table Component
const Table = ({ data, columns }) => (
  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
    <thead>
      <tr>{columns.map((col) => <th key={col} style={headerStyle}>{col}</th>)}</tr>
    </thead>
    <tbody>
      {data.map((item, index) => (
        <tr key={index}>
          {Object.values(item).map((value, i) => <td key={i} style={cellStyle}>{value}</td>)}
        </tr>
      ))}
    </tbody>
  </table>
);

const headerStyle = { backgroundColor: "#f2f2f2", padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" };
const cellStyle = { padding: "10px", borderBottom: "1px solid #ddd" };

export default AppointmentManagementUI;
