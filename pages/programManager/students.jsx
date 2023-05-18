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
//<<<<<<< Hassan

//  const [status, setStatus] = useState([])
//  const [major, setMajor] = useState([])
//  const [promotion, setPromotion] = useState([])


//  useEffect(() => { 

 //   let dataStatus = []
 //   const getstatus = async () => { 
 //     let student = 'status';
 //     let data = await axios.post('http://localhost:3000/api/testapi/api', {student})

 //     setStatus(data.data)
 //     console.log(status)
     
  //  }
  //  const getMajor = async () => { 
  //    let student = 'major';
  //    let data = await axios.post('http://localhost:3000/api/testapi/api', {student})

 //     setMajor(data.data)
 //   }
    
 //   const getPromotion = async () => { 
 //     let student = 'student';
 //     let data = await axios.post('http://localhost:3000/api/testapi/api', {student})

//      setPromotion(data.data)
     
//    }
//    getPromotion() 
//    getMajor() 
//    getstatus() 
//  }, [])
//
//    const handleStatus = () =>{}
 
//=======
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
  const [dates, setDates] = useState([]);
  // let dates = []

  useEffect(() => { 
    const getStudentd = async () => { 
      let student = 'student';
      let {data} = await axios.post('http://localhost:3000/api/testapi/api', {student})

      console.log(data.rows)
      setUsers(data.rows)
      // setDates(data.rows)
      // data.rows.forEach(student => 
      //   dates.push(student.student_firstname)
      //   )
      const datesArray = [];
      data.rows.forEach((student) => {
        datesArray.push(student.student_firstname);
      });

      setDates(datesArray);
      console.log(dates,'before')
    }
    getStudentd()
    console.log(dates,'after')
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
      {/* End select box */}
          </label>

            {/* <select
              className="ml-10 w-40 max-[850px]:ml-9"
              name="major"
              // value={formData.major}
              // onChange={handleChange}
            >

              <option value=''>
                  Choose a Major...
                  </option>
             {major.map(item => {
                return (<option key={item.major_id} value={item.major_id}>
                  {item.major_name}
                  </option>);
            })}
            </select>
          </label>

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
     
          <label>
            Promotion:
            <select
              className="ml-2 w-40 max-[850px]:ml-1"
              name="promotion"
              // value={formData.promotion}
              // onChange={handleChange}
            >
              <option value=''>
                  Choose Promotion...
                  </option>
              {promotion.map(item => {
                return (<option key={item.student_id} value={item.student_id}>
                  {item.promotion}
                  </option>);
            })}
            </select>
          </label>

          <label>
            Status:
            <input type='text' list="status"
              className="ml-10 w-40 max-[850px]:ml-9"
              placeholder='Choose a value'
              name="status"
              // value={formData.status}
              // onChange={handleStatus}
            />
              <datalist id='status'>
              
              
              {status.map(item => {
                return (<option key={item.status_id} value={item.status_name}>
                  {item.status_name}
                  </option>);
            })}
            </datalist>
           
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
        <StudentsList users={users} setUsers={setUsers} />
      </form>
    </>
    </>
  );
}
Students.auth = true;
Students.adminOnly = true;
