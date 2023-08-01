import React from 'react'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FaCloudDownloadAlt } from "react-icons/fa";
export default function DownloadCourseStudent() {
    const { data: session } = useSession();
    const router = useRouter();
    const data = [
        ['CourseID', 'CourseName', 'CourseCredit', 'CourseType', 'MajorName'],

    ];
    const data2 = [
        [
        'StudentID', 'Title','StudentFirstName', 'StudentLastName', 'Gender','DateOfBirth',

        'AcademicYear','Promotion','MajorName' , 'Email' , 'SecondEmail','MobileNumber','LandLineNumber',

        'FatherName','MotherName','maidename','CountryOfBirth','PlaceOfBirth','RegisterNumber','MartialStatus',

        'FirstNationality','SecondNationality','Country','Region','City','Street','Building','Floor','Postal',

        'Degree','Series','DateObtain','EducationCountry','Establishment','otherEstablishment',

        'EmergencePrefix','EmergenceFirstName','EmergenceMiddleName','EmergenceLastName','EmergencePhoneNumber',

        'EmergenceRelationShip','EmergenceMedicalHealth','EmergenceDisease'

        ],

    ];
    const redirect = () => {
        router.push("/AccessDenied");
    };

    const createExcelTemplate = () => {
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
    return (
        <>
            <Head>
                <title>SIS Admin - Download</title>
            </Head>
           {session?.user.role === "0" ? (
                <>
                    <div className="grid grid-cols-1 gap-4 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">                       
                     <div className="my-4 text-slate-500 text-lg leading-relaxed">
                        <FaCloudDownloadAlt className=" hover:text-blue-600 hover:font-bold" style={{ width: '7rem', height: '7rem', cursor: 'pointer' }} onClick={createExcelTemplate} />
                        <p className="pt-5 mb-10 font-bold">Download Course Template</p>
                    </div>
                    <div className="my-4 text-slate-500 text-lg leading-relaxed">
                        <FaCloudDownloadAlt className=" hover:text-blue-600 hover:font-bold"  style={{ width: '7rem', height: '7rem', cursor: 'pointer' }} onClick={createExcelTemplateStudent}/>
                        <p className="pt-5 mb-10 font-bold">Download Student Template</p>
                    </div>


                    </div>
                </>):(

                  redirect()
                )}
        </>
    )
}
DownloadCourseStudent.auth = true;
DownloadCourseStudent.adminOnly = true;

