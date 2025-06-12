import { Col, Row } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/AlertSlice.jsx";
import Jobs from "../User/Jobs.jsx";
import JobFilters from "../User/JobFilters.jsx";
import Layout from "./Layout.jsx";

function HomePage() {
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dispatch = useDispatch();
  const url = import.meta.env.VITE_BACKEND_URL

  // Fetch Jobs
  const getJobs = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`${url}/api/get-jobs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
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
      const response = await axios.get(`${url}/api/get-all-approved-doctors`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
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

  // Filter jobs based on selected category
  const filteredJobs = !selectedCategory
    ? jobs
    : jobs.filter((job) => {
        // Find the doctor related to this job
        const recruiter = recruiters.find((rec) => rec.userId === job.createdBy);
        const recruiterLocation = recruiter?.location?.toLowerCase().trim();

        // Check if selectedCategory matches doctor location
        const locationMatch =
          recruiterLocation === selectedCategory.toLowerCase().trim();

        // Check if selectedCategory matches job position
        const positionMatch =
          job.position?.toLowerCase().trim() ===
          selectedCategory.toLowerCase().trim();

        // Check salary conditions
        const salaryMatch =
          selectedCategory === "Low"
            ? job.salary < 50000
            : selectedCategory === "High"
            ? job.salary >= 50000
            : false;

        return locationMatch || positionMatch || salaryMatch;
      });

  return (
    <Layout>
      <h2 className="font-bold text-black pl-3 absolute top-3 mt-3">
        Job Listings
      </h2>

      <Row gutter={20}>
        {/* Sidebar Filters */}
        <Col
          className="pt-4"
          xs={24}
          sm={4}
          md={4}
          lg={4}
          style={{ position: "sticky", top: "10px" }}
        >
          <JobFilters setSelectedCategory={setSelectedCategory} />
        </Col>

        {/* Job Cards */}
        <Col xs={24} sm={18} md={18} lg={18}>
          {/* Scrollable Job Listings - Vertical Only */}
          <div
            style={{
              height: "85vh",
              width: "155vh",
              overflowY: "scroll",
              overflowX: "hidden",
              padding: "10px",
              border: "1px solid #ddd",
            }}
          >
            <Row gutter={[6, 24]} style={{ display: "flex", flexWrap: "wrap" }}>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => {
                  const company = recruiters.find(
                    (rec) => rec.userId === job.createdBy
                  );
                  return (
                    <Col key={job._id} span={24} xs={24} sm={12} lg={8}>
                      <div style={{ padding: "8px", width: "100%" }}>
                        <Jobs recruiter={company} job={job} />
                      </div>
                    </Col>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 text-lg mt-4">
                  No jobs available for this category.
                </p>
              )}
            </Row>
          </div>
        </Col>
      </Row>
    </Layout>
  );
}

export default HomePage;
