import React, { useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import selection_data from '../../../utilities/selection_data';
import axios from "axios";
// import CustomPagination from '../../';
export default function Modal({ setEditModal, attendance, setAttendance }) {
  console.log("att", attendance)

  const presence = selection_data.presence;
  const [Present, setPresent] = useState('');
  const [pageSize, setPageSize] = useState(10);

  const handleUpdate = async (event) => {
    console.log(event)

    try {

      const present = 'false';
      const attendance_id = event.attendance_id;
      const student_id = event.student_id;

      console.log("attendance", present.attendance_id)
      console.log("student", present.student_id)
      const { data } = await axios.put('http://localhost:3000/api/pmApi/presentupdate', { present, student_id, attendance_id })

    } catch (error) {
      return error
    }

  }

  const columns = [
    {
      field: 'Name',
      headerName: 'Student Name',
      headerAlign: 'center',
      align: 'center',
      width: 120,
      renderCell: (params) =>
        `${params.row.student_firstname || ''} ${params.row.student_lastname || ''}`,


    },
    {
      field: 'present',
      headerName: 'Presence',
      headerAlign: 'center',
      align: 'center',
      width: 100,
      editable: true,


      renderCell: (params) => {
        return params.value ? (
          <>  Present</>
        ) : (<>Absent</>);
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
        <div className='flex gap-2'>
          <button
            className='primary-button hover:text-white'
            onClick={() => { handleUpdate(params.row) }}
            // disabled={params.id !== presentEnable}
            type='button'
          // hidden={
          //   // session.user.role === '1' || session.user.role === '3'
          //     ? true
          //     : false
          // }
          >
            Edit
          </button>
        </div>
      ),
    },

  ];
  // const [showModal, setShowModal] = React.useState(false);
  return (
    <>
      <>
        <div
          className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-12"
        >
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              {/* <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Modal Title
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    // onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div> */}
              {/*body*/}
              <div className="relative p-12 flex-auto">
                <div>
                  <p>{}</p>
                  {/* <p>{attendance.course_name}</p> */}
                  {/* <p>{attendance.attendance_date}</p> */}
                </div>
                <div>
                  <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                      getRowId={r => r.student_id}
                      rows={attendance}
                      getRowHeight={() => 'auto'}
                      columns={columns}
                      pageSize={pageSize}
                      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                      rowsPerPageOptions={[5, 10, 15, 20]}
                      // pagination
                      // checkboxSelection
                      // onSelectionModelChange={setSelectedRows}
                      // disableSelectionOnClick
                      // onSelectionModelChange={disablePrintHanlder}
                      // onCellEditCommit={(params) => setMajorEnable(params.id)}
                      components={{
                        NoRowsOverlay: () => (
                          <div className='grid h-[100%] place-items-center'>No Data</div>
                        ),
                        // Pagination: CustomPagination,
                      }}

                    />
                  </Box>
                </div>
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => { setEditModal(false), setAttendance([]) }}
                >
                  Close
                </button>
                <button
                  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setEditModal(false)}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>

    </>
  );
}