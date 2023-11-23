

import React, { useEffect, useState } from 'react';
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import GradeList from '../../components/Dashboard/GradesList';
import DownloadGrades from './downloadGrades';
import UploadGrades from './uploadGrades';
import axios from 'axios';
import GradeListGMP from '../../components/Dashboard/GradeListGMP';
import GradeListRTF from '../../components/Dashboard/GradeListRTF';
import GradesEXEDList from '../../components/Dashboard/GradesEXEDList';
export default function Grades() {
    const { data: session } = useSession();
    const [clickDownload, setClickDownload] = useState(false)
    const [clickUpload, setClickUpload] = useState(false)
    const [studentId, setStudentID] = useState("")
    const [studentFirstName, setStudentFirstName] = useState("")
    const [studentLastName, setStudentLast] = useState("")
    const [promotions, setPromotion] = useState("")
    const [PromotionName, setPromotionName] = useState([])
    const [GPA, setGPA] = useState("")
    const [Rank, setRank] = useState("")
    const [gradeOver30, setGradesOver30] = useState("")
    const [grade, setGrades] = useState("")
    const [courseId, setCourseId] = useState("")
    const [users, setUser] = useState([])
    const [taskName, setTaskName] = useState("")
    const [data, setData] = useState([])
    const router = useRouter();

    const redirect = () => {
        router.push("/AccessDenied");
    };
    const template = () => {
        setClickDownload(true)
    }
    const upload = () => {
        setClickUpload(true)
    }

    // Function to extract the first word before a hyphen "-"
    const getFirstWordBeforeHyphen = (text) => {
        if (text) {
            const words = text.split("-");
            if (words.length > 0) {
                return words[0];
            }
        }
        return "";
    };

    // Function to extract the first word before a hyphen "-"
    const getFirstWordAfterHyphen = (text) => {
        if (text) {
            const words = text.split("-");
            if (words.length > 0) {
                return words[1];
            }
        }
        return "";
    };

    const firstMajorWord = getFirstWordBeforeHyphen(session?.user.majorName);
    const secondMajorWord = getFirstWordAfterHyphen(session?.user.majorName);

    const isExeMajor = firstMajorWord === "EXED";

    const fetchPromotion = async () => {
        try {
            const payload = {
                table: 'promotions',
                Where: 'major_id',
                id: session.user.majorid
            }
            const response = await axios.post('/api/pmApi/getAllCourses', payload)
            setPromotionName(response.data.data)
        } catch (error) {
            return error
        }
    }

    const fetchGPA = async () => {
        try {
            const payload = {
                table: 'gpa',
            }
            const response = await axios.post('/api/pmApi/getAll', payload)

            setData(response.data.rows)
        } catch (error) {
            return error
        }
    }
    // console.log(data)
    const showAll = async () => {
        try {
            const payload = {
                student_id: "",
                first_name: "",
                last_name: "",
                promotion: "",
                major_id: session.user.majorid,
                course_id: "",
                grades: "",
                gpa: "",
                rank: ""
            }
            const response = await axios.post('/api/pmApi/filterGrades', payload)
            setUser(response.data.data)
            setStudentID("")
            setStudentFirstName("")
            setStudentLast("")
            setGrades("")
            setGPA("")
            setRank("")
            setCourseId("")
            setPromotion("")
            setTaskName("")
        } catch (error) {
            return error
        }
    }

    const search = async () => {
        try {
            const payload = {
                student_id: studentId,
                first_name: studentFirstName,
                last_name: studentLastName,
                promotion: promotions,
                major_id: session.user.majorid,
                course_id: courseId,
                grades: grade,
                task_name: taskName,
                gpa: GPA,
                rank: Rank
            }

            const response = await axios.post('/api/pmApi/filterGrades', payload)

            setUser(response.data.data)
        } catch (error) {
            return error
        }
    }

    const showAllGMP = async () => {
        try {
            const payload = {
                student_id: '',
                first_name: '',
                last_name: '',
                promotion: '',
                major_id: session.user?.majorid,
                course_id: '',
                grades: '',
                task_name: ''
            }
            const response = await axios.post('/api/pmApi/filterGradeGMP', payload)

            setUser(response.data.data)
            setStudentID("")
            setStudentFirstName("")
            setStudentLast("")
            setGrades("")
            setCourseId("")
            setPromotion("")
            setTaskName("")
        } catch (error) {
            return error
        }
    }

    const searchGMP = async () => {
        try {
            const payload = {
                student_id: studentId,
                first_name: studentFirstName,
                last_name: studentLastName,
                promotion: promotions,
                major_id: session.user?.majorid,
                course_id: courseId,
                grades: grade,
                task_name: taskName
            }

            const response = await axios.post('/api/pmApi/filterGradeGMP', payload)

            setUser(response.data.data)
        } catch (error) {
            return error
        }
    }

    const showAllRTF = async () => {
        try {
            const payload = {
                student_id: '',
                first_name: '',
                last_name: '',
                promotion: '',
                major_id: session.user?.majorid,
                course_id: '',
                grades_over_20: '',
                grades_over_30: '',
                task_name: ''
            }
            const response = await axios.post('/api/pmApi/filterRTF', payload)

            setUser(response.data.data)
            setStudentID("")
            setGradesOver30('')
            setStudentFirstName("")
            setStudentLast("")
            setGrades("")
            setCourseId("")
            setPromotion("")
            setTaskName("")
        } catch (error) {
            return error
        }
    }

    const searchRTF = async () => {
        try {
            const payload = {
                student_id: studentId,
                first_name: studentFirstName,
                last_name: studentLastName,
                promotion: promotions,
                major_id: session.user?.majorid,
                course_id: courseId,
                grades_over_20: grade,
                grades_over_30: gradeOver30,
                task_name: taskName
            }

            const response = await axios.post('/api/pmApi/filterRTF', payload)

            setUser(response.data.data)
        } catch (error) {
            return error
        }
    }

    const showAllEXED = async () => {
        try {
            const payload = {
                student_id:'',
                first_name:'',
                last_name:'',
                promotion:'',
                major_id:session.user?.majorid ,
                course_id:'',
                task_name:'',
                grades:''
            }
            const response = await axios.post('/api/pmApi/filterGradesEXED', payload)

            setUser(response.data.data)
            setStudentID("")
            setStudentFirstName("")
            setStudentLast("")
            setGrades("")
            setCourseId("")
            setPromotion("")
            setTaskName("")
        } catch (error) {
            return error
        }
    }

    const searchEXED = async () => {
        try {
            const payload = {
                student_id:studentId,
                first_name:studentFirstName,
                last_name:studentLastName,
                promotion:promotions,
                major_id:session.user?.majorid,
                course_id:courseId,
                task_name:taskName,
                grades:grade
            }

            const response = await axios.post('/api/pmApi/filterGradesEXED', payload)

            setUser(response.data.data)
        } catch (error) {
            return error
        }
    }

    useEffect(() => {
        if (!isExeMajor) {
            fetchGPA()
            fetchPromotion()
            showAll()
            search()
        } else if (isExeMajor && secondMajorWord === 'GMP') {
            fetchPromotion()
            showAllGMP()
            searchGMP()
        } else if (isExeMajor && secondMajorWord === 'Digital Transformation in Financial Services') {
            fetchPromotion()
            showAllRTF()
            searchRTF()
        }else if(isExeMajor){
            fetchPromotion()
            showAllEXED()
            searchEXED()
        }

    }, [])

    return (
        <>
            <Head>
                <title>SIS PM - Grades</title>
            </Head>

            {session?.user.role === "2" || session?.user.role === "3" ? (
                <>
                    <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">Grades</p>
                    <form>
                        {clickDownload && <DownloadGrades setClickDownload={setClickDownload} />}
                        {clickUpload && <UploadGrades setClickUpload={setClickUpload} showAll={showAll}
                            showAllGMP={showAllGMP} showAllRTF={showAllRTF} showAllEXED={showAllEXED} />}

                        <div className="mb-4 md:mb-12 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="flex items-center">
                                    <label className="mr-2">Student ID:</label>
                                    <input
                                        type="text"
                                        onChange={(e) => {
                                            setStudentID(e.target.value);
                                        }}
                                        placeholder="ID"
                                        className="w-full"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <label className="mr-2">First Name:</label>
                                    <input
                                        type="text"
                                        value={studentFirstName}
                                        onChange={(e) => setStudentFirstName(e.target.value)}
                                        placeholder="First Name"
                                        className="w-full"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <label className="mr-2">Last Name:</label>
                                    <input
                                        type="text"
                                        value={studentLastName}
                                        onChange={(e) => setStudentLast(e.target.value)}
                                        placeholder="Last Name"
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                <div className="flex items-center">
                                    <label className="mr-2">Course ID:</label>
                                    <input
                                        type="text"
                                        value={courseId}
                                        onChange={(e) => setCourseId(e.target.value)}
                                        placeholder="Course ID"
                                        className="w-full"
                                    />
                                </div>
                                <div className="flex items-center invisible max-[850px]:visible max-[850px]:hidden">
                                    <label className="mr-2">Promotion:</label>
                                    <select
                                        className="w-full"
                                        value={promotions}
                                        onChange={(e) => setPromotion(e.target.value)}
                                    >
                                        <option value="">Promotion</option>
                                        {PromotionName.length > 0 ? (
                                            PromotionName.map((item, index) => (
                                                <option key={index} value={item.promotion_name}>
                                                    {item.promotion_name}
                                                </option>
                                            ))
                                        ) : (
                                            <option value={""}>NO Promotion</option>
                                        )}
                                    </select>
                                </div>
                                <div className="flex items-center">
                                    <label className="mr-2">Promotion:</label>
                                    <select
                                        className="w-full"
                                        value={promotions}
                                        onChange={(e) => setPromotion(e.target.value)}
                                    >
                                        <option value="">Promotion</option>
                                        {PromotionName.length > 0 ? (
                                            PromotionName.map((item, index) => (
                                                <option key={index} value={item.promotion_name}>
                                                    {item.promotion_name}
                                                </option>
                                            ))
                                        ) : (
                                            <option value={""}>NO Promotion</option>
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                <div className="flex items-center">
                                    <label className="mr-2">Grade:</label>
                                    <input
                                        type="text"
                                        value={grade}
                                        onChange={(e) => setGrades(e.target.value)}
                                        placeholder="Grade"
                                        className="w-full"
                                    />
                                </div>
                                {isExeMajor && secondMajorWord === 'Digital Transformation in Financial Services' ?
                                    <div className="flex items-center">
                                        <label className="mr-2">Grade Over 30:</label>
                                        <input
                                            type="text"
                                            value={gradeOver30}
                                            onChange={(e) => setGradesOver30(e.target.value)}
                                            placeholder="Grade Over 30"
                                            className="w-full"
                                        />
                                    </div>
                                    : <></>}
                                {!isExeMajor ? <>

                                    <div className="flex items-center">
                                        <label className="mr-2">GPA:</label>
                                        <select
                                            className="w-full"
                                            value={GPA}
                                            onChange={(e) => setGPA(e.target.value)}
                                        >
                                            <option value="">GPA</option>
                                            {data.length > 0 ? (
                                                data.map((item, index) => (
                                                    <option key={index} value={item.gpa}>
                                                        {item.gpa}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value={""}>NO GPA</option>
                                            )}
                                        </select>
                                    </div>
                                </> : <></>}
                                {!isExeMajor ? <>

                                    <div className="flex items-center">
                                        <label className="mr-2">Rank:</label>
                                        <select
                                            className="w-full"
                                            value={Rank}
                                            onChange={(e) => setRank(e.target.value)}
                                        >
                                            <option value="">Rank</option>
                                            {data.length > 0 ? (
                                                data.map((item, index) => (
                                                    <option key={index} value={item.rank}>
                                                        {item.rank}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value={""}>NO Rank</option>
                                            )}
                                        </select>
                                    </div>
                                </> : <></>}


                                <div className="flex items-center">
                                    <label className="mr-2">Task:</label>
                                    <select
                                        className="w-full"
                                        value={taskName}
                                        onChange={(e) => setTaskName(e.target.value)}
                                    >
                                        <option value="">Task</option>
                                        <option value='assignment'>assignment</option>
                                        <option value='exam'>exam</option>
                                        <option value='project'>project</option>
                                    </select>
                                </div>
                            </div>



                        </div>

                        <div className="grid grid-cols-2  md:grid-cols-1 lg:grid-cols-3 gap-4 mb-4 md:mb-12 ">

                            <button
                                className="primary-button rounded btnCol invisible max-[850px]:visible max-[850px]:hidden text-white hover:text-white hover:font-bold"
                                type="button"
                                onClick={!isExeMajor ? showAll : showAllGMP}
                            >
                                Show All
                            </button>
                            <button
                                className="primary-button rounded btnCol text-white hover:text-white hover:font-bold"
                                type="button"
                                onClick={!isExeMajor ? search :
                                    (secondMajorWord === 'GMP' ?
                                        searchGMP :
                                        isExeMajor && secondMajorWord === 'Digital Transformation in Financial Services'
                                            ? searchRTF : isExeMajor ? searchEXED :<></>)
                                }
                            >
                                Search
                            </button>
                            <button
                                className="primary-button rounded btnCol text-white hover:text-white hover:font-bold"
                                type="button"
                                onClick={!isExeMajor ? showAll :
                                    (secondMajorWord === 'GMP' ?
                                        showAllGMP :
                                        isExeMajor && secondMajorWord === 'Digital Transformation in Financial Services'
                                            ? showAllRTF : isExeMajor ? showAllEXED :<></>)
                                }
                            >
                                Show All
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                            <button
                                className=" primary-button  w-full bg-green-600 hover:text-white hover:font-bold"
                                type="button"
                                onClick={template}
                            >
                                Template
                            </button>
                            <button
                                className="primary-button  w-full bg-green-600 hover:text-white hover:font-bold"
                                type="button"
                                onClick={upload}
                            >
                                Upload Grade
                            </button>
                        </div>
                        {
                            !isExeMajor ? <GradeList users={users} setUser={setUser} />
                                : isExeMajor && secondMajorWord === 'GMP' ? <GradeListGMP users={users} setUser={setUser} />
                                    : isExeMajor && secondMajorWord === 'Digital Transformation in Financial Services' ?
                                        <GradeListRTF users={users} setUser={setUser} />
                                        : isExeMajor ? <GradesEXEDList users={users} setUser={setUser} />:<></>

                        }

                    </form>
                </>
            ) : (
                redirect()
            )}
        </>





    )
}
Grades.auth = true;
Grades.adminOnly = true;
