import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CustomSelectBox from './customSelectBox';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CourseSchedule from '../../components/Dashboard/Schedule/CourseSchedule';
import { Calender } from './calenderComponent/Calender';


export default function Schedule() {
  const { data: session } = useSession();
  const router = useRouter();
  const [promotion, setPromotion] = useState([]);
  const [major, setMajor] = useState([]);

  const [majorValue, setMajorValue] = useState('');
  const [promotionValue, setPromotionValue] = useState('');

  const handlePromotion = (selectedValue) => {
    // Do something with the selected value
    console.log("Selected Value:", selectedValue);
    setPromotionValue(selectedValue)
  };

  const handleMajor = (selectedValue) => {
    // Do something with the selected value
    console.log("Selected Value:", selectedValue);
    setMajorValue(selectedValue)
  };



  const redirect = () => { 
    router.push('/AccessDenied')
  }
  useEffect(() => { 
    const getMajor = async () => { 
      let table = 'major';
      let {data} = await axios.post('/api/pmApi/getAll', {table})

      const datesArray = [];
      data.rows.forEach((student) => {
        datesArray.push(student.major_name);
      });

      setMajor(datesArray);

    }
    getMajor()


    const getPromotion = async () => { 
      let table = 'promotions';
      let {data} = await axios.post('/api/pmApi/getAll', {table})

      const datesArray = [];
      data.rows.forEach((prom) => {
        datesArray.push(prom.promotion_name);
      });

      setPromotion(datesArray);

    }
    getPromotion();
  }, [])

  return (
    <>
      <Head>
        <title>SIS Admin - Schedule</title>
      </Head>

      {session?.user.role === '2' ? ( <>
        <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Schedule</p>

        <div className='grid lg:grid-cols-1 gap-5 mb-5'>Schedule Table</div>
        <form >
        <div className="grid grid-cols-1 gap-4 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">
     
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

          {/* <label>
            Major:

            <CustomSelectBox 
            options={major}
            placeholder="Select Major"
            onSelect={handleMajor}
            styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-10"}
            />
          </label> */}
        </div>
        {/* <StudentsList users={users} setUsers={setUsers} /> */}
        <div className='grid lg:grid-cols-1 gap-5 mb-5'>
          {/* <CourseSchedule /> */}
          <Calender />
        </div>
      </form>

      </>): redirect()}
    </>
  );
}
Schedule.auth = true;
Schedule.adminOnly = true;
