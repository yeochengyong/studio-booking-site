import React, { useState, useEffect } from 'react';
import './Booking.css';
import ratesBg from '../assets/rates-bg.png'; 
import qrCodeImg from '../assets/paynow-qrcode.png'; 

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

const Booking = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [userDetails, setUserDetails] = useState({ name: '', phone: '', email: '' });

  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);
  
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00',
    '21:00', '22:00', '23:00'
  ];

  // logic to enforce contiguous selection
  const handleSlotToggle = (slot) => {
    if (selectedSlots.length === 0) {
      setSelectedSlots([slot]);
      return;
    }

    const sortedCurrent = [...selectedSlots].sort();
    const slotIndex = timeSlots.indexOf(slot);
    const firstIndex = timeSlots.indexOf(sortedCurrent[0]);
    const lastIndex = timeSlots.indexOf(sortedCurrent[sortedCurrent.length - 1]);

    if (selectedSlots.includes(slot)) {
      // If clicking already selected slot, only allow unselecting from ends
      if (slotIndex === firstIndex || slotIndex === lastIndex) {
        setSelectedSlots(selectedSlots.filter(s => s !== slot));
      } else {
        // If they click in the middle, reset selection to just that slot
        setSelectedSlots([slot]);
      }
    } else {
      // If adding a new slot, it must be right before the first or right after the last
      if (slotIndex === firstIndex - 1 || slotIndex === lastIndex + 1) {
        setSelectedSlots([...selectedSlots, slot].sort());
      } else {
        // If they click a slot far away, start a brand new selection block
        setSelectedSlots([slot]);
      }
    }
  };

  // calc price based on slot & rates
  const calculateTotal = () => {
    let total = 20; // $20 base cleaning fee
    selectedSlots.forEach(slot => {
      const hour = parseInt(slot.split(':')[0]);
      if (hour >= 8 && hour <= 20) {
        total += 80;
      } else {
        total += 95;
      }
    });
    return total;
  };

  const handleNextStep = () => {
    if (step === 1 && selectedDate && selectedSlots.length >= 2) {
      setStep(2);
    } else if (step === 2 && userDetails.name && userDetails.phone) {
      setStep(3);
    }
  };

  // temp static whatsapp link gen (to be worked on)
  const generateWhatsAppLink = () => {
    const phone = "65XXXXXXXX";
    const total = calculateTotal();
    const text = `Hi Enfinite Studio! I've just made a payment for a booking.%0A%0A*Name:* ${userDetails.name}%0A*Phone:* ${userDetails.phone}%0A*Date:* April ${selectedDate}, 2026%0A*Time:* ${selectedSlots[0]} to ${selectedSlots[selectedSlots.length - 1]} (${selectedSlots.length} hours)%0A*Total Paid:* $${total}%0A%0AI will attach my payment screenshot below!`;
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <div className="studio-booking-page">
      <Header />

      <main className="booking-main-content">
        {/* Studio Rates Layout */}
        <section className="rates-hero" style={{ backgroundImage: `url(${ratesBg})` }}>
          <div className="rates-content-wrapper">
            
            <div className="rates-left-group">
              <div className="vertical-title-container">
                <span className="vert-word">Studio Rates</span>
              </div>
              
              <div className="rate-categories">
                <div className="rate-category">
                  <h2>Weekdays</h2>
                  <p>mon tue wed thur fri</p>
                </div>
                <div className="rate-category">
                  <h2>Weekends</h2>
                  <p>sat sun</p>
                </div>
                <div className="rate-category">
                  <h2>Public Holidays</h2>
                </div>
              </div>
            </div>

            <div className="rates-glass-card">
              <div className="rate-row">
                <span>8am - 9pm</span>
                <span>80</span>
              </div>
              <div className="rate-row">
                <span>9pm - 7am</span>
                <span>95</span>
              </div>
              <div className="rate-per-hour">per hour</div>
            </div>
          </div>
          
          <div className="cleaning-fee-note">
            each booking comes with an additional $20 cleaning fee
          </div>
        </section>

        {/* Schedule Section */}
        <section className="schedule-section">
          
          {/* Instructions Block */}
          <div className="booking-instructions">
            <h3>How to Book</h3>
            <div className="instruction-steps">
              <p><span>1</span> Select your desired date and back-to-back timeslots (min. 2 hours).</p>
              <p><span>2</span> Confirm your details and total pricing.</p>
              <p><span>3</span> Make payment via PayNow and send us your receipt via WhatsApp to secure your slot!</p>
            </div>
          </div>

          <div className="schedule-header">
            <h2>Schedule</h2>
            <p>date & time</p>
          </div>

          {step === 1 && (
            <div className="booking-grid">
              <div className="calendar-container">
                <div className="calendar-header">
                  <button className="cal-nav">&lt;</button>
                  <span className="cal-month">April 2026</span>
                  <button className="cal-nav">&gt;</button>
                </div>
                <div className="calendar-days-grid">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="cal-day-name">{day}</div>
                  ))}
                  <div className="cal-date empty">29</div>
                  <div className="cal-date empty">30</div>
                  <div className="cal-date empty">31</div>
                  
                  {calendarDays.map(day => (
                    <button 
                      key={day} 
                      className={`cal-date ${selectedDate === day ? 'selected' : ''}`}
                      onClick={() => setSelectedDate(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="time-slots-container">
                <div className="slots-grid">
                  {timeSlots.map(slot => (
                    <button 
                      key={slot}
                      className={`time-slot ${selectedSlots.includes(slot) ? 'selected' : ''}`}
                      onClick={() => handleSlotToggle(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                  <div className="time-slot placeholder">+</div>
                </div>
                
                <div className="booking-actions">
                  <p className="min-hours-note">
                    {selectedSlots.length < 2 ? "Please select adjacent timeslots (minimum 2 hours)" : `${selectedSlots.length} continuous hours selected`}
                  </p>
                  <button 
                    className="continue-btn" 
                    disabled={!selectedDate || selectedSlots.length < 2}
                    onClick={handleNextStep}
                  >
                    Continue to Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
             <div className="details-form-container">
               <h3>Your Details</h3>
               <div className="summary-box">
                 <p><strong>Date:</strong> April {selectedDate}, 2026</p>
                 <p><strong>Time:</strong> {selectedSlots[0]} - {selectedSlots[selectedSlots.length - 1]} ({selectedSlots.length} hours)</p>
                 <p><strong>Total:</strong> ${calculateTotal()} (incl. $20 cleaning fee)</p>
               </div>
               <div className="form-group">
                 <input type="text" placeholder="Full Name" value={userDetails.name} onChange={e => setUserDetails({...userDetails, name: e.target.value})} />
                 <input type="tel" placeholder="Phone Number" value={userDetails.phone} onChange={e => setUserDetails({...userDetails, phone: e.target.value})} />
                 <input type="email" placeholder="Email Address" value={userDetails.email} onChange={e => setUserDetails({...userDetails, email: e.target.value})} />
               </div>
               <div className="step-actions">
                 <button className="back-btn" onClick={() => setStep(1)}>Back</button>
                 <button className="continue-btn" disabled={!userDetails.name || !userDetails.phone} onClick={handleNextStep}>Proceed to Payment</button>
               </div>
             </div>
           )}
 
           {step === 3 && (
             <div className="payment-container">
               <h3>Secure your slot</h3>
               <p>Please make a payment of <strong>${calculateTotal()}</strong> via PayNow to confirm your booking.</p>
               
               <div className="qr-box">
                 <img src={qrCodeImg} alt="PayNow QR Code" />
               </div>
 
               <div className="confirmation-instructions">
                 <p>1. Scan the QR code and complete the transfer.</p>
                 <p>2. Take a screenshot of your successful transaction.</p>
                 <p>3. Click the button below to send us your details via WhatsApp!</p>
               </div>
 
               <div className="step-actions">
                 <button className="back-btn" onClick={() => setStep(2)}>Back</button>
                 <a href={generateWhatsAppLink()} target="_blank" rel="noreferrer" className="whatsapp-btn">
                   Send Booking via WhatsApp
                 </a>
               </div>
             </div>
           )}

        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;