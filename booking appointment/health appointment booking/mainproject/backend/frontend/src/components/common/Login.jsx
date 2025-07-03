import React, { useState } from 'react';
import { Container, Nav, Navbar, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import './Login.css'; // Custom styles including background and layout

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      message.warning('Please fill in both fields');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:8001/api/user/login`, user);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userData', JSON.stringify(res.data.userData));
        message.success('Login successful');

        const { type } = res.data.userData;
        switch (type) {
          case "admin":
            navigate("/adminHome");
            break;
          case "user":
            navigate("/userhome");
            break;
          default:
            navigate("/login");
        }
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error('Something went wrong during login');
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar expand="lg" className="shadow-sm nav-gradient">
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-white fw-bold">MediCareBook</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto gap-3">
              <Nav.Link as={Link} to="/" className="text-white">Home</Nav.Link>
              <Nav.Link as={Link} to="/login" className="text-white">Login</Nav.Link>
              <Nav.Link as={Link} to="/register" className="text-white">Register</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Full Background with Form */}
      <div className="login-page">
        <div className="login-box shadow-lg">
          <h3 className="text-center mb-4 fw-bold text-primary">Login to Your Account</h3>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={user.email}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                name="password"
                value={user.password}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button type="submit" variant="primary" size="lg">
                Login
              </Button>
            </div>
          </Form>

          <p className="mt-4 text-center text-dark">
            Don’t have an account?{' '}
            <Link to="/register" style={{ color: '#007bff', fontWeight: '500' }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
