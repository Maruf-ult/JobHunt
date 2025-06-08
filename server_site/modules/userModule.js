import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import appointmentModel from "../usermodel/appointmentSchema.js";
import Job from "../usermodel/jobSchema.js";
import recruiterModel from "../usermodel/recruiterSchema.js";
import userSchema from "../usermodel/userSchema.js";
import emailTemplates from "../Utils/emailTemplates.js";
import transporter from "../Utils/nodeMailer.js";

const { PASSWORD_RESET_TEMPLATE } = emailTemplates;

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.error("Invalid input:", { name, email, password });
      return res.status(400).json({ success: false, msg: "Missing details" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        msg: "Password must be at least 6 characters ",
      });
    }

    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userSchema({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "welcome to job portal",
      text: `welcome to job portal . your account has been created with email id:${email}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      msg: "Account created successfully",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Signup error:", error.stack);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userSchema.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ msg: "User not found. Please sign up.", success: false });
    }

    const isPassEql = await bcrypt.compare(password, user.password);
    if (!isPassEql) {
      return res
        .status(403)
        .json({ msg: "Incorrect email or password", success: false });
    }

    const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log(jwtToken);

    res.status(200).json({
      msg: "Logged in successfully",
      success: true,
      jwtToken,
      email,
      name: user.name,
    });
  } catch (error) {
    console.error("Login error:", error.stack);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, msg: "Email is required" });
  }

  try {
    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    await transporter.sendMail(mailOption);

    return res
      .status(200)
      .json({ success: true, msg: "OTP sent to your email" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, msg: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      msg: "Email, OTP, and new password are required",
    });
  }

  try {
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(401).json({ success: false, msg: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(410).json({ success: false, msg: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res
      .status(200)
      .json({ success: true, msg: "Password has been reset successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

export const userInfo = async (req, res) => {
  try {
    const user = await userSchema.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .json({ msg: "user does not exist", success: false });
    } else {
      res.status(200).json({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error getting user info ", success: false, error });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    console.log("Incoming Request Body:", req.body);
    console.log("Incoming Files:", req.files);

    // Ensure userId is valid
    if (!req.body.userId || !mongoose.Types.ObjectId.isValid(req.body.userId)) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid user ID format" });
    }

    const userId = new mongoose.Types.ObjectId(req.body.userId);

    // Extract updateable fields, parsing JSON strings if needed
    let updateFields = {};
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined && req.body[key] !== "") {
        try {
          updateFields[key] = JSON.parse(req.body[key]);
        } catch (error) {
          updateFields[key] = req.body[key];
        }
      }
    });

    // Handle file uploads
    if (req.files.image) updateFields.image = req.files.image[0].filename;
    if (req.files.resume) updateFields.resume = req.files.resume[0].filename;

    console.log("Filtered Update Fields:", updateFields);

    // Update the user
    const user = await userSchema.findOneAndUpdate(
      { _id: userId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    console.log("Updated User in Database:", user);

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    return res
      .status(200)
      .json({
        success: true,
        msg: "User info updated successfully",
        data: user,
      });
  } catch (error) {
    console.error("Update Error:", error);
    return res
      .status(500)
      .json({ msg: "Error updating User info", success: false, error });
  }
};
export const applyRec = async (req, res) => {
  try {
    // Extract files correctly
    const imagePath = req.files?.image ? req.files.image[0].path : null;
    const logoPath = req.files?.logo ? req.files.logo[0].path : null;

    // Validate that both images exist
    if (!imagePath || !logoPath) {
      return res
        .status(400)
        .json({ success: false, msg: "Both image and logo are required!" });
    }

    // Create new doctor record with images
    const newRecruiter = new recruiterModel({
      ...req.body,
      image: imagePath,
      logo: logoPath,
      status: "pending",
    });
    await newRecruiter.save();

    // Send notification to admin
    const adminUser = await userSchema.findOne({ isAdmin: true });
    if (!adminUser) {
      throw new Error("Admin user not found");
    }

    const unseenNotifications = adminUser.unseenNotifications || [];
    unseenNotifications.push({
      type: "new-recruiter-request",
      message: `${newRecruiter.firstName} ${newRecruiter.lastName} has applied for a recruiter account`,
      data: {
        doctorId: newRecruiter._id,
        name: `${newRecruiter.firstName} ${newRecruiter.lastName}`,
      },
      onclickPath: "/recruiters",
    });

    await userSchema.findByIdAndUpdate(
      adminUser._id,
      { unseenNotifications },
      { new: true }
    );

    return res
      .status(201)
      .json({ msg: "Recruiter account applied successfully", success: true });
  } catch (error) {
    console.error("Error during recruiter application:", error);
    return res
      .status(500)
      .json({ msg: `An internal error occurred: ${error.message}` });
  }
};

export const seenNotifications = async (req, res) => {
  try {
    const user = await userSchema.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    user.seenNotifications.push(...user.unseenNotifications);
    user.unseenNotifications = [];

    const updatedUser = await user.save();

    updatedUser.password = undefined;
    return res.status(200).json({
      success: true,
      msg: "All notifications marked as seen",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error during marking notifications as seen:", error);
    return res
      .status(500)
      .json({ msg: `An internal error occurred: ${error.message}` });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const user = await userSchema.findOne({ _id: req.body.userId });
    user.seenNotifications = [];
    user.unseenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    return res.status(200).json({
      success: true,
      msg: "All notification deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error during doctor application:", error);
    return res
      .status(500)
      .json({ msg: `An internal error occurred: ${error.message}` });
  }
};

export const getApproveRecruiters = async (req, res) => {
  try {
    const recs = await recruiterModel.find({ status: "approved" });
    if (!recs || recs.length === 0) {
      return res
        .status(404)
        .json({ msg: "No approved doctors found", success: false });
    } else {
      res.status(200).json({
        success: true,
        msg: "Approved doctors fetched successfully",
        data: recs,
      });
    }
  } catch (error) {
    console.error("Error getting approved doctors info: ", error);
    return res.status(500).json({
      msg: "Error getting approved doctors info",
      success: false,
      error: error.message || error,
    });
  }
};

export const makeAppointment = async (req, res) => {
  try {
    console.log("Appointment Request Body:", req.body);

    req.body.status = "pending";

    const needAppointment = new appointmentModel(req.body);
    await needAppointment.save();

    const user = await userSchema.findOne({ _id: req.body.doctorInfo.userId });
    user.unseenNotifications.push({
      type: "new appointment-request-from-applicant",
      message: `${req.body.userInfo.name} wants to book an appointment with you`,
      onclickPath: "/recruiter/appointments",
    });
    await user.save();

    res.status(200).json({
      success: true,
      msg: "Appointment booked successfully",
      data: needAppointment,
    });
  } catch (error) {
    console.error("Error getting appointment:", error);
    return res.status(500).json({
      msg: "Error getting appointment",
      success: false,
      error: error.message || error,
    });
  }
};

export const getAppointmentsByUserId = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    console.log(req.body.userId);
    if (!appointments || appointments.length === 0) {
      return res
        .status(404)
        .json({ msg: "No approved appointmentss found", success: false });
    } else {
      res.status(200).json({
        success: true,
        msg: "Appointmnets fetched successfully",
        data: appointments,
      });
    }
  } catch (error) {
    console.error("Error getting appointments info: ", error);
    return res.status(500).json({
      msg: "Error getting appointments info",
      success: false,
      error: error.message || error,
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find(); // Fetch all jobs from the database

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      msg: "Server error, please try again later.",
    });
  }
};

export const getJobById = async (req, res) => {
  console.log("Received request for job details");
  console.log(req.params.jobId);
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    return res.json(job); // Sends the full job object
  } catch (error) {
    res.status(500).json({ error: "Error fetching job details" });
  }
};

export const getRecById = async (req, res) => {
  try {
    const userId = req.params.createdBy;
    console.log("Fetching recruiter associated with user ID:", userId);

    // Find user by ID
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
      ``;
    }

    // Find doctor associated with this user
    const recruiter = await recruiterModel.findOne({ userId: userId }); // Assuming Doctor model has a userId field
    if (!recruiter) {
      return res
        .status(404)
        .json({ error: "Recruiter details not found for this user" });
    }

    res.json(recruiter);
  } catch (error) {
    console.error("Error fetching recruiter:", error);
    res.status(500).json({ error: "Server error" });
  }
};
