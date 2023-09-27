

import React, { useState } from 'react';
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import GradeList from '../../components/Dashboard/GradesList';
import DownloadGrades from './downloadGrades';
import UploadGrades from './uploadGrades';
export default function Grades() {
    const { data: session } = useSession();
    const [clickDownload, setClickDownload] = useState(false)
    const [clickUpload, setClickUpload] = useState(false)
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


    return (
        <>
            <Head>
                <title>SIS PM - Grades</title>
            </Head>

            {session?.user.role === "2" || session?.user.role === "3" ? (
                <>


                    <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">
                        Grades
                    </p>
                    <form>
                        <div className="grid grid-cols-1 gap-4 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">
                            {clickDownload &&
                                <DownloadGrades
                                    setClickDownload={setClickDownload}
                                />}
                                {
                                    clickUpload && 
                                    <UploadGrades 
                                      setClickUpload={setClickUpload}
                                    
                                    />

                                }
                            <label>
                                Student ID:
                                <input
                                    className="ml-2 mt-3 w-40 max-[850px]:ml-1 max-[850px]:mt-0"
                                    type="text"
                                    name="date"
                                    placeholder="ID"
                                    id={"ID"}
                                //   value={attendance_date}
                                //   onChange={(e) => {
                                //     setAttendanceDate(e.target.value);
                                //   }}
                                
                                ></input>
                            </label>

                            <label className="invisible max-[850px]:visible max-[850px]:hidden">
                                First Name:
                                <input
                                    className="ml-12 invisible max-[850px]:visible max-[850px]:hidden w-40 max-[850px]:ml-10"
                                    type="text"
                                    name="Fname"
                                    placeholder="Teacher's First Name"
                                    // value={formData.Fname}
                                    onChange={() => {
                                        // setFname(e.target.value)
                                    }}
                                ></input>
                            </label>

                            <label>
                                Course ID:
                                <input
                                    className="ml-1 w-40 max-[850px]:ml-1"
                                    type="text"
                                    name="Lname"
                                    placeholder="Course ID"
                                    id={"text"}
                                //   value={course_id}
                                //   onChange={(e) => {
                                //     setCourseId(e.target.value);
                                //   }}
                                ></input>
                            </label>
                            {/* </div>
        <div className="grid lg:grid-cols-3 min-[100px]:gap-4 mb-3"> */}
                            <label>
                                First Name:
                                <input
                                    className="ml-2 mt-3 w-40 max-[850px]:ml-1 max-[850px]:mt-0"
                                    type="text"
                                    name="firstname"
                                    placeholder="First Name"
                                    id={"teacherId"}
                                //   value={teacher_firstName}
                                //   onChange={(e) => {
                                //     setTeacherFirstName(e.target.value);
                                //   }}
                                ></input>
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

                            <label>
                                Last Name:
                                <input
                                    className="ml-1 w-40 max-[850px]:ml-1 max-[850px]:mt-0"
                                    type="text"
                                    name="lastname"
                                    placeholder="Last Name"
                                    id={"teacherId"}
                                //   value={teacher_lastName}
                                //   onChange={(e) => {
                                //     setTeacherLastName(e.target.value);
                                //   }}
                                ></input>
                            </label>
                            {/* </div>
        <div className="grid lg:grid-cols-3 min-[100px]:gap-4 mb-3 pb-4  border-blue-300 border-b-2"> */}

                            <label className="invisible max-[850px]:visible max-[850px]:hidden">
                                Course ID:
                                <input
                                    className="ml-3 w-40 max-[850px]:ml-2"
                                    type="number"
                                    name="course-id"
                                    placeholder="Enter Course ID"
                                    // value={formData.Fname}
                                    onChange={() => {
                                        // setCourseId(e.target.value)
                                    }}
                                ></input>
                            </label>

                            <label className="invisible max-[850px]:visible max-[850px]:hidden">
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
                                    type="button"
                                //   onClick={handleAttendance}
                                >
                                    Search
                                </button>
                                <button
                                    className="primary-button btnCol text-white rounded w-60 hover:text-white hover:font-bold"
                                    type="button"
                                //   onClick={handleShowAll}
                                >
                                    Show All
                                </button>
                            </div>
                            <div className="flex flex-col min-[850px]:flex-row gap-4">
                                <button
                                    className="primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold"
                                    type="button"
                                    onClick={template}
                                >
                                    Template
                                </button>
                                <button
                                    className="primary-button btnCol text-white rounded w-60 hover:text-white hover:font-bold"
                                    type="button"
                                    onClick={upload}
                                >
                                    Upload Grade
                                </button>
                            </div>
                        </div>

                        <GradeList />
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
