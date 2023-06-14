import React, { useEffect, useReducer, useState } from 'react';
import DropZone from '../../../components/UploadDocuments/DropZone';
import {
  ProfileModal,
  CVModal,
} from '../../../components/StudentInfoApplication/ModalDocument';
import uploadDocReducer from '../../../components/UploadDocuments/reducers/uploadDocReducer';
import { BsX } from 'react-icons/bs';
import UploadDocuments from '../../../components/UploadDocuments/UploadDocuments';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import selection_data from '../../../utilities/selection_data';
import {
  profileUrlChanged,
  userNameChanged,
} from '../../../redux/slices/userSlice';
import axios from 'axios';
import decrypt from '../../../utilities/encrypt_decrypt/encryptText';

export default function Archive({ setShowArchive, attendance, details }) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [message, setMessage] = useState('');
  const [docUrl, setDocUrl] = useState(false);
  const [updateProfileButtonDisable, setupdateProfileButtonDisable] =
    useState(false);
  const [profileUrl, setProfileUrl] = useState(null);
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const table = 'attendance_report';
        const Where = 'attendance_id';
        const id = details[0].attendance_id;

        const { data } = await axios.post('/api/pmApi/getAllCourses', {
          table,
          Where,
          id,
        });
        // console.log(data.data[0].url);
        setDocUrl(data.data[0].url);
      } catch (error) {
        return error;
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (uploadPhotoData.fileList.length !== 0) {
      // console.log('uploaddata', uploadPhotoData.fileList[0].name);

      setupdateProfileButtonDisable(true);
      const handleUpload = async () => {
        try {
          const attendanceDate = new Date(details[0].attendance_date);
          const day = attendanceDate.getDate().toString().padStart(2, '0');
          const month = (attendanceDate.getMonth() + 1)
            .toString()
            .padStart(2, '0');
          const year = attendanceDate.getFullYear().toString();
          const formattedDate = `${day}-${month}-${year}`.replace(/-/g, '_');

          const formData = new FormData();
          formData.append('files', uploadPhotoData.fileList[0]);
          formData.append(
            'attendance',
            `attendance-${details[0].attendance_id}-${details[0].course_id}-${details[0].teacher_id}-${formattedDate}`
          );
          const { data } = await axios.post(
            '/api/uploaddoc/uploadDoc',
            formData
          );
          console.log('URL', data.url);
          setDocUrl(data.url);
          // setShowProfileModal(true)
          setupdateProfileButtonDisable(false);
        } catch (error) {
          console.log(error.response?.data);
        }
      };
      handleUpload();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadPhotoData]);

  const handleFile = async () => {
    try {
      const url = docUrl;
      const attendance_id = attendance[0].attendance_id;
      const { data } = await axios.put('/api/pmApi/updateURL', {
        url,
        attendance_id,
      });
      setMessage(data.message);
    } catch (error) {
      return error;
    }
  };
  return (
    <>
      <div className="justify-center items-center p-12 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-50 my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col p-10 bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-2">
              {/* <h3 className="text-3xl font-semibold">
                    Modal Title
                  </h3> */}
              <button
                className="p-1 ml-auto  border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowArchive(false)}
              >
                <span className=" text-black  h-6 w-6 text-2xl block outline-none focus:outline-none">
                  <BsX className=" text-gray-700" />
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative  flex-auto">
              {message && (
                <div className=" text-gray-600 item-center pt-5 mb-1 font-bold p-2">
                  {message}
                </div>
              )}
              <DropZone
                data={uploadPhotoData}
                dispatch={uploadPhotoDispatch}
                type={'file'}
              />

              {docUrl && docUrl !== ' ' && (
                <div className="flex justify-center items-center">
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
                  {showProfileModal && (
                    <CVModal
                      className="cursor-pointer"
                      closeModal={closeModal}
                      docUrl={docUrl}
                    />
                  )}
                </div>
              )}
            </div>
            {/*footer*/}
            <div className="flex items-center justify-center p-6">
              {/* <button
              className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => setShowArchive(false)}
            >
              Close
            </button> */}
              <button
                className="primary-button btnCol text-white  w-full hover:text-white hover:font-bold mr-5"
                type="button"
                onClick={() => handleFile()}
              >
                save
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
