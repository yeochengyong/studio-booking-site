import React from 'react';
import './About.css';
import mapImg from '../assets/map.png';
import enfinite3d from '../assets/enfinite-3d.png';

const Header = () => (
  <header className="header">
    <div className="header-left">
      <a href="/about" className="nav-link">ABOUT</a>
      <a href="/booking" className="nav-link">BOOKING</a>
    </div>
    <div className="logo-container">
      <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 className="logo">
          <span className="logo-main">ENFINITE</span>
          <span className="logo-sub">studio</span>
        </h1>
      </a>
    </div>
    <div className="header-right">
      <a href="/gallery" className="nav-link">GALLERY</a>
      <a href="/equipment" className="nav-link">EQUIPMENT</a>
    </div>
  </header>
);

const Footer = () => (
  <footer className="footer">
    <div className="footer-left">
      <div className="contact-column">
        <p>Enfinite Studio</p>
        <p>hello@enfinite.co</p>
      </div>
      <i className="fab fa-instagram instagram-icon"></i>
    </div>
    <div className="footer-center">
      <div className="contact-column">
        <p>Location</p>
        <p>55 Kim Chuan Dr, #07-02, Singapore 537098</p>
      </div>
      <div className="contact-column">
        <p>Opening Hours</p>
        <p>Mon - Sun<br />8am - 7am</p>
      </div>
    </div>
  </footer>
);

// --- Main About Page Component ---
const About = () => {
  return (
    <div className="studio-about-page">
      <Header />

      <div className="about-content-wrapper">
        <div className="vertical-about-text" aria-hidden="true">
          About
        </div>

        <main className="about-main-content">
          <section className="who-are-we-section">
            <div className="who-are-we-title">
              <div className="text-who">who</div>
              <div className="text-are">are</div>
              <div className="enfinite-3d-wrapper">
                <img src={enfinite3d} alt="ENFINITE 3D graphic" className="enfinite-3d" />
              </div>
              <div className="text-we">we?</div>
            </div>

            <div className="who-are-we-desc">
              <p>
                Enfinite Studio is your blank canvas. We've removed all the noise to bring
                you a bright, clean, well-equipped and spacious environment that's ready
                to handle any project. It's a space for those who value efficiency and a
                stress free process.
              </p>
            </div>
          </section>

          <section className="find-us-section">
            <div className="find-us-left">
              <h2 className="find-us-heading">
                <span className="italic-find">find</span> <span className="bold-us">US</span>
              </h2>
              <div className="find-us-desc">
                <p>
                  Situated in the east, we are within walking distance of Tai Seng MRT
                  (CC11), along with multiple bus services (25, 45, 51, 55, 87, 151, 854)
                  next to Kim Chuan Road.
                </p>
                <p>
                  Our space is nestled among many amenities, including a nearby coffee
                  shop and nearby shopping malls (18 Tai Seng, Tai Seng Centre)
                </p>
              </div>
            </div>
            <div className="find-us-right">
              <div className="map-wrapper">
                <img src={mapImg} alt="Circular map of 55 Kim Chuan Drive" className="map-image" />
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default About;