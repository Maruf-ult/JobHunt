import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoading,showLoading } from "../../Redux/AlertSlice";
import CategoryDashbord from "./CategoryDashbord.jsx";
import StatusDashboard from "./StatusDashBord.jsx";
import Layout from "../common/Layout";



function MainDashboard() {
  const [applicants, setApplicants] = useState([]);
  const [noUser, setnoUsers] = useState();
  const [admin, setAdmin] = useState();
  const [rec, setRec] = useState();

  const dispatch = useDispatch();
   const url = import.meta.env.VITE_BACKEND_URL

  const getUserData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`${url}/api/get-all-users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        let admin = 0;
        let userr = 0;
        let recruiter = 0;

        response.data.data.forEach((user) => {
          if (user.isDoctor) recruiter++;
          if (user.isAdmin) admin++;
          if (user) userr++;
        });

        setnoUsers(userr);
        setAdmin(admin);
        setRec(recruiter);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const getApplicants = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        `${url}/api/get-appointments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        let applicants = 0;

        response.data.data.forEach((job) => {
          if (job) applicants++;
        });

        setApplicants(applicants);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getApplicants();
  }, []);

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Layout>
      <div className="p-1  overflow-hidden">
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
          Dashboard
        </h2>
        <div className="flex flex-col items-center gap-4">
          {/* Graphs Section */}
          <div className="flex flex-wrap gap-4 justify-center">
            <StatusDashboard />
            <CategoryDashbord />
          </div>

          {/* Statistics Section */}
<div className="flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row gap-6 md:gap-12 mx-auto mb-2 text-center bg-white px-4 sm:px-6 md:px-7 rounded-md py-4">
  <ul className="bg-blue-400 h-[14vh] w-[38vh] md:w-[32vh] p-4 rounded-lg mx-auto">
    <li className="text-xl font-bold">{noUser}</li>
    <li className="text-gray-700">Total members</li>
  </ul>
  <ul className="bg-green-400 h-[14vh] w-[38vh] md:w-[32vh] p-4 rounded-lg mx-auto">
    <li className="text-xl font-bold">{admin}</li>
    <li className="text-gray-700">Admins</li>
  </ul>
  <ul className="bg-purple-400 h-[14vh] w-[38vh] md:w-[32vh] p-4 rounded-lg mx-auto">
    <li className="text-xl font-bold">{rec}</li>
    <li className="text-gray-700">Recruiters</li>
  </ul>
  <ul className="bg-red-400 h-[14vh] w-[38vh] md:w-[32vh] p-4 rounded-lg mx-auto">
    <li className="text-xl font-bold">{applicants}</li>
    <li className="text-gray-700">Applicants</li>
  </ul>
</div>


        </div>
      </div>
    </Layout>
  );
}

export default MainDashboard;
