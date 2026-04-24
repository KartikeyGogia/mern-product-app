import React, { useEffect, useState } from 'react';

function Home() {
    const [activeTab, setActiveTab] = useState("home");

    return (
        <div style={{
            padding: "20px",
        }}>
            <div style={{
                display:"flex",
                gap:"20px",
                borderBottom:"1px solid #e5e7eb",
                marginBottom:"20px"
            }}>
                <span
          onClick={() => setActiveTab("published")}
          style={{
            cursor: "pointer",
            paddingBottom: "8px",
            borderBottom: activeTab === "published" ? "2px solid blue" : "none"
          }}
        >
          Published
        </span>

        <span
          onClick={() => setActiveTab("unpublished")}
          style={{
            cursor: "pointer",
            paddingBottom: "8px",
            borderBottom: activeTab === "unpublished" ? "2px solid blue" : "none"
          }}
        >
          Unpublished
        </span>
      </div>

     
      <div style={{
        height: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#6b7280"
      }}>
        <div style={{ fontSize: "40px" }}></div>

        <h3 style={{ marginTop: "10px" }}>
          No {activeTab === "published" ? "Published" : "Unpublished"} Products
        </h3>

        <p style={{ fontSize: "14px" }}>
          Your {activeTab} products will appear here.
        </p>
      </div>

    </div>
  );
}

export default Home;