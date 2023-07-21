import React from 'react';

export const LowerButtons = ({
  // exportButton,
  // selectedRows,
  exportAllButton,
  // setisCoursesCreate,
  // handlePrintSelected,
  session,
  elective,
  setElective,
  assigned,
  setOpenModal
  // setisModal,
}) => {
  return (
    <>
      <div className="grid lg:grid-cols-4 lg:col-end-4 min-[200px]:col-auto mt-5 gap-4">
        {/* <button className='primary-button btnCol text-white  hover:text-white' type='button' onClick = {(e)=>setisModal(true)}>
        Create Attendance
       </button> */}

        {session.user.role === '2' && assigned ? <>
         <form>
         <button
            className="primary-button btnCol text-white  hover:text-white"
            type="button"
            onClick={() => setOpenModal(true)}
          >
            Assigned Teacher
          </button>
         </form>


        </> : <>
        </>}
        {session.user.role === '2' && elective && session.user.majorid === '13' || session.user.majorid === '15' ?
          <>
          <form>
          <button
              className="primary-button btnCol text-white  hover:text-white"
              type="button"
              onClick={() => setElective(true)}
            >
              Elective
            </button>
          </form>

          </> : <>

          </>}

        {!elective && !assigned ? <>         <button
          className="primary-button btnCol text-white hover:text-white"
          type="button"
          onClick={exportAllButton}
        // hidden={session.user.role === '2'?true:false}
        >
          Export All
        </button></> : <></>}

        {/* <button
          className='primary-button hover:text-white'
          type='button'
          disabled={selectedRows.length < 1}
          onClick={() => exportButton(selectedRows)}
          // hidden={session.user.role === '2'?true:false}
        >
          Export Selected
        </button> */}

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
