import mongoose from "mongoose";

 const user = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [4, "Name must be at least 4 characters"],
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: [6, "At least 6 characters required"],
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    fullName: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    skills: {
      type: [String], 
      default: [],
    },
    image: {
      type: String,
      default: "",
    },
    resume: {
      type: String,
      default: "",
    },
    verifyotp: {
      type: String,
      default: "",
    },
    verifyotpExpireAt: {
      type: Number,
      default: 0,
    },
    isAccountverified: {
      type: Boolean,
      default: false,
    },
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpireAt: {
      type: Number,
      default: 0,
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    seenNotifications: {
      type: Array,
      default: [],
    },
    unseenNotifications: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);


const  userSchema = mongoose.model('users',user);
export default userSchema;