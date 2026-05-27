import React, { useState, useEffect, memo, useCallback } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./BuyBikes.module.css";

const generateSlug = (brand, title, price) => {
  const text = `${brand}-${title}-${price}`;
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

const optimizeImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/500x350?text=No+Image';
  if (url.includes('res.cloudinary.com') && !url.includes('/upload/f_auto')) {
    return url.replace('/upload/', '/upload/f_auto,q_auto:eco,w_500/'); 
  }
  return url;
};

// 🔥 OPTIMIZATION 1: Wrapped BikeCard in React.memo()
// This prevents the card from re-rendering when the parent opens a modal!
const BikeCard = memo(({ bike, onViewMoreClick, onTestDriveClick, priorityLoad }) => {
  const [currentImg, setCurrentImg] = useState(0);

  const fetchedImages = bike.imageUrls || bike.images || [];
  const displayImages = fetchedImages.length > 0
      ? fetchedImages.map(url => optimizeImageUrl(url))
      : ["https://via.placeholder.com/500x350?text=No+Image+Available"];

  useEffect(() => {
    if (displayImages.length > 1) {
      const nextIdx = currentImg === displayImages.length - 1 ? 0 : currentImg + 1;
      const prevIdx = currentImg === 0 ? displayImages.length - 1 : currentImg - 1;
      const nextImageObj = new window.Image();
      nextImageObj.src = displayImages[nextIdx];
      const prevImageObj = new window.Image();
      prevImageObj.src = displayImages[prevIdx];
    }
  }, [currentImg, displayImages]);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };
  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const numericPrice = parseInt(String(bike.price).replace(/,/g, "")) || 0;
  const numericEmi = parseInt(String(bike.emi).replace(/,/g, "")) || 0;
  const numericKms = parseInt(String(bike.kms).replace(/,/g, "")) || 0;

  const fullTitle = `${bike.brand} ${bike.title}`;
  const isReserved = bike.status && bike.status.toUpperCase() === "RESERVED";

  return (
    <div className={styles.card} onClick={() => onViewMoreClick(bike)} style={{ position: "relative" }}>
      <div className={styles.cardImageArea}>
        {bike.tag && bike.tag.trim() !== "" && (
          <div style={{ position: "absolute", top: "10px", left: "10px", background: "#ff5722", color: "white", padding: "4px 10px", borderRadius: "4px", fontWeight: "bold", fontSize: "0.75rem", zIndex: 10, textTransform: "uppercase", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
            {bike.tag}
          </div>
        )}
        {isReserved && (
          <div style={{ position: "absolute", top: "10px", right: "10px", background: "#dc3545", color: "white", padding: "4px 10px", borderRadius: "4px", fontWeight: "bold", fontSize: "0.75rem", zIndex: 10, textTransform: "uppercase", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
            RESERVED
          </div>
        )}
        
        <img 
          src={displayImages[currentImg]} 
          alt={bike.title} 
          loading={priorityLoad ? "eager" : "lazy"} 
          fetchPriority={priorityLoad ? "high" : "auto"}
          decoding="async"
          className={styles.bikeImage} 
        />
        
        {displayImages.length > 1 && (
          <>
            <button className={`${styles.sliderArrow} ${styles.leftArrow}`} onClick={prevImage}>&lsaquo;</button>
            <button className={`${styles.sliderArrow} ${styles.rightArrow}`} onClick={nextImage}>&rsaquo;</button>
            <div className={styles.sliderDots}>
              {displayImages.map((_, idx) => (
                <span key={idx} className={`${styles.dot} ${idx === currentImg ? styles.activeDot : ""}`}></span>
              ))}
            </div>
          </>
        )}
        <div className={styles.hoverOverlay}><span className={styles.hoverBtn}>View More</span></div>
      </div>
      <div className={styles.assuranceBar}><span className={styles.assureText}></span><span className={styles.qualityText}>✓ 200+ Quality Checks</span></div>
      <div className={styles.cardContent}>
        <div className={styles.titleRow}>
          <h3 className={styles.bikeTitle} title={fullTitle}>{fullTitle}</h3>
          <span className={styles.bikePrice}>₹{numericPrice.toLocaleString("en-IN")}</span>
        </div>
        <div className={styles.detailsRow}>
          <span>{numericKms.toLocaleString("en-IN")} KMs</span><span className={styles.dotSeparator}>•</span>
          <span>{bike.owners || bike.owner || "1st Owner"}</span><span className={styles.dotSeparator}>•</span>
          <span>{bike.makeYear || bike.year}</span>
        </div>
        <div className={styles.footerRow}>
          <div className={styles.emiPill}>EMI from <strong>₹{numericEmi.toLocaleString("en-IN")}</strong></div>
        </div>
        <div className={styles.actionRow}>
          <button
            className={styles.testDriveBtn}
            onClick={(e) => { e.stopPropagation(); onTestDriveClick(bike); }}
            style={{
              cursor: "pointer", background: isReserved ? "#f59e0b" : "#004AAD", color: "white",
              border: "none", borderRadius: "8px", padding: "10px", width: "100%",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: "4px", transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            {isReserved ? (
              <span style={{ fontSize: "1.05rem", fontWeight: "bold" }}>🔔 Notify Me (Waitlist)</span>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "1.05rem", fontWeight: "bold" }}>🏠 Book Home Test Drive</span>
                  <span style={{ fontSize: "1.4rem", fontWeight: "900", lineHeight: "1" }}>@99</span>
                </div>
                <span style={{ fontSize: "0.8rem", opacity: 0.9, fontWeight: "500" }}>(100% Fully Refundable)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

const BuyBikes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const initialCategory = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const [bikes, setBikes] = useState([]);
  const [loadingBikes, setLoadingBikes] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [apiError, setApiError] = useState(null);

  const [modalType, setModalType] = useState(null);
  const [selectedBike, setSelectedBike] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const savedUserDetails = JSON.parse(localStorage.getItem("reRideX_user_details") || "null");

  const [viewForm, setViewForm] = useState(savedUserDetails || { name: "", phone: "", budget: "", segment: "" });
  const [testForm, setTestForm] = useState({ 
    name: savedUserDetails?.name || "", 
    phone: savedUserDetails?.phone || "", 
    area: "", pincode: "", city: "", timeSlot: "" 
  });

  // Strict Routing Hook
  useEffect(() => {
    const handlePopState = (event) => {
      if (!window.location.pathname.includes("/buy")) {
        navigate("/", { replace: true });
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const cat = searchParams.get("category") || "all";
    setActiveCategory(cat);
    fetchBikes(cat, 0, false);
  }, [searchParams]);

  const fetchBikes = async (category, pageNum, isAppend) => {
    if (isAppend) setLoadingMore(true);
    else setLoadingBikes(true);
    setApiError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bikes?page=${pageNum}&size=12&category=${category}`);
      if (!response.ok) throw new Error("Failed to fetch live inventory");
      const data = await response.json();
      
      let safeBikesArray = [];
      if (Array.isArray(data)) {
        safeBikesArray = data;
      } else if (data && typeof data === 'object') {
        safeBikesArray = Array.isArray(data.bikes) ? data.bikes : Array.isArray(data.content) ? data.content : [];
      }

      if (isAppend) {
        setBikes(prev => [...prev, ...safeBikesArray]);
      } else {
        setBikes(safeBikesArray);
      }
      
      setCurrentPage(data.currentPage || 0);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.totalItems || safeBikesArray.length);
    } catch (err) {
      setApiError(err.message);
      setBikes([]); 
    } finally {
      setLoadingBikes(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages - 1) {
      fetchBikes(activeCategory, currentPage + 1, true);
    }
  };

  const handleCategoryChange = (cat) => {
    if (cat === activeCategory) return;
    if (cat === "all") {
      navigate("/buy");
    } else {
      navigate(`/buy?category=${cat}`, { replace: activeCategory !== "all" });
    }
  };

  // 🔥 OPTIMIZATION 2: Wrapped handlers in useCallback()
  // This ensures the functions don't "change" on every render, keeping the memoized BikeCards locked down!
  const handleCardClick = useCallback((bike) => {
    const submittedBikes = JSON.parse(localStorage.getItem("reRideX_submitted_bikes") || "[]");
    if (submittedBikes.includes(bike.id)) {
      const slug = generateSlug(bike.brand, bike.title, bike.price);
      navigate(`/bike/${bike.id}-${slug}`);
    } else {
      setSelectedBike(bike);
      setModalType("viewMore");
      setFormErrors({});
    }
  }, [navigate]);

  const handleTestDriveClick = useCallback((bike) => {
    setSelectedBike(bike);
    setModalType("testDrive");
    setFormErrors({});
  }, []);

  const closeModals = () => {
    setModalType(null);
    setSelectedBike(null);
    setFormErrors({});
  };

  const handleInput = (formType, field, value) => {
    let sanitizedValue = value;
    if (field === "name" || field === "city") sanitizedValue = value.replace(/[^A-Za-z\s]/g, "");
    else if (field === "phone") sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
    else if (field === "pincode") sanitizedValue = value.replace(/\D/g, "").slice(0, 6);

    if (formType === "view") setViewForm((prev) => ({ ...prev, [field]: sanitizedValue }));
    else setTestForm((prev) => ({ ...prev, [field]: sanitizedValue }));

    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  const handleViewSubmit = async (e) => {
    e.preventDefault();
    let errors = {};
    if (!viewForm.name || viewForm.name.trim().length < 3) errors.name = "Valid name is required";
    if (!viewForm.phone || viewForm.phone.length !== 10) errors.phone = "Valid 10-digit number required";
    if (!viewForm.budget) errors.budget = "Select a budget";
    if (!viewForm.segment) errors.segment = "Select a segment";
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      const payload = { name: viewForm.name, mobile: viewForm.phone, budget: viewForm.budget, segment: viewForm.segment, bikeId: selectedBike.id };
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/view-more`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        if (response.ok) {
          const submittedBikes = JSON.parse(localStorage.getItem("reRideX_submitted_bikes") || "[]");
          if (!submittedBikes.includes(selectedBike.id)) {
            submittedBikes.push(selectedBike.id);
            localStorage.setItem("reRideX_submitted_bikes", JSON.stringify(submittedBikes));
          }
          localStorage.setItem("reRideX_user_details", JSON.stringify({
            name: viewForm.name, phone: viewForm.phone, budget: viewForm.budget, segment: viewForm.segment
          }));
          toast.success(`Success! Our sales executive will contact you shortly.`);
          closeModals();
          const slug = generateSlug(selectedBike.brand, selectedBike.title, selectedBike.price);
          navigate(`/bike/${selectedBike.id}-${slug}`);
        } else { toast.error("Failed to submit request."); }
      } catch (error) { toast.error("Server error."); } 
      finally { setIsSubmitting(false); }
    }
  };

  const handleTestDriveSubmit = async (e) => {
    e.preventDefault();
    let errors = {};
    const isReserved = selectedBike?.status?.toUpperCase() === "RESERVED";

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
        name: testForm.name, mobile: testForm.phone,
        area: isReserved ? "WAITLIST" : testForm.area,
        pincode: isReserved ? "000000" : testForm.pincode,
        city: isReserved ? "N/A" : testForm.city,
        timeSlot: isReserved ? "WAITLIST" : testForm.timeSlot,
        bikeId: selectedBike.id, bikeName: selectedBike.title, paymentStatus: "PENDING_OFFLINE",
      };

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/test-drive`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });

        if (response.ok) {
          const savedData = JSON.parse(localStorage.getItem("reRideX_user_details") || "{}");
          localStorage.setItem("reRideX_user_details", JSON.stringify({
             ...savedData, name: testForm.name, phone: testForm.phone
          }));
          toast.success(
            isReserved ? `You've been added to the waitlist for the ${selectedBike.title}!` : `Request received! We'll contact you for the ${selectedBike.title} test drive.`,
            { duration: 6000, icon: isReserved ? "🔔" : "🏍️" },
          );
          closeModals();
        } else { toast.error("Failed to submit booking."); }
      } catch (error) { toast.error("Server connection failed."); } 
      finally { setIsSubmitting(false); }
    }
  };

  const safeBikesList = Array.isArray(bikes) ? bikes : [];
  const filteredBikes = activeCategory === "all" ? safeBikesList : safeBikesList.filter((bike) => bike.category && bike.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className={styles.buyContainer}>
      <section className={styles.pageHeader}>
        <div className={styles.headerOverlay}></div>
        <div className={styles.headerContent}>
          <div className={styles.badge}>EXPLORE INVENTORY</div>
          <h1 className={styles.heroTitle}>Find Your <span className={styles.textYellow}>Dream Ride</span></h1>
          <p className={styles.heroSubtitle}>Fully inspected, certified second-hand bikes ready for the road.</p>
        </div>
      </section>

      <div className={styles.mainLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.filterBox}>
            <h3 className={styles.filterTitle}>Categories</h3>
            <ul className={styles.filterList}>
              <li className={activeCategory === "all" ? styles.activeFilter : ""} onClick={() => handleCategoryChange("all")}>All Bikes</li>
              <li className={activeCategory === "scooters" ? styles.activeFilter : ""} onClick={() => handleCategoryChange("scooters")}>Scooters</li>
              <li className={activeCategory === "commuter" ? styles.activeFilter : ""} onClick={() => handleCategoryChange("commuter")}>Commuter Bikes</li>
              <li className={activeCategory === "sports" ? styles.activeFilter : ""} onClick={() => handleCategoryChange("sports")}>Sports Bikes</li>
              <li className={activeCategory === "travel" ? styles.activeFilter : ""} onClick={() => handleCategoryChange("travel")}>Travel & Adventure</li>
            </ul>
          </div>
        </aside>

        <main className={styles.gridArea}>
          {loadingBikes && <div style={{ textAlign: "center", padding: "40px", fontSize: "1.2rem", color: "#004AAD" }}>Loading Live Inventory...</div>}
          {apiError && <div style={{ textAlign: "center", padding: "40px", color: "red" }}>Failed to load inventory: {apiError}</div>}
          
          {!loadingBikes && !apiError && (
            <>
              <div className={styles.resultsHeader}>
                <span>Showing {filteredBikes.length} of {totalItems} results</span>
              </div>
              {filteredBikes.length === 0 ? (
                <div className={styles.noResults}>No bikes found in this category.</div>
              ) : (
                <>
                  <div className={styles.bikeGrid}>
                    {filteredBikes.map((bike, index) => (
                      <BikeCard 
                        key={bike.id} 
                        bike={bike} 
                        onViewMoreClick={handleCardClick} 
                        onTestDriveClick={handleTestDriveClick} 
                        priorityLoad={index < 6}
                      />
                    ))}
                  </div>
                  
                  {currentPage < totalPages - 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', marginBottom: '20px' }}>
                      <button 
                        onClick={handleLoadMore} 
                        disabled={loadingMore}
                        style={{
                          padding: '12px 30px', background: 'transparent', color: '#004AAD',
                          border: '2px solid #004AAD', borderRadius: '30px', fontWeight: 'bold',
                          fontSize: '1rem', cursor: loadingMore ? 'not-allowed' : 'pointer',
                          transition: 'all 0.3s ease', opacity: loadingMore ? 0.7 : 1
                        }}
                      >
                        {loadingMore ? "Loading..." : "⬇️ Load More Bikes"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>

      {modalType === "viewMore" && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <button className={styles.closeBtn} onClick={closeModals}>×</button>
            <div className={styles.modalHeader}>
              <h3>View Bike Details</h3>
              <p>Quickly enter your details to view full specs for the <strong>{selectedBike?.title}</strong>.</p>
            </div>
            <form onSubmit={handleViewSubmit} className={styles.leadForm}>
              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input type="text" placeholder="Enter your name" value={viewForm.name} onChange={(e) => handleInput("view", "name", e.target.value)} className={formErrors.name ? styles.inputError : ""} />
                {formErrors.name && <span className={styles.errorTxt}>{formErrors.name}</span>}
              </div>
              <div className={styles.inputGroup}>
                <label>Mobile Number</label>
                <input type="tel" placeholder="10-digit number" value={viewForm.phone} onChange={(e) => handleInput("view", "phone", e.target.value)} className={formErrors.phone ? styles.inputError : ""} />
                {formErrors.phone && <span className={styles.errorTxt}>{formErrors.phone}</span>}
              </div>
              <div className={styles.inputGroup}>
                <label>Budget</label>
                <select value={viewForm.budget} onChange={(e) => handleInput("view", "budget", e.target.value)} className={formErrors.budget ? styles.inputError : ""}>
                  <option value="" disabled>Select your budget</option>
                  <option value="Under ₹50,000">Under ₹50,000</option>
                  <option value="₹50,000 - ₹80,000">₹50,000 - ₹80,000</option>
                  <option value="₹80,000 - ₹1.5 Lakh">₹80,000 - ₹1.5 Lakh</option>
                  <option value="Above ₹1.5 Lakh">Above ₹1.5 Lakh</option>
                </select>
                {formErrors.budget && <span className={styles.errorTxt}>{formErrors.budget}</span>}
              </div>
              <div className={styles.inputGroup}>
                <label>Interested Segment</label>
                <select value={viewForm.segment} onChange={(e) => handleInput("view", "segment", e.target.value)} className={formErrors.segment ? styles.inputError : ""}>
                  <option value="" disabled>Select vehicle type</option>
                  <option value="Scooter">Scooter</option>
                  <option value="Commuter">Commuter Bike</option>
                  <option value="Sports">Sports Bike</option>
                  <option value="Travel">Travel & Adventure</option>
                </select>
                {formErrors.segment && <span className={styles.errorTxt}>{formErrors.segment}</span>}
              </div>
              <button type="submit" className={styles.submitLeadBtn} disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "View Full Details"}</button>
            </form>
          </div>
        </div>
      )}

      {modalType === "testDrive" && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <button className={styles.closeBtn} onClick={closeModals}>×</button>
            <div className={styles.modalHeader}>
              <h3 style={{ color: selectedBike?.status?.toUpperCase() === "RESERVED" ? "#f59e0b" : "#004AAD" }}>
                {selectedBike?.status?.toUpperCase() === "RESERVED" ? "Join Waitlist" : "Book Home Test Drive"}
              </h3>
              <p>
                {selectedBike?.status?.toUpperCase() === "RESERVED" 
                  ? <>The <strong>{selectedBike?.title}</strong> is currently reserved. Enter your details to get notified immediately if it becomes available!</>
                  : <>Test ride the <strong>{selectedBike?.title}</strong> at your home.</>
                }
              </p>
            </div>
            <form onSubmit={handleTestDriveSubmit} className={styles.leadForm}>
              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input type="text" placeholder="Enter your name" value={testForm.name} onChange={(e) => handleInput("test", "name", e.target.value)} className={formErrors.name ? styles.inputError : ""} />
                {formErrors.name && <span className={styles.errorTxt}>{formErrors.name}</span>}
              </div>
              <div className={styles.inputGroup}>
                <label>Mobile Number</label>
                <input type="tel" placeholder="10-digit number" value={testForm.phone} onChange={(e) => handleInput("test", "phone", e.target.value)} className={formErrors.phone ? styles.inputError : ""} />
                {formErrors.phone && <span className={styles.errorTxt}>{formErrors.phone}</span>}
              </div>

              {selectedBike?.status?.toUpperCase() !== "RESERVED" && (
                <>
                  <div className={styles.inputGroup}>
                    <label>Locality / Area</label>
                    <input type="text" placeholder="e.g. Jayanagar 4th Block" value={testForm.area} onChange={(e) => handleInput("test", "area", e.target.value)} className={formErrors.area ? styles.inputError : ""} />
                    {formErrors.area && <span className={styles.errorTxt}>{formErrors.area}</span>}
                  </div>
                  <div className={styles.formGridRow}>
                    <div className={styles.inputGroup}>
                      <label>PIN Code</label>
                      <input type="tel" placeholder="6-digit PIN" value={testForm.pincode} onChange={(e) => handleInput("test", "pincode", e.target.value)} className={formErrors.pincode ? styles.inputError : ""} />
                      {formErrors.pincode && <span className={styles.errorTxt}>{formErrors.pincode}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                      <label>City</label>
                      <input type="text" placeholder="Enter your city" value={testForm.city} onChange={(e) => handleInput("test", "city", e.target.value)} className={formErrors.city ? styles.inputError : ""} />
                      {formErrors.city && <span className={styles.errorTxt}>{formErrors.city}</span>}
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Preferred Time Slot</label>
                    <select value={testForm.timeSlot} onChange={(e) => handleInput("test", "timeSlot", e.target.value)} className={formErrors.timeSlot ? styles.inputError : ""}>
                      <option value="" disabled>Select a time slot</option>
                      <option value="10 AM - 1 PM">10:00 AM - 1:00 PM</option>
                      <option value="1 PM - 4 PM">1:00 PM - 4:00 PM</option>
                      <option value="4 PM - 7 PM">4:00 PM - 7:00 PM</option>
                    </select>
                    {formErrors.timeSlot && <span className={styles.errorTxt}>{formErrors.timeSlot}</span>}
                  </div>
                </>
              )}

              <button type="submit" className={styles.payBtn} disabled={isSubmitting} style={{ background: selectedBike?.status?.toUpperCase() === "RESERVED" ? "#f59e0b" : "#004AAD" }}>
                {isSubmitting ? "Submitting..." : selectedBike?.status?.toUpperCase() === "RESERVED" ? "Confirm Waitlist Request" : "Confirm Test Drive Request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyBikes;