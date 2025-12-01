import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Welcome() {
  const { user } = useContext(AuthContext);

  const wasteCategories = [
    {
      name: "Bio Waste",
      description: "Organic waste that can be composted, including food scraps, garden waste, and other biodegradable materials.",
      color: "#4CAF50"
    },
    {
      name: "Non-Bio Waste",
      description: "Non-biodegradable waste that requires special handling, including plastics, metals, and synthetic materials.",
      color: "#F44336"
    },
    {
      name: "Recyclable Waste",
      description: "Materials that can be processed and reused, including paper, cardboard, glass, and certain plastics.",
      color: "#2196F3"
    }
  ];

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Background Image Section */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url('https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=1920')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
          zIndex: 0
        }}
      />
      
      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, padding: "60px 20px" }}>
        {/* Hero Section */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <h1 style={{ fontSize: "3rem", color: "#2c3e50", marginBottom: "20px", fontWeight: "bold" }}>
            Smart Garbage Management System
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#555", maxWidth: "600px", margin: "0 auto" }}>
            Efficient waste collection and management for a cleaner environment
          </p>
        </div>

        {/* Waste Categories Section */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", marginBottom: "60px" }}>
          <h2 style={{ textAlign: "center", fontSize: "2rem", color: "#2c3e50", marginBottom: "40px" }}>
            Waste Categories
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "30px",
              padding: "0 20px"
            }}
          >
            {wasteCategories.map((category, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "30px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  borderTop: `4px solid ${category.color}`,
                  transition: "transform 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 12px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                }}
              >
                <h3 style={{ color: category.color, fontSize: "1.5rem", marginBottom: "15px" }}>
                  {category.name}
                </h3>
                <p style={{ color: "#666", lineHeight: "1.6" }}>
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          {!user ? (
            <div>
              <Link
                to="/login"
                style={{
                  display: "inline-block",
                  padding: "15px 40px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  margin: "0 10px",
                  transition: "background-color 0.3s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1976D2"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2196F3"}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  display: "inline-block",
                  padding: "15px 40px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  margin: "0 10px",
                  transition: "background-color 0.3s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#45a049"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4CAF50"}
              >
                Register
              </Link>
            </div>
          ) : (
            <div>
              <Link
                to="/booking/create"
                style={{
                  display: "inline-block",
                  padding: "15px 40px",
                  backgroundColor: "#FF9800",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  margin: "0 10px",
                  transition: "background-color 0.3s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F57C00"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#FF9800"}
              >
                Book Waste Pickup
              </Link>
              <Link
                to="/dashboard"
                style={{
                  display: "inline-block",
                  padding: "15px 40px",
                  backgroundColor: "#9C27B0",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  margin: "0 10px",
                  transition: "background-color 0.3s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#7B1FA2"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#9C27B0"}
              >
                My Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Welcome;
