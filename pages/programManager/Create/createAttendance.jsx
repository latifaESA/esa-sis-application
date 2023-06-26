import React from 'react'
import { useState, useEffect } from 'react';
import CustomSelectBox from '../customSelectBox'
import { useSession } from 'next-auth/react';
import axios from 'axios';
import AttendanceModal from '../ModalForm/AttendanceModal';
export default function createAttendance() {

    const [promotionValue, setPromotionValue] = useState('')
    const [formErrors, setFormErrors] = useState({});
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
    const [error, setError] = useState(false)
    const [message, setMessage] = useState('')
    // console.log("selectedddd", selectedDate)

    const redirect = () => {
        router.push('/AccessDenied');
    };


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
                setMessage(data.data.message)

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
                setMessage(data.data.message)

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

                setMessage(data.data.message)
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
            const errors = {};
            const currentDate = new Date()
            if (teacherValue.length === 0) {
                errors.teachers = 'At least one Teacher must be selected.';
            }
            if (coursesValue.length === 0) {
                errors.courses = 'At least one course must be selected.';
            }
            if (promotionValue.length === 0) {
                errors.promotion = 'At least one promotion must be selected.';
            }

            if (Object.keys(errors).length > 0) {
                setFormErrors(errors);
                return;
            } else {
                setIsModal(true)
                let major_id = session.user.majorid
                let promotion_id = promotionValue
                const { data } = await axios.post('/api/pmApi/getAllStudent', { major_id, promotion_id })
                // console.log(data.data)
                // console.log(data.data)
                setStudent(data.data)
            }
        } catch (error) {
            return error
        }


    }

    return (
        <>

            {session?.user.role === '2' ? (
                <>
                    <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">
                        Create Attendance
                    </p>
                    <form>
                        <div className="grid grid-cols-1 gap-4 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">
                            <label className="w-[450px]">
                                promotion:

                                <CustomSelectBox
                                    options={promotion}
                                    placeholder="Select Promotion"
                                    onSelect={handlePromotion}
                                    styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-8"}
                                />
                                {formErrors.promotion && <div className='text-center text-red-500 font-bold p-2'>{formErrors.promotion}</div>}

                            </label>
                            <label className="invisible max-[850px]:visible max-[850px]:hidden">
                                Status:
                                <select
                                    className="ml-10 w-40"
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    {/* <option value="">Choose Value..</option> */}
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </label>

                            <label className="w-[450px]">
                                Course Name:
                                <CustomSelectBox
                                    options={courses}
                                    placeholder="Select Courses"
                                    onSelect={handleCourses}
                                    styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-5"}
                                />
                                {formErrors.courses && <div className='text-center text-red-500 font-bold p-2'>{formErrors.courses}</div>}
                            </label>
                            <label className="invisible max-[850px]:visible max-[850px]:hidden">
                                Status:
                                <select
                                    className="ml-9 w-40"
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    {/* <option value="">Choose Value..</option> */}
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </label>

                            <label className="invisible max-[850px]:visible max-[850px]:hidden">
                                Role:
                                <select
                                    className="ml-9 w-40 max-[840px]:ml-[50px]"
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option defaultValue="">Choose a Role</option>
                                    <option value="2">Program Manager</option>
                                    <option value="3">Assistance</option>
                                </select>
                            </label>
                            <label className="invisible max-[850px]:visible max-[850px]:hidden">
                                Role:
                                <select
                                    className="ml-9 w-40 max-[840px]:ml-[50px]"
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option defaultValue="">Choose a Role</option>
                                    <option value="2">Program Manager</option>
                                    <option value="3">Assistance</option>
                                </select>
                            </label>

                            <label className="w-[450px]">
                                Teacher
                                FullName:
                                {
                                    <CustomSelectBox
                                        options={teachers}

                                        placeholder="Select Teacher"
                                        onSelect={handleTeachers}
                                        styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-5"}
                                    />
                                }
                                {formErrors.teachers && <div className='text-center text-red-500 font-bold p-2'>{formErrors.teachers}</div>}


                            </label>
                            <label className="invisible max-[850px]:visible max-[850px]:hidden">
                                Role:
                                <select
                                    className="ml-5 w-40 max-[840px]:ml-[50px]"
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option defaultValue="">Choose a Role</option>
                                    <option value="2">Program Manager</option>
                                    <option value="3">Assistance</option>
                                </select>
                            </label>
                            <label className="w-[450px] ">
                                Date:
                                <input type='date' className='font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-5' value={selectedDate.toISOString().substring(0, 10)}
                                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                />
                            </label>
                            <label className="invisible max-[850px]:visible max-[850px]:hidden">
                                Status:
                                <select
                                    className="ml-9 w-40"
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    {/* <option value="">Choose Value..</option> */}
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </label>

                            <label className="invisible max-[850px]:visible max-[850px]:hidden">
                                Role:
                                <select
                                    className="ml-9 w-40 max-[840px]:ml-[50px]"
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option defaultValue="">Choose a Role</option>
                                    <option value="2">Program Manager</option>
                                    <option value="3">Assistance</option>
                                </select>
                            </label>
                            <div className="flex flex-col ml-7 min-[850px]:flex-row gap-4">
                                <button
                                    className="primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold"
                                    type="button"
                                    onClick={(e) => getStudent()}
                                >
                                    Create Attendance
                                </button>
                            </div>
                        </div>
                        {isModal && <AttendanceModal setIsModal={setIsModal} student={student} selectedDate={selectedDate} promotionName={promotionName} teachersName={teachersName} courseName={courseName} session={session} teacherValue={teacherValue} coursesValue={coursesValue} />}
                    </form>
                </>
            ) : (
                redirect()
            )}
        </>
    );
}
createAttendance.auth = true;
createAttendance.adminOnly = true;
