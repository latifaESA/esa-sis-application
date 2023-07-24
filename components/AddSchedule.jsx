import React, { useEffect, useState } from 'react'
import CustomSelectBox from '../pages/programManager/customSelectBox'
import { HOURS, ROOMS } from '../pages/programManager/calenderComponent/conts'
import { useSession } from 'next-auth/react';
import axios from 'axios';
export default function AddSchedule(
  {handleFrom,handleTo,handleLocation,handleSelect,selectedValues,
    handleCancelSchedule,handleSaveSchedule, theroom ,
    courseValue,
    teacherValue,
    setIsAddSchedule,
    setPromotions,
    setCourseValue,
    weekDays,
    dateFrom,
    dateTo,
    promotions,
    attendance,
  
    details,
    setDetails,
    student,
    setStudent,
    setCourseType,
    



  
  }) {

    const [allrooms, setAllrooms] = useState([])
    const [data , setData] = useState([])
    const { data: session } = useSession();
    let allStages = [];

    const [building, setBuilding] = useState('')
    const handleStages = (selectedValue) => {
      setBuilding(selectedValue)
      setAllrooms([])
      console.log('allrooms1 :: ==> ', allrooms)
      theroom.forEach(room =>{
        room.room_building === selectedValue
         &&
        setAllrooms(prev => [...prev, room.room_name])
      })
      console.log('allrooms2 :: ==> ', allrooms)
    }

    theroom.forEach(room =>{ 
      if(!allStages.includes(room.room_building)){
        allStages.push(room.room_building)
      }
    }
      )

    //   const handleSave = async () => {
    //     try {


    //         const payload = {
    //             teacher_id: teacherValue,
    //             course_id: courseValue,
    //             attendance_date: dateFrom,
    //             major_id: session.user.majorid
    //         }
    //         // console.log('payload')
    //         const data = await axios.post('/api/pmApi/createAttendanceReport', payload)
    //         // console.log(data.data)
    //         setData(data.data);
    //         // console.log("data",data.data)

    //         const attendance_id = data.data.data
    //         // console.log('atttttt' , attendance_id)
    //         if (attendance_id) {
    //             for (let i = 0; i < student.length; i++) {
    //                 const student_id = student[i].student_id
    //                 const data2 = await axios.post('/api/pmApi/createAttendanceStudent', { attendance_id, student_id })
    //                 // console.log("dataaa", data2.data)
    //             }

    //         }
    //         setShowModal(true)

    //     } catch (error) {
    //         return error
    //     }

    // }
  //   useEffect(()=>{
        
  //   const getStudent = async () => {
  //     try {       
  //            const payload = {
  //              table:'courses',
  //              Where :'course_id',
  //              id: courseValue
  //            }
  //             const response = await axios.post('/api/pmApi/getAllCourses' , payload)
  //             console.log(response.data.data[0].course_type)
  //             setCourseType(response.data.data[0].course_type)
  
  //             if(course_type !== 'Elective'){
  //               let major_id = session.user.majorid
  //               let promotion = promotions.replace(/\s/g, '');
  //               // let promotion = promotionName
  //               const { data } = await axios.post('/api/pmApi/getAllStudent', { major_id , promotion})
  //               // console.log(data.data)
  //               // console.log(data.data)
  //               setStudent(data.data)
                
  //             }else{
  //               const payload = {
  //                 promotion: promotions,
  //                 major_id: session.user.majorid,
  //                 course_id: courseValue
  //               }
  //               console.log('payload',payload)
  //               const data = await axios.post('/api/pmApi/getStudentAssign' , payload)
  //               console.log(data)
  //               if(data.code === 404){
  //                 let major_id = session.user.majorid
  //                 let promotion = promotions.replace(/\s/g, '');
  //                 // let promotion = promotionName
  //                 console.log('promotion',promotions)
  //                 const { data } = await axios.post('/api/pmApi/getAllStudent', { major_id , promotion})
  //                 // console.log(data.data)
  //                 // console.log(data.data)
  //                 setStudent(data.data)
  
  //               }else{
  //                 setStudent(data.data.data);
  //               }
  
                
            
  
  //             }
  
              
  
          
  //     } catch (error) {
  //         return error
  //     }
  
  
  // }
  //     getStudent()
  //   },[ null])


//  const handleSaveAttendance = async()=>{
   
//     const payload = {
//       teacher_id: teacherValue,
//       course_id: courseValue,
//       major_id: session.user.majorid
//     }


//        try {

//         for (let i = 0; i < weekDays.length; i++) {
//           const attendance_date = weekDays[i];
  
//           const payload2 = { ...payload, attendance_date }

//           const data3 = await axios.post('/api/pmApi/createAttendanceReport', payload2);

      
//           const attendance_id = data3.data.data;
         
//           if (attendance_id) {
       
//             for (let j = 0; j < student.length; j++) {
          
//               const student_id = student[j].student_id;    
//               const data2 = await axios.post('/api/pmApi/createAttendanceStudent', { attendance_id, student_id });
           
//             }
//           }
//           setIsAddSchedule(false)
//         }
//        } catch (error) {
//         return error
//        }

//   }

  const handleSaveAll = async () => {
   
    try {
  
      await handleSaveSchedule();
  
      // Rest of the code to clear state or perform any other actions if needed.
      setStudent([]);
      setDetails([]);
      setCourseType('');
      setCourseValue('');
      setPromotions('');
    } catch (error) {
      // Handle any errors that may occur during the API calls.
      console.error("Error occurred while saving: ", error);
    }
  };
  

  return (
    <div className='fixed top-1/3 left-0 bg-white max-h-3/6 overflow-y-auto flex flex-col p-5 lg:left-2/4 md:left-1/4 component-shadow'>

<div className='flex justify-between mb-3'>
      <span
        className={`bg-green-500 py-1 px-2 cursor-pointer hover:bg-green-400 ${
          selectedValues.includes(1) ? 'bg-green-700 text-white' : 'bg-green-500'
        }`}
        onClick={() => handleSelect(1)}
      >
        Mon
      </span>
      <span
        className={`py-1 px-2 cursor-pointer hover:bg-green-400 ${
          selectedValues.includes(2) ? 'bg-green-700 text-white' : 'bg-green-500'
        }`}
        onClick={() => handleSelect(2)}
      >
        Tue
      </span>
      <span
        className={`py-1 px-2 cursor-pointer hover:bg-green-400 ${
          selectedValues.includes(3) ? 'bg-green-700 text-white' : 'bg-green-500'
        }`}
        onClick={() => handleSelect(3)}
      >
        Wed
      </span>
      <span
        className={`py-1 px-2 cursor-pointer hover:bg-green-400 ${
          selectedValues.includes(4) ? 'bg-green-700 text-white' : 'bg-green-500'
        }`}
        onClick={() => handleSelect(4)}
      >
        Thurs
      </span>
      <span
        className={`py-1 px-2 cursor-pointer hover:bg-green-400 ${
          selectedValues.includes(5) ? 'bg-green-700 text-white' : 'bg-green-500'
        }`}
        onClick={() => handleSelect(5)}
      >
        Fri
      </span>
      <span
        className={`py-1 px-2 cursor-pointer hover:bg-green-400 ${
          selectedValues.includes(6) ? 'bg-green-700 text-white' : 'bg-green-500'
        }`}
        onClick={() => handleSelect(6)}
      >
        Sat
      </span>
    </div>

        <label className='w-[350px] flex justify-between mb-3'>
            From :
            {
              <CustomSelectBox
              options={HOURS}
              placeholder="Select Time"
              onSelect={handleFrom}
              styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-[8px]"}
              />
            }
        </label>

        <label className='w-[350px] flex justify-between mb-3'>
            To :
            {
              <CustomSelectBox
              options={HOURS}
              placeholder="Select Time"
              onSelect={handleTo}
              styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-[8px]"}
              enable={false}
              />
            }
        </label>

        <label className='w-[350px] flex justify-between mb-3'>
            Building :
            {
              <CustomSelectBox
              options={allStages}
              placeholder="Select Location"
              onSelect={handleStages}
              styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-[8px]"}
              enable={false}
              />
            }
        </label>

        {building.length > 0 && allrooms.length > 0 &&
            <label className='w-[350px] flex justify-between mb-3'>
                Location :
                {
                  <CustomSelectBox
                  options={allrooms}
                  placeholder="Select Location"
                  onSelect={handleLocation}
                  styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-[8px]"}
                  enable={false}
                  />
                }
            </label>
        }



        <div className='flex justify-between'>
            <button type='button' onClick={() => handleSaveAll()} className='p-3 bg-green-500 hover:bg-green-400 active:bg-green-300'>Save</button>
            <button type='button' onClick={() => {handleCancelSchedule()  ;
              setStudent([])
              setDetails([])
              setCourseType('')
              setCourseValue('')
              setPromotions('')
              }} className='p-3 bg-red-500 hover:bg-red-400 active:bg-red-300'>Cancel</button>
        </div>
    </div>
  )
}
