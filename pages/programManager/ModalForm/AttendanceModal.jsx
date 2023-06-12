import React  from 'react'
import { useState, useRef } from 'react'
import CustomSelectBox from '../customSelectBox'
// import ReactToPrint from "react-to-print";
// import axios from 'axios';
import moment from 'moment';

export default function AttendanceModal({ promotion, allpromotion, allcourses, courses, setisModal, teachers, allteachers, student, session, setMessage }) {


    // const [promotionValue, setPromotionValue] = useState('')
    const [test, setTest] = useState()
    // const [coursesValue, setCoursesValue] = useState('')
    // const [teacherValue, setTeachersValue] = useState('')
    const [promotionName, setPromotionName] = useState('')
    const [courseName, setCourseName] = useState('')
    const [teachersName, setTeachersName] = useState('')
    const [teachersLastName, setTeachersLastName] = useState('')
    const componentRef = useRef();
    const [selectedDate, setSelectedDate] = useState(new Date())
    // const [data , setData] = useState('')


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
            let teachersFirstname = allteachers.filter(teachers => teachers.teacher_firstname === selectedValue);

            setTeachersValue(teachersFirstname[0].teacher_id)
            setTeachersName(teachersFirstname[0].teacher_firstname)



        } else {
            setTeachersValue("")

        }
        if (test == true) {
            selectedValue === ' '
        }
    };


    // const handleSave = async (e) => {

    //                e.preventDefault()

    //     try {
    //         const payload = {
    //             teacher_id: teacherValue,
    //             course_id: coursesValue,
    //             attendance_date: selectedDate,
    //             major_id: session.user.majorid
    //         }
    //         const { data } = await axios.post('/api/pmApi/createAttendanceReport', payload)
    //         setData(data.data)
    //         console.log("data",data.data)
    //     } catch (error) {
    //         return error
    //     }
    // }
    // console.log(data)
    return (
        <div>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative w-auto my-6 mx-auto max-w-3xl p-8">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-12">
                            {/*body*/}
                            <div className='mb-4'>
                                <div>
                                    <CustomSelectBox
                                        options={promotion}
                                        placeholder="Select Promotion"
                                        onSelect={handlePromotion}
                                        styled={"font-medium h-auto  items-center border-[1px] border-zinc-300 self-center w-40  inline-block ml-10"}
                                    />
                                    <CustomSelectBox
                                        options={courses}
                                        placeholder="Select Courses"
                                        onSelect={handleCourses}
                                        styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-10"}
                                    />
                                </div>

                                <div>
                                    <CustomSelectBox
                                        options={teachers}

                                        placeholder="Select Teacher"
                                        onSelect={handleTeachers}
                                        styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-10"}
                                    />
                                    <input type='date' className='font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-10 mt-3' value={selectedDate.toISOString().substring(0, 10)}
                                        onChange={(e) => setSelectedDate(new Date(e.target.value))} />
                                </div>




                            </div>
                            <div ref={componentRef} className='flex flex-col bg-white justify-around'>
                                <div className='flex flex-col pl-2 pr-4'>
                                    <div className='flex flex-row mt-2'>
                                        <div>
                                            <picture>
                                                <img
                                                    className="w-20 h-auto"
                                                    src={
                                                        'https://res.cloudinary.com/ds6avfn6i/image/upload/v1684261612/esaonlineapp/public/esa-logo_y9a1ha.png'
                                                    }
                                                    // src={appState.appVar.esa_logo}
                                                    // src={'../../../../images/esa.png'}
                                                    alt="ESA logo"
                                                />
                                            </picture>

                                        </div>

                                        <div className='mt-5 ml-2'>
                                            <h1 className='font-semibold'>ESA Business School</h1>
                                            <p>{promotionName}</p>
                                        </div>
                                    </div>
                                    <div className='ml-2'>
                                        <div className='flex flex-row mb-2 '>
                                            <div className=' border-b-2 border-black-100'>
                                                <h3 className='font-medium mr-2'>Date:</h3>
                                            </div>
                                            <div className=' border-b-2 border-black-100'>
                                                <p className='font-medium '>{moment(selectedDate).format('DD/MM/YYYY')}</p>
                                            </div>

                                        </div>
                                        <div className='flex flex-row mb-2 border-b-1 border-black-100 '>
                                            <div className='border-b-2 border-black-100'>
                                                <h3 className=' font-medium mr-2'>Module Name:</h3>
                                            </div>
                                            <div className='border-b-2 border-black-100'>
                                                <p className='font-medium'>{courseName}</p>
                                            </div>

                                        </div>
                                        <div className='flex flex-row mb-2'>
                                            <div className='border-b-2 border-black-100'>
                                                <h3 className='font-medium  mr-2'>Professor Name:</h3>
                                            </div>
                                            <div className='border-b-2 border-black-100'>
                                                <p className='font-medium'>{teachersName} {teachersLastName}</p>
                                            </div>

                                        </div>
                                        <div className='mt-2'>

                                            <table className=' border-collapse border mt-4 border-2 border-black-100 w-full mt-2'>
                                                <thead >
                                                    <tr>
                                                        <th className='border border-2 border-black-100 text-center p-0 font-medium'>Students</th>
                                                        <th className='border border-2 border-black-100 text-center p-0 font-medium'>Signature</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {student.length > 0 ? student.map((item, index) => (

                                                        <tr>
                                                            <td className='border border-2 border-black-100 p-2 font-medium' >{item.student_firstname}  {item.student_lastname}</td>
                                                            <td className='border border-2 border-black-100 p-2 font-medium'></td>
                                                        </tr>

                                                    )) : <></>}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>


                                </div>
                            </div>

                            <div className='flex flex-row justify-end'>

                                <div>
                                    <ReactToPrint

                                        trigger={() =>
                                            <button
                                                className='primary-button btnCol text-white hover:text-white mr-4'
                                                type="button"
                                            >
                                                print
                                            </button>
                                        }
                                        content={() => componentRef.current}

                                    />

                                </div>
                                <div>
                                    {/* <button
                                        className='primary-button btnCol text-white hover:text-white mr-4' onClick={ e=> handleSave(e)}>Save
                                    </button> */}
                                </div>
                                <div>
                                    <button
                                        className='primary-button btnCol text-white hover:text-white mr-4' onClick={e => setisModal(false)}>Cancel
                                    </button>
                                </div>


                            </div>
                        </div>

                    </div>



                </div>

            </div>

        </div>

    )
}
