import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.patch("auth/me/update/", formData);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error updating profile");
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
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
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            padding: "40px",
            animation: "fadeIn 0.5s ease-in",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "#667eea",
                borderRadius: "50%",
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
                color: "white",
              }}
            >
              👤
            </div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#2c3e50",
                marginBottom: "10px",
              }}
            >
              My Profile
            </h1>
            <p style={{ color: "#7f8c8d", fontSize: "15px", margin: 0 }}>
              Manage your account information
            </p>
          </div>

          {message && (
            <div
              style={{
                padding: "15px 20px",
                backgroundColor: message.includes("Error") ? "#ffebee" : "#e8f5e9",
                color: message.includes("Error") ? "#c62828" : "#2e7d32",
                borderRadius: "10px",
                marginBottom: "25px",
                fontSize: "14px",
                border: `2px solid ${message.includes("Error") ? "#ffcdd2" : "#c8e6c9"}`,
              }}
            >
              {message}
            </div>
          )}

          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "25px",
              borderRadius: "15px",
              marginBottom: "30px",
              border: "2px solid #e9ecef",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "20px",
                paddingBottom: "20px",
                borderBottom: "2px solid #e9ecef",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: "#667eea",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  color: "white",
                }}
              >
                ✉️
              </div>
              <div>
                <div style={{ color: "#7f8c8d", fontSize: "14px", marginBottom: "5px" }}>
                  Email Address
                </div>
                <div style={{ color: "#2c3e50", fontSize: "16px", fontWeight: "600" }}>
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdate}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#2c3e50",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "10px",
                  fontSize: "15px",
                  transition: "all 0.3s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.outline = "none";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e0e0e0";
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#2c3e50",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "10px",
                  fontSize: "15px",
                  transition: "all 0.3s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.outline = "none";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e0e0e0";
                }}
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#2c3e50",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="4"
                placeholder="Enter your address"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "10px",
                  fontSize: "15px",
                  transition: "all 0.3s",
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.outline = "none";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e0e0e0";
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <button
                type="submit"
                style={{
                  flex: "1",
                  minWidth: "150px",
                  padding: "16px",
                  backgroundColor: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#5568d3";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#667eea";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                💾 Update Profile
              </button>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  flex: "1",
                  minWidth: "150px",
                  padding: "16px",
                  backgroundColor: "#F44336",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 15px rgba(244, 67, 54, 0.4)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#d32f2f";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#F44336";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                🚪 Logout
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Profile;
