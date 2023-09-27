import React, { useReducer, useState } from "react";
import { NotificatonMessage } from "../../components/Dashboard/WarningMessage";
import * as XLSX from "xlsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import DropZone from "../../components/UploadDocuments/DropZone";
import uploadDocReducer from "../../components/UploadDocuments/reducers/uploadDocReducer";

export default function UploadGrades({setClickUpload}) {
    const { data: session } = useSession();
    const [confirmOpenMessage, setConfirmOpenMessage] = useState(false);
    const [messages, setMessages] = useState("");
    const [isClick, setIsClick] = useState(false);
    const router = useRouter();

    const redirect = () => {
        router.push("/AccessDenied");
    };

    const [uploadPhotoData, uploadPhotoDispatch] = useReducer(uploadDocReducer, {
        inDropZone: false,
        fileList: [],
        totalSize: 0,
    });

    const handleOpenNotificatonMessages = () => {
        setConfirmOpenMessage(true);
    };

    const handleCloseNotificatonMessages = () => {
        setConfirmOpenMessage(false);
        setIsClick(false);
    };

    const validateColumnHeaders = (columnA) => {
        const templateFields = [
            'StudentID',
            'StudentFirstName',
            'StudentLastName',
            'CourseID',
            'Grade'
        ]; // Replace with your actual template fields

        // Check if all template fields exist in columnA
        const missingFields = templateFields.filter(
            (field) => !columnA.includes(field)
        );

        if (missingFields.length === 0) {
            // All template fields are present
            return true;
        } else {
            // Some template fields are missing
            return false;
        }
    };
    const validateRow = (rowData) => {
        const requiredFields = [
            'StudentID',
            'StudentFirstName',
            'StudentLastName',
            'CourseID',
            'Grade'
        ];

        for (const field of requiredFields) {
            if (!rowData[field] || rowData[field] === "" || rowData[field] === undefined) {
                return false; // Missing or empty required field
            } else {
                return true; // All required fields are present and not empty
            }
        }


    };


    const handleAdd = async () => {
        try {
            setIsClick(true);
            const file = uploadPhotoData.fileList[0];
            const reader = new FileReader();

            reader.onload = async function (event) {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: "array" });

                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                if (rows.length < 2) {
                    console.log(rows)
                    setConfirmOpenMessage(true);
                    setMessages("Error: File is empty!");
                    return;
                }

                const firstRow = rows[0];
                const isValidHeaders = validateColumnHeaders(firstRow);
                if (!isValidHeaders) {
                    setConfirmOpenMessage(true);
                    setMessages("Error File! please upload Course Template And Don't change The Header.");
                    return;
                }

                // Iterate through data rows (starting from index 1)
                for (let i = 1; i < rows.length; i++) {
                    const rowData = {}; // Create an object to store data from the current row

                    for (let j = 0; j < firstRow.length; j++) {
                        rowData[firstRow[j]] = rows[i][j]; // Assign values using header keys

                    }




                    // Iterate through data rows (starting from index 1)
                    for (let i = 1; i < rows.length; i++) {
                        const rowData = {}; // Create an object to store data from the current row

                        for (let j = 0; j < firstRow.length; j++) {
                            rowData[firstRow[j]] = rows[i][j]; // Assign values using header keys

                        }

                        // Check if the "Grade" column is empty or missing in the current row
                        if (!("Grade" in rowData) || rowData["Grade"] === "") {
                            setConfirmOpenMessage(true);
                            setMessages("No data was uploaded due to missing required information Grade.");
                            return;
                        }

                        if (!validateRow(rowData)) {
                            setConfirmOpenMessage(true);
                            setMessages("No data was uploaded due to missing required information.");
                            return;
                        }
                    }

                    if (!validateRow(rowData)) {

                        setConfirmOpenMessage(true);
                        setMessages("No data was uploaded due to missing required information.");
                        return;
                    }
                }

                // All validation checks passed, proceed with API call
                const formData = new FormData();
                formData.append("files", file);

                try {
                    const { data } = await axios.post(
                        "/api/pmApi/uploadGrade",
                        formData
                    );

                    if (data.success === true) {
                        setConfirmOpenMessage(true);
                        setMessages(data.message);
                    }
                } catch (error) {
                    if (error.response && error.response.data.success === false) {
                        setConfirmOpenMessage(true);
                        setIsClick(false);
                        setMessages(error.response.data.message);
                    }
                }
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            setConfirmOpenMessage(true);
            setMessages("Something went wrong. Please try again later.");
        }
    };


    return (
        <>
            {confirmOpenMessage && (
                <NotificatonMessage
                    handleOpenNotificatonMessages={handleOpenNotificatonMessages}
                    handleCloseNotificatonMessages={handleCloseNotificatonMessages}
                    messages={messages}
                />
            )}

            {session?.user.role === "2" || session?.user.role === "3" ? (
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
                                        Upload Grades
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setClickUpload(false)}
                                    >
                                        <span className="bg-transparent text-black  h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                
                                    <>
                                      <div className="place-items-center">
                                      <form className="my-4 text-slate-500 text-lg leading-relaxed">
                                            <div className="flex flex-column justify-center  pb-4">
                                                
                                                    <div className="relative p-6 flex-auto ">
                                                        <div className="">
                                                            <DropZone
                                                                data={uploadPhotoData}
                                                                dispatch={uploadPhotoDispatch}
                                                                type={"file"}
                                                            />
                                                        </div>
                                                    </div>
                                             
                                            </div>
                                            <div className='p-4 ml-2 flex flex-column justify-center'>
                                                {isClick ? (
                                                    <button
                                                        className="primary-button cursor-not-allowed rounded w-60 btnCol text-white hover:text-white hover:font-bold"
                                                        type="button"
                                                        disabled
                                                    >
                                                        Scan
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold"
                                                        type="button"
                                                        onClick={handleAdd}
                                                    >
                                                        Scan
                                                    </button>
                                                )}

                                            </div>
                                        </form>
                                      </div>
                                      
                                    </>

                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : (
                redirect()
            )}
        </>
    );
}

UploadGrades.auth = true;
UploadGrades.adminOnly = true;
