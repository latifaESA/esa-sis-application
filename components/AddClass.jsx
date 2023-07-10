import React, { useEffect, useState } from 'react'
import CustomSelectBox from '../pages/programManager/customSelectBox'

export default function AddClass({promotion,handlePromotionClass,dateFrom,handleDateFromChange,dateTo,handleDateToChange,courses,handleCourse,teachers,handleTeacher,handleCancel,handleSave,error}) {


    // const handleCancel = () => {
    //     setOpen(false)
    // }

  return (
    <div className='fixed top-1/3 left-0 bg-white h-3/6 overflow-y-auto flex flex-col p-5 lg:left-2/4 md:left-1/4 component-shadow z-10'>
        <label className='w-[350px] flex justify-between mb-3'>
            Course:
            {
              <CustomSelectBox
              options={courses}
              placeholder="Select Course"
              onSelect={handleCourse}
              styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-[8px]"}
              enable={false}
              />
            }
        </label>

        <label className='w-[350px] flex justify-between mb-3'>
            Teacher:
            {
              <CustomSelectBox
              options={teachers}
              placeholder="Select Teacher"
              onSelect={handleTeacher}
              styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-[8px]"}
              enable={false}
              />
            }
        </label>

        <label className='w-[350px] flex justify-between mb-3'>
            Promotion:
            {
              <CustomSelectBox
              options={promotion}
              placeholder="Select Promotion"
              onSelect={handlePromotionClass}
              styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-[8px]"}
              enable={false}
              />
            }
        </label>

        <label className='w-[350px] flex justify-between mb-3'>
            Start Date:
            {
              <input type='date' value={dateFrom} onChange={handleDateFromChange} />
            }
        </label>

        <label className='w-[350px] flex justify-between mb-3'>
            End Date:
            {
              <input type='date' value={dateTo} onChange={handleDateToChange} />
            }
        </label>

        <div className='text-red-500 self-center'>{error}</div>

        <div className='flex justify-between'>
            <button onClick={handleSave} className='p-3 bg-green-500 hover:bg-green-400 active:bg-green-300'>Save</button>
            <button onClick={handleCancel} className='p-3 bg-red-500 hover:bg-red-400 active:bg-red-300'>Cancel</button>
        </div>
    </div>
  )
}
