import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEdit } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../../Redux/AlertSlice";
import Layout from "../common/Layout";

function RecruiterProfile() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [recruiter, setRecruiter] = useState(null);
  const url = "http://localhost:4000";

  const getRecruiterDetails = useCallback(async () => {
    if (!user || !user._id) return;

    try {
      dispatch(showLoading());
      const res = await axios.post(
        `${url}/api/get-doctor-info-by-user-id`,
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());

      if (res.data.success) {
        setRecruiter(res.data.data);
      } else {
        setRecruiter(null);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Could not fetch doctor details");
      console.error(error);
    }
  }, [dispatch, user]);

  useEffect(() => {
    getRecruiterDetails();
  }, [getRecruiterDetails]);

  if (!recruiter) return <p className="text-center mt-10">Loading...</p>;

  const profileImage = recruiter.image
    ? `${url}/${recruiter.image?.split("\\").pop()}`
    : "https://via.placeholder.com/100";

  const logoImage = recruiter.logo
    ? `${url}/${recruiter.logo?.split("\\").pop()}`
    : "https://via.placeholder.com/100";

  return (
    <Layout>
      <h2 className="font-bold text-black pl-3 absolute top-3 mt-3">
        Recruiter Profile
      </h2>
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-4 border relative">
        <button
          className="absolute right-3 bg-blue-500 px-4 text-white hover:text-black flex items-center"
          onClick={() => navigate(`/recruiter/Updateprofile/:${user._id}`)}
        >
          <AiOutlineEdit size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          Curriculum Vitae
        </h2>

        <div className="grid grid-cols-2 gap-6">
     
          <div className="text-center">
            <img
              src={profileImage}
              alt="Doctor"
              className="w-40 h-40 rounded-full object-cover mx-auto mb-4"
            />
            <h1 className="font-bold">Profile</h1>
            <img
              src={logoImage}
              alt="Company Logo"
              className="w-28 h-28 object-contain mx-auto mt-6"
            />
            <h1 className="font-bold">Logo</h1>
          </div>


          <div className="text-left">
            <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
            <p>
              <strong>Name:</strong> Dr. {recruiter.firstName} {recruiter.lastName}
            </p>
            <p>
              <strong>Address:</strong> {recruiter.address || "Not provided"}
            </p>
            <p>
              <strong>Phone:</strong> {recruiter.phoneNumber}
            </p>
            <p>
              <strong>Status:</strong> {recruiter.status}
            </p>
            <p>
              <strong>Profile:</strong>
              <a
                href={recruiter.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline ml-2"
              >
                {recruiter.website || "N/A"}
              </a>
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">Company Details</h3>
            <p>
              <strong>Company Name:</strong>{" "}
              {recruiter.companyName || "No Company"}
            </p>
            <p>
              <strong>Location:</strong> {recruiter.location || "No location"}
            </p>
            <p>
              <strong>Website:</strong>
              <span className="ml-2">
                <a
                  href={recruiter.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {recruiter.website || "N/A"}
                </a>
              </span>
            </p>
            <strong>Description:</strong>
            <p>{recruiter.description || "No description provided"}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default RecruiterProfile;
