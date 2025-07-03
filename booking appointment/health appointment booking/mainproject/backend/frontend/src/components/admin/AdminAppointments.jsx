import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  Table,
  Alert,
  Badge,
  Spinner,
  Form,
  Row,
  Col,
  Button,
  Pagination,
} from 'react-bootstrap';
import axios from 'axios';

const AdminAppointments = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;

  const getAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8001/api/admin/getallAppointmentsAdmin', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setAllAppointments(res.data.data);
        setFilteredAppointments(res.data.data);
        setCurrentPage(1); // Reset to first page on refresh
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = allAppointments.filter((appointment) =>
      appointment.doctorInfo.fullName.toLowerCase().includes(term) ||
      appointment.userInfo.fullName.toLowerCase().includes(term)
    );
    setFilteredAppointments(filtered);
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'pending':
        return <Badge bg="warning" text="dark">Pending</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * appointmentsPerPage;
  const indexOfFirst = indexOfLast - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <Container className="my-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-4">All Appointments</h2>

          {/* Search and Refresh */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search by doctor or user name..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </Col>
            <Col md={6} className="text-md-end mt-2 mt-md-0">
              <Button variant="primary" onClick={getAppointments}>
                🔄 Refresh
              </Button>
            </Col>
          </Row>

          {/* Table */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <div>Loading appointments...</div>
            </div>
          ) : currentAppointments.length > 0 ? (
            <>
              <Table striped bordered hover responsive className="mt-3">
                <thead className="table-dark text-center">
                  <tr>
                    <th>Appointment ID</th>
                    <th>User Name</th>
                    <th>Doctor Name</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="text-center align-middle">
                  {currentAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{appointment._id}</td>
                      <td className="text-capitalize">{appointment.userInfo.fullName}</td>
                      <td className="text-capitalize">{appointment.doctorInfo.fullName}</td>
                      <td>{new Date(appointment.date).toLocaleDateString()}</td>
                      <td>{getStatusBadge(appointment.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              <div className="d-flex justify-content-center">
                <Pagination>{paginationItems}</Pagination>
              </div>
            </>
          ) : (
            <Alert variant="info" className="mt-4 text-center">
              <Alert.Heading>No Appointments to show</Alert.Heading>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminAppointments;
