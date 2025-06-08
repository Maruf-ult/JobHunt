import { Tabs } from "antd";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading,hideLoading } from "../../Redux/AlertSlice.jsx";
import { setUser } from "../../Redux/userSlice.jsx";
import Layout from "./Layout.jsx";

function Navigate() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const url = "http://localhost:4000";

  useEffect(() => {}, []);

  const markAllAsSeen = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${url}/api/mark-all-notif-as-seen`,
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.msg);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error(error.response ? error.response.data.msg : error.msg);
    }
  };

  const deleteAll = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${url}/api/delete-all-notif`,
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.msg);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error(error.response ? error.response.data.msg : error.msg);
    }
  };

  return (
    <>
      <Layout>
         <h1 className="font-bold text-black pl-3 absolute top-3 mt-3">
          Notifications
      </h1>
        <Tabs className="pl-3  font-semibold">
          <Tabs.TabPane tab="unseen" key="0">
            <div className="flex justify-end pr-5 ">
              <h1
                onClick={() => markAllAsSeen()}
                className="underline font-semibold cursor-pointer"
              >
                Mark all as seen
              </h1>
            </div>

            {user?.unseenNotifications?.map((notification, index) => (
              <div
                key={index}
                onClick={() => navigate(notification.onclickPath)}
                className="bg-white p-5 mr-5 rounded-sm cursor-pointer mt-2"
              >
                {notification.message}
              </div>
            ))}
          </Tabs.TabPane>
          <Tabs.TabPane tab="seen" key="1">
            <div className="flex justify-end pr-5 ">
              <h1
                onClick={() => deleteAll()}
                className="underline font-semibold cursor-pointer"
              >
                Delete all
              </h1>
            </div>
            {user?.seenNotifications?.map((notification, index) => (
              <div
                key={index}
                onClick={() => navigate(notification.onclickPath)}
                className="bg-white p-5 mr-5 rounded-sm cursor-pointer mt-2"
              >
                {notification.message}
              </div>
            ))}
          </Tabs.TabPane>
        </Tabs>
      </Layout>
    </>
  );
}

export default Navigate;
