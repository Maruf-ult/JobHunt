import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../../Redux/AlertSlice.jsx";
import Layout from "../common/Layout.jsx";
import DoctorForm from "./RecruiterForm.jsx";

function ApplyRec() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    profile: "",
    address: "",
    image: null,
    companyName: "",
    logo: null,
    website: "",
    location: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target; // Get the field name (image or logo)
    const file = e.target.files[0]; // Select first file only

    if (!file) {
      toast.error(`${name} is required.`);
      return;
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: file, // Dynamically set image or logo based on input name
    }));

    console.log(`Selected ${name}:`, file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValues.image || !formValues.logo) {
      toast.error("Both image and logo are required!");
      return;
    }

    try {
      dispatch(showLoading());

      const formData = new FormData();
      formData.append("image", formValues.image);
      formData.append("logo", formValues.logo);
      formData.append("firstName", formValues.firstName);
      formData.append("lastName", formValues.lastName);
      formData.append("phoneNumber", formValues.phoneNumber);
      formData.append("profile", formValues.profile);
      formData.append("address", formValues.address);
      formData.append("companyName", formValues.companyName);
      formData.append("website", formValues.website);
      formData.append("location", formValues.location);
      formData.append("description", formValues.description);
      formData.append("userId", user._id);

      const response = await axios.post(
        "http://localhost:4000/api/apply-doc",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());

      if (response.data.success) {
        toast.success(response.data.msg);
        navigate("/home");
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Error submitting form. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <Layout>
      <h1 className="font-bold text-black pl-3 absolute top-3 mt-3">
        Recruiter Registration
      </h1>
      <DoctorForm
        formValues={formValues}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
      />
    </Layout>
  );
}

export default ApplyRec;
