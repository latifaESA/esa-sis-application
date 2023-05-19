import { useSession } from 'next-auth/react';
import Head from 'next/head';
import StudentsList from '../../components/Dashboard/StudentsList';
import { useEffect, useState } from 'react';

import axios from 'axios'
import { x64 } from 'crypto-js';


import CustomSelectBox from "./customSelectBox";


export default function Students() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);

  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
  const [dates, setDates] = useState([]);
  const [status, setStatus] = useState([]);
  const [promotion, setPromotion] = useState([]);
  // let dates = []

  useEffect(() => { 
    const getStudentd = async () => { 
      let student = 'major';
      let {data} = await axios.post('http://localhost:3000/api/testapi/api', {student})

      console.log('data')
      console.log(data)
      setUsers(data)
      // setDates(data.rows)
      // data.rows.forEach(student => 
      //   dates.push(student.student_firstname)
      //   )
      const datesArray = [];
      data.forEach((student) => {
        datesArray.push(student.major_name);
      });

      setDates(datesArray);
      console.log(dates,'before')
    }
    getStudentd()
    console.log(dates,'after')


    const getStatus = async () => { 
      let student = 'status';
      let {data} = await axios.post('http://localhost:3000/api/testapi/api', {student})

      console.log('status')
      console.log(data)
      // setUsers(data)
      // setDates(data.rows)
      // data.rows.forEach(student => 
      //   dates.push(student.student_firstname)
      //   )
      const datesArray = [];
      data.forEach((student) => {
        datesArray.push(student.status_name);
      });

      setStatus(datesArray);
      console.log(status,'before')
    }
    getStatus();

    const getPromotion = async () => { 
      let student = 'student';
      let {data} = await axios.post('http://localhost:3000/api/testapi/api', {student})

      console.log('promo')
      console.log(data)
      // setUsers(data)
      // setDates(data.rows)
      // data.rows.forEach(student => 
      //   dates.push(student.student_firstname)
      //   )
      const datesArray = [];
      data.forEach((student) => {
        datesArray.push(student.promotion);
      });

      setPromotion(datesArray);
      console.log('pro')
      console.log(promotion,'before')
    }
    getPromotion();
  }, [])

  const handleSelect = (selectedValue) => {
    // Do something with the selected value
    console.log("Selected Value:", selectedValue);
  };

//>>>>>>> main
  return (
    <>
      <Head>
        <title>SIS Admin - Students</title>
      </Head>
      <>
      <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">List Of Students</p>
      <form >
        <div className="grid grid-cols-1 gap-4 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">
          <label>
            ID:
            <input
              className="ml-16 w-40"
              type="number"
              name="ID"
              // value={formData.ID}
              // onChange={handleChange}
            ></input>
          </label>

          <label>
            First Name:
            <input
              className="ml-2 w-40 max-[850px]:ml-1"
              type="text"
              name="Fname"
              // value={formData.Fname}
              // onChange={handleChange}
            ></input>
          </label>

          <label>
            Last Name:
            <input
              className="ml-1 w-40 max-[850px]:ml-1"
              type="text"
              name="Lname"
              // value={formData.Lname}
              // onChange={handleChange}
            ></input>
          </label>
          {/* </div>
        <div className="grid lg:grid-cols-3 min-[100px]:gap-4 mb-3"> */}
          <label>
            Major:

              {/* Start select box */}
            <CustomSelectBox 
            options={dates}
            placeholder="select name"
            onSelect={handleSelect}
            />
          </label>


          <label className='invisible max-[850px]:visible max-[850px]:hidden'>
            From:
            <input
              className="ml-12 invisible max-[850px]:visible max-[850px]:hidden w-40 max-[850px]:ml-10"
              type="date"
              name="from"
              // value={formData.from}
              // onChange={handleChange}
            ></input>
          </label>

          <label className='invisible max-[850px]:visible max-[850px]:hidden'>
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
            Promotion:
            {
              <CustomSelectBox 
              options={promotion}
              placeholder="select promotion"
              onSelect={handleSelect}
              />
            }
          </label>

          <label>
            Status:
            {
              <CustomSelectBox 
              options={status}
              placeholder="select status"
              onSelect={handleSelect}
              />
            }

          </label>
          <div className="flex flex-col min-[850px]:flex-row gap-4">
            <button
              className="primary-button w-60 hover:text-white hover:font-bold"
              type="submit"
            >
              Search
            </button>
            <button
              className="primary-button  w-60 hover:text-white hover:font-bold"
              type="button"
              // onClick={handleShowAll}
            >
              Show All
            </button>
          </div>
        </div>
        {/* <StudentsList users={users} setUsers={setUsers} /> */}
      </form>
    </>
    </>
  );
}
Students.auth = true;
Students.adminOnly = true;
