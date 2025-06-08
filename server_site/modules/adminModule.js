// import doctorSchema from "../usermodel/doctorSchema.js";
import mongoose from "mongoose";
import appointmentModel from "../usermodel/appointmentSchema.js";
import recruiterModel from "../usermodel/recruiterSchema.js";
import userSchema from "../usermodel/userSchema.js";

export const getUsers = async (req, res) => {
  try {
    const user = await userSchema.find({});
    if (!user) {
      return res
        .status(200)
        .json({ msg: "user does not exist", success: false });
    } else {
      res.status(200).json({
        success: true,
        msg: "User fetched successfully",
        data: user,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error getting user info ", success: false, error });
  }
};

export const getRecruiters = async (req, res) => {
  try {
    const rec = await recruiterModel.find({});
    if (!rec) {
      return res
        .status(200)
        .json({ msg: "Recruiters does not exist", success: false });
    } else {
      res.status(200).json({
        success: true,
        msg: "Recruiters fetched successfully",
        data: rec,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error getting user info ", success: false, error });
  }
};
export const chngRecUsers = async (req, res) => {
  try {
    const { doctorId, status } = req.body;

    console.log(
      `Received request to update doctor ${doctorId} with status ${status}`
    );

    const recruiter = await recruiterModel.findByIdAndUpdate(doctorId, { status });

    if (!recruiter) {
      console.log("Recruiter not found");
      return res.status(404).json({
        success: false,
        msg: "Recruiter not found",
      });
    }

    const user = await userSchema.findOne({ _id: recruiter.userId });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    console.log("User found:", user);

    const unseenNotifications = user.unseenNotifications || [];
    unseenNotifications.push({
      type: "new-recruiter-request-changed",
      message: `Your recruiter account has been ${status}`,
      onclickPath: "/notifications",
    });

    user.unseenNotifications = unseenNotifications; // Ensure notifications are set correctly
    user.isDoctor = status === "approved" ? true : false;
    await user.save();

    console.log("User updated successfully:", user);

    return res.status(200).json({
      success: true,
      msg: "Recruiter status updated successfully",
    });
  } catch (error) {
    console.error("Error during recruiter account update:", error);
    return res.status(500).json({
      msg: "Error applying recruiter account",
      success: false,
      error: error.message, // Include error message
    });
  }
};

export const RecInfo = async (req, res) => {
  try {
    const { doctorId } = req.body;
    console.log(doctorId);

    if (!doctorId) {
      return res
        .status(400)
        .json({ msg: "Doctor ID is required", success: false });
    }

    if (!mongoose.isValidObjectId(doctorId)) {
      return res
        .status(400)
        .json({ msg: "Invalid doctor ID format", success: false });
    }

    const recruiter = await recruiterModel.findById(doctorId);

    if (!recruiter) {
      return res.status(404).json({ msg: "Recruiter not found", success: false });
    }

    res.status(200).json({ success: true, data: recruiter });
  } catch (error) {
    console.error("Error fetching recruiter data:", error);
    res.status(500).json({ msg: "Internal server error", success: false });
  }
};

export const UserInformation = async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.id);
    console.log(user);

    if (!user) {
      return res.status(404).json({ msg: "User not found", success: false });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching doctor data:", error);
    res.status(500).json({ msg: "Internal server error", success: false });
  }
};

export const Appointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    if (!appointments) {
      return res
        .status(200)
        .json({ msg: "No appointments available", success: false });
    } else {
      res.status(200).json({
        success: true,
        msg: "appointment fetched successfully",
        data: appointments,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error getting appointment info ", success: false, error });
  }
};
