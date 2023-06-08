import React from 'react';
// import { useState } from 'react';
// import AttendanceModal from '../../pages/programManager/ModalForm/AttendanceModal';
export const LowerButtons = ({
  // exportButton,
  // selectedRows,
  exportAllButton,
  // handlePrintSelected,
  // session
  setisModal,
}) => {
  return (
    <>
      <div className="grid lg:grid-cols-4 lg:col-end-4 min-[200px]:col-auto mt-5 gap-4">
        <button
          className="primary-button btnCol text-white  hover:text-white"
          type="button"
          onClick={() => setisModal(true)}
        >
          Create Attendance
        </button>

        {/* <button
          className='primary-button hover:text-white'
          type='button'
          disabled={selectedRows.length < 1}
          onClick={() => exportButton(selectedRows)}
          // hidden={session.user.role === '2'?true:false}
        >
          Export Selected
        </button> */}
        <button
          className="primary-button btnCol text-white hover:text-white"
          type="button"
          onClick={exportAllButton}
          // hidden={session.user.role === '2'?true:false}
        >
          Export All
        </button>
        {/* <button className='primary-button hover:text-white' type='button'
         disabled={selectedRows.length < 1}
        onClick={()=>handlePrintSelected(selectedRows)}
        >
          Print Selected
        </button> */}
      </div>
    </>
  );
};
