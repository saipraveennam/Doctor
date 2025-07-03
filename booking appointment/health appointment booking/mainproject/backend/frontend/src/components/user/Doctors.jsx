import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Pagination,
  Card,
} from 'react-bootstrap';
import DoctorList from './DoctorList';
import axios from 'axios';
import { message } from 'antd';

const Doctors = ({ userdata }) => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 6;

  const getDoctorData = async () => {
    try {
      const res = await axios.get('http://localhost:8001/api/user/getalldoctorsu', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
        setFilteredDoctors(res.data.data);
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch doctors');
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  useEffect(() => {
    const results = doctors.filter(doc =>
      doc.specialization.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredDoctors(results);
    setCurrentPage(1);
  }, [search, doctors]);

  const indexOfLast = currentPage * doctorsPerPage;
  const indexOfFirst = indexOfLast - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)', minHeight: '100vh' }}>
      <Container className="py-5">
        <Card
          className="text-center shadow-lg border-0 mb-4"
          style={{
            background: 'linear-gradient(to right, #ffffff, #f0f8ff)',
            borderRadius: '1.25rem',
          }}
        >
          <Card.Body>
            <h2 className="fw-bold text-primary display-6 mb-3">Find Your Doctor</h2>
            <p className="text-muted mb-4 fs-5">
              Search doctors by specialization and book appointments instantly.
            </p>
            <Form className="w-100 w-md-75 mx-auto">
              <Form.Control
                type="text"
                placeholder="🔍 Search by specialization..."
                className="rounded-pill shadow-sm text-center py-2 fs-5"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form>
          </Card.Body>
        </Card>

        {currentDoctors.length > 0 ? (
          <DoctorList doctors={currentDoctors} userdata={userdata} />
        ) : (
          <div className="text-center py-5 text-muted fs-5">😔 No doctors found</div>
        )}

        {totalPages > 1 && (
          <Pagination className="justify-content-center mt-4">
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => paginate(i + 1)}
                className="rounded shadow-sm"
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        )}
      </Container>
    </div>
  );
};

export default Doctors;
