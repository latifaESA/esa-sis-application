import React, { useEffect, useState } from "react";
import moment from 'moment-timezone';
import axios from "axios";
import CustomSelectBox from "../pages/programManager/customSelectBox";
import { NotificatonMessage } from "./Dashboard/WarningMessage";
// import { HOURS } from "../components/calenderComponent/conts";
// import { useSession } from 'next-auth/react';
// import axios from 'axios';


export default function AddSchedule({
  handleFrom,
  setIsOnLine,
  isOnline,
  handleTo,
  handleLocation,
  handleSelect,
  selectedValues,
  handleCancelSchedule,
  handleSaveSchedule,
  // theroom,
  allStages,
  isClicked,
  handleStages,
  confirmOccupied,
  handleOpenNotificatonMessages,
  handleCloseNotificatonMessages,
  messages,
  // setWeekDays,
  // setTheRoom,
  // courseValue,
  // teacherValue,
  // setIsAddSchedule,
  setPromotions,
  setCourseValue,
  // roomName,
  timeResult,
  // weekDays,
  // dateFrom,
  // dateTo,
  // promotions,
  // attendance,
  fromTime,
  toTime,
  // weekDays,
  // details,
  setDetails,
  // student,
  setStudent,
  // setCourseType,
  allrooms,
  building
}) {

 console.log('isOnline' , isOnline)
  // const [occupiedRooms, setOccupiedRooms] = useState([]);
  const [remainingRooms, setRemainingRooms] = useState([]);

  const searchBook = async () => {
    try {
      if (timeResult.length > 0 && building !== '' && fromTime !== '' && toTime !== '') {
        const occupiedRoomsArray = [];

        for (let i = 0; i < timeResult.length; i++) {
          const dates = new Date(timeResult[i]);
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


              // // Set state to store occupied rooms
              // setOccupiedRooms(occupiedRoomsArray);
              // console.log(occupiedRoomsArray)


              // Set state to store remaining rooms
              const remainingRoomsArray = allrooms.filter(room => !occupiedRoomsArray.includes(room));
              setRemainingRooms(remainingRoomsArray);

            } else {
              // If data.data.success is not true, set all rooms as remaining

              setRemainingRooms(allrooms);
            }
          } else {
            console.error('fromTimes or toTimes is null or undefined');
          }
        }
      }
    } catch (error) {

      return error;
    }
  };


  useEffect(() => {
    searchBook();
  }, [building, fromTime, toTime]);

  const handleSaveAll = async () => {
    try {
      // Save the schedule first
      await handleSaveSchedule();


      // Rest of the code to clear state or perform any other actions if needed.
      setStudent([]);
      setDetails([]);
      // setCourseType("");
      setCourseValue("");
      setPromotions("");

    } catch (error) {
      // Handle any errors that may occur during the API calls.
      console.error("Error occurred while saving: ", error);
    }
  };


  const deleteTable = async () => {
    try {
      await axios.post('/api/pmApi/deleteBooking')
    } catch (error) {
      return error
    }
  }





  return (
    <>
      {isClicked && confirmOccupied ? <>

        <>

          (  <NotificatonMessage
            handleOpenNotificatonMessages={handleOpenNotificatonMessages}
            handleCloseNotificatonMessages={handleCloseNotificatonMessages}
            messages={messages}
          />
          )


        </>
      </>
        : isClicked && !confirmOccupied ?
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

            </>
          )

          :
          <>

            <div
              className="justify-center items-center flex  overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none h-screen">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-gray-700 text-3xl font-bold">
                      Create Schedule
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    // onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent  text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 pr-12 h-3/4  flex-auto overflow-y-scroll">
                    <div className="flex flex-col mb-6 mr-0">
                      <div className="flex flex-row justify-between">
                        <span
                          className={`rounded text-white py-2 px-4 shadow outline-none hover:bg-secondary hover:font-bold active:bg-third disabled:bg-gray-400 hover:text-white cursor-pointer  ${selectedValues.includes(1)
                            ? " bg-third btnCol text-white"
                            : "bg-primary"
                            }`}
                          onClick={() => handleSelect(1)}
                        >
                          Mon
                        </span>
                        <span
                          className={`rounded text-white py-2 px-4 shadow outline-none hover:bg-secondary hover:font-bold active:bg-third disabled:bg-gray-400 hover:text-white cursor-pointer  ${selectedValues.includes(2)
                            ? " bg-third btnCol text-white"
                            : "bg-primary"
                            }`}
                          onClick={() => handleSelect(2)}
                        >
                          Tue
                        </span>
                        <span
                          className={`rounded text-white py-2 px-4 shadow outline-none hover:bg-secondary hover:font-bold active:bg-third disabled:bg-gray-400 hover:text-white cursor-pointer  ${selectedValues.includes(3)
                            ? " bg-third btnCol text-white"
                            : "bg-primary"
                            }`}
                          onClick={() => handleSelect(3)}
                        >
                          Wed
                        </span>
                        <span
                          className={`rounded text-white py-2 px-4 shadow outline-none hover:bg-secondary hover:font-bold active:bg-third disabled:bg-gray-400 hover:text-white cursor-pointer  ${selectedValues.includes(4)
                            ? " bg-third btnCol text-white"
                            : "bg-primary"
                            }`}
                          onClick={() => handleSelect(4)}
                        >
                          Thurs
                        </span>
                        <span
                          className={`rounded text-white py-2 px-4 shadow outline-none hover:bg-secondary hover:font-bold active:bg-third disabled:bg-gray-400 hover:text-white cursor-pointer  ${selectedValues.includes(5)
                            ? " bg-third btnCol text-white"
                            : "bg-primary"
                            }`}
                          onClick={() => handleSelect(5)}
                        >
                          Fri
                        </span>
                        <span
                          className={`rounded text-white py-2 px-4 shadow outline-none hover:bg-secondary hover:font-bold active:bg-third disabled:bg-gray-400 hover:text-white cursor-pointer  ${selectedValues.includes(6)
                            ? " bg-third btnCol text-white"
                            : "bg-primary"
                            }`}
                          onClick={() => handleSelect(6)}
                        >
                          Sat
                        </span>
                      </div>

                    </div>
                    <div className="flex  flex-col">
                      <div className="flex flex-row justify-center mb-6">
                        <div className="flex flex-col">
                          <label className="text-gray-700 mr-20">
                            From :
                            <input type={'time'}
                              onChange={(e) => handleFrom(e)}
                              className="font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px]"
                            />
                          </label>
                        </div>


                        <div className="flex flex-col">
                          <label className="text-gray-700">
                            To :
                            <input
                              type={'time'}
                              onChange={(e) => handleTo(e)}
                              className="font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px]" />
                          </label>
                        </div>
                      </div>
                      <div className="flex flex-col">
                          <label className="text-gray-700 mr-20 ">
                            type:
                            <select
                              className="font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px]"
                              onChange={(e) => setIsOnLine(e.target.value)}
                              value={isOnline}
                            // disabled={role == "0" ? true : false}
                            >
                              {/* <option value="">Choose Value..</option> */}
                              <option value="">Choose Value..</option>
                              <option value="true">Online</option>
                              <option value="false">Onsite</option>
                            </select>
                          </label>

                        </div>
                        {isOnline === 'true' || isOnline === ''? 
                        <>
                        </>:
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
                                  "font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px]"
                                }
                                enable={false}
                              />
                            }
                          </label>
                        </div>
                        <div className="flex flex-col">
                          {building.length > 0 && (
                            <label className="text-gray-700">
                              Location:
                              <CustomSelectBox
                                options={remainingRooms}
                                placeholder="Select Location"
                                onSelect={handleLocation}
                                styled="font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px]"
                                enable={false}
                              />
                            </label>
                          )}
                        </div>


                      </div>
                        </>}


                    </div>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <>
                      <button
                        type="button"
                        onClick={() => handleSaveAll()}
                        className="primary-button btnCol text-white hover:text-white hover:font-bold mr-4"

                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="bg-red-500 text-white px-4 py-2 rounded mr-4"
                        onClick={() => {
                          handleCancelSchedule();
                          setStudent([]);
                          setDetails([]);
                          // setCourseType("");
                          setCourseValue("");
                          setPromotions("");
                          deleteTable()
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>

          </>

      }

    </>
  );
}
