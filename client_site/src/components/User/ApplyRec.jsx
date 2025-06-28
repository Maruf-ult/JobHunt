import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../../Redux/AlertSlice.jsx";
import Layout from "../common/Layout.jsx";
import RecruiterForm from "./RecruiterForm.jsx";


function ApplyRec() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
   const url = import.meta.env.VITE_BACKEND_URL

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
    const { name } = e.target; 
    const file = e.target.files[0]; 

    if (!file) {
      toast.error(`${name} is required.`);
      return;
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: file, 
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
        `${url}/api/apply-doc`,
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
           <h2
  className="font-bold text-black pl-10"
  style={{
    position: "fixed",
    top: "12px", 
    left: "180px", 
    zIndex: 9999,
    backgroundColor: "white", 
    padding: "0 6px",
  }}
>
        Recruiter Registration
      </h2>
      <RecruiterForm
        formValues={formValues}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
      />
    </Layout>
  );
}

export default ApplyRec;
