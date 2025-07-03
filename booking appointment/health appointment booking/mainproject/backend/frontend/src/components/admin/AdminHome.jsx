import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicationIcon from '@mui/icons-material/Medication';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge } from 'antd';

import Notification from '../common/Notification';
import AdminUsers from './AdminUsers';
import AdminDoctors from './AdminDoctors';
import AdminAppointments from './AdminAppointments';

const AdminHome = () => {
  const [userdata, setUserData] = useState({});
  const [activeMenuItem, setActiveMenuItem] = useState('adminappointments');

  const getUserData = async () => {
    try {
      await axios.post('http://localhost:8001/api/user/getuserdata', {}, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('token')
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = () => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) setUserData(user);
  };

  useEffect(() => {
    getUserData();
    getUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.location.href = "/";
  };

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  return (
    <div className="main" style={{ display: 'flex', height: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Sidebar */}
      <div
        className="sidebar"
        style={{
          width: '250px',
          background: 'linear-gradient(to bottom, #4A00E0, #8E2DE2)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
        }}
      >
        <h2 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#fff' }}>MediCareBook</h2>
        <div className="menu">
          {[
            { key: 'adminappointments', icon: <CalendarMonthIcon />, label: 'Appointments' },
            { key: 'adminusers', icon: <CalendarMonthIcon />, label: 'Users' },
            { key: 'admindoctors', icon: <MedicationIcon />, label: 'Doctors' },
          ].map(item => (
            <div
              key={item.key}
              className={`menu-item ${activeMenuItem === item.key ? 'active' : ''}`}
              onClick={() => handleMenuItemClick(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '10px',
                background: activeMenuItem === item.key ? '#ffffff33' : 'transparent',
                cursor: 'pointer',
                transition: '0.3s',
              }}
            >
              <div style={{ marginRight: '10px' }}>{item.icon}</div>
              <span style={{ fontSize: '16px' }}>{item.label}</span>
            </div>
          ))}
          <div
            className="menu-item"
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              borderRadius: '8px',
              background: '#ff4d4f',
              color: '#fff',
              marginTop: 'auto',
              cursor: 'pointer',
            }}
          >
            <LogoutIcon style={{ marginRight: '10px' }} /> <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content" style={{ flex: 1, background: '#f5f6fa', overflowY: 'auto' }}>
        {/* Header */}
        <div
          className="header d-flex justify-content-between align-items-center p-3 shadow-sm"
          style={{
            background: '#fff',
            borderBottom: '1px solid #ddd',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: '600' }}>
            Welcome, {userdata.fullName || 'Admin'}
          </div>
          <Badge
            count={userdata?.notification?.length || 0}
            onClick={() => handleMenuItemClick('notification')}
            style={{ cursor: 'pointer' }}
          >
            <NotificationsIcon style={{ fontSize: '28px', color: '#595959' }} />
          </Badge>
        </div>

        {/* Body */}
        <div className="p-4">
          {activeMenuItem === 'notification' && <Notification />}
          {activeMenuItem === 'adminusers' && <AdminUsers />}
          {activeMenuItem === 'admindoctors' && <AdminDoctors />}
          {activeMenuItem === 'adminappointments' && <AdminAppointments />}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
