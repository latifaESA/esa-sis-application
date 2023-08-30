import React from "react";
import CustomSelectBox from "../pages/programManager/customSelectBox";

export default function AddClass({
  promotion,
  handlePromotionClass,
  dateFrom,
  handleDateFromChange,
  dateTo,
  handleDateToChange,
  courses,
  handleCourse,
  teachers,
  handleTeacher,
  handleCancel,
  handleSave,
  error,
 errorCourse,
 errorTeacher,
 errorStart,
 errorEnd,
 errorPromotion,
}) {
  // const handleCancel = () => {
  //     setOpen(false)
  // }
  

  return (
    <>

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
                               Create Class
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
                                <div className="flex flex-row justify-center mb-6">
                                    <div className="flex flex-col">
                                        <label className="text-gray-700 mr-20">
                                            Course:

                                            {
                                                <CustomSelectBox
                                                    options={courses}
                                                    placeholder="Select Course"
                                                    onSelect={handleCourse}
                                                    styled={
                                                        "font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px]"
                                                    }
                                                    enable={false}
                                                />
                                            }
                                             <div className="text-red-500 self-center">{errorCourse}</div>
                                        </label>
                                       
                                    </div>


                                    <div className="flex flex-col">
                                        <label className="">
                                            Teacher:
                                            {
                                                <CustomSelectBox
                                                    options={teachers}
                                                    placeholder="Select Teacher"
                                                    onSelect={handleTeacher}
                                                    styled={
                                                        "font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px]"
                                                    }
                                                    enable={false}
                                                />
                                            }
                                            <div className="text-red-500 self-center">{errorTeacher}</div>
                                        </label>
                                        
                                    </div>




                                </div>
                                <div className="flex flex-row  mb-6">
                                    <div className="flex flex-col">
                                        <label className="">
                                            Promotion:
                                            {
                                                <CustomSelectBox
                                                    options={promotion}
                                                    placeholder="Select Promotion"
                                                    onSelect={handlePromotionClass}
                                                    styled={
                                                        "font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px]"
                                                    }
                                                    enable={false}
                                                />
                                            }
                                        </label>
                                        <div className="text-red-500 self-center">{errorPromotion}</div>
                                    </div>

                                </div>
                                <div className="flex flex-row  mb-4">
                                    
                                        <div className="flex flex-col">
                                            <label className="text-gray-700 mr-20">
                                                Start Date:
                                                {<input type="date" value={dateFrom} onChange={handleDateFromChange} className="font-medium h-auto items-center border-[1px] border-zinc-300 self-center w-60 inline-block ml-[8px]" />}
                                                <div className="text-red-500 self-center">{errorStart}</div>
                                            </label>
                                        </div>
                                        <div  className="flex flex-col">
                                            <label className="">
                                                End Date:
                                                {<input type="date" value={dateTo} onChange={handleDateToChange} 
                                                className="font-medium h-auto items-center border-[1px] 
                                                border-zinc-300 self-center w-60 inline-block ml-[8px]" />}
                                                 <div className="text-red-500 self-center">{errorEnd}</div>
                                            </label>

                                        </div>
                                        <div className="text-red-500 self-center">{error}</div>
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
                                onClick={handleCancel}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    </>
);
}
