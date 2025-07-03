import React, { useState } from 'react';
import { Container, Nav, Navbar, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import './Register.css'; // Custom styles
import p2 from '../../images/doc1.jpg'; // Background image

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    type: '',
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, phone, type } = user;

    if (!fullName || !email || !password || !phone || !type) {
      return message.warning('Please fill all fields and select a role.');
    }

    try {
      const res = await axios.post('http://localhost:8001/api/user/register', user);
      if (res.data.success) {
        message.success('Registered successfully!');
        navigate('/login');
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error('Something went wrong');
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar expand="lg" className="navbar-glass">
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-white fw-bold fs-4">🩺 MediCareBook</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto gap-2">
              <Link to="/" className="btn btn-outline-light">Home</Link>
              <Link to="/login" className="btn btn-outline-primary">Login</Link>
              <Link to="/register" className="btn btn-outline-success">Register</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Registration Section */}
      <div className="register-page">
        <div className="register-form-box shadow">
          <h3 className="text-center text-primary mb-4">Create Your Account</h3>
          <Form onSubmit={handleSubmit}>
            <div className="row">
              {/* Left Column */}
              <div className="col-md-6 pe-md-2">
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={user.fullName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={user.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>

              {/* Right Column */}
              <div className="col-md-6 ps-md-2">
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={user.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={user.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            {/* Role Selection & Submit */}
            <Form.Group className="mb-3">
              <Form.Label>Select Role</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="User"
                  name="type"
                  type="radio"
                  value="user"
                  checked={user.type === 'user'}
                  onChange={handleChange}
                  defaultChecked
                />
                </div>
            </Form.Group>

            <Button type="submit" variant="primary" size="lg" className="w-100 rounded-pill">
              Register
            </Button>
          </Form>

          <p className="mt-4 text-center text-black">
            Already have an account?{' '}
            <Link to="/login" className="text-warning fw-semibold">Login here</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
