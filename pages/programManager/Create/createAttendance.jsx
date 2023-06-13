import React from 'react'
import { useState, useEffect } from 'react';
import CustomSelectBox from '../customSelectBox'
import { useSession } from 'next-auth/react';
import axios from 'axios';
import AttendanceModal from '../ModalForm/AttendanceModal';
export default function createAttendance() {

    const [promotionValue, setPromotionValue] = useState('')
    const [test, setTest] = useState()
    const [coursesValue, setCoursesValue] = useState('')
    const [teacherValue, setTeachersValue] = useState('')
    const [promotionName, setPromotionName] = useState('')
    const [courseName, setCourseName] = useState('')
    const [teachersName, setTeachersName] = useState('')
    const [teachersLastName, setTeachersLastName] = useState('')
    // const componentRef = useRef();
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [data, setData] = useState('');
    const { data: session } = useSession();
    const [allpromotion, setAllPromotions] = useState([])
    const [promotion, setPromotions] = useState([])
    const [allcourses, setAllCourses] = useState([])
    const [courses, setCourses] = useState([])
    const [allteachers, setAllTeachers] = useState([])
    const [teachers, setTeachers] = useState([])
    const [student, setStudent] = useState([])
    const [isModal, setIsModal] = useState(false)
    const [error , setError] = useState(false)



    useEffect(() => {

        const getAllPromotion = async () => {
            try {

                let table = 'promotions';
                let { data } = await axios.post('/api/pmApi/getAll', { table })
                console.log("promotion", data.rows)
                setAllPromotions(data.rows)

                const datesArray = [];
                data.rows.forEach((promotions) => {
                    datesArray.push(promotions.promotion_name);
                });

                setPromotions(datesArray);
                console.log(promotion, 'before')

            } catch (error) {
                return error
                // setMessage(error)
                // return error
            }
        }
        getAllPromotion();


        const getCourses = async () => {
            try {
                let table = 'courses';
                let Where = 'major_id'
                let id = session.user.majorid
                let { data } = await axios.post('/api/pmApi/getAllCourses', { table, Where, id })
                console.log("course", data.data)
                setAllCourses(data.data)

                const datesArray = [];
                data.data.forEach((courses) => {
                    datesArray.push(courses.course_name);
                });

                setCourses(datesArray);


            } catch (error) {
                return error
            }
        }
        getCourses();

        const handleTeacher = async () => {
            try {

                let major_id = session.user.majorid;
                // let course_id = coursesValue ;
                const { data } = await axios.post("/api/pmApi/getTeachersByMajorCourse", { major_id })
                setAllTeachers(data.data)
                // console.log("teacher",data.data.teacher_fullname)


                const datesArray = [];
                data.data.forEach((teachers) => {
                    datesArray.push(teachers.teacher_fullname);


                });
                setTeachers(datesArray)


            } catch (error) {
                return error
            }
        }
        handleTeacher()

    }, [null])
    console.log('promotion', promotionValue)


    const handlePromotion = (selectedValue) => {
        // Do something with the selected value
        console.log("Selected Value:", selectedValue);
        if (test) {
            selectedValue == ''
        }
        if (selectedValue.trim() !== '') {
            let promotionID = allpromotion.filter(promotion => promotion.promotion_name === selectedValue);
            console.log(promotionID[0].promotion_id)
            setPromotionValue(promotionID[0].promotion_id)
            setPromotionName(promotionID[0].promotion_name)

        } else {
            setPromotionValue("")

        }
        if (test == true) {
            selectedValue === ' '
            setError(true)
        }
    };

    const handleCourses = (selectedValue) => {
        // Do something with the selected value
        console.log("Selected Value:", selectedValue);
        if (test) {
            selectedValue == ''
        }
        if (selectedValue.trim() !== '') {
            let coursesID = allcourses.filter(courses => courses.course_name === selectedValue);

            setCoursesValue(coursesID[0].course_id)

            setCourseName(coursesID[0].course_name)


        } else {
            setCoursesValue("")

        }
        if (test == true) {
            selectedValue === ' '
        }
    };

    const handleTeachers = (selectedValue) => {
        // Do something with the selected value
        console.log("Selected Value:", selectedValue);
        if (test) {
            selectedValue == ''
        }
        if (selectedValue.trim() !== '') {
            let teachersFullname = allteachers.filter(teachers => teachers.teacher_fullname === selectedValue);
            console.log("select", teachersFullname[0].teacher_id)

            setTeachersValue(teachersFullname[0].teacher_id)
            setTeachersName(teachersFullname[0].teacher_fullname)

        }

        else {
            setTeachersValue("")

        }
        if (test == true) {
            selectedValue === ' '
        }
    };

    const getStudent = async () => {
        try {

            setIsModal(true)
            let major_id = session.user.majorid
            let promotion_id = promotionValue
            const { data } = await axios.post('/api/pmApi/getAllStudent', { major_id, promotion_id })
            // console.log(data.data)
            // console.log(data.data)
            setStudent(data.data)

        } catch (error) {
            return error
        }


    }

    const handleSave = async () => {
        try {
            setIsModal(true)
            // const payload = {
            //     teacher_id: teacherValue,
            //     course_id: coursesValue,
            //     attendance_date: selectedDate,
            //     major_id: session.user.majorid
            // }
            // console.log(payload)

            // const data = await axios.post('http://localhost:3000/api/pmApi/createAttendanceReport', payload)
            // // console.log(data.data)
            // // setData(data.data)
            // console.log("data", data.data)
        } catch (error) {
            return error
        }
    }
    //  console.log(teachers)
    return (
        <>

            <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">Create Attendance </p>

            <div className='grid grid-cols-4 gap-4 mt-12 ml-12 mb-5'>

                <div className=''>
                    <p className="text-gray-600">Promotion:</p>
                    <CustomSelectBox
                        options={promotion}
                        placeholder="Select Promotion"
                        onSelect={handlePromotion}
                        styled={"font-medium h-auto  items-center border-[1px] border-zinc-300 self-center w-40  inline-block ml-10 mb-10"}
                    />
                    {error ? <><p>this required is required</p></>:<></>}
                    <p className="text-gray-600">Course Name:</p>
                    <CustomSelectBox
                        options={courses}
                        placeholder="Select Courses"
                        onSelect={handleCourses}
                        styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-10"}
                    />
                </div>

                <div className=''>
                    <p className="text-gray-600">Professor Name:</p>
                    <CustomSelectBox
                        options={teachers}

                        placeholder="Select Teacher"
                        onSelect={handleTeachers}
                        styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-10 mb-8"}
                    />
                    <p className="text-gray-600 mb-0">Date:</p>
                    <input type='date' className='font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-10 mt-3' value={selectedDate.toISOString().substring(0, 10)}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))} />
                </div>

            </div>
            <div className='flex justify-start m-40 mt-0 mb-0'>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-48 p-2 rounded-lg"
                    type="button"
                    onClick={(e) => getStudent()}
                >
                    Add
                </button>
            </div>

            {isModal && <AttendanceModal setIsModal={setIsModal} student={student} selectedDate={selectedDate} promotionName={promotionName} teachersName={teachersName} courseName={courseName} session={session} teacherValue={teacherValue} coursesValue={coursesValue} />}

        </>


    )
}
createAttendance.auth = true;
createAttendance.adminOnly = true;
