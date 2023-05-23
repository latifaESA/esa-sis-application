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

  const [major, setMajor] = useState([]);
  const [allMajor, setallMajor] = useState([]);
  const [status, setStatus] = useState([]);
  const [promotion, setPromotion] = useState([]);

  const [idValue, setIdValue] = useState('');
  const [firstnameValue, setFirstnameValue] = useState('');
  const [lastnameValue, setLastnameValue] = useState('');
  const [majorValue, setMajorValue] = useState('');
  const [statusValue, setStatusValue] = useState('');
  const [promotionValue, setPromotionValue] = useState('');

  useEffect(() => { 
    const getMajor = async () => { 
      let table = 'major';
      let {data} = await axios.post('http://localhost:3000/api/pmApi/getAll', {table})

      console.log('major')
      console.log(data.rows)
      setallMajor(data.rows)

      const datesArray = [];
      data.rows.forEach((student) => {
        datesArray.push(student.major_name);
      });

      setMajor(datesArray);
      console.log(major,'before')
    }
    getMajor()
    console.log(major,'after')


    const getStatus = async () => { 
      let table = 'status';
      let {data} = await axios.post('http://localhost:3000/api/pmApi/getAll', {table})

      console.log('status')
      console.log(data.rows)
      // setUsers(data)
      // setDates(data.rows)
      // data.rows.forEach(student => 
      //   dates.push(student.student_firstname)
      //   )
      const datesArray = [];
      data.rows.forEach((student) => {
        datesArray.push(student.status_name);
      });

      setStatus(datesArray);
      console.log(status,'before')
    }
    getStatus();

    const getPromotion = async () => { 
      let table = 'student';
      let {data} = await axios.post('http://localhost:3000/api/pmApi/getAll', {table})

      console.log('promo')
      console.log(data.rows)
      // setUsers(data)

      // setDates(data.rows)
      // data.rows.forEach(student => 
      //   dates.push(student.student_firstname)
      //   )
      const datesArray = [];
      data.rows.forEach((student) => {
        datesArray.push(student.promotion);
      });

      setPromotion(datesArray);
      console.log('pro')
      console.log(promotion,'before')
    }
    getPromotion();
  }, [])

  useEffect(() => { 
    handleShowAll()  
  }, [])
  
  const handleShowAll = async () => {
    let sendData = {
      id:'',
      firstname:'',
      lastname:'',
      major:'',
      promotion:'',
      status: ''
    }
    console.log(sendData)
    console.log((sendData))
    // id,firstname,lastname,major,promotion,status
    let {data} = await axios.post('http://localhost:3000/api/pmApi/filterSearch', sendData)
console.log(sendData)
    setUsers(data.rows)
  }

  const handleMajor = (selectedValue) => {
    // Do something with the selected value
    console.log("Selected Value:", selectedValue);
    if(selectedValue.trim() !== ''){
    let majorID = allMajor.filter(major => major.major_name === selectedValue);
    console.log(majorID[0].major_id)
    setMajorValue(majorID[0].major_id)
  }else{
    setMajorValue("")
  }
  };
  const handleStatus = (selectedValue) => {
    // Do something with the selected value
    console.log("Selected Value:", selectedValue);
    setStatusValue(selectedValue)

  };
  const handlePromotion = (selectedValue) => {
    // Do something with the selected value
    console.log("Selected Value:", selectedValue);
    setPromotionValue(selectedValue)
  };

  const handleStudents = async(e) => {
    e.preventDefault()
    console.log(idValue, firstnameValue, lastnameValue, majorValue, statusValue, promotionValue)
    let sendData = {
      id:idValue,
      firstname:firstnameValue,
      lastname:lastnameValue,
      major:majorValue,
      promotion:promotionValue,
      status: statusValue
    }
    console.log(sendData)
    console.log(JSON.stringify(sendData))
    // id,firstname,lastname,major,promotion,status
    let {data} = await axios.post('http://localhost:3000/api/pmApi/filterSearch', sendData)

    console.log(data.rows)
    setUsers(data.rows)
  }


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
              onChange={(e) => setIdValue(e.target.value)}
              placeholder='Select ID'
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
              onChange={(e) => setFirstnameValue(e.target.value)}
              placeholder='Select Name'
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
              onChange={(e) => setLastnameValue(e.target.value)}
              placeholder='Select surname'
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
            options={major}
            placeholder="Select Major"
            onSelect={handleMajor}
            styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-10"}
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
     
          <label className='w-[350px]'>
            Promotion:
            {
              <CustomSelectBox 
              options={promotion}
              placeholder="Select Promotion"
              onSelect={handlePromotion}
              styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-[8px]"}
              />
            }
          </label>

          <label>
            Status:
            {
              <CustomSelectBox 
              options={status}
              placeholder="Select Status"
              onSelect={handleStatus}
              styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-10"}
              />
            }

          </label>
          <div className="flex flex-col min-[850px]:flex-row gap-4">
            <button
              className="primary-button btnCol text-white w-60 hover:text-white hover:font-bold"
              type="submit"
              onClick={handleStudents}
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
        <StudentsList users={users} setUsers={setUsers} />
      </form>
    </>
    </>
  );
}
Students.auth = true;
Students.adminOnly = true;
