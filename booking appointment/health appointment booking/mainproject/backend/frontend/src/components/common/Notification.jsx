import { Tabs, message, Card, Badge, Button } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const getUser = () => {
    const userdata = JSON.parse(localStorage.getItem('userData'));
    if (userdata) {
      setUser(userdata);
    }
  };

  const handleAllMarkRead = async () => {
    try {
      const res = await axios.post(
        'http://localhost:8001/api/user/getallnotification',
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.data.success) {
        const updatedUser = {
          ...user,
          notification: [],
          seennotification: [...user.seennotification, ...user.notification],
        };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setUser(updatedUser);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  };

  const handleDeleteAll = async () => {
    try {
      const res = await axios.post(
        'http://localhost:8001/api/user/deleteallnotification',
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.data.success) {
        const updatedUser = { ...user, seennotification: [] };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setUser(updatedUser);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="p-3">
      <h2 className="text-center mb-4">Notifications</h2>

      <Tabs defaultActiveKey="1" type="card">
        {/* Unread Notifications */}
        <Tabs.TabPane tab={<Badge count={user?.notification?.length || 0}>Unread</Badge>} key="1">
          <div className="d-flex justify-content-end mb-2">
            <Button type="link" onClick={handleAllMarkRead}>
              Mark all as read
            </Button>
          </div>
          {user?.notification?.length > 0 ? (
            user.notification.map((n, index) => (
              <Card
                key={index}
                hoverable
                style={{ marginBottom: '10px', cursor: 'pointer' }}
                onClick={() => navigate(n.onClickPath || '/')}
              >
                {n.message}
              </Card>
            ))
          ) : (
            <p>No unread notifications</p>
          )}
        </Tabs.TabPane>

        {/* Read Notifications */}
        <Tabs.TabPane tab={<Badge count={user?.seennotification?.length || 0}>Read</Badge>} key="2">
          <div className="d-flex justify-content-end mb-2">
            <Button type="link" danger onClick={handleDeleteAll}>
              Delete all
            </Button>
          </div>
          {user?.seennotification?.length > 0 ? (
            user.seennotification.map((n, index) => (
              <Card
                key={index}
                hoverable
                style={{ marginBottom: '10px', cursor: 'pointer', backgroundColor: '#f6f6f6' }}
                onClick={() => navigate(n.onClickPath || '/')}
              >
                {n.message}
              </Card>
            ))
          ) : (
            <p>No read notifications</p>
          )}
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Notification;
