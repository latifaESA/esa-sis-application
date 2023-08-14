import React, { useEffect, useReducer, useState } from 'react';
import { NotificatonMessage } from "../../components/Dashboard/WarningMessage";
import * as XLSX from 'xlsx';
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from 'axios';
import DropZone from '../../components/UploadDocuments/DropZone';
import uploadDocReducer from '../../components/UploadDocuments/reducers/uploadDocReducer';
function generateID(academicYear, majorId) {
    let academic_year = academicYear;
    let major_id = majorId;
    const randomDigits = Math.floor(Math.random() * 10000)

    return academic_year + major_id + randomDigits
}

export default function UploadCourses() {

    const { data: session } = useSession();
    const [confirmOpenMessage, setConfirmOpenMessage] = useState(false)
    const [messages, setMessages] = useState('')
    const [isClick, setIsClick] = useState(false)
    const [majorId, setMajorId] = useState('')
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
        setConfirmOpenMessage(true)

    }
    const handleCloseNotificatonMessages = () => {
        setMajorId('')
        setConfirmOpenMessage(false)
    }
    function generateRandomPassword(length = 8) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters.charAt(randomIndex);
        }

        return password;
    }
    const validateColumnHeaders = (columnA) => {
        const templateFields = [
            'Title', 'StudentFirstName(required)', 'StudentLastName(required)', 'Gender(required)', 'DateOfBirth(e.g:(mm/dd/yyy))',

            'AcademicYear(required)', 'Promotion(e.g:promo(promoNumber))', 'MajorName', 'Email(required)', 'SecondEmail', 'MobileNumber(required)', 'LandLineNumber',

            'FatherName', 'MotherName', 'maidename', 'CountryOfBirth', 'PlaceOfBirth', 'RegisterNumber', 'MartialStatus',

            'FirstNationality(required)', 'SecondNationality', 'Country(required)', 'Region', 'City(required)', 'Street', 'Building', 'Floor', 'Postal',

            'Degree(required)', 'Series', 'DateObtain', 'EducationCountry', 'Establishment', 'otherEstablishment',

            'EmergencePrefix', 'EmergenceFirstName(required)', 'EmergenceMiddleName', 'EmergenceLastName(required)', 'EmergencePhoneNumber(required)',

            'EmergenceRelationShip', 'EmergenceMedicalHealth(required)', 'EmergenceDisease(required)'
        ]; // Replace with your actual template fields

        // Check if all template fields exist in columnA
        const missingFields = templateFields.filter(field => !columnA.includes(field));

        if (missingFields.length === 0) {
            // All template fields are present
            return true;
        } else {
            // Some template fields are missing
            return false;
        }
    };

    useEffect(() => {
        if (uploadPhotoData.fileList.length !== 0) {
            // setupdateProfileButtonDisable(true);
            const handleUpload = async () => {
                try {

                    const formData = new FormData();
                    formData.append('files', uploadPhotoData.fileList[0]);

                    // Assuming you have a reference to the uploaded file in uploadPhotoData.fileList[0]
                    const file = uploadPhotoData.fileList[0];

                    // Assuming you have retrieved the file from the FormData object
                    const reader = new FileReader();

                    reader.onload = async function (event) {
                        const data = new Uint8Array(event.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });

                        // Assuming you are interested in the first sheet of the workbook
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];

                        // Parse columns or specific cells here
                        // For example, let's say you want to extract data from column A
                        const columnHeaders = [];
                        const majorNameRowIndex = 1; // Index of the row containing "majorName"
                        let majorNameValue;

                        Object.keys(worksheet).forEach(cell => {
                            const cellRef = XLSX.utils.decode_cell(cell);
                            if (cellRef.r === 0) {
                                columnHeaders[cellRef.c] = worksheet[cell].v;
                            } else if (cellRef.r === majorNameRowIndex) {
                                // Extract the "majorName" value from the second row
                                if (columnHeaders[cellRef.c] === 'MajorName') {
                                    majorNameValue = worksheet[cell].v;

                                }
                            }
                        });
                        let table = 'major';
                        let Where = 'major_name';
                        let id = majorNameValue;
                        const response = await axios.post('/api/pmApi/getAllCourses', { table, Where, id })
                        setMajorId(response.data.data[0].major_id)
                        const isValidHeaders = validateColumnHeaders(columnHeaders);



                        if (isValidHeaders) {
                            // Data is valid, proceed with uploading and other actions

                           await axios.post(
                                '/api/admin/adminApi/uploadScanStudent',
                                formData,

                            );

                        }

                    };

                    reader.readAsArrayBuffer(file);

                } catch (error) {
                    console.log(error.response?.data);
                }
            };
            handleUpload()

        }
    }, [uploadPhotoData.fileList])
    const handleScan = async () => {
        try {
            if (uploadPhotoData.fileList.length !== 0) {
                setIsClick(true)
                // const passwordRe = generateRandomPassword(8)
                const formData = new FormData();
                formData.append('files', uploadPhotoData.fileList[0]);

                // Assuming you have a reference to the uploaded file in uploadPhotoData.fileList[0]
                const file = uploadPhotoData.fileList[0];

                // Assuming you have retrieved the file from the FormData object
                const reader = new FileReader();

                reader.onload = async function (event) {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });

                    // Assuming you are interested in the first sheet of the workbook
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];

                    // Parse columns or specific cells here
                    // For example, let's say you want to extract data from column A
                    const columnHeaders = [];

                    Object.keys(worksheet).forEach(cell => {
                        const cellRef = XLSX.utils.decode_cell(cell);
                        if (cellRef.r === 0) {
                            columnHeaders[cellRef.c] = worksheet[cell].v;
                        }
                    });


                    const isValidHeaders = validateColumnHeaders(columnHeaders);
                    const records = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    const studentData = [];
                    const year = new Date().getFullYear()
                    for (let rowIndex = 1; rowIndex < records.length; rowIndex++) {
                        const record = records[rowIndex];
                        const student_id = generateID(year, majorId);
                        const userpassword = generateRandomPassword(8)
                        const studentDataArray = {
                            student_id,
                            userpassword,
                            Title:record[0],
                            StudentFirstName:record[1],
                            FatherName:record[12],
                            StudentLastName:record[2],
                            Promotion:record[6],
                            AcademicYear:record[5],
                            maidename:record[14],
                            MotherName:record[13],
                            Gender:record[3],
                            DateOfBirth:record[4],
                            CountryOfBirth:record[15],
                            PlaceOfBirth:record[16],
                            RegisterNumber:record[17],
                            MartialStatus:record[18],
                            FirstNationality:record[19],
                            SecondNationality:record[20],
                            EmergencePrefix:record[34],
                            EmergenceFirstName:record[35],
                            EmergenceMiddleName:record[36],
                            EmergenceLastName:record[37],
                            EmergencePhoneNumber:record[38],
                            EmergenceRelationShip:record[39],
                            EmergenceMedicalHealth:record[40],
                            EmergenceDisease:record[41],
                            Degree:record[28],
                            Series:record[29],
                            DateObtain:record[30],
                            EducationCountry:record[31],
                            Establishment:record[32],
                            otherEstablishment:record[33],
                            Email:record[8],
                            SecondEmail:record[9],
                            MobileNumber:record[10],
                            LandLineNumber:record[11],
                            Country:record[21],
                            Region:record[22],
                            City:record[23],
                            Street:record[24],
                            Building:record[25],
                            Floor:record[26],
                            Postal:record[27],
                        };

                        studentData.push(studentDataArray);
                    }


                    if (isValidHeaders) {
                        // Data is valid, proceed with uploading and other actions

                        const data = await axios.post(
                            '/api/admin/adminApi/uploadScanStudent',
                            studentData



                        );

                        if (data.data.success === true) {
                            setIsClick(false)
                            setConfirmOpenMessage(true);
                            setMessages(data.data.message);
                        }
                    } else {
                        // Data is not valid, show a warning or take appropriate action
                        setIsClick(false)
                        setConfirmOpenMessage(true);
                        setMessages(`Error File! please upload Template And Don't change The Header`);
                    }

                };

                reader.readAsArrayBuffer(file);


                // console.log('URL', data);
                // if (data.data.success === true) {
                //     setConfirmOpenMessage(true);
                //     setMessages(data.data.message);
                // }
            }

        } catch (error) {
            return error
        }
    }

    return (
        <>
            {confirmOpenMessage && (
                <NotificatonMessage
                    handleOpenNotificatonMessages={handleOpenNotificatonMessages}
                    handleCloseNotificatonMessages={handleCloseNotificatonMessages}
                    messages={messages}



                />
            )}
            {session?.user.role === '0' ? (
                <>
                    <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">
                        Upload Student
                    </p>
                    <form>

                        <div className="flex flex-column justify-center  pb-4 border-blue-300 border-b-2">
                            <div className="my-4 text-slate-500 text-lg leading-relaxed">
                                <div className=''>
                                    <div >
                                        <div className='my-4 text-slate-500 text-lg leading-relaxed hover:text-blue-600 hover:font-bold'>
                                            <DropZone
                                                data={uploadPhotoData}
                                                dispatch={uploadPhotoDispatch}
                                                type={'file'}

                                            />
                                        </div>
                                        <div className='p-4 ml-2 justify-center'>
                                            {isClick ?
                                                <button
                                                    className="primary-button cursor-not-allowed rounded w-60 btnCol text-white hover:text-white hover:font-bold"
                                                    type="button"

                                                    disabled

                                                >
                                                    Scan
                                                </button> :
                                                <button
                                                    className="primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold"

                                                    type="button"
                                                    onClick={handleScan}

                                                >
                                                    Scan
                                                </button>

                                            }

                                        </div>


                                    </div>
                                </div>
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
UploadCourses.auth = true;
UploadCourses.adminOnly = true;
