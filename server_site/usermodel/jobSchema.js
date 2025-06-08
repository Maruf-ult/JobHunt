import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    position: { type: String, required: true },
    jobType: { type: String, required: true },
    experience: { type: String, required: true },
    skills: { type: [String], required: true },
    deadline: { type: Date, required: true },
    email: { type: String, required: true },
    facilities: { type: [String], required: false },
    salary: { type: Number, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // References User model
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);

export default Job;
