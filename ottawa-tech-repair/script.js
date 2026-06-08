const services = [
  { icon: '💻', title: 'Laptop Screen Repair', desc: 'Cracked or damaged screen replacement.', price: '$149' },
  { icon: '🦠', title: 'Virus Removal', desc: 'Remove malware, spyware, and unwanted popups.', price: '$89' },
  { icon: '💾', title: 'Data Recovery', desc: 'Recover lost or deleted files.', price: '$120' },
  { icon: '🛠️', title: 'Hardware Upgrade', desc: 'Upgrade RAM, storage, and performance.', price: '$75' }
];

let currentPage = 'home';
let booking = {
  service: 'Laptop Screen Repair',
  date: '2025-06-20',
  time: '14:00',
  name: 'Sarah Patel',
  email: 'sarah.patel@email.com',
  phone: '(613) 555-9876'
};

const pageContent = document.getElementById('page-content');

function setPage(page) {
  currentPage = page;
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function homePage() {
  return `
    <section class="hero">
      <div class="hero-copy">
        <h1>Fast. Reliable.<br>Computer Repairs.</h1>
        <p>We fix laptops, desktops, and gaming PCs. Get back to what matters most.</p>
        <div class="hero-actions">
          <button class="primary" data-page="booking">Book Appointment</button>
          <button class="secondary" data-page="services">View Services</button>
        </div>
      </div>
    </section>
    <section class="features">
      <article><span class="feature-icon">✔</span><div><h3>Experienced</h3><p>Certified with 10+ years pf experience</p></div></article>
      <article><span class="feature-icon">🕒</span><div><h3>Quick and Reliable</h3><p>We fix it right the first time</p></div></article>
      <article><span class="feature-icon">💲</span><div><h3>Affordable Prices</h3><p>No hidden fees</p></div></article>
      <article><span class="feature-icon">📌</span><div><h3>Local</h3><p>Proudly serving Ottawa</p></div></article>
    </section>`;
}

function bookingPage() {
  return `
    <section class="center-page">
      <div class="icon-top">📅</div>
      <h1 class="page-title">Book an Appointment</h1>
      <p class="page-subtitle">Fill out the form below to schedule your repair.</p>
      <form class="booking-form" id="bookingForm">
        <label>Service
          <select name="service">${services.map(s => `<option ${booking.service === s.title ? 'selected' : ''}>${s.title}</option>`).join('')}</select>
        </label>
        <label>Date<input name="date" type="date" value="${booking.date}"></label>
        <label>Time
          <select name="time">
            <option value="14:00" ${booking.time === '14:00' ? 'selected' : ''}>2:00 PM</option>
            <option value="10:00" ${booking.time === '10:00' ? 'selected' : ''}>10:00 AM</option>
            <option value="16:00" ${booking.time === '16:00' ? 'selected' : ''}>4:00 PM</option>
          </select>
        </label>
        <label>Your Name<input name="name" value="${booking.name}"></label>
        <label>Email<input name="email" type="email" value="${booking.email}"></label>
        <label>Phone<input name="phone" value="${booking.phone}"></label>
        <button class="confirm" type="submit">Confirm Booking</button>
      </form>
    </section>`;
}

function confirmationPage() {
  const date = new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const time = booking.time === '10:00' ? '10:00 AM' : booking.time === '16:00' ? '4:00 PM' : '2:00 PM';
  const firstName = booking.name.trim().split(' ')[0] || 'Sarah';
  return `
    <section class="center-page confirm-page">
      <div class="check-circle">✓</div>
      <h1 class="page-title">Appointment Confirmed!</h1>
      <p class="page-subtitle">Thank you, ${firstName}! Your appointment has been successfully booked.</p>
      <section class="summary-card">
        <div><span>🔧</span><b>Service:</b><span>${booking.service}</span></div>
        <div><span>📅</span><b>Date:</b><span>${date}</span></div>
        <div><span>🕒</span><b>Time:</b><span>${time}</span></div>
        <div><span>🏷️</span><b>Reference #:</b><span>TR-1023</span></div>
      </section>
      <button class="primary back" data-page="home">Back to Home</button>
    </section>`;
}

function servicesPage() {
  return `
    <section class="services-page">
      <h1>Our Services & Pricing</h1>
      <p>Clear repair services and simple pricing, designed with the same modern blue theme as the first storyboard.</p>
      <section class="service-grid">
        ${services.map(s => `
          <article class="service-card">
            <div class="service-icon">${s.icon}</div>
            <h3>${s.title}</h3>
            <p>${s.desc}</p>
            <strong>${s.price}</strong>
            <button data-book-service="${s.title}">Book This</button>
          </article>`).join('')}
      </section>
    </section>`;
}

function aboutPage() {
  return `
    <section class="info-page">
      <h1>About Ottawa Tech Repair</h1>
      <p>Ottawa Tech Repair is a local computer repair service focused on fast turnaround, clear pricing, and friendly support for students, families, and small businesses.</p>
      <p>The design is based on the first storyboard: dark blue navigation, a strong repair-focused hero section, large buttons, and a simple appointment flow.</p>
    </section>`;
}

function contactPage() {
  return `
    <section class="contact-page">
      <section>
        <h1>Contact Us</h1>
        <p><strong>We're here to help!</strong></p>
        <p>📍 123 Bank Street<br>Ottawa, ON K1P 5N6</p>
        <p>📞 (613) 555-1234</p>
        <p>✉️ info@ottawatechrepair.ca</p>
        <p>🕒 Mon - Fri: 9:00 AM - 6:00 PM<br>Sat: 10:00 AM - 2:00 PM<br>Sun: Closed</p>
        <button class="primary">Call Us Now</button>
      </section>
      <div class="map">📍</div>
    </section>`;
}

function render() {
  const pages = {
    home: homePage,
    booking: bookingPage,
    confirmation: confirmationPage,
    services: servicesPage,
    about: aboutPage,
    contact: contactPage
  };
  pageContent.innerHTML = pages[currentPage]();

  document.querySelectorAll('[data-page]').forEach(button => {
    button.addEventListener('click', () => setPage(button.dataset.page));
  });

  document.querySelectorAll('[data-book-service]').forEach(button => {
    button.addEventListener('click', () => {
      booking.service = button.dataset.bookService;
      setPage('booking');
    });
  });

  const form = document.getElementById('bookingForm');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(form);
      booking = Object.fromEntries(formData.entries());
      setPage('confirmation');
    });
  }
}

render();
