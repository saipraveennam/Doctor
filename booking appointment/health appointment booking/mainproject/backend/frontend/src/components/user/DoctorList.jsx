import React, { useState } from 'react';
import { Col, Row, Button, Card, Modal, Form, Container } from 'react-bootstrap';
import { message } from 'antd';
import axios  from 'axios';
const DoctorList = ({ doctors, userdata }) => {
  const [show, setShow] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [dateTime, setDateTime] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentDate = new Date().toISOString().slice(0, 16);

  const handleShow = (doctor) => {
    setSelectedDoctor(doctor);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedDoctor(null);
    setDateTime('');
    setDocumentFile(null);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!dateTime || !documentFile) {
      return message.warning("Please select a date and upload a document.");
    }

    try {
      setLoading(true);
      const formattedDateTime = dateTime.replace('T', ' ');
      const formData = new FormData();
      formData.append('image', documentFile);
      formData.append('date', formattedDateTime);
      formData.append('userId', userdata._id);
      formData.append('doctorId', selectedDoctor.userId);
      formData.append('userInfo', JSON.stringify(userdata));
      formData.append('doctorInfo', JSON.stringify(selectedDoctor));
     
      const res = await axios.post('http://localhost:8001/api/user/getappointment', formData, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    'Content-Type': 'multipart/form-data',
  },
}); console.log(res);
      

      if (res.data.success) {
        message.success(res.message);
        handleClose();
      } else {
        message.error(res.message || "Booking failed");
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="g-4">
        {doctors.map((doctor) => (
          <Col key={doctor._id} xs={12} md={6} lg={4}>
            <Card
              className="border-0 h-100 shadow-lg rounded-4"
              style={{ transition: 'transform 0.3s', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Card.Body className="text-center d-flex flex-column align-items-center">
                <div
                  className="rounded-circle bg-light mb-3"
                  style={{
                    width: '90px',
                    height: '90px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    color: '#007bff',
                    fontWeight: 'bold',
                  }}
                >
                  {doctor.fullName.charAt(0)}
                </div>
                <Card.Title className="fw-bold fs-4 text-primary">Dr. {doctor.fullName}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{doctor.specialization}</Card.Subtitle>
                <div className="text-start w-100 mt-3" style={{ fontSize: '0.95rem' }}>
                  <p className="mb-1"><strong>Experience:</strong> {doctor.experience} Years</p>
                  <p className="mb-1"><strong>Fees:</strong> ₹{doctor.fees}</p>
                  <p className="mb-1"><strong>Timings:</strong> {doctor.timings?.[0]} - {doctor.timings?.[1]}</p>
                </div>
                <Button
                  variant="outline-primary"
                  className="mt-auto rounded-pill px-4 fw-semibold"
                  onClick={() => handleShow(doctor)}
                >
                  Book Appointment
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Booking Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book Appointment</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleBook}>
          <Modal.Body>
            <p><strong>Dr. {selectedDoctor?.fullName}</strong></p>
            <p>Specialization: {selectedDoctor?.specialization}</p>
            <hr />
            <Form.Group className="mb-3">
              <Form.Label>Appointment Date and Time</Form.Label>
              <Form.Control
                type="datetime-local"
                min={currentDate}
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Upload Document</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setDocumentFile(e.target.files[0])}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Booking...' : 'Confirm'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default DoctorList;
