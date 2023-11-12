import { useSession } from 'next-auth/react';
import Head from 'next/head';
import RequestList from '../../components/Dashboard/RequestList';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import axios from 'axios';
// import { x64 } from 'crypto-js';

import CustomSelectBox from './customSelectBox';
// import Link from 'next/link';

export default function requests() {
  const [users, setUsers] = useState([]);
  const [reqId, setReqId] = useState('');
  const [stId, setStid] = useState('');
  const [stMail, setMail] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const redirect = () => {
    router.push('/AccessDenied');
  };
  const handleSearch = async () => {
    try {
      let sendData = {
        pm_id: session?.user.userid,
        req_id: reqId,
        student_id: stId.trim(),
        student_email: stMail.trim(),
        status: status.trim(),
        type: type.trim(),
      };
      let data = await axios.post('/api/pmApi/getRequests', sendData);
      console.log('asdasd', data);
      setUsers(data.data.rows);
    } catch (err) {
      console.log(err);
    }
  };
  const handleShowAll = async () => {
    try {
      let sendData = {
        pm_id: session?.user.userid,
        req_id: '',
        student_id: '',
        student_email: '',
        status: '',
        type: '',
      };
      setReqId('');
      setStid('');
      setMail('');
      setStatus('');
      setType('');
      let res = await axios.post('/api/pmApi/getRequests', sendData);
      console.log('res', res);
      setUsers(res.data.rows);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleShowAll();
  }, []);
  return (
    <>
      <Head>
        <title>SIS Admin - Requests</title>
      </Head>
      {session?.user.role === '2' || session?.user.role === '3' ? (
        <>
          <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">
            List Of Requests
          </p>
          <form>
            <div className="grid grid-cols-1 gap-4 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">
              <label>
                ID:
                <input
                  className="ml-16 w-40"
                  type="number"
                  name="ID"
                  onChange={(e) => setReqId(e.target.value)}
                  placeholder="Select Request ID"
                  // value={formData.ID}
                  // onChange={handleChange}
                ></input>
              </label>

              <label>
                Student ID:
                <input
                  className="ml-2 w-40 max-[850px]:ml-1"
                  type="text"
                  name="Fname"
                  onChange={(e) => setStid(e.target.value)}
                  placeholder="Student ID"
                  // value={formData.Fname}
                  // onChange={handleChange}
                ></input>
              </label>

              <label>
                Email:
                <input
                  className="ml-1 w-40 max-[850px]:ml-1"
                  type="text"
                  name="Lname"
                  onChange={(e) => setMail(e.target.value)}
                  placeholder="Student Email"
                  // value={formData.Lname}
                  // onChange={handleChange}
                ></input>
              </label>
              {/* </div>
        <div className="grid lg:grid-cols-3 min-[100px]:gap-4 mb-3"> */}
              <label className="invisible max-[850px]:visible max-[850px]:hidden">
                Major:
                {/* Start select box */}
                <CustomSelectBox
                  className="ml-12 invisible max-[850px]:visible max-[850px]:hidden w-40 max-[850px]:ml-10"
                  // options={major}
                  placeholder="Select Major"
                  //   onSelect={handleMajor}
                  styled={
                    'font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-10'
                  }
                />
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
                To:
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
                  onChange={(e) => setStatus(e.target.value)}
                  //   value={majorValue}
                  className="ml-10 mt-3 w-40 max-[850px]:ml-10 max-[850px]:mt-0"
                >
                  <option value="">Choose a Status</option>
                  <option value="pending">pending</option>
                  <option value="sent">sent</option>
                </select>
              </label>
              <label>
                Type:
                <select
                  onChange={(e) => setType(e.target.value)}
                  //   value={majorValue}
                  className="ml-10 mt-3 w-40 max-[850px]:ml-10 max-[850px]:mt-0"
                >
                  <option value="">Choose a type</option>
                  <option value="transcript">transcript</option>
                  <option value="visa">visa</option>
                </select>
              </label>
              <div className="flex flex-col min-[850px]:flex-row gap-4">
                <button
                  className="primary-button btnCol text-white w-60 hover:text-white hover:font-bold"
                  type="button"
                  onClick={handleSearch}
                >
                  Search
                </button>
                <button
                  className="primary-button btnCol text-white  w-60 hover:text-white hover:font-bold"
                  type="reset"
                  onClick={handleShowAll}
                >
                  Show All
                </button>
              </div>
            </div>
            <RequestList users={users} setUsers={setUsers} />
          </form>
        </>
      ) : (
        redirect()
      )}
    </>
  );
}
requests.auth = true;
requests.adminOnly = true;
