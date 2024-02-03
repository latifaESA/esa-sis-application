/*
 * Created By: JABER Mohamad,Moetassem Chebbo
 * Project: SIS Application
 * File: components\Admin\StudentsList.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

import React, { useEffect } from "react";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
// import { useRouter } from 'next/router';
// import moment from 'moment';
import axios from "axios";
// import Link from 'next/link';
import selection_data from "../../utilities/selection_data";
import moment from 'moment-timezone';

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
// const formatTime = (timeWithTimeZone) => {
//   const [hours, minutes] = timeWithTimeZone.split(':');
//   const formattedHours = (parseInt(hours) % 12 === 0) ? 12 : (parseInt(hours) % 12);

//   const period = parseInt(hours) < 12 ? 'AM' : 'PM';
//   return `${formattedHours}:${minutes} ${period}`;
// };


const ClassList = ({ users }) => {
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
  // const [course_type, setCourseType] = useState("");
  const [weekDays, setWeekDays] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [confirmOccupied, setConfirmOccupied] = useState(false);
  const [messages, setMessages] = useState("");
  const [timeResult, setTimeResult] = useState([])
  // const router = useRouter();
  const [isOnline, setIsOnLine] = useState('')


  const [roomName, setRoomName] = useState('')

  const [allrooms, setAllrooms] = useState([]);

  let allStages = [];
  let allID = []

  const [building, setBuilding] = useState("");
  const [zoomUserId, setZoomUserId] = useState()
  const [zoomAccessToken, setZoomAccessToken] = useState("")


  const getAllRooms = async () => {
    try {
      let table = "rooms";
      let { data } = await axios.post("/api/pmApi/getAll", { table });
      // console.log("rooms are ::  ", data.rows)
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

  const handleFrom = (e) => {
    setFromTime(e.target.value)

  };
  const handleTo = async (e) => {
    setToTime(e.target.value)


  }

  const handleLocation = async (selectedValue) => {

    setRoomName(selectedValue)

    setLocation(
      selectedValue.length > 0 &&
      theRoom.filter((room) => room.room_name === selectedValue)[0].room_id
    );


  };
  const handleStages = (selectedValue) => {
    setBuilding(selectedValue);
    setAllrooms([]);
    // console.log("allrooms1 :: ==> ", allrooms);
    theRoom.forEach((room) => {
      room.room_building === selectedValue &&
        setAllrooms((prev) => [...prev, room.room_name]);
    });
    // console.log("allrooms2 :: ==> ", allrooms);
  };

  theRoom.forEach((room) => {
    if (!allStages.includes(room.room_building)) {
      allStages.push(room.room_building);
    }
  });
  const deleteTable = async () => {
    try {
      await axios.post('/api/pmApi/deleteBooking')
    } catch (error) {
      return error
    }
  }

  const handleSelect = async (value) => {


    const isSelected = selectedValues.includes(value);
    if (isSelected) {

      setSelectedValues(selectedValues.filter((val) => val !== value));



      // console.log(selectedValues.filter((val) => val !== value));
      // console.log(selectedValues.length == 0);
    } else {
      // console.log('startdate' , startDate , selectedValues)
      // console.log('startdate' , startDate , selectedValues)
      // console.log('selectedValues'  , selectedValues)
      // console.log('value' , value)
      const weekDates = await getWeekDays(startDate, endDate, selectedValues)
      setTimeResult(weekDates)
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
    setIsOnLine('')
  };



  const getStudent = async (event) => {
    try {
      const payload = {
        table: "courses",
        Where: "course_id",
        id: event.course_id,
      };

      const response = await axios.post("/api/pmApi/getAllCourses", payload);
      // setCourseType(response.data.data[0].course_type);
      if (response.data.data[0].course_type !== "Elective") {
        let major_id = session.user?.majorid;
        let promotion = event.promotion.replace(/\s/g, "");
        const { data } = await axios.post("/api/pmApi/getAllStudent", {
          major_id,
          promotion,
        });
        setStudent(data.data);
      } else {
        const payload = {
          promotion: event.promotion,
          major_id: session.user?.majorid,
          course_id: event.course_id,
        };
        try {
          const data = await axios.post("/api/pmApi/getStudentAssign", payload);
          setStudent(data.data.data);
        } catch (error) {
          let major_id = session.user?.majorid;
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
  // const getWeekDays = async (startDate, endDate, weekdays) => {
  //   const result = [];
  //   const currentDate = new Date(startDate);

  //   while (currentDate <= endDate) {
  //     if (weekdays.includes(currentDate.getDay())) {
  //       result.push(currentDate.toISOString());
  //     }
  //     currentDate.setDate(currentDate.getDate() + 1);
  //   }

  //   return result;
  // };
  // const startDate = new Date(fromDate);
  // const endDate = new Date(toDate);
  // const startDate1 = new Date("2023-06-21");
  // const endDate1 = new Date("2023-09-25");
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

  useEffect(() => {
    getUser()
  }, [])
  const getZoomAccessToken = async () => {
    try {
      const { data } = await axios.get('/api/zoom_api/getZoomAccessToken')
      setZoomAccessToken(data.access_token)
      return data.access_token;
    } catch (error) {
      console.log('error access token : ', error)
      return
    }
  }

  const getUser = async () => {
    try {
      const theZoomToke = await getZoomAccessToken()
      let payload = {
        email: session?.user?.email,
        accessToken: theZoomToke
      }
      const { data } = await axios.post(`/api/zoom_api/getZoomUser`, payload)
      setZoomUserId(data.data.id)
      return;
    } catch (error) {
      console.log('error get user : ', error)
      return
    }
  }

  const handleSaveSchedule = async () => {


    const weekDays = await getWeekDays(startDate, endDate, selectedValues);
    // Usage example:
    // if (isOnline) {
    //   try {
    //     console.log('online')
    //     console.log('classId ', classID,
    //       'days ', selectedValues,
    //       'fromTime ', fromTime,
    //       'toTime ', toTime,
    //       'room ', '1',
    //       'pmID ', session.user.userid,
    //       // 'attendanceId ', attendance_id,
    //       'is_online ', isOnline
    //     )
    //     const weekDays = selectedValues.map(item => item + 1);
    //     const combinedFromDateTime = `${fromDate}T${fromTime}:00Z`;
    //     const combinedToDateTime = `${toDate}T${toTime}:00Z`;
    //     console.log(' from data : ', fromDate)
    //     console.log(' to data : ', toDate)
    //     console.log(' weekDays : ', weekDays.join(','))
    //     console.log("combinedFromDateTime : ", combinedFromDateTime)
    //     console.log("combinedToDateTime : ", combinedToDateTime)
    //     // const getUsers = await axios.get(`/api/pmApi/getZoomDetails?apiUrl=users&token=${data.access_token}`);
    //     // const getUser = await axios.post(`/api/pmApi/getZoomUser`, {email :  session?.user?.email, accessToken : data.access_token})
    //     // let targetedID = getUsers.data.data.users.filter(arr => arr.email === session?.user?.email)[0].id;
    //     // console.log('the targeted id : ', getUser)
    //     return;
    //   } catch (error) {
    //     console.log('the errror : ', error)
    //   }
    // }
    // return
    // console.log("weekDays :: ", weekDays);
    // console.log("weekDays :: ", selectedValues);


    if (
      selectedValues.length == 0
      // fromTime.va == 0 ||
      // toTime.length == 0 ||
      // location.length == 0
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
          major_id: session.user?.majorid,
          fromTime: fromTime,
          toTime: toTime,
          room: location,
          rooms: building
        };

        try {
          const createdAttendanceIds = [];

          for (let i = 0; i < weekDays.length; i++) {
            const attendance_date = weekDays[i];
            const payload2 = { ...payload, attendance_date };

            try {
              // Perform room availability check
              // const roomAvailabilityResponse = await CheckRoomISharePoint(roomName, weekDays, i);

              // if (roomAvailabilityResponse.ok && roomAvailabilityResponse.result.d.results.length >0) {

              //   // Room is not available, stop the process
              //   setConfirmOccupied(true);
              //   setMessages("Room not available");
              //   return; // Stop the process
              // } else if (roomAvailabilityResponse.ok && roomAvailabilityResponse.result.d.results.length <= 0) {
              // Room is available, continue with creating attendance record

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
              // }
            } catch (error) {
              if (error.response && error.response.data.success === false) {
                setConfirmOccupied(true);
                setMessages(error.response.data.message);
                return; // Stop the process
              }
            }

            // Continue with creating the schedule only if room is available and attendance record is created
            const attendance_id = createdAttendanceIds[i];

            if (isOnline === 'true') {
              let scheduleData = {
                classId: classID,
                days: [attendance_date],
                fromTime: fromTime,
                toTime: toTime,
                room: '75',
                pmID: session.user.userid,
                attendanceId: attendance_id,
                is_online: isOnline
              };
              try {
                if (attendance_id.length !== 0) {
                  const { data } = await axios.post("/api/pmApi/createScheduleOnline", scheduleData);
                  if (data.success) {
                    deleteTable()
                    allID.push(...data.scheduleId)
                    schedulesCreated++;
                    
                    if (schedulesCreated === totalSchedules) {
                      const weekDaysNumbers = selectedValues.map(item => item + 1);
                      const combinedFromDateTime = `${fromDate}T${fromTime}:00Z`;
                      const combinedToDateTime = `${toDate}T${toTime}:00Z`;
                      
                      let payload = {
                        accessToken : zoomAccessToken, 
                        userId : zoomUserId,
                        requestBody : {
                          topic: `${classID}`,
                          type: 3,
                          start_time: combinedFromDateTime,
                          recurrence: {
                            type: 2,
                            repeat_interval: 1,
                            weekly_days: weekDaysNumbers.join(','),  // 1 represents Monday, 4 represents Thursday
                            end_date_time: combinedToDateTime
                          },
                          settings: {
                            join_before_host: true,
                            auto_recording: "cloud",
                            mute_upon_entry: true,
                            waiting_room: true,
                            registrants_email_notification: true,
                          },
                        }
                      }
                      const {data} = await axios.post("/api/zoom_api/createZoomMeet", payload)
                      let payload1 = {
                        tmpscheduleIds : allID,
                        meetingIds : data.data.id,
                        zoomUrls : data.data.join_url
                      }
                      await axios.post("/api/zoom_api/updateScheduleZoom", payload1)
                      // create zoom
                      // update the schedule
                      setIsClicked(false);
                      setIsAddSchedule(false);
                      setSelectedValues([]);
                      setIsOnLine('')
                    }
                  }
                } else {
                  console.log("error");
                }
              } catch (error) {
                return error;
              }

            } else {
              let scheduleData = {
                classId: classID,
                days: [attendance_date],
                fromTime: fromTime,
                toTime: toTime,
                room: location,
                pmID: session.user.userid,
                attendanceId: attendance_id,
                is_online: isOnline
              };
              try {
                if (attendance_id.length !== 0) {
                  const { data } = await axios.post("/api/pmApi/createSchedule", scheduleData);

                  if (data.success) {
                    await handleSharePointBookingRoom([weekDays[i]], [attendance_id], 0);
                    deleteTable()
                    schedulesCreated++;

                    if (schedulesCreated === totalSchedules) {
                      setIsClicked(false);
                      setIsAddSchedule(false);
                      setSelectedValues([]);
                      setIsOnLine('')

                    }
                  }
                } else {
                  console.log("error");
                }
              } catch (error) {
                return error;
              }
            }


          }
        } catch (error) {
          return error;
        }

      };
      createTheSchedule();
    }
  };





  // Your client-side code
  const getSharePointToken = async () => {
    try {
      const response = await fetch('/api/pmApi/getsharePointToken', {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=verbose',
          'Content-Type': 'application/json;odata=verbose',
        }
      });

      const data = await response.json();

      if (!data.access_token) {
        throw new Error('Access token not obtained');
      }

      return data.access_token;
    } catch (error) {
      console.error('Error obtaining SharePoint access token:', error.message);
      throw error;
    }
  };

  const handleSharePointBookingRoom = async (week, attendance_id, currentIndex) => {
    try {
      const accessToken = await getSharePointToken();

      if (currentIndex < week.length) {
        const bookingDay = new Date()
        const formattedBookingDay = moment(bookingDay).format('MM/DD/YYYY');
        const dates = new Date(week[currentIndex]);

        const formattedDate = moment(dates).format('YYYY-MM-DD');
        const fromTimeSplit = fromTime.split('+')[0];
        const toTimeSplit = toTime.split('+')[0];

        // Beirut/Lebanon is in UTC+2 during standard time and UTC+3 during daylight saving time
        const utcOffset = 4; // Change this value if daylight saving time is not in effect

        // Convert the local time to UTC and adjust to Beirut/Lebanon time zone
        const fromTimes = moment(`${formattedDate}T${fromTimeSplit}Z`).utcOffset(utcOffset, true).toISOString();
        const toTimes = moment(`${formattedDate}T${toTimeSplit}Z`).utcOffset(utcOffset, true).toISOString();

        const apiUrl =
          "https://esalb.sharepoint.com/sites/RoomBooking/_api/web/lists/getbytitle('BookingRoom')/items";


        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({

            __metadata: {
              type: "SP.Data.BookingRoomListItem",
            },
            Title: `${roomName}`,
            Space: `${building}`,
            BookedBy: `${session.user?.name}`,
            BookingDate: week[currentIndex],
            BookingDay: `${formattedBookingDay}`,
            FromTime: fromTimes,
            ToTime: toTimes,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Booking submitted to SharePoint:", data);

        // Log the ID of the newly added item
        if (data && data.d && data.d.Id) {


          // Update the SharePoint ID in the schedule
          await axios.post("/api/pmApi/UpdateSharePointIdSchedule", {
            sharepointId: data.d.Id,
            attendanceId: attendance_id,
          });
          // console.log('Update SharePoint ID response:', updateResponse);

          // Continue to the next date in the array
          handleSharePointBookingRoom(week, attendance_id, currentIndex + 1);
        }
      }
    } catch (error) {
      console.error("Error submitting booking to SharePoint:", error.message);
    }
  };

  const handleShowAll = async (tmpclass_id) => {
    console.log(tmpclass_id);
  };
  setTimeout(() => {
    setMessage("");
  }, selection_data.message_disapear_timing);



  const getRoomBooking = async () => {
    try {
      const accessToken = await getSharePointToken();

      const apiUrl = `https://esalb.sharepoint.com/sites/RoomBooking/_api/web/lists/getbytitle('BookingRoom')/items`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json;odata=verbose',
          'Content-Type': 'application/json;odata=verbose',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (data.d.results.length > 0) {
        const start = new Date().getMilliseconds()
        for (const booking of data.d.results) {
          // Format the date to 'YYYY-MM-DDT00:00:00Z'


          const formattedDate = moment(booking.BookingDate).format('YYYY-MM-DDT00:00:00[Z]');


          // Make the API call
          await axios.post('/api/pmApi/createBooking', {
            bookingId: booking.ID,
            room: booking.Title,
            space: booking.Space,
            bookingBy: booking.BookedBy,
            date: formattedDate,
            fromTime: booking.FromTime,
            toTime: booking.ToTime,
          });
          // console.log(result);
        }
        const end = new Date().getMilliseconds() - start
        console.log('end', end)
      }

      return { ok: true, result: data };

    } catch (error) {
      console.error('Error checking room availability in SharePoint:', error.message);
      // Assuming an error means the room is not available
      return { ok: false, result: false };
    }
  };

  // useEffect(() => {
  //   getRoomBooking();
  // }, []);


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
      width: `${(session.user.role === "2" || session.user.role === "3") ? 300 : 150}`,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            className="primary-button hover:text-white"
            onClick={() => {
              getRoomBooking()
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
          setTheRoom={setTheRoom}
          setIsOnLine={setIsOnLine}
          isOnline={isOnline}

          timeResult={timeResult}
          handleOpenNotificatonMessages={handleOpenNotificatonMessages}
          handleCloseNotificatonMessages={handleCloseNotificatonMessages}
          messages={messages}
          allrooms={allrooms}
          allStages={allStages}
          handleStages={handleStages}
          building={building}
          confirmOccupied={confirmOccupied}
          handleFrom={handleFrom}
          handleTo={handleTo}
          setIsClicked={setIsClicked}
          handleLocation={handleLocation}
          fromTime={fromTime}
          toTime={toTime}
          roomName={roomName}
          weekDays={weekDays}
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
          setWeekDays={setWeekDays}
          student={student}
          // setCourseType={setCourseType}
          setTeacherValue={setTeacherValue}
        />
      )}
    </>
  );
};

export default ClassList;
