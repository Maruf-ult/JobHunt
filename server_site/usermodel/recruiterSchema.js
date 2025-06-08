import mongoose from "mongoose";

const recSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required:true,
    required: true,
  },
  profile: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  image:{
    type:String,
    required: [true, "Profile image is required!"]

  },
  companyName: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: [true, "Company logo is required!"]
  },
  website: {
    type: String,
    required: true,
  },
   location: {
    type: String,
    required: true,
  },
  description:{
       type:String,
       required:true
  },
  status: {
    type: String,
    default: "pending",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
}, { timestamps: true });

const recruiterModel = mongoose.model("recruiters", recSchema);
export default recruiterModel;
