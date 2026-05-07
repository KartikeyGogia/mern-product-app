import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import bg from "../assets/Frame.png";
import { useState } from "react";
import { useEffect } from "react";





function Login(){
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();


useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.href = "/";
  }
}, []);

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

    const handleLogin = async () => {
  try {
    const API_URL = import.meta.env.VITE_API_URL;

const res = await fetch(`${API_URL}/api/auth/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ email, password })
});

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      window.location.href = "/";
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};
    return(
        <div style={{
            display:"flex",
            height:"100vh",
            alignItems:"center",
            justifyContent:"center",
            backgroundColor:"white"
   
        }}>
            

            <div style={{

               display: "flex",
              width: "90%",
              maxWidth: "1100px",
              height: "85vh", 
              gap:"40px" 
             }}>
            

            <div style={{

                flex: 0.9,
                height:"100%",
                borderRadius: "20px",
                overflow: "hidden",
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
            }}>

                <img
                src={logo}
                alt="logo"
                style={{
                    position: "absolute",
                    top: "20px",
                    left:"20px",
                    width:"90px"
                }}
                />

              <div style={{
                width: "260px",
                borderRadius: "20px",
                overflow: "hidden",
                background: "linear-gradient(to bottom,orange,red)",
                boxShadow: "0 10px 25px rgba(0.0.0.0.2)",
                textAlign: "center",
                color: "white",
                maxWidth:"400px"
             }}>
                
             </div>

            </div>

           

            <div style={{

                flex: 1,
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                paddingLeft: "40px"
                
           }}>

            <div style={{
                width: "380px",
            }}>


             <h2 style={{
                marginBottom: "25px",
                fontWeight: "600",
                color: "#1b3887",
                fontSize:"22px"
             }}>
               Login to your Productr Account
            </h2>

            <label style={{ marginBottom: "5px", fontSize: "14px" }}>
               Email or Phone number
            </label>

            <input
              type="email"
              placeholder="Enter email or phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width:"100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                marginBottom: "20px",
                outline:"none"
              }}
              />

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                    width: "100%",
                    padding: "12px",
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
                fontWeight:"500",
                padding: "12px",
                background: "#1e3a8a",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
             }}>
                Login
             </button>


            <div style={{
                marginTop: "50px",
                padding: "18px",
                border: "1px dashed rgb(204, 204, 204)",
                textAlign: "center",
                borderRadius: "8px"
            }}>

           <p style={{ fontSize: "12px", color: "#555" }}>

            Don't have a Productr Account?
             </p>

            <span
            onClick={() => navigate("/signup")}
             style={{

                color: "#2563eb",
                fontWeight: "500",
                cursor: "pointer"
             }}>

                Signup Here
            </span>
            </div>
            </div>

            </div>  
        </div>
        </div>
    )
}
export default Login;
