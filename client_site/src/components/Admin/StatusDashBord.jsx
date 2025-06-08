import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/AlertSlice";
import DoughnutChart from "./DoughnutChart";
import axios from "axios";

function StatusDashboard() {
  const [jobData, setJobData] = useState([0, 0, 0]); 
  const jobLabels = ["Pending", "Approved", "Rejected"];
  const dispatch = useDispatch();


   const getStatus  = async () => {
          try {
            dispatch(showLoading());
            const response = await axios.get(
              "http://localhost:4000/api/get-appointments",
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                   let pendingCount = 0;
                  let approvedCount = 0;
                   let rejectedCount = 0;

        response.data.data.forEach((job) => {
          if (job.status === "pending") pendingCount++;
          else if (job.status === "approved") approvedCount++;
          else if (job.status === "rejected") rejectedCount++;
        });
        setJobData([pendingCount, approvedCount, rejectedCount]);

            }
          } catch (error) {
            dispatch(hideLoading());
            console.log(error);
          }
        };

  useEffect(() => {
    getStatus();
  }, []);

  return (
     <div className="bg-white h-[65vh] w-[60vh] p-8 rounded-lg shadow-2xl flex flex-col items-center">
      <h2 className="text-xl font-bold mb-6 text-center">Job Status Overview</h2>
      <DoughnutChart data={jobData} labels={jobLabels} />
    </div>

  );
}

export default StatusDashboard;