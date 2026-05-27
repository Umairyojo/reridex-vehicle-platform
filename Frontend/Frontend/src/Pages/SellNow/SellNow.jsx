import React, { useState, useEffect, memo } from "react";
import toast from "react-hot-toast";
import styles from "./SellNow.module.css";

// 🔥 OPTIMIZATION 1: Migrated local asset to Lightning Fast Cloudinary CDN!
const sellShowcaseImg = "https://res.cloudinary.com/dwfz30tb7/image/upload/f_auto,q_auto/v1775051592/sellbg_qe2erq.webp";

const cityDatabase = ["Bangalore", "Other"];

const bikeDatabase = {
  Hero: [
    "Achiever 150", "CBZ Star 160", "CBZ Xtreme 150", "CD Dawn 100", "CD Deluxe 100",
    "Destini 125", "Destini Prime", "Duet 110", "Glamour 125", "Glamour Canvas 125",
    "Glamour FI 125", "Glamour I3S", "Glamour I3S 125", "Glamour Programmed FI 125",
    "Glamour Xtec 125", "HF 100", "HF Dawn 100", "HF Deluxe 100", "HF Deluxe ECO",
    "HF Deluxe I3S", "Hunk 150", "Ignitor 125", "Impulse 150", "Karizma R 223",
    "Karizma XMR 210", "Karizma XMR 223", "Karizma ZMR 223", "Maestro 100",
    "Maestro 110", "Maestro Edge 110", "Maestro Edge 125", "Mavrick 440",
    "Passion Plus", "Passion Plus 100", "Passion PRO 100", "Passion PRO 110",
    "Passion PRO I3S 100", "Passion PRO TR 100", "Passion PRO Xtec 110",
    "Passion Xpro 110", "Passion XPro 110", "Passion Xtec 110", "Pleasure 100",
    "Pleasure Plus 110", "Pleasure Plus Xtec 110", "Splendor Ismart 100",
    "Splendor Ismart 110", "Splendor Ismart Plus 110", "Splendor NXG 100",
    "Splendor Plus 100", "Splendor PRO 100", "Splendor PRO Classic 100",
    "Splendor X Tec 100", "Super Splendor 125", "Super Splendor X Tec 125",
    "Xoom 110", "Xoom 125", "Xoom 160", "Xpulse 200", "Xpulse 200 2v",
    "Xpulse 200 4V", "Xpulse 200T", "Xpulse 200T 4v", "Xpulse 200T 4V",
    "Xpulse 210", "Xtreme 125R", "Xtreme 150", "Xtreme 160R", "Xtreme 160R 4V",
    "Xtreme 200R", "Xtreme 200S", "Xtreme 200S 4V", "Xtreme 250R", "Xtreme Sports 150",
    "Other"
  ],
  Honda: [
    "Activa 110", "Activa 125", "Activa 3G 110", "Activa 4G 110", "Activa 5G 110",
    "Activa 6G", "Activa E", "Activa I 110", "Activa Premium", "Africa Twin 1000",
    "Africa Twin CRF1100L", "Aviator 110", "CB 1000R", "CB200X", "CB300F", "CB300R",
    "CB350RS", "CB500X", "CB650R", "CBF Stunner 125", "CB Hornet 160R", "CBR 1000RR",
    "CBR1000RR Fireblade", "CBR1000RR R", "CBR150R", "CBR 150R", "CBR 250R",
    "CBR 600RR", "CBR650F", "CBR650R", "CB Shine 125", "CB Shine SP 125",
    "CB Trigger 150", "CB Twister 110", "CB Unicorn 150", "CB Unicorn 160",
    "CB Unicorn Dazzler 150", "CD 110 Dream", "Cliq 110", "Dio 110", "DIO 110",
    "DIO 125", "Dream NEO 110", "Dream Yuga 110", "Eterno 150", "Gold Wing",
    "Gold Wing GL 1800", "Grazia 110", "Grazia 125", "Highness CB 350",
    "Hornet 2.0 185", "Livo 110", "Navi 110", "NX200", "NX500", "QC1", "Shine 100",
    "Shine 125", "SP125", "SP160", "Unicorn 160", "VFR 1200F", "VT1300CX", "X ADV",
    "X Blade", "X Blade 160", "Other"
  ],
  Bajaj: [
    "Aspire 100", "Avenger 200", "Avenger Cruise 220", "Avenger Street 150",
    "Avenger Street 160", "Avenger Street 180", "Avenger Street 220", "Blade 125",
    "Boxer", "BYK 100", "Chetak Electric", "Chetak Premium", "CT 100", "CT 110",
    "CT 110X", "CT 125X", "Discover 100", "Discover 110", "Discover 125",
    "Discover 135", "Discover 150", "Discover 150S", "Discover F 150",
    "Discover M 100", "Discover M 125", "Discover ST 125", "Discover T 100",
    "Discover T 125", "Dominar 250", "Dominar 400", "Freedom 125", "Kristal 95",
    "Platina 100", "Platina 110", "Platina 110 H", "Platina 125", "Pulsar 125",
    "Pulsar 150", "Pulsar 180", "Pulsar 180F", "Pulsar 200", "Pulsar 220",
    "Pulsar 220F", "Pulsar AS 150", "Pulsar AS 200", "Pulsar F250", "Pulsar LS 135",
    "Pulsar N125", "Pulsar N150", "Pulsar N160", "Pulsar N250", "Pulsar NS 125",
    "Pulsar NS160", "Pulsar NS 160", "Pulsar NS 200", "Pulsar NS 400Z",
    "Pulsar P150", "Pulsar RS 200", "Spirit 60", "V12", "V15", "XCD", "Other"
  ],
  TVS: [
    "Apache 150", "Apache RR 310", "Apache RTR 160", "Apache RTR 160 2V",
    "Apache RTR 160 4V", "Apache RTR 165 RP", "Apache RTR 180", "Apache RTR 180 2V",
    "Apache RTR 200 4V", "Apache RTR 310", "Flame 125", "iQube", "IQube",
    "Jive 110", "Jupiter 110", "Jupiter 125", "MAX 4R 110", "Ntorq 125",
    "Ntorq 150", "Phoenix 125", "Radeon 110", "Raider 125", "Ronin",
    "Scooty Pep+ 90", "Scooty Streak 90", "Scooty Teenz 60", "Scooty Zest 110",
    "Sport", "Sport 100", "Sport 110", "Star City 110", "Star City Plus 110",
    "Star Deluxe 100", "Star Sport 100", "Victor 110", "Victor GLX 125",
    "Wego 110", "X", "XL 100", "XL 100 Comfort", "XL 100 Heavy Duty", "XL Super 70",
    "Other"
  ],
  "Royal Enfield": [
    "Bear 650", "Bullet 350", "Bullet 500", "Bullet Electra",
    "Bullet Electra Twinspark 350", "Bullet Trials 350", "Bullet Trials 500",
    "Bullet Twinspark 350", "Bullet Twinspark 500", "Classic 350", "Classic 500",
    "Classic 650", "Classic Chrome 500", "Classic Desert Storm 500",
    "Classic Gunmetal Grey 350", "Classic Squadron Blue 500",
    "Classic Stealth Black 500", "Continental GT", "Continental GT 535",
    "Continental GT 650", "Goan Classic 350", "Guerrilla 450", "Himalayan",
    "Himalayan 410", "Himalayan 450", "Hunter 350", "Interceptor 650",
    "Machismo 350", "Machismo 500", "Meteor 350", "Scram 411", "Scram 440",
    "Shotgun 650", "Standard 500", "Super Meteor 650", "Thunderbird 350",
    "Thunderbird 500", "Thunderbird X 350", "Thunderbird X 500", "Other"
  ],
  Yamaha: [
    "Crux 110", "Cygnus Fazzio", "Cygnus GT 125", "Cygnus Ray ZR 125",
    "Cygnus X 125", "Cygnus X 150", "Cygnus X SR", "Fascino 110", "Fascino 125",
    "Fazer 150", "Fazer 25", "Fazer FI V 2.0", "FZ", "FZ1 1000", "FZ 150",
    "FZ 150 V1", "FZ 150 V3", "FZ16", "FZ25", "FZ 25 BS4", "FZ FI V 3.0 150",
    "FZS", "FZS 25", "FZS FI V 3.0 150", "FZS FI V4", "FZ S V 2.0 150",
    "FZ S V 3.0 150", "FZ V 2.0 150", "FZ X 150", "Gladiator 125", "Libero G5 110",
    "MT 09", "MT 15", "MT 15 V1", "MT 15 V2", "R15M", "R15 S V2", "R15 S V4",
    "R15 V2", "R15 V3", "R15 V4", "RAY 110", "RAY Z 110", "RAY ZR 110",
    "RAY ZR 125", "Saluto 110", "Saluto 125", "Saluto RX 110", "SS 125", "SZ 150",
    "SZR 150", "SZ RR 150", "SZ RR V 2.0 150", "SZS 150", "SZX 150", "Vmax",
    "YBR 110", "YBR 125", "YZF R1", "YZF R15", "YZF R15 2.0", "YZF R15 S",
    "YZF R15S V3.0", "YZF R15 V3", "YZF R15 V4", "YZF R1M", "YZF R3", "YZF R6",
    "Other"
  ],
  Suzuki: [
    "Access 125", "Access FI 125", "Avenis 125", "Bandit 1250",
    "Burgman Street 125", "DR Z50", "Gixxer", "Gixxer 150", "Gixxer 250",
    "Gixxer FI 150", "Gixxer FI 250", "Gixxer SF 150", "Gixxer SF 250",
    "Gixxer SF FI 150", "GS 150 R", "GSX R 1000", "GSX R 1000R", "GSX S 1000",
    "GSX S 1000F", "GSX S 750", "Hayabusa 1340", "Hayate 110", "Hayate EP 110",
    "Heat 125", "Inazuma 250", "Intruder 150", "Intruder M1800R", "Intruder M800",
    "Intruder SP 150", "Katana", "Lets 110", "RM Z250", "RM Z450", "Slingshot 125",
    "Slingshot Plus 125", "Swish 125", "V Strom 1000", "V Strom 650XT",
    "V Strom 800DE", "V Strom SX", "Zeus 125", "Other"
  ],
  KTM: [
    "390 Enduro R", "Adventure 250", "Adventure 390", "Adventure X 390",
    "Duke 125", "Duke 160", "Duke 200", "Duke 250", "Duke 390", "Duke 790",
    "RC 125", "RC 200", "RC 390", "Other"
  ],
  Jawa: [
    "350", "42", "42 Bobber", "42 FJ", "Classic Standard 300", "Forty Two",
    "Forty Two 300", "Perak 330", "Standard", "Other"
  ],
  Aprilia: [
    "SR 125", "SR 150", "SR 160", "SXR 125", "SXR 160", "RS 457", "Other"
  ],
  Vespa: [
    "ZX 125", "VXL 125", "SXL 125", "S 125", "Tech 125", "VXL 150",
    "SXL 150", "S 150", "Tech 150", "Other"
  ],
  Yezdi: ["Roadster", "Scrambler", "Adventure", "Other"],
  Ather: ["Ather 450X", "Ather 450S", "Ather Rizta", "Other"],
  Ola: ["S1 Pro", "S1 Air", "S1 X", "Other"],
  Other: ["Other"],
};

// 🔥 OPTIMIZATION 2: Isolated the heavy image component so typing in the form doesn't re-render it
const ShowcaseImage = memo(() => (
  <div className={styles.imageColumn}>
    <div className={styles.showcaseBox}>
      <div className={styles.pulseRings}></div>
      <img
        src={sellShowcaseImg}
        alt="Sell your bike"
        className={styles.showcaseImg}
        fetchpriority="high"
        decoding="async"
      />
    </div>
  </div>
));

const SellNow = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    regNo: "", city: "", brand: "", model: "", kmDriven: "", ownership: "", name: "", mobile: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateField = (name, value) => {
    if (!value || value.trim() === "") return "Required";
    if (name === "mobile" && (!/^\d+$/.test(value) || value.length !== 10))
      return "Enter valid 10-digit number";
    if (name === "name" && !/^[a-zA-Z\s]+$/.test(value))
      return "Only letters allowed";
    if (name === "regNo" && !/^[a-zA-Z0-9\s]+$/.test(value))
      return "Invalid format";
    if (name === "model" && !/^[a-zA-Z0-9\s\-]+$/.test(value))
      return "Only letters and numbers allowed";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBrandChange = (e) => {
    const selectedBrand = e.target.value;
    const defaultModel = selectedBrand === "Other" ? "" : "";
    setFormData((prev) => ({ ...prev, brand: selectedBrand, model: defaultModel }));
    setErrors((prev) => ({ ...prev, brand: "", model: "" }));
  };

  const handleNext = async () => {
    let stepErrors = {};
    let isStepValid = true;

    const fieldsToValidate =
      step === 1
        ? ["regNo", "city", "brand"]
        : step === 2
          ? ["model", "kmDriven", "ownership"]
          : ["name", "mobile"];

    fieldsToValidate.forEach((field) => {
      const errorMsg = validateField(field, formData[field]);
      if (errorMsg) {
        stepErrors[field] = errorMsg;
        isStepValid = false;
      }
    });

    setErrors(stepErrors);

    if (isStepValid) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        setIsSubmitting(true);
        try {
          // PRODUCTION URL (Commented out for local testing)
          // const response = await fetch("https://api.reridex.com/api/leads/sell", 

    // LOCAL TEST URL (Using your local Spring Boot server)
      const response = await fetch("http://localhost:8080/api/leads/sell",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            setShowSuccessModal(true);
            setFormData({
              regNo: "", city: "", brand: "", model: "", kmDriven: "", ownership: "", name: "", mobile: "",
            });
            setStep(1);
          } else {
            toast.error("Failed to submit details. Please try again.", { position: "top-center" });
          }
        } catch (error) {
          toast.error("Server error! Make sure Spring Boot is running.", { position: "top-center" });
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className={styles.sellPageContainer}>
      <section className={styles.pageHeader}>
        <div className={styles.headerOverlay}></div>
        <div className={styles.headerContent}>
          <div className={styles.badge}>INSTANT VALUATION</div>
          <h1 className={styles.heroTitle}>
            Sell Your Bike <span className={styles.textYellow}>Fast & Easy</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Get the best market price directly to your bank account in 3 simple steps.
          </p>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.splitWrapper}>
          
          <ShowcaseImage />

          <div className={styles.formColumn}>
            <h2 className={styles.formMainTitle}>
              Sell your bike at the <span className={styles.textYellow}>best price</span>
            </h2>

            <div className={styles.progressContainer}>
              <div className={`${styles.progressStep} ${step >= 1 ? styles.activeStep : ""}`}>
                1. Bike Details
              </div>
              <div className={`${styles.progressStep} ${step >= 2 ? styles.activeStep : ""}`}>
                2. Condition
              </div>
              <div className={`${styles.progressStep} ${step >= 3 ? styles.activeStep : ""}`}>
                3. Contact
              </div>
              <div
                className={styles.progressLine}
                style={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
              ></div>
            </div>

            <div className={styles.formWidget}>
              {/* ================= STEP 1 ================= */}
              {step === 1 && (
                <div className={styles.stepContent}>
                  <div className={styles.inputWrapper}>
                    <label>Enter your vehicle number</label>
                    <div className={`${styles.inputGroup} ${errors.regNo ? styles.errorBorder : ""}`}>
                      <span className={styles.inputIcon}>🔢</span>
                      <input
                        type="text"
                        name="regNo"
                        value={formData.regNo}
                        onChange={handleInputChange}
                        placeholder="e.g. KA01AB1234"
                        style={{ textTransform: "uppercase" }}
                      />
                    </div>
                    {errors.regNo && <span className={styles.errorText}>{errors.regNo}</span>}
                  </div>

                  <div className={styles.inputWrapper}>
                    <label>Select City</label>
                    <div className={`${styles.inputGroup} ${errors.city ? styles.errorBorder : ""}`}>
                      <span className={styles.inputIcon}>📍</span>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={styles.customSelect}
                      >
                        <option value="" disabled>Select City</option>
                        {cityDatabase.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    {errors.city && <span className={styles.errorText}>{errors.city}</span>}
                  </div>

                  <div className={styles.inputWrapper}>
                    <label>Select Brand</label>
                    <div className={`${styles.inputGroup} ${errors.brand ? styles.errorBorder : ""}`}>
                      <span className={styles.inputIcon}>🏍️</span>
                      <select
                        name="brand"
                        value={formData.brand}
                        onChange={handleBrandChange}
                        className={styles.customSelect}
                      >
                        <option value="" disabled>Select Vehicle Brand</option>
                        {Object.keys(bikeDatabase).map((brand) => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>
                    {errors.brand && <span className={styles.errorText}>{errors.brand}</span>}
                  </div>
                </div>
              )}

              {/* ================= STEP 2 ================= */}
              {step === 2 && (
                <div className={styles.stepContent}>
                  <div className={styles.inputWrapper}>
                    <label>
                      {formData.brand === "Other" ? "Enter Bike Model" : "Select Model"}
                    </label>
                    <div className={`${styles.inputGroup} ${errors.model ? styles.errorBorder : ""}`}>
                      <span className={styles.inputIcon}>🏷️</span>
                      {formData.brand === "Other" ? (
                        <input
                          type="text"
                          name="model"
                          value={formData.model}
                          onChange={handleInputChange}
                          placeholder="e.g. Custom 150cc"
                          style={{
                            width: "100%", border: "none", outline: "none", background: "transparent",
                          }}
                        />
                      ) : (
                        <select
                          name="model"
                          value={formData.model}
                          onChange={handleInputChange}
                          className={styles.customSelect}
                        >
                          <option value="" disabled>Select Model</option>
                          {formData.brand &&
                            bikeDatabase[formData.brand].map((model) => (
                              <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                      )}
                    </div>
                    {errors.model && <span className={styles.errorText}>{errors.model}</span>}
                  </div>

                  <div className={styles.inputWrapper}>
                    <label>Kilometers Driven</label>
                    <div className={`${styles.inputGroup} ${errors.kmDriven ? styles.errorBorder : ""}`}>
                      <span className={styles.inputIcon}>🛣️</span>
                      <select
                        name="kmDriven"
                        value={formData.kmDriven}
                        onChange={handleInputChange}
                        className={styles.customSelect}
                      >
                        <option value="" disabled>Select KM Driven</option>
                        <option value="0-10000">0 - 10,000 km</option>
                        <option value="10000-30000">10,000 - 30,000 km</option>
                        <option value="30000-50000">30,000 - 50,000 km</option>
                        <option value="50000+">50,000+ km</option>
                      </select>
                    </div>
                    {errors.kmDriven && <span className={styles.errorText}>{errors.kmDriven}</span>}
                  </div>

                  <div className={styles.inputWrapper}>
                    <label>Number of Owners</label>
                    <div className={`${styles.inputGroup} ${errors.ownership ? styles.errorBorder : ""}`}>
                      <span className={styles.inputIcon}>👥</span>
                      <select
                        name="ownership"
                        value={formData.ownership}
                        onChange={handleInputChange}
                        className={styles.customSelect}
                      >
                        <option value="" disabled>Select Ownership</option>
                        <option value="1">1st Owner</option>
                        <option value="2">2nd Owner</option>
                        <option value="3">3rd Owner</option>
                        <option value="4+">4th Owner or more</option>
                      </select>
                    </div>
                    {errors.ownership && <span className={styles.errorText}>{errors.ownership}</span>}
                  </div>
                </div>
              )}

              {/* ================= STEP 3 ================= */}
              {step === 3 && (
                <div className={styles.stepContent}>
                  <div className={styles.inputWrapper}>
                    <label>Full Name</label>
                    <div className={`${styles.inputGroup} ${errors.name ? styles.errorBorder : ""}`}>
                      <span className={styles.inputIcon}>👤</span>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                  </div>

                  <div className={styles.inputWrapper}>
                    <label>Mobile Number</label>
                    <div className={`${styles.inputGroup} ${errors.mobile ? styles.errorBorder : ""}`}>
                      <span className={styles.inputIcon}>📞</span>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="10-Digit Mobile Number"
                        maxLength="10"
                      />
                    </div>
                    {errors.mobile && <span className={styles.errorText}>{errors.mobile}</span>}
                  </div>

                  <div className={styles.trustBadgeRow}>
                    <span>🔒 100% Secure</span>
                    <span>✓ Free Doorstep Evaluation</span>
                  </div>
                </div>
              )}

              {/* Button Controls */}
              <div className={styles.btnRow}>
                {step > 1 && (
                  <button
                    type="button"
                    className={styles.backBtn}
                    onClick={handleBack}
                    disabled={isSubmitting}
                  >
                    &larr; Back
                  </button>
                )}
                <button
                  type="button"
                  className={styles.nextBtn}
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  {step === 3
                    ? isSubmitting
                      ? "Submitting..."
                      : "Submit Details"
                    : "Next Step"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showSuccessModal && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 9999, display: "flex",
            justifyContent: "center", alignItems: "center", backdropFilter: "blur(5px)",
          }}
        >
          <div
            style={{
              background: "white", width: "90%", maxWidth: "450px", padding: "40px 30px",
              borderRadius: "20px", textAlign: "center", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
              position: "relative", animation: "fadeInUp 0.3s ease-out forwards",
            }}
          >
            <button
              onClick={() => setShowSuccessModal(false)}
              style={{
                position: "absolute", top: "15px", right: "20px", background: "none",
                border: "none", fontSize: "1.8rem", color: "#999", cursor: "pointer", lineHeight: 1,
              }}
            >
              &times;
            </button>

            <div style={{ fontSize: "4.5rem", marginBottom: "15px" }}>✅</div>
            <h2
              style={{ color: "#004AAD", fontSize: "1.8rem", marginBottom: "10px", fontWeight: "800" }}
            >
              Request Received!
            </h2>
            <p
              style={{ color: "#555", fontSize: "1.1rem", lineHeight: "1.5", marginBottom: "25px" }}
            >
              Your bike details have been successfully submitted. Our valuation
              experts will review your details and contact you shortly with the{" "}
              <strong>best quote!</strong>
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              style={{
                background: "#ffcc00", color: "#111", border: "none", padding: "14px 40px",
                fontSize: "1.1rem", fontWeight: "bold", borderRadius: "30px", cursor: "pointer",
                width: "100%", boxShadow: "0 4px 6px rgba(255, 204, 0, 0.3)",
              }}
            >
              Got it, Thanks!
            </button>
          </div>
          <style>
            {`
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}
          </style>
        </div>
      )}
    </div>
  );
};

export default SellNow;