import { useState, useCallback, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../../Redux/userSlice";
import { FaBars, FaTimes } from "react-icons/fa";

function Layout({ children }) {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;

  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  }, [dispatch, navigate, url]);

  useEffect(() => {
    getData();
  }, [getData]);

  const logOut = () => {
    const confirmLogout = window.confirm("Do you really want to log out?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen w-screen bg-stone-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-inner border-r z-50
          w-44 transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col space-y-11 p-4 pt-6">
          {/* Close button for mobile */}
          <button
            className="md:hidden self-end mb-4 text-xl cursor-pointer"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>

          <h1 className="text-3xl font-bold ml-3 text-black leading-snug">
            SH <br />
            <span className="text-2xl font-normal">
              {user?.isAdmin
                ? "admin"
                : user?.isDoctor
                ? "recruiter"
                : "user"}
            </span>
          </h1>

          <ul className="space-y-8 ml-4 text-black">
            {menuToBeRendered.map((item, index) => (
              <li
                key={index}
                className="font-normal"
                onClick={() => setSidebarOpen(false)}
              >
                <Link
                  to={item.link || item.path}
                  className="cursor-pointer hover:text-green-500 flex items-center"
                >
                  <FontAwesomeIcon icon={item.icon} className="mr-2" />
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
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
 <header className="flex items-center justify-between bg-white border-b p-3 shadow-md z-40 relative">
  {/* Left: hamburger menu only on small screens */}
  <button
    className="md:hidden text-2xl text-gray-700 cursor-pointer hover:text-green-500 transition"
    onClick={() => setSidebarOpen(true)}
    aria-label="Open menu"
  >
    <FaBars />
  </button>

  {/* Center: JobHunt text visible only on md+ */}
  <h1 className="hidden md:block font-bold mx-auto text-2xl text-black pl-10">
    Job<span className="text-red-500">Hunt</span>
  </h1>

  {/* Right: notification and username */}
  <div className="flex items-center space-x-4">
    <Badge
      onClick={nav1}
      count={user?.unseenNotifications?.length || 0}
      showZero
      className="cursor-pointer"
    >
      <FontAwesomeIcon icon={faBell} className="text-xl text-gray-700" />
    </Badge>

    <p className="text-black font-semibold">{user.name || "Guest"}</p>
  </div>
</header>


        {/* Content */}
        <main className="flex-1 bg-gray-200 m-3 rounded-md overflow-auto">
          {children || <div className="p-4">No content available</div>}
        </main>
      </div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
