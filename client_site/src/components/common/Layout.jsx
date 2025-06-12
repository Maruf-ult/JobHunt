import {
  faBell,
  faCalendarCheck,
  faChartLine,
  faHouse,
  faSign,
  faSignOutAlt,
  faUser,
  faUsers,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../../Redux/userSlice";

function Layout({ children }) {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
   const url = import.meta.env.VITE_BACKEND_URL
  const nav1 = () => {
    navigate("/notifications");
  };

  const userMenu = [
    { name: "Home", link: "/home", icon: faHouse },
    {
      name: "Profile",
      path: user ? `/user/profile/${user._id}` : "#",
      icon: faUser,
    },
    { name: "Appointments", path: "/appointments", icon: faCalendarCheck },
    { name: "Be Recruiter", link: "/apply-rec", icon: faUserTie },
  ];

  const adminMenu = [
    { name: "Home", link: "/home", icon: faHouse },
    { name: "Dashboard", link: "/dashboard", icon: faChartLine },
    { name: "Recruiters", path: "/recruiters", icon: faUserTie },
    { name: "Users", path: "/users", icon: faUsers },
    // { name: 'Profile', link: '/profile', icon: faUserDoctor }
  ];

  const recruiterMenu = [
    { name: "Home", link: "/home", icon: faHouse },
    {
      name: "Appointments",
      path: "/recruiter/appointments",
      icon: faCalendarCheck,
    },
    {
      name: "Profile",
      path: user ? `/recruiter/profile/${user._id}` : "#",
      icon: faUser,
    },
    {
      name: "post jobs",
      path: user ? `/${user._id}/postjob` : "#",
      icon: faSign,
    },
  ];

  const menuToBeRendered = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? recruiterMenu
    : userMenu;

  const getData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.post(
        `${url}/api/get-userid`,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (response.data.success) {
        dispatch(setUser(response.data.data));
      } else {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    getData();
  }, [getData]);

  const logOut = () => {
    const confirmLogout = window.confirm("Do you really want to log out?");

    if (confirmLogout) {
      localStorage.clear();
      navigate("/");
    } else {
      console.log("Logout canceled");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="h-screen w-screen bg-stone-50 flex">
        <div className="h-screen w-44  bg-white shadow-inner border-r">
          <div className="flex flex-col space-y-11 ">
            <h1 className="text-3xl font-bold ml-3 mt-2 text-black">
              SH <br />{" "}
              <span className="text-2xl font-normal">
                {user?.isAdmin ? "admin" : user?.isDoctor ? "recruiter" : "user"}
              </span>
            </h1>
            <ul className="space-y-8 ml-4 text-black">
              {menuToBeRendered.map((item, index) => (
                <li key={index} className="font-normal">
                  <Link
                    to={item.link || item.path}
                    className="cursor-pointer hover:text-green-500 flex items-center"
                  >
                    <FontAwesomeIcon icon={item.icon} className="mr-2" />{" "}
                    {item.name}
                  </Link>
                </li>
              ))}
              <li
                className="font-bold cursor-pointer hover:text-red-400"
                onClick={logOut}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-stone-100 w-screen  ml-5  rounded-md mr-4">
          <div className="flex justify-end  bg-white border p-3 rounded-sm text-black font-bold m-2 cursor-pointer">
            <h1 className="font-bold mx-auto text-2xl pl-10 text-black">
              Job<span className="text-red-500">Hunt</span>
            </h1>

            <Badge
              onClick={nav1}
              className="mr-3 "
              count={user?.unseenNotifications?.length || 0}
              showZero
            >
              <FontAwesomeIcon icon={faBell} className="mr-2 mt-1 size-5" />
            </Badge>

            <p className="hover:text-green-500">{user.name || "Guest"}</p>
          </div>
          <div className="bg-gray-200 mr-3 ml-3 mt-2 h-[86vh] w-[187vh] rounded-md">
            {children || <div>No content available</div>}
          </div>
        </div>
      </div>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
