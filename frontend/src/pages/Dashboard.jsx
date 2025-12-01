import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("waste/booking/history/");
      setBookings(res.data);
      
      // Calculate stats
      const total = res.data.length;
      const pending = res.data.filter((b) => b.status === "pending" || b.status === "accepted" || b.status === "in_progress").length;
      const completed = res.data.filter((b) => b.status === "completed").length;
      const totalSpent = res.data
        .filter((b) => b.payment_status === "paid")
        .reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);

      setStats({ total, pending, completed, totalSpent });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#4CAF50";
      case "in_progress":
        return "#FF9800";
      case "accepted":
        return "#2196F3";
      case "pending":
        return "#9E9E9E";
      default:
        return "#F44336";
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#2c3e50",
                marginBottom: "5px",
              }}
            >
              My Dashboard
            </h1>
            <p style={{ color: "#7f8c8d", fontSize: "16px", margin: 0 }}>
              Overview of your bookings and activities
            </p>
          </div>
          <Link
            to="/booking/create"
            style={{
              padding: "14px 30px",
              backgroundColor: "#667eea",
              color: "white",
              textDecoration: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#5568d3";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#667eea";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            ➕ New Booking
          </Link>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "25px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "15px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              border: "3px solid #667eea",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(102, 126, 234, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "15px" }}>📋</div>
            <h3 style={{ margin: 0, fontSize: "36px", color: "#667eea", fontWeight: "700" }}>
              {stats.total}
            </h3>
            <p style={{ margin: "10px 0 0 0", color: "#7f8c8d", fontSize: "15px", fontWeight: "500" }}>
              Total Bookings
            </p>
          </div>
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "15px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              border: "3px solid #FF9800",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(255, 152, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "15px" }}>⏳</div>
            <h3 style={{ margin: 0, fontSize: "36px", color: "#FF9800", fontWeight: "700" }}>
              {stats.pending}
            </h3>
            <p style={{ margin: "10px 0 0 0", color: "#7f8c8d", fontSize: "15px", fontWeight: "500" }}>
              Active Bookings
            </p>
          </div>
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "15px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              border: "3px solid #4CAF50",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(76, 175, 80, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "15px" }}>✅</div>
            <h3 style={{ margin: 0, fontSize: "36px", color: "#4CAF50", fontWeight: "700" }}>
              {stats.completed}
            </h3>
            <p style={{ margin: "10px 0 0 0", color: "#7f8c8d", fontSize: "15px", fontWeight: "500" }}>
              Completed
            </p>
          </div>
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "15px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              border: "3px solid #9C27B0",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(156, 39, 176, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "15px" }}>💰</div>
            <h3 style={{ margin: 0, fontSize: "28px", color: "#9C27B0", fontWeight: "700" }}>
              ₹{stats.totalSpent.toFixed(2)}
            </h3>
            <p style={{ margin: "10px 0 0 0", color: "#7f8c8d", fontSize: "15px", fontWeight: "500" }}>
              Total Spent
            </p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            padding: "35px",
          }}
        >
          <h2
            style={{
              marginBottom: "30px",
              fontSize: "24px",
              fontWeight: "700",
              color: "#2c3e50",
            }}
          >
            Recent Bookings
          </h2>
          {bookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "60px", marginBottom: "20px" }}>📭</div>
              <p style={{ fontSize: "18px", color: "#7f8c8d", marginBottom: "30px" }}>
                No bookings yet. Create your first booking!
              </p>
              <Link
                to="/booking/create"
                style={{
                  display: "inline-block",
                  padding: "14px 35px",
                  backgroundColor: "#667eea",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#5568d3";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#667eea";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                ➕ Book Waste Pickup
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "20px" }}>
              {bookings.slice(0, 5).map((booking) => (
                <Link
                  key={booking.id}
                  to={`/booking/${booking.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: "25px",
                      borderRadius: "15px",
                      border: "2px solid #e9ecef",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.3s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#667eea";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
                      e.currentTarget.style.transform = "translateX(5px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e9ecef";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          margin: "0 0 12px 0",
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "#2c3e50",
                        }}
                      >
                        Booking #{booking.id} - {booking.waste_type?.name}
                      </h4>
                      <p style={{ margin: "8px 0", color: "#7f8c8d", fontSize: "14px" }}>
                        📦 {booking.quantity_kg} kg • 📅 {booking.pickup_date} at {booking.pickup_time}
                      </p>
                      <p style={{ margin: "8px 0", color: "#7f8c8d", fontSize: "14px" }}>
                        📍 {booking.selected_center?.name || "No center selected"}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", marginLeft: "20px" }}>
                      <div
                        style={{
                          padding: "8px 16px",
                          backgroundColor: getStatusColor(booking.status),
                          color: "white",
                          borderRadius: "20px",
                          fontSize: "12px",
                          marginBottom: "12px",
                          display: "inline-block",
                          fontWeight: "600",
                        }}
                      >
                        {booking.status.replace("_", " ").toUpperCase()}
                      </div>
                      <div>
                        <strong
                          style={{
                            fontSize: "22px",
                            color: "#2c3e50",
                            fontWeight: "700",
                          }}
                        >
                          ₹{parseFloat(booking.total_price || 0).toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {bookings.length > 5 && (
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <Link
                to="/booking/history"
                style={{
                  padding: "14px 35px",
                  backgroundColor: "#9C27B0",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  boxShadow: "0 4px 15px rgba(156, 39, 176, 0.4)",
                  transition: "all 0.3s",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#7B1FA2";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#9C27B0";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                📋 View All Bookings
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

