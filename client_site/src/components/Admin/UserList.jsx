import { Table } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../../Redux/AlertSlice";
import Layout from "../common/Layout";
function UserList() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const url = import.meta.env.VITE_BACKEND_URL

  const navigate = useNavigate();

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
        setUsers(response.data.data);
        console.log(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const columns = [
    {
      title: "Profile",
      dataIndex: "profile",
      render: (text, record) => (
        <div className="flex items-center">
          <img
            src={`${url}/${record.image?.split("\\").pop()}`}
            alt=""
            className="w-10 h-10 rounded-full mr-2"
          />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text, record) => moment(record.createdAt).format("DD-MM-YYYY"),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <h1 className="anchor underline text-red-500">Block</h1>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div>
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
          User List
        </h2>
        <Table
          className="cursor-pointer mt-3"
          columns={columns.map((col) => ({
            ...col,
            render:
              col.dataIndex === "status"
                ? (text) => (
                    <span
                      className={
                        text === "approved"
                          ? "text-green-600"
                          : text === "pending"
                          ? "text-yellow-600"
                          : text === "blocked"
                          ? "text-red-600"
                          : ""
                      }
                    >
                      {text}
                    </span>
                  )
                : col.render,
          }))}
          dataSource={users}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "bg-gray-200" : "bg-white"
          }
          onRow={(record) => ({
            onClick: () => navigate(`/user/${record._id}`),
          })}
        />
      </div>
    </Layout>
  );
}

export default UserList;
