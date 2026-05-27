import React, { useEffect } from "react";
import styles from "./AboutUs.module.css";

// 🔥 OPTIMIZATION: Migrated local asset to Lightning Fast Cloudinary CDN!
const aboutImg = "https://res.cloudinary.com/dwfz30tb7/image/upload/f_auto,q_auto/v1775051592/buyimg_g5zhms.webp";

const AboutUs = () => {
  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.aboutContainer}>
      {/* ==========================================
          🔥 HERO SECTION WITH DIAGONAL CUTOUT
          ========================================== */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <div className={styles.badge}>KNOW OUR STORY</div>
          <h1 className={styles.heroTitle}>
            About Us – <span className={styles.textYellow}>ReRideX</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Transforming the way people buy and sell pre-owned two-wheelers in
            India.
          </p>
        </div>
      </section>

      {/* ==========================================
          🔥 MAIN STORY SECTION (OVERLAPPING LAYOUT)
          ========================================== */}
      <section className={styles.storySection}>
        <div className={styles.storyWrapper}>
          <div className={styles.storyImageSide}>
            <div className={styles.imageDecor}></div>
            {/* 🔥 Using Cloudinary CDN Image */}
            <img
              src={aboutImg}
              alt="ReRideX Premium Bike"
              className={styles.mainImage}
              loading="lazy"
              decoding="async"
            />
            <div className={styles.floatingCard}>
              <span className={styles.floatNumber}>100%</span>
              <span className={styles.floatText}>Trusted & Transparent</span>
            </div>
          </div>

          <div className={styles.storyTextSide}>
            <h2 className={styles.sectionTitle}>
              Making the used bike market{" "}
              <span className={styles.textBlue}>Transparent & Reliable</span>
            </h2>
            <div className={styles.titleUnderline}></div>
            <p className={styles.storyParagraph}>
              ReRideX is a modern and trusted online platform dedicated to
              transforming the way people buy and sell pre-owned two-wheelers in
              India. Our mission is to make the used bike market more
              transparent, reliable, and convenient for everyone.
            </p>
            <p className={styles.storyParagraph}>
              At ReRideX, we understand that purchasing or selling a used
              motorcycle can often be complicated and uncertain. That’s why we
              created a platform where customers can confidently{" "}
              <strong>buy, sell, service, and finance</strong> certified
              second-hand bikes — all in one place.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          🔥 CORE PILLARS GRID (PREMIUM CARDS)
          ========================================== */}
      <section className={styles.pillarsSection}>
        <div className={styles.pillarsHeader}>
          <h2>Why We Stand Out</h2>
          <p>We remove the traditional challenges of the resale market.</p>
        </div>

        <div className={styles.pillarsGrid}>
          <div className={styles.pillarCard}>
            <div className={styles.pillarIconWrap}>
              <span className={styles.pillarIcon}>🔍</span>
            </div>
            <h3>200+ Point Inspection</h3>
            <p>
              Every motorcycle undergoes a comprehensive quality inspection by
              trained professionals, ensuring strict standards for safety,
              performance, and reliability.
            </p>
          </div>

          <div className={styles.pillarCard}>
            <div className={styles.pillarIconWrap}>
              <span className={styles.pillarIcon}>🛡️</span>
            </div>
            <h3>Warranty Protection</h3>
            <p>
              To provide even greater peace of mind, selected bikes come with
              core engine warranty options, giving customers extra protection
              after purchase.
            </p>
          </div>

          <div className={styles.pillarCard}>
            <div className={styles.pillarIconWrap}>
              <span className={styles.pillarIcon}>📄</span>
            </div>
            <h3>Hassle-Free RC Transfer</h3>
            <p>
              We take care of the complete RC ownership transfer process,
              ensuring a smooth and effortless experience without any
              unnecessary paperwork for you.
            </p>
          </div>

          <div className={styles.pillarCard}>
            <div className={styles.pillarIconWrap}>
              <span className={styles.pillarIcon}>⚡</span>
            </div>
            <h3>Fair Pricing & Fast Pay</h3>
            <p>
              For sellers, ReRideX offers fair, data-driven pricing, quick
              doorstep vehicle evaluation, and instant payments directly to your
              bank account.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          🔥 CLOSING BANNER SECTION
          ========================================== */}
      <section className={styles.closingSection}>
        <div className={styles.closingContent}>
          <h2>
            Building a{" "}
            <span className={styles.textYellow}>Smarter Ecosystem</span>
          </h2>
          <p>
            Beyond buying and selling, ReRideX also supports customers with
            two-wheeler servicing and easy financing options, helping more
            people access reliable mobility at affordable prices.
          </p>
          <p className={styles.closingHighlight}>
            With a focus on trust, technology, and customer satisfaction,
            ReRideX is transforming pre-owned mobility across India.
          </p>
          <div className={styles.sloganBox}>
            ReRideX &ndash; Re-Live the Ride.
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;