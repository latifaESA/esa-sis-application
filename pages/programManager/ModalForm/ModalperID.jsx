import React, { useEffect } from 'react'
import { useState, useRef } from 'react';
import moment from 'moment';
import ReactToPrint from "react-to-print";
import axios from 'axios';

export default function ModalperID({ setShowPrint, courseName, teachersFirstname, teacherslastname, date, details }) {

    console.log("details", details)
    console.log("courseName", courseName)

    const componentRef = useRef();
    const [promotion, setPromotion] = useState([])
    const [student, setStudent] = useState([])

    useEffect(() => {
        const handlePromotion = async () => {
            try {
                
                const attendance_id = details[0].attendance_id
                const data = await axios.post('/api/pmApi/getStudentPromotions', { attendance_id })
                setPromotion(data.data.data[0].promotion_name)
                //   setStudent(data.data)

                const datesArray = [];
                data.data.data.forEach((student) => {
                    datesArray.push(student.student_fullname);
                });

                setStudent(datesArray);
                // console.log("ffffffffffffff", student)

            } catch (error) {
                return error
            }
        }
        handlePromotion();
          setTimeout(() => {
            handlePromotion();
          }, 2000);
    }, [])


    console.log('promotions', student)

    return (
        <div>

            <div
                className=" print justify-center  items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative w-auto my-6 mx-auto max-w-3xl p-8">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-12">
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
                                            <p>{promotion}</p>
                                        </div>
                                    </div>
                                    <div className='ml-2'>
                                        <div className='flex flex-row mb-1 '>
                                            <div className=' border-b-2 border-black'>
                                                <h3 className='font-medium mr-2'>Date:{moment(date).format("DD/MM/YYYY")}</h3>
                                            </div>
                                            <div className=' border-b-2 border-black'>
                                                <p className='font-medium '></p>
                                            </div>

                                        </div>
                                        <div className='flex flex-row mb-2 border-b-1 border-black '>
                                            <div className='border-b-2 border-black'>
                                                <h3 className=' font-medium mr-2'>Module Name:{courseName}</h3>
                                            </div>
                                            <div className='border-b-2 border-black'>
                                                <p className='font-medium'></p>
                                            </div>

                                        </div>
                                        <div className='flex flex-row mb-2'>
                                            <div className='border-b-2 border-black'>
                                                <h3 className='font-medium  mr-2'>Professor Name:{teachersFirstname} {teacherslastname}</h3>
                                            </div>
                                            <div className='border-b-2 border-black'>
                                                <p className='font-medium'></p>
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
                                                            <td className='border border-1 border-black p-2 font-medium' >{student[index]}</td>
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
                                    <button
                                        className='primary-button btnCol text-white hover:text-white mr-4' onClick={() => setShowPrint(false)}>Cancel
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

