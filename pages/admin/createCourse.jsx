import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import MessageModal from "../programManager/ModalForm/MessageModal";

export default function createCourse() {
    const [course_id, setCourseID] = useState('')
    const [course_name, setCourseName] = useState('')
    const [course_credit, setCredit] = useState('')
    const [data, setData] = useState([])
    const [showModal, setShowModal] = useState(false)
    const { data: session } = useSession();
    const [formErrors, setFormErrors] = useState({});
    const [major, setMajor] = useState();
    const [majorValue, setMajorValue] = useState('');

    const redirect = () => {
      router.push('/AccessDenied');
    };
  
    const getAllMajors = async () => {
      let majorData = await axios.get('/api/admin/adminApi/getMajor');
  
      setMajor(majorData.data);
    };
    useEffect(() => {
      getAllMajors();
    }, []);


    const handleAdd = async () => {
        try {
            const errors = {};
            if (course_name.trim() === '') {
                errors.course_name = 'course name is required.';
            }
            if (course_credit.trim() === '') {
                errors.course_credit = 'course credit is required.';
            }
            if (course_id.trim() === '') {
                errors.course_id = 'course ID is required.';
            }
            if (majorValue.length === 0) {
                errors.majorValue = 'Major is required';
            }
            if (Object.keys(errors).length > 0) {
                setFormErrors(errors);
                return;
            }

            const payload = {
                course_id: course_id,
                course_name: course_name,
                course_credit: course_credit,
                major_id: majorValue
            }
            const { data } = await axios.post('/api/pmApi/createCourses', payload)
            console.log("data", data)
            setData(data);
            setShowModal(true)
        } catch (error) {
            return error
        }
    }
    return (
        <>
            {session?.user.role === '0' ? (
                <>
                    <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">
                        Create Course
                    </p>
                    <form>
                    {showModal && <MessageModal showModal={showModal} setShowModal={setShowModal} data={data} />}
                        <div className="grid grid-cols-1 gap-4 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">
                            <label className="w-[350px]">
                                Course ID:
                                <input
                                    className="ml-5 w-40 max-[850px]:ml-3"
                                    type="text"
                                    name="teacher_id"
                                    placeholder='Course ID'
                                    id={'teacherId'}
                                    value={course_id}
                                    onChange={(e) => { setCourseID(e.target.value) }}
                                ></input>
                                {formErrors.course_id && <div className='text-center text-red-500 font-bold p-2'>{formErrors.course_id}</div>}
                            </label>

                            <label className="w-[350px]">
                                Course Name:
                                <input
                                    className="ml-5 w-40 max-[850px]:ml-3"
                                    type="text"
                                    name="teacher_id"
                                    placeholder='Course Name'
                                    id={'teacherId'}
                                    value={course_name}
                                    onChange={(e) => { setCourseName(e.target.value) }}
                                ></input>
                                {formErrors.course_name && <div className='text-center text-red-500 font-bold p-2'>{formErrors.course_name}</div>}
                            </label>

                            <label className="w-[350px]">
                                Course credit:
                                <input
                                    className="ml-5 w-40 max-[850px]:ml-3"
                                    type="number"
                                    name="teacher_id"
                                    placeholder='Course Credit'
                                    id={'teacherId'}
                                    value={course_credit}
                                    onChange={(e) => { setCredit(e.target.value) }}
                                ></input>
                                {formErrors.course_credit && <div className='text-center text-red-500 font-bold p-2'>{formErrors.course_credit}</div>}


                            </label>
                            {/* </div>
        <div className="grid lg:grid-cols-3 min-[100px]:gap-4 mb-3"> */}
                            <label>
                                Major:
                                <select
                                    onChange={(e) => setMajorValue(e.target.value)}
                                    className="ml-10 mt-3 w-40 max-[850px]:ml-10 max-[850px]:mt-0"
                                >
                                    <option key={'uu2isdvf'} value="">
                                        Choose a Major
                                    </option>
                                    {major &&
                                        major.map((major) => (
                                            <>
                                                <option key={major.major_name} value={major.major_id}>
                                                    {major.major_name}
                                                </option>
                                            </>
                                        ))}
                                </select>
                                {formErrors.majorValue && <div className='text-center text-red-500 font-bold p-2'>{formErrors.majorValue}</div>}

                            </label>

                            <label className="invisible max-[850px]:visible max-[850px]:hidden">
                                From:
                                <input
                                    className="ml-12 invisible max-[850px]:visible max-[850px]:hidden w-40 max-[850px]:ml-10"
                                    type="date"
                                    name="from"
                                // value={formData.from}
                                // onChange={handleChange}
                                ></input>
                            </label>

                            <label className="invisible max-[850px]:visible max-[850px]:hidden">
                                new:
                                <input
                                    className="ml-16 w-40 invisible max-[850px]:visible max-[850px]:hidden max-[850px]:ml-[60px]"
                                    type="date"
                                    name="to"
                                // value={formData.to}
                                // onChange={handleChange}
                                ></input>
                            </label>
                            {/* </div>
        <div className="grid lg:grid-cols-3 min-[100px]:gap-4 mb-3 pb-4  border-blue-300 border-b-2"> */}

                            <label className="invisible max-[850px]:visible max-[850px]:hidden">
                                Status:
                                <select
                                    className="ml-9 w-40 invisible max-[850px]:visible max-[850px]:hidden "
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
                                    className="ml-9 w-40 invisible max-[850px]:visible max-[850px]:hidden  max-[840px]:ml-[50px]"
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option defaultValue="">Choose a Role</option>
                                    <option value="2">Program Manager</option>
                                    <option value="3">Assistance</option>
                                </select>
                            </label>
                            <div className="flex flex-col min-[850px]:flex-row gap-4">
                                <button
                                    className="primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold"
                                    type="button"
                                    onClick={() => handleAdd()}
                                >
                                   Add Course
                                </button>
                            </div>
                        </div>
                    </form>

                </>
            ) : (
                redirect()
            )}
        </>

    )
}
createCourse.auth = true;
createCourse.adminOnly = true;