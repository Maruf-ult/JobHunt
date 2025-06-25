import { Col, Row } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../Redux/AlertSlice";
import Jobs from "../components/User/Jobs";
import CategoryCarousel from "./CategoryCarousel";
import { FaBars, FaTimes } from "react-icons/fa";

import JobFilters from "../components/User/JobFilters";

function Home() {
  const navigate = useNavigate();
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const dispatch = useDispatch();
   const url = import.meta.env.VITE_BACKEND_URL
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
const [showMenu, setShowMenu] = useState(false);

  const getJobs = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`${url}/api/get-jobs-forHome`);
      dispatch(hideLoading());
      if (response.data.success) {
        setJobs(response.data.jobs);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log("Error fetching jobs:", error);
    }
  };

  // Fetch Doctors
  const getRecruiters = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        `${url}/api/get-all-approved-doctors-forHome`
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setRecruiters(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    getRecruiters();
    getJobs();
  }, []);

  const filteredJobs = !selectedCategory
    ? jobs
    : jobs.filter((job) => {
        const recruiter = recruiters.find((rec) => rec.userId === job.createdBy);
        const recruiterLocation = recruiter?.location?.toLowerCase().trim();

        const locationMatch =
          recruiterLocation === selectedCategory.toLowerCase().trim();

        const positionMatch =
          job.position?.toLowerCase().trim() ===
          selectedCategory.toLowerCase().trim();

        const salaryMatch =
          selectedCategory === "Low"
            ? job.salary < 50000
            : selectedCategory === "High"
            ? job.salary >= 50000
            : false;

        return locationMatch || positionMatch || salaryMatch;
      });

  const nav1 = () => {
    navigate("/login");
  };

return (
  <>
    <div className="w-screen min-h-screen bg-slate-200">
      {/* NAVBAR WITH TOGGLE */}
      <div className="fixed top-0 left-0 w-screen bg-slate-200 py-2 z-50">
        <div className="flex justify-between items-center px-4 md:px-24 pt-3">
          <h1 className="font-bold text-2xl text-black">
            Job<span className="text-red-500">Hunt</span>
          </h1>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 text-black">
            <li className="cursor-pointer">
              <a href="#home">Home</a>
            </li>
            <li
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  document
                    .getElementById("jobs")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="cursor-pointer rounded-sm"
            >
              Jobs
            </li>

            <li
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  document
                    .getElementById("browse")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="cursor-pointer rounded-sm"
            >
              Browse
            </li>
            <li
              onClick={nav1}
              className="cursor-pointer text-white bg-[#6A38C2] px-6 -mt-1 py-1"
            >
              Join us
            </li>
          </ul>

          {/* Mobile Toggle Icon */}
          <div className="md:hidden">
            <button onClick={() => setShowMenu(!showMenu)}>
              {showMenu ? (
                <FaTimes className="text-2xl text-[#6A38C2]" />
              ) : (
                <FaBars className="text-2xl text-[#6A38C2]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <ul className="md:hidden flex flex-col items-center bg-slate-100 w-full text-black py-2 space-y-2 transition-all">
            <li className="cursor-pointer" onClick={() => setShowMenu(false)}>
              <a href="#home">Home</a>
            </li>
            <li
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  document
                    .getElementById("jobs")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 100);
                setShowMenu(false);
              }}
              className="cursor-pointer"
            >
              Jobs
            </li>
            <li
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  document
                    .getElementById("browse")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 100);
                setShowMenu(false);
              }}
              className="cursor-pointer"
            >
              Browse
            </li>
            <li
              onClick={() => {
                nav1();
                setShowMenu(false);
              }}
              className="cursor-pointer text-white bg-[#6A38C2] px-6 py-1 rounded-md"
            >
              Join us
            </li>
          </ul>
        )}
      </div>

      {/* HERO SECTION */}
   {/* HERO SECTION */}
<div id="home" className="flex justify-center pt-32 px-4 min-h-screen">
  <div className="flex flex-col text-center max-w-xl w-full">
    <h3 className="text-red-400 font-semibold mx-auto rounded-md">
      No.1 Job Hunt Website
    </h3>
    <h1 className="text-4xl font-bold mt-4">Search, Apply &</h1>
    <h1 className="text-4xl font-bold mt-1">
      Get Your <span className="text-[#6A38C2]">Dream Jobs</span>
    </h1>
    <p className="text-slate-500 text-sm mt-3">
      Find opportunities tailored to you.
    </p>

    {/* SEARCH INPUT */}
    <div className="flex flex-col sm:flex-row shadow-lg border border-gray-200 rounded-full items-center mt-4 mx-auto w-full max-w-lg">
      <input
        type="text"
        placeholder="Find your dream jobs"
        className="outline-none border-none w-full text-md p-3 sm:p-2 sm:rounded-l-full rounded-t-full sm:rounded-t-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        className="w-full sm:w-auto bg-[#6A38C2] p-3 px-4 text-white sm:rounded-r-full rounded-b-full sm:rounded-b-none"
        onClick={() => {
          navigate(`/search-results/${searchQuery.trim()}`);
        }}
      >
        <FaSearch className="h-5 w-5 mx-auto sm:mx-0" />
      </button>
    </div>
  </div>
</div>

{/* CATEGORY CAROUSEL - HIDDEN ON MOBILE */}
<div className="-mt-28 px-4 w-full max-w-6xl mx-auto hidden sm:block">
  <CategoryCarousel />
</div>

    </div>

    {/* JOBS SECTION */}
    <div
      id="jobs"
      className="w-screen min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
        <span className="text-[#6A38C2]">Latest and Top</span> Job Openings
      </h1>

       <div className="flex flex-wrap gap-x-6 gap-y-4 justify-center w-full max-w-6xl">
        {jobs.length > 0 ? (
          jobs.slice(0, 3).map((job) => {
            const company = recruiters.find(
              (recruiter) => recruiter.userId === job.createdBy
            );
            return (
              <div key={job._id} className="p-4 rounded-md w-full sm:w-[300px]">
                <Jobs recruiter={company} job={job} />
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 text-lg">No jobs available.</p>
        )}
      </div>
    </div>

    {/* BROWSE SECTION */}
    <div
      id="browse"
      className="w-screen min-h-screen bg-slate-200 flex flex-col items-center justify-center px-4"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
        <span className="text-[#6A38C2]">Latest and Top</span> Job Openings
      </h1>

      <Row gutter={[16, 16]} className="w-full max-w-7xl mx-auto">
        <Col xs={24} sm={6} md={5} lg={4}>
          <JobFilters setSelectedCategory={setSelectedCategory} />
        </Col>

        <Col xs={24} sm={18} md={19} lg={20}>
           <div className="flex flex-wrap justify-center gap-x-6 gap-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => {
                const company = recruiters.find(
                  (recruiter) => recruiter.userId === job.createdBy
                );
                return (
                  <div key={job._id} className="p-4 rounded-md w-full sm:w-[280px]">
                    <Jobs recruiter={company} job={job} />
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 text-lg">
                No jobs available for this category.
              </p>
            )}
          </div>
        </Col>
      </Row>
    </div>
  </>
);

}

export default Home;
