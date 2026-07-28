import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    const authUsers = JSON.parse(localStorage.getItem("authUsers") || "[]");
    const exists = authUsers.some((u) => u.email.toLowerCase() === form.email.trim().toLowerCase());
    if (exists) {
      setError("An account with this email already exists. Please log in instead.");
      return;
    }

    const newAuthUser = { name: form.name.trim(), email: form.email.trim(), password: form.password };
    localStorage.setItem("authUsers", JSON.stringify([...authUsers, newAuthUser]));
    localStorage.setItem("currentUser", JSON.stringify({ name: newAuthUser.name, email: newAuthUser.email }));
    navigate("/dashboard");
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <UserPlus size={24} color="#fff" />
        </div>
        <h1 className="auth-title">Create an account</h1>
        <p className="auth-subtitle">Sign up to start managing your users</p>

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label">Full name</label>
            <input
              type="text"
              className="field-input"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="field-group">
            <label className="field-label">Email</label>
            <input
              type="email"
              className="field-input"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <input
              type="password"
              className="field-input"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="field-group">
            <label className="field-label">Confirm password</label>
            <input
              type="password"
              className="field-input"
              placeholder="Re-enter your password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary">
            Create account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
