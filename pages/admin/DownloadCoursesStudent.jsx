import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FaCloudDownloadAlt } from "react-icons/fa";
import axios from 'axios';
import Select from 'react-select';
export default function DownloadCourseStudent() {
    const { data: session } = useSession();
    const [Data, setData] = useState([])
    const [majors, setMajors] = useState([]);
    // const [majorsValues, setMajorsValues] = useState([]);
    const [isSelected, setSelected] = useState(false)
    const router = useRouter();
    const headerCourse = [
        ['CourseID', 'CourseName', 'CourseCredit', 'CourseType', 'MajorName'],

    ];
    const headerStudent = [
        [
            'StudentID', 'Title', 'StudentFirstName', 'StudentLastName', 'Gender', 'DateOfBirth',

            'AcademicYear', 'Promotion', 'MajorName', 'Email', 'SecondEmail', 'MobileNumber', 'LandLineNumber',

            'FatherName', 'MotherName', 'maidename', 'CountryOfBirth', 'PlaceOfBirth', 'RegisterNumber', 'MartialStatus',

            'FirstNationality', 'SecondNationality', 'Country', 'Region', 'City', 'Street', 'Building', 'Floor', 'Postal',

            'Degree', 'Series', 'DateObtain', 'EducationCountry', 'Establishment', 'otherEstablishment',

            'EmergencePrefix', 'EmergenceFirstName', 'EmergenceMiddleName', 'EmergenceLastName', 'EmergencePhoneNumber',

            'EmergenceRelationShip', 'EmergenceMedicalHealth', 'EmergenceDisease'

        ],

    ];
    const headerTeacher = [['FirstName' , 'LastName' , 'Email']]
    const redirect = () => {
        router.push("/AccessDenied");
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const table = 'major'
                const data = await axios.post('/api/pmApi/getAll', { table })
                setData(data.data.rows)

            } catch (error) {
                return error
            }

        }
        fetchData()
    }, [])

    const handleMajor = (selectedOption) => {
        // const selectedCourseId = selectedOption.value;
        const selectedName = selectedOption.label;
        setMajors([selectedName]); // Convert to an array since you're only selecting one now
        // setMajorsValues([selectedCourseId]); // Convert to an array since you're only selecting one now
        setSelected(true);
    };

    const createExcelTemplateCourse = () => {
        const data = headerCourse.concat([
            ['', '', '', '', majors], // MajorName data
        ])
        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(data);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Course');

        // Generate the Excel file and save it
        const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
        const excelBlob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(excelBlob, 'course.xlsx');
    };

    const createExcelTemplateStudent = () => {
        const data2 = headerStudent.concat([
            ['', '', '', '', '', '', '', '', majors, '', '', '', '', '', '', '', '', '', '', '',

                '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',

                '', '', ''], // MajorName data
        ])
        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(data2);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Student');

        // Generate the Excel file and save it
        const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
        const excelBlob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(excelBlob, 'student.xlsx');
    };

    const createExcelTemplateTeacher = () => {
        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(headerTeacher);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Teacher');

        // Generate the Excel file and save it
        const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
        const excelBlob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(excelBlob, 'Teacher.xlsx');
    };

    return (
        <>
            <Head>
                <title>SIS Admin - Download</title>
            </Head>
            {session?.user.role === "0" ? (
                <>
                    <div className="grid grid-cols-1 gap-4 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">
                        {isSelected ?
                            <>
                                <div className="my-4 text-slate-500 text-lg leading-relaxed">
                                    <FaCloudDownloadAlt className=" hover:text-blue-600 hover:font-bold" style={{ width: '7rem', height: '7rem', cursor: 'pointer' }} onClick={createExcelTemplateCourse} />
                                    <p className="pt-5 mb-10 font-bold">Download Course Template</p>
                                </div>
                                <div className="my-4 text-slate-500 text-lg leading-relaxed">
                                    <FaCloudDownloadAlt className=" hover:text-blue-600 hover:font-bold  " style={{ width: '7rem', height: '7rem', cursor: 'pointer' }} onClick={createExcelTemplateStudent} />
                                    <p className="pt-5 mb-10 font-bold">Download Student Template</p>
                                </div>

                            </> :
                            <>

                                <div className="my-4 text-slate-500 text-lg leading-relaxed">
                                    <FaCloudDownloadAlt className=" hover:text-blue-600 hover:font-bold hover:<small>please select major first</small>" style={{ width: '7rem', height: '7rem', cursor: 'not-allowed' }} />
                                    <p className="pt-5 mb-10 font-bold">Download Course Template</p>
                                </div>
                                <div className="my-4 text-slate-500 text-lg leading-relaxed">
                                    <FaCloudDownloadAlt className='hover:text-blue-600 hover:font-bold ' style={{ width: '7rem', height: '7rem', cursor: 'not-allowed' }} />
                                    <p className="pt-5 mb-10 font-bold">Download Student Template</p>
                                </div>

                            </>}

                        <div className="my-4 text-slate-500 text-lg leading-relaxed">
                            <p className="pt-5 mb-10 font-bold">Select Major Name</p>
                            <Select
                                isMulti={false}
                                options={Data.map((major) => ({ value: major.major_id, label: major.major_name })).sort((a, b) => a.label.localeCompare(b.label))}
                                placeholder="Select a Major"
                                onChange={handleMajor}
                                className='place-items-center'
                            />



                        </div>
                        <div className="my-4 text-slate-500 text-lg leading-relaxed">
                                    <FaCloudDownloadAlt className=" hover:text-blue-600 hover:font-bold" style={{ width: '7rem', height: '7rem', cursor: 'pointer' }} onClick={createExcelTemplateTeacher} />
                                    <p className="pt-5 mb-10 font-bold">Download Teacher Template</p>
                                </div>


                    </div>
                </>) : (

                redirect()
            )}
        </>
    )
}
DownloadCourseStudent.auth = true;
DownloadCourseStudent.adminOnly = true;

