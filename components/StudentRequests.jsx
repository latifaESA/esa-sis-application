import React, { useEffect, useState, useRef } from "react";
// import EmailForSendingRequest from "../utilities/emailing/emailForSendingRequest";
import { useDispatch } from "react-redux";
import axios from "axios";
// import emailRequestTranscript from "../pages/api/user/emailRequestTranscript";
import Loader from "./Loader/Loader";

import { useSession } from "next-auth/react";

const StudentRequests = () => {
  const { data: session } = useSession();

  const [semester, setSemester] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [reason, setReason] = useState("");
  const [major, setMajor] = useState("");
  const [stEmail, setStEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [gpa, setGpa] = useState("Included");
  const [isLoading, setIsLoading] = useState(false);
  const [pm_firstName, setPm_firstName] = useState("");
  const [pm_lastname, setPm_lastname] = useState("");
  const [pm_email, setPm_email] = useState("");
  // console.log(session?.user);
  const getStudent = async () => {
    let sendData = {
      student_id: session?.user.userid,
    };
    try {
      const res = await axios.post(
        "/api/user/studentForRequestTranscript",
        sendData
      );
      // setGpa(res.data.rows[0].gpa);
      console.log(res);
      setMajor(res.data.rows[0].major_name);
      // console.log(typeof res.data.rows[0].gpa);
      setStEmail(res.data.rows[0].email);
    } catch (error) {
      console.log(error);
    }
  };
  const getPM = async () => {
    let sendData = {
      major_id: session?.user.majorid,
    };
    try {
      const res = await axios.post(
        "/api/user/getPmDetailsForRequests",
        sendData
      );
      setPm_firstName(res.data.rows[0].pm_firstname);
      setPm_lastname(res.data.rows[0].pm_lastname);
      setPm_email(res.data.rows[0].pm_email);
      console.log("asdfwq", res.data.rows[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStudent();
    getPM();
  }, []);

  const radioRef = useRef(null);
  const radioRef2 = useRef(null);

  console.log(session?.user.promotion);
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log({
    //   semester,
    //   academicYear,
    //   reason,
    //   student_id: session?.user.userid,
    //   major,
    //   student_name: session?.user.name,
    //   student_email: stEmail,
    //   gpa,
    // });
    if (session?.user.majorid == 10 && semester === "") {
      setMessage("All Fields Must be Filled !");
      setMessageClass("text-red-500");
      setIsLoading(false);
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
    if (reason === "") {
      setMessage("All Fields Must be Filled !");
      setMessageClass("text-red-500");
      setIsLoading(false);
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } else {
      try {
        let sendData = {
          semester,
          academicYear,
          reason,
          student_id: session?.user.userid,
          major,
          student_name: session?.user.name,
          student_email: stEmail,
          gpa,
          promotion: session?.user.promotion,
          pm_firstName,
          pm_lastname,
          pm_email,
        };
        console.log(sendData);
        let res = await axios.post("/api/admin/adminApi/sendReqToPM", sendData);
        setMessage("Request Sent !");
        setMessageClass("text-green-500");
        setReason(""), setSemester(""), setAcademicYear("");
        setTimeout(() => {
          setMessage("");
        }, 5000);
        if (res) {
          setIsLoading(false);
        }
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleRadioClick = (e) => {
    if (radioRef.current) {
      radioRef.current.blur();
    }
    if (radioRef2.current) {
      radioRef2.current.blur();
    }
  };
  return (
    <div>
      <div className="flex  justify-center mt-32 ">
        <p className={`absolute mt-[-100px] ${messageClass}`}>{message}</p>
        <form onSubmit={submitHandler}>
          <div>
            {" "}
            {session?.user.majorid == 11 && (
              <label>
                Semester:
                <input
                  type="text"
                  placeholder="ex: Fall"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="ml-2 mt-3 mb-10 w-40 max-[850px]:ml-10 max-[850px]:mt-0"
                />
              </label>
            )}
            <div className="flex">
              <div className="flex items-center mb-4">
                <input
                  type="radio"
                  value="Included"
                  name="gpa-radio"
                  className="w-4 h-4 focus:ring-0  "
                  ref={radioRef}
                  style={{
                    outline: "none",
                    WebkitTapHighlightColor: "transparent",
                  }}
                  onClick={handleRadioClick}
                  onChange={(e) => setGpa(e.target.value)}
                />
                <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Include GPA
                </label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="radio"
                  value="Execluded"
                  ref={radioRef2}
                  onClick={handleRadioClick}
                  name="gpa-radio"
                  onChange={(e) => setGpa(e.target.value)}
                  className="w-4 h-4  "
                />
                <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Execlude GPA
                </label>
              </div>
            </div>
            {/* <label className="ml-5">
              Academic Year:
              <input
                type="number"
                placeholder="ex: 2023"
                value={academicYear}
                className="ml-2 mt-3 w-40 max-[850px]:ml-10 max-[850px]:mt-0"
                onChange={(e) => setAcademicYear(e.target.value)}
              />
            </label> */}
            <div className="mt-10">
              <label className="block">Reason</label>
              <textarea
                className="mt-5 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                rows="6"
                name="ID"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                // required={true}
                placeholder="Enter the Reason"
              />
            </div>
            <div className="flex mt-5 flex-row min-[850px]:flex-row gap-4">
              <button
                className="primary-button text-center flex rounded w-60 btnCol text-white hover:text-white hover:font-bold"
                type="submit"
                disabled={isLoading}
              >
                <p className="mr-2">{isLoading ? "Sending..." : "Send"}</p>
                {isLoading && <Loader />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentRequests;
