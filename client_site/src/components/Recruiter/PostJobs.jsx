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
        "http://localhost:4000/api/post-job",
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
      <h1 className="font-bold text-black pl-3 absolute top-3 mt-3">
        Post a New Job
      </h1>
      <CreateJobForm
        formValues={formValues}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </Layout>
  );
}

export default PostJobs;
