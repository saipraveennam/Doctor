import React, { useEffect, useState } from 'react';
import { Badge, Row } from 'antd';
import axios from 'axios';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicationIcon from '@mui/icons-material/Medication';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';

import UserAppointments from './UserAppointments';
import DoctorList from './DoctorList';
import Notification from '../common/Notification';

const UserHome = () => {
  const [doctors, setDoctors] = useState([]);
  const [userdata, setUserData] = useState({});
  const [activeMenuItem, setActiveMenuItem] = useState('');

  const getUser = () => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      setUserData(user);
    }
  };

  const getUserData = async () => {
    try {
      await axios.post('http://localhost:8001/api/user/getuserdata', {}, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getDoctorData = async () => {
    try {
      const res = await axios.get('http://localhost:8001/api/user/getalldoctorsu', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUser();
    getUserData();
    getDoctorData();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = '/';
  };

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  return (
    <>
      <div className="main">
        <div className="header d-flex justify-content-between align-items-center px-4 py-3 shadow-sm bg-light">
          <div className="d-flex align-items-center gap-3">
            <h2 className="m-0">MediCareBook</h2>
            <h5 className="m-0">
              {userdata.isdoctor && 'Dr. '}
              {userdata.fullName}
            </h5>

            <Button
              variant={activeMenuItem === 'userappointments' ? 'primary' : 'outline-primary'}
              onClick={() => handleMenuItemClick('userappointments')}
            >
              <CalendarMonthIcon className="me-1" />
              Appointments
            </Button>

            <Button
              variant={activeMenuItem === 'doctors' ? 'success' : 'outline-success'}
            >
              <MedicationIcon className="me-1" />
              <Link to="/doctors">Doctors</Link>Doctors
            </Button>

            <Button variant="outline-danger" onClick={logout}>
              <LogoutIcon className="me-1" />
              Logout
            </Button>
          </div>

          <div className="d-flex align-items-center gap-3">
            <Badge
              count={userdata?.notification?.length || 0}
              onClick={() => handleMenuItemClick('notification')}
              style={{ cursor: 'pointer' }}
            >
              <NotificationsIcon style={{ fontSize: 28 }} />
            </Badge>
          </div>
        </div>

        <div className="body p-4">
          {activeMenuItem === 'notification' && <Notification />}
          {activeMenuItem === 'doctors' && (
            <Container>
              <h3 className="text-center mb-4">Available Doctors</h3>
              <Row>
                {doctors.map((doctor, i) => (
                  <DoctorList
                    userDoctorId={doctor.userId}
                    doctor={doctor}
                    userdata={userdata}
                    key={i}
                  />
                ))}
              </Row>
            </Container>
          )}
          {activeMenuItem === 'userappointments' && <UserAppointments />}
          {!activeMenuItem && (
            <div className="text-center mt-5">
              <h4>Welcome, {userdata.fullName}</h4>
              <p>Select an option from above to continue.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserHome;
