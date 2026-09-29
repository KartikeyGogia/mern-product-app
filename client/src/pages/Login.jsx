import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import bg from "../assets/Frame.png";
import { useState } from "react";
import { useEffect } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      window.location.href = "/";
    }
  }, []);

  const API_URL =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
      ? "http://localhost:5000"
      : import.meta.env.VITE_API_URL || "https://mern-backend-det8.onrender.com";

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        alert(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white"
      }}
    >
      <div
        style={{
          display: "flex",
          width: "90%",
          maxWidth: "1100px",
          height: "85vh",
          gap: "40px"
        }}
      >
        <div
          style={{
            flex: 0.9,
            height: "100%",
            borderRadius: "20px",
            overflow: "hidden",
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              width: "90px"
            }}
          />

          <div
            style={{
              width: "260px",
              borderRadius: "20px",
              overflow: "hidden",
              background: "linear-gradient(to bottom,orange,red)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              textAlign: "center",
              color: "white",
              maxWidth: "400px"
            }}
          ></div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            paddingLeft: "40px"
          }}
        >
          <div
            style={{
              width: "380px"
            }}
          >
            <h2
              style={{
                marginBottom: "25px",
                fontWeight: "600",
                color: "#1b3887",
                fontSize: "22px"
              }}
            >
              Login to your Productr Account
            </h2>

            <label style={{ marginBottom: "5px", fontSize: "14px", display: "block" }}>
              Email or Phone number
            </label>

            <input
              type="email"
              placeholder="Enter email or phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                marginBottom: "20px",
                outline: "none"
              }}
            />

            <label style={{ marginBottom: "5px", fontSize: "14px", display: "block" }}>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                marginBottom: "20px",
                outline: "none"
              }}
            />

            <button
              onClick={(e) => {
                e.target.blur();
                handleLogin();
              }}
              style={{
                width: "100%",
                cursor: "pointer",
                fontWeight: "500",
                padding: "12px",
                background: "#1e3a8a",
                color: "white",
                border: "none",
                borderRadius: "6px"
              }}
            >
              Login
            </button>

            <div
              style={{
                marginTop: "50px",
                padding: "18px",
                border: "1px dashed rgb(204, 204, 204)",
                textAlign: "center",
                borderRadius: "8px"
              }}
            >
              <p style={{ fontSize: "12px", color: "#555" }}>
                Don't have a Productr Account?
              </p>

              <span
                onClick={() => navigate("/signup")}
                style={{
                  color: "#2563eb",
                  fontWeight: "500",
                  cursor: "pointer"
                }}
              >
                Signup Here
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
