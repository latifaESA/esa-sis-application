import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
// import CustomSelectBox from "./customSelectBox";
import { useEffect, useState } from "react";
import axios from "axios";
// import CourseSchedule from '../../components/Dashboard/Schedule/CourseSchedule';
import { Calender } from "../../components/calenderComponent/Calender";

export default function Schedule() {
  const { data: session } = useSession();
  const router = useRouter();
  const [promotion, setPromotion] = useState([]);
  // const [promotionSchedule, setPromotionSchedule] = useState('');
  const redirect = () => {
    router.push("/AccessDenied");
  };
  useEffect(() => {
    const getMajor = async () => {
      let table = "major";
      let { data } = await axios.post("/api/pmApi/getAll", { table });

      const datesArray = [];
      data.rows.forEach((student) => {
        datesArray.push(student.major_name);
      });

      // setMajor(datesArray);
    };
    getMajor();

   
    getPromotion();
  }, []);
  const getPromotion = async () => {
    let table = "promotions";
    let Where = "major_id";
    let id = session.user.majorid
    let { data } = await axios.post("/api/pmApi/getAllCourses", { table , Where , id });
 
    console.log(data.data, "asdasdads");

    const datesArray = [];
    data.data.forEach((prom) => {
      datesArray.push(prom.promotion_name);
    });

    setPromotion(datesArray);
   
  };
  
  const handlePromotion = async (event) => {
  try {
    const payload = {
      promotion_name: event,
      major_id : session.user.majorid
    }
     await axios.post('/api/pmApi/filterSchedule' , payload)
    
  } catch (error) {
    return error
  }
 
  };

  return (
    <>
      <Head>
        <title>SIS Admin - Schedule</title>
      </Head>

      {session?.user.role === "2" || session?.user.role === "3"? (
        <>
          <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">
            Schedule
          </p>

          <div className="grid lg:grid-cols-1 gap-5 mb-5">Schedule Table</div>
          <form>
            <div className="grid grid-cols-1 gap-4 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">
              <label className="w-[350px]">
                Promotion:
                {/* {
                  <CustomSelectBox
                    options={promotion}
                    placeholder="Select Promotion"
                    onSelect={handlePromotion}
                    styled={
                      "font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-[8px]"
                    }
                  />
                } */}
                 
                <select  
                 className="ml-9 w-40"
                //  value={promotion}
                onChange={(e)=>handlePromotion(e.target.value)}>
                  <option value=" ">Promotion</option>
                  <>
                  <>{promotion.length > 0 ? promotion.map((item, index) => (
                    // console.log(item)
              <option key={index} value={item} >{item}</option>

            )) : <option value={""}>NO promotion</option>}</>

                  </>

                  
                </select>
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
            <div className="grid lg:grid-cols-1 gap-5 mb-5">
              {/* <CourseSchedule /> */}
              <Calender />
            </div>
          </form>
        </>
      ) : (
        redirect()
      )}
    </>
  );
}
Schedule.auth = true;
Schedule.adminOnly = true;
