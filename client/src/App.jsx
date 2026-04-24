import { Link } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import {Routes, Route} from "react-router-dom";

import Products from "./pages/products";



function App(){
  return (

    <BrowserRouter>
    <div style={{
      display:"flex",
    }}>
      <div style={{
        width:"220px",
        display:window.inner < 768 ? "none" : "block",
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
           backgroundColor: "#1d2837",
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
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/products" element={<Products />} />
</Routes>

    </div>
    </div>
    </BrowserRouter>
  );
} 

export default App;