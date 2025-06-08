import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { hideLoading, showLoading } from "../Redux/AlertSlice";
import Jobs from "../components/User/Jobs";

function SearchResults() {
  const { category } = useParams();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const url = "http://localhost:4000";
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(showLoading());

        const jobsResponse = await axios.get(`${url}/api/get-jobs-forHome`);
        const doctorsResponse = await axios.get(
          `${url}/api/get-all-approved-doctors-forHome`
        );

        dispatch(hideLoading());

        if (jobsResponse.data.success && doctorsResponse.data.success) {
          setRecruiters(doctorsResponse.data.data);

          const matchedJobs = jobsResponse.data.jobs.filter((job) =>
            job.position.toLowerCase().includes(category.toLowerCase().trim())
          );

          setFilteredJobs(matchedJobs);
        }
      } catch (error) {
        dispatch(hideLoading());
        console.log("Error fetching search results:", error);
      }
    };

    fetchData();
  }, [category]);

  return (
    <div className="w-screen min-h-screen bg-slate-100 flex flex-col items-start justify-start  ">
      <h1 className="text-4xl font-bold mb-6 mx-auto mt-3">
        Search Results for <span className="text-[#6A38C2]">{category}</span>
      </h1>

      <div className="flex flex-wrap gap-4 w-3/4 ml-10">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const company = recruiters.find(
              (recruiter) => recruiter.userId === job.createdBy
            );
            return (
              <div key={job._id} className="p-4 rounded-md">
                <Jobs recruiter={company} job={job} />
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No jobs found for {category}.
          </p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
