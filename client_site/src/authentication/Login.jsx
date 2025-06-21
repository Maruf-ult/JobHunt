import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import loginImg from "../image/Sign up-bro.png";
import { hideLoading, showLoading } from "../Redux/AlertSlice";
import { FaBars, FaTimes } from "react-icons/fa";

function Login() {
  const dispatch = useDispatch();
  const url = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const navHome = () => {
    navigate("/");
  };

  const navRegister = () => {
    navigate("/register");
  };

  const navForgotPassword = () => {
    navigate("/reset-password");
  };

  const login = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(`${url}/api/login`, data);
      dispatch(hideLoading());
      console.log(response.data);

      if (response.data.success) {
        localStorage.setItem("token", response.data.jwtToken);
        toast.success("Login successful!");
        setData({ email: "", password: "" });
        navigate("/home");
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log("Error during login:", error);

      if (error.response && error.response.data.msg) {
        toast.error(error.response.data.msg);
      } else {
        toast.error(
          `An unexpected error occurred: ${error.message || "Unknown error"}`
        );
      }
    }
  };

return (
  <div className="min-h-screen w-screen bg-gradient-to-br from-blue-200 to-purple-400">
    {/* NAVBAR */}
    <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-28 pt-3 pb-2 shadow-md relative">
      <h1 className="font-bold text-2xl text-black">
        Job<span className="text-red-500">Hunt</span>
      </h1>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 text-black mt-2 md:mt-0">
        <li onClick={navHome} className="cursor-pointer">Home</li>
        <li
          onClick={() => {
            navigate("/");
            setTimeout(() => {
              document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
          className="cursor-pointer"
        >
          Jobs
        </li>
        <li
          onClick={() => {
            navigate("/");
            setTimeout(() => {
              document.getElementById("browse")?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
          className="cursor-pointer"
        >
          Browse
        </li>
      </ul>

      {/* Mobile Menu Icon */}
      <div className="md:hidden absolute top-4 right-4">
        <button onClick={() => setShowMenu(!showMenu)}>
          {showMenu ? (
            <FaTimes className="text-2xl text-[#6A38C2]" />
          ) : (
            <FaBars className="text-2xl text-[#6A38C2]" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {showMenu && (
        <ul className="md:hidden flex flex-col items-center bg-white w-full mt-4 space-y-2 text-black py-2 shadow-md z-50">
          <li onClick={() => { navHome(); setShowMenu(false); }} className="cursor-pointer">Home</li>
          <li
            onClick={() => {
              navigate("/");
              setTimeout(() => {
                document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
              setShowMenu(false);
            }}
            className="cursor-pointer"
          >
            Jobs
          </li>
          <li
            onClick={() => {
              navigate("/");
              setTimeout(() => {
                document.getElementById("browse")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
              setShowMenu(false);
            }}
            className="cursor-pointer"
          >
            Browse
          </li>
        </ul>
      )}
    </div>

    {/* MAIN CONTENT */}
 <div className="flex flex-col lg:flex-row items-center justify-center gap-8 px-4 py-10">
  {/* IMAGE - hidden on small screens */}
  <img
    src={loginImg}
    alt="Album"
    className="hidden sm:block w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 object-contain"
  />

  {/* FORM */}
  <div className="text-black text-center">
    <div className="flex flex-col justify-center space-y-6 bg-slate-100 py-12 px-8 sm:px-10 w-full sm:w-[24rem] rounded-md shadow-md">
      <input
        onChange={handleChange}
        type="email"
        name="email"
        value={data.email}
        placeholder="Enter your email"
        className="input input-bordered input-success w-full bg-white"
      />

      <input
        onChange={handleChange}
        type="password"
        name="password"
        value={data.password}
        placeholder="Password"
        className="input input-bordered input-success w-full bg-white"
      />

      <p
        onClick={navForgotPassword}
        className="text-[#6A38C2] underline cursor-pointer"
      >
        Forgot Password?
      </p>

      <p>
        Don't have an account yet?{" "}
        <span
          onClick={navRegister}
          className="text-[#6A38C2] underline cursor-pointer"
        >
          Register
        </span>
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={navRegister}
          className="w-full sm:w-32 py-2.5 bg-[#6A38C2] text-white rounded-full cursor-pointer"
        >
          Register
        </button>
        <button
          onClick={login}
          className="w-full sm:w-32 py-2.5 bg-[#6A38C2] text-white rounded-full cursor-pointer"
        >
          Login
        </button>
      </div>
    </div>
  </div>
</div>

  </div>
);

}

export default Login;
