import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Container, Button, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { message } from 'antd';

const ITEMS_PER_PAGE = 5;

const UserAppointments = () => {
  const [userid, setUserId] = useState();
  const [type, setType] = useState(false);
  const [userAppointments, setUserAppointments] = useState([]);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const getUser = () => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      const { _id, isdoctor } = user;
      setUserId(_id);
      setType(isdoctor);
    } else {
      alert('No user to show');
    }
  };

  const getUserAppointment = async () => {
    try {
      const res = await axios.get('http://localhost:8001/api/user/getuserappointments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { userId: userid },
      });
      if (res.data.success) {
        setUserAppointments(res.data.data);
      }
    } catch (error) {
      console.error(error);
      message.error('Something went wrong');
    }
  };

  const getDoctorAppointment = async () => {
    try {
      const res = await axios.get('http://localhost:8001/api/doctor/getdoctorappointments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { userId: userid },
      });
      if (res.data.success) {
        setDoctorAppointments(res.data.data);
      }
    } catch (error) {
      console.error(error);
      message.error('Something went wrong');
    }
  };

  const handleStatus = async (userid, appointmentId, status) => {
    try {
      const res = await axios.post('http://localhost:8001/api/doctor/handlestatus', {
        userid, appointmentId, status,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        message.success(res.data.message);
        getDoctorAppointment();
      }
    } catch (error) {
      console.error(error);
      message.error('Something went wrong');
    }
  };

  const handleDownload = async (url, appointId) => {
    try {
      const res = await axios.get('http://localhost:8001/api/doctor/getdocumentdownload', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { appointId },
        responseType: 'blob',
      });
      if (res.data) {
        const fileUrl = window.URL.createObjectURL(new Blob([res.data]));
        const downloadLink = document.createElement("a");
        downloadLink.href = fileUrl;
        downloadLink.download = url.split("/").pop();
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    } catch (error) {
      console.error(error);
      message.error('Something went wrong');
    }
  };

  const paginate = (items) => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (userid) {
      type ? getDoctorAppointment() : getUserAppointment();
    }
  }, [userid, type]);

  const renderPagination = (totalItems) => {
    const pages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    return (
      <Pagination className='justify-content-center mt-3'>
        {[...Array(pages).keys()].map((num) => (
          <Pagination.Item
            key={num}
            active={num + 1 === currentPage}
            onClick={() => setCurrentPage(num + 1)}
          >
            {num + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    );
  };

  return (
    <div>
      <h2 className='p-3 text-center'>All Appointments</h2>
      <Container>
        {type ? (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Phone</th>
                  <th>Document</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {doctorAppointments.length > 0 ? (
                  paginate(doctorAppointments).map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{appointment.userInfo.fullName}</td>
                      <td>{appointment.date}</td>
                      <td>{appointment.userInfo.phone}</td>
                      <td>
                        <Button
                          variant='link'
                          onClick={() => handleDownload(appointment.document.path, appointment._id)}
                        >
                          {appointment.document.filename}
                        </Button>
                      </td>
                      <td>{appointment.status}</td>
                      <td>
                        {appointment.status !== 'approved' && (
                          <Button
                            onClick={() =>
                              handleStatus(appointment.userInfo._id, appointment._id, 'approved')
                            }
                          >
                            Approve
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <Alert variant='info'>No Appointments to show</Alert>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            {renderPagination(doctorAppointments.length)}
          </>
        ) : (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Doctor Name</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userAppointments.length > 0 ? (
                  paginate(userAppointments).map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{appointment.doctorInfo.fullName}</td>
                      <td>{appointment.date}</td>
                      <td>{appointment.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>
                      <Alert variant='info'>No Appointments to show</Alert>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            {renderPagination(userAppointments.length)}
          </>
        )}
      </Container>
    </div>
  );
};

export default UserAppointments;
