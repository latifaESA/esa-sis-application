import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import moment from 'moment'
import {
  SevenColGrid,
  Wrapper,
  HeadDays,
  DateControls,
  StyledEvent,
  // SeeMore,
  // PortalWrapper,
  // ScheduleForm,
} from "./Calender.styled";
import { NotificatonMessage } from "../../components/Dashboard/WarningMessage";
import { DAYS, MOCKAPPS } from "./conts";
import {
  datesAreOnSameDay,
  // getDarkColor,
  getDaysInMonth,
  getMonthYear,
  getSortedDays,
  nextMonth,
  prevMonth,
  // range,
  // sortDays
} from "./utils";
import {
  ArrowLeftCircleIcon,
  ArrowLeftIcon,
  ArrowRightCircleIcon,
  ArrowRightIcon,
  PlusCircleIcon,
  // TrashIcon,
} from "@heroicons/react/24/solid";
import CustomSelectBox from "../../pages/programManager/customSelectBox";
import axios from "axios";
import { WarningMessageSchedule } from "../Dashboard/WarningMessage";
const formatTime = (timeWithTimeZone) => {

  const [time] = timeWithTimeZone.split("+"); // Remove the timezone offset
  const [hours, minutes] = time.split(":");
  const formattedHours = parseInt(hours) % 12 === 0 ? 12 : parseInt(hours) % 12;

  const period = parseInt(hours) < 12 ? "AM" : "PM";
  return `${formattedHours}:${minutes} ${period}`;
};





export const Calender = ({ schedule, setSchedule }) => {
  const [select, setSelect] = useState(false)

  const { data: session } = useSession();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(MOCKAPPS);
  const dragDateRef = useRef();
  const dragindexRef = useRef();
  // const [showPortal, setShowPortal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [portalData, setPortalData] = useState({});
  const [classes, setClasses] = useState("");
  const [allClasses, setAllClasses] = useState([]);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [place, setPlace] = useState("");
  // const [isSave, setIsSave] = useState(false);
  const [theDate, setTheDate] = useState("");
  const [scheduleDate, setScheduleDate] = useState([]);
  // const [allRoomBuilding, setAllRoomBuilding] = useState([]);
  const [allroomName, setAllRoomName] = useState([]);
  const [roomBuilding, setRoomBuilding] = useState("");
  const [roomName, setRoomName] = useState("");
  const [tmpscheduleID, setTmpscheduleID] = useState(null);
  const [confirmOpenMessage, setConfirmOpenMessage] = useState(false);
  const [click, setIsClick] = useState(false);
  const [clickEdit, setIsClickEdit] = useState(false);
  const [student, setStudent] = useState([]);
  const [messages, setMessage] = useState("")
  const [confirmOpenMessageNotification, setConfirmOpenMessageNotification] = useState(false);
  const [confirmOccupied, setConfirmOccupied] = useState(false);



  const getAllRooms = async () => {
    try {
      let table = "rooms";
      let { data } = await axios.post("/api/pmApi/getAll", { table });
      setAllRoomName(data.rows);
    } catch (error) {
      // console.log(error);
    }
  };


  const getSchedule = async () => {


    const datesArray = [];
    schedule.forEach((sched) => {

      datesArray.push({
        tmpschedule_id: sched.tmpschedule_id,
        class_id: sched.class_id,
        date: new Date(sched.day),
        course: sched.course_name,
        courseID: sched.course_id,
        title: sched.course_name,
        type: sched.course_type,
        teacher: `${sched.teacher_firstname} ${sched.teacher_lastname}`,
        from: sched.from_time,
        to: sched.to_time,
        room_building: sched.room_building,
        room_name: sched.room_name,
        attendanceId: sched.attendance_id,
        color: "#00CED1",
      });
    });

    setScheduleDate(datesArray);

    // console.log("datesArray of schedule:  ", datesArray);
    // console.log("schedule:  ", data.data);
  };
  const getData = async () => {
    try {
      let pmID = session.user.majorid;
      let { data } = await axios.post("/api/pmApi/getScheduleByPMId", { pmID });
      setSchedule(data.data)
    } catch (error) {
      return error
    }
  }


  const getClass = async () => {
    let table = "tmpclass";
    let colName = "pm_id";
    let val = session.user.userid;
    let { data } = await axios.post("/api/pmApi/getAllCondition", {
      table,
      colName,
      val,
    });

    // console.log("all classes:  ==> ", data.rows);

    // setAllClasses(data.rows.map(clas => clas.course_id))
    setAllClasses(data.rows);
  };
  useEffect(() => {
    getSchedule();
    getClass();

  }, [schedule]);
  useEffect(() => {
    getAllRooms();
    getData()
  }, [])

  const areDatesEqual = (date1, date2) => {
    return date1.getTime() === date2.getTime();
  };

  const handleAddPrevious = (data) => {
    // console.log("date.getFullYear() === > >", data.date.getFullYear());
    // console.log("date.getMonth() === > >", data.date.getMonth());
    // console.log("date.getDate() === >", data.date.getDate());

    let ifPreviousExists = events.some((ev) =>
      areDatesEqual(
        ev.date,
        new Date(
          data.date.getFullYear(),
          data.date.getMonth(),
          data.date.getDate() - 1
        )
      )
    );
    // // console.log('if exists previously ===>>',)

    !ifPreviousExists &&
      setEvents((prev) => [
        ...prev,
        {
          date: new Date(
            data.date.getFullYear(),
            data.date.getMonth(),
            data.date.getDate() - 1
          ),
          title: data.title,
          color: "#8ABAD3",
          type: data.type,
          teacher: "peter germanos",
          from: data.from,
          to: data.to,
          place: data.place,
          course: "MAth21",
        },
      ]);
  };
  const handleOpenNotificatonMessages = () => {
    setConfirmOpenMessageNotification(true);
  };
  const handleCloseNotificatonMessages = () => {
    setConfirmOpenMessageNotification(false);


  };
  const handleOpenMessages = () => {
    setConfirmOccupied(true);
  };
  const handleCloseMessages = () => {
    setIsClick(false)
    setConfirmOccupied(false);

  };

  const handleAddNext = (data) => {
    // console.log("date.getFullYear() === > >", data.date.getFullYear());
    // console.log("date.getMonth() === > >", data.date.getMonth());
    // console.log("date.getDate() === >", data.date.getDate());

    let ifNextExists = events.some((ev) =>
      areDatesEqual(
        ev.date,
        new Date(
          data.date.getFullYear(),
          data.date.getMonth(),
          data.date.getDate() + 1
        )
      )
    );
    // // console.log('if exists previously ===>>',)dr

    !ifNextExists &&
      setEvents((prev) => [
        ...prev,
        {
          date: new Date(
            data.date.getFullYear(),
            data.date.getMonth(),
            data.date.getDate() + 1
          ),
          title: data.title,
          color: "#8ABAD3",
          type: data.type,
          teacher: "peter germanos",
          from: data.from,
          to: data.to,
          place: data.place,
          course: "MAth21",
        },
      ]);
  };

  const drag = (index, e) => {
    dragindexRef.current = { index, target: e.target };
  };

  const onDragEnter = (date, e) => {
    e.preventDefault();
    dragDateRef.current = { date, target: e.target.id };
  };

  const drop = async (ev, e) => {
    e.preventDefault();

    if (
      !(
        (new Date(ev.date).getFullYear(),
          new Date(ev.date).getMonth(),
          new Date(ev.date).getDate()) ==
        (new Date(dragDateRef.current.date).getFullYear(),
          new Date(dragDateRef.current.date).getMonth(),
          new Date(dragDateRef.current.date).getDate())
      )
    ) {
      handlePlace(ev.room_name);
      if (place != '') {

        const attendanceData = await handleCreateAttendanceDragDrop(ev, dragDateRef.current.date, place);

        if (attendanceData.data.code != 200) {
          let { data } = await axios.post("/api/pmApi/createSingleSchedule", {
            classID: ev.class_id,
            day: new Date(dragDateRef.current.date),
            fromTime: ev.from,
            toTime: ev.to,
            room_id: place,
            pm_id: session.user.userid,
            attendanceId: attendanceData.data.data
          });


          if (data.success) {
            setStudent([])
            getData();
          }
        } else {

          setConfirmOpenMessageNotification(true)
          setMessage(attendanceData.data.message)
        }


      } else {

        setConfirmOpenMessageNotification(true)
        setMessage("missing data")
      }

    }
  };

  const handlePlace = (selectedValue) => {
    // handlePlace
    // Do something with the selected value
    // console.log("Selected Value:", selectedValue);
    // setPlace(selectedValue)

    setPlace(
      selectedValue.length > 0 &&
      allroomName.filter((room) => room.room_name === selectedValue)[0]
        .room_id
    );
  };

  const handleFrom = (e) => {

    setFromTime(e.target.value)
    // Do something with the selected value
    // console.log("Selected Value:", selectedValue);
    // setFromTime(selectedValue);
  };

  const handleTo = (e) => {
    // Do something with the selected value
    // console.log("Selected Value:", selectedValue);
    setToTime(e.target.value);
  };

  const handleClass = (selectedValue) => {

    // Do something with the selected value
    setSelect(true)
    selectedValue.length > 0 &&
      setClasses(
        allClasses.filter((clas) => clas.course_id === selectedValue)[0]
          .tmpclass_id
      );

  };

  const addEvent = (date, event) => {
    event.preventDefault();
    setShowForm(true);
    if (!event.target.classList.contains("StyledEvent")) {
      date.setHours(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      // console.log("date.setHours(0) === > >", date.setHours(0));
      // console.log("date.setSeconds(0) === > >", date.setSeconds(0));
      // console.log("date.setMilliseconds(0) === > >", date.setMilliseconds(0));
      // console.log("date===>", date);
      setTheDate(date);
    }
  };


  const handleClose = () => {
    setShowForm(false);
  };

  useEffect(() => {
    getStudentSchedule();

  }, [student, select])


  const getStudentSchedule = async () => {
    if (select) {
      try {

        const payload1 = {
          table: 'tmpclass',
          Where: 'tmpclass_id',
          id: classes
        }

        const data1 = await axios.post('/api/pmApi/getAllCourses', payload1)

        const course_id = data1.data.data[0].course_id;
        const payload2 = {
          table: 'courses',
          Where: 'course_id',
          id: course_id
        }

        const data2 = await axios.post('/api/pmApi/getAllCourses', payload2)


        if (data2.data.data[0].course_type !== "Elective") {
          let major_id = session.user.majorid;
          let promotion = data1.data.data[0].promotion.replace(/\s/g, "");
          const { data } = await axios.post("/api/pmApi/getAllStudent", {
            major_id,
            promotion,
          });
          setStudent(data.data);
        } else {
          const payload = {
            major_id: session.user.majorid,
            promotion: data1.data.data[0].promotion.replace(/\s/g, ""),
            course_id: course_id,
          };
          try {
            const data = await axios.post("/api/pmApi/getStudentAssign", payload);
            setStudent(data.data.data);
          } catch (error) {
            let major_id = session.user.majorid;
            let promotion = data1.data.data[0].promotion.replace(/\s/g, "");
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
    }
  }


  const handleCreateAttendance = () => {
    return new Promise((resolve, reject) => {
      try {
        const payload1 = {
          table: 'tmpclass',
          Where: 'tmpclass_id',
          id: classes
        }

        axios.post('/api/pmApi/getAllCourses', payload1)
          .then((response1) => {
            const teacher_id = response1.data.data[0].teacher_id;
            const course_id = response1.data.data[0].course_id;

            const payload = {
              teacher_id,
              course_id,
              attendance_date: theDate,
              major_id: session.user.majorid,
              fromTime: fromTime,
              toTime: toTime,
              room_id: place,
            };

            axios.post("/api/pmApi/createAttendanceReport", payload)
              .then((response2) => {
                const attendance_id = response2.data.data;

                if (attendance_id) {
                  const createAttendanceStudentPromises = student.map((s) => {
                    return axios.post("/api/pmApi/createAttendanceStudent", {
                      attendance_id,
                      student_id: s.student_id,
                    });
                  });

                  Promise.all(createAttendanceStudentPromises)
                    .then(() => {
                      resolve(response2);
                    })
                    .catch((error) => {

                      reject(error);
                    });
                } else {
                  resolve(response2);
                }
              })
              .catch((error) => {
                if (error.response && error.response.data.success === false) {
                  setConfirmOccupied(true);
                  setMessage(error.response.data.message);
                }

                reject(error);
              });
          })
          .catch((error) => {

            reject(error);
          });
      } catch (error) {

        reject(error);
      }
    });
  };

  const getStudentsDragDrop = (ev) => {
    return new Promise((resolve, reject) => {
      if (ev.class_id != " ") {
        try {
          const payload1 = {
            table: 'tmpclass',
            Where: 'tmpclass_id',
            id: ev.class_id
          };

          axios.post('/api/pmApi/getAllCourses', payload1)
            .then(async (data1) => {
              const course_id = data1.data.data[0].course_id;
              const payload2 = {
                table: 'courses',
                Where: 'course_id',
                id: course_id
              };

              try {
                const data2 = await axios.post('/api/pmApi/getAllCourses', payload2);

                if (data2.data.data[0].course_type !== "Elective") {
                  let major_id = session.user.majorid;
                  let promotion = data1.data.data[0].promotion.replace(/\s/g, "");
                  const { data } = await axios.post("/api/pmApi/getAllStudent", {
                    major_id,
                    promotion,
                  });
                  resolve(data.data);
                } else {
                  const payload = {
                    major_id: session.user.majorid,
                    promotion: data1.data.data[0].promotion.replace(/\s/g, ""),
                    course_id: course_id,
                  };

                  try {
                    const data = await axios.post("/api/pmApi/getStudentAssign", payload);
                    resolve(data.data.data);
                  } catch (error) {
                    let major_id = session.user.majorid;
                    let promotion = data1.data.data[0].promotion.replace(/\s/g, "");
                    const { data } = await axios.post("/api/pmApi/getAllStudent", {
                      major_id,
                      promotion,
                    });
                    resolve(data.data);
                  }
                }
              } catch (error) {
                reject(error);
              }
            })
            .catch((error) => {
              reject(error);
            });
        } catch (error) {
          reject(error);
        }
      }
    });
  };

  const handleCreateAttendanceDragDrop = (ev, date , place) => {
    return new Promise((resolve, reject) => {
      try {
        const payload1 = {
          table: 'tmpclass',
          Where: 'tmpclass_id',
          id: ev.class_id
        };

        axios.post('/api/pmApi/getAllCourses', payload1)
          .then(async (data1) => {
            const payload = {
              teacher_id: data1.data.data[0].teacher_id,
              course_id: data1.data.data[0].course_id,
              attendance_date: new Date(date),
              major_id: session.user.majorid,
              fromTime: ev.from,
              toTime: ev.to,
              room:place
            };

            const data = await axios.post(
              "/api/pmApi/createAttendanceReport",
              payload
            );

            const response = await getStudentsDragDrop(ev);
            const attendance_id = data.data.data;
            if (attendance_id) {
              for (let i = 0; i < response.length; i++) {
                const student_id = response[i].student_id;
                await axios.post("/api/pmApi/createAttendanceStudent", {
                  attendance_id,
                  student_id,
                });
              }
            }
            resolve(data);
          })
          .catch((error) => {
            if (error.response && error.response.data.success === false) {
              setConfirmOccupied(true);
              setMessage(error.response.data.message);
            }

            reject(error);
          });
      } catch (error) {

        reject(error);
      }
    });
  };


  // getDarkColor() is a function to get a random color
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setIsClick(true)
      const attendanceData = await handleCreateAttendance();

      let { data } = await axios.post("/api/pmApi/createSingleSchedule", {
        classID: classes,
        day: theDate,
        fromTime: fromTime,
        toTime: toTime,
        room_id: place,
        pm_id: session.user.userid,
        attendanceId: attendanceData.data.data
      });

      // console.log("axios data ==>  ", place);
      if (data.success) {
        setShowForm(false)
        setIsClick(false);
        setStudent([])
        getData();
      }
    } catch (error) {
      return error
    }

    // setShowForm(false)

  }

  const handleOnClickEvent = (event) => {
    console.log(event)
    setConfirmOpenMessage(true)
    // setShowPortal(true);
    setPortalData(event);
  };

  const handlePotalClose = () => {
    // setShowPortal(false)
    setConfirmOpenMessage(false)
  };

  const handleDelete = async () => {
    // setEvents((prevEvents) =>
    //   prevEvents.filter((ev) => ev.date !== portalData.date)
    // );
    // handlePotalClose();
    try {

      const payload = {
        table: "attendance",
        colName: "attendance_id",
        id: portalData.attendanceId
      }
      const payload2 = {
        table: "attendance_report",
        colName: "attendance_id",
        id: portalData.attendanceId
      }
      await axios.post("/api/pmApi/delete", payload);
      // console.log(data1)

      let table = "tmpschedule";
      let colName = "tmpschedule_id";
      let id = portalData.tmpschedule_id;
      let { data } = await axios.post("/api/pmApi/delete", {
        table,
        colName,
        id,
      });

      await axios.post("/api/pmApi/delete", payload2);



      // console.log("deleted:  ==> ", data);
      if (data.rowCount > 0) {
        handlePotalClose();
        getData();
      }
    } catch (error) {

      return error
    }

    // // console.log(id)
  };
console.log(confirmOccupied)
  const handleCloseEdit = () => {
    setShowFormEdit(false);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsClickEdit(true)
    // setShowFormEdit(false)
    // console.log("the edit form: ==> ", {
    //   classID:
    //     typeof classes === "string"
    //       ? allClasses.filter((clas) => clas.course_id === classes)[0]
    //           .tmpclass_id
    //       : classes,
    //   day: theDate,
    //   fromTime: fromTime,
    //   toTime: toTime,
    //   room_id:
    //     place > 0
    //       ? place
    //       : allroomName.filter((rom) => rom.room_name === roomName)[0].room_id,
    //   pm_id: session.user.userid,
    //   tmpscheduleID,
    // });
    // tmpscheduleID, classID, day, fromTime, toTime, room_id, pm_id
    // let pmID = session.user.userid;
    let schedData = {
      // pm_id: pmID,
      tmpscheduleID: tmpscheduleID,
      classID:
        typeof classes === "string"
          ? allClasses.filter((clas) => clas.course_id === classes)[0]
            .tmpclass_id
          : classes,
      day: theDate,
      fromTime: fromTime,
      toTime: toTime,
      room_id:
        place > 0
          ? place
          : allroomName.filter((rom) => rom.room_name === roomName)[0].room_id,
      pm_id: session.user.userid,
    };
    // console.log("schedData  :", schedData);

    let { data } = await axios.post(
      "/api/pmApi/updateSingleSchedule",
      schedData
    );
    if (data.success) {

      getData();
      setIsClickEdit(false)
      setShowFormEdit(false);
    }
    // console.log("the update change:  ", data);
  };

  const handleEdit = (e, event, date) => {
    e.preventDefault();
    // console.log(event);
    setShowFormEdit(true);
    setFromTime(formatTime(event.from));
    setToTime(formatTime(event.to));
    setClasses(event.courseID);
    setRoomBuilding(event.room_building);
    setRoomName(event.room_name);
    setTheDate(date);
    setTmpscheduleID(event.tmpschedule_id);
  };




  return (
    <>

      <Wrapper>
        <DateControls>
          {/* <button
          onClick={(e) => {
            e.preventDefault();
            prevMonth(currentDate, setCurrentDate)
        }}
        >left</button> */}
          <ArrowLeftCircleIcon
            className="w-10 h-10 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              prevMonth(currentDate, setCurrentDate);
            }}
          />
          {getMonthYear(currentDate)}
          {/* <button
          onClick={(e) => {
            e.preventDefault();
            nextMonth(currentDate, setCurrentDate)
        }}
        >right</button> */}

          <ArrowRightCircleIcon
            className="w-10 h-10 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              nextMonth(currentDate, setCurrentDate);
            }}
          />
        </DateControls>
        <SevenColGrid>
          {DAYS.map((day, index) => (
            <HeadDays key={index} className="nonDRAG">
              {day}
            </HeadDays>
          ))}
        </SevenColGrid>

        <SevenColGrid
          fullheight={true}
          is28Days={getDaysInMonth(currentDate) === 28}
        >
          {getSortedDays(currentDate).map((day, index) => (
            <div
              key={index}
              id={`${currentDate.getFullYear()}/${currentDate.getMonth()}/${day}`}
              onDragEnter={(e) =>
                onDragEnter(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                  ),
                  e
                )
              }
              onDragOver={(e) => e.preventDefault()}
            // onDragEnd={(e)=>drop(e)}
            >
              <span
                className={`nonDRAG ${datesAreOnSameDay(
                  new Date(),
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                  )
                )
                  ? "active"
                  : ""
                  }`}
              >
                {day}
              </span>

              {/* <EventWrapper>
              {events.map(
                (ev, index) =>
                {
                  // console.log('ev:===> ',ev)
                  // console.log(ev.date)
                  // console.log(new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                  ))
                  // console.log('isld==>',datesAreOnSameDay(
                    ev.date,
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day
                    )
                  ) )
                  datesAreOnSameDay(
                    ev.date,
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day
                    )
                  ) 
                  && (     
                    // <div>{ev.title}</div>                
                    <StyledEvent
                    //   onDragStart={(e) => drag(index, e)}
                      onClick={() => handleOnClickEvent(ev)}
                    //   draggable
                      className="StyledEvent"
                      id={`${ev.color} ${ev.title}`}
                      key={ev.title}
                      bgColor={ev.color}
                    >
                      {ev.title}
                    </StyledEvent>
                  )
                  
                }
                  
              )}
              {day && <PlusCircleIcon className="h-7 w-7 cursor-pointer" onClick={(e) =>
                    addEvent(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day
                      ),
                      e
                    )
                  }/>}
                  

            </EventWrapper> */}

              <EventWrapper>
                {scheduleDate.map(
                  (ev, index) =>

                    datesAreOnSameDay(
                      ev.date,
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day
                      )

                    ) && (

                      <StyledEvent
                        className="StyledEvent"
                        onDragStart={(e) => drag(index, e)}
                        draggable
                        id={`${ev.color} ${ev.title}`}
                        key={`${ev.title} ${Math.floor(Math.random() * (100 - 1 + 1)) + 1
                          }`}
                        bgColor={ev.color}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnd={(e) => drop(ev, e)}
                      >
                        <div className="flex justify-between" name="arrows">
                          <ArrowLeftIcon
                            className="h-7 w-7 cursor-pointer"
                            id="left"
                            onClick={() => handleAddPrevious(ev)}
                          />
                          <ArrowRightIcon
                            className="h-7 w-7 cursor-pointer"
                            id="right"
                            onClick={() => handleAddNext(ev)}
                          />
                        </div>

                        <div>{ev.course}</div>
                        {/* <div>{ev.title}</div> */}
                        <div>{ev.type}</div>
                        <div>{ev.teacher}</div>
                        <div>{formatTime(ev.from)}</div>
                        <div>{formatTime(ev.to)}</div>
                        <div>{ev.room_building}</div>
                        <div>{ev.room_name}</div>
                        <div name="actors">
                          <span
                            name="edit"
                            onClick={(e) =>
                              handleEdit(
                                e,
                                ev,
                                new Date(
                                  currentDate.getFullYear(),
                                  currentDate.getMonth(),
                                  day
                                )
                              )
                            }
                          >
                            edit
                          </span>
                          <span
                            name="delete"
                            onClick={() => handleOnClickEvent(ev)}
                          >
                            delete
                          </span>
                        </div>
                      </StyledEvent>
                    )
                )}
              </EventWrapper>
              {

                day && (
                  <PlusCircleIcon
                    className="h-10 w-10 cursor-pointer"
                    onClick={(e) =>
                      addEvent(
                        new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth(),
                          day
                        ),
                        e
                      )
                    }
                  />
                )
              }
            </div>
          ))}
        </SevenColGrid>
        {/* {showPortal && (
        <Portal
          {...portalData}
          handleDelete={handleDelete}
          handlePotalClose={handlePotalClose}
        />
      )} */}
        {confirmOpenMessage && (
          <WarningMessageSchedule
            details={portalData}
            confirmOpenDelete={handleDelete}
            handleConfirmClose={handlePotalClose}

          />
        )}
        {showForm && (
          <AddSchedules
            handleClose={handleClose}
            click={click}
            handleOpenNotificatonMessages={handleOpenMessages}
            handleCloseNotificatonMessages={handleCloseMessages}
            messages={messages}
            confirmOccupied={confirmOccupied}
            allClasses={allClasses}
            handleClass={handleClass}
            handleFrom={handleFrom}
            handleTo={handleTo}
            handlePlace={handlePlace}
            theroom={allroomName}
            handleSave={handleSave}
          />
        )}
        {confirmOpenMessageNotification && (
          <NotificatonMessage
            handleOpenNotificatonMessages={handleOpenNotificatonMessages}
            handleCloseNotificatonMessages={handleCloseNotificatonMessages}
            messages={messages}
          />
        )}
        {confirmOccupied  && (
          <NotificatonMessage
            handleOpenNotificatonMessages={handleOpenMessages}
            handleCloseNotificatonMessages={handleCloseMessages}
            messages={messages}
          />
        )}


        {showFormEdit && (
          <AddSchedule

            handleClose={handleCloseEdit}
            allClasses={allClasses}
            handleClass={handleClass}
            clickEdit={clickEdit}
            handleFrom={handleFrom}
            handleTo={handleTo}
            handlePlace={handlePlace}
            theroom={allroomName}
            handleSave={handleSaveEdit}
            thefrom={fromTime}
            theto={toTime}
            theclass={classes}
            theroombuilding={roomBuilding}
            theroomname={roomName}
            isEdit={true}
          />
        )}
      </Wrapper>
    </>

  );
};

const EventWrapper = ({ children }) => {
  // if (children.filter((child) => child).length)
  return (
    <>
      {children}
      {/* {children.filter((child) => child).length > 2 && (
          <SeeMore
            onClick={(e) => {
              e.stopPropagation();
              // console.log("clicked p");
            }}
          >
            see more...
          </SeeMore>
        )} */}
    </>
  );
};

const formatTimeForInput = (time) => {
  return moment(time, "h:mm A").format("HH:mm");
};


const AddSchedule = ({
  handlePlace,
  handleFrom,
  handleTo,
  allClasses,
  handleClass,
  handleClose,
  handleSave,
  theroom,
  thefrom,
  theto,
  theclass,
  clickEdit,
  theroombuilding,
  theroomname,
  isEdit,
}) => {



  let classNames = allClasses.map((clss) => clss.course_id);

  const [allrooms, setAllrooms] = useState([]);
  let allStages = [];

  const [building, setBuilding] = useState("");
  const handleStages = (selectedValue) => {
    setBuilding(selectedValue);
    setAllrooms([]);
    // console.log("allrooms1 :: ==> ", allrooms);
    theroom.forEach((room) => {
      room.room_building === selectedValue &&
        setAllrooms((prev) => [...prev, room.room_name]);
    });
    // console.log("allrooms2 :: ==> ", allrooms);
  };

  const allroomsRef = useRef([]);
  const handleStages1 = (selectedValue) => {
    theroom.forEach((room) => {
      if (room.room_building === selectedValue) {
        allroomsRef.current.push(room.room_name);
      }
    });
  };

  isEdit && handleStages1(theroombuilding);

  theroom.forEach((room) => {
    if (!allStages.includes(room.room_building)) {
      allStages.push(room.room_building);
    }
  });



  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-gray-700 text-3xl font-bold">
                Update Schedule
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"

              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 pr-12 h-3/4  flex-auto overflow-y-scroll">

              <div className="flex  flex-col">
                <div className="flex flex-row mb-4">
                  <div className="flex flex-col">
                    <label className="text-gray-700 items-center">
                      Class:
                      {/* Start select box */}
                      <CustomSelectBox
                        options={classNames}
                        placeholder="Select Class"
                        onSelect={handleClass}
                        styled={
                          "font-medium h-auto justify-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px] "
                        }
                        oldvalue={theclass}
                      />
                    </label>
                  </div>


                </div>
                <div className="flex flex-row  mb-6">
                  <div className="flex flex-col">
                    <label className="text-gray-700 mr-20">
                      From:
                      <input
                        type="time"
                        value={formatTimeForInput(thefrom)}
                        onChange={handleFrom}
                        className="font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px]"

                      />
                    </label>
                  </div>


                  <div className="flex flex-col">
                    <label className="text-gray-700">
                      To:
                      <input
                        type="time"
                        value={formatTimeForInput(theto)}
                        onChange={handleTo}
                        className="font-medium h-auto items-center 
                        border-[1px] border-zinc-300 self-center
                         w-60 inline-block ml-[8px]" />
                    </label>
                  </div>




                </div>
                <div className="flex flex-row  mb-4">
                  <div className="flex flex-col">
                    <label className="text-gray-700 mr-20 ">
                      Building :
                      {
                        <CustomSelectBox
                          options={allStages}
                          placeholder="Select Location"
                          onSelect={handleStages}
                          styled={
                            "font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px]"
                          }
                          enable={false}
                          oldvalue={theroombuilding}
                        />
                      }
                    </label>
                  </div>
                  <div className="flex flex-col">
                    {(theroombuilding?.length > 0 ||
                      (building.length > 0 && allrooms.length > 0)) && (
                        <label className="text-gray-700 mr-20 ">
                          Location :
                          {
                            <CustomSelectBox
                              options={allrooms.length > 0 ? allrooms : allroomsRef.current}
                              placeholder="Select Location"
                              onSelect={handlePlace}
                              styled={
                                "font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px]"
                              }
                              enable={false}
                              oldvalue={theroomname}
                            />
                          }
                        </label>)}
                  </div>

                </div>
              </div>

            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              {clickEdit ? <>
                <button
                  className="primary-button btnCol text-white hover:text-white hover:font-bold mr-4 "
                  disabled
                  type="button"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded mr-4"
                  type="button"
                  disabled
                  onClick={handleClose}

                >
                  Cancel
                </button>


              </> :

                <>
                  <button
                    className="primary-button btnCol text-white hover:text-white hover:font-bold mr-4 "

                    type="button"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded mr-4"
                    type="button"
                    onClick={handleClose}

                  >
                    Cancel
                  </button>

                </>}

            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

const AddSchedules = ({
  handlePlace,
  handleFrom,
  handleTo,
  allClasses,
  handleClass,
  handleClose,
  handleSave,
  theroom,
  click,
  handleCloseNotificatonMessages,
  handleOpenNotificatonMessages,
  messages,
  confirmOccupied,
  // thefrom,
  // theto,
  // theclass,
  theroombuilding,
  // theroomname,
  isEdit,
}) => {

  let classNames = allClasses.map((clss) => clss.course_id);

  const [allrooms, setAllrooms] = useState([]);
  let allStages = [];

  const [building, setBuilding] = useState("");
  const handleStages = (selectedValue) => {
    setBuilding(selectedValue);
    setAllrooms([]);
    // console.log("allrooms1 :: ==> ", allrooms);
    theroom.forEach((room) => {
      room.room_building === selectedValue &&
        setAllrooms((prev) => [...prev, room.room_name]);
    });
    // console.log("allrooms2 :: ==> ", allrooms);
  };

  const allroomsRef = useRef([]);
  const handleStages1 = (selectedValue) => {
    theroom.forEach((room) => {
      if (room.room_building === selectedValue) {
        allroomsRef.current.push(room.room_name);
      }
    });
  };

  isEdit && handleStages1(theroombuilding);

  theroom.forEach((room) => {
    if (!allStages.includes(room.room_building)) {
      allStages.push(room.room_building);
    }
  });

  return (

    <>
      {click && confirmOccupied ? <>

        <>

          (  <NotificatonMessage
            handleOpenNotificatonMessages={handleOpenNotificatonMessages}
            handleCloseNotificatonMessages={handleCloseNotificatonMessages}
            messages={messages}
          />
          )


        </>
      </>
        : click && !confirmOccupied ?
          (
            <>
              <div
                className="justify-center items-center flex  overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
              >
                <div className="relative w-3/4 my-6 p-20 m-20 mx-auto max-w-3xl">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-start justify-between opacity-5 p-5 border-b border-solid border-slate-200 rounded-t">
                      <h3 className="text-3xl font-semibold opacity-5">
                        Modal Title
                      </h3>
                      <button
                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"

                      >
                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                          ×
                        </span>
                      </button>
                    </div>
                    {/*body*/}
                    <div className="relative p-6 pr-12">
                      <div
                        className="flex flex-col mb-10 mr-0 justify-center"
                      >

                        <div role="status" className="flex flex-col  justify-center absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                          <div className="flex justify-center pb-12">
                            <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>

                          </div>
                          <div className="flex justify-center">
                            <h5 className="text-gray-700 text-base">please wait until process complete...</h5>

                          </div>
                        </div>

                      </div>


                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>

            </>) : <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-gray-700 text-3xl font-bold">
                      Create Schedule
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"

                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 pr-12 h-3/4  flex-auto overflow-y-scroll">

                    <div className="flex  flex-col">
                      <div className="flex flex-row mb-4">
                        <div className="flex flex-col">
                          <label className="text-gray-700 items-center">
                            Class:
                            {/* Start select box */}
                            <CustomSelectBox
                              options={classNames}
                              placeholder="Select Class"
                              onSelect={handleClass}
                              styled={
                                "font-medium h-auto justify-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px] "
                              }

                            />
                          </label>
                        </div>


                      </div>
                      <div className="flex flex-row  mb-6">
                        <div className="flex flex-col">
                          <label className="text-gray-700 mr-20">
                            From:
                            <input
                              type="time"
                              // value={formatTimeForInput(thefrom)}
                              onChange={handleFrom}
                              className="font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px]"

                            />
                          </label>
                        </div>


                        <div className="flex flex-col">
                          <label className="text-gray-700">
                            To:
                            <input
                              type="time"
                              // value={formatTimeForInput(theto)}
                              onChange={handleTo}
                              className="font-medium h-auto items-center 
                        border-[1px] border-zinc-300 self-center
                         w-60 inline-block ml-[8px]" />
                          </label>
                        </div>




                      </div>
                      <div className="flex flex-row  mb-4">
                        <div className="flex flex-col">
                          <label className="text-gray-700 mr-20 ">
                            Building :
                            {
                              <CustomSelectBox
                                options={allStages}
                                placeholder="Select Location"
                                onSelect={handleStages}
                                styled={
                                  "font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px]"
                                }
                                enable={false}

                              />
                            }
                          </label>
                        </div>
                        <div className="flex flex-col">
                          {(theroombuilding?.length > 0 ||
                            (building.length > 0 && allrooms.length > 0)) && (
                              <label className="text-gray-700 mr-20 ">
                                Location :
                                {
                                  <CustomSelectBox
                                    options={allrooms.length > 0 ? allrooms : allroomsRef.current}
                                    placeholder="Select Location"
                                    onSelect={handlePlace}
                                    styled={
                                      "font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px]"
                                    }
                                    enable={false}

                                  />
                                }
                              </label>)}
                        </div>

                      </div>
                    </div>

                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="primary-button btnCol text-white hover:text-white hover:font-bold mr-4"
                      type="button"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded mr-4"
                      type="button"
                      onClick={handleClose}

                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>

          </>}

    </>
  );
}
