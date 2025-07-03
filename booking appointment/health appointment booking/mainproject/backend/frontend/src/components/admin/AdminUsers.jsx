import React, { useEffect, useState } from 'react';
import {
  Table,
  Alert,
  Container,
  Card,
  Badge,
  Form,
  Row,
  Col,
  Pagination,
  Spinner,
} from 'react-bootstrap';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [loading, setLoading] = useState(true);

  const getUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8001/api/admin/getallusers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
        setFilteredUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = users.filter(user =>
      user.fullName.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => setCurrentPage(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  return (
    <Container className="my-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h4 className='text-center mb-4'>All Users</h4>

          {/* Search */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </Col>
          </Row>

          {/* Table or Spinner */}
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p>Loading users...</p>
            </div>
          ) : currentUsers.length > 0 ? (
            <>
              <Table striped bordered hover responsive>
                <thead className="table-dark text-center">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Is Admin</th>
                    <th>Is Doctor</th>
                  </tr>
                </thead>
                <tbody className="text-center align-middle">
                  {currentUsers.map(user => (
                    <tr key={user._id}>
                      <td className="text-capitalize">{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        {user.type === 'admin' ? (
                          <Badge bg="success">Yes</Badge>
                        ) : (
                          <Badge bg="secondary">No</Badge>
                        )}
                      </td>
                      <td>
                        {user.isdoctor ? (
                          <Badge bg="info">Yes</Badge>
                        ) : (
                          <Badge bg="dark">No</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              <div className="d-flex justify-content-center mt-3">
                <Pagination>{paginationItems}</Pagination>
              </div>
            </>
          ) : (
            <Alert variant="info" className="text-center">
              <Alert.Heading>No Users to show</Alert.Heading>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminUsers;
