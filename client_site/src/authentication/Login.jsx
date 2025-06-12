import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import loginImg from "../image/Sign up-bro.png";
import { hideLoading, showLoading } from "../Redux/AlertSlice";

function Login() {
  const dispatch = useDispatch();
  const url = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate();
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
    <div className="h-screen w-screen  bg-gradient-to-br from-blue-200 to-purple-400">
      <div className="flex justify-start pl-28 pt-3 space-x-96 pb-2 shadow-md">
        <h1 className="font-bold text-2xl pb-2 text-black">
          Job<span className="text-red-500">Hunt</span>
        </h1>
        <ul className="flex justify-end pl-80 space-x-6 text-black">
          <li onClick={navHome} className="cursor-pointer">
            Home
          </li>
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
      </div>

      <div className="flex ml-16">
        <img src={loginImg} alt="Album" className="mt-3 ml-36 w-96 h-96" />

        <div className="text-black text-center pt-14 pl-36 space-y-4">
          <div className="flex flex-col justify-center space-y-6 bg-slate-100 py-12 px-10 w-96 rounded-md shadow-md">
            <input
              onChange={handleChange}
              type="email"
              name="email"
              value={data.email}
              placeholder="Enter your email"
              className="input input-bordered input-success w-full max-w-xs bg-white"
            />

            <input
              onChange={handleChange}
              type="password"
              name="password"
              value={data.password}
              placeholder="Password"
              className="input input-bordered input-success w-full max-w-xs bg-white"
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

            <div className="flex justify-center space-x-7">
              <button
                onClick={navRegister}
                className="w-32 py-2.5 bg-[#6A38C2] text-white rounded-full cursor-pointer"
              >
                Register
              </button>
              <button
                onClick={login}
                className="w-32 py-2.5 bg-[#6A38C2] text-white rounded-full cursor-pointer"
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
