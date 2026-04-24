import {useEffect, useState} from 'react';
import axios from 'axios';



function Products() {
  const BASE_URL = "https://mern-backend-det8.onrender.com";
  const [brand, setBrand] = useState("");
  const[images, setImages] = useState([]);
  const[showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [editingId, setEditingId] = useState(null);


const togglePublish = (id) => {
  setProducts(products.map(p =>
    p._id === id ? { ...p, isPublished: !p.isPublished } : p
  ));
};

  const handleImageChange = (e) => {
  const files = Array.from(e.target.files);

  const newImages = files.map((file) => ({
    file,
    url: URL.createObjectURL(file),
  }));

  setImages((prev) => [...prev, ...newImages]);
};
  
  
  
  useEffect(() => {
  getProducts();
}, []);

  async function addProduct() {
  try {
    if (editingId) {
      
      const res = await axios.put(
        `${BASE_URL}/api/products/${editingId}`,
        { title, description, price }
      );

      setProducts(
        products.map((p) =>
          p._id === editingId ? res.data : p
        )
      );

      setEditingId(null);
    } else {
      
      const res = await axios.post(
        `${BASE_URL}/api/products`,
        { title, description, price }
      );

      setProducts([...products, res.data]);
    }

    
    setTitle("");
    setDescription("");
    setPrice(0);

  } catch (err) {
    console.log(err);
  }
}

  async function getProducts() {
    try {
      const res = await axios.get(`${BASE_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.log("Error", err);
    }
  }

  async function deleteProduct(id) {
  try {
    await axios.delete(`${BASE_URL}/api/products/${id}`);
    setProducts(products.filter((p) => p._id !== id));
  } catch (err) {
    console.log(err);
  }
}

function handleEdit(product) {
  setTitle(product.title);
  setDescription(product.description);
  setPrice(product.price);
  setEditingId(product._id);
}


  return (
    <div>

    <div style={{
      display:"flex",
      justifyContent:"space-between",
      alignItems:"center",
      marginBottom:"20px"
    }}>


      <h1 style={{
        margin:"0"
      }}>My Products
      </h1>

    <button
      onClick={() => setShowModal(true)}
      style={{
        padding: "8px 14px",
        background: "none",
        color: "grey",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        marginBottom: "20px",
        fontSize:"16px"
      }}
    >
      + Add Product
    </button>
    </div>

<h2 style={{
          marginTop:"20px",
          marginBottom:"10px"
        }}>
          Products
        </h2>
    
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))",
        gap:"20px",
        marginTop:"20px"
      }}>

        

      {products.length === 0 ? (
        <p>No data</p>
      ) : (
        

      products.map((product) => (
        <div 
        key={product._id} 
        style={{
          
          background:"#fff",
          padding:"18px",
          borderRadius:"14px",
          boxShadow:"0 4px 12px rgba(0,0,0,0.1)",
          
          marginTop:"20px"
        }}
        onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.03)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
  }}  
        >
          
          <div style={{
            marginBottom:"10px",}}>
              <img
              src="https://picsum.photos/200"
              alt="product"
              style={{
                width:"100%",
                height:"160px",
                objectFit:"cover",
                borderRadius:"10px"
              }}
              />

              
          </div>

          <p style={{ marginTop:"10px", fontSize:"16px", fontWeight:"600" }}>
  {product.title}
</p>

<p style={{ color:"#555", fontSize:"13px" }}>
  Product Type: {product.productType || "Food"}
</p>

<p style={{ color:"#555", fontSize:"13px" }}>
  Brand: {product.brand || "CakeZone"}
</p>

<p style={{ color:"#555", fontSize:"13px" }}>
  Stock: {product.stock || 100}
</p>

<p style={{
  fontWeight:"600",
  marginTop:"6px",
  fontSize:"14px"
}}>
  ₹{Number(product.price).toFixed(2)}
</p>


<div style={{
  display:"flex",
  gap:"8px",
  marginTop:"12px"
}}>
<button
  onClick={() => togglePublish(product._id)}
  style={{
    padding: "6px 10px",
    background: product.isPublished ? "green" : "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  {product.isPublished ? "Unpublish" : "Publish"}
</button>

            <div style={{
  display: "flex",
  gap: "10px",
  marginTop: "10px"
}}>

  <button onClick={() => handleEdit(product)}
    style={{
      padding: "6px 10px",
      background: "#e5e7eb",
      color: "black",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize:"14px"
    }}
  >
    Edit
  </button>

  <button
    onClick={() => deleteProduct(product._id)}
    style={{
      padding: "6px 10px",
      background: "#f3f4f6",
      color: "black",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "13px"
    }}
  >
    Delete 🗑
  </button>
  </div>



</div>

         </div>
          
      ))
      )}
      </div>
      
  {showModal && (
  <div
    onClick={() => setShowModal(false)}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}
  >
  
    <div
     onClick={(e) => e.stopPropagation()}
     style={{
     background: "white",
     padding: "20px",
     borderRadius: "10px",
     width: "420px",
     boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
   }}>

      <h3 style={{ marginBottom: "18px" }}>
  {editingId ? "Edit Product" : "Add Product"}
</h3>


<label style={{ fontSize: "13px", fontWeight: "500" }}>Product Name</label>
<input
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db"
  }}
/>


<label style={{ fontSize: "13px", fontWeight: "500" }}>
  Upload Product Images
</label>

<div style={{
  border: "1px dashed #d1d5db",
  borderRadius: "10px",
  padding: "12px",
  marginTop: "6px",
  marginBottom: "12px"
}}>

  
  <div style={{
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  }}>
    {images.map((img, index) => (
      <img
        key={index}
        src={img.url}
        alt="preview"
        style={{
          width: "60px",
          height: "60px",
          objectFit: "cover",
          borderRadius: "6px"
        }}
      />
    ))}
  </div>

  
  <label style={{
    display: "block",
    marginTop: "10px",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "13px"
  }}>
    Add More Photos
    <input
      type="file"
      multiple
      onChange={handleImageChange}
      style={{ display: "none" }}
    />
  </label>

</div>


<label style={{ fontSize: "13px", fontWeight: "500" }}>Product Type</label>
<select
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db"
  }}
>
  <option>Food</option>
  <option>Electronics</option>
</select>


<label style={{ fontSize: "13px", fontWeight: "500" }}>Quantity Stock</label>
<input
  type="number"
  defaultValue={100}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db"
  }}
/>


<label style={{ fontSize: "13px", fontWeight: "500" }}>MRP</label>
<input
  
  value={brand}
  onChange={(e) => setBrand(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db"
  }}
/>

<label style={{ fontSize: "13px", fontWeight: "500" }}>Selling Price</label>
<input
  type="number"
  value={price}
  onChange={(e) => setPrice(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db"
  }}
/>

<label style={{ fontSize: "13px", fontWeight: "500" }}>Brand Name</label>
<input
  type="number"
  value={price}
  onChange={(e) => setPrice(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db"
  }}
/>


<div style={{
  display: "flex",
  justifyContent: "space-between",
  marginTop: "15px"
}}>
  <button
    onClick={() => setShowModal(false)}
    style={{
      background: "#e5e7eb",
      padding: "8px 14px",
      border: "none",
      borderRadius: "6px"
    }}
  >
    Cancel
  </button>

  <button
    onClick={() => {
      addProduct();
      setShowModal(false);
    }}
    style={{
      background: "#2563eb",
      color: "white",
      padding: "8px 14px",
      border: "none",
      borderRadius: "6px"
    }}
  >
    {editingId ? "Update" : "Create"}
  </button>
</div>

    </div>
  </div>
)}
    </div>

  );
}

export default Products;
   