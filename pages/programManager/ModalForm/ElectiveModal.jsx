import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';

import { BsX } from 'react-icons/bs';
import Select from 'react-select';
import MessageModal from './MessageModal';

export default function ElectiveModal({ users, setElective, courses, students , setUsers }) {
    const [studentList, setStudent] = useState(false)
    const { data: session } = useSession();
    const [courseValue, setCoursesValue] = useState([])
    const [selectedCourse, setSelected] = useState([])
    const [course, setCourse] = useState([])
    const [selectStudentId, setSelectedStudentIds] = useState([]);
    const [message , setMassage] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [data, setData] = useState([])
    const [formErrors, setFormErrors] = useState({});
    const [disable , setDisable] = useState(false)



    const handleCourses = (selectedOptions) => {
        const selectedCourseIds = selectedOptions.map((option) => option.value);
        const selectedName = selectedOptions.map((option) => option.label);
        setCourse(selectedName)
        setCoursesValue(selectedCourseIds);
        setSelected(true)
        setStudent(true)
    };

    const handleStudentCheckboxChange = (e) => {
        const studentId = e.target.value;
        if (e.target.checked) {
            setSelectedStudentIds((prevSelectedIds) => [...prevSelectedIds, studentId]);
            setDisable(true)
        } else {
            setSelectedStudentIds((prevSelectedIds) => prevSelectedIds.filter((id) => id !== studentId));
            setDisable(true)
        }
    };

    const handleSave = async () => {
        try {
            const errors = {};
            if (courseValue.length === 0) {
              errors.courseValue = 'At least one course must be selected';
            }

            if (selectStudentId.length === 0) {
              errors.courses = 'At least one Student must be Checked';
            }
            if (Object.keys(errors).length > 0) {
              setFormErrors(errors);
              return;
            }
          const newAssignments = [];
          for (let i = 0; i < selectStudentId.length; i++) {
            const payload = {
              course_id: courseValue,
              student_id: selectStudentId[i],
              major_id :session.user.majorid,
              promotion :students.find((student)=>student.student_id === selectStudentId[i])?.promotion
            };
      
            const { data } = await axios.post('/api/pmApi/createAssignStudent', payload);
       
          
            const newRows = {
                assign_student_id: data.data.assign_student_id,
                course_id : courseValue[0],
                course_name:course[0],
                student_id : selectStudentId[i],
                promotion : students.find((student)=>student.student_id === selectStudentId[i])?.promotion,
                student_firstname : students.find((student)=>student.student_id === selectStudentId[i])?.student_firstname,
                student_lastname : students.find((student)=>student.student_id === selectStudentId[i])?.student_lastname

              };
              
      
               setData(data);
            setMassage(data.message)
            setShowModal(true)
              setUsers((prevUsers) => [...prevUsers, newRows]);
            
            }
        } catch (error) {
          console.error("Error:", error);
          return error;
        }
      };
      
    
   console.log(data)

    return (
        <>
            {studentList ? <>
                <>    
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-non"
                    >  
                    {showModal && <MessageModal showModal={showModal} setShowModal={setShowModal} data={data} />}
                        <div className="relative w-1/2 h-screen my-6 mx-auto max-w-3xl  overflow-y-auto">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-gray-700 text-3xl font-bold">
                                        Elective
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => {
                                            setStudent(false),
                                            setSelectedStudentIds([])
                                        }}
                                    >
                                        <span className="bg-transparent text-black  h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            <BsX className=" text-gray-700 font-bold" />
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <div className=" flex flex-col my-4 text-slate-500 text-lg leading-relaxed">
                                        <div className="flex justify-start mb-4 border-b-4"><div className="font-bold ">Course Name:</div><div>{course}</div></div>
                                        {students.length > 0 ? students.map((item, index) => (

                                            <>
                                                <div className='flex flex-col border-2 justify-center' key={index}>
                                                    <div className='flex flex-row  justify-evenly mt-2'>
                                                    <div className="basis-1 w-1/2" >
                                                        <input type='checkbox' 
                                                         className="accent-blue-500 cursor-pointer caret-blue-500 md:caret-indigo-500 "
                                                        value={item.student_id} onChange={(e) => handleStudentCheckboxChange(e)} />  
                                                    </div>
                                                    <div className="basis-3/4 w-1/2 justify-center p-2 border-l-2 "><div className="">{item.student_firstname} {item.student_lastname}</div></div>

                                                    </div>

                                                </div>

                                            </>

                                        )) : <></>}
                                        {formErrors.selectStudentId && <div className='text-center text-red-500 font-bold p-2'>{formErrors.selectStudentId}</div>}
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                                    {disable ?                                        
                                     <button        
                                            className="primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold justify-center"
                                            
                                            type="button"
                                            onClick={(e) => handleSave()}
                                        >
                                            Save
                                        </button>:                                       
                                         <button    
                                            className="primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold justify-center"
                                            disabled
                                            type="button"
                                            onClick={(e) => handleSave()}
                                        >
                                            Save
                                        </button>}

                                  
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>


            </> : <>

                <>
                    <>
                        <div
                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        >
                            <div className="relative w-3/4 h-1/2 my-6 mx-auto max-w-3xl">
                                {/*content*/}
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    {/*header*/}
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                        <h3 className="text-gray-700 text-3xl font-bold">
                                            Elective
                                        </h3>
                                        <button
                                            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                            onClick={() => {
                                                setElective(false)
                                            }}
                                        >
                                            <span className="bg-transparent text-black  h-6 w-6 text-2xl block outline-none focus:outline-none">
                                                <BsX className=" text-gray-700 font-bold" />
                                            </span>
                                        </button>

                                    </div>
                                    {/*body*/}
                                    <div className="relative p-6 flex-auto">
                                        <from className="my-4 text-slate-500 text-lg leading-relaxed">
                                            
                                            <Select
                                                isMulti
                                                options={courses.map((course) => ({ value: course.course_id, label: course.course_name })).sort((a, b) => a.label.localeCompare(b.label))}
                                                placeholder="Select Courses"
                                                onChange={handleCourses}
                                            />
                                           {formErrors.courseValue && <div className='text-center text-red-500 font-bold p-2'>{formErrors.courseValue}</div>}
                                        </from>

                                    </div>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>

                </>

            </>}
        </>


    );
}