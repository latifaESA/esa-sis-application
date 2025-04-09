/*
 * Created By: JABER Mohamad,Moetassem Chebbo
 * Project: SIS Application
 * File: components\Admin\StudentsList.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

import React, { useEffect, useRef } from "react";
import { useState } from "react";


import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

import selection_data from "../../utilities/selection_data";

import CustomPagination from "./Pagination";
import generateCertificate from "../../utilities/generateCertificate";
import { useSession } from "next-auth/react";
import axios from "axios";




const StudentGradesEXED = ({
    studentGrades,

}) => {

    // console.log('studentGrades' , studentGrades)


    // const [pageSize, setPageSize] = useState(10);
    const [message, setMessage] = useState("");
    const { data: session } = useSession();
    const [studentData, setStudentData] = useState([])

    setTimeout(() => {
        setMessage("");
    }, selection_data.message_disapear_timing);


    useEffect(() => {
        const StudentDetails = async () => {
            try {
                const payload = {
                    table: 'student',
                    Where: 'student_id',
                    id: session.user.userid
                }
                const response = await axios.post('/api/pmApi/getAllCourses', payload)
                // console.log('response', response)
                setStudentData(response.data.data[0])
            } catch (error) {
                return error
            }
        };
        StudentDetails()


    }, [])


    const hasDownloaded = useRef(false);

    useEffect(() => {
        console.log('student', studentData);

        if (!hasDownloaded.current && studentData && studentData.academic_year && studentData.graduated_year) {
            downloadCertificate(studentData);
            hasDownloaded.current = true; // ✅ Ensure it runs only once
        }
    }, [studentData]); // ✅ Runs only when studentData updates

    const downloadCertificate = (data) => {
        if (!data || !data.academic_year || !data.graduated_year) {
            console.error("Invalid student data:", data);
            return;
        }

        const name = `${data.student_firstname.charAt(0).toUpperCase()}${data.student_firstname.slice(1)} ${data.student_lastname.toUpperCase()}`;

        // Extract month and year safely
        const startMonth = data.academic_year.split(' ')[0] || "";
        const year = data.academic_year.split(' ')[1] || "";
        const endMonth = data.graduated_year.split(' ')[0] || "";

        // Format as "Apr-May, 2025"
        const date = `${startMonth}-${endMonth}, ${year}`;

        generateCertificate(name, date);
    };




    const columns = [

        {
            field: "course_name",
            headerName: "Certificate Name",
            headerAlign: "center",
            align: "center",
            width: 200,

        },
        {
            field: "task_name",
            headerName: "Task Name",
            headerAlign: "center",
            align: "center",
            width: 200,

        },
        {
            field: "grades",
            headerName: "Grade",
            headerAlign: "center",
            align: "center",
            width: 200,

        },
        {
            field: "comments",
            headerName: "Comments",
            headerAlign: "center",
            align: "center",
            width: 700,

        },
        {
            field: "Certificate",
            headerName: "Certificate",
            width: 350,
            headerAlign: "center",
            align: "center",
            sortable: false,
            renderCell: (params) => (
                <div className="flex gap-2">
                    <a
                        href="#"
                        className="text-blue-500 hover:underline"
                        onClick={(e) => {
                            e.preventDefault(); // Prevents navigation
                            // console.log("data", params.row);
                            downloadCertificate(params.row);
                        }}
                    >
                        {params.row.student_firstname}-{params.row.student_lastname}
                    </a>
                </div>
            ),
        }

    ]


    return (
        <>

            <div className="text-center text-red-500 font-bold p-2">{message}</div>
            <Box sx={{ height: 700, width: "100%" }}>
                <DataGrid
                    getRowId={(r) => r.grade_id}
                    rows={studentGrades}
                    getRowHeight={() => "auto"}
                    columns={columns}
                    // pageSize={pageSize}
                    // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    // rowsPerPageOptions={[5, 10, 15, 20]}
                    // pagination
                    // checkboxSelection
                    // onSelectionModelChange={setSelectedRows}
                    disableSelectionOnClick
                    // onSelectionModelChange={disablePrintHanlder}
                    // onCellEditCommit={(params) => setMajorEnable(params.id)}
                    components={{
                        NoRowsOverlay: () => (
                            <div className="grid h-[100%] place-items-center">No Data</div>
                        ),
                        Pagination: CustomPagination,
                    }}
                />
            </Box>
        </>
    );
};

export default StudentGradesEXED;
