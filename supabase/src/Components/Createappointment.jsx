import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../auth";

const AddAppointmentPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    user_id: "",
    staff_id: "",
    appointment_date: "",
    appointment_time: "",
    status: "scheduled",
    virtual_link: "",
    notes: "",
  });

  const [patients, setPatients] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch unique patients from appointments table
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from("appointments")
          .select("user_id, profiles(full_name)")
          .order("appointment_date", { ascending: false });

        if (error) throw error;

        const uniquePatients = [];
        const seenUserIds = new Set();

        data.forEach((item) => {
          if (!seenUserIds.has(item.user_id)) {
            seenUserIds.add(item.user_id);
            uniquePatients.push({
              user_id: item.user_id,
              full_name: item.profiles?.full_name || "Unknown",
            });
          }
        });

        setPatients(uniquePatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setError("Failed to fetch patients.");
      }
    };

    fetchPatients();
  }, []);

  // Fetch staff members from staff_profiles table
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const { data, error } = await supabase
          .from("staff_profiles")
          .select("user_id, name");

        if (error) throw error;
        setStaffMembers(data);
      } catch (error) {
        console.error("Error fetching staff:", error.message);
        setError("Failed to fetch staff members.");
      }
    };

    fetchStaff();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.user_id || !formData.appointment_date || !formData.appointment_time) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const combinedDateTime = `${formData.appointment_date}T${formData.appointment_time}:00`;

    const appointmentData = {
      user_id: formData.user_id,
      staff_id: formData.staff_id || null,
      appointment_date: combinedDateTime,
      status: formData.status,
      virtual_link: formData.virtual_link || null,
      notes: formData.notes || null,
    };

    try {
      const { error } = await supabase.from("appointments").insert([appointmentData]);

      if (error) throw error;

      setSuccess("Appointment created successfully!");
      setFormData({
        user_id: "",
        staff_id: "",
        appointment_date: "",
        appointment_time: "",
        status: "scheduled",
        virtual_link: "",
        notes: "",
      });

      setTimeout(() => {
        setSuccess(null);
        navigate("/appointments");
      }, 2000);
    } catch (error) {
      console.error("Error creating appointment:", error);
      setError("Failed to create appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Add New Appointment</h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mt-3">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mt-3">{success}</div>}

        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Patient <span className="text-red-500">*</span></label>
              <select name="user_id" value={formData.user_id} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.user_id} value={patient.user_id}>
                    {patient.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold">Staff Member</label>
              <select name="staff_id" value={formData.staff_id} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="">Select Staff Member</option>
                {staffMembers.map((staff) => (
                  <option key={staff.user_id} value={staff.user_id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block font-semibold">Date <span className="text-red-500">*</span></label>
              <input type="date" name="appointment_date" value={formData.appointment_date} onChange={handleChange} className="w-full border p-2 rounded" min={new Date().toISOString().split("T")[0]} />
            </div>

            <div>
              <label className="block font-semibold">Time <span className="text-red-500">*</span></label>
              <input type="time" name="appointment_time" value={formData.appointment_time} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>

          <div className="mt-4">
            <label className="block font-semibold">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="block font-semibold">Virtual Meeting Link</label>
            <input type="text" name="virtual_link" value={formData.virtual_link} onChange={handleChange} placeholder="Enter Meet link (if any)" className="w-full border p-2 rounded" />
          </div>

          <div className="mt-4">
            <label className="block font-semibold">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Additional details..." className="w-full border p-2 rounded h-24"></textarea>
          </div>

          <div className="flex justify-between mt-6">
            <button type="button" onClick={() => navigate("/appointments")} className="px-4 py-2 bg-gray-200 text-gray-700 rounded">Cancel</button>

            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded" disabled={loading}>
              {loading ? "Creating Appointment..." : "Create Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointmentPage;
