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
  const [fname, setFname] = useState("")
  const [lname, setLname] = useState("")
  const [id, setID] = useState()
  const [email, setEmail] = useState()
  const [courseid, setCourseid] = useState()
  // let dates = []

  useEffect(() => { 
    
    
  }, [])

  const handlefname = (fname) => { 
    console.log(fname)
  }
  const handlelname = (lname) => { 
    console.log(lname)
  }
  const handleID = (id) => { 
    console.log(id)
  }
  const handleEmail = (email) => { 
    console.log(email)
  }
  const handleCourseid = (courseid) => { 
    console.log(courseid)
  }

//>>>>>>> main
  return (
    <>
      <Head>
        <title>SIS Admin - Teachers</title>
      </Head>
      <>
      <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">List Of Teachers</p>
      <form >
        <div className="grid grid-cols-1 gap-4 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">
          <label>
            ID:
            <input
              className="ml-16 w-40"
              type="number"
              name="ID"
              placeholder="Teacher's ID"
              // value={formData.ID}
              onChange={(e) => { 
                setID(e.target.value)
                handleID(e.target.value)

              }}
            ></input>
          </label>

          <label>
            First Name:
            <input
              className="ml-2 w-40 max-[850px]:ml-1"
              type="text"
              name="Fname"
              placeholder="Teacher's First Name"
              // value={formData.Fname}
              onChange={(e) => { 
                setFname(e.target.value)
                handlefname(e.target.value)

              }}
            ></input>
          </label>

          <label>
            Last Name:
            <input
              className="ml-1 w-40 max-[850px]:ml-1"
              type="text"
              name="Lname"
              placeholder="Teacher's Last Name"
              // value={formData.Lname}
              onChange={(e) => { 
                setLname(e.target.value)
                handlelname(e.target.value)

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
              placeholder='Enter Email'
              // value={formData.Fname}
              onChange={(e) => { 
                setEmail(e.target.value)
                handleEmail(e.target.value)

              }}
            ></input>
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
            Course ID:
            <input
              className="ml-3 w-40 max-[850px]:ml-2"
              type="text"
              name="course-id"
              placeholder='Enter Course ID'
              // value={formData.Fname}
              onChange={(e) => { 
                setCourseid(e.target.value)
                handleCourseid(e.target.value)

              }}
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
          <div className="flex flex-col min-[850px]:flex-row gap-4">
            <button
              className="primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold"
              type="submit"
            >
              Search
            </button>
            <button
              className="primary-button btnCol text-white rounded w-60 hover:text-white hover:font-bold"
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
