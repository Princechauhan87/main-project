import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Mail, Phone, Search, UserCheck, UserX, Users, LogOut } from "lucide-react";

const avatarColors = ["#6366F1", "#0891B2", "#DB2777", "#059669", "#D97706", "#7C3AED"];
const colorFor = (id) =>
  avatarColors[Math.abs(String(id).split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % avatarColors.length];
const initials = (name) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase();

function loadUsers() {
  const stored = localStorage.getItem("managedUsers");
  if (stored) return JSON.parse(stored);
  const seed = [
    { id: 1, name: "Rohit Sharma", email: "rohit@example.com", phone: "9876543210", status: "active" },
    { id: 2, name: "Priya Verma", email: "priya@example.com", phone: "9123456780", status: "inactive" },
  ];
  localStorage.setItem("managedUsers", JSON.stringify(seed));
  return seed;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const cu = localStorage.getItem("currentUser");
    if (!cu) {
      navigate("/login");
      return;
    }
    setCurrentUser(JSON.parse(cu));
    setUsers(loadUsers());
  }, [navigate]);

  const persist = (next) => {
    setUsers(next);
    localStorage.setItem("managedUsers", JSON.stringify(next));
  };

  const handleDelete = (id) => {
    persist(users.filter((u) => u.id !== id));
    setDeleteConfirmId(null);
  };

  const toggleStatus = (id) => {
    persist(users.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u)));
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || u.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  const activeCount = users.filter((u) => u.status === "active").length;
  const inactiveCount = users.length - activeCount;

  if (!currentUser) return null;

  return (
    <div className="page-wrap">
      <div className="page-inner">
        <div className="top-header">
          <div className="brand-row">
            <div className="brand-icon">
              <Users size={24} />
            </div>
            <div>
              <h1 className="brand-title">User management</h1>
              <p className="brand-subtitle">Signed in as {currentUser.name}</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-ghost-white" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
            <button className="btn-white" onClick={() => navigate("/add")}>
              <Plus size={18} /> Add user
            </button>
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#EEF2FF" }}>
              <Users size={18} color="#4F46E5" />
            </div>
            <div>
              <p className="stat-value">{users.length}</p>
              <p className="stat-label">Total users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#ECFDF5" }}>
              <UserCheck size={18} color="#059669" />
            </div>
            <div>
              <p className="stat-value">{activeCount}</p>
              <p className="stat-label">Active</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#FEF2F2" }}>
              <UserX size={18} color="#DC2626" />
            </div>
            <div>
              <p className="stat-value">{inactiveCount}</p>
              <p className="stat-label">Inactive</p>
            </div>
          </div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <Search size={16} color="#9CA3AF" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["all", "active", "inactive"].map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : f === "active" ? "Active" : "Inactive"}
              </button>
            ))}
          </div>
        </div>

        <div className="list-card">
          {filteredUsers.length === 0 ? (
            <div className="empty-state">
              <p style={{ fontSize: 15, margin: 0, color: "#374151", fontWeight: 500 }}>
                {users.length === 0 ? "No users yet" : "No matches found"}
              </p>
              <p style={{ fontSize: 13, margin: "4px 0 0", color: "#9CA3AF" }}>
                {users.length === 0 ? 'Click "Add user" to create the first one.' : "Try a different search or filter."}
              </p>
            </div>
          ) : (
            <table className="list-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="avatar" style={{ background: colorFor(u.id) }}>
                          {initials(u.name)}
                        </div>
                        <strong style={{ color: "#111827", fontWeight: 500 }}>{u.name}</strong>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#6B7280" }}>
                        <Mail size={14} /> {u.email}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#6B7280" }}>
                        <Phone size={14} /> {u.phone}
                      </span>
                    </td>
                    <td>
                      <button
                        className="status-pill"
                        onClick={() => toggleStatus(u.id)}
                        style={{
                          background: u.status === "active" ? "#DCFCE7" : "#FEE2E2",
                          color: u.status === "active" ? "#166534" : "#991B1B",
                        }}
                      >
                        <span
                          className="status-dot"
                          style={{ background: u.status === "active" ? "#22C55E" : "#EF4444" }}
                        />
                        {u.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button className="icon-btn edit" onClick={() => navigate(`/edit/${u.id}`)} title="Edit">
                        <Pencil size={16} color="#4F46E5" />
                      </button>
                      {deleteConfirmId === u.id ? (
                        <>
                          <button
                            onClick={() => handleDelete(u.id)}
                            style={{ background: "#DC2626", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, padding: "6px 10px", fontWeight: 500, cursor: "pointer", marginLeft: 4 }}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            style={{ background: "none", border: "none", fontSize: 12, padding: "6px 10px", color: "#6B7280", cursor: "pointer" }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button className="icon-btn del" onClick={() => setDeleteConfirmId(u.id)} title="Delete">
                          <Trash2 size={16} color="#DC2626" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
