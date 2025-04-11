

import React, { useEffect } from "react";
import { useState } from "react";
// import Link from 'next/link';
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
// import moment from 'moment';
// import * as XLSX from "xlsx";
// import axios from "axios";
import selection_data from "../../utilities/selection_data";
// import encrypt from '../../utilities/encrypt_decrypt/encryptText';
// import major_code from '../../utilities/major_code';
import { LowerButtons } from "./LowerButtons";
// import exportSelect from "../../utilities/ExcelExport/exportSelect";
// import exportAll from "../../utilities/ExcelExport/exportAll";
// import EmailAfterChangMajor from '../../utilities/emailing/emailAfterChangeMajor';
// import { WarningConfirmChangeEmail } from "./WarningMessage";
// import decrypt from "../../utilities/encrypt_decrypt/decryptText";
// import { useSession } from "next-auth/react";
import CustomPagination from "./Pagination";
import generateCertificate from "../../utilities/generateCertificate";
// import { ExportButtons } from "./ExportButtons";
// import { ExportButtons } from "./ExportButtons";
import { useSession } from "next-auth/react";
import generateAllCertificates from "../../utilities/generateAllCertificate";
import axios from "axios";

function getMonthYear(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long' };
  return date.toLocaleDateString('en-US', options);
}


const HistoryList = ({ users }) => {

  const [pageSize, setPageSize] = useState(10);
  const [message, setMessage] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
 const { data: session } = useSession();
const [startDate , setStartDate] = useState('')
const [promotion , setPromotion] = useState([])
const [getDate , setGetDate] = useState(false)
console.log('promotion' , promotion , getDate)
useEffect(()=>{
  const getStartDate = async()=>{
    try {
      const payload = {
        promotion:promotion.promotion
      }
     
        const response = await axios.post('/api/pmApi/getFirstClass' , payload)
        // console.log('response' , response.data.data[0].day)
        setStartDate(response.data.data[0].day)
      
  

    } catch (error) {
      return error
    }
  };
  
    getStartDate()
 
  
},[promotion , startDate ])

useEffect(()=>{
  const getStartDate = async()=>{
    try {
      const payload = {
        promotion:promotion
      }
      if(getDate){
        const response = await axios.post('/api/pmApi/getFirstClass' , payload)
        // console.log('response' , response.data.data[0].day)
        setStartDate(response.data.data[0].day)
      }
  

    } catch (error) {
      return error
    }
  };
  
    getStartDate()
 
  
},[promotion , startDate ,getDate])
// console.log('startdate' , startDate)
 const downloadCertificate = (data) => {
  if (!data || !startDate || !data.graduated_year) {
      console.error("Invalid student data:", data);
      return;
  }
 
  const name = `${data.student_firstname.charAt(0).toUpperCase()}${data.student_firstname.slice(1)} ${data.student_lastname.toUpperCase()}`;
  const start_day = getMonthYear(startDate)
  // Extract month and year safely
  const startMonth = start_day.split(' ')[0] || "";
  const year = data.academic_year.split(' ')[1] || "";
  const endMonth = data.graduated_year.split(' ')[0] || "";

  // Format as "Apr-May, 2025"
  const date = `${startMonth}-${endMonth}, ${year}`;

  generateCertificate(name, date);
};


  
  setTimeout(() => {
    setMessage("");
  }, selection_data.message_disapear_timing);
  // Define the initial columns array with common columns
  const columns = [
    {
      field: "student_id",
      headerName: "ID",
      headerAlign: "center",
      align: "center",
      width: 90,
    },

    {
      field: "student_lastname",
      headerName: "Last Name",
      headerAlign: "center",
      align: "center",
      width: 150,
      // renderCell: (params) =>
      //   `${params.row.student_lastname || ''}`,
    },
    {
      field: "student_firstname",
      headerName: "First Name",
      headerAlign: "center",
      align: "center",
      width: 150,
     
    },


    {
      field: "major_name",
      headerName: "Major",
      headerAlign: "center",
      align: "center",
      width: 200,
      

    },
    {
      field: "promotion",
      headerName: "Promotion",
      headerAlign: "center",
      align: "center",
      width: 90,
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      align: "center",
      width: 100,

    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "center",
      align: "center",
      width: 250,
      
    },
    {
      field: "mobile_number",
      headerName: "Mobile Number",
      headerAlign: "center",
      align: "center",
      width: 150,
      
    },
      {
        field: "graduated_year",
        headerName: "GraduatedYear",
        headerAlign: "center",
        align: "center",
        width: 150,
      },
      {
        field: "Certificate Copy",
        headerName: "Certificate Copy",
        width: 350,
        headerAlign: "center",
        align: "center",
        sortable: false,
        renderCell: (params) => (
          <div className="flex gap-2">
            <a
              href="#"
              className="text-blue-500 hover:underline"
              onClick={(e) => {
                e.preventDefault(); // Prevents navigation
                // console.log("data", params.row);
                // setGetDate(true)
                setPromotion(params.row)
                downloadCertificate(params.row);
              }}
            >
              {params.row.student_firstname}-{params.row.student_lastname}
            </a>
          </div>
        ),
      }
      

  ];

  // Now the "columns" array will only include "graduated_year" for users with valid statuses

  const exportButton = async () => {
    if (selectedRows.length > 0) {
      try {
        let selected = new Set(selectedRows)
        const filteredStudents = users.filter(student => selected.has(student.student_id));
        console.log('filteredStudents' ,filteredStudents)
        setPromotion(filteredStudents)
        console.log('filteredStudents' ,promotion)
       generateAllCertificates(filteredStudents)
      } catch (error) {
        console.error(error);
      }
    }
  };

  // export all to excel
  const exportAllButton = async () => {
    console.log('the users : ', users);
    setSelectedRows(users)
    console.log('selectedRows' , selectedRows)
    if (selectedRows.length > 0) {
      try {
        const selectedIds = new Set(selectedRows.map(student => student.student_id));
        console.log('selected', selectedIds);
        
        const filteredStudents = users.filter(student => selectedIds.has(student.student_id));
        console.log('filteredStudents', filteredStudents);
  
        if (filteredStudents.length > 0) {
          setPromotion(filteredStudents[0].promotion);
          console.log('promotion', filteredStudents[0].promotion);
        }
  
        setGetDate(true);
        generateAllCertificates(filteredStudents , startDate)
      } catch (error) {
        console.error(error);
      }
    }
  };
  
  const handlePrintSelected = () => {
    const selectedIDs = selectedRows;

    const selectedUsers = users.filter((user) => selectedIDs.includes(user.ID));

    selectedUsers.forEach((user) => {
      if (user.reportURL) {
        window.open(user.reportURL);
      } else {
        setMessage("Please select a user with a report");
      }
    });
  };

  return (
    <>
      {/* {confirmOpenIncomplete && (
        <WarningConfirmChangeEmail
          confirmOpenIncomplete={confirmOpenIncomplete}
          handleConfirmClose={handleConfirmClose}
          handleConfirm={handleConfirm}
        />
      )} */}

      {/* {confirmOpenObsolote && (
        <WarningMessageObsolote
          confirmOpenObsolote={confirmOpenObsolote}
          handleConfirmClose={handleConfirmClose}
          handleConfirm={handleConfirm}
        />
      )}

      {cancleIncomplete && (
        <WarningMessageCancleIncomplete
          cancleIncomplete={cancleIncomplete}
          handleConfirmClose={handleConfirmClose}
        />
      )} */}
      <div className="text-center text-red-500 font-bold p-2">{message}</div>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          getRowId={(r) => r.student_id}
          rows={users}
          getRowHeight={() => "auto"}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 15, 20]}
          pagination
          checkboxSelection
        //   onSelectionModelChange={setSelectedRows}
          disableSelectionOnClick
          // onSelectionModelChange={disablePrintHanlder}
          // onCellEditCommit={(params) => setMajorEnable(params.id)}
          components={{
            NoRowsOverlay: () => (
              <div className="grid h-[100%] place-items-center">No Data</div>
            ),
            Pagination: CustomPagination,
          }}
        //   onCellEditCommit={handleEditCellChange} // Use the handleEditCellChange function
        />
      </Box>

      <div className="grid lg:grid-cols-1 p-5 shadow-sm">
        <LowerButtons
          exportButton={exportButton}
          selectedRows={selectedRows}
          exportAllButton={exportAllButton}
          handlePrintSelected={handlePrintSelected}
          session={session}
          certificate={true}
        />
      
      
        {/* <ExportButtons
          exportButton={exportButton}
          selectedRows={selectedRows}
          exportAllButton={exportAllButton}
        /> */}
      
      </div>
    </>
  );
};

export default HistoryList;
