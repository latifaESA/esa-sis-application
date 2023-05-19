import { useSession } from 'next-auth/react';
import Head from 'next/head';
import StudentsList from '../../components/Dashboard/StudentsList';
import { useEffect, useState } from 'react';
import axios from 'axios';
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
      console.log(data)
      setallMajor(data)

      const datesArray = [];
      data.forEach((student) => {
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
      let table = 'student';
      let {data} = await axios.post('http://localhost:3000/api/pmApi/getAll', {table})

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

  const handleStudents = async() => {
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

    console.log(data)
    setUsers(data)
  }


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
            placeholder="select name"
            onSelect={handleMajor}
            />
          </label>

            {/* <select
              className="ml-10 w-40 max-[850px]:ml-9"
              name="major"
              // value={formData.major}
              // onChange={handleChange}
            >
              {/* {majorlist.map((major, index) => (
                <option className="text-black" key={index}>
                  {major.program}
                </option>
              ))} */}
            {/* </select> */}

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
     
          <label className='flex'>
            Promotion:
            {
              <CustomSelectBox 
              options={promotion}
              placeholder="select promotion"
              onSelect={handlePromotion}
              />
            }
          </label>

          <label>
            Status:
            {
              <CustomSelectBox 
              options={status}
              placeholder="select status"
              onSelect={handleStatus}
              />
            }

          </label>
          <div className="flex flex-col min-[850px]:flex-row gap-4">
            <button
              className="primary-button w-60 hover:text-white hover:font-bold"
              type="button"
              onClick={handleStudents}
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
        <StudentsList users={users} setUsers={setUsers} />
      </form>
    </>
    </>
  );
}
Students.auth = true;
Students.adminOnly = true;
