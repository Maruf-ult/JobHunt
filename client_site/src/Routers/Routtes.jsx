import { useSelector } from "react-redux";
// import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "../App.css";
import Login from "../authentication/Login.jsx";
import Register from "../authentication/Register.jsx";
import ResetPass from "../authentication/ResetPass.jsx";
import RecruitersList from "../components/Admin/RecruitersList.jsx";
import UserList from "../components/Admin/UserList.jsx";
import ApplyRec from "../components/User/ApplyRec.jsx";
import HomePage from "../components/common/HomePage.jsx";
import RecruiterAppointment from "../components/Recruiter/RecruiterAppointment.jsx";
import RecruiterCV from "../components/Recruiter/RecruiterInfo.jsx";
import RecruiterProfile from "../components/Recruiter/RecruiterProfile.jsx";
import PostJobs from "../components/Recruiter/PostJobs.jsx";
import UpdateRecProfile from "../components/Recruiter/UpdateRecProfile.jsx";
import MainDashboard from "../components/Admin/MainDashboard.jsx";
import Navigate from "../components/common/Navigate.jsx";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import PublicRoute from "../components/common/PublicRoute.jsx";
import Appointment from "../components/User/Appointment.jsx";
import BookAppointment from "../components/User/BookAppointment.jsx";
import FulluserInfo from "../components/User/FulluserInfo.jsx";
import JobDetails from "../components/User/JobDetails.jsx";
import UpdateUserProfile from "../components/User/UpdateUserProfile.jsx";
import UserInfo from "../components/User/UserInfo.jsx";
import Home from "../Home/Home.jsx";
import SearchResults from "../Home/SearchResults.jsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/search-results/:category",
      element: (
        <PublicRoute>
          <SearchResults />
        </PublicRoute>
      ),
    },
    {
      path: "/register",
      element: (
        <PublicRoute>
          <Register />
        </PublicRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/reset-password",
      element: (
        <PublicRoute>
          <ResetPass />
        </PublicRoute>
      ),
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <MainDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/apply-rec",
      element: (
        <ProtectedRoute>
          <ApplyRec />
        </ProtectedRoute>
      ),
    },
    {
      path: "/notifications",
      element: (
        <ProtectedRoute>
          <Navigate />
        </ProtectedRoute>
      ),
    },
    {
      path: "/users",
      element: (
        <ProtectedRoute>
          <UserList />
        </ProtectedRoute>
      ),
    },
    {
      path: "/recruiters",
      element: (
        <ProtectedRoute>
          <RecruitersList />
        </ProtectedRoute>
      ),
    },
    {
      path: "/recruiter/:id",
      element: (
        <ProtectedRoute>
          <RecruiterCV />
        </ProtectedRoute>
      ),
    },
    {
      path: "/user/:id",
      element: (
        <ProtectedRoute>
          <FulluserInfo />
        </ProtectedRoute>
      ),
    },
    {
      path: "/:id/postjob",
      element: (
        <ProtectedRoute>
          <PostJobs />
        </ProtectedRoute>
      ),
    },
    {
      path: "/jobinfo/:jobId",
      element: (
        <ProtectedRoute>
          <JobDetails />
        </ProtectedRoute>
      ),
    },

    {
      path: "/update/user/:userId",
      element: (
        <ProtectedRoute>
          <UpdateUserProfile />
        </ProtectedRoute>
      ),
    },

    {
      path: "/user/profile/:userId",
      element: (
        <ProtectedRoute>
          <UserInfo />
        </ProtectedRoute>
      ),
    },
    {
      path: "/recruiter/profile/:userId",
      element: (
        <ProtectedRoute>
          <RecruiterProfile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/recruiter/Updateprofile/:userId",
      element: (
        <ProtectedRoute>
          <UpdateRecProfile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/book-appointment/:doctorId",
      element: (
        <ProtectedRoute>
          <BookAppointment />
        </ProtectedRoute>
      ),
    },
    {
      path: "/appointments",
      element: (
        <ProtectedRoute>
          <Appointment />
        </ProtectedRoute>
      ),
    },
    {
      path: "/recruiter/appointments",
      element: (
        <ProtectedRoute>
          <RecruiterAppointment />
        </ProtectedRoute>
      ),
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function Routtes() {
  const { loading } = useSelector((state) => state.alerts);

  return (
    <>
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}
      <RouterProvider router={router} />
    </>
  );
}

export default Routtes;
