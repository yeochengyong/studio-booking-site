import React, { useState, useEffect, Fragment } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';
import './Booking.css';
import ratesBg from '../assets/rates-bg.png';

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
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });
  
  // --- CALENDAR LOGIC ---
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedFullDate, setSelectedFullDate] = useState(null);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  
  const paddingDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    if (viewYear === today.getFullYear() && viewMonth === today.getMonth()) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, 1);
    const nextMonthDate = new Date(viewYear, viewMonth + 1, 1);
    if (nextMonthDate > maxDate) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const isPastDate = (day) => {
    if (viewYear < today.getFullYear()) return true;
    if (viewYear === today.getFullYear() && viewMonth < today.getMonth()) return true;
    if (viewYear === today.getFullYear() && viewMonth === today.getMonth() && day < today.getDate()) return true;
    return false;
  };

  // --- REAL-TIME DATABASE LISTENER ---
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    if (!selectedFullDate) {
      setBookedSlots([]);
      return;
    }

    setSelectedSlots([]); // Clear selections when date changes

    const q = query(
      collection(db, "booking_requests"), 
      where("date", "==", selectedFullDate)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let taken = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status !== 'denied') {
          taken = [...taken, ...(data.slots || [])];
        }
      });
      setBookedSlots(taken);
    });

    return () => unsubscribe();
  }, [selectedFullDate]);


  // --- TIME SLOT LOGIC ---
  const [showOvernight, setShowOvernight] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [hoveredSlot, setHoveredSlot] = useState(null); // NEW: Track hover state

  const defaultTimeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', 
    '21:00', '22:00', '23:00'
  ];

  const overnightSlots = [
    '00:00', '01:00', '02:00', '03:00', 
    '04:00', '05:00', '06:00', '07:00', '08:00'
  ];

  const activeTimeSlots = showOvernight 
    ? [...defaultTimeSlots, ...overnightSlots] 
    : defaultTimeSlots;

  const handleOvernightToggle = () => {
    setShowOvernight(!showOvernight);
    setSelectedSlots([]); 
  };

  const handleSlotToggle = (clickedSlot) => {
    if (selectedSlots.length === 0) {
      setSelectedSlots([clickedSlot]);
      return;
    }

    if (selectedSlots.length === 1 && selectedSlots[0] === clickedSlot) {
      setSelectedSlots([]);
      return;
    }

    if (selectedSlots.length > 1) {
      setSelectedSlots([clickedSlot]);
      return;
    }

    const startIndex = activeTimeSlots.indexOf(selectedSlots[0]);
    const endIndex = activeTimeSlots.indexOf(clickedSlot);
    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);
    const newRange = activeTimeSlots.slice(minIndex, maxIndex + 1);

    const hasConflict = newRange.some(slot => bookedSlots.includes(slot));
    if (hasConflict) {
      alert("You cannot select a range that includes already booked times. Please adjust your selection.");
      return;
    }

    setSelectedSlots(newRange);
  };

  const calculateTotal = () => {
    let total = 20; 
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

  const getFormattedDate = (dateStr) => {
    if (!dateStr) return "Select a date";
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitBookingRequest = async () => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "booking_requests"), {
        name: userDetails.name,
        email: userDetails.email,
        date: selectedFullDate,
        slots: selectedSlots,
        estimatedTotal: calculateTotal(),
        status: 'pending_review',
        createdAt: serverTimestamp()
      });
      setStep(3); 
    } catch (error) {
      console.error("Error submitting booking: ", error);
      alert("Something went wrong connecting to the database. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="studio-booking-page">
      <Header />

      <main className="booking-main-content">
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

        <section className="schedule-section">
          
          {step === 1 && (
            <>
              <div className="booking-instructions">
                <h3>How to Book</h3>
                <div className="instruction-steps">
                  <p><span>1</span> Click your Start Time, then click your End Time (min. 2 hours).</p>
                  <p><span>2</span> Fill in your contact details and review the estimated price.</p>
                  <p><span>3</span> Submit your request. We will contact you shortly to confirm your slot!</p>
                </div>
              </div>

              <div className="schedule-header">
                <h2>Schedule</h2>
                <p>date & time</p>
              </div>

              <div className="booking-grid">
                <div className="calendar-container">
                  <div className="calendar-header">
                    <button className="cal-nav" onClick={handlePrevMonth}>&lt;</button>
                    <span className="cal-month">{monthNames[viewMonth]} {viewYear}</span>
                    <button className="cal-nav" onClick={handleNextMonth}>&gt;</button>
                  </div>
                  <div className="calendar-days-grid">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="cal-day-name">{day}</div>
                    ))}
                    
                    {paddingDays.map(day => (
                      <div key={`empty-${day}`} className="cal-date empty"></div>
                    ))}
                    
                    {monthDays.map(day => {
                      const dateString = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const isPast = isPastDate(day);
                      return (
                        <button 
                          key={day} 
                          className={`cal-date ${selectedFullDate === dateString ? 'selected' : ''} ${isPast ? 'empty' : ''}`}
                          onClick={() => !isPast && setSelectedFullDate(dateString)}
                          disabled={isPast}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="time-slots-container">
                  <div className="slots-grid">
                    {activeTimeSlots.map((slot, index) => {
                      const isBooked = bookedSlots.includes(slot);
                      const isFirstOvernight = showOvernight && slot === '00:00';
                      
                      // Calculate the live hover range preview
                      let isHoverRange = false;
                      let isConflictRange = false;

                      if (selectedSlots.length === 1 && hoveredSlot) {
                        const startIndex = activeTimeSlots.indexOf(selectedSlots[0]);
                        const hoverIndex = activeTimeSlots.indexOf(hoveredSlot);
                        const min = Math.min(startIndex, hoverIndex);
                        const max = Math.max(startIndex, hoverIndex);
                        
                        if (index >= min && index <= max) {
                          const range = activeTimeSlots.slice(min, max + 1);
                          const hasConflict = range.some(s => bookedSlots.includes(s));
                          if (hasConflict) {
                            isConflictRange = true;
                          } else {
                            isHoverRange = true;
                          }
                        }
                      }

                      return (
                        <Fragment key={slot}>
                          {isFirstOvernight && (
                            <div className="overnight-divider">Overnight</div>
                          )}
                          <button 
                            className={`
                              time-slot 
                              ${selectedSlots.includes(slot) ? 'selected' : ''} 
                              ${isBooked ? 'booked' : ''} 
                              ${isHoverRange ? 'hover-range' : ''}
                              ${isConflictRange ? 'conflict-range' : ''}
                            `}
                            onClick={() => !isBooked && handleSlotToggle(slot)}
                            onMouseEnter={() => setHoveredSlot(slot)}
                            onMouseLeave={() => setHoveredSlot(null)}
                            disabled={isBooked}
                          >
                            {slot}
                          </button>
                        </Fragment>
                      );
                    })}
                    
                    <button 
                      className="time-slot toggle-overnight" 
                      onClick={handleOvernightToggle}
                    >
                      {showOvernight ? '- Hide Overnight' : '+ Add Overnight'}
                    </button>
                  </div>
                  
                  <div className="booking-actions">
                    <div className="live-selection-box">
                      <h4>Current Selection</h4>
                      <div className="selection-item">
                        <span className="label">Date:</span>
                        <span className="value">{getFormattedDate(selectedFullDate)}</span>
                      </div>
                      <div className="selection-item">
                        <span className="label">Time:</span>
                        <span className={`value ${selectedSlots.length < 2 ? 'incomplete' : ''}`}>
                          {selectedSlots.length >= 2 
                            ? `${selectedSlots[0]} - ${selectedSlots[selectedSlots.length - 1]} (${selectedSlots.length} hrs)`
                            : 'Select start & end times (min 2)'}
                        </span>
                      </div>
                    </div>

                    <button 
                      className="continue-btn" 
                      disabled={!selectedFullDate || selectedSlots.length < 2}
                      onClick={() => setStep(2)}
                    >
                      Continue to Details
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
             <div className="details-form-container">
               <h3>Review & Submit</h3>
               <div className="summary-box">
                 <p><strong>Date:</strong> {getFormattedDate(selectedFullDate)}</p>
                 <p><strong>Time:</strong> {selectedSlots[0]} - {selectedSlots[selectedSlots.length - 1]}</p>
                 <p><strong>Estimated Total:</strong> ${calculateTotal()} (incl. $20 cleaning fee)</p>
               </div>
               <div className="form-group">
                 <input type="text" placeholder="Full Name" value={userDetails.name} onChange={e => setUserDetails({...userDetails, name: e.target.value})} />
                 <input type="email" placeholder="Email Address" value={userDetails.email} onChange={e => setUserDetails({...userDetails, email: e.target.value})} />
               </div>
               <div className="step-actions">
                 <button className="back-btn" onClick={() => setStep(1)}>Back</button>
                 <button 
                    className="continue-btn" 
                    disabled={!userDetails.name || !userDetails.email || isSubmitting} 
                    onClick={submitBookingRequest}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                  </button>
               </div>
             </div>
           )}

           {step === 3 && (
             <div className="success-container">
               <div className="success-icon">✓</div>
               <h3>Request Sent!</h3>
               <p>Thank you, {userDetails.name}. We have received your booking request for <strong>{getFormattedDate(selectedFullDate)}</strong>.</p>
               <button className="back-home-btn" onClick={() => window.location.href = '/'}>Return Home</button>
             </div>
           )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;