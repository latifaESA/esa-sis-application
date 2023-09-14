/*
 * Created By: JABER Mohamad,Moetassem Chebbo
 * Project: SIS Application
 * File: components\Admin\StudentsList.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import React from 'react';
import { useState } from 'react';
// import Link from 'next/link';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
// import moment from 'moment';
import axios from 'axios';
// import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
// import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import selection_data from '../../utilities/selection_data';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import encrypt from '../../utilities/encrypt_decrypt/encryptText';
// import major_code from '../../utilities/major_code';
// import { LowerButtons } from './LowerButtons';
// // import AddIcon from '@mui/icons-material/Add';
// import exportSelect from '../../utilities/ExcelExport/exportSelect';
import generatePasswod from '../../utilities/generatePassword';
import bcryptjs from 'bcryptjs';
// import exportAll from '../../utilities/ExcelExport/exportAll';
// import EmailAfterChangMajor from '../../utilities/emailing/emailAfterChangeMajor';
import {
  // WarningMessageCancleIncomplete,
  WarningMessageIncomplete,
  WarningMessageObsolote,
} from './WarningMessage';
// import decrypt from '../../utilities/encrypt_decrypt/decryptText';
import { useSession } from 'next-auth/react';
import CustomPagination from './Pagination';

// import { Pagination, Stack } from '@mui/material';

const AdminList= ({ admin, setAdminList }) => {
 console.log(admin)
  const [pageSize, setPageSize] = useState(10);
  const [message, setMessage] = useState('');
  // const statusData = selection_data.application_status_inList;
  // const majorData = selection_data.Academic_program_inList;
  // const [majorEnable, setMajorEnable] = useState(null);
  // const [selectedRows, setSelectedRows] = useState([]);
  const [confirmOpenIncomplete, setConfirmOpenIncomplete] = useState(false);
  const [confirmOpenDelete, setConfirmOpenDelete] = useState(false);
  // const [confirmOpenObsolote, setConfirmOpenObsolote] = useState(false);
  // const [cancleIncomplete, setCancleIncomplete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { data: session } = useSession();


  //incomplete modal
  const handleConfirmIncomplete = (user) => {
    setSelectedUser(user);
    setConfirmOpenIncomplete(true);
  };
  const handleConfirmDel = (user) => {
    setSelectedUser(user);
    setConfirmOpenDelete(true);
  };

  //obsolete modal
  // const handleConfirmObsolote = (user) => {
  //   setSelectedUser(user);
  //   setConfirmOpenObsolote(true);
  // };

  //cancle incomplete
  // const handleCancleIncomplete = (user) => {
  //   setSelectedUser(user);
  //   setCancleIncomplete(true);
  //   const prevStatus = admin.find((u) => u.ID === user.ID)?.status;
  //   // console.log("prevStatus",prevStatus)
  //   setAdminList((prevUsers) =>
  //     prevUsers.map((u) =>
  //       u.ID === user.ID ? { ...u, status: prevStatus } : u
  //     )
  //   );
  // };

  const handleConfirmClose = (user) => {
    setConfirmOpenIncomplete(false);
    setConfirmOpenDelete(false);
    // setConfirmOpenObsolote(false);
    // setCancleIncomplete(false);
    const prevStatus = admin.find((u) => u.ID === user.ID)?.status;
    // console.log("prevStatus",prevStatus)
    setAdminList((prevUsers) =>
      prevUsers.map((u) =>
        u.ID === user.ID ? { ...u, status: prevStatus } : u
      )
    );
  };

//   const handleSave = async (user) => {
//     let sendData = {
//       pm_id: user.pm_id,
//       pm_status: user.pm_status == 'active' ? 'inactive' : 'active',
//       note: 'test',
//     };
//     axios
//       .put(
//         '/api/admin/adminApi/updatePm',
//         sendData
//         // {
//         //   data: encrypt(
//         //     JSON.stringify({
//         //       pm_id: user.pm_id,
//         //       pm_status: 'inactive',
//         //     }
//         //     )
//         //   ),
//         // }
//       )
//       .then((response) => {
//         // Handle success
//         console.log(response.data);
//         setMessage('User Status Changed Succesfully!');

//         //Update the user's status and major in the table
//         setAdminList((prevUsers) =>
//           prevUsers.map((u) =>
//             u.pm_id === user.pm_id
//               ? {
//                   ...u,
//                   pm_status: user.pm_status == 'active' ? 'inactive' : 'active',
//                 }
//               : u
//           )
//         );
//       })
//       .catch((error) => {
//         // Handle error
//         console.log(error);
//       });
//   };
//   const handleEnable = async (user) => {
    // let genPassword = generatePasswod(8);
    // const salt = await bcryptjs.genSalt(8);
    // const genPass = await bcryptjs.hash(genPassword, salt);
    // let sendData = {
    //   pm_id: user.pm_id,
    //   userpassword: genPass,
    // };
    // axios
    //   .post(
    //     '/api/admin/adminApi/enablepm',
    //     sendData
    //     // {
    //     //   data: encrypt(
    //     //     JSON.stringify({
    //     //       pm_id: user.pm_id,
    //     //       pm_status: 'inactive',
    //     //     }
    //     //     )
    //     //   ),
    //     // }
    //   )
//       .then((response) => {
//         // Handle success
//         console.log(response.data);
//         setMessage('User Status Changed Succesfully!');

//         //Update the user's status and major in the table
//         setAdminList((prevUsers) =>
//           prevUsers.map((u) =>
//             u.pm_id === user.pm_id
//               ? {
//                   ...u,
//                   pm_status: user.pm_status == 'active' ? 'inactive' : 'active',
//                   note: `the current password is: ${genPassword}`,
//                 }
//               : u
//           )
//         );
//         setTimeout(() => {
//           setAdminList(prevUsers => prevUsers.filter(u => u.pm_status === 'inactive'));
//         }, 10000); // 10000 milliseconds = 10 seconds
//       })
//       .catch((error) => {
//         // Handle error
//         console.log(error);
//       });
//   };
  // const handleDelete = (user) => {
  //   let sendData = {
  //     pm_id: user.pm_id,
  //   };

  //   axios
  //     .post(
  //       '/api/admin/adminApi/deletePm',
  //       sendData
  //       // {
  //       //   data: encrypt(
  //       //     JSON.stringify({
  //       //       pm_id: user.pm_id,
  //       //       pm_status: 'inactive',
  //       //     }
  //       //     )
  //       //   ),
  //       // }
  //     )
  //     // eslint-disable-next-line no-unused-vars
  //     .then((response) => {
        

  //       //Update the user's status and major in the table
        // setTimeout(() => {
        //   setAdminList(prevUsers => prevUsers.filter(u => u.admin_status === 'active'));
        // }, 1000); // 10000 milliseconds = 10 seconds
    
        // // Handle success
        // // console.log(response.data);
        // setMessage('User deleted Succesfully!');

        
  //     })
  //     .catch((error) => {
  //       // Handle error
  //       console.log(error);
  //     });
  // };
  const handleEnable = async(event)=>{
    try {
     console.log(event , "events")
      let genPassword = generatePasswod(8);
      const salt = await bcryptjs.genSalt(8);
      const genPass = await bcryptjs.hash(genPassword, salt);
      
      let sendData = {
        adminid: event.adminid,
        userpassword: genPass,
        password: genPassword,
        admin_firstname : event.admin_firstname,
        email: event.adminemail,
        role:'Admin'

      };

      
     await axios
      .post(
        '/api/admin/adminApi/enableAdmin',
        sendData
      )
     
      setMessage('User Status Changed Successfully!');

        //Update the user's status and major in the table
        setAdminList((prevUsers) =>
          prevUsers.map((u) =>
            u.adminid === event.adminid
              ? {
                  ...u,
                  admin_status: event.admin_status == 'active' ? 'inactive' : 'active',
                  note: `the current password is: ${genPassword}`,
                }
              : u
          )
        );
        setTimeout(() => {
          setAdminList(prevUsers => prevUsers.filter(u => u.admin_status === 'inactive'));
        }, 10000); // 10000 milliseconds = 10 seconds
      
    } catch (error) {
      return error
    }
  }
  const handleSave = async (event) => {
    try {
      const payload = {
        adminid : event.adminid,
        admin_status: event.admin_status == 'active' ? 'inactive' : 'active',
   
      }
     
      await axios.post('/api/admin/adminApi/updateAdminStatus' , payload)
      //Update the user's status and major in the table
      setAdminList((prevUsers) =>
        prevUsers.map((u) =>
          u.adminid === event.adminid
            ? {
                ...u,
                admin_status: event.admin_status == 'active' ? 'inactive' : 'active',
              }
            : u
        )
      );
    
       
    } catch (error) {
      return error
    }
  } 
  const handleDelete = async (event) => {
    try {
      const payload = {
        pm_id :event.adminid
      }
      await axios.post('/api/admin/adminApi/deletePm' , payload)
   
      setTimeout(() => {
        setAdminList(prevUsers => prevUsers.filter(u => u.admin_status === 'active'));
      }, 1000); // 10000 milliseconds = 10 seconds
  
  
      // Handle success
      // console.log(response.data);
      setMessage('User deleted successfully!');
    } catch (error) {
      return error
    }
  }

  const handleConfirm = () => {
    handleEnable(selectedUser);
    handleSave(selectedUser);
    setConfirmOpenIncomplete(false);
    // setConfirmOpenObsolote(false);
    // setCancleIncomplete(false);
  };
  const handleConfirmDelete = () => {
    handleDelete(selectedUser);
    handleSave(selectedUser);
    setConfirmOpenDelete(false);
    // setConfirmOpenObsolote(false);
    // setCancleIncomplete(false);
  };
 
  
  setTimeout(() => {
    setMessage('');
  }, selection_data.message_disapear_timing);

  const columns = [
    {
      field: 'adminid',
      headerName: 'ID',
      headerAlign: 'center',
      align: 'center',
      width: 90,
    },

    {
      field: 'Name',
      headerName: 'Name',
      headerAlign: 'center',
      align: 'center',
      width: 150,
      renderCell: (params) =>
        `${params.row.admin_firstname || ''} ${params.row.admin_lastname || ''}`,
    },
    {
      field: 'adminemail',
      headerName: 'E-mail',
      headerAlign: 'center',
      align: 'center',
      width: 120,
      type: 'singleSelect',
    },
    {
      field: 'admin_status',
      headerName: 'Status',
      headerAlign: 'center',
      align: 'center',
      width: 90,
    },

    

    {
      field: 'action',
      headerName: 'Action',
      width: `${session.user.role === '0' ? 300 : 150}`,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            disabled={params.row.admin_status == 'active' ? true : false}
            className="primary-button hover:text-white"
            onClick={() => {
              // handleSave(params.row)
              // handleEnable(params.row)
              handleConfirmIncomplete(params.row);
           
            }}
            type="button"
          >
            <PersonAddAlt1Icon />
          </button>
          <button
            className="primary-button hover:text-white"
            disabled={params.row.admin_status == 'inactive' ? true : false}
            onClick={() => {
              // handleSave(params.row)
              // handleDelete(params.row)
              // handleConfirmIncomplete(params.row)
              handleConfirmDel(params.row);
              
            }}
            type="button"
          >
            <PersonRemoveIcon />
          </button>
          {/* <Link
            className='text-black'
            target='_blank'
            href={`${params.row.reportURL}`}
          >
            <button
              className='primary-button hover:text-white'
              disabled={params.row.reportURL ? false : true}
              type='button'
            >
              Print
            </button>
          </Link> */}
          {/* <button
            className='primary-button hover:text-white'
            onClick={() => {
              const prevStatus = admin.find(
                (u) => u.ID === params.row.ID
              )?.status;
              if (prevStatus === 'incomplete') {
                handleCancleIncomplete(params.row);
              } else if (params.row.status === 'incomplete') {
                handleConfirmIncomplete(params.row);
              } else if (params.row.status === 'obsolete') {
                handleConfirmObsolote(params.row);
              } else if (prevStatus === 'obsolete') {
                handleConfirmObsolote(params.row);
              } else {
                handleSave(params.row);
              }
            }}
            // disabled={params.id !== majorEnable}
            type='button'
            hidden={
              session.user.role === '2' || session.user.role === '3'
                ? true
                : false
            }
          >
            Deactivate
          </button> */}
        </div>
      ),
    },

    // {
    //   field: 'note',
    //   headerName: 'Notes',
    //   headerAlign: 'center',
    //   align: 'center',
    //   width: 150,
    // },
  ];

  // export select to excel

  // const exportButton = async () => {
  //   if (admin.length > 0) {
  //     try {
  //       const response = await axios.get('/api/admin/listusers/listexport');
  //       const incomingData = JSON.parse(decrypt(response.data.data));
  //       if (response.status === 200) {
        
  //         await exportSelect(selectedRows, incomingData, session);
  //       } else {
  //         setAdminList([]);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  // // export all to excel
  // const exportAllButton = async () => {
  //   if (users.length > 0) {
  //     try {
  //       const response = await axios.get('/api/admin/listusers/listexport');
  //       const incomingData = JSON.parse(decrypt(response.data.data));
  //       if (response.status === 200) {
         
  //         await exportAll(incomingData, session);
  //       } else {
  //         setUsers([]);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };
  // const handlePrintSelected = () => {
  //   const selectedIDs = selectedRows;
   
  //   const selectedUsers = users.filter((user) => selectedIDs.includes(user.ID));
   
  //   selectedUsers.forEach((user) => {
  //     if (user.reportURL) {
  //       window.open(user.reportURL);
  //     } else {
  //       setMessage('Please select a user with a report');
  //     }
  //   });

   
  // };

  return (
    <>
      {confirmOpenIncomplete && (
        <WarningMessageIncomplete
          confirmOpenIncomplete={confirmOpenIncomplete}
          handleConfirmClose={handleConfirmClose}
          handleConfirm={handleConfirm}
        />
      )}
      {confirmOpenDelete && (
        <WarningMessageObsolote
          confirmOpenObsolote={confirmOpenDelete}
          handleConfirmClose={handleConfirmClose}
          handleConfirm={handleConfirmDelete}
        />
      )}
      <div className="text-center text-red-500 font-bold p-2">{message}</div>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          getRowId={(r) => r.adminid}
          rows={admin}
          getRowHeight={() => 'auto'}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 15, 20]}
          checkboxSelection
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

      <div className="grid lg:grid-cols-1 p-5 shadow-sm">
        {/* <LowerButtons
          exportButton={exportButton}
          selectedRows={selectedRows}
          exportAllButton={exportAllButton}
          handlePrintSelected={handlePrintSelected}
          session={session}
        /> */}
      </div>
    </>
  );
};

export default AdminList;
