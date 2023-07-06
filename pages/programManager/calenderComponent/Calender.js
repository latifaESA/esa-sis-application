import { useEffect, useRef, useState } from "react";
import { useSession } from 'next-auth/react';
import {
  SevenColGrid,
  Wrapper,
  HeadDays,
  DateControls,
  StyledEvent,
  SeeMore,
  PortalWrapper,
  ScheduleForm
} from "./Calender.styled";
import { DAYS, HOURS, MOCKAPPS, ROOMS, TYPE } from "./conts";
import {
  datesAreOnSameDay,
  getDarkColor,
  getDaysInMonth,
  getMonthYear,
  getSortedDays,
  nextMonth,
  prevMonth,
  range,
  sortDays
} from "./utils";
import { ArrowLeftCircleIcon, ArrowLeftIcon, ArrowRightCircleIcon, ArrowRightIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import CustomSelectBox from "../customSelectBox";
import axios from "axios";

export const Calender = () => {
  const { data: session } = useSession();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(MOCKAPPS);
  const dragDateRef = useRef();
  const dragindexRef = useRef();
  const [showPortal, setShowPortal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [portalData, setPortalData] = useState({});
  const [classes, setClasses] = useState('');
  const [allClasses, setAllClasses] = useState([]);
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [place, setPlace] = useState('');
  const [isSave, setIsSave] = useState(false);
  const [theDate, setTheDate] = useState('');
  const [scheduleDate, setScheduleDate] = useState([]);
  const [allRoomBuilding, setAllRoomBuilding] = useState([]);
  const [allroomName, setAllRoomName] = useState([]);
  const [roomBuilding, setRoomBuilding] = useState('');
  const [roomName, setRoomName] = useState('');
  const [tmpscheduleID, setTmpscheduleID] = useState(null)

  const getAllRooms = async () => {
    try{
      let table = 'rooms';
      let {data} = await axios.post('/api/pmApi/getAll', {table})
      setAllRoomName(data.rows)
    }catch(error){
      console.log(error)
    }
  }

  const getSchedule = async () => { 
    let table = 'tmpschedule';
    let colName = 'pm_id'
    let pmID = session.user.userid;
    let {data} = await axios.post('/api/pmApi/getScheduleByPMId', {pmID})

    const datesArray = [];
    data.data.forEach((sched) => {
      datesArray.push({ 
        tmpschedule_id:sched.tmpschedule_id,
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
        color: "#0ba388" 
      })
    })
    setScheduleDate(datesArray)
    console.log('datesArray of schedule:  ', datesArray)
    console.log('schedule:  ', data.data)
  }

  const getClass = async () => {
    let table = 'tmpclass';
    let colName = 'pm_id'
    let val = session.user.userid;
    let {data} = await axios.post('/api/pmApi/getAllCondition', {table, colName, val});

    console.log('all classes:  ==> ', data.rows)

    // setAllClasses(data.rows.map(clas => clas.course_id))
    setAllClasses(data.rows)
  }
  useEffect(() => { 
    getSchedule();
    getClass();
    getAllRooms();
  }, [])
  
  const areDatesEqual = (date1, date2) => {
    return date1.getTime() === date2.getTime();
  }

  const handleAddPrevious = (data) =>{
    console.log("date.getFullYear() === > >", data.date.getFullYear())
    console.log("date.getMonth() === > >", data.date.getMonth())
    console.log("date.getDate() === >", data.date.getDate());

    let ifPreviousExists = events.some(ev => areDatesEqual(ev.date, new Date(data.date.getFullYear(), data.date.getMonth(), data.date.getDate() - 1)));
    // console.log('if exists previously ===>>',)

    !ifPreviousExists &&
    setEvents((prev) => [
      ...prev,
      { date: new Date(data.date.getFullYear(), data.date.getMonth(), data.date.getDate() - 1), title: data.title, color: "#0ba388",type: data.type, teacher: "peter germanos",from:data.from, to:data.to, place: data.place, course: "MAth21" }
    ])

}

const handleAddNext = (data) =>{
  console.log("date.getFullYear() === > >", data.date.getFullYear())
  console.log("date.getMonth() === > >", data.date.getMonth())
  console.log("date.getDate() === >", data.date.getDate());

  let ifNextExists = events.some(ev => areDatesEqual(ev.date, new Date(data.date.getFullYear(), data.date.getMonth(), data.date.getDate() + 1)));
  // console.log('if exists previously ===>>',)

  !ifNextExists &&
  setEvents((prev) => [
    ...prev,
    { date: new Date(data.date.getFullYear(), data.date.getMonth(), data.date.getDate() + 1), title: data.title, color: "#0ba388",type: data.type, teacher: "peter germanos",from:data.from, to:data.to, place: data.place, course: "MAth21" }
  ])

}

  const drag = (index, e) => {
    dragindexRef.current = { index, target: e.target };
  };

  const onDragEnter = (date, e) => {
    e.preventDefault();
    dragDateRef.current = { date, target: e.target.id };
  };

  const drop = async (ev,e) => {
    e.preventDefault();

    if(!((new Date(ev.date).getFullYear(),new Date(ev.date).getMonth(),new Date(ev.date).getDate())
    ==
    (new Date(dragDateRef.current.date).getFullYear(),new Date(dragDateRef.current.date).getMonth(),new Date(dragDateRef.current.date).getDate()))){
    handlePlace(ev.room_name)
    let {data} = await axios.post('/api/pmApi/createSingleSchedule', {classID:ev.class_id, day: new Date(dragDateRef.current.date), fromTime:ev.from, toTime:ev.to, room_id: place, pm_id: session.user.userid
    })

      console.log('axios data ==>  ', data)
      if(data.success){
        getSchedule()
      }
    }

  };

  const handlePlace = (selectedValue) =>{
  // handlePlace
    // Do something with the selected value
    console.log("Selected Value:", selectedValue);
    // setPlace(selectedValue)
    setPlace(selectedValue.length > 0 &&
      allroomName.filter(room => room.room_name === selectedValue
        )[0].room_id)
  };

  const handleFrom = (selectedValue) => {
    // Do something with the selected value
    console.log("Selected Value:", selectedValue);
    setFromTime(selectedValue)
  };

  const handleTo = (selectedValue) => {
    // Do something with the selected value
    console.log("Selected Value:", selectedValue);
    setToTime(selectedValue)
  };

  const handleClass = (selectedValue) => {
    // Do something with the selected value
    selectedValue.length > 0 &&
    setClasses(allClasses.filter(clas => clas.course_id === selectedValue)[0].tmpclass_id)
  };



  const addEvent = (date, event) => {
    event.preventDefault();
    setShowForm(true);
    if (!event.target.classList.contains("StyledEvent")) {
        date.setHours(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        console.log("date.setHours(0) === > >", date.setHours(0))
        console.log("date.setSeconds(0) === > >", date.setSeconds(0))
        console.log("date.setMilliseconds(0) === > >", date.setMilliseconds(0))
        console.log("date===>", date)
        setTheDate(date)
    }
  };

  const handleClose = () =>{
    setShowForm(false)
  }
// getDarkColor() is a function to get a random color
  const handleSave = async (e) =>{
        e.preventDefault()
          let {data} = await axios.post('/api/pmApi/createSingleSchedule', {classID:classes, day: theDate, fromTime:fromTime, toTime:toTime, room_id: place, pm_id: session.user.userid
          })

            console.log('axios data ==>  ', data)
            if(data.success){
              getSchedule()
              setShowForm(false)
            }
        // setShowForm(false)
  }

  const handleOnClickEvent = (event) => {
    setShowPortal(true);
    setPortalData(event);
  };

  const handlePotalClose = () => setShowPortal(false);

  const handleDelete = async () => {
    // setEvents((prevEvents) =>
    //   prevEvents.filter((ev) => ev.date !== portalData.date)
    // );
    // handlePotalClose();

    let table = 'tmpschedule';
    let colName = 'tmpschedule_id';
    let id = portalData.tmpschedule_id;
    let {data} = await axios.post('/api/pmApi/delete', {table, colName, id})
    console.log('deleted:  ==> ',data)
    if(data.rowCount > 0){
      handlePotalClose();
      getSchedule();
    }
    // console.log(id)
  };

  const handleCloseEdit = () =>{
    setShowFormEdit(false)
  }

  const handleSaveEdit = async (e) =>{
    e.preventDefault();
    // setShowFormEdit(false)
    console.log("the edit form: ==> ", {
      classID: typeof classes === 'string' ? allClasses.filter(clas => clas.course_id === classes)[0].tmpclass_id : classes, 
      day: theDate, 
      fromTime:fromTime, 
      toTime:toTime, 
      room_id: place > 0 ? place : allroomName.filter(rom => rom.room_name === roomName)[0].room_id, 
      pm_id: session.user.userid,
      tmpscheduleID
    }
      )
      // tmpscheduleID, classID, day, fromTime, toTime, room_id, pm_id
      let pmID = session.user.userid;
      let schedData = {
        pm_id : pmID,
        tmpscheduleID : tmpscheduleID,
        classID : typeof classes === 'string' ? allClasses.filter(clas => clas.course_id === classes)[0].tmpclass_id : classes, 
        day : theDate, 
        fromTime : fromTime, 
        toTime : toTime, 
        room_id : place > 0 ? place : allroomName.filter(rom => rom.room_name === roomName)[0].room_id, 
        pm_id: session.user.userid
      } 
      console.log("schedData  :", schedData)
      
      let {data} = await axios.post('/api/pmApi/updateSingleSchedule', schedData)
      if(data.success){
        getSchedule()
        setShowFormEdit(false)
      }
      console.log('the update change:  ', data)
  }


  const handleEdit = (e,event,date)=>{
    e.preventDefault();
    console.log(event)
    setShowFormEdit(true)
    setFromTime(event.from)
    setToTime(event.to)
    setClasses(event.courseID)
    setRoomBuilding(event.room_building)
    setRoomName(event.room_name)
    setTheDate(date)
    setTmpscheduleID(event.tmpschedule_id)
  }
  return (
    <Wrapper>
      <DateControls>
        {/* <button
          onClick={(e) => {
            e.preventDefault();
            prevMonth(currentDate, setCurrentDate)
        }}
        >left</button> */}
        <ArrowLeftCircleIcon className="w-10 h-10 cursor-pointer" onClick={(e) => {
            e.preventDefault();
            prevMonth(currentDate, setCurrentDate)
        }}/>
        {getMonthYear(currentDate)}
        {/* <button
          onClick={(e) => {
            e.preventDefault();
            nextMonth(currentDate, setCurrentDate)
        }}
        >right</button> */}

        <ArrowRightCircleIcon className="w-10 h-10 cursor-pointer" onClick={(e) => {
            e.preventDefault();
            nextMonth(currentDate, setCurrentDate)
        }}/>
      </DateControls>
      <SevenColGrid>
        {DAYS.map((day) => (
          <HeadDays className="nonDRAG">{day}</HeadDays>
        ))}
      </SevenColGrid>

      <SevenColGrid
        fullheight={true}
        is28Days={getDaysInMonth(currentDate) === 28}
      >
        {getSortedDays(currentDate).map((day) => (
          <div
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
              className={`nonDRAG ${
                datesAreOnSameDay(
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
                  console.log('ev:===> ',ev)
                  console.log(ev.date)
                  console.log(new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                  ))
                  console.log('isld==>',datesAreOnSameDay(
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
                      key={ev.title}
                      bgColor={ev.color}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnd={(e)=>drop(ev,e)}
                    >
                      <div className="flex justify-between" name='arrows'>
                    <ArrowLeftIcon className="h-7 w-7 cursor-pointer" id="left" 
                    onClick={() => handleAddPrevious(ev)}
                    />
                    <ArrowRightIcon className="h-7 w-7 cursor-pointer" id="right"
                    onClick={() => handleAddNext(ev)}
                    />
                    </div>

                     <div>{ev.course}</div>
                     {/* <div>{ev.title}</div> */}
                     <div>{ev.type}</div>
                     <div>{ev.teacher}</div>
                     <div>{ev.from}</div>
                     <div>{ev.to}</div>
                     <div>{ev.room_building}</div>
                     <div>{ev.room_name}</div>
                     <div name="actors">
                      <span name="edit" onClick={(e) => handleEdit(e,ev,new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day
                    ))}>edit</span>
                      <span name="delete" onClick={() => handleOnClickEvent(ev)}>delete</span>
                     </div>
                    </StyledEvent>
                  )
              )}
            </EventWrapper>
            {
            // scheduleDate.every(
            //     (ev) => 
            //  !datesAreOnSameDay(
            //   ev.date,
            //   new Date(
            //     currentDate.getFullYear(),
            //     currentDate.getMonth(),
            //     day
            //   )
            // ) 
            //     )
            //      && 
                 day && <PlusCircleIcon className="h-10 w-10 cursor-pointer" onClick={(e) =>
                  addEvent(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day
                    ),
                    e
                  )
                }/>
                }        
                  </div>
        ))}
      </SevenColGrid>
      {showPortal && (
        <Portal
          {...portalData}
          handleDelete={handleDelete}
          handlePotalClose={handlePotalClose}
        />
      )}
      {
        showForm && (
            <AddSchedule 
            handleClose={handleClose}
            allClasses={allClasses}
            handleClass={handleClass}
            handleFrom={handleFrom}
            handleTo={handleTo}
            handlePlace={handlePlace}
            theroom = {allroomName}
            handleSave={handleSave}
            />
        )
      }

{
        showFormEdit && (
            <AddSchedule 
            handleClose={handleCloseEdit}
            allClasses={allClasses}
            handleClass={handleClass}
            handleFrom={handleFrom}
            handleTo={handleTo}
            handlePlace={handlePlace}
            theroom = {allroomName}
            handleSave={handleSaveEdit}
            thefrom={fromTime}
            theto={toTime}
            theclass={classes}
            theroombuilding={roomBuilding}
            theroomname={roomName}
            isEdit={true}
            />
        )
      }

    </Wrapper>
  );
};

// const EventWrapper = ({ children }) => {
//   if (children.filter((child) => child).length)
//     return (
//       <>
//         {children}
//         {children.filter((child) => child).length > 2 && (
//           <SeeMore
//             onClick={(e) => {
//               e.stopPropagation();
//               console.log("clicked p");
//             }}
//           >
//             see more...
//           </SeeMore>
//         )}
//       </>
//     );
// };

const EventWrapper = ({ children }) => {
  // if (children.filter((child) => child).length)
    return (
      <>
        {children}
        {/* {children.filter((child) => child).length > 2 && (
          <SeeMore
            onClick={(e) => {
              e.stopPropagation();
              console.log("clicked p");
            }}
          >
            see more...
          </SeeMore>
        )} */}
      </>
    );
};
const Portal = ({ title, date, handleDelete, handlePotalClose }) => {
  return (
    <PortalWrapper>
      <h2>{title}</h2>
      <p>{date.toDateString()}</p>
      {/* <button onClick={handleDelete} name="trash-outline">trash</button> */}
      <TrashIcon className="w-9 h-9 text-red-500 cursor-pointer transition-all hover:w-11 h-11" onClick={handleDelete} name="trash-outline"/>
      <button onClick={handlePotalClose} name="close-outline">X</button>
    </PortalWrapper>
  );
};

const AddSchedule = ({handlePlace,handleTo,handleFrom,allClasses,handleClass,handleClose, handleSave, theroom,thefrom,theto,theclass,theroombuilding,theroomname,isEdit}) => {

  let classNames = allClasses.map(clss => clss.course_id)

  const [allrooms, setAllrooms] = useState([])
  let allStages = [];

  const [building, setBuilding] = useState('')
  const handleStages = (selectedValue) => {
    setBuilding(selectedValue)
    setAllrooms([])
    console.log('allrooms1 :: ==> ', allrooms)
    theroom.forEach(room =>{
      room.room_building === selectedValue
       &&
      setAllrooms(prev => [...prev, room.room_name])
    })
    console.log('allrooms2 :: ==> ', allrooms)
  }

  const allroomsRef = useRef([]);
const handleStages1 = (selectedValue) => {
  theroom.forEach((room) => {
    if (room.room_building === selectedValue) {
      allroomsRef.current.push(room.room_name);
    }
  });
};

isEdit && handleStages1(theroombuilding)


  theroom.forEach(room =>{ 
    if(!allStages.includes(room.room_building)){
      allStages.push(room.room_building)
    }
  }
    )

    return (
        <ScheduleForm>
          {/* class */}
        <label className="flex justify-between items-center w-full">
        Class:
          {/* Start select box */}
        <CustomSelectBox 
        options={classNames}
        placeholder="Select Class"
        onSelect={handleClass}
        styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-10 mt-5 mb-5"}
        oldvalue={theclass}
        />
        </label>
        {/* time */}
        <label className="w-full">
            time Picker :
            <label className="flex justify-between items-center w-full">
            From :

              {/* Start select box */}
            <CustomSelectBox 
            options={HOURS}
            placeholder="Select Time From"
            onSelect={handleFrom}
            styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-10 mt-5 mb-5"}
            enable={false}
            oldvalue={thefrom}
            />
          </label>

          <label className="flex justify-between items-center w-full">
            To :

              {/* Start select box */}
            <CustomSelectBox 
            options={HOURS}
            placeholder="Select Time To"
            onSelect={handleTo}
            styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-10 mt-5 mb-5"}
            enable={false}
            oldvalue={theto}
            />
          </label>
        </label>

        {/* room */}
        <label className='w-[350px] flex justify-between mb-3'>
            Building :
            {
              <CustomSelectBox
              options={allStages}
              placeholder="Select Location"
              onSelect={handleStages}
              styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-[8px]"}
              enable={false}
              oldvalue={theroombuilding}
              />
            }
        </label>

        { (theroombuilding?.length > 0 || building.length > 0 && allrooms.length > 0) &&
            <label className='w-[350px] flex justify-between mb-3'>
                Location :
                {
                  <CustomSelectBox
                  options={allrooms.length>0 ? allrooms : allroomsRef.current}
                  placeholder="Select Location"
                  onSelect={handlePlace}
                  styled={"font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-40 inline-block ml-[8px]"}
                  enable={false}
                  oldvalue={theroomname}
                  />
                }
            </label>
        }

        <div className="flex justify-between items-center">
        <button onClick={handleClose} className="text-white bg-red-600 p-3 hover:bg-red-400 mb-0">Cancel</button>
        <button onClick={handleSave} className="text-white bg-green-600 p-3 hover:bg-green-400 mb-0">Save</button>
        </div>
        </ScheduleForm>
    )
}
