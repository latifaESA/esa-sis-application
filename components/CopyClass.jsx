import React, { useEffect, useState } from 'react'
import CustomSelectBox from '../pages/programManager/customSelectBox'
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function CopyClass({promotion,courses,teachers,users,allTeacher,setOpenCopy,getClasses}) {

  const { data: session } = useSession();
  const [courseValue, setCourseValue] = useState('');
  const [majorValue, setMajorValue] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [promotionValueClass, setPromotionValueClass] = useState('');
  const [teacherValue, setTeacherValue] = useState('');
  const [oldteach, setoldteach] = useState('');
  const [classID, setClassID] = useState('');
  const [error, setError] = useState('');


  const handleSaveCopy = () => {

    let copyClass = async () =>{

    // Create a new Date object with the desired date
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);

    // Increment one year
    fromDate.setFullYear(fromDate.getFullYear() + 1);
    toDate.setFullYear(toDate.getFullYear() + 1);

      try{
      let classValue = {
        class_id : classID, 
        course_id : courseValue,
        teacher_id : teacherValue, 
        promotion : promotionValueClass, 
        startdate : fromDate, 
        enddate : toDate,
        pm_id: session.user.userid,
        major_id: majorValue,
      }
      let {data} = await axios.post('/api/pmApi/copyClass',classValue)
      console.log(data)
      if(data.success){
        setOpenCopy(false);
        setClassID('')
        setCourseValue('');
        setMajorValue('');
        setTeacherValue('');
        setDateFrom('');
        setDateTo('');
        getClasses();
      }else{
        alert('Error copying class')
      }
      // setOpen(false)
    }catch(err){
        console.log(err)
      }
    }

    courseValue.length === 0 ? setError('Please choose course') :  teacherValue.length === 0 ? setError('Please choose teacher') : promotionValueClass.length === 0 ? setError('Please choose promotion') : (setError(''), copyClass());

    console.log("courseValue : ", courseValue)
    console.log("teacherValue : ",teacherValue)
    console.log("promotionValueClass : ",promotionValueClass)
    console.log("majorValue : ",majorValue)
    console.log("dateFrom : ",dateFrom)
    console.log("dateTo : ",dateTo)
    console.log("pm id : ",session.user.userid)
   
  }

  const handleCancelCopy = () => {
    setOpenCopy(false)
    setPromotionValueClass('');
    setCourseValue('');
    setTeacherValue('');
  }

  const handlePromotionClass = (selectedValue) => {
    // Do something with the selected value
    console.log("Selected Value:", selectedValue);
    setPromotionValueClass(selectedValue)
  };

  console.log("users from custom element",users)

  const handleCourseCopy = (selectedValue) => {

    if(selectedValue == ''){
      setClassID('')
      setCourseValue('')

      setMajorValue('')
  
      setPromotionValueClass('')
  
      setDateFrom('')
  
      setDateTo('')
  
      setoldteach('')
      setTeacherValue('')

    }else{

    setClassID(users.filter(user => user.course_id == selectedValue)[0].tmpclass_id)

    setCourseValue(users.filter(user => user.course_id == selectedValue)[0].course_id)

    setMajorValue(users.filter(user => user.course_id == selectedValue)[0].major_id)

    setPromotionValueClass(users.filter(user => user.course_id == selectedValue)[0].promotion)

    setDateFrom(users.filter(user => user.course_id == selectedValue)[0].startdate)

    setDateTo(users.filter(user => user.course_id == selectedValue)[0].enddate)


    let theold = allTeacher.filter(teach => teach.teacher_id === users.filter(user => user.course_id == selectedValue)[0].teacher_id)[0];

    setoldteach(`${theold.teacher_firstname} ${theold.teacher_lastname} ${theold.teacher_id}`)

    // setTeacherValue(`${oldteach.teacher_firstname} ${oldteach.teacher_lastname} ${oldteach.teacher_id}`)

    setTeacherValue(users.filter(user => user.course_id == selectedValue)[0].teacher_id)

    console.log(selectedValue)
    console.log(users.filter(user => user.course_id == selectedValue)[0].teacher_id)

    console.log(users.filter(user => user.course_id == selectedValue)[0].promotion)

    }
  }

  const handleTeacher = (selectedValue) => {

    console.log('select teacher: ',selectedValue.length > 0 ?selectedValue.split(' ')[0] : '')
    setTeacherValue(selectedValue.length > 0 ? selectedValue.split(' ')[0] : '')

  };

  return (
    <div className='fixed top-1/3 left-0 bg-white h-3/6 overflow-y-auto flex flex-col p-5 lg:left-2/4 md:left-1/4 component-shadow z-10'>
        <label className='w-[350px] flex justify-between mb-3'>
            Course:
            {
              <CustomSelectBox
              options={courses}
              placeholder="Select Course"
              onSelect={handleCourseCopy}
              styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-[8px]"}
              enable={false}
              />
            }
        </label>

        {teacherValue.length > 0 &&
        <label className='w-[350px] flex justify-between mb-3'>
            Teacher:
            {
              <CustomSelectBox
              options={teachers}
              placeholder="Select Teacher"
              onSelect={handleTeacher}
              styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-[8px]"}
              enable={false}
              oldvalue={oldteach}
              />
            }
        </label>
        }
        {promotionValueClass.length > 0 &&
                <label className='w-[350px] flex justify-between mb-3'>
                    Promotion:
                    {
                      <CustomSelectBox
                      options={promotion}
                      placeholder="Select Promotion"
                      onSelect={handlePromotionClass}
                      styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-[8px]"}
                      enable={false}
                      oldvalue={promotionValueClass}
                      />
                    }
                </label>
        }
        <div className='text-red-500 self-center'>{error}</div>

        <div className='flex justify-between'>
            <button onClick={handleSaveCopy} className='p-3 bg-green-500 hover:bg-green-400 active:bg-green-300'>Save</button>
            <button onClick={handleCancelCopy} className='p-3 bg-red-500 hover:bg-red-400 active:bg-red-300'>Cancel</button>
        </div>
    </div>
  )
}
