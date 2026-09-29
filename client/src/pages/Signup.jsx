import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const API_URL =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
      ? "http://localhost:5000"
      : import.meta.env.VITE_API_URL || "https://mern-backend-det8.onrender.com";

  const handleSignup = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/register`,
        {
          email,
          password,
        }
      );

      alert("Signup successful");
      navigate("/login");
    } catch (err) {
  console.log("ERROR:", err.response?.data);
  alert(err.response?.data?.message || err.message);
}
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Signup</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}

export default Signup;