import React from 'react'
import { useState, useRef } from 'react'
import ReactToPrint from "react-to-print";
import axios from 'axios';
// import selection_data from '../../../utilities/selection_data';
import moment from 'moment';
import MessageModal from './MessageModal';
import { BsX } from "react-icons/bs";


export default function AttendanceModal({ selectedDate, teachersName, session, promotionName, courseName, student, setIsModal, teacherValue, coursesValue }) {
    const [data, setData] = useState([])
    const [showModal, setShowModal] = useState(false)


    // const [promotionValue, setPromotionValue] = useState('')
    const [test, setTest] = useState()
    // const [coursesValue, setCoursesValue] = useState('')
    // const [teacherValue, setTeachersValue] = useState('')
    const [promotionName, setPromotionName] = useState('')
    const [courseName, setCourseName] = useState('')
    const [teachersName, setTeachersName] = useState('')
    const [teachersLastName, setTeachersLastName] = useState('')

    const componentRef = useRef();
    //  setTimeout(() => {
    //     setMessage('');
    //   }, selection_data.message_disapear_timing)

    const handleSave = async () => {
        try {


            const payload = {
                teacher_id: teacherValue,
                course_id: coursesValue,
                attendance_date: selectedDate,
                major_id: session.user.majorid
            }
            console.log('payload')
            const data = await axios.post('http://localhost:3000/api/pmApi/createAttendanceReport', payload)
            // console.log(data.data)
            setData(data.data);
            // console.log("data",data.data)

            const attendance_id = data.data.data
            // console.log('atttttt' , attendance_id)
            if (attendance_id) {
                for (let i = 0; i < student.length; i++) {
                    const student_id = student[i].student_id
                    const data2 = await axios.post('http://localhost:3000/api/pmApi/createAttendanceStudent', { attendance_id, student_id })
                    // console.log("dataaa", data2.data)
                }

            }
            setShowModal(true)

        } catch (error) {
            return error
        }

    }

    return (
        <div>

            <div
                className=" print justify-center  items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative w-auto my-6 mx-auto max-w-3xl p-8">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-2">
                            {/* <h3 className="text-3xl font-semibold">
                    Modal Title
                  </h3> */}
                            <button
                                className="p-1 ml-auto  border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={ setIsModal(false)}
                            >
                                <span className=" text-black  h-6 w-6 text-2xl block outline-none focus:outline-none">
                                    <BsX className=' text-gray-700' />
                                </span>
                            </button>
                        </div>
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-12">
                            {showModal && <MessageModal showModal={showModal} setShowModal={setShowModal} data={data} />}
                            {/*body*/}
                            {/* <div className='mb-4'>
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




                            </div> */}
                            <div ref={componentRef} className='flex flex-col bg-white justify-around'>
                                <div className='flex flex-col pl-2 pr-4'>
                                    <div className='flex flex-row mt-2'>
                                        <div>
                                            <picture>
                                                <img
                                                    className="w-20 h-auto"
                                                    // src={
                                                    //     'https://res.cloudinary.com/ds6avfn6i/image/upload/v1684261612/esaonlineapp/public/esa-logo_y9a1ha.png'
                                                    // }
                                                    // src={appState.appVar.esa_logo}
                                                    src={'../../../../esa.png'}
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
                                        <div className='flex flex-row mb-1 '>
                                            <div className=' border-b-2 border-black'>
                                                <h3 className='font-medium mr-2'>Date:</h3>
                                            </div>
                                            <div className=' border-b-2 border-black'>
                                                <p className='font-medium '>{moment(selectedDate).format('DD/MM/YYYY')}</p>
                                            </div>

                                        </div>
                                        <div className='flex flex-row mb-2 border-b-1 border-black '>
                                            <div className='border-b-2 border-black'>
                                                <h3 className=' font-medium mr-2'>Module Name:</h3>
                                            </div>
                                            <div className='border-b-2 border-black'>
                                                <p className='font-medium'>{courseName}</p>
                                            </div>

                                        </div>
                                        <div className='flex flex-row mb-2'>
                                            <div className='border-b-2 border-black'>
                                                <h3 className='font-medium  mr-2'>Professor Name:</h3>
                                            </div>
                                            <div className='border-b-1 border-black'>
                                                <p className='font-medium'>{teachersName}</p>
                                            </div>

                                        </div>
                                        <div className='mt-2'>

                                            <table className=' border-collapse border mt-4 border-1 border-black w-full mt-2'>
                                                <thead >
                                                    <tr>
                                                        <th className='border border-1 border-black text-center p-0 font-medium'>Students</th>
                                                        <th className='border border-1 border-black text-center p-0 font-medium'>Signature</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {student.length > 0 ? student.map((item, index) => (

                                                        <tr key={index}>
                                                            <td className='border border-1 border-black p-2 font-medium' >{item.student_firstname}  {item.student_lastname}</td>
                                                            <td className='border border-1 border-black p-2 font-medium'></td>
                                                        </tr>

                                                    )) : <></>}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>


                                </div>
                            </div>

                            <div className='flex flex-row justify-end mt-4'>
                                <div>
                                    <button
                                        className='primary-button btnCol text-white hover:text-white mr-4' onClick={handleSave}>Save
                                    </button>
                                </div>

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

                                {/* <div>
                                    <button
                                        className='primary-button btnCol text-white hover:text-white mr-4' onClick={e => setIsModal(false)}>Cancel
                                    </button>
                                </div> */}


                            </div>
                        </div>

                    </div>



                </div>

            </div>

        </div>

    )
}
