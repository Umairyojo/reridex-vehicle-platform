import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./AdminDashboard.module.css";

// 🔥 OPTIMIZATION: Force Cloudinary to serve TINY 100px thumbnails for the table lists.
// This prevents the dashboard from downloading 50MB of data when you have 200 bikes.
const optimizeThumbnailUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/100x60?text=No+Image';
  if (url.includes('res.cloudinary.com') && !url.includes('/upload/f_auto')) {
    // We add w_150 to drastically crush the file size for table views
    return url.replace('/upload/', '/upload/f_auto,q_auto,w_150/'); 
  }
  return url;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inventory");
  const [inventoryView, setInventoryView] = useState("list");

  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentBike, setCurrentBike] = useState({
    id: null, title: "", category: "sports", brand: "", location: "",
    status: "UNRESERVED", tag: "", vehicleNo: "", price: "", originalPrice: "",
    emi: "", kms: "", owners: "1st Owner", makeYear: "", regYear: "", imageUrls: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [systemMessage, setSystemMessage] = useState("");

  const [newCity, setNewCity] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetInput, setResetInput] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const endpoints = {
    sellRequests: `${API_BASE}/api/leads/sell`,
    valuationLeads: `${API_BASE}/api/leads/valuation`,
    buyerLeads: `${API_BASE}/api/leads/view-more`,
    testDrives: `${API_BASE}/api/leads/test-drive`,
    inventory: `${API_BASE}/api/bikes`,
    locations: `${API_BASE}/api/locations`,
  };

  const handleLogout = () => {
    localStorage.removeItem("reRideX_admin_auth");
    toast.success("Securely logged out.");
    navigate("/admin");
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = endpoints[activeTab];
      if (activeTab === "inventory") {
        url += "?size=1000"; 
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const result = await response.json();
      
      let finalSafeArray = [];
      if (Array.isArray(result)) {
        finalSafeArray = result;
      } else if (result && typeof result === "object") {
        finalSafeArray = result.bikes || result.content || result.data || [];
        if (!Array.isArray(finalSafeArray)) finalSafeArray = [];
      }
      
      finalSafeArray.sort((a, b) => a.id - b.id);
      setDashboardData(finalSafeArray);
      
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error(`Cannot connect to server.`);
      setDashboardData([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    const loadingToast = toast.loading("Refreshing data...");
    await fetchData();
    toast.success("Data is up to date!", { id: loadingToast });
  };

  const handleResetAllData = () => {
    if (activeTab === "locations") {
      toast.error("Locations cannot be bulk reset from here.");
      return;
    }
    setResetInput(""); 
    setShowResetModal(true); 
  };

  const confirmResetAllData = async () => {
    if (resetInput !== "DELETE") {
      toast.error("You must type exactly 'DELETE' to confirm.");
      return;
    }

    setShowResetModal(false);
    const loadingToast = toast.loading("Wiping all data...");
    const sectionName = activeTab.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
    
    try {
      const response = await fetch(`${endpoints[activeTab]}/all`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success(`All ${sectionName} data wiped successfully!`, { id: loadingToast });
        fetchData(); 
      } else {
        toast.error("Backend blocked the request (403 Forbidden).", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Server error. Could not reach backend.", { id: loadingToast });
    }
  };

  useEffect(() => {
    fetchData();
    setSystemMessage("");
    if (activeTab === "inventory") setInventoryView("list");
  }, [activeTab]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const downloadCSV = (tableData, filename) => {
    if (!tableData || tableData.length === 0) {
      toast.error("No data available to download!");
      return;
    }
    const headers = Object.keys(tableData[0]).join(",");
    const rows = tableData.map((obj) =>
        Object.values(obj).map((val) => {
            if (typeof val === "object" && val !== null) return `"[Nested Data]"`;
            return `"${String(val).replace(/"/g, '""') || ""}"`;
          }).join(",")
      ).join("\n");

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    toast.success(`${filename} downloaded successfully!`);
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!newCity.trim()) return;
    setIsSubmitting(true);
    setSystemMessage("");

    try {
      const response = await fetch(endpoints.locations, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityName: newCity.trim() }),
      });
      if (response.ok) {
        toast.success("City added successfully!");
        setNewCity("");
        fetchData();
      } else {
        toast.error("Failed to add city.");
      }
    } catch (err) {
      toast.error("Network Error: Could not reach the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLocation = async (id) => {
    if (!window.confirm("Are you sure you want to remove this city? It will disappear from the Navbar.")) return;
    try {
      const response = await fetch(`${endpoints.locations}/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("City removed successfully.");
        fetchData();
      } else {
        toast.error("Failed to delete city.");
      }
    } catch (err) {
      toast.error("Server error while deleting.");
    }
  };

  const moveImage = (index, direction) => {
    const newImages = [...currentBike.imageUrls];
    if (direction === "left" && index > 0) {
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    } else if (direction === "right" && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    }
    setCurrentBike((prev) => ({ ...prev, imageUrls: newImages }));
  };

  const handleSaveBike = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSystemMessage("");
    if (inventoryView === "add" && imageFiles.length === 0) {
      toast.error("Please select at least one image file.");
      setIsSubmitting(false);
      return;
    }

    const loadingToast = toast.loading("Uploading images & saving bike data...");

    const formData = new FormData();
    formData.append("bikeData", new Blob([JSON.stringify(currentBike)], { type: "application/json" }));
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append("images", imageFiles[i]);
    }
    const isEdit = inventoryView === "edit";
    const url = isEdit ? `${endpoints.inventory}/${currentBike.id}` : endpoints.inventory;
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, { method, body: formData });
      if (response.ok) {
        toast.success(isEdit ? "Bike updated successfully!" : "Bike added to inventory!", { id: loadingToast });
        setImageFiles([]);
        fetchData();
        setTimeout(() => setInventoryView("list"), 1500);
      } else {
        toast.error("Failed to save bike. Please check your data.", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Network Error: Upload failed.", { id: loadingToast });
      setSystemMessage("❌ Server error or connection lost.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBike = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this bike and its images?")) return;
    try {
      const response = await fetch(`${endpoints.inventory}/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Bike and cloud images deleted successfully.");
        fetchData();
      } else {
        toast.error("Failed to delete bike.");
      }
    } catch (err) {
      toast.error("Network error. Check connection.");
    }
  };

  const handleDownloadZip = (id) => {
    window.open(`${endpoints.inventory}/${id}/export`, "_blank");
  };

  const startEdit = (bike) => {
    setCurrentBike({
      ...bike,
      brand: bike.brand || "",
      location: bike.location || "",
      originalPrice: bike.originalPrice || "",
      tag: bike.tag || "",
      vehicleNo: bike.vehicleNo || "", 
      status: bike.status || "UNRESERVED",
      makeYear: bike.makeYear || "",
      owners: bike.owners || "1st Owner",
      regYear: bike.regYear || "",
      imageUrls: bike.imageUrls || bike.images || [],
    });
    setInventoryView("edit");
    setSystemMessage("");
  };

  const startAdd = () => {
    setCurrentBike({
      id: null, title: "", category: "sports", brand: "", location: "",
      status: "UNRESERVED", tag: "", vehicleNo: "", price: "", originalPrice: "",
      emi: "", kms: "", owners: "1st Owner", makeYear: "", regYear: "", imageUrls: [],
    });
    setImageFiles([]);
    setInventoryView("add");
    setSystemMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBike((prev) => ({ ...prev, [name]: value }));
  };

  const renderInventoryTab = () => {
    if (inventoryView === "add" || inventoryView === "edit") {
      return (
        <div className={styles.addBikeForm}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, color: "#004AAD" }}>{inventoryView === "add" ? "➕ Add New Bike" : "✏️ Edit Bike Details"}</h3>
            <button type="button" onClick={() => setInventoryView("list")} style={{ padding: "8px 15px", cursor: "pointer", background: "#e0e0e0", border: "none", borderRadius: "5px" }}>&larr; Back to List</button>
          </div>
          {systemMessage && <div className={styles.successMsg}>{systemMessage}</div>}

          <form onSubmit={handleSaveBike}>
            <div className={styles.formGrid}>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <h4 style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px", color: "#555" }}>1. Basic Information</h4>
              </div>
              <div className={styles.inputGroup}>
                <label>Bike Title / Name</label>
                <input type="text" name="title" value={currentBike.title} onChange={handleInputChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Brand</label>
                <input type="text" name="brand" value={currentBike.brand} onChange={handleInputChange} placeholder="e.g. Yamaha" />
              </div>
              <div className={styles.inputGroup}>
                <label>Category</label>
                <select name="category" value={currentBike.category} onChange={handleInputChange}>
                  <option value="sports">Sports Bikes</option>
                  <option value="commuter">Commuter Bikes</option>
                  <option value="scooters">Scooters</option>
                  <option value="travel">Travel & Adventure</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Custom Tag / Label (Optional)</label>
                <input type="text" name="tag" value={currentBike.tag} onChange={handleInputChange} placeholder="e.g. NEW, HIGH DISCOUNT" />
              </div>
              <div className={styles.inputGroup}>
                <label>Location / Branch</label>
                <input type="text" name="location" value={currentBike.location} onChange={handleInputChange} placeholder="e.g. Jayanagar Branch" />
              </div>
              <div className={styles.inputGroup}>
                <label>Current Status</label>
                <select name="status" value={currentBike.status} onChange={handleInputChange}>
                  <option value="UNRESERVED">Unreserved (Visible & Available)</option>
                  <option value="RESERVED">Reserved (Shows Badge & Blocks Booking)</option>
                </select>
              </div>

              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <h4 style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px", color: "#555", marginTop: "15px" }}>2. Pricing</h4>
              </div>
              <div className={styles.inputGroup}>
                <label>Selling Price (₹)</label>
                <input type="number" name="price" value={currentBike.price} onChange={handleInputChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Original Market Price (₹)</label>
                <input type="number" name="originalPrice" value={currentBike.originalPrice} onChange={handleInputChange} placeholder="Used for strikethrough" />
              </div>
              <div className={styles.inputGroup}>
                <label>Starting EMI (₹)</label>
                <input type="number" name="emi" value={currentBike.emi} onChange={handleInputChange} required />
              </div>

              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <h4 style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px", color: "#555", marginTop: "15px" }}>3. Vehicle Specifications</h4>
              </div>
              
              <div className={styles.inputGroup}>
                <label style={{ color: "#dc3545" }}>Vehicle Number (Hidden from Public) *</label>
                <input type="text" name="vehicleNo" value={currentBike.vehicleNo} onChange={handleInputChange} placeholder="e.g. MH-12-AB-1234" style={{ borderColor: "#dc3545" }} required />
              </div>

              <div className={styles.inputGroup}>
                <label>Kilometers Driven</label>
                <input type="text" name="kms" value={currentBike.kms} onChange={handleInputChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Ownership</label>
                <select name="owners" value={currentBike.owners} onChange={handleInputChange}>
                  <option value="1st Owner">1st Owner</option>
                  <option value="2nd Owner">2nd Owner</option>
                  <option value="3rd Owner">3rd Owner</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Manufacturing Year</label>
                <input type="text" name="makeYear" value={currentBike.makeYear} onChange={handleInputChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Registration Year</label>
                <input type="text" name="regYear" value={currentBike.regYear} onChange={handleInputChange} required />
              </div>

              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <h4 style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px", color: "#555", marginTop: "15px" }}>4. Media</h4>
              </div>
              {inventoryView === "edit" && currentBike.imageUrls.length > 0 && (
                <div className={`${styles.inputGroup} ${styles.fullWidth}`} style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", marginBottom: "15px" }}>
                  <label>Rearrange Existing Images (Leftmost is Main Image)</label>
                  <div style={{ display: "flex", gap: "15px", overflowX: "auto", padding: "10px 0" }}>
                    {currentBike.imageUrls.map((url, idx) => (
                      <div key={idx} style={{ position: "relative", flexShrink: 0 }}>
                        <img src={optimizeThumbnailUrl(url)} alt={`img-${idx}`} style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "5px", border: idx === 0 ? "3px solid #004AAD" : "1px solid #ccc" }} />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                          <button type="button" onClick={() => moveImage(idx, "left")} disabled={idx === 0} style={{ padding: "2px 8px", cursor: idx === 0 ? "not-allowed" : "pointer" }}>⬅️</button>
                          <button type="button" onClick={() => moveImage(idx, "right")} disabled={idx === currentBike.imageUrls.length - 1} style={{ padding: "2px 8px", cursor: idx === currentBike.imageUrls.length - 1 ? "not-allowed" : "pointer" }}>➡️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label>{inventoryView === "edit" ? "Upload NEW Images (WARNING: This deletes current images)" : "Upload Bike Images (Select 8-10 max)"}</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setImageFiles(e.target.files)} required={inventoryView === "add"} style={{ padding: "8px", border: "1px dashed #ccc", cursor: "pointer", background: "#f9f9f9" }} />
              </div>
            </div>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting} style={{ marginTop: "20px", width: "100%", padding: "15px", fontSize: "1.1rem" }}>
              {isSubmitting ? "Saving..." : "💾 Save Bike Data"}
            </button>
          </form>
        </div>
      );
    }

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <p style={{ color: "#666", margin: 0 }}>Manage your live database inventory.</p>
          <button onClick={startAdd} style={{ background: "#28a745", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}>➕ Add New Bike</button>
        </div>

        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title & Vehicle No</th>
              <th>Status</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.map((row) => {
              const images = row.imageUrls || row.images || [];
              const firstImg = images.length > 0 ? optimizeThumbnailUrl(images[0]) : "https://via.placeholder.com/50";
              return (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td><img src={firstImg} alt="bike" style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px" }} loading="lazy" /></td>
                  <td>
                    <strong>{row.brand} {row.title}</strong><br />
                    {row.vehicleNo && <small style={{ color: "#dc3545", fontWeight: "bold" }}>🚗 {row.vehicleNo}</small>}
                    {!row.vehicleNo && <small style={{ color: "#777" }}>{row.location}</small>}
                  </td>
                  <td>
                    <span className={styles.statusPill} style={{ background: row.status === "RESERVED" ? "#ffeeba" : "#e2e3e5", color: row.status === "RESERVED" ? "#856404" : "#383d41", padding: "4px 10px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "bold" }}>
                      {row.status && row.status.trim() !== "" ? row.status : "UNRESERVED"}
                    </span>
                  </td>
                  <td>₹{row.price}</td>
                  <td style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => startEdit(row)} style={{ background: "#ffc107", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Edit</button>
                    <button onClick={() => handleDeleteBike(row.id)} style={{ background: "#dc3545", color: "white", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
                    <button onClick={() => handleDownloadZip(row.id)} style={{ background: "#17a2b8", color: "white", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer" }}>⬇️ ZIP</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === "inventory") return renderInventoryTab();
    if (loading) return <div className={styles.loadingText}>Fetching data...</div>;

    if (dashboardData.length === 0 && activeTab !== "locations")
      return <div className={styles.loadingText}>No records found.</div>;

    switch (activeTab) {
      case "sellRequests":
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
              <button onClick={() => downloadCSV(dashboardData, "Sell_Requests.csv")} style={{ background: "#28a745", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>⬇️ Export to Excel</button>
            </div>
            <table className={styles.dataTable}>
              <thead><tr><th>ID</th><th>Name</th><th>Mobile</th><th>Brand</th><th>Model</th><th>Reg No</th><th>City</th><th>Date</th></tr></thead>
              <tbody>
                {dashboardData.map((row) => (
                  <tr key={row.id}><td>{row.id}</td><td>{row.name}</td><td>{row.mobile}</td><td>{row.brand}</td><td>{row.model}</td><td>{row.regNo}</td><td>{row.city}</td><td>{formatDate(row.createdAt)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "valuationLeads":
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
              <button onClick={() => downloadCSV(dashboardData, "Valuation_Leads.csv")} style={{ background: "#28a745", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>⬇️ Export to Excel</button>
            </div>
            <table className={styles.dataTable}>
              <thead><tr><th>ID</th><th>Full Name</th><th>Mobile</th><th>Brand</th><th>Model</th><th>Vehicle No</th><th>Owners</th><th>KM Driven</th><th>Requested At</th></tr></thead>
              <tbody>
                {dashboardData.map((row) => (
                  <tr key={row.id}><td>{row.id}</td><td>{row.fullName}</td><td>{row.mobileNumber}</td><td>{row.brand}</td><td>{row.model}</td><td>{row.vehicleNo}</td><td>{row.noOfOwners}</td><td>{row.kmDriven}</td><td>{formatDate(row.requestedAt)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "buyerLeads":
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
              <button onClick={() => downloadCSV(dashboardData, "Buyer_Leads.csv")} style={{ background: "#28a745", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>⬇️ Export to Excel</button>
            </div>
            <table className={styles.dataTable}>
              <thead><tr><th>ID</th><th>Name</th><th>Mobile</th><th>Segment</th><th>Budget</th><th>Bike ID Ref</th><th>Date</th></tr></thead>
              <tbody>
                {dashboardData.map((row) => (
                  <tr key={row.id}><td>{row.id}</td><td>{row.name}</td><td>{row.mobile}</td><td>{row.segment}</td><td>{row.budget}</td><td><strong>#{row.bikeId}</strong></td><td>{formatDate(row.createdAt)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "testDrives":
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
              <button onClick={() => downloadCSV(dashboardData, "Test_Drive_Bookings.csv")} style={{ background: "#28a745", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>⬇️ Export to Excel</button>
            </div>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer Info</th>
                  <th>Location & Time Slot</th>
                  <th>Complete Vehicle Specifications</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.map((row) => {
                  const hasBike = row.bike != null;
                  const bikeImg = hasBike && row.bike.imageUrls?.length > 0 ? optimizeThumbnailUrl(row.bike.imageUrls[0]) : "https://via.placeholder.com/80";

                  return (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td style={{ verticalAlign: "top", minWidth: "140px" }}>
                        <strong style={{ fontSize: "1.05rem", color: "#333" }}>{row.name}</strong><br />
                        <div style={{ color: "#004AAD", fontWeight: "600", marginTop: "4px" }}>📞 {row.mobile}</div>
                      </td>
                      <td style={{ verticalAlign: "top", minWidth: "160px" }}>
                        <div>📍 {row.area}, {row.city}</div>
                        <div style={{ color: "#777", fontSize: "0.85rem" }}>PIN: {row.pincode}</div>
                        <div style={{ background: "#eef2f5", padding: "4px 8px", borderRadius: "4px", fontSize: "0.85rem", marginTop: "8px", display: "inline-block", fontWeight: "bold", color: "#444" }}>⏰ {row.timeSlot || "Anytime"}</div>
                      </td>
                      <td style={{ verticalAlign: "top" }}>
                        <div style={{ display: "flex", gap: "15px" }}>
                          {hasBike && <img src={bikeImg} alt="bike" loading="lazy" style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "6px", border: "1px solid #ddd", flexShrink: 0 }} />}
                          <div style={{ flexGrow: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                              <strong style={{ fontSize: "1.1rem", color: "#111" }}>{row.bikeName || `Bike #${row.bikeId}`}</strong>
                              {hasBike && <span style={{ background: "#d4edda", color: "#155724", padding: "2px 8px", borderRadius: "12px", fontWeight: "bold", fontSize: "0.9rem" }}>₹{row.bike.price}</span>}
                            </div>
                            
                            {row.vehicleNo && row.vehicleNo !== "N/A" && (
                              <div style={{ color: "#dc3545", fontWeight: "bold", fontSize: "0.95rem", marginBottom: "6px" }}>
                                🚗 Vehicle No: {row.vehicleNo}
                              </div>
                            )}

                            {hasBike ? (
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px", fontSize: "0.85rem", color: "#555" }}>
                                <div><span style={{ color: "#999" }}>KMs:</span> <strong>{row.bike.kms}</strong></div>
                                <div><span style={{ color: "#999" }}>Make:</span> <strong>{row.bike.makeYear}</strong></div>
                                <div><span style={{ color: "#999" }}>Reg:</span> <strong>{row.bike.regYear || row.bike.makeYear}</strong></div>
                                <div><span style={{ color: "#999" }}>Owner:</span> <strong>{row.bike.owners}</strong></div>
                              </div>
                            ) : (
                              <span style={{ color: "#dc3545", fontSize: "0.85rem" }}>⚠️ Full bike details unavailable</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ verticalAlign: "top" }}>
                        <span style={{ color: row.paymentStatus?.includes("PAID") ? "green" : "#d32f2f", fontWeight: "bold", fontSize: "0.85rem" }}>
                          {row.paymentStatus || "PENDING"}
                        </span>
                      </td>
                      <td style={{ verticalAlign: "top", color: "#777", fontSize: "0.9rem" }}>{formatDate(row.bookedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );

      case "locations":
        return (
          <div>
            <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #ddd" }}>
              <h3 style={{ margin: "0 0 10px 0", color: "#004AAD" }}>Add New City</h3>
              <form onSubmit={handleAddLocation} style={{ display: "flex", gap: "10px" }}>
                <input type="text" value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="e.g. Pune, Delhi..." required style={{ flexGrow: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
                <button type="submit" disabled={isSubmitting} style={{ background: "#28a745", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", fontWeight: "bold", cursor: isSubmitting ? "not-allowed" : "pointer" }}>{isSubmitting ? "Adding..." : "➕ Add City"}</button>
              </form>
            </div>

            <table className={styles.dataTable}>
              <thead><tr><th>ID</th><th>City Name</th><th>Actions</th></tr></thead>
              <tbody>
                {dashboardData.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: "center" }}>No cities found. Add one above.</td></tr>
                ) : null}
                {dashboardData.map((loc) => (
                  <tr key={loc.id}>
                    <td>{loc.id}</td>
                    <td><strong>{loc.cityName}</strong></td>
                    <td>
                      <button onClick={() => handleDeleteLocation(loc.id)} style={{ background: "#dc3545", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>🗑️ Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>ReRideX Admin</div>
        <button className={`${styles.navButton} ${activeTab === "inventory" ? styles.activeTab : ""}`} onClick={() => setActiveTab("inventory")}>📦 Manage Inventory</button>
        <button className={`${styles.navButton} ${activeTab === "sellRequests" ? styles.activeTab : ""}`} onClick={() => setActiveTab("sellRequests")}>📈 Sell Requests</button>
        <button className={`${styles.navButton} ${activeTab === "valuationLeads" ? styles.activeTab : ""}`} onClick={() => setActiveTab("valuationLeads")}>📋 Valuation Leads</button>
        <button className={`${styles.navButton} ${activeTab === "buyerLeads" ? styles.activeTab : ""}`} onClick={() => setActiveTab("buyerLeads")}>🛍️ Buyer Leads</button>
        <button className={`${styles.navButton} ${activeTab === "testDrives" ? styles.activeTab : ""}`} onClick={() => setActiveTab("testDrives")}>🏍️ Test Drives</button>
        <button className={`${styles.navButton} ${activeTab === "locations" ? styles.activeTab : ""}`} onClick={() => setActiveTab("locations")}>🌍 Manage Locations</button>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.headerRow}>
          <h2>{activeTab === "inventory" ? "Inventory Control" : activeTab === "locations" ? "City Configuration" : "Lead Management"}</h2>
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            
            {activeTab !== "locations" && (
              <button onClick={handleResetAllData} disabled={loading} style={{ background: "#dc3545", color: "#fff", border: "none", padding: "10px 15px", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px", opacity: loading ? 0.7 : 1, boxShadow: "0 2px 4px rgba(220, 53, 69, 0.3)" }} title={`Delete all data in ${activeTab}`}>
                🗑️ Clear All Data
              </button>
            )}

            <button className={styles.refreshBtn} onClick={handleRefresh} disabled={loading} style={{ cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>{loading ? "↻ Refreshing..." : "↻ Refresh Data"}</button>
            <button onClick={handleLogout} style={{ background: "#333", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>🚪 Secure Logout</button>
          </div>
        </div>
        <div className={styles.tableCard}>{renderContent()}</div>
      </div>

      {showResetModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(5px)" }}>
          <div style={{ background: "white", width: "90%", maxWidth: "450px", padding: "30px", borderRadius: "12px", textAlign: "center", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", animation: "fadeInUp 0.3s ease-out forwards" }}>
            <h2 style={{ color: "#dc3545", margin: "0 0 15px 0", fontSize: "1.8rem" }}>⚠️ DANGER ZONE</h2>
            <p style={{ color: "#555", marginBottom: "20px", lineHeight: "1.5" }}>You are about to permanently wipe all <strong>{activeTab.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}</strong> data from the Database, Google Sheets, and Cloudinary. This cannot be undone.</p>
            <p style={{ fontSize: "0.9rem", color: "#333", marginBottom: "10px", fontWeight: "bold" }}>Please type <span style={{ color: "#dc3545" }}>DELETE</span> to confirm:</p>
            <input type="text" value={resetInput} onChange={(e) => setResetInput(e.target.value)} placeholder="Type DELETE here" style={{ width: "100%", padding: "12px", border: "2px solid #ccc", borderRadius: "8px", fontSize: "1.1rem", textAlign: "center", marginBottom: "20px", textTransform: "uppercase" }} />
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => setShowResetModal(false)} style={{ background: "#e0e0e0", color: "#333", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", flex: 1 }}>Cancel</button>
              <button onClick={confirmResetAllData} style={{ background: "#dc3545", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", flex: 1, opacity: resetInput === "DELETE" ? 1 : 0.5 }} disabled={resetInput !== "DELETE"}>Confirm Wipe</button>
            </div>
          </div>
          <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;