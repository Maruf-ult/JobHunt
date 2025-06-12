import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoading,showLoading } from "../../Redux/AlertSlice";
import CategoryDashbord from "./CategoryDashbord";
import StatusDashboard from "./StatusDashBord";
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
        <h2 className="font-bold text-black pl-3 absolute top-3 mt-3 ">
          Dashboard
        </h2>
        <div className="flex flex-col items-center gap-4">
          {/* Graphs Section */}
          <div className="flex flex-wrap gap-4 justify-center">
            <StatusDashboard />
            <CategoryDashbord />
          </div>

          {/* Statistics Section */}
          <div className="flex gap-12  mx-auto  mb-2 text-center bg-white px-7 rounded-md py-1  ">
            <ul className="bg-blue-400 h-[14vh] w-[32vh] p-2 rounded-lg">
              <li className="text-xl font-bold">{noUser}</li>
              <li className="text-gray-600">Total members</li>
            </ul>
            <ul className="bg-green-400  h-[14vh] w-[32vh] p-2 rounded-lg">
              <li className="text-xl font-bold">{admin}</li>
              <li className="text-gray-600">Admins</li>
            </ul>
            <ul className="bg-purple-400  h-[14vh] w-[32vh] p-2 rounded-lg">
              <li className="text-xl font-bold">{rec}</li>
              <li className="text-gray-600">Recruiters</li>
            </ul>
            <ul className="bg-red-400  h-[14vh] w-[32vh] p-2 rounded-lg">
              <li className="text-xl font-bold">{applicants}</li>
              <li className="text-gray-600">Applicants</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default MainDashboard;
