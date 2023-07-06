import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import TeachersList from '../../components/Dashboard/TeachersList'
import axios from 'axios'
import { useRouter } from 'next/router';
import CustomSelectBox from './customSelectBox';
import AddClass from '../../components/addClass';
import AddSchedule from '../../components/AddSchedule';
import ClassList from '../../components/Dashboard/classList';
// import Link from 'next/link';



export default function Students() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [promotionValue, setPromotionValue] = useState('');
  const [promotion, setPromotion] = useState([]);
  const [courseValue, setCourseValue] = useState('');
  const [majorValue, setMajorValue] = useState('');
  const [courses, setCourses] = useState([]);
  const [allCourse, setAllCourse] = useState([]);

  const [promotionValueClass, setPromotionValueClass] = useState('');
  // const [promotionClass, setPromotionClass] = useState([]);
  const [open, setOpen] = useState(false)
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [teacherValue, setTeacherValue] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [allTeacher, setAllTeacher] = useState([]);
  const [error, setError] = useState('');
  const [searchCourse, setSearchCourse] = useState('');

  const handleCancel = () => {
    setOpen(false)
    setPromotionValue('');
    setCourseValue('');
    setTeacherValue('');
    setDateFrom('');
    setDateTo('');
}

const handleSave = () => {
  console.log('save')
  let createClass = async () =>{
    try{
    let classValue = {
      course_id : courseValue,
      teacher_id : teacherValue, 
      promotion : promotionValueClass, 
      startdate : dateFrom, 
      enddate : dateTo,
      pm_id: session.user.userid,
      major_id: majorValue,
    }
    let {data} = await axios.post('/api/pmApi/createClass',classValue)
    console.log(data)
    if(data.success){
      setOpen(false)
      setPromotionValue('');
      setCourseValue('');
      setMajorValue('');
      setTeacherValue('');
      setDateFrom('');
      setDateTo('');
      getClasses()
    }else{
      alert('Error creating class')
    }
    // setOpen(false)
  }catch(err){
      console.log(err)
    }
  }
  courseValue.length === 0 ? setError('Please choose course') :  teacherValue.length === 0 ? setError('Please choose teacher') : promotionValueClass.length === 0 ? setError('Please choose promotion') : dateFrom.length === 0 ? setError('Please choose date from') : dateTo.length === 0 ? setError('Please choose date to') :(setError(''), createClass());
 
}

  const handleDateFromChange = (event) => {
    const selectedDate = event.target.value;
    
    console.log(selectedDate);
    if(dateTo.length > 0 && selectedDate > dateTo){
      alert('The date from is greater than date to')
    }else if(dateTo.length > 0 && selectedDate === dateTo){
      alert('The date from and to are equal')
    }else{
      setDateFrom(selectedDate);
    }
  };

  const handleDateToChange = (event) => {
    const selectedDate = event.target.value;
    
    console.log(selectedDate);
    if(dateFrom.length > 0 && selectedDate < dateFrom){
      alert('The date to is less than date to')
    }else if(dateFrom.length > 0 && selectedDate === dateFrom){
      alert('The date from and to are equal')
    }else{
      setDateTo(selectedDate);
    }
  };

  const router = useRouter()



  const redirect = () => { 
    router.push('/AccessDenied')
  }

  useEffect(() => { 
    handleShowAll()
  }, [])

  const handlePromotion = (selectedValue) => {
    // Do something with the selected value
    console.log("Selected Value:", selectedValue);
    setPromotionValue(selectedValue)
  };

  const handlePromotionClass = (selectedValue) => {
    // Do something with the selected value
    console.log("Selected Value:", selectedValue);
    setPromotionValueClass(selectedValue)
  };

  const handleCourse = (selectedValue) => {
    // Do something with the selected value
    console.log("Selected Value:",selectedValue.length > 0 ? allCourse.filter(course => course.course_name === selectedValue)[0].course_id : '');
    // setCourseValue(selectedValue)
    setCourseValue(selectedValue.length > 0 ? allCourse.filter(course => course.course_name === selectedValue)[0].course_id : '')
    setMajorValue(selectedValue.length > 0 ? allCourse.filter(course => course.course_name === selectedValue)[0].major_id : '')
  };

  const handleTeacher = (selectedValue) => {
    // Do something with the selected value
    // console.log("Selected Value:", allTeacher.filter(teacher => `${teacher.teacher_firstname} ${teacher.teacher_lastname}` === selectedValue)[0].course_id);
    console.log('select teacher: ',selectedValue.length > 0 ?selectedValue.split(' ')[0] : '')
    setTeacherValue(selectedValue.length > 0 ? selectedValue.split(' ')[0] : '')
    // setCourseValue(allCourse.filter(course => course.course_name === selectedValue)[0].course_id)

  };
  
  const handleShowAll = async () => {
    console.log('hello')
    getClasses()
  }

  const handleSearch = async(e) => {
    e.preventDefault()
    console.log('hello')
    console.log(searchCourse)
    console.log(users.filter(course => course.course_id.includes(searchCourse)))
    setUsers(users.filter(course => course.course_id.includes(searchCourse)))
  }
  const getClasses = async () => { 
    try{
    let table = 'tmpclass';
    let colName = 'pm_id'
    let val = session.user.userid;
    let {data} = await axios.post('/api/pmApi/getuserteacher', {pmID:val})

    // const datesArray = [];
    // data.rows.forEach((clas) => {
    //   datesArray.push(clas.tmpclass_id);
    // });

    console.log('users Classes are the following : ',data.rows)
    setUsers(data.rows);
    // setPromotionClass(datesArray)

      
    }catch(err){
      console.log(err)
    }
  }
  useEffect(() => { 

    getClasses();
    const getPromotion = async () => { 
      try{
      let table = 'promotions';
      let {data} = await axios.post('/api/pmApi/getAll', {table})

      const datesArray = [];
      data.rows.forEach((prom) => {
        datesArray.push(prom.promotion_name);
      });

      setPromotion(datesArray);
      // setPromotionClass(datesArray)

        
      }catch(err){
        console.log(err)
      }
    }
        getPromotion();

    const getCourse = async () => { 
      try{
      let table = 'courses';
      let {data} = await axios.post('/api/pmApi/getAll', {table})

      setAllCourse(data.rows);
console.log('data', data.rows);
console.log('allCourse', allCourse);
      const datesArray = [];
      data.rows.forEach((course) => {
        datesArray.push(course.course_name);
      });

      setCourses(datesArray);

        
      }catch(err){
        console.log(err)
      }
    }
        getCourse();

    const getTeacher = async () => { 
      try{
      let table = 'teachers';
      let {data} = await axios.post('/api/pmApi/getAll', {table})

      setAllTeacher(data.rows);
      const datesArray = [];
      data.rows.forEach((teacher) => {
        datesArray.push(`${teacher.teacher_id} ${teacher.teacher_firstname} ${teacher.teacher_lastname}`);
      });

      setTeachers(datesArray);

        
      }catch(err){
        console.log(err)
      }
    }
    getTeacher();
}, [])

const handleClass = () =>{
  setOpen(true)
}


//>>>>>>> main
  return (
    <>
      <Head>
        <title>SIS Admin - Teachers</title>
      </Head>
     {session?.user.role === '2' ? ( <>
      <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">List Of Classes</p>
      { open && 
      <AddClass 
        promotion={promotion} 
        handlePromotionClass={handlePromotionClass}
        setOpen= {setOpen} 
        dateFrom= {dateFrom}
        handleDateFromChange = {handleDateFromChange}
        dateTo = {dateTo}
        handleDateToChange= {handleDateToChange}
        courses = {courses}
        handleCourse = {handleCourse}
        teachers = {teachers}
        handleTeacher = {handleTeacher}
        handleCancel = {handleCancel}
        handleSave = {handleSave}
        error = {error}
        />
        }
      <form >
        <div className="grid grid-cols-1 gap-4 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">

        <label className='w-[350px]'>
            Course:   
            <input type='text' placeholder='type course id' className='ml-4' 
            onChange={(e) => setSearchCourse(e.target.value)}/>
            {/* {
              <CustomSelectBox
              options={promotion}
              placeholder="Select Course"
              onSelect={handlePromotion}
              styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-[8px]"}
              />
            } */}
          </label>

         {/* <label className='w-[350px]'>
            Promotion:
            {
              <CustomSelectBox
              options={promotion}
              placeholder="Select Promotion"
              onSelect={handlePromotion}
              styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-[8px]"}
              />
            }
          </label> */}

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
              onClick={handleSearch}
            >
              Search
            </button>
            <button
              className="primary-button btnCol text-white rounded w-60 hover:text-white hover:font-bold"
              type="reset"
              onClick={handleShowAll}
            >
              Show All
            </button>

            <button
              className="secondary-button text-white rounded w-60 bg-green-600 hover:text-white hover:font-bold"
              type="button"
              onClick={handleClass}
            >
              Add Class
            </button>
          </div>
        </div>
        <ClassList users={users} setUsers={setUsers} />
      </form>
    </>) : redirect()}
    </>
  );
}
Students.auth = true;
Students.adminOnly = true;
