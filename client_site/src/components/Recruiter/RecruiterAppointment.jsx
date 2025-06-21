import { Table } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../../Redux/AlertSlice";
import Layout from "../common/Layout";

function RecruiterAppointment() {
  const [docappointments, setDocAppointments] = useState([]);
  const dispatch = useDispatch();

  const navigate = useNavigate();
   const url = import.meta.env.VITE_BACKEND_URL
  const getRecAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        `${url}/api/get-appointments-by-doctor-id`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      dispatch(hideLoading());
      if (response.data.success) {
        setDocAppointments(response.data.data);
        console.log(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const chngAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${url}/api/change-appointment-status`,
        { appointmentId: record._id, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.msg);
        getRecAppointmentsData();
        navigate("/recruiter/appointments");
        console.log(response.data.data);
      }
    } catch (error) {
      toast.error(error.response ? error.response.data.msg : error.msg);
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "_id",
      key: "_id", 
    },
    {
      title: "Job seeker",
      dataIndex: "name",
      key: "name", 
      render: (text, record) => (
        <h1 className="card-text">{record.userInfo.name}</h1>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber", 
      render: (text, record) => (
        <h1 className="card-text">{record.doctorInfo.phoneNumber}</h1>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt", 
      render: (text, record) => (
        <h1 className="card-text">
          {moment(record.date).format("DD-MM-YYYY")}{" "}
          {moment(record.time).format("HH:mm")}
        </h1>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status", 
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <div className="flex space-x-2">
              <h1
                className="anchor underline text-blue-500"
                onClick={() => chngAppointmentStatus(record, "Approved")}
              >
                Approve
              </h1>
              <h1
                className="anchor underline text-red-500"
                onClick={() => chngAppointmentStatus(record, "Rejected")}
              >
                Reject
              </h1>
            </div>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getRecAppointmentsData();
  }, []);

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
        Appointments
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
                        ? "text-green-600 font-bold"
                        : text === "pending"
                        ? "text-yellow-600 font-bold"
                        : text === "blocked"
                        ? "text-red-600 font-bold"
                        : ""
                    }
                  >
                    {text}
                  </span>
                )
              : col.render,
        }))}
        dataSource={docappointments}
        rowKey="_id"
        rowClassName={(record, index) =>
          index % 2 === 0 ? "bg-gray-200" : "bg-white"
        }
        onRow={(record) => ({
          onClick: () => navigate(`/user/${record.userInfo._id}`),
        })}
      />
    </Layout>
  );
}

export default RecruiterAppointment;
