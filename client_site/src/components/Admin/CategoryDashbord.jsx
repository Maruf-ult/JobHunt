import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/AlertSlice";
import BarChart from "./BarChart"; 

function CategoryDashbord() {
  const [jobData, setJobData] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const dispatch = useDispatch();

  const getJobs = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("http://localhost:4000/api/get-jobs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());

      if (response.data.success) {
        // ✅ Count job postings per category
        const categoryCounts = {};
        response.data.jobs.forEach((job) => {
          categoryCounts[job.position] =
            (categoryCounts[job.position] || 0) + 1;
        });

        setJobCategories(Object.keys(categoryCounts));
        setJobData(Object.values(categoryCounts));
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  return (
    <div className="bg-white  p-6 rounded-lg shadow-2xl">
      <h2 className="text-xl font-bold mb-4">Job Postings Per Category</h2>
      <BarChart data={jobData} labels={jobCategories} />
    </div>
  );
}

export default CategoryDashbord;
