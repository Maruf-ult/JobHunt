import { Col, DatePicker, Row, TimePicker } from "antd";
import axios from "axios";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { hideLoading,showLoading } from "../../Redux/AlertSlice";
import Layout from "../common/Layout";
import bookingImg from "/src/image/Online calendar-bro.png";

function BookAppointment() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const dispatch = useDispatch();
  const [recruiter, setRecruiter] = useState(null);
  const url = import.meta.env.VITE_BACKEND_URL

  const navigate = useNavigate();

  const getRecData = useCallback(async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${url}/api/get-doctor-info-by-id`,
        {
          doctorId: params.doctorId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setRecruiter(response.data.data);
      } else {
        setRecruiter({});
      }
    } catch (error) {
      toast.error("Error fetching data. Please try again later.");
      dispatch(hideLoading());
      console.error("Error: ", error);
    }
  }, [dispatch, params.doctorId]);

  const bookAppointment = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        `${url}/api/book-appointment`,
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: recruiter,
          userInfo: user,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.msg);
        navigate("/appointments");
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      toast.error("Error booking appointment. Please try again later.");
      dispatch(hideLoading());
      console.error("Error: ", error);
    }
  };

  const checkAvailability = async () => {
    try {
      if (!date || !time) {
        toast.error("Please select both date and time for the appointment.");
        return;
      }

      dispatch(showLoading());

      // Format date and time values
      const formattedDate =
        date && date.format ? date.format("DD-MM-YYYY") : null;
      const formattedTime = time && time.format ? time.format("HH:mm") : null;

      // Ensure formattedDate and formattedTime are valid
      if (!formattedDate || !formattedTime || formattedTime === "00:00") {
        toast.error("Please select valid date and time.");
        dispatch(hideLoading());
        return;
      }

      // Convert time to ISO format
      const isoTime = moment(formattedTime, "HH:mm").toISOString();

      console.log("Formatted Date:", formattedDate);
      console.log("Formatted Time (ISO):", isoTime);

      const response = await axios.post(
        `${url}/api/check-booking-availability`,
        {
          doctorId: params.doctorId,
          date: formattedDate,
          time: isoTime,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      console.log(response.data.msg);
      if (response.data.success) {
        toast.success(response.data.msg);
        setIsAvailable(true);
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      toast.error("Error checking appointment. Please try again later.");
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.doctorId) {
      getRecData();
    }
  }, [getRecData, params.doctorId]);

  return (
    <Layout>
      <div className="text-black">
        {recruiter && (
          <>
            <h1 className="font-bold text-xl">
              {recruiter.firstName} {recruiter.lastName}
            </h1>
            <hr className="border mt-3 mb-3 border-slate-300" />

            <Row
              gutter={20}
              className="mt-5 space-y-5 flex justify-center space-x-5"
            >
              <Col span={8} sm={24} sx={24} lg={8}>
                <img src={bookingImg} alt="" />
              </Col>

              <Col span={8} sm={24} sx={24} lg={8}>
                <p className="mt-3 pl-2">
                  <b>Phone Number:</b> {recruiter.phoneNumber}
                </p>
                <p className="mt-3 pl-2">
                  <b>Address:</b> {recruiter.address}
                </p>
                <p className="mt-3 pl-2">
                  <b>Fee per Visit:</b> {recruiter.feePerConsultation}
                </p>
                <h1 className="mt-3 pl-2">
                  <b>Timings:</b>{" "}
                  {moment(recruiter.timings[0], "HH:mm").format("HH:mm")} -{" "}
                  {moment(recruiter.timings[1], "HH:mm").format("HH:mm")}
                </h1>

                <div className="flex flex-col mt-2 p-2">
                  <DatePicker
                    format={"DD-MM-YYYY"}
                    onChange={(value) => {
                      setIsAvailable(false);
                      console.log("DatePicker Value:", value);
                      setDate(value);
                    }}
                  />
                  <TimePicker
                    format="HH:mm"
                    className="mt-3"
                    onChange={(value) => {
                      setIsAvailable(false);
                      console.log("TimePicker Value:", value);
                      setTime(value);
                    }}
                    onOk={(value) => {
                      console.log("TimePicker OK Value:", value);
                      setTime(value);
                    }}
                  />
                  <button
                    onClick={checkAvailability}
                    className="btn bg-slate-400 text-black mt-3 w-full"
                  >
                    Check Availability
                  </button>
                  {isAvailable && (
                    <button
                      onClick={bookAppointment}
                      className="btn bg-slate-400 text-black mt-3 w-full"
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </Col>
            </Row>
          </>
        )}
      </div>
    </Layout>
  );
}

export default BookAppointment;
