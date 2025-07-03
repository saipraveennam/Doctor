import React, { useEffect, useState } from 'react';
import {
  Button,
  Table,
  Alert,
  Container,
  Card,
  Badge,
  Spinner,
  Form,
  Row,
  Col,
  Pagination,
} from 'react-bootstrap';
import axios from 'axios';
import { message } from 'antd';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;

  const getDoctors = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8001/api/admin/getalldoctors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
        setCurrentPage(1); // Reset page on fetch
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong while fetching doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (doctorId, status, userId) => {
   console.log(userId);
    try {
      const res = await axios.post('http://localhost:8001/api/admin/getapprove', { doctorId, status, userId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        message.success(res.data.message);
        getDoctors();
      }
    } catch (error) {
      console.log(error);
      message.error('Approval failed');
    }
  };

  const handleReject = async (doctorId, status, userid) => {
    try {
      const res = await axios.post('http://localhost:8001/api/admin/getreject', { doctorId, status, userid }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        message.success(res.data.message);
        getDoctors();
      }
    } catch (error) {
      console.log(error);
      message.error('Rejection failed');
    }
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

  const filteredDoctors = doctors.filter((doc) =>
    doc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLast = currentPage * doctorsPerPage;
  const indexOfFirst = indexOfLast - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

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

  useEffect(() => {
    getDoctors();
  }, []);

  return (
    <Container className="my-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-4">All Doctors</h2>

          {/* Search */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </Col>
          </Row>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <div>Loading doctors...</div>
            </div>
          ) : currentDoctors.length > 0 ? (
            <>
              <Table striped bordered hover responsive>
                <thead className="table-dark text-center">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="text-center align-middle">
                  {currentDoctors.map((user) => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td className="text-capitalize">{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{getStatusBadge(user.status)}</td>
                      <td>
                        {user.status === 'pending' ? (
                          <>
                            <Button
                              onClick={() => handleApprove(user._id, 'approved', user.userId)}
                              className='mx-1'
                              size='sm'
                              variant="outline-success"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleReject(user._id, 'rejected', user.userId)}
                              className='mx-1'
                              size='sm'
                              variant="outline-danger"
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Badge bg="info">No Actions</Badge>
                        )}
                      </td>
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
            <Alert variant="info" className="text-center">
              <Alert.Heading>No Doctors to show</Alert.Heading>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDoctors;
