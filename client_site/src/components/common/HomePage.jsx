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
  Job Listings
</h2>

      <Row gutter={20}>
      
        <Col
          className="pt-4"
          xs={0}
          sm={0}
          md={4}
          lg={4}
          style={{ position: "sticky", top: "10px" }}
        >
          <JobFilters setSelectedCategory={setSelectedCategory} />
        </Col>

      
        <Col xs={24} sm={24} md={20} lg={20}>
          <div
            className="mx-auto"
            style={{
              height: "85vh",
              maxWidth: "1200px", 
              width: "100%",
              overflowY: "auto",
              padding: "10px",
              border: "1px solid #ddd",
            }}
          >
            <Row
              gutter={[32, 24]}
              style={{
                margin: 0,
                display: "flex",
                flexWrap: "wrap",
              }}
            >
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
