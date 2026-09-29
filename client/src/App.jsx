import Signup from "./pages/Signup";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";

function Layout({ children }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  let user = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw) user = JSON.parse(raw);
  } catch (e) {}

  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const userInitial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isHome = location.pathname === "/";
  const isProducts = location.pathname.toLowerCase().startsWith("/products");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "230px",
          backgroundColor: "#111827",
          padding: "24px 16px",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "0 8px 24px 8px", borderBottom: "1px solid #1f2937" }}>
          <h2 style={{ fontSize: "20px", margin: 0, fontWeight: "700", letterSpacing: "-0.01em" }}>
            Productr
          </h2>
        </div>

        <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                color: isHome ? "#ffffff" : "#9ca3af",
                backgroundColor: isHome ? "#1f2937" : "transparent",
                fontWeight: isHome ? "600" : "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              Home
            </div>
          </Link>

          <Link to="/products" style={{ textDecoration: "none" }}>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                color: isProducts ? "#ffffff" : "#9ca3af",
                backgroundColor: isProducts ? "#1f2937" : "transparent",
                fontWeight: isProducts ? "600" : "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              Products
            </div>
          </Link>
        </div>

        <div style={{ marginTop: "auto", padding: "12px", borderRadius: "8px", backgroundColor: "#1f2937", fontSize: "12px", color: "#9ca3af" }}>
          <div style={{ fontWeight: "600", color: "#e5e7eb", marginBottom: "2px" }}>Productr Store</div>
          <div>Inventory System v1.0</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Navbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 28px",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>
            Workspace / <span style={{ color: "#111827", fontWeight: "600" }}>{isProducts ? "Products Catalog" : "Dashboard"}</span>
          </div>

          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ textAlign: "right", display: "block" }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#111827" }}>{displayName}</div>
              <div style={{ fontSize: "11px", color: "#6b7280" }}>{user?.email || "Account"}</div>
            </div>

            <div
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#1e3a8a",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
              title="User menu"
            >
              {userInitial}
            </div>

            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "46px",
                  right: "0",
                  background: "white",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  width: "150px",
                  padding: "6px",
                  zIndex: 100,
                }}
              >
                <div
                  onClick={handleLogout}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: "#dc2626",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "#fef2f2")}
                  onMouseLeave={(e) => (e.target.style.background = "white")}
                >
                  Sign Out
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Layout>
                <Products />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/Products"
          element={
            <ProtectedRoute>
              <Layout>
                <Products />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;