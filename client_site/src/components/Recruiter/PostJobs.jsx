import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../../Redux/AlertSlice.jsx";
import Layout from "../common/Layout.jsx";
import CreateJobForm from "./CreateJobForm.jsx";

function PostJobs() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL

  const [formValues, setFormValues] = useState({
    position: "",
    jobType: "",
    experience: "",
    skills: "",
    deadline: "",
    email: "",
    facilities: "",
    salary: "",
    description: "",
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(showLoading());

      const response = await axios.post(
        `${url}/api/post-job`,
        formValues,
        {
          headers: {
            "Content-Type": "application/json",
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
      toast.error("Error submitting job post. Please try again.");
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
        Post a New Job
      </h2>
      <CreateJobForm
        formValues={formValues}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </Layout>
  );
}

export default PostJobs;
