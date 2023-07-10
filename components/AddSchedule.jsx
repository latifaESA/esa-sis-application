import React, { useEffect, useState } from 'react'
import CustomSelectBox from '../pages/programManager/customSelectBox'
import { HOURS, ROOMS } from '../pages/programManager/calenderComponent/conts'

export default function AddSchedule({handleFrom,handleTo,handleLocation,handleSelect,selectedValues,handleCancelSchedule,handleSaveSchedule, theroom}) {

    // const handleSave = () => {
    //     console.log('save')
    //   const getWeekDays = (startDate, endDate, weekdays) => {
    //       const result = [];
    //       const currentDate = new Date(startDate);
        
    //       while (currentDate <= endDate) {
    //         // if (currentDate.getDay() === 1 || currentDate.getDay() === 3) { // Monday (1) or Wednesday (3)
    //         if(weekdays.includes(currentDate.getDay())){
    //           result.push(new Date(currentDate));
    //         }
    //         currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    //       }
        
    //       return result;
    //     }
        
    //     // Usage example:
    //     const startDate = new Date('2023-06-21');
    //     const endDate = new Date('2023-09-25');
        
    //     const weekDays = getWeekDays(startDate, endDate, selectedValues);
        
    //     weekDays.forEach(date => {
    //       console.log(date.toDateString());
    //     });
    // }

    // const handleCancel = () => {
    //     setOpen(false)
    // }
    const [allrooms, setAllrooms] = useState([])
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
            <button type='button' onClick={() => handleSaveSchedule()} className='p-3 bg-green-500 hover:bg-green-400 active:bg-green-300'>Save</button>
            <button type='button' onClick={() => handleCancelSchedule()} className='p-3 bg-red-500 hover:bg-red-400 active:bg-red-300'>Cancel</button>
        </div>
    </div>
  )
}
