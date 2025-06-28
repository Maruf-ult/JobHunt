import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../common/Layout";

function RecruiterCV() {
  const { id } = useParams();
  const [recruiter, setRecruiter] = useState(null);
   const url = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate();
  const getRecruiterDetails = async () => {
    try {
      const res = await axios.post(
        `${url}/api/get-doc`,
        { doctorId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setRecruiter(res.data.data);
      }
    } catch (error) {
      toast.error("Could not fetch doctor details");
      console.error(error);
    }
  };

  useEffect(() => {
    getRecruiterDetails();
  }, []);

  if (!recruiter) return <p className="text-center mt-10">Loading...</p>;

  const profileImage = recruiter.image
    ? `${url}/${recruiter.image?.split("\\").pop()}`
    : "https://via.placeholder.com/100";

  

  const logoImage = recruiter.logo
    ? `${url}/${recruiter.logo?.split("\\").pop()}`
    : "https://via.placeholder.com/100";
  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-2 border relative ">
        <button
          className="absolute  right-3 bg-red-500 px-4  text-white hover:text-black flex items-center"
          onClick={() => navigate("/recruiters")}
        >
          <AiOutlineArrowLeft size={24} />
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

   
          <div className="text-left ">
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
              <strong>Profile:</strong>{" "}
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

export default RecruiterCV;
