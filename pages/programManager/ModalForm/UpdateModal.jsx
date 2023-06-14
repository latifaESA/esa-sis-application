import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import selection_data from '../../../utilities/selection_data';

import axios from 'axios';
import moment from 'moment';
// import CustomPagination from '../../../components/Dashboard/Pagination';
import { useSession } from 'next-auth/react';

import { BsX } from 'react-icons/bs';

export default function Modal({
  setEditModal,
  attendance,
  setAttendance,
  courseName,
  teachersFirstname,
  teacherslastname,
  date,
}) {
  const { data: session } = useSession();
  const [pageSize, setPageSize] = useState(10);
  const [message, setMessage] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [update, setUpdate] = useState([]);

  setTimeout(() => {
    setMessage('');
  }, selection_data.message_disapear_timing);

  const handleUpdate = async (event) => {
    try {
      const present = event.present;
      const attendance_id = event.attendance_id;
      const student_id = event.student_id;

      const { data } = await axios.put('/api/pmApi/presentupdate', {
        present,
        student_id,
        attendance_id,
      });

      setMessage(data.message);

      // Update the attendance state with the new present value
      setAttendance((prevState) => {
        const updatedAttendance = prevState.map((row) => {
          if (row.student_id === student_id) {
            return { ...row, present: present };
          }
          return row;
        });
        return updatedAttendance;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAll = async () => {
    try {
      for (let i = 0; i < attendance.length; i++) {
        const row = attendance[i];
        if (row.isDirty) {
          const { student_id, attendance_id, present } = row;
          const { data } = await axios.put('/api/pmApi/presentupdate', {
            present,
            student_id,
            attendance_id,
          });

          setMessage(data.message);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const presence = [
    { value: true, label: 'Present' },
    { value: false, label: 'Absent' },
  ];

  const handleCellEditChange = (params) => {
    const { id, field, value } = params;

    setAttendance((prevState) => {
      const updatedAttendance = prevState.map((row) => {
        if (row.student_id === id) {
          const updatedRow = {
            ...row,
            [field]: value,
            isDirty: row.present !== value,
          };

          return updatedRow;
        }
        return row;
      });

      return updatedAttendance;
    });
  };

  const columns = [
    {
      field: 'id', // Add the id field
      headerName: 'ID',
      hide: true, // Hide the ID column
    },

    {
      field: 'Name',
      headerName: 'Student Name',
      headerAlign: 'center',
      align: 'center',
      width: 120,
      renderCell: (params) =>
        `${params.row.student_firstname || ''} ${
          params.row.student_lastname || ''
        }`,
    },
    {
      field: 'present',
      headerName: 'Presence',
      headerAlign: 'center',
      align: 'center',
      width: 100,
      editable: true,

      renderCell: (params) => {
        return params.value ? <>Present</> : <>Absent</>;
      },

      cellClassName: (params) =>
        params.row.present === false
          ? 'text-red-600 font-bold'
          : params.row.present === true
          ? 'text-green-600 font-bold'
          : '',
      type: 'singleSelect',
      valueOptions: presence,
    },

    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            className="primary-button hover:text-white"
            onClick={() => {
              handleUpdate(params.row);
            }}
            // disabled={params.id !== presentEnable}

            type="button"
            hidden={
              session.user.role === '1' || session.user.role === '3'
                ? true
                : false
            }
          >
            Save
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
        <div className="relative w-auto my-6 mx-auto max-w-3xl  pr-30">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-2">
              {/* <h3 className="text-3xl font-semibold">

                    Modal Title
                  </h3> */}
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <button
                className="p-1 ml-auto  border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => {
                  setEditModal(false), setAttendance([]);
                }}
              >
                <span className=" text-black  h-6 w-6 text-2xl block outline-none focus:outline-none">
                  <BsX />
                </span>
              </button>
              <div className="p-4">
                <p className="text-gray-700 text-3xl pt-5 mb-2 font-bold">
                  Attendance
                </p>
                <div>
                  <p className="text-gray-600  pt-5 mb-1 ">
                    Course Name :{courseName}
                  </p>
                  <p className="text-gray-600  pt-5 mb-1">
                    Date:{moment(date).format('DD/MM/YYYY')}
                  </p>
                  <p className="text-gray-600  pt-5 mb-3">
                    Teacher FullName :{teachersFirstname} {teacherslastname}
                  </p>
                </div>
              </div>
              <div>
                {message && (
                  <div className=" text-green-500 font-bold p-2">{message}</div>
                )}
                <div className="p-4">
                  <Box sx={{ height: 280, width: '100%' }}>
                    <DataGrid
                      getRowId={(r) => r.student_id}
                      rows={attendance}
                      getRowHeight={() => 'auto'}
                      columns={columns}
                      pageSize={pageSize}
                      onPageSizeChange={(newPageSize) =>
                        setPageSize(newPageSize)
                      }
                      rowsPerPageOptions={[5, 10, 15, 20]}
                      pagination
                      // onEditCellChange={(params) =>
                      //   handleCellEditChange(params)
                      // }
                      onCellEditCommit={(params) =>
                        handleCellEditChange(params)
                      }
                      components={{
                        NoRowsOverlay: () => (
                          <div className="grid h-[100%] place-items-center">
                            No Data
                          </div>
                        ),
                        // Pagination: CustomPagination,
                      }}
                    />
                  </Box>
                </div>
              </div>
              <div className="flex items-center justify-end p-6 border-solid border-slate-200 rounded-b">
                <button
                  className="primary-button btnCol text-white  w-40 hover:text-white hover:font-bold mr-5"
                  type="button"
                  onClick={() => handleAll()}
                >
                  Save ALL
                </button>
                {/* <button
                  className="primary-button btnCol text-white  w-40 hover:text-white hover:font-bold" type="button"
                  onClick={() => { setEditModal(false), setAttendance([]) }}
                >
                  Close
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
