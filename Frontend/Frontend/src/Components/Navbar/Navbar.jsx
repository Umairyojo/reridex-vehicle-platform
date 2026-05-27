import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, PlusCircle, ShoppingBag, Info, ChevronDown } from "lucide-react";
import styles from "./Navbar.module.css";

// 🔥 OPTIMIZATION 1: Migrated local Logo to Cloudinary CDN for instant loading!
const logoImage = "https://res.cloudinary.com/dwfz30tb7/image/upload/f_auto,q_auto/v1775051592/Logo_jatucm.webp";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedCity, setSelectedCity] = useState("Bangalore");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  // Defaulting to Bangalore until the backend sends more cities
  const [availableCities, setAvailableCities] = useState(["Bangalore"]);

  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Fetch cities dynamically from Spring Boot!
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/locations`);
        if (response.ok) {
          const data = await response.json();
          // Assuming backend sends a list of objects e.g., [{id: 1, cityName: 'Bangalore'}, ...]
          if (data && data.length > 0) {
            const cityNames = data.map((loc) => loc.cityName || loc.name || loc);
            setAvailableCities(cityNames);

            // Optional: If Bangalore isn't in the DB, set the first city as default
            if (!cityNames.includes(selectedCity)) {
              setSelectedCity(cityNames[0]);
            }
          }
        }
      } catch (error) {
        // Silently fail in production if API is down, defaulting to Bangalore
      }
    };

    fetchLocations();
  }, [selectedCity]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setIsCityDropdownOpen(false);
    // Save to localStorage so if user refreshes, it remembers their city!
    localStorage.setItem("userCity", city);
  };

  // On load, check if user already picked a city before
  useEffect(() => {
    const savedCity = localStorage.getItem("userCity");
    if (savedCity) {
      setSelectedCity(savedCity);
    }
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <div className={styles.logoContainer}>
          <Link to="/">
            {/* 🔥 OPTIMIZATION 2: Added fetchpriority="high" to force the logo to load instantly */}
            <img 
              src={logoImage} 
              alt="ReRideX Logo" 
              className={styles.logoImg} 
              fetchpriority="high" 
              decoding="async" 
            />
          </Link>
        </div>

        {/* Dynamic Location Selector */}
        <div className={styles.locationSelector} ref={dropdownRef}>
          <button
            className={styles.locationBtn}
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
          >
            <span className={styles.cityText}>{selectedCity}</span>
            <ChevronDown
              size={16}
              className={`${styles.chevron} ${isCityDropdownOpen ? styles.rotate : ""}`}
            />
          </button>

          {isCityDropdownOpen && (
            <ul className={styles.dropdownMenu}>
              {availableCities.map((city, idx) => (
                <li
                  key={idx}
                  className={`${styles.dropdownItem} ${selectedCity === city ? styles.activeCity : ""}`}
                  onClick={() => handleCitySelect(city)}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Desktop & Mobile Links */}
      <ul className={`${styles.navLinks} ${isOpen ? styles.active : ""}`}>
        <li className={styles.navItem}>
          <Link to="/" className={styles.navLink} onClick={toggleMenu}>
            <Home size={18} className={styles.icon} />
            <span>Home</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/sell" className={styles.navLink} onClick={toggleMenu}>
            <PlusCircle size={18} className={styles.icon} />
            <span>Sell Now</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/buy" className={styles.navLink} onClick={toggleMenu}>
            <ShoppingBag size={18} className={styles.icon} />
            <span>Buy Now</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/about" className={styles.navLink} onClick={toggleMenu}>
            <Info size={18} className={styles.icon} />
            <span>About Us</span>
          </Link>
        </li>
      </ul>

      {/* Hamburger Icon for Mobile Devices */}
      <div className={styles.hamburger} onClick={toggleMenu}>
        <span className={`${styles.bar} ${isOpen ? styles.barOne : ""}`}></span>
        <span className={`${styles.bar} ${isOpen ? styles.barTwo : ""}`}></span>
        <span className={`${styles.bar} ${isOpen ? styles.barThree : ""}`}></span>
      </div>
    </nav>
  );
};

export default Navbar;