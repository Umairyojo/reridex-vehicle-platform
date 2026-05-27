import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./BikeDetails.module.css";

const _bikeCache = new Map();

const optimizeImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/800x500?text=No+Image+Available';
  if (url.includes('res.cloudinary.com') && !url.includes('/upload/f_auto,q_auto')) {
    return url.replace('/upload/', '/upload/f_auto,q_auto,w_1000/'); 
  }
  return url;
};

// 🔥 OPTIMIZATION: Extracted the Modal into its own component!
// Now, typing in the form ONLY re-renders the form, not the heavy image gallery behind it.
const TestDriveModal = ({ bike, isReserved, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [testForm, setTestForm] = useState({
    name: "", phone: "", area: "", pincode: "", city: "", timeSlot: "",
  });

  const handleInput = (field, value) => {
    let sanitizedValue = value;
    if (field === "name" || field === "city") sanitizedValue = value.replace(/[^A-Za-z\s]/g, "");
    else if (field === "phone") sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
    else if (field === "pincode") sanitizedValue = value.replace(/\D/g, "").slice(0, 6);

    setTestForm((prev) => ({ ...prev, [field]: sanitizedValue }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  const handleTestDriveSubmit = async (e) => {
    e.preventDefault();

    let errors = {};
    if (!testForm.name || testForm.name.trim().length < 3) errors.name = "Valid name is required";
    if (!testForm.phone || testForm.phone.length !== 10) errors.phone = "Valid 10-digit number required";
    
    if (!isReserved) {
      if (!testForm.area) errors.area = "Area is required";
      if (!testForm.pincode || testForm.pincode.length !== 6) errors.pincode = "Valid 6-digit PIN required";
      if (!testForm.city || testForm.city.trim().length < 3) errors.city = "Valid city name is required";
      if (!testForm.timeSlot) errors.timeSlot = "Please select a time slot";
    }
    
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      const payload = {
        name: testForm.name,
        mobile: testForm.phone,
        area: isReserved ? "WAITLIST" : testForm.area,
        pincode: isReserved ? "000000" : testForm.pincode,
        city: isReserved ? "N/A" : testForm.city,
        timeSlot: isReserved ? "WAITLIST" : testForm.timeSlot,
        bikeId: bike.id,
        bikeName: `${bike.brand} ${bike.title}`,
        paymentStatus: "PENDING_OFFLINE",
      };

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/test-drive`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          toast.success(
            isReserved 
              ? `You've been added to the waitlist for the ${bike.brand} ${bike.title}!` 
              : `Booking request received! We will contact you for the test drive soon.`,
            { position: "top-center", duration: 6000, icon: isReserved ? "🔔" : "🏍️" }
          );
          onClose(); // Close the modal on success
        } else {
          throw new Error("Failed to save booking");
        }
      } catch (error) {
        toast.error("Could not reach the server.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(5px)" }}>
      <div style={{ background: "white", width: "90%", maxWidth: "500px", padding: "30px", borderRadius: "15px", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "15px", right: "20px", background: "none", border: "none", fontSize: "1.8rem", color: "#999", cursor: "pointer" }}>×</button>
        <h3 style={{ margin: "0 0 10px 0", color: isReserved ? "#f59e0b" : "#004AAD", fontSize: "1.5rem" }}>
          {isReserved ? "Join Waitlist" : "Book Home Test Drive"}
        </h3>
        <p style={{ margin: "0 0 20px 0", color: "#666", fontSize: "0.95rem" }}>
          {isReserved 
            ? <>The <strong>{bike.brand} {bike.title}</strong> is currently reserved. Enter your details to get notified immediately if it becomes available!</>
            : <>Test ride the <strong>{bike.brand} {bike.title}</strong> at your home.</>
          }
        </p>

        <form onSubmit={handleTestDriveSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem", color: "#333", fontWeight: "bold" }}>Full Name</label>
            <input type="text" value={testForm.name} onChange={(e) => handleInput("name", e.target.value)} placeholder="Enter your name" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: formErrors.name ? "1px solid red" : "1px solid #ccc" }} />
            {formErrors.name && <span style={{ color: "red", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{formErrors.name}</span>}
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem", color: "#333", fontWeight: "bold" }}>Mobile Number</label>
            <input type="tel" value={testForm.phone} onChange={(e) => handleInput("phone", e.target.value)} placeholder="10-digit number" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: formErrors.phone ? "1px solid red" : "1px solid #ccc" }} />
            {formErrors.phone && <span style={{ color: "red", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{formErrors.phone}</span>}
          </div>

          {!isReserved && (
            <>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem", color: "#333", fontWeight: "bold" }}>Locality / Area</label>
                <input type="text" value={testForm.area} onChange={(e) => handleInput("area", e.target.value)} placeholder="e.g. Jayanagar 4th Block" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: formErrors.area ? "1px solid red" : "1px solid #ccc" }} />
                {formErrors.area && <span style={{ color: "red", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{formErrors.area}</span>}
              </div>
              <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem", color: "#333", fontWeight: "bold" }}>PIN Code</label>
                  <input type="tel" value={testForm.pincode} onChange={(e) => handleInput("pincode", e.target.value)} placeholder="6-digit PIN" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: formErrors.pincode ? "1px solid red" : "1px solid #ccc" }} />
                  {formErrors.pincode && <span style={{ color: "red", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{formErrors.pincode}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem", color: "#333", fontWeight: "bold" }}>City</label>
                  <input type="text" value={testForm.city} onChange={(e) => handleInput("city", e.target.value)} placeholder="Enter your city" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: formErrors.city ? "1px solid red" : "1px solid #ccc" }} />
                  {formErrors.city && <span style={{ color: "red", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{formErrors.city}</span>}
                </div>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem", color: "#333", fontWeight: "bold" }}>Preferred Time Slot</label>
                <select value={testForm.timeSlot} onChange={(e) => handleInput("timeSlot", e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: formErrors.timeSlot ? "1px solid red" : "1px solid #ccc", background: "white" }}>
                  <option value="" disabled>Select a time slot</option>
                  <option value="10 AM - 1 PM">10:00 AM - 1:00 PM</option>
                  <option value="1 PM - 4 PM">1:00 PM - 4:00 PM</option>
                  <option value="4 PM - 7 PM">4:00 PM - 7:00 PM</option>
                </select>
                {formErrors.timeSlot && <span style={{ color: "red", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{formErrors.timeSlot}</span>}
              </div>
            </>
          )}
          
          <button type="submit" disabled={isSubmitting} style={{ background: isReserved ? "#f59e0b" : "#004AAD", color: "white", border: "none", padding: "15px", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "bold", cursor: isSubmitting ? "not-allowed" : "pointer", marginTop: "10px" }}>
            {isSubmitting ? "Processing..." : isReserved ? "Confirm Waitlist Request" : "Confirm Test Drive Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

const BikeDetails = () => {
  const { id: routeParam } = useParams();
  const id = routeParam ? routeParam.split('-')[0] : null; 

  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);

  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);
    const fetchBikeDetails = async () => {
      if (_bikeCache.has(id)) {
        setBike(_bikeCache.get(id));
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bikes/${id}`);
        if (!response.ok) throw new Error("Bike not found in inventory.");
        const data = await response.json();
        _bikeCache.set(id, data);
        setBike(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBikeDetails();
  }, [id]);

  if (loading)
    return <div style={{ textAlign: "center", padding: "100px", fontSize: "1.5rem", color: "#004AAD" }}>Loading Vehicle Details...</div>;
  if (error)
    return <div style={{ textAlign: "center", padding: "100px", color: "red", fontSize: "1.5rem" }}>{error}</div>;
  if (!bike) return null;

  const fetchedImages = bike.imageUrls || bike.images || [];
  const displayImages = fetchedImages.length > 0
      ? fetchedImages.map(url => optimizeImageUrl(url))
      : ["https://via.placeholder.com/800x500?text=No+Image+Available"];

  const numericPrice = parseInt(String(bike.price).replace(/,/g, "")) || 0;
  const numericEmi = parseInt(String(bike.emi).replace(/,/g, "")) || 0;
  const numericKms = parseInt(String(bike.kms).replace(/,/g, "")) || 0;
  const formattedPrice = numericPrice.toLocaleString("en-IN");
  const formattedEmi = numericEmi.toLocaleString("en-IN");
  const formattedKms = numericKms.toLocaleString("en-IN");
  const originalPrice = numericPrice > 0 ? Math.floor(numericPrice * 1.18).toLocaleString("en-IN") : "N/A";

  const isReserved = bike.status && bike.status.toUpperCase() === "RESERVED";

  return (
    <div className={styles.detailsPage}>
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbInner}>
          <Link to="/">Home</Link> <span className={styles.slash}>/</span>
          <Link to="/buy">Buy Bikes</Link> <span className={styles.slash}>/</span>
          <span className={styles.currentCrumb} style={{ textTransform: "uppercase" }}>{bike.brand} {bike.title}</span>
        </div>
      </div>

      <div className={styles.mainContainer}>
        <div className={styles.gallerySection}>
          <div className={styles.mainImageWrapper} style={{ position: "relative" }}>
            {bike.tag && bike.tag.trim() !== "" && (
              <div style={{ position: "absolute", top: "15px", left: "15px", background: "#ff5722", color: "white", padding: "6px 16px", borderRadius: "4px", fontWeight: "bold", fontSize: "0.9rem", zIndex: 10, textTransform: "uppercase", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
                {bike.tag}
              </div>
            )}

            {isReserved && (
              <span style={{ position: "absolute", top: "15px", right: "15px", background: "#dc3545", color: "white", padding: "6px 16px", borderRadius: "25px", fontWeight: "bold", fontSize: "0.9rem", zIndex: 10 }}>
                RESERVED
              </span>
            )}

            <img src={displayImages[activeImg]} alt={bike.title} className={styles.mainImage} fetchpriority="high" />
          </div>

          <div className={styles.thumbnailStrip}>
            {displayImages.map((img, idx) => (
              <div key={idx} className={`${styles.thumbWrapper} ${activeImg === idx ? styles.activeThumb : ""}`} onClick={() => setActiveImg(idx)}>
                <img src={img} alt={`Thumbnail ${idx + 1}`} className={styles.thumbImage} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <div className={styles.brandTitleRow}>
              <h1 className={styles.bikeTitle} style={{ textTransform: "uppercase", color: "#222" }}>{bike.brand} {bike.title}</h1>
            </div>

            <p className={styles.quickSpecs} style={{ color: "#555", fontWeight: "500" }}>
              {formattedKms} KMs • {bike.owners || "1st Owner"} • {bike.makeYear}
            </p>

            <div className={styles.priceBox} style={{ background: "white", border: "1px solid #ffbfa3", borderRadius: "12px", padding: "20px", marginBottom: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
              <h2 className={styles.mainPrice} style={{ color: "#111" }}>₹{formattedPrice}</h2>
              <span className={styles.originalPrice}>₹{originalPrice}</span>
              <span className={styles.discountBadge}>18% OFF</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#16a34a", fontWeight: "700", fontSize: "0.95rem", marginBottom: "25px", paddingLeft: "5px" }}>
              <span>✓ Includes RC Transfer, Insurance & Services</span>
            </div>

            <div className={styles.actionButtons}>
              <button
                className={styles.testDriveBtn}
                onClick={() => setShowTestDriveModal(true)}
                style={{
                  cursor: "pointer",
                  background: isReserved ? "#f59e0b" : "#004AAD",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  padding: "12px 20px", border: "none", borderRadius: "12px", width: "100%", color: "white",
                  boxShadow: isReserved ? "0 8px 16px rgba(245, 158, 11, 0.3)" : "0 8px 16px rgba(0, 74, 173, 0.3)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease", gap: "4px",
                }}
              >
                {isReserved ? (
                  <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>🔔 Notify Me (Waitlist)</span>
                ) : (
                  <>
                    <span style={{ fontSize: "1.2rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                      🏠 Book Home Test Drive
                      <span style={{ fontSize: "1.4em", fontWeight: "900", textShadow: "1px 1px 3px rgba(0,0,0,0.3)" }}>@99</span>
                    </span>
                    <span style={{ fontSize: "0.85rem", opacity: 0.9, fontWeight: "500" }}>(100% Fully Refundable)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.overviewContainer}>
        <h3 className={styles.sectionTitle}>Vehicle <span className={styles.textYellow}>Overview</span></h3>
        <div className={styles.overviewGrid}>
          <div className={styles.overviewCard}><div className={styles.cardIcon}>🛣️</div><div className={styles.cardData}><span className={styles.cardLabel}>KMs Driven</span><strong className={styles.cardValue}>{formattedKms}</strong></div></div>
          <div className={styles.overviewCard}><div className={styles.cardIcon}>📅</div><div className={styles.cardData}><span className={styles.cardLabel}>Make Year</span><strong className={styles.cardValue}>{bike.makeYear}</strong></div></div>
          <div className={styles.overviewCard}><div className={styles.cardIcon}>👥</div><div className={styles.cardData}><span className={styles.cardLabel}>Ownership</span><strong className={styles.cardValue}>{bike.owners || "1st Owner"}</strong></div></div>
          <div className={styles.overviewCard}><div className={styles.cardIcon}>📝</div><div className={styles.cardData}><span className={styles.cardLabel}>Reg. Year</span><strong className={styles.cardValue}>{bike.regYear || bike.makeYear}</strong></div></div>
          <div className={styles.overviewCard}><div className={styles.cardIcon}>📍</div><div className={styles.cardData}><span className={styles.cardLabel}>Location</span><strong className={styles.cardValue}>{bike.location || "Bangalore"}</strong></div></div>
          <div className={styles.overviewCard}><div className={styles.cardIcon}>💰</div><div className={styles.cardData}><span className={styles.cardLabel}>Starting EMI</span><strong className={styles.cardValue}>₹{formattedEmi} / month</strong></div></div>
        </div>
      </div>

      {showTestDriveModal && (
        <TestDriveModal 
          bike={bike} 
          isReserved={isReserved} 
          onClose={() => setShowTestDriveModal(false)} 
        />
      )}
    </div>
  );
};

export default BikeDetails;