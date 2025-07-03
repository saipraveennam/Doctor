import docSchema from "../schemas/docModel.js";
import userSchema from "../schemas/userModel.js";
import appointmentSchema from "../schemas/appointmentModel.js";

export const getAllUsersControllers = async (req, res) => {
  try {
    const users = await userSchema.find({});
    return res.status(200).send({
      message: "Users data list",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", success: false });
  }
};

export const getAllDoctorsControllers = async (req, res) => {
  try {
    const docUsers = await docSchema.find({});
    return res.status(200).send({
      message: "Doctor users data list",
      success: true,
      data: docUsers,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", success: false });
  }
};

export const getStatusApproveController = async (req, res) => {
  try {
    const { doctorId, status ,userId} = req.body;
    const doctor = await docSchema.findOneAndUpdate(
      { _id: doctorId },
      { status }
    );
    console.log(doctor);
    const user = await userSchema.findOne({ _id: userId });
   
    user.notification.push({
      type: "doctor-account-approved",
      message: `Your Doctor account has been ${status}`,
      onClickPath: "/notification",
    });

    user.isdoctor = status === "approved";
     console.log(user);
    await user.save();
    await doctor.save();

    return res.status(201).send({
      message: "Successfully updated approval status of the doctor!",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", success: false });
  }
};

export const getStatusRejectController = async (req, res) => {
  try {
    const { doctorId, status, userid } = req.body;
    const doctor = await docSchema.findOneAndUpdate(
      { _id: doctorId },
      { status }
    );

    const user = await userSchema.findOne({ _id: userid });
    user.notification.push({
      type: "doctor-account-rejected",
      message: `Your Doctor account has been ${status}`,
      onClickPath: "/notification",
    });

    await user.save();
    await doctor.save();

    return res.status(201).send({
      message: "Successfully updated rejection status of the doctor!",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", success: false });
  }
};

export const displayAllAppointmentController = async (req, res) => {
  try {
    const allAppointments = await appointmentSchema.find();
    return res.status(200).send({
      success: true,
      message: "Successfully fetched all appointments",
      data: allAppointments,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", success: false });
  }
};
