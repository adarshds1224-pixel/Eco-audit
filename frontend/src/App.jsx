import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./App.css";


const API_URL = "https://eco-audit-p85i.onrender.com";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function App() {
  const [category, setCategory] = useState("Glass");
  const [weight, setWeight] = useState("");
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("All Categories");
  const [darkMode, setDarkMode] = useState(true);
  const [image, setImage] = useState(null);

  const categories = ["Plastic", "Organic", "E-Waste", "Paper", "Glass", "Metal"];

  const categoryColors = {
    Plastic: "#38bdf8",
    Organic: "#4ade80",
    "E-Waste": "#facc15",
    Paper: "#60a5fa",
    Glass: "#22d3ee",
    Metal: "#fb923c",
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/logs`);
      setLogs(res.data);
    } catch (error) {
      setMessage("Backend not connected. Start FastAPI server.");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const totalWaste = logs.reduce((sum, log) => sum + Number(log.weight), 0);

  const getTotal = (cat) =>
    logs
      .filter((log) => log.category === cat)
      .reduce((sum, log) => sum + Number(log.weight), 0);

  const categoryTotals = categories.map((cat) => {
    const total = getTotal(cat);
    return {
      category: cat,
      total,
      percentage: totalWaste ? Number(((total / totalWaste) * 100).toFixed(1)) : 0,
    };
  });

  const filteredLogs =
    filter === "All Categories"
      ? logs
      : logs.filter((log) => log.category === filter);

  const latestLocation = logs[0];

  const donutStyle = useMemo(() => {
    if (!totalWaste) {
      return {
        background: "conic-gradient(rgba(255,255,255,0.12) 0deg 360deg)",
      };
    }

    let start = 0;
    const parts = categoryTotals
      .map((item) => {
        const deg = (item.percentage / 100) * 360;
        const end = start + deg;
        const part = `${categoryColors[item.category]} ${start}deg ${end}deg`;
        start = end;
        return part;
      })
      .join(", ");

    return { background: `conic-gradient(${parts})` };
  }, [categoryTotals, totalWaste]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!weight || Number(weight) <= 0) {
      setMessage("Enter a valid weight.");
      return;
    }

    if (!navigator.geolocation) {
      setMessage("Your browser does not support location access.");
      return;
    }

    setMessage("Requesting location permission...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const formData = new FormData();

        formData.append("category", category);
        formData.append("weight", Number(weight));
        formData.append("latitude", position.coords.latitude);
        formData.append("longitude", position.coords.longitude);

        if (image) {
          formData.append("image", image);
        }

        try {
          await axios.post(`${API_URL}/logs`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          setWeight("");
          setImage(null);
          setMessage("Waste log submitted successfully.");
          fetchLogs();
        } catch (error) {
          setMessage("Backend error. Check FastAPI.");
        }
      },
      (error) => {
        if (error.code === 1) {
          setMessage("Location permission denied. Please allow location to submit.");
        } else if (error.code === 2) {
          setMessage("Location unavailable. Try again.");
        } else {
          setMessage("Location request timed out. Try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const getIcon = (cat) => {
    if (cat === "Plastic") return "🧴";
    if (cat === "Organic") return "🌿";
    if (cat === "E-Waste") return "💾";
    if (cat === "Paper") return "📄";
    if (cat === "Glass") return "🧪";
    if (cat === "Metal") return "📦";
    return "♻️";
  };

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <nav className="navbar">
        <div className="brand">
          <span className="brand-icon">🌱</span>
          <h2>EcoAudit</h2>
        </div>

        <div className="navlinks">
          <button onClick={() => document.querySelector(".stats")?.scrollIntoView({ behavior: "smooth" })}>
            Dashboard
          </button>

          <button onClick={() => document.querySelector(".chart-panel")?.scrollIntoView({ behavior: "smooth" })}>
            Analytics
          </button>

          <button onClick={() => document.querySelector(".map-panel")?.scrollIntoView({ behavior: "smooth" })}>
            Map View
          </button>

          <button onClick={() => document.querySelector(".table-panel")?.scrollIntoView({ behavior: "smooth" })}>
            Reports
          </button>
        </div>

        <button
          className="theme-btn"
          type="button"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Verified Community Waste Logger</p>
          <h1>
            <span>Eco</span>Audit
          </h1>
          <p className="hero-subtitle">
            Track waste, verify disposal locations, and build cleaner communities.
          </p>
        </div>

        <div className="globe-card">
          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>
          <div className="planet">🌍</div>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card featured">
          <div className="icon">🗑️</div>
          <h4>Total Waste</h4>
          <h2>{totalWaste.toFixed(2)} kg</h2>
          <p>Live verified data</p>
        </div>

        <div className="stat-card">
          <div className="icon">📋</div>
          <h4>Total Logs</h4>
          <h2>{logs.length}</h2>
          <p>Community entries</p>
        </div>

        {categoryTotals.map((item) => (
          <div className="stat-card" key={item.category}>
            <div className="icon">{getIcon(item.category)}</div>
            <h4>{item.category}</h4>
            <h2>{item.total.toFixed(2)} kg</h2>
            <p>{item.percentage}% of total</p>
            <div className="bar">
              <span
                style={{
                  width: `${item.percentage}%`,
                  background: categoryColors[item.category],
                }}
              ></span>
            </div>
          </div>
        ))}
      </section>

      <section className="main-grid">
        <div className="panel form-panel">
          <div className="panel-head">
            <div className="round-icon">🌿</div>
            <div>
              <h2>Log New Waste</h2>
              <p>Upload proof and submit with verified location.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label>Waste Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <label>Weight in kg</label>
            <div className="input-wrap">
              <input
                type="number"
                placeholder="Enter weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <span>kg</span>
            </div>

            <label>Proof of Disposal</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />

            {image && (
              <div className="image-preview">
                <img src={URL.createObjectURL(image)} alt="Proof preview" />
                <span>{image.name}</span>
              </div>
            )}

            <button className="submit-btn" type="submit">
              📍 Capture Location & Log Waste
            </button>
          </form>

          {message && <div className="success">{message}</div>}
        </div>

        <div className="panel map-panel">
          <div className="panel-head">
            <div className="round-icon">📍</div>
            <div>
              <h2>Map Visualization</h2>
              <p>Every verified waste log appears as a live map pin.</p>
            </div>
          </div>

          <div className="real-map">
            <MapContainer
              center={[
                latestLocation?.latitude || 10.8765525,
                latestLocation?.longitude || 78.8112715,
              ]}
              zoom={13}
              scrollWheelZoom={false}
              className="leaflet-map"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {logs.map((log) => (
                <Marker key={log.id} position={[log.latitude, log.longitude]}>
                  <Popup>
                    <b>{log.category}</b>
                    <br />
                    {log.weight} kg
                    <br />
                    Lat: {Number(log.latitude).toFixed(5)}
                    <br />
                    Lng: {Number(log.longitude).toFixed(5)}
                    <br />
                    {log.image_url && (
                      <img
                        src={log.image_url}
                        alt="Waste proof"
                        style={{
                          width: "130px",
                          marginTop: "8px",
                          borderRadius: "8px",
                        }}
                      />
                    )}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="coords">
            <span>Lat: {latestLocation?.latitude || "Not captured yet"}</span>
            <span>Lng: {latestLocation?.longitude || "Not captured yet"}</span>
          </div>
        </div>
      </section>

      <section className="bottom-grid">
        <div className="panel chart-panel">
          <h2>Waste Distribution</h2>
          <p>Category-wise contribution to total waste.</p>

          <div className="donut" style={donutStyle}>
            <div className="donut-center">
              <h3>{totalWaste.toFixed(0)}</h3>
              <span>kg</span>
            </div>
          </div>

          <div className="legend">
            {categoryTotals.map((item) => (
              <div key={item.category}>
                <span style={{ background: categoryColors[item.category] }}></span>
                <p>{item.category}</p>
                <b>{item.percentage}%</b>
              </div>
            ))}
          </div>
        </div>

        <div className="panel table-panel">
          <div className="table-head">
            <div>
              <h2>Recent Logs</h2>
              <p>Latest verified waste logs from the community.</p>
            </div>

            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All Categories</option>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Weight</th>
                  <th>Location</th>
                  <th>Proof</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <span className="mini-icon">{getIcon(log.category)}</span>
                      {log.category}
                    </td>
                    <td>{log.weight} kg</td>
                    <td>
                      {Number(log.latitude).toFixed(5)},{" "}
                      {Number(log.longitude).toFixed(5)}
                    </td>
                    <td>
                      {log.image_url ? (
                        <img
                          src={log.image_url}
                          className="proof-thumb"
                          alt="Proof"
                        />
                      ) : (
                        <span className="no-proof">No image</span>
                      )}
                    </td>
                    <td>
                      <span className="verified">Verified</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLogs.length === 0 && (
              <div className="empty-state">No logs available for this category.</div>
            )}
          </div>
        </div>
      </section>

      <footer>🌱 EcoAudit © 2025</footer>
    </div>
  );
}

export default App;