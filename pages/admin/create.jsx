import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import AccountsList from "../../components/Dashboard/AccountsList";
import AccountsAssistance from "../../components/Dashboard/AccountsAssistance";
import axios from "axios";
import { useRouter } from "next/router";

// import Link from 'next/link';
// import TeachersList from '../../components/Dashboard/TeachersList'

export default function Create() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [assistance, setAssistance] = useState([]);
  const router = useRouter();
  // const [inputValue, setInputValue] = useState("");
  // const [selected, setSelected] = useState("");
  // const [open, setOpen] = useState(false);
  // const [dates, setDates] = useState([]);
  // const [status, setStatus] = useState([]);
  // const [promotion, setPromotion] = useState([]);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [idvalue, setIDvalue] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("2");

  const redirect = () => {
    router.push("/AccessDenied");
  };

  useEffect(() => {
    handleShowAll();
    handleShow();
  }, []);

  const handleShowAll = async () => {
    // pm_id, pm_firstname, pm_lastname, pm_email
    setRole("2");
    let sendpmData = {
      pm_id: "".trim(),
      pm_firstname: "".trim(),
      pm_lastname: "".trim(),
      pm_email: "".trim(),
      pm_status: "active".trim(),
    };

    // id,firstname,lastname,major,promotion,status
    let { data } = await axios.post("/api/admin/adminApi/filterpm", sendpmData);

    // console.log(data);
    setUsers(data);
    // // console.log('this is users')
    // // console.log(users)
    setFname("");
    setLname("");
    setIDvalue("");
    setEmail("");
    setStatus("");
    setRole("active");
  };
  const handleShow = async () => {
    // pm_id, pm_firstname, pm_lastname, pm_email
    let sendData = {
      pm_ass_id: "".trim(),
      pm_ass_firstname: "".trim(),
      pm_ass_lastname: "".trim(),
      pm_ass_email: "".trim(),
      pm_ass_status: "active".trim(),
    };
    // console.log(sendData);
    // id,firstname,lastname,major,promotion,status
    let { data } = await axios.post(
      "/api/admin/adminApi/filterassistance",
      sendData
    );

    // console.log(sendData);
    setAssistance(data.rows);
  };

  const handleAccounts = async (e) => {
    e.preventDefault();
    // // console.log(idvalue, fname, lname, email, courseid)
    if (role == "3") {
      let sendData = {
        pm_ass_id: idvalue.trim(),
        pm_ass_firstname: fname.trim(),
        pm_ass_lastname: lname.trim(),
        pm_ass_email: email.trim(),
        pm_ass_status: status.trim(),
      };
      // console.log(sendData);
      // id,firstname,lastname,major,promotion,status
      let { data } = await axios.post(
        "/api/admin/adminApi/filterassistance",
        sendData
      );

      setAssistance(data.rows);
    } else {
      let sendpmData = {
        pm_id: idvalue.trim(),
        pm_firstname: fname.trim(),
        pm_lastname: lname.trim(),
        pm_email: email.trim(),
        pm_status: status.trim(),
      };
      // // id,firstname,lastname,major,promotion,status
      let { data } = await axios.post(
        "/api/admin/adminApi/filterpm",
        sendpmData
      );

      setUsers(data);
    }
  };

  return (
    <>
      <Head>
        <title>SIS Admin - Accounts</title>
      </Head>

      {session?.user.role === "0" ? (
        <>
          <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">
            List Of Accounts
          </p>
          <form>
            <div className="grid grid-cols-1 gap-4 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">
              <label>
                ID:
                <input
                  className="ml-16 w-40"
                  type="text"
                  name="ID"
                  placeholder="ID"
                  // value={formData.ID}
                  onChange={(e) => {
                    setIDvalue(e.target.value);
                  }}
                ></input>
              </label>

              <label>
                First Name:
                <input
                  className="ml-2 w-40 max-[850px]:ml-1"
                  type="text"
                  name="Fname"
                  placeholder="First Name"
                  // value={formData.Fname}
                  onChange={(e) => {
                    setFname(e.target.value);
                  }}
                ></input>
              </label>

              <label>
                Last Name:
                <input
                  className="ml-1 w-40 max-[850px]:ml-1"
                  type="text"
                  name="Lname"
                  placeholder="Last Name"
                  // value={formData.Lname}
                  onChange={(e) => {
                    setLname(e.target.value);
                  }}
                ></input>
              </label>
              {/* </div>
        <div className="grid lg:grid-cols-3 min-[100px]:gap-4 mb-3"> */}
              <label>
                Email:
                <input
                  className="ml-10 mt-3 w-40 max-[850px]:ml-10 max-[850px]:mt-0"
                  type="email"
                  name="email"
                  placeholder="Email"
                  // value={formData.Fname}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                ></input>
              </label>

              <label className="invisible max-[850px]:visible max-[850px]:hidden">
                From:
                <input
                  className="ml-12 invisible max-[850px]:visible max-[850px]:hidden w-40 max-[850px]:ml-10"
                  type="date"
                  name="from"
                  // value={formData.from}
                  // onChange={handleChange}
                ></input>
              </label>

              <label className="invisible max-[850px]:visible max-[850px]:hidden">
                new:
                <input
                  className="ml-16 w-40 invisible max-[850px]:visible max-[850px]:hidden max-[850px]:ml-[60px]"
                  type="date"
                  name="to"
                  // value={formData.to}
                  // onChange={handleChange}
                ></input>
              </label>
              {/* </div>
        <div className="grid lg:grid-cols-3 min-[100px]:gap-4 mb-3 pb-4  border-blue-300 border-b-2"> */}

              <label>
                Status:
                <select
                  className="ml-9 w-40"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {/* <option value="">Choose Value..</option> */}
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>

              <label className="">
                Role:
                <select
                  className="ml-9 w-40 max-[840px]:ml-[50px]"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option defaultValue="2">Program Manager</option>
                  <option value="3">Assistance</option>
                </select>
              </label>
              <div className="flex flex-col min-[850px]:flex-row gap-4">
                <button
                  className="primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold"
                  type="submit"
                  onClick={handleAccounts}
                >
                  Search
                </button>
                <button
                  className="primary-button btnCol text-white rounded w-60 hover:text-white hover:font-bold"
                  type="reset"
                  onClick={handleShowAll}
                >
                  Show All
                </button>
              </div>
            </div>
            {role == "3" ? (
              <AccountsAssistance
                assistance={assistance}
                setAssistance={setAssistance}
              />
            ) : (
              <AccountsList users={users} setUsers={setUsers} />
            )}
          </form>
        </>
      ) : (
        redirect()
      )}
    </>
  );
}
Create.auth = true;
Create.adminOnly = true;
