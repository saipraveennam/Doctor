import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";

import userSchema from "../schemas/userModel.js";
import docSchema from "../schemas/docModel.js";
import appointmentSchema from "../schemas/appointmentModel.js";

// Register Controller
export const registerController = async (req, res) => {
  try {
    const existsUser = await userSchema.findOne({ email: req.body.email });
    if (existsUser) {
      return res.status(200).send({ message: "User already exists", success: false });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newUser = new userSchema(req.body);
    await newUser.save();

    return res.status(201).json({
  success: true,
  message: "User registered successfully",
  user: newUser, 
});
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: `${error.message}` });
  }
};

// Login Controller
export const loginController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: "Invalid email or password", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: "1d" });
    user.password = undefined;

    return res.status(200).send({
      message: "Login successful",
      success: true,
      token,
      userData: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: `${error.message}` });
  }
};

// Auth Controller
export const authController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    } else {
      return res.status(200).send({ success: true, data: user });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Auth error", success: false, error });
  }
};


export const docController = async (req, res) => {
  try {
    const { doctor,userId } = req.body;
    console.log(doctor)
    let documentInfo = null;
    
        
    if (req.file) {
      documentInfo = {
        filename: req.file.filename,
        path: req.file.path,
      };
    }

    const newDoctor = new docSchema({
      userId:userId,
      ...doctor, 
      status: "pending",
      document: documentInfo, 
    });
   
    await newDoctor.save();

    const adminUser = await userSchema.findOne({ type: "admin" });
    adminUser.notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.fullName} has applied for doctor registration`,
      data: {
        userId: newDoctor._id,
        fullName: newDoctor.fullName,
        onClickPath: "/admin/doctors",
      },
    });

    await adminUser.save();

    return res.status(201).send({
      success: true,
      message: "Doctor registration request sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error while applying", success: false, error });
  }
};

// Notification Controllers
export const getallnotificationController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ _id: req.body.userId });
    user.seennotification.push(...user.notification);
    user.notification = [];
    await user.save();

    return res.status(200).send({
      success: true,
      message: "All notifications marked as read",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Unable to fetch", success: false, error });
  }
};

export const deleteallnotificationController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Notifications deleted",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Unable to delete", success: false, error });
  }
};

// Get Approved Doctors
export const getAllDoctorsControllers = async (req, res) => {
  try {
    const docUsers = await docSchema.find({ status: "approved" });
    return res.status(200).send({
      message: "Doctor users data list",
      success: true,
      data: docUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong", success: false, error });
  }
};

// Book Appointment
export const appointmentController = async (req, res) => {
  try {
    let { userInfo, doctorInfo } = req.body;
    userInfo = JSON.parse(userInfo);
    doctorInfo = JSON.parse(doctorInfo);
   
    let documentData = null;
    if (req.file) {
      documentData = {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
      };
    }

    const newAppointment = new appointmentSchema({
      userId: req.body.userId,
      doctorId: req.body.doctorId,
      userInfo,
      doctorInfo,
      date: req.body.date,
      document: documentData,
      status: "pending",
    });

    await newAppointment.save();

    const user = await userSchema.findOne({ _id: doctorInfo.userId });
    if (user) {
      user.notification.push({
        type: "New Appointment",
        message: `New appointment request from ${userInfo.fullName}`,
      });

      await user.save();
    }

    return res.status(200).send({
      message: "Appointment booked successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong", success: false, error });
  }
};

// User Appointment History
export const getAllUserAppointments = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).send({ message: "User ID is required.", success: false });
    }

    const allAppointments = await appointmentSchema.find({ userId });

    const doctorIds = allAppointments.map((appointment) => appointment.doctorId);
    const doctors = await docSchema.find({ _id: { $in: doctorIds } });

    const appointmentsWithDoctor = allAppointments.map((appointment) => {
      const doctor = doctors.find(
        (doc) => doc._id.toString() === appointment.doctorId.toString()
      );
      const docName = doctor ? doctor.fullName : "";
      return {
        ...appointment.toObject(),
        docName,
      };
    });

    return res.status(200).send({
      message: "All the appointments are listed below.",
      success: true,
      data: appointmentsWithDoctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong", success: false, error });
  }
};

// Get User's Uploaded Documents
export const getDocsController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ _id: req.body.userId });
    const allDocs = user.documents;

    if (!allDocs) {
      return res.status(201).send({
        message: "No documents found",
        success: true,
      });
    }

    return res.status(200).send({
      message: "User documents listed successfully",
      success: true,
      data: allDocs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong", success: false, error });
  }
};
