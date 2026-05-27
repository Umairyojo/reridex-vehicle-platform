import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./Home.module.css";

// 🚀 CDN Image URLs (Optimized with f_auto,q_auto)
const slide1 = "https://res.cloudinary.com/dwfz30tb7/image/upload/f_auto,q_auto/v1775051591/slide1_koorwh.webp";
const slide1_2 = "https://res.cloudinary.com/dwfz30tb7/image/upload/f_auto,q_auto/v1775051593/slide1_2_omh7et.webp";
const slide2 = "https://res.cloudinary.com/dwfz30tb7/image/upload/f_auto,q_auto/v1775051593/slide2_nevxwt.webp";
const slide3 = "https://res.cloudinary.com/dwfz30tb7/image/upload/f_auto,q_auto/v1775051593/slide3_xtcrtj.webp";
const slide4 = "https://res.cloudinary.com/dwfz30tb7/image/upload/f_auto,q_auto/v1775051593/slide4_tnu1tq.webp";
const buyimg = "https://res.cloudinary.com/dwfz30tb7/image/upload/f_auto,q_auto/v1775051592/buyimg_g5zhms.webp";

const scooterImg = "https://res.cloudinary.com/dwfz30tb7/image/upload/f_auto,q_auto/v1775051591/scooter_i0xbw8.webp";
const commuterImg = "https://res.cloudinary.com/dwfz30tb7/image/upload/f_auto,q_auto/v1775051591/commuter_otjmgi.webp";
const sportsImg = "https://res.cloudinary.com/dwfz30tb7/image/upload/f_auto,q_auto/v1775051593/sports_jkspii.webp";
const travellerImg = "https://res.cloudinary.com/dwfz30tb7/image/upload/f_auto,q_auto/v1775051593/traveller_pmnt1r.webp";

const sliderData = [
  {
    id: 1,
    customLayout: "premiumBanner",
    bannerData: {
      title1: "SELL YOUR BIKE",
      title2: "FROM YOUR",
      title3: "HOME",
      badge: "GET PAID INSTANTLY",
      desc: "Sell your bike fast with ReRideX. Instant pricing, free inspection, secure payment.",
      btnText: "SELL NOW",
      btnLink: "/sell",
    },
    image: slide1,
    image2: slide1_2,
    mobileImage: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?q=80&w=800&auto=format&fit=crop",
    theme: "blue",
  },
  {
    id: 2,
    customLayout: "darkSplitBanner",
    bannerData: {
      title1: "BUY CERTIFIED",
      title2: "SECOND HAND",
      title3: "BIKES ONLINE",
      badge: "200+ QUALITY CHECKS",
      desc: "Experience peace of mind. Every bike is fully inspected, serviced, and ready to ride.",
      btnText: "EXPLORE BIKES",
      btnLink: "/buy",
    },
    image: slide2,
    theme: "dark",
  },
  {
    id: 3,
    customLayout: "cutoutBanner",
    bannerData: {
      badge: "100% SECURE & TRUSTED",
      title1: "HASSLE-FREE",
      title2: "PAPERWORK",
      desc: "Enjoy the ride, leave the legalities to us. Complete RC transfers and a 6-month engine warranty included.",
      features: ["Free RC Transfer", "Engine Warranty"],
      btnText: "LEARN MORE",
      btnLink: "/about",
    },
    image: slide3,
    theme: "light",
  },
  {
    id: 4,
    customLayout: "curvedTestDrive",
    bannerData: {
      badge: "DOORSTEP SERVICE",
      title1: "HOME TEST DRIVE",
      title2: "AT JUST ₹99",
      title3: "100% FULLY REFUNDABLE",
      desc: "Experience your dream bike without stepping out. Book a home test ride today. The booking fee is completely refundable.",
      btnText: "BOOK TEST DRIVE",
      btnLink: "/buy", 
    },
    image: slide4,
    theme: "dark",
  },
  {
    id: 5,
    customLayout: "cinematicWebBanner",
    bannerData: {
      badge: "⭐ INDIA'S MOST TRUSTED",
      title1: "THE SMART WAY TO",
      title2: "BUY & SELL",
      title3: "YOUR DREAM BIKE",
      desc: "Experience 100% transparent pricing, instant secure payments, and unparalleled customer support.",
      btnText: "EXPLORE PLATFORM",
      btnLink: "/about",
    },
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1920&auto=format&fit=crop",
    mobileImage: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop",
    theme: "black",
  },
];

const whyBuyFeatures = [
  { title: "Easy Finance", desc: "Instant loan options with flexible EMIs at checkout.", icon: "🏦" },
  { title: "200+ Quality Checks", desc: "Every bike is thoroughly inspected across the engine & frame.", icon: "🔍" },
  { title: "Certified Bikes", desc: "Only top quality bikes pass our strict platform verification.", icon: "🛡️" },
  { title: "6 Months Warranty", desc: "Ride with peace of mind with our core engine warranty.", icon: "🔧" },
  { title: "Ownership Transfer", desc: "Hassle-free end-to-end RC transfer handled fully by us.", icon: "📄" },
];

const whySellFeatures = [
  { title: "Best Market Price", desc: "Data-driven valuation ensures you get the highest possible returns.", icon: "💰" },
  { title: "Instant Payment", desc: "Full amount credited securely before the bike leaves your home.", icon: "⚡" },
  { title: "Doorstep Pickup", desc: "Free evaluation and pickup right from your doorstep.", icon: "🏠" },
  { title: "Free RC Transfer", desc: "We handle 100% of the legal paperwork and documentation.", icon: "📄" },
  { title: "No Hidden Fees", desc: "Completely transparent selling process with zero hidden charges.", icon: "🚫" },
];

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

const reviewsData = [
  { id: 1, name: "Rahul Sharma", initials: "RS", location: "Indiranagar, Bangalore", rating: 5, text: "Sold my Classic 350 within hours. The valuation was completely fair and the doorstep pickup was super convenient. Money was in my account instantly." },
  { id: 2, name: "Priya Desai", initials: "PD", location: "Koramangala, Bangalore", rating: 5, text: "Bought a used MT-15 from ReRideX. The bike was in pristine condition, just like a new one. The 6-month engine warranty gave me great peace of mind." },
  { id: 3, name: "Vikram Reddy", initials: "VR", location: "Whitefield, Bangalore", rating: 5, text: "The RC transfer process is usually a headache, but these guys handled everything smoothly. Completely hassle-free experience from start to finish." },
  { id: 4, name: "Anjali Rao", initials: "AR", location: "HSR Layout, Bangalore", rating: 5, text: "Got a great deal on an Activa 6G. The home test drive feature was a lifesaver since I couldn't visit the showroom. Very transparent pricing." },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("BUY");
  const [mobileSlide, setMobileSlide] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const buySlides = sliderData.filter((s) => [2, 3, 4].includes(s.id));
  const sellSlides = sliderData.filter((s) => [1, 5].includes(s.id));
  const currentMobileArray = activeTab === "BUY" ? buySlides : sellSlides;
  const activeMobileFeatures = activeTab === "BUY" ? whyBuyFeatures : whySellFeatures;

  const [formData, setFormData] = useState({
    name: "", mobile: "", regNo: "", brand: "", model: "", kmDriven: "", ownership: "",
  });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    if (!value || value.trim() === "") return "This field is required";
    switch (name) {
      case "name":
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Only letters and spaces allowed";
        break;
      case "mobile":
        if (!/^\d+$/.test(value)) return "Only numbers allowed";
        if (value.length !== 10) return "Mobile number must be exactly 10 digits";
        break;
      case "regNo":
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) return "No special characters allowed";
        break;
      case "model":
        if (!/^[a-zA-Z0-9\s\-]+$/.test(value)) return "Only letters and numbers allowed";
        break;
      default:
        break;
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleBrandChange = (e) => {
    const selectedBrand = e.target.value;
    const defaultModel = selectedBrand === "Other" ? "" : "";
    setFormData((prev) => ({ ...prev, brand: selectedBrand, model: defaultModel, }));
    setErrors((prev) => ({ ...prev, brand: "", model: "" }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) { newErrors[key] = errorMsg; isValid = false; }
    });
    setErrors(newErrors);

    if (isValid) {
      setIsSubmitting(true);
      try {
        const payload = {
          fullName: formData.name, mobileNumber: formData.mobile, vehicleNo: formData.regNo,
          brand: formData.brand, model: formData.model, kmDriven: formData.kmDriven, noOfOwners: formData.ownership,
        };
        // PRODUCTION URL (Commented out for local testing)
        // const response = await fetch("https://api.reridex.com/api/leads/valuation", {

      // LOCAL TEST URL (Using your local Spring Boot server)
        const response = await fetch("http://localhost:8080/api/leads/valuation", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });

        if (response.ok) {
          setShowSuccessModal(true);
          setFormData({ name: "", mobile: "", regNo: "", brand: "", model: "", kmDriven: "", ownership: "" });
        } else {
          toast.error("Failed to submit details. Please try again.");
        }
      } catch (error) {
        toast.error("Server error! Make sure Spring Boot is running.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    if (isMobile) return; 
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => prev === sliderData.length - 1 ? 0 : prev + 1);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, [isMobile]);

  useEffect(() => { setMobileSlide(0); }, [activeTab]);

  useEffect(() => {
    if (!isMobile) return; 
    const mobileInterval = setInterval(() => {
      setMobileSlide((prev) => prev === currentMobileArray.length - 1 ? 0 : prev + 1);
    }, 5000);
    return () => clearInterval(mobileInterval);
  }, [activeTab, currentMobileArray.length, isMobile]);

  const renderDesktopSlide = (slide, isFirst) => {
    const loadingStrategy = isFirst ? "eager" : "lazy";
    const priority = isFirst ? "high" : "auto";

    if (slide.customLayout === "premiumBanner") {
      return (
        <div className={`${styles.heroSlide} ${styles.redBannerSlide}`} key={`desktop-${slide.id}`}>
          <div className={styles.rbBgEffects}>
            <div className={styles.rbSlashLine1}></div><div className={styles.rbSlashLine2}></div>
            <div className={styles.rbCircleGlow}></div><div className={styles.rbDotPattern}></div>
          </div>
          <div className={styles.rbLeft}>
            <img src={slide.image} alt="Bikes" className={styles.rbBikeImg} fetchPriority={priority} loading={loadingStrategy} decoding="async" />
          </div>
          <div className={styles.rbCenter}>
            <h2 className={styles.rbMainTitle}>
              {slide.bannerData.title1}<br /><span className={styles.rbTextYellow}>{slide.bannerData.title2}</span><br /><span className={styles.rbTextMassive}>{slide.bannerData.title3}</span>
            </h2>
            <div className={styles.rbBadgeWhite}>{slide.bannerData.badge}</div>
            <p className={styles.rbDescription}>{slide.bannerData.desc}</p>
            <Link to={slide.bannerData.btnLink} className={styles.rbActionBtn}>{slide.bannerData.btnText}</Link>
          </div>
          <div className={styles.rbRight}>
            <img src={slide.image2} alt="Inspection" className={styles.rbInspectionImg} loading={loadingStrategy} decoding="async" />
          </div>
        </div>
      );
    }
    if (slide.customLayout === "darkSplitBanner") {
      return (
        <div className={`${styles.heroSlide} ${styles.darkBannerSlide}`} key={`desktop-${slide.id}`}>
          <div className={styles.dsImageBase}>
            <img src={slide.image} alt="Handshake" className={styles.dsCoverImg} loading={loadingStrategy} decoding="async" />
          </div>
          <div className={styles.dsLeftOverlay}><div className={styles.dsGridPattern}></div></div>
          <div className={styles.dsTextContent}>
            <div className={styles.dsBadge}>{slide.bannerData.badge}</div>
            <h2 className={styles.dsMainTitle}>{slide.bannerData.title1}<br /><span className={styles.dsTextYellow}>{slide.bannerData.title2}</span><br />{slide.bannerData.title3}</h2>
            <p className={styles.dsDescription}>{slide.bannerData.desc}</p>
            <Link to={slide.bannerData.btnLink} className={styles.dsActionBtn}>{slide.bannerData.btnText}</Link>
          </div>
        </div>
      );
    }
    if (slide.customLayout === "cutoutBanner") {
      return (
        <div className={`${styles.heroSlide} ${styles.cutoutSlide}`} key={`desktop-${slide.id}`}>
          <div className={styles.csTextContainer}>
            <div className={styles.csBadge}>{slide.bannerData.badge}</div>
            <h2 className={styles.csTitle}>{slide.bannerData.title1} <br /><span className={styles.csHighlight}>{slide.bannerData.title2}</span></h2>
            <p className={styles.csDesc}>{slide.bannerData.desc}</p>
            <div className={styles.csFeatures}>
              {slide.bannerData.features?.map((feat, i) => (<div className={styles.csFeature} key={i}><span className={styles.csFeatureIcon}>✓</span> {feat}</div>))}
            </div>
            <Link to={slide.bannerData.btnLink} className={styles.csBtn}>{slide.bannerData.btnText}</Link>
          </div>
          <div className={styles.csImageContainer}>
            <div className={styles.csImageWrapper}>
              <img src={slide.image} alt="Sale Agreement" className={styles.csImg} loading={loadingStrategy} decoding="async" />
            </div>
          </div>
        </div>
      );
    }
    if (slide.customLayout === "curvedTestDrive") {
      return (
        <div className={`${styles.heroSlide} ${styles.htdSlide}`} key={`desktop-${slide.id}`}>
          <div className={styles.htdBackground}>
            <img src={slide.image} alt="Test Drive" className={styles.htdImage} loading={loadingStrategy} decoding="async" />
            <div className={styles.htdOverlay}></div>
          </div>
          <div className={styles.htdCurvePane}>
            <div className={styles.htdContent}>
              <span className={styles.htdBadge}><span className={styles.htdPulse}></span>{slide.bannerData.badge}</span>
              <h2 className={styles.htdTitle}>{slide.bannerData.title1} <br /><span className={styles.htdHighlight}>{slide.bannerData.title2}</span></h2>
              <div className={styles.htdRefundBox}><span className={styles.htdCheck}>₹</span>{slide.bannerData.title3}</div>
              <p className={styles.htdDesc}>{slide.bannerData.desc}</p>
              <Link to={slide.bannerData.btnLink} className={styles.htdBtn}>{slide.bannerData.btnText}</Link>
            </div>
          </div>
        </div>
      );
    }
    if (slide.customLayout === "cinematicWebBanner") {
      return (
        <div className={`${styles.heroSlide} ${styles.cwbSlide}`} key={`desktop-${slide.id}`}>
          <img src={slide.image} alt="Motorcycle Rider" className={styles.cwbBackground} loading={loadingStrategy} decoding="async" />
          <div className={styles.cwbOverlay}></div>
          <div className={styles.cwbContent}>
            <div className={styles.cwbBadge}>{slide.bannerData.badge}</div>
            <h2 className={styles.cwbTitle}>{slide.bannerData.title1} <br /><span className={styles.cwbHighlight}>{slide.bannerData.title2}</span> <br />{slide.bannerData.title3}</h2>
            <p className={styles.cwbDesc}>{slide.bannerData.desc}</p>
            <div className={styles.cwbActionRow}>
              <Link to={slide.bannerData.btnLink} className={styles.cwbBtnPrimary}>{slide.bannerData.btnText}</Link>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderMobileSlide = (slide, isFirst) => {
    const loadingStrategy = isFirst ? "eager" : "lazy";
    const priority = isFirst ? "high" : "auto";
    const displayImage = slide.mobileImage ? slide.mobileImage : slide.image;
    const useDualLayout = slide.image2 && !slide.mobileImage;
    
    return (
      <div className={styles.mCard} key={`mobile-${slide.id}`}>
        <div className={`${styles.mcImageArea} ${useDualLayout ? styles.mBg_blue : ""}`}>
          {useDualLayout ? (
            <div className={styles.mDualImageWrap}>
              <img src={slide.image} alt="Bike" className={styles.mPngLeft} fetchPriority={priority} loading={loadingStrategy} decoding="async" />
              <img src={slide.image2} alt="Mechanic" className={styles.mPngRight} loading={loadingStrategy} decoding="async" />
            </div>
          ) : (
            <img src={displayImage} alt="Banner" className={styles.mcImg} fetchPriority={priority} loading={loadingStrategy} decoding="async" />
          )}
        </div>
        <div className={styles.mcTextArea}>
          {slide.id !== 3 && <div className={styles.mcBadge}>{slide.bannerData.badge}</div>}
          <h3 className={styles.mcTitle}>{slide.bannerData.title1} <br /><span className={styles.mcHighlight}>{slide.bannerData.title2}</span></h3>
          {slide.bannerData.title3 && <h3 className={styles.mcTitleSub}>{slide.bannerData.title3}</h3>}
          <p className={styles.mcDesc}>{slide.bannerData.desc}</p>
          {slide.bannerData.features && (
            <div className={styles.mcFeatures}>
              {slide.bannerData.features.map((feat, idx) => (<div className={styles.mcFeatureItem} key={idx}>✓ {feat}</div>))}
            </div>
          )}
          <Link to={slide.bannerData.btnLink} className={styles.mcBtn}>{slide.bannerData.btnText}</Link>
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.homeContainer} ${activeTab === "BUY" ? styles.isBuyTab : styles.isSellTab}`}>
      
      {!isMobile && (
        <section className={styles.desktopHero}>
          <div className={styles.sliderTrack} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {sliderData.map((slide, index) => renderDesktopSlide(slide, index === 0))}
          </div>
          <div className={styles.sliderDots}>
            {sliderData.map((_, index) => (
              <span key={index} className={`${styles.dot} ${currentSlide === index ? styles.activeDot : ""}`} onClick={() => setCurrentSlide(index)}></span>
            ))}
          </div>
        </section>
      )}

      {isMobile && (
        <section className={styles.mobileDashboard}>
          <div className={styles.tabContainer}>
            <button className={`${styles.tabBtn} ${activeTab === "BUY" ? styles.activeTab : ""}`} onClick={() => setActiveTab("BUY")}>BUY BIKES</button>
            <button className={`${styles.tabBtn} ${activeTab === "SELL" ? styles.activeTab : ""}`} onClick={() => setActiveTab("SELL")}>SELL BIKES</button>
          </div>
          <div className={styles.mobileContentArea}>
            <div className={styles.mobileSliderWrapper}>
              <div className={styles.sliderTrack} style={{ transform: `translateX(-${mobileSlide * 100}%)` }}>
                {currentMobileArray.map((slide, index) => renderMobileSlide(slide, index === 0))}
              </div>
            </div>
            <div className={styles.mobileDotsContainer}>
              {currentMobileArray.map((_, index) => (
                <span key={index} className={`${styles.mDot} ${mobileSlide === index ? styles.activeMDot : ""}`} onClick={() => setMobileSlide(index)}></span>
              ))}
            </div>
          </div>

          {activeTab === "BUY" && (
            <div className={styles.mcCategorySection}>
              <div className={styles.mcCatHeader}>
                <h2 className={styles.mcCatTitle}>Buy <span className={styles.mcCatHighlight}>Certified</span><br />Second Hand Bikes</h2>
                <p className={styles.mcCatSub}>Fully inspected bikes with 200+ quality checks.</p>
              </div>
              <div className={styles.mcCatGrid}>
                <Link to="/buy?category=scooters" className={styles.mcCatCard}>
                  <h4 className={styles.mcCatName}>Scooters</h4>
                  <img src={scooterImg} alt="Scooters" className={styles.mcCatCutout} loading="lazy" decoding="async" />
                </Link>
                <Link to="/buy?category=commuter" className={styles.mcCatCard}>
                  <h4 className={styles.mcCatName}>Commuter<br />Bikes</h4>
                  <img src={commuterImg} alt="Commuter Bikes" className={styles.mcCatCutout} loading="lazy" decoding="async" />
                </Link>
                <Link to="/buy?category=sports" className={styles.mcCatCard}>
                  <h4 className={styles.mcCatName}>Sports<br />Bikes</h4>
                  <img src={sportsImg} alt="Sports Bikes" className={styles.mcCatCutout} loading="lazy" decoding="async" />
                </Link>
                <Link to="/buy?category=travel" className={styles.mcCatCard}>
                  <h4 className={styles.mcCatName}>Travel &<br />Adventure</h4>
                  <img src={travellerImg} alt="Travel Bikes" className={styles.mcCatCutout} loading="lazy" decoding="async" />
                </Link>
              </div>
              <Link to="/buy" className={styles.mcCatMainBtn}>Browse All Inventory</Link>
            </div>
          )}
        </section>
      )}

      <section className={`${styles.whySellSection} ${activeTab === "BUY" ? styles.hideOnMobile : ""}`}>
        <div className={styles.wsContainer}>
          <div className={styles.wsLeft}>
            <div className={styles.wsImageBox}>
              <img src="https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=800&auto=format&fit=crop" alt="Professional Bike Inspection" className={styles.wsImage} loading="lazy" decoding="async" />
            </div>
          </div>
          <div className={styles.wsRight}>
            <div className={styles.wsTag}>SELL SMART, SELL SAFE</div>
            <h2 className={styles.wsTitle}>Sell your bike at the <span className={styles.wsHighlight}>best price</span></h2>
            <p className={styles.wsDesc}>Transforming the used two-wheeler market into a trusted, transparent experience for every rider. Skip the endless negotiations and get paid instantly.</p>
            <div className={styles.wsFeaturesRow}>
              <div className={styles.wsFeaturePill}><span className={styles.wsIcon}>💰</span> Best Market Price</div>
              <div className={styles.wsFeaturePill}><span className={styles.wsIcon}>🏠</span> Doorstep Pickup</div>
              <div className={styles.wsFeaturePill}><span className={styles.wsIcon}>⚡</span> Instant Payment</div>
              <div className={styles.wsFeaturePill}><span className={styles.wsIcon}>📄</span> Free RC Transfer</div>
            </div>
            <a href="/Sell" className={styles.wsBtn}>SELL NOW <span>&rarr;</span></a>
          </div>
        </div>
      </section>

      <section className={styles.whyChooseSection}>
        <div className={styles.wcHeader}>
          <div className={styles.wcLine}></div>
          <h2 className={styles.desktopOnly}>Why Choose ReRideX</h2>
          <h2 className={styles.mobileOnly}>{activeTab === "BUY" ? "Why Buy from ReRideX" : "Why Sell to ReRideX"}</h2>
          <div className={styles.wcLine}></div>
        </div>
        <div className={`${styles.wcGrid} ${styles.desktopOnly}`}>
          {whyBuyFeatures.map((item, index) => (
            <div className={styles.wcCard} key={`desk-${index}`}>
              <div className={styles.wcText}><h4>{item.title}</h4><p>{item.desc}</p></div>
              <div className={styles.wcIconBox}><div className={styles.wcIconBg}></div><span className={styles.wcIcon}>{item.icon}</span></div>
            </div>
          ))}
        </div>
        <div className={`${styles.wcGrid} ${styles.mobileOnly}`}>
          {activeMobileFeatures.map((item, index) => (
            <div className={styles.wcCard} key={`mob-${index}`}>
              <div className={styles.wcText}><h4>{item.title}</h4><p>{item.desc}</p></div>
              <div className={styles.wcIconBox}><div className={styles.wcIconBg}></div><span className={styles.wcIcon}>{item.icon}</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.buyNowSection} ${activeTab === "SELL" ? styles.hideOnMobile : ""}`}>
        <div className={styles.bnContainer}>
          <div className={styles.bnTextContent}>
            <div className={styles.bnTag}>EXPLORE CERTIFIED BIKES</div>
            <h2 className={styles.bnTitle}>Find your perfect <span className={styles.bnHighlight}>dream ride</span></h2>
            <p className={styles.bnDesc}>Browse India's largest inventory of fully inspected, certified, and warranty-backed second-hand bikes. Your next adventure awaits.</p>
            <div className={styles.bnFeaturesRow}>
              <div className={styles.bnFeaturePill}><span className={styles.bnIcon}>🔍</span> 200+ Checks</div>
              <div className={styles.bnFeaturePill}><span className={styles.bnIcon}>🛡️</span> 6-Month Warranty</div>
              <div className={styles.bnFeaturePill}><span className={styles.bnIcon}>💳</span> Easy EMI</div>
              <div className={styles.bnFeaturePill}><span className={styles.bnIcon}>🏍️</span> Test Ride</div>
            </div>
            <Link to="/buy" className={styles.bnBtn}>BUY NOW<span>&rarr;</span></Link>
          </div>
          <div className={styles.bnImageContent}>
            <div className={styles.bnImageBox}>
              <img src={buyimg} alt="Premium Certified Bike" className={styles.bnImage} loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      <section id="valuationForm" className={`${styles.valuationSection} ${activeTab === "BUY" ? styles.hideOnMobile : ""}`}>
        <div className={styles.valBgImage}><div className={styles.valOverlay}></div></div>
        <div className={styles.valContainer}>
          <div className={styles.valTextWrap}>
            <div className={styles.valTag}>EXPERT VALUATION</div>
            <h2 className={styles.valTitle}>Get the best price for <span className={styles.valHighlight}>your bike</span></h2>
            <p className={styles.valDesc}>Provide your bike details and our experts will contact you to offer a highly accurate, market-driven quote for your two-wheeler.</p>
            <div className={styles.valStats}>
              <div className={styles.valStatItem}><strong>24 Hrs</strong><span>Fast Callback</span></div>
              <div className={styles.valDivider}></div>
              <div className={styles.valStatItem}><strong>100%</strong><span>Transparent</span></div>
            </div>
          </div>
          <div className={styles.valWidgetWrap}>
            <form className={styles.valWidget} onSubmit={handleFormSubmit} noValidate>
              <h3 className={styles.vwTitle}>Request a Call Back</h3>
              <div className={styles.vwFormGrid}>
                <div className={styles.vwInputWrapper}>
                  <div className={`${styles.vwInputGroup} ${errors.name ? styles.errorBorder : ""}`}>
                    <span className={styles.vwIcon}>👤</span>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className={styles.vwInput} />
                  </div>
                  {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                </div>
                <div className={styles.vwInputWrapper}>
                  <div className={`${styles.vwInputGroup} ${errors.mobile ? styles.errorBorder : ""}`}>
                    <span className={styles.vwIcon}>📞</span>
                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="10-Digit Mobile" maxLength="10" className={styles.vwInput} />
                  </div>
                  {errors.mobile && <span className={styles.errorText}>{errors.mobile}</span>}
                </div>
                <div className={styles.vwInputWrapper}>
                  <div className={`${styles.vwInputGroup} ${errors.regNo ? styles.errorBorder : ""}`}>
                    <span className={styles.vwIcon}>🔢</span>
                    <input type="text" name="regNo" value={formData.regNo} onChange={handleInputChange} placeholder="Reg No (e.g. KA01AB1234)" className={styles.vwInput} style={{ textTransform: "uppercase" }} />
                  </div>
                  {errors.regNo && <span className={styles.errorText}>{errors.regNo}</span>}
                </div>
                <div className={styles.vwInputWrapper}>
                  <div className={`${styles.vwInputGroup} ${errors.brand ? styles.errorBorder : ""}`}>
                    <span className={styles.vwIcon}>🏍️</span>
                    <select name="brand" value={formData.brand} onChange={handleBrandChange} className={`${styles.vwInput} ${styles.vwSelect}`}>
                      <option value="" disabled>Select Brand</option>
                      {Object.keys(bikeDatabase).map((brand) => (<option key={brand} value={brand}>{brand}</option>))}
                    </select>
                  </div>
                  {errors.brand && <span className={styles.errorText}>{errors.brand}</span>}
                </div>
                <div className={styles.vwInputWrapper}>
                  <div className={`${styles.vwInputGroup} ${errors.model ? styles.errorBorder : ""}`}>
                    <span className={styles.vwIcon}>🏷️</span>
                    {formData.brand === "Other" ? (
                      <input type="text" name="model" value={formData.model} onChange={handleInputChange} placeholder="Type Bike Model" className={styles.vwInput} />
                    ) : (
                      <select name="model" value={formData.model} onChange={handleInputChange} className={`${styles.vwInput} ${styles.vwSelect}`} disabled={!formData.brand}>
                        <option value="" disabled>{formData.brand ? "Select Model" : "Select Brand First"}</option>
                        {formData.brand && bikeDatabase[formData.brand].map((model) => (<option key={model} value={model}>{model}</option>))}
                      </select>
                    )}
                  </div>
                  {errors.model && <span className={styles.errorText}>{errors.model}</span>}
                </div>
                <div className={styles.vwInputWrapper}>
                  <div className={`${styles.vwInputGroup} ${errors.kmDriven ? styles.errorBorder : ""}`}>
                    <span className={styles.vwIcon}>🛣️</span>
                    <select name="kmDriven" value={formData.kmDriven} onChange={handleInputChange} className={`${styles.vwInput} ${styles.vwSelect}`}>
                      <option value="" disabled>KM Driven</option>
                      <option value="0-10000">0 - 10,000 km</option>
                      <option value="10000-30000">10,000 - 30,000 km</option>
                      <option value="30000-50000">30,000 - 50,000 km</option>
                      <option value="50000+">50,000+ km</option>
                    </select>
                  </div>
                  {errors.kmDriven && <span className={styles.errorText}>{errors.kmDriven}</span>}
                </div>
                <div className={`${styles.vwInputWrapper} ${styles.spanTwo}`}>
                  <div className={`${styles.vwInputGroup} ${errors.ownership ? styles.errorBorder : ""}`}>
                    <span className={styles.vwIcon}>👥</span>
                    <select name="ownership" value={formData.ownership} onChange={handleInputChange} className={`${styles.vwInput} ${styles.vwSelect}`}>
                      <option value="" disabled>Number of Owners</option>
                      <option value="1">1st Owner</option>
                      <option value="2">2nd Owner</option>
                      <option value="3">3rd Owner</option>
                      <option value="4+">4th Owner or more</option>
                    </select>
                  </div>
                  {errors.ownership && <span className={styles.errorText}>{errors.ownership}</span>}
                </div>
              </div>
              <button type="submit" className={styles.vwBtn} disabled={isSubmitting}>
                {isSubmitting ? "SUBMITTING..." : "GET FREE QUOTE"}
              </button>
            </form>
            <div className={styles.vwFloatBadge}><span className={styles.vwSupportIcon}>📞</span> Free Consultation</div>
          </div>
        </div>
      </section>

      <section className={styles.reviewsSection}>
        <div className={styles.revHeader}>
          <div className={styles.wcLine}></div><h2>Trusted by Riders in Bangalore</h2><div className={styles.wcLine}></div>
        </div>
        <div className={styles.revSliderContainer}>
          <div className={styles.revSliderTrack}>
            {reviewsData.map((review) => (
              <div className={styles.revCard} key={`first-${review.id}`}>
                <div className={styles.revTopRow}><span className={styles.revQuoteIcon}>"</span><div className={styles.revStars}>{[...Array(review.rating)].map((_, i) => (<span key={i}>⭐</span>))}</div></div>
                <p className={styles.revText}>{review.text}</p>
                <div className={styles.revAuthorRow}><div className={styles.revAvatar}>{review.initials}</div><div className={styles.revAuthorDetails}><h4 className={styles.revName}>{review.name}</h4><span className={styles.revLocation}>{review.location}</span></div></div>
              </div>
            ))}
            {reviewsData.map((review) => (
              <div className={styles.revCard} key={`second-${review.id}`}>
                <div className={styles.revTopRow}><span className={styles.revQuoteIcon}>"</span><div className={styles.revStars}>{[...Array(review.rating)].map((_, i) => (<span key={i}>⭐</span>))}</div></div>
                <p className={styles.revText}>{review.text}</p>
                <div className={styles.revAuthorRow}><div className={styles.revAvatar}>{review.initials}</div><div className={styles.revAuthorDetails}><h4 className={styles.revName}>{review.name}</h4><span className={styles.revLocation}>{review.location}</span></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <a href="https://wa.me/918310012556?text=Hey%20Reridex..." className={styles.whatsappFloat} target="_blank" rel="noopener noreferrer" title="Chat with us on WhatsApp">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" loading="lazy" decoding="async" />
      </a>

      {showSuccessModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(5px)" }}>
          <div style={{ background: "white", width: "90%", maxWidth: "450px", padding: "30px", borderRadius: "20px", textAlign: "center", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", position: "relative", animation: "fadeInUp 0.3s ease-out forwards" }}>
            <button onClick={() => setShowSuccessModal(false)} style={{ position: "absolute", top: "15px", right: "20px", background: "none", border: "none", fontSize: "1.8rem", color: "#999", cursor: "pointer", lineHeight: 1 }}>&times;</button>
            <div style={{ fontSize: "4.5rem", marginBottom: "10px" }}>✅</div>
            <h2 style={{ color: "#004AAD", fontSize: "1.8rem", marginBottom: "10px", fontWeight: "800" }}>Thanks for reaching out!</h2>
            <p style={{ color: "#555", fontSize: "1rem", lineHeight: "1.5", marginBottom: "15px" }}>Your details have been successfully submitted. Our experts will review your request and reach out to you shortly.</p>
            <div style={{ margin: "0 0 25px 0", padding: "15px", background: "#f8f9fa", borderRadius: "12px", textAlign: "left", fontSize: "0.85rem", color: "#444", border: "1px solid #eee" }}>
              <strong style={{ color: "#004AAD", fontSize: "0.95rem" }}>📍 ReRideX HQ</strong><br />174/40, 201, 2nd Floor, Lucky Paradise,<br />8th F Main Road, 22nd Cross, Opp. ICICI Bank,<br />3rd Block, Jayanagar, Bangalore 560011<br /><br /><strong>📞 Phone:</strong> +91 8310012556<br /><strong>✉️ Email:</strong> support@reridex.com
            </div>
            <button onClick={() => setShowSuccessModal(false)} style={{ background: "#ffcc00", color: "#111", border: "none", padding: "14px 40px", fontSize: "1.1rem", fontWeight: "bold", borderRadius: "30px", cursor: "pointer", width: "100%", boxShadow: "0 4px 6px rgba(255, 204, 0, 0.3)" }}>Got it, Thanks!</button>
          </div>
          <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
      )}
    </div>
  );
};

export default Home;