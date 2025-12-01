import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { bookingId } = useParams();

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetail();
    } else {
      fetchBookings();
    }
  }, [bookingId]);

  const fetchBookings = async () => {
    try {
      const res = await api.get("waste/booking/history/");
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setLoading(false);
    }
  };

  const fetchBookingDetail = async () => {
    try {
      const res = await api.get(`waste/booking/${bookingId}/`);
      setBookings([res.data]);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching booking:", err);
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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "#4CAF50";
      case "pending":
        return "#FF9800";
      case "failed":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "20px", textAlign: "center" }}>
        <h2>My Bookings</h2>
        <p>No bookings found.</p>
        <Link
          to="/booking/create"
          style={{
            display: "inline-block",
            padding: "12px 30px",
            backgroundColor: "#2196F3",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            marginTop: "20px",
          }}
        >
          Create New Booking
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2>{bookingId ? "Booking Details" : "My Bookings"}</h2>
        {!bookingId && (
          <Link
            to="/booking/create"
            style={{
              padding: "12px 30px",
              backgroundColor: "#2196F3",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
            }}
          >
            + New Booking
          </Link>
        )}
      </div>

      <div style={{ display: "grid", gap: "20px" }}>
        {bookings.map((booking) => (
          <div
            key={booking.id}
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "20px" }}>
              <div>
                <h3 style={{ margin: "0 0 10px 0" }}>
                  Booking #{booking.id}
                </h3>
                <p style={{ margin: "5px 0", color: "#666" }}>
                  Created: {new Date(booking.created_at).toLocaleString()}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    padding: "8px 15px",
                    backgroundColor: getStatusColor(booking.status),
                    color: "white",
                    borderRadius: "20px",
                    fontSize: "14px",
                    marginBottom: "10px",
                    display: "inline-block",
                  }}
                >
                  {booking.status.replace("_", " ").toUpperCase()}
                </div>
                <div
                  style={{
                    padding: "8px 15px",
                    backgroundColor: getPaymentStatusColor(booking.payment_status),
                    color: "white",
                    borderRadius: "20px",
                    fontSize: "14px",
                    display: "inline-block",
                  }}
                >
                  Payment: {booking.payment_status.toUpperCase()}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "15px",
                marginBottom: "20px",
              }}
            >
              <div>
                <strong>Waste Type:</strong>
                <p style={{ margin: "5px 0", color: "#666" }}>{booking.waste_type?.name}</p>
              </div>
              <div>
                <strong>Quantity:</strong>
                <p style={{ margin: "5px 0", color: "#666" }}>{booking.quantity_kg} kg</p>
              </div>
              <div>
                <strong>Pickup Date:</strong>
                <p style={{ margin: "5px 0", color: "#666" }}>{booking.pickup_date}</p>
              </div>
              <div>
                <strong>Pickup Time:</strong>
                <p style={{ margin: "5px 0", color: "#666" }}>{booking.pickup_time}</p>
              </div>
              <div>
                <strong>Collection Center:</strong>
                <p style={{ margin: "5px 0", color: "#666" }}>
                  {booking.selected_center?.name || "Not selected"}
                </p>
              </div>
              <div>
                <strong>Total Price:</strong>
                <p style={{ margin: "5px 0", color: "#666", fontSize: "18px", fontWeight: "bold" }}>
                  ₹{parseFloat(booking.total_price || 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <strong>Address:</strong>
              <p style={{ margin: "5px 0", color: "#666" }}>{booking.address}</p>
            </div>

            {booking.waste_image && (
              <div style={{ marginBottom: "15px" }}>
                <strong>Waste Image:</strong>
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={booking.waste_image}
                    alt="Waste"
                    style={{
                      maxWidth: "300px",
                      maxHeight: "300px",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              {booking.payment_status !== "paid" && (
                <Link
                  to={`/booking/${booking.id}/payment`}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "5px",
                  }}
                >
                  Make Payment
                </Link>
              )}
              <Link
                to={`/booking/${booking.id}`}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#9C27B0",
                    color: "white",
                  textDecoration: "none",
                  borderRadius: "5px",
                }}
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingHistory;

