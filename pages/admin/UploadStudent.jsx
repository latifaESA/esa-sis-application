import React, { useEffect, useReducer, useState } from 'react';


import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { NotificatonMessage } from "../../components/Dashboard/WarningMessage";

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
    const [confirmCancleMessage, setConfirmCancleMessage] = useState(false)
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


    useEffect(() => {
        if (uploadPhotoData.fileList.length !== 0) {
            setupdateProfileButtonDisable(true);
            const handleUpload = async () => {
                try {

                    const formData = new FormData();
                    formData.append('files', uploadPhotoData.fileList[0]);

                    const data = await axios.post(
                        '/api/admin/adminApi/uploadScanStudent',
                        formData,

                    );
                    setDocUrl(data.url);
                    // setShowProfileModal(true)
                    setupdateProfileButtonDisable(false);
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
                const passwordRe = generateRandomPassword(8)
                const formData = new FormData();
                formData.append('files', uploadPhotoData.fileList[0]);

                const data = await axios.post(
                    '/api/admin/adminApi/uploadScanStudent',
                    {
                        passwordRe,
                        formData
                    }

                );
                console.log('URL', data);
                if (data.data.success === true) {
                    setConfirmOpenMessage(true);
                    setMessages(data.data.message);
                }
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
                                            <button
                                                className="primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold"
                                                type="button"
                                                onClick={handleScan}

                                            >
                                                Scan
                                            </button>
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
