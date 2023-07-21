import React, { useEffect, useState } from 'react'
import CustomSelectBox from '../pages/programManager/customSelectBox'
import { HOURS, ROOMS } from '../pages/programManager/calenderComponent/conts'

export default function AddSchedule(
  {handleFrom,handleTo,handleLocation,handleSelect,selectedValues,
    handleCancelSchedule,handleSaveSchedule, theroom ,
    courseValue,
    teacherValue,
    dateFrom,
    dateTo,
    promotions,
    setCourseValue,
    details,
    setDetails,
    setCourseType,
    setStudent

  
  }) {
    
    const [allrooms, setAllrooms] = useState([])
    const [data , setData] = useState([])
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

      const handleSave = async () => {
        try {


            const payload = {
                teacher_id: teacherValue,
                course_id: courseValue,
                attendance_date: dateFrom,
                major_id: session.user.majorid
            }
            // console.log('payload')
            const data = await axios.post('/api/pmApi/createAttendanceReport', payload)
            // console.log(data.data)
            setData(data.data);
            // console.log("data",data.data)

            const attendance_id = data.data.data
            // console.log('atttttt' , attendance_id)
            if (attendance_id) {
                for (let i = 0; i < student.length; i++) {
                    const student_id = student[i].student_id
                    const data2 = await axios.post('/api/pmApi/createAttendanceStudent', { attendance_id, student_id })
                    // console.log("dataaa", data2.data)
                }

            }
            setShowModal(true)

        } catch (error) {
            return error
        }

    }


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
            <button type='button' onClick={() => {handleSaveSchedule() ; setCourseType('') ;setDetails([]);setStudent([])}} className='p-3 bg-green-500 hover:bg-green-400 active:bg-green-300'>Save</button>
            <button type='button' onClick={() => {handleCancelSchedule() ; setCourseType('') ;setDetails([]);setStudent([])}} className='p-3 bg-red-500 hover:bg-red-400 active:bg-red-300'>Cancel</button>
        </div>
    </div>
  )
}
