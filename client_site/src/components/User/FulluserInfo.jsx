import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../common/Layout";

function FulluserInfo() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const url = "http://localhost:4000";
  const navigate = useNavigate();
  const getUserDetails = async () => {
    try {
      const res = await axios.post(
        `${url}/api/get-user/${id}`,
        { userId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setUser(res.data.data);
      } else {
        toast.error(res.data.data.msg);
      }
    } catch (error) {
      toast.error("Could not fetch doctor details");
      console.error(error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  const profileImage = user.image
    ? `http://localhost:4000/${user.image?.split("\\").pop()}`
    : "https://via.placeholder.com/100";

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-4 border relative">
        <button
          className="absolute right-3 bg-blue-500 px-4 text-white hover:text-black flex items-center"
          onClick={() => navigate(-1)}
        >
          <AiOutlineArrowLeft size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>

        <div className="flex items-start space-x-12">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 rounded-full overflow-hidden border border-gray-500 flex justify-center items-center">
              <img
                src={profileImage}
                alt="User"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <strong>{user.name || "Not provided"}</strong>
          </div>

          {/* User Information Section */}
          <div className="flex flex-col w-full space-y-4 pl-10">
            <h3 className="text-xl font-semibold">Personal Information</h3>
            <p>
              <strong>Email:</strong> {user.email || "Not provided"}
            </p>
            <p>
              <strong>Phone Number:</strong>{" "}
              {user.phoneNumber || "Not provided"}
            </p>
            <p>
              <strong>Bio:</strong> {user.bio || "No bio available"}
            </p>
            <p className="flex items-center">
              <strong className="mr-2">Skills:</strong>
              {user.skills.length ? (
                <div className="flex flex-wrap gap-2">
                  {user.skills[0].split(", ").map((skill, index) => {
                    const colors = [
                      "bg-blue-500",
                      "bg-green-500",
                      "bg-yellow-500",
                      "bg-red-500",
                      "bg-purple-500",
                      "bg-indigo-500",
                    ];
                    const skillColor = colors[index % colors.length]; // Assign different colors

                    return (
                      <span
                        key={index}
                        className={`px-3 py-1 text-white rounded-md ${skillColor}`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <span className="text-gray-500">No skills listed</span>
              )}
            </p>
            <div className="flex items-center">
              <strong>Resume:</strong>
              {user.resume ? (
                <a
                  href={`${url}/${user.resume.replace("\\", "/")}`}
                  className="text-blue-600 underline ml-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume (PDF)
                </a>
              ) : (
                <span className="text-gray-500 ml-2">No resume uploaded</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default FulluserInfo;
