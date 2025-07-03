import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getAllUsersControllers,
  getAllDoctorsControllers,
  getStatusApproveController,
  getStatusRejectController,
  displayAllAppointmentController,
} from "../controllers/adminC.js";

const router = express.Router();

router.get("/getallusers", authMiddleware, getAllUsersControllers);
router.get("/getalldoctors", authMiddleware, getAllDoctorsControllers);
router.post("/getapprove", authMiddleware, getStatusApproveController);
router.post("/getreject", authMiddleware, getStatusRejectController);
router.get("/getallAppointmentsAdmin", authMiddleware, displayAllAppointmentController);

export default router;
