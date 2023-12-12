/*
 * Created By: JABER Mohamad,Moetassem Chebbo
 * Project: SIS Application
 * File: components\Admin\StudentsList.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

import React from "react";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useRouter } from 'next/router';
// import moment from 'moment';
import axios from "axios";
// import Link from 'next/link';
import selection_data from "../../utilities/selection_data";
// import encrypt from '../../utilities/encrypt_decrypt/encryptText';
// import major_code from '../../utilities/major_code';
// import { LowerButtons } from './LowerButtons';
// import exportSelect from '../../utilities/ExcelExport/exportSelect';
// import exportAll from '../../utilities/ExcelExport/exportAll';
// import EmailAfterChangMajor from '../../utilities/emailing/emailAfterChangeMajor';
// import {
//   WarningMessageCancleIncomplete,
//   WarningMessageIncomplete,
//   WarningMessageObsolote,
// } from './WarningMessage';
// import decrypt from '../../utilities/encrypt_decrypt/decryptText';
import { useSession } from "next-auth/react";
import CustomPagination from "./Pagination";
// import AttendanceModal from '../../pages/programManager/ModalForm/AttendanceModal';
// import UpdateModal from '../../pages/programManager/ModalForm/UpdateModal';
import AddSchedule from "../AddSchedule";

const ClassListById = ({ users }) => {
  const [pageSize, setPageSize] = useState(10);
  const [message, setMessage] = useState("");
  // const statusData = selection_data.application_status_inList;
  // const presence = selection_data.presence;
  // const [presentEnable, setPesentEnable] = useState(null);
  // const [selectedRows, setSelectedRows] = useState([]);
  const { data: session } = useSession();
  // const [isModal, setisModal] = useState(false)
  // const [editModal, setEditModal] = useState(false)
  const [attendance, setAttendance] = useState(false);
  const [isAddSchedule, setIsAddSchedule] = useState(false);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [location, setLocation] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [classID, setClassID] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [theRoom, setTheRoom] = useState([]);
  const [teacherValue, setTeacherValue] = useState("");
  const [courseValue, setCourseValue] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [promotions, setPromotions] = useState("");
  const [details, setDetails] = useState([]);
  // const [data, setData] = useState([]);
  const [student, setStudent] = useState([]);
  const [course_type, setCourseType] = useState("");
  const [weekDays, setWeekDays] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [confirmOccupied, setConfirmOccupied] = useState(false);
  const [messages, setMessages] = useState("");
  const router = useRouter();

  const { majorId } = router.query;

  console.log('confirmOccupied from classlist : ', confirmOccupied)
  const getAllRooms = async () => {
    console.log(course_type);
    try {
      let table = "rooms";
      let { data } = await axios.post("/api/pmApi/getAll", { table });
      // console.log("rooms are ::  ", data.rows);
      setTheRoom(data.rows);
    } catch (error) {
      // console.log(error);
    }
  };

  // const handleFrom = (selectedValue) => {
  //   // Do something with the selected value
  //   // console.log("Selected Value:", selectedValue);
  //   setFromTime(selectedValue);
  // };

  // const handleTo = (selectedValue) => {
  //   // Do something with the selected value
  //   // console.log("Selected Value:", selectedValue);
  //   setToTime(selectedValue);
  // };


  const handleFrom = (e)=>{
    setFromTime(e.target.value)
    
  };
  const handleTo = (e)=>{
    setToTime(e.target.value)
    
    
  }
  const handleLocation = (selectedValue) => {

    setLocation(
      selectedValue.length > 0 &&
        theRoom.filter((room) => room.room_name === selectedValue)[0].room_id
    );
  };

  const handleSelect = (value) => {
    const isSelected = selectedValues.includes(value);
    if (isSelected) {
      setSelectedValues(selectedValues.filter((val) => val !== value));
      // console.log(selectedValues.filter((val) => val !== value));
      // console.log(selectedValues.length == 0);
    } else {
      setSelectedValues([...selectedValues, value]);
      // console.log([...selectedValues, value]);
      // console.log(selectedValues.length);
    }
  };
  const getDetails = async (event) => {
    try {

      setTeacherValue(event.teacher_id);
      setCourseValue(event.course_id);
      setDateFrom(event.startdate);
      setDateTo(event.enddate);
      setPromotions(event.promotion);
    } catch (error) {
      return error;
    }
  };
  const handleOpenNotificatonMessages = () => {
    setConfirmOccupied(true);
};
const handleCloseNotificatonMessages = () => {
    setConfirmOccupied(false);
    setIsClicked(false)
};

  const getStudent = async (event) => {
    try {
      const payload = {
        table: "courses",
        Where: "course_id",
        id: event.course_id,
      };

      const response = await axios.post("/api/pmApi/getAllCourses", payload);
      setCourseType(response.data.data[0].course_type);
      if (response.data.data[0].course_type !== "Elective") {
        let major_id = majorId;
        let promotion = event.promotion.replace(/\s/g, "");
        const { data } = await axios.post("/api/pmApi/getAllStudent", {
          major_id,
          promotion,
        });
        setStudent(data.data);
      } else {
        const payload = {
          promotion: event.promotion,
          major_id: majorId,
          course_id: event.course_id,
        };
        try {
          const data = await axios.post("/api/pmApi/getStudentAssign", payload);
          setStudent(data.data.data);
        } catch (error) {
          let major_id = majorId;
          let promotion = event.promotion.replace(/\s/g, "");
          // let promotion = promotionName
          // console.log("promotion", promotions);
          const { data } = await axios.post("/api/pmApi/getAllStudent", {
            major_id,
            promotion,
          });
          setStudent(data.data);
        }
      }
    } catch (error) {
      return error;
    }
  };

  const handleCancelSchedule = () => {
    setIsAddSchedule(false);
    setFromTime("");
    setToTime("");
    setLocation("");
    setSelectedValues([]);
  };
  const handleSaveSchedule = async () => {
    // e.preventDefault();
    // console.log("save");

    // Usage example:

    const getWeekDays = async (startDate, endDate, weekdays) => {
      const result = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        if (weekdays.includes(currentDate.getDay())) {
          result.push(currentDate.toISOString());
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return result;
    };
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    // const startDate1 = new Date("2023-06-21");
    // const endDate1 = new Date("2023-09-25");

    const weekDays = await getWeekDays(startDate, endDate, selectedValues);

    // console.log("weekDays :: ", weekDays);
    // console.log("weekDays :: ", selectedValues);

    if (
      selectedValues.length == 0 ||
      // fromTime.va == 0 ||
      // toTime.length == 0 ||
      location.length == 0
    ) {
      alert("Please fill all the data");
      setIsClicked(false);
    } else {
      // console.log("weekDays inside: ", weekDays);
      // console.log("weekDays inside: ", selectedValues);
      setIsClicked(true);
      
      let createTheSchedule = async () => {
        const formattedDates = weekDays.map((date) =>
          new Date(date).toISOString()
        );
        // console.log("date", formattedDates);
        setWeekDays(formattedDates);


        setIsClicked(true);
        let schedulesCreated = 0; // Initialize a counter for created schedules
        const totalSchedules = weekDays.length; // Calculate the total number of schedules

        const payload = {
          teacher_id: teacherValue,
          course_id: courseValue,
          major_id: majorId,
          fromTime: fromTime,
          toTime: toTime,
          room: location,
        };

        try {
          const createdAttendanceIds = [];

          for (let i = 0; i < weekDays.length; i++) {
            const attendance_date = weekDays[i];
            const payload2 = { ...payload, attendance_date };
      
            try {
              const data3 = await axios.post("/api/pmApi/createAttendanceReport", payload2);
      
              const attendance_id = data3.data.data;
              createdAttendanceIds.push(attendance_id);
      
              if (data3.data.code === 201) {
                for (let j = 0; j < student.length; j++) {
                  const student_id = student[j].student_id;
                  await axios.post("/api/pmApi/createAttendanceStudent", {
                    attendance_id,
                    student_id,
                  });
                }
              }
            } catch (error) {
              console.log(error.response.data.success)
              if (error.response && error.response.data.success === false) {
                setConfirmOccupied(true);
                setMessages(error.response.data.message);
              }
            }
      
            // Create the schedule for the current attendance record
            const attendance_id = createdAttendanceIds[i];
            console.log(attendance_id)
          
              const scheduleData = {
                classId: classID,
                days: [attendance_date], // Use the current attendance_date
                fromTime: fromTime,
                toTime: toTime,
                room: location,
                pmID: session.user.userid,
                attendanceId: attendance_id,
              };
        
              try {
                if(attendance_id.length !== 0){
                  const { data } = await axios.post("/api/pmApi/createSchedule", scheduleData);
        
                  if (data.success) {
                    schedulesCreated++; // Increment the counter for each successfully created schedule
                    
                    // Check if all schedules have been created
                    if (schedulesCreated === totalSchedules) {
                      // All schedules have been created, so we can set these states
                      setIsClicked(false);
                      setIsAddSchedule(false);
                      setSelectedValues([]);
                    }
                  }
                }else{
                     console.log("error")
                }
           
              } catch (error) {
                 return error
              }
                
          
        
     
          }
        } catch (error) {
            return error
        }
        
      };
      createTheSchedule();
    }
  };

  const handleShowAll = async (tmpclass_id) => {
    console.log("tmpclass_id ==> ", tmpclass_id);
  };
  setTimeout(() => {
    setMessage("");
  }, selection_data.message_disapear_timing);



  const columns = [
    {
      field: "course_id",
      headerName: "Course ID",
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: `teacher_firstname`,
      headerName: "Teacher FirstName",
      headerAlign: "center",
      align: "center",
      width: 150,
    },
    {
      field: `teacher_lastname`,
      headerName: "Teacher LastName",
      headerAlign: "center",
      align: "center",
      width: 150,
    },
    {
      field: "promotion",
      headerName: "Promotion",
      headerAlign: "center",
      align: "center",
      width: 90,
    },
    {
      field: "startdate",
      headerName: "Start Date",
      headerAlign: "center",
      align: "center",
      width: 90,
    },
    {
      field: "enddate",
      headerName: "End Date",
      headerAlign: "center",
      align: "center",
      width: 90,
    },

    // {
    //   field: 'present',
    //   headerName: 'Presence',
    //   headerAlign: 'center',
    //   align: 'center',
    //   width: 100,
    //   editable: true,

    //   renderCell: (params) => {
    //     return params.value ? (
    //       <>  Present</>
    //     ):(<>Absent</>);
    //   },

    //   cellClassName: (params) =>
    //     params.row.present === false
    //     ? 'text-red-600 font-bold'
    //     : params.row.present === true
    //     ? 'text-green-600 font-bold'
    //     : '',
    //     type: 'singleSelect',
    //     valueOptions: presence,

    // },
    // {
    //   field: 'attendance_date',
    //   headerName: 'Attendance Date',
    //   headerAlign: 'center',
    //   align: 'center',
    //   width: 150,
    //   valueFormatter: params =>
    //     moment(params?.value).format("DD/MM/YYYY"),
    // },

    {
      field: "action",
      headerName: "Action",
      width: `${(session.user.role === "2" || session.user.role === "3" )? 300 : 150}`,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            className="primary-button hover:text-white"
            onClick={() => {
              getDetails(params.row);
              // handlcourseType(params.row),
              getStudent(params.row);
              // , setEditModal(true)
              handleShowAll(params.row.tmpclass_id),
                setIsAddSchedule(true),
                setClassID(params.row.tmpclass_id),
                setToDate(params.row.enddate),
                setFromDate(params.row.startdate),
                getAllRooms();
            }}
            // disabled={params.id !== presentEnable}
            type="button"
            hidden={
              session.user.role === "1" || session.user.role === "0"
                ? true
                : false
            }
          >
            Add Schedule
          </button>
          {/* <button
            className='primary-button hover:text-white'

          >
            print

          </button> */}
          {/* <Link
            className='text-black'
            target='_blank'
            href={`${params.row.reportURL}`}
            // href={downloadPDF}
            
          > */}
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
              Archive
            </button>
          </Link> */}
          {/* </Link> */}
          {/* <button
            className='primary-button hover:text-white'
            onClick={() => handleChangeMajor(params.row)}
            disabled={params.id !== majorEnable}
            type='button'
            hidden={
              session.user.role === '1' || session.user.role === '3'
                ? true
                : false
            }
          >
            Change Major
          </button> */}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="text-center text-red-500 font-bold p-2">{message}</div>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          getRowId={(r) => r.tmpclass_id}
          rows={users}
          getRowHeight={() => "auto"}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 15, 20]}
          // pagination
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

      {/* <div className='grid lg:grid-cols-1 p-5 shadow-sm'>
        <LowerButtons
          exportButton={exportButton}
          setisModal={setisModal}
          selectedRows={selectedRows}
          exportAllButton={exportAllButton}
          handlePrintSelected={handlePrintSelected}
          session={session}
        />
      </div> */}
      {isAddSchedule && (
        <AddSchedule
        handleOpenNotificatonMessages={handleOpenNotificatonMessages}
        handleCloseNotificatonMessages={handleCloseNotificatonMessages}
        messages={messages}
        confirmOccupied={confirmOccupied}
          handleFrom={handleFrom}
          handleTo={handleTo}
          setIsClicked={setIsClicked}
          handleLocation={handleLocation}
          handleSelect={handleSelect}
          selectedValues={selectedValues}
          handleCancelSchedule={handleCancelSchedule}
          handleSaveSchedule={handleSaveSchedule}
          theroom={theRoom}
          setAttendance={setAttendance}
          isClicked={isClicked}
          attendance={attendance}
          setIsAddSchedule={setIsAddSchedule}
          teacherValue={teacherValue}
          courseValue={courseValue}
          promotions={promotions}
          dateFrom={dateFrom}
          dateTo={dateTo}
          details={details}
          setStudent={setStudent}
          setPromotions={setPromotions}
          setCourseValue={setCourseValue}
          setDetails={setDetails}
          weekDays={weekDays}
          student={student}
          setCourseType={setCourseType}
          setTeacherValue={setTeacherValue}
        />
      )}
    </>
  );
};

export default ClassListById;
