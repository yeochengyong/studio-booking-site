import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import heroimg from '../assets/hero picture - home page.png';
import loungeImg from '../assets/lounge rest.png';
import hairMakeupImg from '../assets/hmua area.png';
import backdropImg from '../assets/backdrop.png';
import deskImg from '../assets/open concept studio.png';

// images
const images = {
  hero: heroimg,
  loungeThumbnail: loungeImg,
  hairMakeupThumbnail: hairMakeupImg,
  backdropImage: backdropImg,
  desk: deskImg,
};

// scroll reveal
function useIntersectionObserver(options) {
  const [activeId, setActiveId] = useState(null);
  const elementsRef = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= options.threshold) {
          setActiveId(entry.target.id);
        }
      });
    }, options);

    const elements = elementsRef.current;
    Object.values(elements).forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      Object.values(elements).forEach((element) => {
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [options]);

  return [activeId, elementsRef];
}

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

const ScrollRevealWords = () => {
  const words = ["Professionals", "Freelancers", "Creators", "Entrepreneurs", "You."];
  const [activeId, elementsRef] = useIntersectionObserver({
    rootMargin: '0px 0px -27% 0px',
    threshold: 0,
  });

  return (
    <div className="scroll-reveal-container">
      <p className="intro-text">A space for</p>
      <div className="revealing-words-list">
        {words.map((word, index) => {
          const id = `word-${index}`;
          const isActive = id === activeId;
          return (
            <div
              key={index}
              id={id}
              className={`revealing-word ${isActive ? 'focused' : 'blurred'}`}
              ref={(el) => (elementsRef.current[id] = el)}
            >
              {word}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ImprovedAmenitiesGrid = () => {
  const amenities = [
    {
      title: "COMMON AREA",
      image: images.loungeThumbnail,
      description: "A comfortable lounge area for clients to eat, work and relax between shoots. Feel free to use the furniture as props for your shoot as well!"
    },
    {
      title: "HAIR & MAKEUP STATION",
      image: images.hairMakeupThumbnail,
      description: "Dedicated space for models and hair/makeup artists. Equipped with a large mirror, lighting, and storage for beauty products and tools."
    },
    {
      title: "VERSATILE BACKDROPS",
      image: images.backdropImage,
      description: "Various colors and textures to provide a custom backdrop for any shoot."
    }
  ];

  return (
    <div className="amenities-grid-container">
      <h2 className="grid-header">OUR AMENITIES</h2>
      <div className="amenities-grid">
        {amenities.map((amenity, index) => (
          <div key={index} className="amenity-card">
            <h3 className="card-title">{amenity.title}</h3>
            <div className={`card-image-wrapper ${amenity.image ? '' : 'no-image'}`}>
              {amenity.image ? <img src={amenity.image} alt={amenity.title} /> : <div className="grey-box" />}
            </div>
            <p className="card-description">{amenity.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

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
        <p>Mon - Sun 9am - 7pm</p>
      </div>
    </div>
  </footer>
);

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="studio-home-page">
      <Header />
      <section className="hero-image">
        <div className="wide-image-wrapper">
          <img src={images.hero} alt="Studio Lounge" />
        </div>
      </section>
      <main className="main-content">
        <div className="hero-cta">
          <button className="book-button" onClick={() => navigate('/booking')}>
            Book your session <span aria-hidden="true">→</span>
          </button>
        </div>

        <ScrollRevealWords />

        <div className="studio-details-section">
          <p className="studio-description">Open-Concept Photography and Videography Studio</p>
          <div className="desk-image-wrapper">
            <img src={images.desk} alt="Studio Desk Area" />
          </div>
          <p className="cyclorama-text">
            Enfinite Studio provides you with a 6mx6m cyclorama accompanied by a 24" curve radius ensuring 
            a seamless background and flexible room to light your subject.
          </p>
        </div>

        <ImprovedAmenitiesGrid />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;