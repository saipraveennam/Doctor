import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import './Home.css';

const Home = () => {
  return (
    <>
      {/* Custom Navbar */}
      <header className="glass-navbar">
        <div className="navbar-container">
          <h2 className="logo">🩺 MediCareBook</h2>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/doctorRegistartion">Doctor Registration</Link>
            <Link to="/register">Register</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section with Background Image */}
      <section className="hero-background">
        <div className="hero-overlay">
          <div className="hero-content text-center text-white">
            <h1 className="mb-4">Book Doctors, Instantly.</h1>
            <p className="mb-4 fs-5">
              Your health, your schedule. Find the best doctors in seconds with MediCareBook.
            </p>
            <Link to="/login">
              <button className="hero-btn">Get Started</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <h2 className="text-center text-primary mb-5">What Makes Us Different?</h2>
          <Row className="g-4 justify-content-center">
            <Col md={4}>
              <div className="glass-card">
                <h4>Real-Time Availability</h4>
                <p>See when your doctor is available and book instantly without hassle.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="glass-card">
                <h4>Easy Access</h4>
                <p>Access your appointments, prescriptions and history anytime, anywhere.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="glass-card">
                <h4>Secure & Reliable</h4>
                <p>Your data is protected with industry-grade encryption and privacy controls.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} MediCareBook • All Rights Reserved</p>
      </footer>
    </>
  );
};

export default Home;
