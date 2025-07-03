import React, { useState } from 'react';
import {
  Col,
  Form,
  Input,
  Row,
  TimePicker,
  message,
} from 'antd';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

const ApplyDoctor = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const { timings } = values;

     
      if (!timings || timings.length !== 2 || !timings[0] || !timings[1]) {
        message.error("Please select valid available timings");
        setLoading(false);
        return;
      }

      // Format timings as HH:mm
      const formattedTimings = [
        timings[0].format("HH:mm"),
        timings[1].format("HH:mm"),
      ];

      const doctorData = {
        ...values,
        timings: formattedTimings,
      };
       console.log(doctorData.timings);
      const userPayload = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
        type: 'user',
      };

      const res1 = await axios.post('http://localhost:8001/api/user/register', userPayload);
      const userId = res1.data?.user?._id;

      if (!userId) {
        message.error("User registration failed");
        setLoading(false);
        return;
      }

      const finalDoctorPayload = {
        userId,
        doctor: doctorData,
      };

      const res2 = await axios.post('http://localhost:8001/api/user/registerdoc', finalDoctorPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (res2.data.success) {
        message.success(res2.data.message);
        form.resetFields();
      } else {
        message.error(res2.data.message || 'Doctor registration failed');
      }
    } catch (error) {
      console.error(error);
      message.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2 className="text-center p-3 text-primary fw-bold">Apply as Doctor</h2>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        className="m-3 bg-light p-4 rounded shadow-sm"
      >
        <h4 className="text-secondary mb-3">Personal Details:</h4>
        <Row gutter={16}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Full Name" name="fullName" rules={[{ required: true }]}>
              <Input placeholder="Enter your full name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
              <Input type="tel" placeholder="Enter phone number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="Enter your email" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Password" name="password" rules={[{ required: true }]}>
              <Input.Password placeholder="Create a password" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Address" name="address" rules={[{ required: true }]}>
              <Input placeholder="Your address" />
            </Form.Item>
          </Col>
        </Row>

        <h4 className="text-secondary mt-4 mb-3">Professional Details:</h4>
        <Row gutter={16}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Specialization" name="specialization" rules={[{ required: true }]}>
              <Input placeholder="e.g. Cardiologist" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Experience (in years)" name="experience" rules={[{ required: true }]}>
              <Input type="number" min={0} placeholder="Years of experience" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Consultation Fees (₹)" name="fees" rules={[{ required: true }]}>
              <Input type="number" min={0} placeholder="Enter your fee" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Available Timings" name="timings" rules={[{ required: true }]}>
              <TimePicker.RangePicker format="HH:mm" />
            </Form.Item>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary px-4 py-2"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </Form>
    </Container>
  );
};

export default ApplyDoctor;
