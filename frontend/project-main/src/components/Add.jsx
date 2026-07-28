import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, ArrowLeft } from "lucide-react";

export default function Add() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", status: "active" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!localStorage.getItem("currentUser")) navigate("/login");
  }, [navigate]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const users = JSON.parse(localStorage.getItem("managedUsers") || "[]");
    const newUser = { id: Date.now(), ...form };
    localStorage.setItem("managedUsers", JSON.stringify([newUser, ...users]));
    navigate("/dashboard");
  };

  return (
    <div className="page-wrap">
      <div className="page-inner" style={{ maxWidth: 520 }}>
        <button className="btn-ghost-white" onClick={() => navigate("/dashboard")} style={{ marginBottom: 20 }}>
          <ArrowLeft size={16} /> Back to dashboard
        </button>

        <div className="form-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div className="brand-icon" style={{ width: 40, height: 40 }}>
              <UserPlus size={20} />
            </div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>Add new user</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label">Name</label>
              <input
                className="field-input"
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            <div className="field-group">
              <label className="field-label">Email</label>
              <input
                className="field-input"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="field-group">
              <label className="field-label">Phone number</label>
              <input
                className="field-input"
                type="tel"
                placeholder="10-digit number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              {errors.phone && <p className="field-error">{errors.phone}</p>}
            </div>

            <div className="field-group">
              <label className="field-label">Status</label>
              <div className="status-toggle-row">
                <button
                  type="button"
                  className="status-toggle-btn"
                  onClick={() => setForm({ ...form, status: "active" })}
                  style={{
                    border: form.status === "active" ? "1.5px solid #059669" : "1.5px solid #E5E7EB",
                    background: form.status === "active" ? "#ECFDF5" : "#fff",
                    color: form.status === "active" ? "#059669" : "#6B7280",
                  }}
                >
                  <span className="status-dot" style={{ background: form.status === "active" ? "#059669" : "#D1D5DB" }} />
                  Active
                </button>
                <button
                  type="button"
                  className="status-toggle-btn"
                  onClick={() => setForm({ ...form, status: "inactive" })}
                  style={{
                    border: form.status === "inactive" ? "1.5px solid #DC2626" : "1.5px solid #E5E7EB",
                    background: form.status === "inactive" ? "#FEF2F2" : "#fff",
                    color: form.status === "inactive" ? "#DC2626" : "#6B7280",
                  }}
                >
                  <span className="status-dot" style={{ background: form.status === "inactive" ? "#DC2626" : "#D1D5DB" }} />
                  Inactive
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22 }}>
              <button type="button" className="btn-secondary" onClick={() => navigate("/dashboard")}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ width: "auto", padding: "10px 20px" }}>
                Add user
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
