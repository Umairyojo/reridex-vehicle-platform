import React from "react";

import { Link } from "react-router-dom";

import styles from "./Footer.module.css";



// 🔥 OPTIMIZATION: Migrated local Logo to Cloudinary CDN!

const logoUrl = "https://res.cloudinary.com/dwfz30tb7/image/upload/f_auto,q_auto/v1775051592/Logo_jatucm.webp";



const Footer = () => {

  return (

    <footer className={styles.footerContainer}>

      <div className={styles.footerTop}>

        {/* Column 1: Brand Logo, Slogan, Tagline, CIN & Icons */}

        <div className={styles.footerColumn}>

          <Link to="/" className={styles.footerLogoWrap}>

            <img

              src={logoUrl}

              alt="ReRideX Logo"

              className={styles.footerLogo}

              loading="lazy"

              decoding="async"

            />

          </Link>



          <h4 className={styles.brandSlogan}>ReRideX – Re-Live the Ride.</h4>



          <p className={styles.brandTagline}>

            Transforming India's used two-wheeler market with trust,

            transparency, and technology. Whether you're selling your old ride

            or finding your next certified dream bike, we guarantee the best

            prices and a completely hassle-free process.

          </p>



          <p

            style={{

              fontSize: "0.85rem",

              color: "#aaa",

              marginTop: "-10px",

              marginBottom: "20px",

              fontWeight: "600",

              letterSpacing: "0.5px",

            }}

          >

            CIN: U45403KA2026PTC217949

          </p>



          <div className={styles.socialIcons}>

            {/* Facebook */}

            <a

              href="https://www.facebook.com/share/18BHhU8Qxo/?mibextid=wwXIfr"

              target="_blank"

              rel="noopener noreferrer"

              className={styles.socialIcon}

              aria-label="Facebook"

            >

              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">

                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />

              </svg>

            </a>



            {/* Instagram */}

            <a

              href="https://www.instagram.com/thereridex?igsh=OGw0aHVpZnl6azBq&utm_source=qr"

              target="_blank"

              rel="noopener noreferrer"

              className={styles.socialIcon}

              aria-label="Instagram"

            >

              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">

                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 1.76-6.969 5.848-.058 1.281-.072 1.688-.072 4.948s.014 3.667.072 4.947c.189 4.088 2.611 5.648 6.969 5.848 1.28.058 1.689.072 4.947.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-1.76 6.97-5.848.058-1.28.072-1.689.072-4.947s-.014-3.667-.072-4.947c-.188-4.088-2.616-5.648-6.97-5.848-1.28-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />

              </svg>

            </a>



            {/* YouTube */}

            <a

              href="https://youtube.com/@thereridex?si=ljWGRPNH-spjwtlu"

              target="_blank"

              rel="noopener noreferrer"

              className={styles.socialIcon}

              aria-label="YouTube"

            >

              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">

                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />

              </svg>

            </a>



            {/* LinkedIn */}

            <a

              href="https://www.linkedin.com/company/reridex/"

              target="_blank"

              rel="noopener noreferrer"

              className={styles.socialIcon}

              aria-label="LinkedIn"

            >

              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">

                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />

              </svg>

            </a>

          </div>

        </div>



        {/* Column 2: Contact Info */}

        <div className={styles.footerColumn}>

          <h3 className={styles.columnTitle}>Contact Us</h3>

          <ul className={styles.contactInfo}>

            <li>

              <span className={styles.cIcon}>📍</span>

              <div>

                <strong>ReRideX HQ</strong>

                <br />

                174/40, 201, 2nd Floor, Lucky Paradise,

                <br />

                8th F Main Road, 22nd Cross, Opp. ICICI Bank,

                <br />

                3rd Block, Jayanagar, Bangalore 560011

              </div>

            </li>

            <li>

              <span className={styles.cIcon}>📞</span>

              +91 8310012556

            </li>

            <li>

              <span className={styles.cIcon}>✉️</span>

              support@reridex.com

            </li>

          </ul>

        </div>



        {/* Column 3: Live Location Map */}

{/* Column 3: Live Location Map */}

        <div className={styles.footerColumn}>

          <h3 className={styles.columnTitle}>Our Location</h3>

          <div className={styles.mapContainer}>

            <iframe

              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3888.6102575393065!2d77.5834138!3d12.9327527!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15559110414d%3A0x3997950c08bbdb55!2sReRideX!5e0!3m2!1sen!2sin!4v1772885138576!5m2!1sen!2sin"

              width="100%"

              height="100%"

              style={{ border: 0 }}

              allowFullScreen=""

              loading="lazy"

              referrerPolicy="no-referrer-when-downgrade"

              title="ReRideX Location Map"

            ></iframe>

          </div>

        </div>



      </div>



      {/* Bottom Copyright Bar */}

      <div className={styles.footerBottom}>

        <p>© {new Date().getFullYear()} ReRideX. All rights reserved.</p>

        <p className={styles.madeWithLove}>Made with ❤️ in India</p>

      </div>

    </footer>

  );

};



export default Footer;