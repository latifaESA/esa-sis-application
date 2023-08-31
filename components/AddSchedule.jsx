import React, { useState } from "react";
import CustomSelectBox from "../pages/programManager/customSelectBox";
// import { HOURS } from "../components/calenderComponent/conts";
// import { useSession } from 'next-auth/react';
// import axios from 'axios';
export default function AddSchedule({
  handleFrom,
  handleTo,
  handleLocation,
  handleSelect,
  selectedValues,
  handleCancelSchedule,
  handleSaveSchedule,
  theroom,
  isClicked,
  // courseValue,
  // teacherValue,
  // setIsAddSchedule,
  setPromotions,
  setCourseValue,

  // weekDays,
  // dateFrom,
  // dateTo,
  // promotions,
  // attendance,

  // details,
  setDetails,
  // student,
  setStudent,
  setCourseType,
}) {
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

  theroom.forEach((room) => {
    if (!allStages.includes(room.room_building)) {
      allStages.push(room.room_building);
    }
  });



  const handleSaveAll = async () => {
    try {
      await handleSaveSchedule();

      // Rest of the code to clear state or perform any other actions if needed.
      setStudent([]);
      setDetails([]);
      setCourseType("");
      setCourseValue("");
      setPromotions("");
   
    } catch (error) {
      // Handle any errors that may occur during the API calls.
      console.error("Error occurred while saving: ", error);
    }
  };

  return (
    <>

      <>
        <div
          className="justify-center items-center flex  overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        >
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none ">
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
                      className={` py-1 px-2 primary-button hover:text-white cursor-pointer  ${selectedValues.includes(1)
                        ? " primary-button btnCol text-white"
                        : "bg-green-500"
                        }`}
                      onClick={() => handleSelect(1)}
                    >
                      Mon
                    </span>
                    <span
                      className={`py-1 px-2 cursor-pointer primary-button hover:text-white  ${selectedValues.includes(2)
                        ? "primary-button btnCol text-white"
                        : "bg-green-500"
                        }`}
                      onClick={() => handleSelect(2)}
                    >
                      Tue
                    </span>
                    <span
                      className={`py-1 px-2 cursor-pointer primary-button hover:text-white  ${selectedValues.includes(3)
                        ? "primary-button btnCol text-white"
                        : "bg-green-500"
                        }`}
                      onClick={() => handleSelect(3)}
                    >
                      Wed
                    </span>
                    <span
                      className={`py-1 px-2 cursor-pointer primary-button hover:text-white  ${selectedValues.includes(4)
                        ? "primary-button btnCol text-white"
                        : "bg-green-500"
                        }`}
                      onClick={() => handleSelect(4)}
                    >
                      Thurs
                    </span>
                    <span
                      className={`py-1 px-2 cursor-pointer primary-button hover:text-white  ${selectedValues.includes(5)
                        ? "primary-button btnCol text-white"
                        : "bg-green-500"
                        }`}
                      onClick={() => handleSelect(5)}
                    >
                      Fri
                    </span>
                    <span
                      className={`py-1 px-2 cursor-pointer primary-button hover:text-white  ${selectedValues.includes(6)
                        ? "primary-button btnCol text-white"
                        : "bg-green-500"
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
                      {building.length > 0 && allrooms.length > 0 && (
                        <label className=" text-gray-700">
                          Location :
                          {
                            <CustomSelectBox
                              options={allrooms}
                              placeholder="Select Location"
                              onSelect={handleLocation}
                              styled={
                                "font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px]"
                              }
                              enable={false}
                            />
                          }
                        </label>
                      )}
                    </div>

                  </div>
                  </div>
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                {isClicked ? (
                  <>
                    <button
                      className="primary-button btnCol text-white hover:text-white hover:font-bold mr-4 cursor-not-allowed text-white hover:text-white hover:text-white  px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 "
                      disabled
                      type="button"
                    >
                      Save
                    </button>
                    <button
                      disabled
                      type="button"
                      onClick={() => {
                        handleCancelSchedule();
                        setStudent([]);
                        setDetails([]);
                        setCourseType("");
                        setCourseValue("");
                        setPromotions("");
                      }}
                      className="bg-red-400 text-white px-4 py-2 rounded mr-4 text-white active:bg-red-400  cursor-not-allowed text-sm px-6 py-3 w-30 rounded  outline-none focus:outline-none mr-1 mb-1"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
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
                        setCourseType("");
                        setCourseValue("");
                        setPromotions("");
                      }}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>

    </>
  );
}
