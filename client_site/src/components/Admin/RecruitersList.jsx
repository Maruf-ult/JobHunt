import { Table } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../../Redux/AlertSlice";
import Layout from "../common/Layout";

function RecruitersList() {
  const [docs, setDocs] = useState([]);
  const dispatch = useDispatch();
   const url = import.meta.env.VITE_BACKEND_URL

  const navigate = useNavigate();

  const getDocData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`${url}/api/get-all-docs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setDocs(response.data.data);
        console.log(response.data.data);
      }
    } catch (error) {
      toast.error(
        error.response ? error.response.data.msg : "Error fetching doctors."
      );
      dispatch(hideLoading());
      console.error(error);
    }
  };

  const chngRecStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${url}/api/change-doc-status`,
        { doctorId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.msg);
        getDocData();
        if (status === "approved") {
          navigate(`/recruiters`);
        }
      }
    } catch (error) {
      toast.error(
        error.response ? error.response.data.msg : "Error updating status."
      );
      dispatch(hideLoading());
      console.error(error);
    }
  };

  useEffect(() => {
    getDocData();
  }, []);

  const columns = [
    {
      title: "Profile",
      dataIndex: "profile",
      render: (text, record) => (
        <div className="flex items-center">
          <img
            src={`http://localhost:4000/${record.image?.split("\\").pop()}`}
            alt={record.firstName}
            className="w-10 h-10 rounded-full mr-2"
          />
          <span>
            {record.firstName} {record.lastName}
          </span>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text, record) => moment(record.createdAt).format("DD-MM-YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="flex space-x-4">
          {record.status === "pending" && (
            <button
              className="text-blue-600"
              onClick={() => chngRecStatus(record, "approved")}
            >
              Approve
            </button>
          )}
          {record.status === "approved" && (
            <button
              className="text-red-600"
              onClick={() => chngRecStatus(record, "blocked")}
            >
              Block
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
       <h2
  className="font-bold text-black pl-10"
  style={{
    position: "fixed",
    top: "12px", // adjust vertical position to header height
    left: "180px", // adjust horizontal position beside JobHunt text
    zIndex: 9999,
    backgroundColor: "white", // to cover what's behind if needed
    padding: "0 6px",
  }}
>
        Recruiters
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
                        ? "text-green-600 "
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
        dataSource={docs}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "bg-gray-200" : "bg-white"
        }
        onRow={(record) => ({
          onClick: () => navigate(`/recruiter/${record._id}`),
        })}
      />
    </Layout>
  );
}

export default RecruitersList;
