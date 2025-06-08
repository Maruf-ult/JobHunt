import express from "express";
import { userInfo,applyRec,seenNotifications,deleteNotifications, getAppointmentsByUserId, updateUserInfo, getJobById } from "../modules/userModule.js";
import { getRecById } from "../modules/userModule.js";
import { getUsers,getRecruiters,chngRecUsers, UserInformation, Appointments } from "../modules/adminModule.js";
import { chngAppointmentStatus,  getAppointmentsByRecruiterId, recruiterInfo } from "../modules/recruiterModule.js";
import { authMiddleware } from "../middlewares/middleware.js";
import { updateRecruiterInfo } from "../modules/recruiterModule.js";
import { getApproveRecruiters } from "../modules/userModule.js";
import { recruiterInformation } from "../modules/recruiterModule.js";
import { makeAppointment } from "../modules/userModule.js";
import { sendResetOtp,resetPassword,signup,login } from "../modules/userModule.js";
import upload from "../handleImage/moduleImg.js";
import { RecInfo } from "../modules/adminModule.js";
import { createJobs } from "../modules/recruiterModule.js";
import { getJobs } from "../modules/userModule.js";


const router = express.Router();


router.post("/register",signup);
router.post("/login",login);
router.post('/send-reset-otp',sendResetOtp);
router.post('/reset-password',resetPassword);
router.post("/get-userid",authMiddleware,userInfo);
router.post("/apply-doc",authMiddleware,upload,applyRec);
router.get("/get-all-users",authMiddleware,getUsers);
router.get("/get-all-docs",authMiddleware,getRecruiters);
router.post("/mark-all-notif-as-seen",authMiddleware,seenNotifications);
router.post("/delete-all-notif",authMiddleware,deleteNotifications);
router.post("/change-doc-status",authMiddleware,chngRecUsers);
router.post("/update-user-profile",upload,authMiddleware,updateUserInfo);
router.post("/get-doctor-info-by-user-id",authMiddleware,recruiterInfo);
router.post("/update-doctor-profile",authMiddleware,updateRecruiterInfo);
router.get("/get-all-approved-doctors",authMiddleware,getApproveRecruiters);
router.post("/get-doctor-info-by-id",authMiddleware,recruiterInformation);
router.post("/book-appointment",authMiddleware,makeAppointment);
router.get("/get-appointments-by-user-id",authMiddleware,getAppointmentsByUserId);
router.get("/get-appointments-by-doctor-id",authMiddleware,getAppointmentsByRecruiterId);
router.post("/change-appointment-status",authMiddleware,chngAppointmentStatus);
router.post("/get-doc",authMiddleware,RecInfo)
router.post("/get-user/:id",authMiddleware,UserInformation)
router.post("/post-job",authMiddleware,createJobs)
router.get("/get-jobs",authMiddleware,getJobs)
router.get("/get-jobs-forHome",getJobs)
router.get("/get-all-approved-doctors-forHome",getApproveRecruiters);
router.get("/jobs/:jobId",getJobById)
router.get("/doctors/:createdBy",getRecById)
router.get("/get-appointments",authMiddleware,Appointments)


export default router;