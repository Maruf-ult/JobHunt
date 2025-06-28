
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { hideLoading, showLoading } from "../../Redux/AlertSlice";

function JobDetails() {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [job, setJob] = useState(null);
  const [doctor, setDoctor] = useState(null);
 
   const url = import.meta.env.VITE_BACKEND_URL

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get(`${url}/api/jobs/${jobId}`);
        setJob(response.data);

        if (response.data.createdBy) {
          const doctorResponse = await axios.get(
            `${url}/api/doctors/${response.data.createdBy}`
          );
          setDoctor(doctorResponse.data);
        }

        dispatch(hideLoading());
      } catch (error) {
        console.error("Error fetching job:", error);
        dispatch(hideLoading());
      }
    };

    fetchJobDetails();
  }, [jobId, dispatch]);

  const bookAppointment = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        `${url}/api/book-appointment`,
        {
          doctorId: job.createdBy,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());

      if (response.data.success) {
        toast.success(response.data.msg);
        navigate("/appointments");
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      toast.error("Error booking appointment. Please try again later.");
      dispatch(hideLoading());
      console.error("Error: ", error);
    }
  };



  if (!job) {
    return <p className="text-center text-red-500">Job details not found.</p>;
  }

const logoImage = doctor?.logo
  ? `${url}/${doctor.logo.replace(/^.*[\\/]/, "")}`
  : "https://via.placeholder.com/100";


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center">
        <img
          src={logoImage}
          alt="Company Logo"
          className="w-20 h-20 rounded-full mt-3"
        />
        <button
          onClick={bookAppointment}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Apply
        </button>
      </div>
      <h1 className="text-xl font-semibold mt-4">
        {doctor?.companyName || "Unknown Company"}
      </h1>
      <p className="text-gray-600">{doctor?.location || "Unknown Location"}</p>
      <div className="border-b border-gray-300 my-4"></div>
      <b className="block text-lg font-bold">{job.position}</b>
      <p className="text-gray-700">{job.description}</p>
      <div className="mt-3 grid grid-cols-2 gap-4">
        <div>
          <b className="text-gray-800">Job Type:</b> {job.jobType}
        </div>
        <div>
          <b className="text-gray-800">Salary:</b> {job.salary} LPA
        </div>
        <div>
          <b className="text-gray-800">Deadline:</b>{" "}
          {new Date(job.deadline).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
        <div>
          <b className="text-gray-800">Experience Required:</b> {job.experience}
        </div>
      </div>
      <div className="border-b border-gray-300 my-4"></div>
      <b className="block text-gray-800">Skills:</b>{" "}
      <p className="text-gray-700">{job.skills?.join(", ")}</p>
      <b className="block text-gray-800">Facilities:</b>{" "}
      <p className="text-gray-700">{job.facilities?.join(", ")}</p>
      <b className="block text-gray-800">Email:</b>{" "}
      <p className="text-gray-700">{job.email}</p>
    </div>
  );
}

export default JobDetails;
