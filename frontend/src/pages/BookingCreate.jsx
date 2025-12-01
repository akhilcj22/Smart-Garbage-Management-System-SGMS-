import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

function BookingCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [wasteTypes, setWasteTypes] = useState([]);
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Default: Delhi
  const [nearestCenter, setNearestCenter] = useState(null);

  const [formData, setFormData] = useState({
    waste_type_id: searchParams.get("waste_type") || "",
    quantity_kg: "",
    pickup_date: "",
    pickup_time: "",
    address: "",
    waste_image: null,
  });

  useEffect(() => {
    // Fetch waste types
    api.get("waste/types/")
      .then((res) => {
        setWasteTypes(res.data);
        // If waste_type is in URL, set it
        const wasteTypeParam = searchParams.get("waste_type");
        if (wasteTypeParam) {
          setFormData(prev => ({ ...prev, waste_type_id: wasteTypeParam }));
        }
      })
      .catch((err) => console.error(err));

    // Fetch centers
    api.get("waste/centers/")
      .then((res) => setCenters(res.data))
      .catch((err) => console.error(err));

    // Get user location with better error handling
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setMapCenter(location);
          findNearestCenter(location);
        },
        (err) => {
          // Handle geolocation errors gracefully
          console.warn("Location access denied or unavailable:", err.message);
          // Use default location (Delhi) if geolocation fails
          const defaultLocation = { lat: 28.6139, lng: 77.2090 };
          setMapCenter(defaultLocation);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser");
    }
  }, []);

  const findNearestCenter = async (location) => {
    try {
      const res = await api.post("waste/centers/nearest/", {
        latitude: location.lat,
        longitude: location.lng,
      });
      setNearestCenter(res.data.center);
      setSelectedCenter(res.data.center.id);
    } catch (err) {
      console.error("Error finding nearest center:", err);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "waste_image") {
      setFormData({ ...formData, waste_image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }

    // Step 2: Submit booking
    const submitData = new FormData();
    submitData.append("waste_type_id", formData.waste_type_id);
    submitData.append("quantity_kg", formData.quantity_kg);
    submitData.append("pickup_date", formData.pickup_date);
    submitData.append("pickup_time", formData.pickup_time);
    submitData.append("address", formData.address);
    if (selectedCenter) {
      submitData.append("selected_center_id", selectedCenter);
    }
    if (formData.waste_image) {
      submitData.append("waste_image", formData.waste_image);
    }

    try {
      const res = await api.post("waste/booking/create/", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/booking/${res.data.id}/payment`);
    } catch (err) {
      console.error("Error creating booking:", err);
      alert("Error creating booking. Please try again.");
    }
  };

  const selectedWasteType = wasteTypes.find((wt) => wt.id === parseInt(formData.waste_type_id));
  const totalPrice = selectedWasteType
    ? (parseFloat(formData.quantity_kg) || 0) * parseFloat(selectedWasteType.price_per_kg)
    : 0;

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
      <h2>Book Waste Pickup</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <span
          style={{
            padding: "10px 20px",
            backgroundColor: step >= 1 ? "#2196F3" : "#ccc",
            color: "white",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        >
          Step 1: Details
        </span>
        <span
          style={{
            padding: "10px 20px",
            backgroundColor: step >= 2 ? "#2196F3" : "#ccc",
            color: "white",
            borderRadius: "5px",
          }}
        >
          Step 2: Select Center
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <div style={{ marginBottom: "15px" }}>
              <label>Waste Type *</label>
              <select
                name="waste_type_id"
                value={formData.waste_type_id}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "10px", marginTop: "5px" }}
              >
                <option value="">Select waste type</option>
                {wasteTypes.map((wt) => (
                  <option key={wt.id} value={wt.id}>
                    {wt.name} - ₹{wt.price_per_kg}/kg
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Quantity (kg) *</label>
              <input
                type="number"
                name="quantity_kg"
                value={formData.quantity_kg}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                required
                style={{ width: "100%", padding: "10px", marginTop: "5px" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Pickup Date *</label>
              <input
                type="date"
                name="pickup_date"
                value={formData.pickup_date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
                style={{ width: "100%", padding: "10px", marginTop: "5px" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Pickup Time *</label>
              <input
                type="time"
                name="pickup_time"
                value={formData.pickup_time}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "10px", marginTop: "5px" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="4"
                style={{ width: "100%", padding: "10px", marginTop: "5px" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Waste Image (Optional)</label>
              <input
                type="file"
                name="waste_image"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", marginTop: "5px" }}
              />
              <small>Max size: 5MB, Formats: JPG, PNG</small>
            </div>

            {selectedWasteType && formData.quantity_kg && (
              <div
                style={{
                  padding: "15px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "5px",
                  marginBottom: "15px",
                }}
              >
                <strong>Estimated Total: ₹{totalPrice.toFixed(2)}</strong>
              </div>
            )}

            <button
              type="submit"
              style={{
                padding: "12px 30px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Next: Select Center
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3>Select Collection Center</h3>
            <p>Choose the nearest center for waste collection</p>

            {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
              <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={mapCenter}
                  zoom={12}
                >
                  {userLocation && (
                    <Marker
                      position={userLocation}
                      label="You"
                      icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                      }}
                    />
                  )}
                  {centers.map((center) => (
                    <Marker
                      key={center.id}
                      position={{ lat: parseFloat(center.latitude), lng: parseFloat(center.longitude) }}
                      label={center.name}
                      onClick={() => setSelectedCenter(center.id)}
                      icon={{
                        url:
                          selectedCenter === center.id
                            ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                            : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                      }}
                    />
                  ))}
                </GoogleMap>
              </LoadScript>
            ) : (
              <div
                style={{
                  height: "400px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  border: "2px dashed #ccc",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "15px" }}>🗺️</div>
                <p style={{ color: "#666", fontSize: "16px", margin: "10px 0" }}>
                  Google Maps API key not configured
                </p>
                <p style={{ color: "#999", fontSize: "14px", textAlign: "center", maxWidth: "400px" }}>
                  To enable map view, add your Google Maps API key to the .env file as
                  VITE_GOOGLE_MAPS_API_KEY
                </p>
              </div>
            )}

            <div style={{ marginTop: "20px" }}>
              {nearestCenter && (
                <div
                  style={{
                    padding: "15px",
                    backgroundColor: "#e3f2fd",
                    borderRadius: "5px",
                    marginBottom: "15px",
                  }}
                >
                  <strong>Nearest Center: {nearestCenter.name}</strong>
                  <p>{nearestCenter.address}</p>
                </div>
              )}

              <label>Select Center *</label>
              <select
                value={selectedCenter || ""}
                onChange={(e) => setSelectedCenter(parseInt(e.target.value))}
                required
                style={{ width: "100%", padding: "10px", marginTop: "5px" }}
              >
                <option value="">Select a center</option>
                {centers.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.name} - {center.address}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  padding: "12px 30px",
                  backgroundColor: "#ccc",
                  color: "black",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Back
              </button>
              <button
                type="submit"
                style={{
                  padding: "12px 30px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Create Booking
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default BookingCreate;

