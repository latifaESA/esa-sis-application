import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
// import moment from 'moment';
import moment from 'moment-timezone';
import {
  SevenColGrid,
  Wrapper,
  HeadDays,
  DateControls,
  StyledEvent,
  HighLevelPageStyle,
  // SeeMore,
  // PortalWrapper,
  // ScheduleForm,
} from './Calender.styled';
// import { useRouter } from 'next/router';
import { NotificatonMessage } from '../../components/Dashboard/WarningMessage';
import { DAYS, MOCKAPPS } from './conts';
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
} from './utils';
import {
  ArrowLeftCircleIcon,
  ArrowLeftIcon,
  ArrowRightCircleIcon,
  ArrowRightIcon,
  PlusCircleIcon,
  // TrashIcon,
} from '@heroicons/react/24/solid';
import CustomSelectBox from '../../pages/programManager/customSelectBox';
import axios from 'axios';
import { WarningMessageSchedule } from '../Dashboard/WarningMessage';
const formatTime = (timeWithTimeZone) => {
  const [time] = timeWithTimeZone.split('+'); // Remove the timezone offset
  const [hours, minutes] = time.split(':');
  const formattedHours = parseInt(hours) % 12 === 0 ? 12 : parseInt(hours) % 12;

  const period = parseInt(hours) < 12 ? 'AM' : 'PM';
  return `${formattedHours}:${minutes} ${period}`;
};
function modifyDate(dateString) {
  // Create a new Date object from the provided dateString
  let modifiedDate = new Date(dateString);

  // Add one day to the date
  modifiedDate.setDate(modifiedDate.getDate() + 1);
  const formattedDate = modifiedDate.toISOString().split('T')[0] + "T00:00:00.000Z";
  return formattedDate;
}




export const Calender = ({ schedule, setSchedule }) => {
  const [select, setSelect] = useState(false);
  const [occupiedRooms, setOccupiedRooms] = useState([]);
  const [remainingRooms, setRemainingRooms] = useState([]);
  const { data: session } = useSession();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(MOCKAPPS);
  const dragDateRef = useRef();
  const dragindexRef = useRef();
  // const [showPortal, setShowPortal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [portalData, setPortalData] = useState({});
  const [classes, setClasses] = useState('');
  const [allClasses, setAllClasses] = useState([]);
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [place, setPlace] = useState('');
  // const [isSave, setIsSave] = useState(false);
  const [theDate, setTheDate] = useState('');
  const [hasFetched, setHasFetched] = useState(false)
  const [scheduleDate, setScheduleDate] = useState([]);
  // const [allRoomBuilding, setAllRoomBuilding] = useState([]);
  const [allroomName, setAllRoomName] = useState([]);
  const [roomBuilding, setRoomBuilding] = useState('');
  const [roomName, setRoomName] = useState('');
  const [tmpscheduleID, setTmpscheduleID] = useState(null);
  const [confirmOpenMessage, setConfirmOpenMessage] = useState(false);
  const [click, setIsClick] = useState(false);
  const [clickEdit, setIsClickEdit] = useState(false);
  const [student, setStudent] = useState([]);
  const [messages, setMessage] = useState('');
  const [sharepointId, setSharePointId] = useState('')
  const [fromSharePoint, setFromTimeEditSharePoint] = useState('')
  const [toSharePoint, setToTimeEditSharePoint] = useState('')
  const [attendanceId, setAttendanceId] = useState()
  const [editOnline, setEditOnline] = useState()
  const [confirmOpenMessageNotification, setConfirmOpenMessageNotification] =
    useState(false);
  const [isEdit, setIsEdit] = useState(false)
  const [isOnline, setIsOnline] = useState()
  const [confirmOccupied, setConfirmOccupied] = useState(false);
  const [zoomUserId, setZoomUserId] = useState()
  const [zoom_id, setZoomID] = useState()

  const [courseName, setCourseName] = useState('')

  const [allCourses, setAllCourses] = useState([]);

  const getAllRooms = async () => {
    try {
      let table = 'rooms';
      let { data } = await axios.post('/api/pmApi/getAll', { table });
      setAllRoomName(data.rows);
    } catch (error) {
      // console.log(error);
    }
  };

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

        }
      }

      return { ok: true, result: data };

    } catch (error) {

      // Assuming an error means the room is not available
      return { ok: false, result: false };
    }
  };

  const getZoomToken = async () => {
    try {
      const response = await fetch('/api/zoom_api/getZoomAccessToken', {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=verbose',
          'Content-Type': 'application/json;odata=verbose',
        },
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

  const getZoomUser = async () => {
    try {
      const access_token = await getZoomToken()
      const payload = {
        email: session.user?.email,
        accessToken: access_token
      }
      const response = await axios.post(`/api/zoom_api/getZoomUser`, payload)
      setZoomUserId(response.data.data.id)

    } catch (error) {
      return error
    }
  }

  const handleCreateZoomMeeting = async (class_id, day, fromTime, to_time) => {
    try {
      
      const formattedDate = moment(day).format('YYYY-MM-DD');
      const access_token = await getZoomToken();

      // Combine the date and time and format it as a full ISO string
      const localDateTime = `${formattedDate}T${fromTime}`;

      // Convert the local time to UTC
      const utcDateTime = moment.tz(localDateTime, 'Asia/Beirut').utc().format('YYYY-MM-DDTHH:mm:ss[Z]');

      // // Calculate duration in minutes
      // const fromDateTime = moment.tz(localDateTime, 'Asia/Beirut');
      // const toDateTime = moment.tz(`${formattedDate}T${to_time}`, 'Asia/Beirut');
      // Parse time strings into Date objects
      const startDate = new Date(`2000-01-01T${fromTime}:00`);
      const endDate = new Date(`2000-01-01T${to_time}:00`);

      // Calculate difference in milliseconds
      const differenceMs = endDate - startDate;

      // Convert milliseconds to minutes
      const minutesDifference = Math.floor(differenceMs / (1000 * 60));
      // const durationInMinutes = toDateTime.diff(fromDateTime, 'minutes');

      const payload = {
        classId: `${class_id}`,
        date: utcDateTime,  // Use utcDateTime instead of formattedDateTime
        accessToken: access_token,
        userId: zoomUserId,
        createAt: utcDateTime,  // You might want to choose either date or createAt
        minDuration: minutesDifference, // Add duration to the payload
      };

      const response = await axios.post('/api/zoom_api/createZoom', payload);

      return { zoom_id: response.data.data.id, zoom_url: response.data.data.join_url };
    } catch (error) {
      return error;
    }
  };



  const handleCreateZoomMeetingEdit = async (courseName, day, fromTime, toTime) => {
    try {
      const formattedDate = moment(day).format('YYYY-MM-DD');
      const access_token = await getZoomToken();

      // Combine the date and time
      const localDateTime = `${formattedDate} ${fromTime}`;
      // const localToDateTime = `${formattedDate} ${toTime}`;

      // Parse the local time
      const parsedDateTime = moment.tz(localDateTime, 'YYYY-MM-DD hh:mm A', 'Asia/Beirut');
      // const parsedToDateTime = moment.tz(localToDateTime, 'YYYY-MM-DD hh:mm A', 'Asia/Beirut');

      // // Convert the local time to UTC
      const utcDateTime = parsedDateTime.utc().format('YYYY-MM-DDTHH:mm:ss[Z]');

      // // Calculate duration in minutes
      // const durationInMinutes = parsedToDateTime.diff(parsedDateTime, 'minutes');
      const startDate = new Date(`2000-01-01T${fromTime}:00`);
      const endDate = new Date(`2000-01-01T${toTime}:00`);

      // Calculate difference in milliseconds
      const differenceMs = endDate - startDate;

      // Convert milliseconds to minutes
      const minutesDifference = Math.floor(differenceMs / (1000 * 60));

      const payload = {
        classId: `${courseName}`,
        date: utcDateTime,
        accessToken: access_token,
        userId: zoomUserId,
        createAt: utcDateTime,
        minDuration: minutesDifference, // Add duration to the payload
      };
      const response = await axios.post('/api/zoom_api/createZoom', payload);

      return { zoom_id: response.data.data.id, zoom_url: response.data.data.join_url };
    } catch (error) {
      return error;
    }
  };


  const handleUpdateZoomOnlineSchedule = async (zoomId, zoomUrl, attendanceID) => {
    try {

      await axios.post(`/api/pmApi/updateScheduleMeet`, {
        zoom_id: zoomId,
        zoom_url: zoomUrl,
        attendance_id: attendanceID
      })

    } catch (error) {
      return error
    }
  }

  const handleDeleteZoom = async (zoom_id) => {
    try {
      const access_token = await getZoomToken()
      const payload = {
        zoomId: zoom_id,
        accessToken: access_token
      }
      await axios.post('/api/zoom_api/DeleteZoom', payload)
    } catch (error) {
      return error
    }
  }

  const handleUpdateZoom = async (zoom_id, scheduleDate, title, fromTime , toTime) => {
    try {

      console.log(fromTime ,'testt', toTime)
      const formattedDate = moment(scheduleDate).format('YYYY-MM-DD');

      // Combine the date and time and format it as a full ISO string
      const localDateTime = `${formattedDate}T${fromTime}`;

      // Convert the local time to UTC
      const utcDateTime = moment.tz(localDateTime, 'Asia/Beirut').utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
      const startDate = new Date(`2000-01-01T${fromTime}:00`);
      const endDate = new Date(`2000-01-01T${toTime}:00`);

      // Calculate difference in milliseconds
      const differenceMs = endDate - startDate;

      // Convert milliseconds to minutes
      const minutesDifference = Math.floor(differenceMs / (1000 * 60));
      const access_token = await getZoomToken()
      const payload = {
        zoomId: zoom_id,
        accessToken: access_token,
        date: utcDateTime,
        classId: title,
        createAt: utcDateTime,
        minDuration:minutesDifference
    
      }

      await axios.post('/api/zoom_api/updateZoom', payload)
    } catch (error) {
      return error
    }
  }

  useEffect(() => {
    getZoomUser()
  }, [])



  // useEffect(() => {
  //   getRoomBooking();
  // }, []);
  const [allrooms, setAllrooms] = useState([]);



  useEffect(() => {
    // console.log('allroom', allrooms);
  }, [allrooms]);




  let allStages = [];
  const [building, setBuilding] = useState('');
  const handleStages = (selectedValue) => {

    setBuilding(selectedValue);
    setAllrooms([]);

    allroomName.forEach((room) => {
      if (room.room_building === selectedValue) {
        setAllrooms((prevAllRooms) => [...prevAllRooms, room.room_name]);
      }
    });

    return allrooms
  };



  const allroomsRef = useRef([]);
  const handleStages1 = (selectedValue) => {
    allroomName.forEach((room) => {
      if (room.room_building === selectedValue) {
        allroomsRef.current.push(room.room_name);
      }
    });
  };

  isEdit && handleStages1(roomBuilding);

  allroomName.forEach((room) => {
    if (!allStages.includes(room.room_building)) {
      allStages.push(room.room_building);
    }
  });

  // const router = useRouter();
  // const { majorId } = router.query

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
        sharepointId: sched.sharepoint_id,
        is_online: sched.is_online,
        attendance_id: sched.attendance_id,
        zoom_meeting_id: sched.zoom_meeting_id,
        color: '#00CED1',
      });
    });

    setScheduleDate(datesArray);
    console.log(schedule)
    // console.log("datesArray of schedule:  ", datesArray);
    // console.log("schedule:  ", data.data);
  };
  const getData = async () => {
    try {
      let pmID = session.user?.majorid;
      let { data } = await axios.post('/api/pmApi/getScheduleByPMId', { pmID });
      setSchedule(data.data);
    } catch (error) {
      return error;
    }
  };

  const getCourse = async () => {
    let { data } = await axios.post('/api/pmApi/getAll', {
      table: "courses"
    });
    // console.log("all classes:  ==> ", data.rows);

    // setAllClasses(data.rows.map(clas => clas.course_id))
    setAllCourses(data.rows);
  };

  const getClass = async () => {
    let table = 'tmpclass';
    let colName = 'pm_id';
    let val = session.user.userid;
    let { data } = await axios.post('/api/pmApi/getAllCondition', {
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
    getCourse()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule]);
  useEffect(() => {
    getAllRooms();
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchBook = async () => {

    try {
      if (building !== '' && fromTime !== '' && toTime !== '') {
        const occupiedRoomsArray = [];


        const dates = new Date(theDate);
        const formattedDate = moment(dates).format('YYYY-MM-DDT00:00:00[Z]');

        const fromTimeSplit = fromTime;
        const toTimeSplit = toTime;
        const datess = formattedDate.split('T')[0];

        const offset = 2;
        const fromTimes = moment(`${datess}T${fromTimeSplit}:00.000`).utcOffset(offset, true).toISOString();
        const toTimes = moment(`${datess}T${toTimeSplit}:00.000`).utcOffset(offset, true).toISOString();

        if (fromTimes && toTimes) {
          const formattedFromTime = fromTimes.replace(/\.\d{3}Z/, 'Z');
          const formattedToTime = toTimes.replace(/\.\d{3}Z/, 'Z');

          const payload = {
            space: building,
            date: formattedDate,
            FromTime: formattedFromTime,
            ToTime: formattedToTime,
          };

          const response = await axios.post('/api/pmApi/getBooking', payload);

          const data = response.data.data;
          if (response.data.success === true) {
            // Collect occupied rooms
            data.forEach(item => {
              occupiedRoomsArray.push(item.rooms);
            });

            // Set state to store occupied rooms
            setOccupiedRooms(occupiedRoomsArray);

            // Set state to store remaining rooms
            const remainingRoomsArray = allrooms.filter(room => !occupiedRooms.includes(room));

            setRemainingRooms(remainingRoomsArray);
          } else {
            // If data.data.success is not true, set all rooms as remaining

            setRemainingRooms(allrooms);
          }
        } else {
          console.error('fromTimes or toTimes is null or undefined');
        }

      }
    } catch (error) {

      return error;
    }
  };
  useEffect(() => {
    searchBook();

    const parseTimeString = (timeString) => {
      const [fromTimeString, toTimeString] = timeString.split(' to ');

      // Assuming fromTimeString and toTimeString are dynamic values
      const fromTimes = convertToDesiredFormat(fromTimeString);
      const toTimes = convertToDesiredFormat(toTimeString);

      return [fromTimes, toTimes];
    };

    const convertToDesiredFormat = (timeString) => {
      const date = new Date(`2000-01-01 ${timeString}`);

      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      const formattedTime = `${hours}:${minutes}:00+02`;

      return formattedTime;
    };

    // Replace these with the actual dynamic time values you have
    const dynamicFromTime = fromTime;
    const dynamicToTime = toTime;

    const dynamicTimeString = `${dynamicFromTime} to ${dynamicToTime}`;
    const [fromTimes, toTimes] = parseTimeString(dynamicTimeString);

    // Now you can use fromTime and toTime in your searchBookEdit function
    searchBookEdit(theDate, building, fromTimes, toTimes);
  }, [building, fromTime, toTime]);






  useEffect(() => {

    // This will be triggered when occupiedRooms or allrooms changes
    const remainingRoomsArray = allrooms.filter((room) => !occupiedRooms.includes(room));
    setRemainingRooms(remainingRoomsArray);

  }, [occupiedRooms, allrooms, building]);

  const searchBookEdit = async (date, building, from_Time, to_Time) => {
    try {


      const occupiedRoomsArray = [];
      const dates = new Date(date);
      const formattedDate = moment(dates).format('YYYY-MM-DDT00:00:00[Z]');
      const fromTimeSplit = from_Time.split('+')[0];
      const toTimeSplit = to_Time.split('+')[0];
      const datess = formattedDate.split('T')[0];
      // Beirut/Lebanon is in UTC+2 during standard time and UTC+3 during daylight saving time
      const utcOffset = 4;
      // Convert the local time to UTC and adjust to Beirut/Lebanon time zone
      const fromTimes = moment(`${datess}T${fromTimeSplit}Z`).utcOffset(utcOffset, true).toISOString();
      const toTimes = moment(`${datess}T${toTimeSplit}Z`).utcOffset(utcOffset, true).toISOString();
      if (fromTimes && toTimes) {
        const formattedFromTime = fromTimes.replace(/\.\d{3}Z/, 'Z');
        const formattedToTime = toTimes.replace(/\.\d{3}Z/, 'Z');

        const payload = {
          space: building,
          date: formattedDate,
          FromTime: formattedFromTime,
          ToTime: formattedToTime,
        };

        const response = await axios.post('/api/pmApi/getBooking', payload);

        const data = response.data.data;

        if (response.data.success === true) {
          // Collect occupied rooms
          data.forEach(item => {
            occupiedRoomsArray.push(item.rooms);
          });


          // Set state to store occupied rooms
          setOccupiedRooms(occupiedRoomsArray);
          // Set state to store remaining rooms
          const remainingRoomsArray = allrooms.filter(room =>

            !occupiedRooms.includes(room)

          );


          setRemainingRooms(remainingRoomsArray);

        } else {
          // If data.data.success is not true, set all rooms as remaining

          setRemainingRooms(allrooms);
        }
      } else {
        console.error('fromTimes or toTimes is null or undefined');
      }


    } catch (error) {
      console.error(error);
      return error;
    }
  };

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
          color: '#8ABAD3',
          type: data.type,
          teacher: 'peter germanos',
          from: data.from,
          to: data.to,
          place: data.place,
          course: 'MAth21',
        },
      ]);
  };
  const handleOpenNotificatonMessages = () => {
    setConfirmOpenMessageNotification(true);
  };
  const handleCloseNotificatonMessages = () => {
    setConfirmOpenMessageNotification(false);
    setIsOnline('')
  };
  const handleOpenMessages = () => {
    setConfirmOccupied(true);
  };
  const handleCloseMessages = () => {
    setIsClick(false);
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
          color: '#8ABAD3',
          type: data.type,
          teacher: 'peter germanos',
          from: data.from,
          to: data.to,
          place: data.place,
          course: 'MAth21',
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
        const attendanceData = await handleCreateAttendanceDragDrop(
          ev,
          modifyDate(dragDateRef.current.date),
          place
        );

        if (attendanceData.data.code != 200) {
          const payload = {
            classID: ev.class_id,
            day: modifyDate(dragDateRef.current.date),
            fromTime: ev.from,
            toTime: ev.to,
            room_id: place,
            pm_id: session.user.userid,
            attendanceId: attendanceData.data.data,
            is_online: ev.is_online
          }
          let { data } = await axios.post('/api/pmApi/createSingleSchedule', payload);

          if (ev.is_online === true) {
            if (data.success) {
              const response = await handleCreateZoomMeeting(ev.title, new Date(dragDateRef.current.date), ev.from, ev.to)
              await handleUpdateZoomOnlineSchedule(response.zoom_id, response.zoom_url, attendanceData.data.data)
              setStudent([]);
              getData();
            }
          } else {
            if (data.success) {
              await handleDragRoomBooking(new Date(dragDateRef.current.date), ev.from, ev.to, attendanceData.data.data)
              setStudent([]);
              getData();
            }

          }


        } else {
          setConfirmOpenMessageNotification(true);
          setMessage(attendanceData.data.message);
        }
      } else {
        setConfirmOpenMessageNotification(true);
        setMessage('missing data , please try again!');
      }
    }
  };



  const handlePlace = (selectedValue) => {
    // handlePlace
    // Do something with the selected value
    // console.log("Selected Value:", selectedValue);
    // setPlace(selectedValue)

    setRoomName(selectedValue)

    setPlace(
      selectedValue.length > 0 &&
      allroomName.filter((room) => room.room_name === selectedValue)[0]
        .room_id
    );
  };

  const handleFrom = (e) => {
    setFromTimeEditSharePoint(e.target.value)
    setFromTime(e.target.value);
    // Do something with the selected value
    // console.log("Selected Value:", selectedValue);
    // setFromTime(selectedValue);
  };

  const handleTo = (e) => {
    // Do something with the selected value
    // console.log("Selected Value:", selectedValue);
    setToTimeEditSharePoint(e.target.value)
    setToTime(e.target.value);
  };

  const handleClass = (selectedValue) => {

    const foundCourse = allCourses.find((clas) => clas.course_id === selectedValue)

    // Now, you can access the tmpclass_id outside the loop if needed
    if (foundCourse) {
      const courseName = foundCourse.course_name;
      // Use courseName as needed

      setCourseName(courseName)


    } else {
      console.log("Course not found in allCourses");
    }


    // Do something with the selected value
    setSelect(true);
    selectedValue.length > 0 &&
      setClasses(
        allClasses.filter((clas) => clas.course_id === selectedValue)[0]
          .tmpclass_id
      );
  };

  const addEvent = (date, event) => {
    event.preventDefault();
    setShowForm(true);
    if (!event.target.classList.contains('StyledEvent')) {
      getRoomBooking()
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
  const deleteTable = async () => {
    try {
      await axios.post('/api/pmApi/deleteBooking')
    } catch (error) {
      return error
    }
  }
  const handleClose = () => {
    deleteTable()
    setRemainingRooms([])
    setIsOnline('')
    setZoomID()
    setHasFetched(false)
    setShowForm(false);
  };

  useEffect(() => {
    getStudentSchedule();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student, select]);

  const getStudentSchedule = async () => {
    if (select && !hasFetched) {
      try {
        const payload1 = {
          table: 'tmpclass',
          Where: 'tmpclass_id',
          id: classes,
        };

        const data1 = await axios.post('/api/pmApi/getAllCourses', payload1);

        const course_id = data1.data.data[0].course_id;
        const payload2 = {
          table: 'courses',
          Where: 'course_id',
          id: course_id,
        };

        const data2 = await axios.post('/api/pmApi/getAllCourses', payload2);

        if (data2.data.data[0].course_type !== 'Elective') {
          let major_id = session.user?.majorid;
          let promotion = data1.data.data[0].promotion.replace(/\s/g, '');
          const { data } = await axios.post('/api/pmApi/getAllStudent', {
            major_id,
            promotion,
          });
          setStudent(data.data);
          setHasFetched(true);
        } else {
          const payload = {
            major_id: session.user?.majorid,
            promotion: data1.data.data[0].promotion.replace(/\s/g, ''),
            course_id: course_id,
          };
          try {
            const data = await axios.post(
              '/api/pmApi/getStudentAssign',
              payload
            );
            setStudent(data.data.data);
          } catch (error) {
            let major_id = session.user?.majorid;
            let promotion = data1.data.data[0].promotion.replace(/\s/g, '');
            // let promotion = promotionName
            // console.log("promotion", promotions);
            const { data } = await axios.post('/api/pmApi/getAllStudent', {
              major_id,
              promotion,
            });
            setStudent(data.data);
            setHasFetched(true);
          }
        }
      } catch (error) {
        return error;
      }
    }
  };

  const handleCreateAttendance = () => {
    return new Promise((resolve, reject) => {
      try {
        const payload1 = {
          table: 'tmpclass',
          Where: 'tmpclass_id',
          id: classes,
        };

        axios
          .post('/api/pmApi/getAllCourses', payload1)
          .then((response1) => {
            const teacher_id = response1.data.data[0].teacher_id;
            const course_id = response1.data.data[0].course_id;
            const payload = {
              teacher_id,
              course_id,
              attendance_date: modifyDate(theDate),
              major_id: session.user?.majorid,
              fromTime: fromTime,
              toTime: toTime,
              room_id: place,
            };

            axios
              .post('/api/pmApi/createAttendanceReport', payload)
              .then((response2) => {
                const attendance_id = response2.data.data;

                if (attendance_id) {
                  const createAttendanceStudentPromises = student.map((s) => {
                    return axios.post('/api/pmApi/createAttendanceStudent', {
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
      if (ev.class_id != ' ') {
        try {
          const payload1 = {
            table: 'tmpclass',
            Where: 'tmpclass_id',
            id: ev.class_id,
          };

          axios
            .post('/api/pmApi/getAllCourses', payload1)
            .then(async (data1) => {
              const course_id = data1.data.data[0].course_id;
              const payload2 = {
                table: 'courses',
                Where: 'course_id',
                id: course_id,
              };

              try {
                const data2 = await axios.post(
                  '/api/pmApi/getAllCourses',
                  payload2
                );

                if (data2.data.data[0].course_type !== 'Elective') {
                  let major_id = session.user?.majorid;
                  let promotion = data1.data.data[0].promotion.replace(
                    /\s/g,
                    ''
                  );
                  const { data } = await axios.post(
                    '/api/pmApi/getAllStudent',
                    {
                      major_id,
                      promotion,
                    }
                  );
                  resolve(data.data);
                  setHasFetched(true);
                } else {
                  const payload = {
                    major_id: session.user?.majorid,
                    promotion: data1.data.data[0].promotion.replace(/\s/g, ''),
                    course_id: course_id,
                  };

                  try {
                    const data = await axios.post(
                      '/api/pmApi/getStudentAssign',
                      payload
                    );
                    resolve(data.data.data);
                  } catch (error) {
                    let major_id = session.user?.majorid;
                    let promotion = data1.data.data[0].promotion.replace(
                      /\s/g,
                      ''
                    );
                    const { data } = await axios.post(
                      '/api/pmApi/getAllStudent',
                      {
                        major_id,
                        promotion,
                      }
                    );
                    resolve(data.data);
                    setHasFetched(true);
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

  const handleCreateAttendanceDragDrop = (ev, date, place) => {
    return new Promise((resolve, reject) => {
      try {
        const payload1 = {
          table: 'tmpclass',
          Where: 'tmpclass_id',
          id: ev.class_id,
        };

        axios
          .post('/api/pmApi/getAllCourses', payload1)
          .then(async (data1) => {
            const payload = {
              teacher_id: data1.data.data[0].teacher_id,
              course_id: data1.data.data[0].course_id,
              attendance_date: new Date(date),
              major_id: session.user?.majorid,
              fromTime: ev.from,
              toTime: ev.to,
              room: place,
            };
            const data = await axios.post(
              '/api/pmApi/createAttendanceReport',
              payload
            );

            const response = await getStudentsDragDrop(ev);
            const attendance_id = data.data.data;
            if (attendance_id) {
              for (let i = 0; i < response.length; i++) {
                const student_id = response[i].student_id;
                await axios.post('/api/pmApi/createAttendanceStudent', {
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
      setIsClick(true);
      // console.log('roomName' , roomName)
      // console.log('date' , theDate)
      // const CheckRooms = await CheckRoomISharePoint(roomName , theDate )
      // console.log('room' , CheckRooms)
      // if (CheckRooms.ok && CheckRooms.result.d.results.length >0) {
      // Room is not available, stop the process
      // setConfirmOccupied(true);
      // setMessage("Room not available");
      // return; // Stop the process
      // }else if(CheckRooms.ok && CheckRooms.result.d.results.length <= 0){

      const attendanceData = await handleCreateAttendance();
      if (isOnline === 'true') {
        const payload = {
          classID: classes,
          day: modifyDate(theDate), // Call a function to modify the date
          fromTime: fromTime,
          toTime: toTime,
          room_id: '75',
          pm_id: session.user.userid,
          attendanceId: attendanceData.data.data,
          is_online: isOnline
        };

        // The rest of your code remains unchanged
        let { data } = await axios.post('/api/pmApi/createSingleSchedule', payload);
        const response = await handleCreateZoomMeeting(courseName, theDate, fromTime, toTime)


        await handleUpdateZoomOnlineSchedule(response.zoom_id, response.zoom_url, attendanceData.data.data)

        // console.log("axios data ==>  ", place);
        if (data.success) {
          deleteTable()
          setShowForm(false);
          setIsClick(false);
          setStudent([]);
          setRemainingRooms([])
          getData();
          setIsOnline('')
          setZoomID('')

        } setPortalData

      } else {
        const payload = {
          classID: classes,
          day: modifyDate(theDate), // Call a function to modify the date
          fromTime: fromTime,
          toTime: toTime,
          room_id: place,
          pm_id: session.user.userid,
          attendanceId: attendanceData.data.data,
          is_online: isOnline
        };



        // The rest of your code remains unchanged
        let { data } = await axios.post('/api/pmApi/createSingleSchedule', payload);

        // console.log("axios data ==>  ", place);
        if (data.success) {
          await handleSharePointBookingRoom(theDate, attendanceData.data.data)
          deleteTable()
          setShowForm(false);
          setIsClick(false);
          setStudent([]);
          setRemainingRooms([])
          getData();
          setIsOnline('')
        } setPortalData
      }




      // }

    } catch (error) {
      return error;
    }

    // setShowForm(false)
  };

  const handleOnClickEvent = (event) => {

    getRoomBooking()
    setConfirmOpenMessage(true);
    // setShowPortal(true);
    setPortalData(event);
  };

  const handlePotalClose = () => {
    // setShowPortal(false)
    deleteTable()
    setConfirmOpenMessage(false);
  };

  const handleDelete = async () => {
    // setEvents((prevEvents) =>
    //   prevEvents.filter((ev) => ev.date !== portalData.date)
    // );
    // handlePotalClose();
    // console.log("portalData", portalData)
    try {
      if (portalData.is_online === true) {
        const payload = {
          table: 'attendance',
          colName: 'attendance_id',
          id: portalData.attendanceId,
        };
        const payload2 = {
          table: 'attendance_report',
          colName: 'attendance_id',
          id: portalData.attendanceId,
        };
        await axios.post('/api/pmApi/delete', payload);
        // console.log(data1)

        let table = 'tmpschedule';
        let colName = 'tmpschedule_id';
        let id = portalData.tmpschedule_id;
        let { data } = await axios.post('/api/pmApi/delete', {
          table,
          colName,
          id,
        });

        await axios.post('/api/pmApi/delete', payload2);
        // Delete from SharePoint booking room


        if (data.rowCount > 0) {
          await handleDeleteZoom(portalData.zoom_meeting_id)
          await deleteTable()
          handlePotalClose();
          getData();
        }

      } else {
        const payload = {
          table: 'attendance',
          colName: 'attendance_id',
          id: portalData.attendanceId,
        };
        const payload2 = {
          table: 'attendance_report',
          colName: 'attendance_id',
          id: portalData.attendanceId,
        };
        await axios.post('/api/pmApi/delete', payload);
        // console.log(data1)

        let table = 'tmpschedule';
        let colName = 'tmpschedule_id';
        let id = portalData.tmpschedule_id;
        let { data } = await axios.post('/api/pmApi/delete', {
          table,
          colName,
          id,
        });

        await axios.post('/api/pmApi/delete', payload2);
        // Delete from SharePoint booking room
        const { success } = await deleteFromSharePointBookingRoom(portalData.sharepointId);

        if (data.rowCount > 0 && success) {

          await deleteTable()
          handlePotalClose();
          getData();
        }
      }




    } catch (error) {
      return error;
    }

    // // console.log(id)
  };

  // Your client-side code
  const getSharePointToken = async () => {
    try {
      const response = await fetch('/api/pmApi/getsharePointToken', {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=verbose',
          'Content-Type': 'application/json;odata=verbose',
        },
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

  const deleteFromSharePointBookingRoom = async (sharepointId) => {

    try {
      const accessToken = await getSharePointToken();

      const apiUrl =
        `https://esalb.sharepoint.com/sites/RoomBooking/_api/web/lists/getbytitle('BookingRoom')/items/getbyid('${sharepointId}')`;


      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          Authorization: `Bearer ${accessToken}`,
          'If-Match': '*'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        return { success: true }
      }
    } catch (error) {

      return { success: false }

    }
  };
  const handleCloseEdit = () => {
    setRemainingRooms([])
    setAllrooms([])
    deleteTable()
    setIsOnline('')
    setShowFormEdit(false);
  };
  const handleEdit = async (e, event, date) => {

    // searchBook()
    setCourseName(event.title)
    setAttendanceId(event.attendance_id)
    setSharePointId(event.sharepoint_id)
    setZoomID(event.zoom_meeting_id)
    setEditOnline(event.is_online)

    handleStages(event.room_building)

    e.preventDefault();

    await getRoomBooking()
    setShowFormEdit(true);
    setIsEdit(true)

    searchBookEdit(date, event.room_building, event.from, event.to)
    setSharePointId(event.sharepointId)
    setFromTimeEditSharePoint(event.from)
    setToTimeEditSharePoint(event.to)

    // console.log(event);
    setIsOnline(event.is_online)

    setFromTime(formatTime(event.from));
    setToTime(formatTime(event.to));
    setClasses(event.courseID);
    setRoomBuilding(event.room_building);
    setRoomName(event.room_name);
    setTheDate(date);
    setTmpscheduleID(event.tmpschedule_id);
  };


  const handleSaveEdit = async (e) => {

    e.preventDefault();
    setIsClickEdit(true);
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
        typeof classes === 'string'
          ? allClasses.filter((clas) => clas.course_id === classes)[0]
            .tmpclass_id
          : classes,
      day: modifyDate(theDate),
      fromTime: fromTime,
      toTime: toTime,
      room_id:
        place > 0
          ? place
          : allroomName.filter((rom) => rom.room_name === roomName)[0].room_id,
      pm_id: session.user.userid,
      is_online: isOnline
    };
    if (editOnline === isOnline) {
      if (editOnline === true) {
        let { data } = await axios.post(
          '/api/pmApi/updateSingleSchedule',
          schedData
        );

        if (data.success) {
        
          await handleUpdateZoom(zoom_id, theDate, courseName, fromTime , toTime)
          getData();
          setIsOnline('')
          setIsClickEdit(false);
          setShowFormEdit(false);
        }

      } else {
        let { data } = await axios.post(
          '/api/pmApi/updateSingleSchedule',
          schedData
        );
        if (data.success) {

          await UpdateFromSharePointBookingRoom(sharepointId, theDate)
          getData();
          setIsOnline('')
          setIsClickEdit(false);
          setShowFormEdit(false);

        }

      }

    } else {
      if (isOnline === "true") {
        let { data } = await axios.post(
          '/api/pmApi/updateSingleSchedule',
          schedData
        );

        if (data.success) {
          await deleteFromSharePointBookingRoom(sharepointId);
          const response = await handleCreateZoomMeetingEdit(courseName, theDate, fromTime, toTime)
          await handleUpdateZoomOnlineSchedule(response.zoom_id, response.zoom_url, attendanceId)
          await axios.post('/api/pmApi/deleteSharePointId', {
            attendance_id: attendanceId
          })

          getData();
          setIsClickEdit(false);
          setShowFormEdit(false);
          setIsOnline('')
        }

      } else {
        let { data } = await axios.post(
          '/api/pmApi/updateSingleSchedule',
          schedData
        );
        if (data.success) {
          await handleSharePointBookingRoom(theDate, attendanceId)
          await handleDeleteZoom(zoom_id)
          await axios.post('/api/pmApi/deleteZoomSchedule', {
            attendance_id: attendanceId
          })
          getData();
          setIsClickEdit(false);
          setShowFormEdit(false);
          setIsOnline('')
          if (isOnline === false) {
            await UpdateFromSharePointBookingRoom(sharepointId, theDate)
            getData();
            setIsClickEdit(false);
            setShowFormEdit(false);
            setIsOnline('')

          }


        }

      }

    }
    // console.log("schedData  :", schedData);


    // console.log("the update change:  ", data);
  };


  const UpdateFromSharePointBookingRoom = async (sharepointId, date) => {

    try {
      const accessToken = await getSharePointToken();
      const dates = new Date(date);
      const bookingDay = new Date()
      const formattedBookingDay = moment(bookingDay).format('MM/DD/YYYY');

      const formattedDate = moment(dates).format('YYYY-MM-DD');
      const fromTimeSplit = fromSharePoint.split('+')[0];
      const toTimeSplit = toSharePoint.split('+')[0];

      // Beirut/Lebanon is in UTC+2 during standard time and UTC+3 during daylight saving time
      const utcOffset = 4; // Change this value if daylight saving time is not in effect

      // Convert the local time to UTC and adjust to Beirut/Lebanon time zone
      const fromTimes = moment(`${formattedDate}T${fromTimeSplit}Z`).utcOffset(utcOffset, true).toISOString();
      const toTimes = moment(`${formattedDate}T${toTimeSplit}Z`).utcOffset(utcOffset, true).toISOString();

      const apiUrl =
        `https://esalb.sharepoint.com/sites/RoomBooking/_api/web/lists/getbytitle('BookingRoom')/items/getbyid('${sharepointId}')`;


      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          Authorization: `Bearer ${accessToken}`,
          'If-Match': '*'
        },
        body: JSON.stringify({
          __metadata: {
            type: "SP.Data.BookingRoomListItem",
          },
          Title: `${roomName}`,
          Space: `${building}`,
          BookedBy: `${session.user?.name}`,
          BookingDate: date, // Use the current date in the iteration
          BookingDay: formattedBookingDay,
          FromTime: fromTimes,
          ToTime: toTimes,
        }),
      });


      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        return { success: true }
      }
    } catch (error) {

      return { success: false }

    }
  };


  const handleSharePointBookingRoom = async (date, attendance_id) => {
    try {
      const accessToken = await getSharePointToken();
      const dates = new Date(date);
      const bookingDay = new Date()
      const formattedBookingDay = moment(bookingDay).format('MM/DD/YYYY');

      const formattedDate = moment(dates).format('YYYY-MM-DD');
      const fromTimeSplit = fromSharePoint.split('+')[0];
      const toTimeSplit = toSharePoint.split('+')[0];

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
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({

          __metadata: {
            type: "SP.Data.BookingRoomListItem",
          },
          Title: `${roomName}`,
          Space: `${building}`,
          BookedBy: `${session.user?.name}`,
          BookingDate: dates,
          BookingDay: `${formattedBookingDay}`,
          FromTime: fromTimes,
          ToTime: toTimes,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();


      // Log the ID of the newly added item
      if (data && data.d && data.d.Id) {
        // Update the SharePoint ID in the schedule
        await axios.post("/api/pmApi/UpdateSharePointIdSchedule", {
          sharepointId: data.d.Id,
          attendanceId: attendance_id,
        });

      }
    } catch (error) {
      console.error("Error submitting booking to SharePoint:", error.message);
    }
  };

  const handleDragRoomBooking = async (date, from, to, attendance_id) => {
    try {

      const payload = {
        table: 'rooms',
        Where: 'room_name',
        id: roomName,
      };
      const dataaa = await axios.post('/api/pmApi/getAllCourses', payload);


      const accessToken = await getSharePointToken();
      const dates = new Date(date);
      const bookingDay = new Date()
      const formattedBookingDay = moment(bookingDay).format('MM/DD/YYYY');

      const formattedDate = moment(dates).format('YYYY-MM-DD');
      const fromTimeSplit = from.split('+')[0];
      const toTimeSplit = to.split('+')[0];

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
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          __metadata: {
            type: "SP.Data.BookingRoomListItem",
          },
          Title: `${roomName}`,
          Space: `${dataaa.data.data[0].room_building}`,
          BookedBy: `${session.user?.name}`,
          BookingDate: date, // Use the current date in the iteration
          BookingDay: `${formattedBookingDay}`,
          FromTime: fromTimes,
          ToTime: toTimes,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();


      // Log the ID of the newly added item
      if (data && data.d && data.d.Id) {
        // Update the SharePoint ID in the schedule
        await axios.post("/api/pmApi/UpdateSharePointIdSchedule", {
          sharepointId: data.d.Id,
          attendanceId: attendance_id,
        });

      }
    } catch (error) {
      return error
    }
  };





  return (
    <>
      <HighLevelPageStyle>
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
                    ? 'active'
                    : ''
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
                          {!ev.is_online ?
                            <>
                              <div>{ev.room_building}</div>
                              <div>{ev.room_name}</div>
                            </> : <>

                              <div>Online</div>
                            </>}

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
                {day && (
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
                )}
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
              isOnline={isOnline}
              setIsOnline={setIsOnline}
              click={click}
              remainingRooms={remainingRooms}
              allroomsRef={allroomsRef}
              allStages={allStages}
              handleStages={handleStages}
              handleOpenNotificatonMessages={handleOpenMessages}
              handleCloseNotificatonMessages={handleCloseMessages}
              messages={messages}
              building={building}
              allrooms={allrooms}
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
          {confirmOccupied && (
            <NotificatonMessage
              handleOpenNotificatonMessages={handleOpenMessages}
              handleCloseNotificatonMessages={handleCloseMessages}
              messages={messages}
            />
          )}

          {showFormEdit && (
            <AddSchedule
              isOnline={isOnline}
              setIsOnline={setIsOnline}
              searchBookEdit={searchBookEdit}
              remainingRooms={remainingRooms}
              handleClose={handleCloseEdit}
              handleStages={handleStages}
              allrooms={allrooms}
              allStages={allStages}
              allroomsRef={allroomsRef}
              allClasses={allClasses}
              UpdateFromSharePointBookingRoom={UpdateFromSharePointBookingRoom}
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
              isEdit={isEdit}
            />
          )}
        </Wrapper>
      </HighLevelPageStyle>
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
  return moment(time, 'h:mm A').format('HH:mm');
};

const AddSchedule = ({
  isOnline,
  setIsOnline,
  remainingRooms,
  handlePlace,
  handleFrom,
  building,
  handleTo,
  allClasses,
  handleClass,
  handleClose,
  handleSave,
  // theroom,
  thefrom,
  theto,
  theclass,
  allrooms,
  handleStages,
  allroomsRef,
  clickEdit,
  theroombuilding,
  theroomname,
  allStages,
  // isEdit,
}) => {
  let classNames = allClasses.map((clss) => clss.course_id)
  // console.log(allrooms , 'allrooms')

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-black bg-opacity-50">
        <div className="relative w-full max-w-2xl mx-auto my-6">
          {/* Modal content */}
          <div className="border border-gray-300 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
            {/* Modal header */}
            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
              <h3 className="text-gray-700 text-3xl font-bold">
                Update Schedule
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={handleClose}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
              </button>
            </div>
            {/* Modal body */}
            <div className="p-6 flex-column overflow-y-scroll overflow-x-hidden">
              {/* Form fields */}
              <div className="flex flex-col mb-4 ">
                <label className="text-gray-700 items-center ms:w-auto">
                  Class:
                  {/* Start select box */}
                  <CustomSelectBox
                    options={classNames}
                    placeholder="Select Class"
                    onSelect={handleClass}
                    styled="font-medium h-auto justify-center border-[1px] border-gray-300 self-center w-full px-4 py-2 rounded-md ms:w-auto"
                    oldvalue={theclass}
                  />
                </label>
              </div>
              <div className="flex flex-col md:flex-row mb-6">
                <div className="flex flex-col">
                  <label className="text-gray-700 mr-20  ms:w-auto">
                    From:
                    <input
                      type="time"
                      value={formatTimeForInput(thefrom)}
                      onChange={handleFrom}
                      className="font-medium h-auto items-center border-[1px] border-gray-300 self-center w-full px-4 py-2 rounded-md ms:w-auto"
                    />
                  </label>
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700  ms:w-auto">
                    To:
                    <input
                      type="time"
                      value={formatTimeForInput(theto)}
                      onChange={handleTo}
                      className="font-medium h-auto ms:w-auto items-center border-[1px] border-gray-300 self-center w-full px-4 py-2 rounded-md"
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-col  ms:w-auto md:flex-row mb-6">
                <label className="text-gray-700 mr-20">
                  Type:
                  <select
                    className="font-medium ms:w-auto h-auto items-center border-[1px] border-gray-300 self-center w-full px-4 py-2 rounded-md"
                    onChange={(e) => setIsOnline(e.target.value)}
                    value={isOnline}
                  >
                    <option value="true">Online</option>
                    <option value="false">Onsite</option>
                  </select>
                </label>
              </div>
              {/* Location selection */}
              {isOnline === false || isOnline === 'false' ? (
                <div className="flex flex-col md:flex-row mb-6  ms:w-auto">
                  <div className="flex flex-col">
                    <label className="text-gray-700 mr-20">
                      Building :
                      <CustomSelectBox
                        options={allStages}
                        placeholder="Select Location"
                        onSelect={handleStages}
                        styled="font-medium h-auto ms:w-auto items-center border-[1px] border-gray-300 self-center w-full px-4 py-2 rounded-md"
                        enable={false}
                        oldvalue={theroombuilding}
                      />
                    </label>
                  </div>
                  <div className="flex flex-col">
                    {(theroombuilding?.length > 0 ||
                      (building.length > 0 && allrooms.length > 0)) && (
                        <label className="text-gray-700  ms:w-auto mr-20">
                          Location :
                          <CustomSelectBox
                            options={
                              remainingRooms.length > 0
                                ? remainingRooms
                                : allroomsRef.current
                            }
                            placeholder="Select Location"
                            onSelect={handlePlace}
                            styled="font-medium h-auto items-center border-[1px] border-gray-300 self-center w-full px-4 py-2 rounded-md"
                            enable={false}
                            oldvalue={theroomname}
                          />
                        </label>
                      )}
                  </div>
                </div>
              ) : null}
            </div>
            {/* Modal footer */}
            <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
              <button
                className={`primary-button btnCol text-white hover:text-white hover:font-bold mr-4 ${clickEdit && 'opacity-50 cursor-not-allowed'}`}
                type="button"
                onClick={handleSave}
                disabled={clickEdit}
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
    </>
  );


};

const AddSchedules = ({
  isOnline,
  setIsOnline,
  handlePlace,
  handleFrom,
  handleTo,
  allClasses,
  handleClass,
  handleClose,
  handleSave,
  // theroom,
  click,
  allrooms,
  handleCloseNotificatonMessages,
  handleOpenNotificatonMessages,
  messages,
  confirmOccupied,
  // thefrom,
  // theto,
  // theclass,
  theroombuilding,
  handleStages,
  allStages,
  building,
  allroomsRef,
  remainingRooms,
  // theroomname,
  // isEdit,
}) => {
  let classNames = allClasses.map((clss) => clss.course_id);


  return (
    <>
      {click && confirmOccupied ? (
        <>
          <>
            ({' '}
            <NotificatonMessage
              handleOpenNotificatonMessages={handleOpenNotificatonMessages}
              handleCloseNotificatonMessages={handleCloseNotificatonMessages}
              messages={messages}
            />
            )
          </>
        </>
      ) : click && !confirmOccupied ? (
        <>
          <div className="justify-center items-center flex  overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-3/4 my-6 p-20 m-20 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between opacity-5 p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold opacity-5">
                    Modal Title
                  </h3>
                  <button className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none">
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 pr-12">
                  <div className="flex flex-col mb-10 mr-0 justify-center">
                    <div
                      role="status"
                      className="flex flex-col  justify-center absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
                    >
                      <div className="flex justify-center pb-12">
                        <svg
                          aria-hidden="true"
                          className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      </div>
                      <div className="flex justify-center">
                        <h5 className="text-gray-700 text-base">
                          please wait until process complete...
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b"></div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-gray-700 text-3xl font-bold">
                    Create Schedule
                  </h3>
                  <button className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none">
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
                              'font-medium h-auto justify-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px] '
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
                         w-60 inline-block ml-[8px]"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 mr-20 ">
                        type:
                        <select
                          className="font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px]"
                          onChange={(e) => setIsOnline(e.target.value)}
                          value={isOnline}
                        // disabled={role == "0" ? true : false}
                        >
                          {/* <option value="">Choose Value..</option> */}
                          <option value=" ">Choose Value..</option>
                          <option value="true">Online</option>
                          <option value="false">Onsite</option>
                        </select>
                      </label>

                    </div>
                    {isOnline === 'false' ?
                      <>
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
                                    'font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px]'
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
                                      options={
                                        remainingRooms.length > 0
                                          ? remainingRooms
                                          : allroomsRef.current
                                      }
                                      placeholder="Select Location"
                                      onSelect={handlePlace}
                                      styled={
                                        'font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px]'
                                      }
                                      enable={false}
                                    />
                                  }
                                </label>
                              )}
                          </div>
                        </div>
                      </>
                      : <></>}

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
        </>
      )}
    </>
  );
};
