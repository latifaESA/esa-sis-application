import React, { useEffect, useReducer, useState } from 'react';


import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { NotificatonMessage } from "../../components/Dashboard/WarningMessage";
import * as XLSX from 'xlsx';
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from 'axios';
import DropZone from '../../components/UploadDocuments/DropZone';
import uploadDocReducer from '../../components/UploadDocuments/reducers/uploadDocReducer';
import selection_data from '../../utilities/selection_data';
export default function UploadCourses() {
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [message, setMessage] = useState('');
    const [docUrl, setDocUrl] = useState(false);
    const [updateProfileButtonDisable, setupdateProfileButtonDisable] =
        useState(false);
    // const [profileUrl, setProfileUrl] = useState(null);
    const { data: session } = useSession();
    const [confirmOpenMessage, setConfirmOpenMessage] = useState(false)
    const [messages, setMessages] = useState('')
    const [isClick, setIsClick] = useState(false)
    const router = useRouter();



    const redirect = () => {
        router.push("/AccessDenied");
    };

    const dispatch = useDispatch();
    const [uploadPhotoData, uploadPhotoDispatch] = useReducer(uploadDocReducer, {
        inDropZone: false,
        fileList: [],
        totalSize: 0,
    });
    setTimeout(() => {
        setMessage('');
    }, selection_data.message_disapear_timing);
    const closeModal = () => {
        setShowProfileModal(false);
    };

    const handleOpenNotificatonMessages = () => {
        setConfirmOpenMessage(true)

    }
    const handleCloseNotificatonMessages = () => {
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
            'StudentID', 'Title','StudentFirstName', 'StudentLastName', 'Gender','DateOfBirth',

            'AcademicYear','Promotion','MajorName' , 'Email' , 'SecondEmail','MobileNumber','LandLineNumber',
    
            'FatherName','MotherName','maidename','CountryOfBirth','PlaceOfBirth','RegisterNumber','MartialStatus',
    
            'FirstNationality','SecondNationality','Country','Region','City','Street','Building','Floor','Postal',
    
            'Degree','Series','DateObtain','EducationCountry','Establishment','otherEstablishment',
    
            'EmergencePrefix','EmergenceFirstName','EmergenceMiddleName','EmergenceLastName','EmergencePhoneNumber',
    
            'EmergenceRelationShip','EmergenceMedicalHealth','EmergenceDisease'
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
            setupdateProfileButtonDisable(true);
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

                        for (const cell in worksheet) {
                            if (worksheet.hasOwnProperty(cell)) {
                                const cellRef = XLSX.utils.decode_cell(cell);
                                if (cellRef.r === 0) { // Assuming the header row is the first row (index 0)
                                    columnHeaders[cellRef.c] = worksheet[cell].v;
                                }
                            }
                        }
        
                      
                        const isValidHeaders = validateColumnHeaders(columnHeaders);
                        
                

                if (isValidHeaders) {
                    // Data is valid, proceed with uploading and other actions
                    
                    const data = await axios.post(
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
                const passwordRe = generateRandomPassword(8)
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

                    for (const cell in worksheet) {
                        if (worksheet.hasOwnProperty(cell)) {
                            const cellRef = XLSX.utils.decode_cell(cell);
                            if (cellRef.r === 0) { // Assuming the header row is the first row (index 0)
                                columnHeaders[cellRef.c] = worksheet[cell].v;
                            }
                        }
                    }
    
                   
                    const isValidHeaders = validateColumnHeaders(columnHeaders);
      
            

            if (isValidHeaders) {
                // Data is valid, proceed with uploading and other actions
                
                const data = await axios.post(
                    '/api/admin/adminApi/uploadScanStudent',
                    {
                        passwordRe,
                        formData
                    }

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
                setMessages(`file isn't template! please upload Template`);
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
                                         </button>:
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




                                    {docUrl && docUrl !== ' ' && (
                                        <div className="flex justify-center w-auto items-center">
                                            {!showProfileModal && (
                                                <a
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        setShowProfileModal(true);
                                                    }}
                                                >
                                                    Preview file
                                                </a>
                                            )}
                                        </div>
                                    )}
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
