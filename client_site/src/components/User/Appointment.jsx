import { Table } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/AlertSlice";
import Layout from "../common/Layout";

function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
   const url = import.meta.env.VITE_BACKEND_URL

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        `${url}/api/get-appointments-by-user-id`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointmentsData();
  }, []);

  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "_id",
    },
    {
      title: "Recruiter",
      dataIndex: "name",
      render: (text, record) => (
        <h1 className="card-text">
          {record.doctorInfo.firstName} {record.doctorInfo.lastName}
        </h1>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => (
        <h1 className="card-text">{record.doctorInfo.phoneNumber}</h1>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
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
      render: (text) => (
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
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="font-bold text-black pl-3 absolute top-3 mt-3">
        Appointments
      </h1>
      <Table
        className="cursor-pointer mt-3"
        columns={columns}
        dataSource={appointments}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "bg-gray-200" : "bg-white"
        }
      />
    </Layout>
  );
}

export default Appointment;
