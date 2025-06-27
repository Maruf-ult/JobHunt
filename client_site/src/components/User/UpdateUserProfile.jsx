import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../../Redux/AlertSlice.jsx";
import Layout from "../common/Layout.jsx";
import UserProfileForm from "./UserForm.jsx";

function UpdateUserProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
    image: null,
    resume: null,
  });

  const [loading, setLoading] = useState(true);

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

  const getUserData = useCallback(async () => {
    if (!user || !user._id) return;
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${url}/api/get-userid`,
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());

      if (response.data.success && response.data.data) {
        setFormValues(response.data.data);
      } else {
        setFormValues({});
      }

      setLoading(false);
    } catch (error) {
      toast.error("Error fetching data. Please try again later.");
      dispatch(hideLoading());
      setLoading(false);
      console.error("Error: ", error);
    }
  }, [dispatch, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());

      // Convert formValues into valid FormData
      const formData = new FormData();
      Object.keys(formValues).forEach((key) => {
        if (formValues[key] !== undefined && formValues[key] !== "") {
          if (
            typeof formValues[key] === "object" &&
            !(formValues[key] instanceof File)
          ) {
            formData.append(key, JSON.stringify(formValues[key])); // Convert objects & arrays to JSON
          } else {
            formData.append(key, formValues[key]);
          }
        }
      });
      formData.append("userId", user._id);

      console.log("Sending Data:", Object.fromEntries(formData.entries())); // Debugging log

      const response = await axios.post(
        `${url}/api/update-user-profile`,
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
        setFormValues(response.data.data);
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Error updating profile. Please try again later.");
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      getUserData();
    }
  }, [getUserData, user]);

  if (!user || loading) {
    return <div>Loading...</div>;
  }

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
        Update Profile
      </h2>
      <button
        className="absolute right-7 bg-red-500 px-4 text-white hover:text-black flex items-center"
        onClick={() => navigate(`/user/profile/${user._id}`)}
      >
        <AiOutlineArrowLeft size={24} />
      </button>
      <UserProfileForm
        formValues={formValues}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
      />
    </Layout>
  );
}

export default UpdateUserProfile;
