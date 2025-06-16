import appointmentModel from "../usermodel/appointmentSchema.js";
import Job from "../usermodel/jobSchema.js";
import recruiterModel from "../usermodel/recruiterSchema.js";
import userSchema from "../usermodel/userSchema.js";
export const recruiterInfo = async (req, res) => {
  try {
    const recruiter = await recruiterModel.findOne({ userId: req.body.userId });
    res.status(200).json({
      success: true,
      data: recruiter,
      msg: "Recruiter info fetched successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error getting recruiter info ", success: false, error });
  }
};

export const updateRecruiterInfo = async (req, res) => {
  try {
    // Whitelist fields to avoid unwanted updates
    const updateFields = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      profile: req.body.profile,
      address: req.body.address,
      image: req.body.image,
      companyName: req.body.companyName,
      logo: req.body.logo,
      website: req.body.website,
      location: req.body.location,
      description: req.body.description,
    };

    // Update doctor info
    const recruiter = await recruiterModel.findOneAndUpdate(
      { userId: req.body.userId },
      updateFields,
      { new: true }
    );

    // Handle case if doctor not found
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        msg: "Recruiter not found",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Recruiter info updated successfully",
      data: recruiter,
    });
  } catch (error) {
    console.error("Update Recruiter Info Error:", error);
    return res.status(500).json({
      msg: "Error updating recriter info",
      success: false,
      error,
    });
  }
};

export const recruiterInformation = async (req, res) => {
  try {
    const recruiter = await recruiterModel.findOne({ _id: req.body.doctorId });
    console.log(`doctor: ${recruiter}`);
    if (!recruiter) {
      return res.status(404).json({ msg: "Recruiter not found", success: false });
    }
    res.status(200).json({
      success: true,
      data: recruiter,
      msg: "Recruiter info fetched successfully",
    });
  } catch (error) {
    console.error("Error getting recruiter info: ", error);
    return res
      .status(500)
      .json({ msg: "Error getting recruiter info", success: false, error });
  }
};

export const getAppointmentsByRecruiterId = async (req, res) => {
  try {
    // Fetch the doctor using userId
    const recruiter = await recruiterModel.findOne({ userId: req.body.userId });

    if (!recruiter) {
      return res.status(404).json({ msg: "Recruiter not found", success: false });
    }

    // Use the correct doctorId stored in appointments
    const appointments = await appointmentModel.find({
      doctorId: recruiter.userId.toString(),
    });

    console.log("Doctor ID Used:", recruiter.userId);
    console.log("Appointments Found:", appointments);

    if (!appointments || appointments.length === 0) {
      return res
        .status(404)
        .json({ msg: "No appointments found", success: false });
    }

    res.status(200).json({
      success: true,
      msg: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Error getting appointments info: ", error);
    res.status(500).json({
      msg: "Error retrieving appointments info",
      success: false,
      error: error.message || error,
    });
  }
};
export const chngAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    console.log(req.body);
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status }
    );

    if (!appointment) {
      console.log("appointment not found");
      return res.status(404).json({
        success: false,
        msg: "appointment not found",
      });
    }

    const user = await userSchema.findOne({ _id: appointment.userId });
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
      type: "appointment-status-changed",
      message: `Your appointment status has been ${status}`,
      onclickPath: "/appointments",
    });

    user.unseenNotifications = unseenNotifications; // Ensure notifications are set correctly

    await user.save();

    console.log("User updated successfully:", user);

    return res.status(200).json({
      success: true,
      msg: "Appointment status updated successfully",
    });
  } catch (error) {
    console.error("Error during changing  appointment status:", error);
    return res.status(500).json({
      msg: "Error changing  appointment status",
      success: false,
      error: error.message, // Include error message
    });
  }
};

export const createJobs = async (req, res) => {
  try {
    const {
      position,
      jobType,
      experience,
      skills,
      deadline,
      email,
      facilities,
      salary,
      description,
      userId, // Now coming from middleware
    } = req.body;

    // Ensure userId exists
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    // Create new job post
    const newJob = new Job({
      position,
      jobType,
      experience,
      skills,
      deadline,
      email,
      facilities,
      salary,
      description,
      createdBy: userId, // Use userId from middleware
    });

    // Save job in the database
    await newJob.save();

    res.status(201).json({
      success: true,
      msg: "Job posted successfully!",
      job: newJob,
    });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({
      success: false,
      msg: "Server error, please try again later.",
    });
  }
};
