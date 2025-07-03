import express from "express";
import multer from "multer";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  updateDoctorProfileController,
  getAllDoctorAppointmentsController,
  handleStatusController,
  documentDownloadController,
} from "../controllers/doctorC.js";
import { loginController } from "../controllers/userC.js";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/login",loginController); 

router.post("/updateprofile", authMiddleware, updateDoctorProfileController);

router.get("/getdoctorappointments", authMiddleware, getAllDoctorAppointmentsController);

router.post("/handlestatus", authMiddleware, handleStatusController);

router.get("/getdocumentdownload", authMiddleware, documentDownloadController);

export default router;
