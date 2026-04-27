import './App.css'

function App() {
  return (
    <div className="app-container">
      {/* 1. Navigation Bar */}
      <nav className="navbar">
        <div className="logo">STUDIO_NAME</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#equipment">Equipment</a></li>
          <li><a href="#rates">Rates</a></li>
          <li><a href="#booking" className="cta-btn">Book Now</a></li>
        </ul>
      </nav>

      <main>
        {/* 2. Hero / Home Section */}
        <section id="home" className="section hero">
          <h1>Professional Space for Creative Execution.</h1>
          <p>A fully-equipped production hub located in [Your Location].</p>
        </section>

        {/* 3. Equipment Section */}
        <section id="equipment" className="section">
          <h2>The Gear</h2>
          <p>We feature industry-standard Canon and Sony systems and professional lighting.</p>
          {/* You will build your gear grid here later */}
        </section>

        {/* 4. Rates Section */}
        <section id="rates" className="section">
          <h2>Simple Rates</h2>
          <div className="rate-card">
            <span>Hourly Rate</span>
            <strong>$XX / hr</strong>
          </div>
        </section>
      </main>

      {/* 5. Footer */}
      <footer className="footer">
        <p>© 2026 Studio Name | Digital Media Internship Project</p>
      </footer>
    </div>
  )
}

export default App
