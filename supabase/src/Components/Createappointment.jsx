import React, { useState, useEffect } from "react";
import { getCurrentUser,isAuthenticated } from "../auth";
import { useNavigate } from "react-router-dom";

const AddAppointmentPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, []);

  const [formData, setFormData] = useState({
    user_id: "",
    staff_id: "",
    appointment_date: "",
    appointment_time: "",
    status: "scheduled",
    virtual_link: "",
    notes: "",
  });

  const [users, setUsers] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setUsers([
        { user_id: "85ea84f6-6707-417e-b50e-4c7566e688fb", name: "John Doe", email: "john@example.com" },
        { user_id: "898c4653-7af6-43e4-9676-aa174da5d34a", name: "Jane Smith", email: "jane@example.com" },
        { user_id: "be6cb730-947b-421e-a8ec-c416fba12382", name: "Robert Johnson", email: "robert@example.com" },
      ]);
    }, 500);

    setTimeout(() => {
      setStaffMembers([
        { user_id: "be6cb730-947b-421e-a8ec-c416fba12382", name: "Dr. Robert Johnson", role: "Dentist" },
      ]);
    }, 500);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
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

    setTimeout(() => {
      console.log("Creating appointment with:", appointmentData);
      setSuccess("Appointment created successfully!");
      setLoading(false);

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
      }, 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Add New Appointment</h1>
        <p className="text-gray-600">Welcome, {getCurrentUser()?.email}</p>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mt-3">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mt-3">{success}</div>}

        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Patient <span className="text-red-500">*</span></label>
              <select name="user_id" value={formData.user_id} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="">Select Patient</option>
                {users.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold">Staff Member</label>
              <select name="staff_id" value={formData.staff_id} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="">Select Staff Member (Optional)</option>
                {staffMembers.map((staff) => (
                  <option key={staff.user_id} value={staff.user_id}>
                    {staff.name} - {staff.role}
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

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block font-semibold">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
                <option value="no-show">No Show</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold">Virtual Meeting Link</label>
              <input type="text" name="virtual_link" value={formData.virtual_link} onChange={handleChange} placeholder="https://meet.example.com/room-id" className="w-full border p-2 rounded" />
            </div>
          </div>

          <div className="mt-4">
            <label className="block font-semibold">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Enter any additional information or special instructions for this appointment" className="w-full border p-2 rounded h-24"></textarea>
          </div>

          <div className="flex justify-between mt-6">
            <button type="button" onClick={() => setFormData({
              user_id: "",
              staff_id: "",
              appointment_date: "",
              appointment_time: "",
              status: "scheduled",
              virtual_link: "",
              notes: "",
            })} className="px-4 py-2 bg-gray-200 text-gray-700 rounded">Cancel</button>

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
