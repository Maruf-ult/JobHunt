import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function Jobs({ recruiter, job }) {
  const navigate = useNavigate();
    const url = import.meta.env.VITE_BACKEND_URL
  const logoImage = recruiter?.logo
    ? `${url}/${recruiter.logo?.split("\\").pop()}`
    : "https://via.placeholder.com/100";

  const getRelativeDate = (dateString) => {
    const createdAt = new Date(dateString);
    const today = new Date();

    const differenceInTime = today.getTime() - createdAt.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    if (differenceInDays === 0) {
      return "Today";
    } else if (differenceInDays === 1) {
      return "1 day ago";
    } else {
      return `${differenceInDays} days ago `;
    }
  };

const formatSalaryLPA = (salary) => {
  return `${(salary / 100000).toFixed(1)} LPA`; // Converts salary to LPA format
};

  

  return (
   <div className="card p-2 h-[55vh] w-[47vh]  shadow-lg text-black bg-white cursor-pointer py-6">
  <p className="space-y-2">
    {getRelativeDate(job.createdAt)} <br />
  </p>

  <div className="flex space-x-6">
    <img
      src={logoImage}
      alt="Company Logo"
      className="w-16 h-16 rounded-full mt-2"
    />
    <div className="mt-3">
      <h1 className="card-title text-lg font-semibold">
        {recruiter?.companyName || "Unknown Company"}
      </h1>
      <p className="text-sm ml-1"> {recruiter?.location || "Unknown Location"}</p>
    </div>
  </div>

  {/* Job Details */}
  <div className="flex flex-col mt-3">
    <b className="text-md">{job.position}</b>
    <p className="text-sm">{job.description.slice(0, 70)}....</p>

    <div className="flex mt-4 gap-5 text-sm ">
      <b className="bg-white text-blue-400 rounded-sm shadow-sm  ">{job.jobType}</b>
      <b className="bg-white text-red-400 rounded-sm shadow-sm ">{formatSalaryLPA(job.salary)}</b>
      <b className="bg-white text-purple-600 rounded-sm shadow-sm ">
        {new Date(job.deadline).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </b>
    </div>

    <div className="flex space-x-4 mt-4">
      <button
        onClick={() => navigate(`/jobinfo/${job._id}`)}
        className="bg-white h-8 w-16 border  shadow-md rounded-sm text-sm font-semibold"
      >
        Details
      </button>
      <button onClick={() => navigate(`/jobinfo/${job._id}`)} className="bg-purple-600 border shadow-md px-3 py-1 text-white rounded-sm text-sm">
        Apply Now
      </button>
    </div>
  </div>
</div>
  );
}

Jobs.propTypes = {
  recruiter: PropTypes.shape({
    userId: PropTypes.string,
    companyName: PropTypes.string,
    logo: PropTypes.string,
    location: PropTypes.string,
  }),
  job: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    jobType: PropTypes.string.isRequired,
    experience: PropTypes.string.isRequired,
    salary: PropTypes.number.isRequired,
    skills: PropTypes.array.isRequired,
    facilities: PropTypes.array.isRequired,
    email: PropTypes.string.isRequired,
    deadline: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default Jobs;
