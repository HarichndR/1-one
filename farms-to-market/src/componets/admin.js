import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import "./admin.css";
import api from "../api/api";




const COLORS = ["#4CAF50", "#FF9800", "#2196F3"];

// StatCard Component
const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <h2>{title}</h2>
    <p>{value}</p>
  </div>
);

export default function AdminPanel() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalBuyers: 0,
    totalProducts: 0,
    unreadFeedbacks: 0,
  });

  const [feedbacks, setFeedbacks] = useState([]);
  const [email, setEmail] = useState("");
  const [feedbackType, setFeedbackType] = useState("unread-feedbacks");
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });

  useEffect(() => {
    fetchStats();
    fetchFeedbacks(feedbackType);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get(`/admin/dashboard-stats`);
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchFeedbacks = async (type, page = 1) => {
    try {
      const res = await api.get(`/admin/${type}`, { params: { page, limit: 10 } });
      setFeedbacks(res.data.feedbacks);
      setPagination(res.data.pagination);
      setFeedbackType(type);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const deleteUser = async () => {
    if (!email) return alert("Enter an email.");
    try {
      await api.delete(`/admin/removeuserByEmail`, { data: { email } });
      alert("User deleted successfully");
      setEmail("");
      fetchStats();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/admin/markAsReaded`, { id });
      fetchFeedbacks(feedbackType, pagination.page);
      fetchStats();
    } catch (error) {
      console.error("Error marking feedback as read:", error);
    }
  };

  const userData = [
    { name: "Farmers", value: stats.totalFarmers || 0 },
    { name: "Buyers", value: stats.totalBuyers || 0 },
    { name: "Other", value: (stats.totalUsers || 0) - ((stats.totalFarmers || 0) + (stats.totalBuyers || 0)) },
  ];

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <div className="grid grid-2">
        <div className="card">
          <h2>User Distribution</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={userData} cx="50%" cy="50%" outerRadius={80} innerRadius={40} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} dataKey="value">
                  {userData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-4">
          <StatCard title="Total Users" value={stats.totalUsers} />
          <StatCard title="Farmers" value={stats.totalFarmers} />
          <StatCard title="Buyers" value={stats.totalBuyers} />
          <StatCard title="Products" value={stats.totalProducts} />
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2>Feedback Management</h2>
          <button className="button button-primary" onClick={() => fetchFeedbacks("unread-feedbacks")}>Unread ({stats.unreadFeedbacks || 0})</button>
          <button className="button" onClick={() => fetchFeedbacks("read-feedbacks")}>Read Feedbacks</button>

          <table className="table">
            <thead>
              <tr>
                <th>Message</th>

              </tr>
            </thead>
            <tbody>
              {feedbacks.map((fb) => (
                <tr key={fb._id}>
                  <td>{fb.message}</td>
                  <td>
                    {feedbackType === "unread-feedbacks" && (
                      <button className="button button-primary" onClick={() => markAsRead(fb._id)}>Mark as Read</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2>Remove User</h2>
          <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter user email" />
          <button className="button button-danger" onClick={deleteUser}>Remove User</button>
        </div>
      </div>
    </div>
  );
}
