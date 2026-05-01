import Signup from "./pages/Signup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";

import Products from "./pages/Products";



function Layout({ children }) {

  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("token"); 
  navigate("/login");               
  };

  return (
  
    <div style={{
      display:"flex",
    }}>
      <div style={{
        width:"220px",
        display:window.innerWidth < 768 ? "none" : "block",
        backgroundColor:"#111827",
        padding:"20px",
        color:"white",
        height:"100vh"
      }}>
        <h2 style={{
          fontSize:"20px",
          
          
        }}>
          Productr 
        </h2>
        

        <div style={{
          marginTop:"30px"
        }}>

          <Link to="/" style={{ textDecoration: "none" }}>
          <div style={{
           padding: "10px",
           borderRadius: "8px",
           
           color: "white",
           marginBottom: "10px",
           cursor: "pointer",
           outline:"none"
         }}>
           Home
           </div>
         </Link>

           <Link to="/products" style={{ 
            textDecoration: "none",
            outline:"none" }}>
           <div style={{

             padding: "10px",
             borderRadius: "8px",
             color: "white",
             cursor: "pointer"
           }}>

    Products
  </div>
</Link>

        </div>
      </div>
        <div style={{
          flex:1,
          width:"100%",
          backgroundColor:"#f3f4f6",
          padding:"10px",
          minHeight:"100vh"
        }}>
      <div style={{
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  padding: "12px 20px",
  backgroundColor: "white",
  borderBottom: "1px solid #e5e7eb"
}}>


<div
    onClick={() => setShowDropdown(!showDropdown)}
    style={{
      width: "35px",
      height: "35px",
      borderRadius: "50%",
      backgroundColor: "#d1d5db",
      cursor: "pointer"
      }}
    />
{showDropdown && (
      <div style={{
        position: "absolute",
        top: "45px",
        right: "0",
        background: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        borderRadius: "8px",
        width: "120px",
        padding: "8px",
        zIndex: 100
      }}>


      <div
        onClick={handleLogout}
        style={{
            padding: "8px",
            cursor: "pointer",
            borderRadius: "6px"
          }}
          onMouseEnter={(e) => e.target.style.background = "#f3f4f6"}
          onMouseLeave={(e) => e.target.style.background = "white"}
        >
          Logout
        </div>

  </div>
)}
      </div>
        {children}
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
    </Routes>
    </Router>
  );
} 

export default App;