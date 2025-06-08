import { Col, Row } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../Redux/AlertSlice";
import Jobs from "../components/User/Jobs";
import CategoryCarousel from "./CategoryCarousel";

import JobFilters from "../components/User/JobFilters";

function Home() {
  const navigate = useNavigate();
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const dispatch = useDispatch();
  const url = "http://localhost:4000";
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
        <div className="fixed top-0 left-0 w-screen bg-slate-200 py-2 ">
          <div className="flex justify-start pl-24 pt-3 space-x-96">
            <h1 className="font-bold text-2xl text-black">
              Job<span className="text-red-500">Hunt</span>
            </h1>
            <ul className="flex justify-end pl-72 space-x-6 text-black">
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
          </div>
        </div>

        <div id="home" className="flex ml-12 pt-24 min-h-screen">
          <div className="flex flex-col mt-3 ml-80 pl-8 text-center">
            <h3 className="text-red-400 font-semibold w-1/2 mx-auto rounded-md">
              No.1 Job Hunt Website
            </h3>
            <h1 className="text-4xl font-bold mt-4">Search, Apply &</h1>
            <h1 className="text-4xl font-bold mt-1">
              Get Your <span className="text-[#6A38C2]">Dream Jobs</span>
            </h1>
            <p className="text-slate-500 text-sm mt-3">
              Find opportunities tailored to you.
            </p>

            <div className="flex shadow-lg border border-gray-200 rounded-full items-center mt-4 mx-auto">
              <input
                type="text"
                placeholder="Find your dream jobs"
                className="outline-none border-none w-96 text-md p-2 rounded-l-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="rounded-r-full bg-[#6A38C2] p-2 px-3"
                onClick={() => {
                  navigate(`/search-results/${searchQuery.trim()}`);
                }}
              >
                <FaSearch className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="-mt-44 w-3/4 mx-auto">
          <CategoryCarousel />
        </div>
      </div>

      <div
        id="jobs"
        className="w-screen min-h-screen bg-slate-100 flex flex-col items-center justify-center"
      >
        <h1 className="text-4xl font-bold text-center mb-6">
          <span className="text-[#6A38C2]">Latest and Top</span> Job Openings
        </h1>

        <div className="flex flex-row justify-start flex-wrap gap-4 w-3/4">
          {jobs.length > 0 ? (
            jobs.map((job) => {
              const company = recruiters.find(
                (recruiter) => recruiter.userId === job.createdBy
              );
              return (
                <div key={job._id} className="p-4 rounded-md ">
                  <Jobs recruiter={company} job={job} />
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 text-lg">
              No jobs available.
            </p>
          )}
        </div>
      </div>

      <div
        id="browse"
        className="w-screen min-h-screen bg-slate-200 flex flex-col items-start justify-center"
      >
        <h1 className="text-4xl font-bold mx-auto mb-6">
          <span className="text-[#6A38C2]">Latest and Top</span> Job Openings
        </h1>

        <Row gutter={20} className="w-3/4 flex pl-20 ">
          <Col className="pt-4  " xs={24} sm={6} md={4} lg={4}>
            <JobFilters setSelectedCategory={setSelectedCategory} />
          </Col>

          <Col xs={24} sm={18} md={20} lg={20}>
            <div className="flex flex-wrap space-x-20 justify-center ml-10 ">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => {
                  const company = recruiters.find(
                    (recruiter) => recruiter.userId === job.createdBy
                  );
                  return (
                    <div key={job._id} className="p-4  rounded-md w-1/4 ">
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
