import { useSession } from "next-auth/react";

import React, { useState, useEffect } from "react";
// import generatePasswod from "../../utilities/generatePassword";
import axios from "axios";
// import bcryptjs from "bcryptjs";
import { useRouter } from "next/router";
import { NotificatonMessage } from "../../components/Dashboard/WarningMessage";



export default function AdditionList() {
    const [formErrors, setFormErrors] = useState({});
    const [errors, setErrors] = useState({});
    const { data: session } = useSession();
    // const [users, setUsers] = useState([]);
    // const [assistance, setAssistance] = useState([]);
    // const [message, setMessage] = useState("");

    const router = useRouter();

    const [confirmOpenMessage, setConfirmOpenMessage] = useState(false);
    const [messages, setMessages] = useState("");
    // const [confirmCancleMessage, setConfirmCancleMessage] = useState(false);
    const [promotion, setPromotion] = useState("");

    const [major, setMajor] = useState();
    const [majorValue, setMajorValue] = useState("");
    const [additionOption, setAdditionOption] = useState('0')
    const [majorName, setMajorName] = useState('')
    const [courseType, setCourseType] = useState('')
    const [counter, setCounter] = useState(() => {
        // Initialize the counter from localStorage or use 1 if it doesn't exist
        const storedCounter = localStorage.getItem("counter");
        return storedCounter ? parseInt(storedCounter) : 1;
      });

      const generateMajorID = () => {
        return counter; // Return the current value of counter as the ID
      };
    
      useEffect(() => {
        // Save the counter value to localStorage whenever it changes
        localStorage.setItem("counter", counter.toString());
      }, [counter]);
    const redirect = () => {
        router.push("/AccessDenied");
    };

    const getAllMajors = async () => {
        let majorData = await axios.get("/api/admin/adminApi/getMajor");

        setMajor(majorData.data);
    };
    useEffect(() => {
        getAllMajors();
    }, [major]);
    const handleAdd = async () => {
        const errors = {};
        if (promotion.trim() === "") {
            errors.promotion = "promotion is required.";
        }
        if (majorValue.length === 0) {
            errors.majorValue = "Select At Least one major"
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const payload = {

            promotion_name: promotion.trim('').toUpperCase(),
            academic_year: new Date().getFullYear(),
            major_id: majorValue,
        };
        // console.log(payload);
        try {
            const data = await axios.post(
                "/api/admin/adminApi/createPromotion",
                payload
            );
            if (data.data.success === true) {
                setPromotion('')

                setMajorValue('')
                // console.log(data.data.message);
                setConfirmOpenMessage(true);
                setMessages(data.data.message);
            }

        } catch (error) {
            return error;
        }
    };

    const handleAddOption = async () => {


        if (additionOption === '2') {
            const errors = {};
            if (majorName.trim() === "") {
                errors.majorName = "major name is required.";
            }


            if (Object.keys(errors).length > 0) {
                setErrors(errors);
                return;
            }
            const payload = {
                major_id: generateMajorID(),
                major_name: majorName.trim(" ")

            }
            const data = await axios.post('/api/admin/adminApi/createMajor', payload)
            console.log(data)
            if (data.data.success === true) {
                setCounter((prevCounter) => prevCounter + 1); // Increment the counter
                setMajorName(' ')
                setConfirmOpenMessage(true);
                setMessages(data.data.message);
            }
        }
        else if (additionOption === '3') {
            const errors = {};
            if (courseType.trim(" ") === "") {
                errors.courseType = "course Type is required.";
            }


            if (Object.keys(errors).length > 0) {
                setErrors(errors);
                return;
            }
            const payload = {
                table: 'course_type',
                column: 'course_type',
                value: courseType
            }

            const data = await axios.post('/api/admin/adminApi/create', payload)
            if (data.data.success === true) {
                setCourseType(' ')
                setConfirmOpenMessage(true);
                setMessages(data.data.message);
            }
        }
    }
  console.log(counter)
    const handleOpenNotificatonMessages = () => {
        setConfirmOpenMessage(true);
    };
    const handleCloseNotificatonMessages = () => {
        setConfirmOpenMessage(false);
    };

    return (
        <>
            {confirmOpenMessage && (
                <NotificatonMessage
                    handleOpenNotificatonMessages={handleOpenNotificatonMessages}
                    handleCloseNotificatonMessages={handleCloseNotificatonMessages}
                    messages={messages}
                />
            )}
            <div className="flex flex-cols mb-20">
                <label>
                    Addition List:
                    <select
                        onChange={(e) => setAdditionOption(e.target.value)}
                        value={additionOption}
                        className="ml-10 mt-3 w-96 max-[850px]:ml-10 max-[850px]:mt-0"
                    >
                        <option value="0">
                            Choose a Addition
                        </option>
                        <option value="1"> Promotion</option>
                        <option value="2">Major</option>
                        <option value="3">Course Type</option>



                    </select>

                </label>
            </div>

            {session?.user.role === "0" ? (
                <>
                    {additionOption === "1" ? (
                        <>

                            <form className=" mb-3 pb-4 justify-between border-blue-300 border-b-2">
                                <div className="mb-12">
                                            
                                <label className="">
                                                Promotion:
                                                <input
                                                className="ml-10 mt-3 w-1/2 max-[850px]:ml-10 max-[850px]:mt-0"
                                                type="text"
                                                name="ID"
                                                required
                                                placeholder="promotion"
                                                value={promotion}
                                                onChange={(e) => setPromotion(e.target.value)}
                                            ></input>
                                            {formErrors.promotion && (
                                                <div className="text-center text-red-500 font-bold">
                                                    {formErrors.promotion}
                                                </div>
                                            )}
                                            </label>
                                </div>
                            
                                                                       
                                      
                                        
                                <label className="">
                                                Major:
                                                <select
                                                onChange={(e) => setMajorValue(e.target.value)}
                                                value={majorValue}
                                                className="ml-20 mt-3 w-1/2 max-[850px]:ml-10 max-[850px]:mt-0"
                                            >
                                                <option key={"uu2isdvf"} value="">
                                                    Choose a Major
                                                </option>
                                                {major &&
                                                    major.map((major) => (
                                                        <>
                                                            <option key={major.major_name} value={major.major_id}>
                                                                {major.major_name}
                                                            </option>
                                                        </>
                                                    ))}
                                            </select>
                                            {formErrors.majorValue && (
                                                <div className="text-center text-red-500 font-bold p-2">
                                                    {formErrors.majorValue}
                                                </div>
                                            )}
                                            </label>
                                <div className="flex mt-4 justify-end">
                                        <button
                                            className="primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold"
                                            type="button"
                                            onClick={handleAdd}
                                        >
                                            Add
                                        </button>
                                    </div>
                            </form>




                        </>

                    ) : additionOption === "2" ? (
                        <>
                            <form className=" mb-3 pb-4 border-blue-300 border-b-2">
                                <div className="flex flex-rows  justify-between">

                                    <label className="w-[350px]">
                                        Major Name:
                                        <input
                                            className="ml-1 w-60"
                                            type="text"
                                            name="ID"
                                            required
                                            placeholder="Major Name"
                                            value={majorName}
                                            onChange={(e) => setMajorName(e.target.value)}
                                        ></input>
                                        {errors.majorName && (
                                            <div className="text-center text-red-500 font-bold">
                                                {errors.majorName}
                                            </div>
                                        )}
                                    </label>


                                    <div className="">
                                        <button
                                            className="primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold"
                                            type="button"
                                            onClick={handleAddOption}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </>
                    ) : additionOption === '3' ? (
                        // Render AccountsList for role 2 users
                        <>
                            <form>
                                <div className="flex flex-rows mb-3 pb-4 border-blue-300 border-b-2 justify-between">

                                    <label className="w-[350px]">
                                        Course Type:
                                        <input
                                            className="ml-1 w-60"
                                            type="text"
                                            name="ID"
                                            required
                                            placeholder="Course Type"
                                            value={courseType}
                                            onChange={(e) => setCourseType(e.target.value)}
                                        ></input>
                                        {errors.courseType && (
                                            <div className="text-center text-red-500 font-bold">
                                                {errors.courseType}
                                            </div>
                                        )}
                                    </label>


                                    <div className="">
                                        <button
                                            className="primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold"
                                            type="button"
                                            onClick={handleAddOption}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </form>

                        </>
                    ) : (
                        <></>
                    )}

                </>

            ) : (
                redirect()
            )}
        </>
    );
}
AdditionList.auth = true;
AdditionList.adminOnly = true;
