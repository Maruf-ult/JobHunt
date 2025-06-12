import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../../Redux/AlertSlice.jsx";
import RecruiterForm from "../User/RecruiterForm.jsx";
import Layout from "../common/Layout.jsx";

function UpdateRecProfile() {
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

  const getRecData = useCallback(async () => {
    if (!user || !user._id) return;
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${url}/api/get-doctor-info-by-user-id`,
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

      const formData = new FormData();
      Object.keys(formValues).forEach((key) => {
        formData.append(key, formValues[key]);
      });
      formData.append("userId", user._id);

      const response = await axios.post(
        `${url}/api/update-doctor-profile`,
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
      getRecData();
    }
  }, [getRecData, user]);

  if (!user || loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <h2 className="font-bold text-black pl-3 absolute top-3 mt-3">
        Update Profile
      </h2>
      <button
        className="absolute right-7 bg-red-500 px-6 py-1   text-white hover:text-black flex items-center"
        onClick={() => navigate(`/recruiter/profile/:${user._id}`)}
      >
        <AiOutlineArrowLeft size={24} />
      </button>
      <RecruiterForm
        formValues={formValues}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
      />
    </Layout>
  );
}

export default UpdateRecProfile;
