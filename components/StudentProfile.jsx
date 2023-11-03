import React, { useEffect, useState } from 'react';
import { FiEdit3, FiCheck, FiX } from "react-icons/fi";
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useSession } from "next-auth/react";
const ReactSpeedometer = dynamic(() => import('react-d3-speedometer'), { ssr: false });
// import ReactSpeedometer from "react-d3-speedometer"; // Import the speedometer component

const StudentProfile = () => {
  const { data: session } = useSession();

  const [studentData, setStudentData] = useState([]);
  const [showAddressError, setShowAddressError] = useState(false);
  const [addressErrorMessage, setAddressErrorMessage] = useState('');

  const [isEditingMobileNumber, setIsEditingMobileNumber] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState('');

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const user_id = session.user.userid;
      const response = await axios.post('/api/user/studentProfile', { user_id });
      const data = response.data.data[0];
      setStudentData(data);
      setEditedAddress(`${data.address_city}, ${data.address_street}, ${data.address_building}`);
    } catch (error) {
      console.error(error);
    }
  }

  const averageGrades = 60;


  const updateDetails = async () => {
    try {
      // Check if the edited address contains a comma
      if (!editedAddress.includes(',')) {
        setAddressErrorMessage('Please enter a comma between city, street, and building in the address.');
        setShowAddressError(true);
        return;
      }

      const payload = {
        userid: session.user.userid,
        mobile_number: studentData.mobile_number,
        address: editedAddress,
      };
      const response = await axios.post('/api/user/editProfileStudent', payload);

      if (response.data.success === true) {
        setIsEditingMobileNumber(false);
        setIsEditingAddress(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="bg-white flex justify-center items-center py-12">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">{studentData.student_firstname} {studentData.student_lastname}</h2>
        <p className="text-gray-700 text-lg font-bold">{studentData.major_name}</p>
      </div>

      <div className="flex flex-col lg:flex-row mt-12 overflow-auto">
        <div className="mr-6">
          {/* Replace the ApexCharts component with the ReactSpeedometer */}
          <ReactSpeedometer
            value={averageGrades}
            minValue={0}
            maxValue={100}
            startColor="red"
            needleTransitionDuration={9000}
            needleTransition="easeElastic"
            endColor="green"
            needleColor="blue"
            width={350}
            height={300}
            customSegmentStops={[0,25, 50, 70, 100]}
            segmentColors={["#CCCCFF", "#89CFF0","#4169E1" , '#000080']}
            currentValueText="Average Grades: ${value}%"
            needleHeightRatio={0.8} // Adjust this value to make the needle shorter (e.g., 0.6 for 60% of the default height)
          />

        </div>
        <div className="ml-12 mt-6">
          <div className='flex flex-rows'>
            <div className='mr-6'>
              <p className="text-blue-600/75 text-base mb-4 ">
                Mobile Number:

              </p>
            </div>

            <div>
              {isEditingMobileNumber ? (
                <div className='flex flex-rows'>
                  <div>
                    <input
                      type="text"
                      value={studentData.mobile_number}
                      className="text-blue-600/75 text-base mb-4"
                      onChange={(e) => setStudentData({ ...studentData, mobile_number: e.target.value })}
                    />
                  </div>
                  <div className='mr-6'>
                    <button onClick={() => updateDetails()}>
                      <FiCheck className="text-green-600 text-base" />
                    </button>
                    <button onClick={() => setIsEditingMobileNumber(false)}>
                      <FiX className='text-red-600 text-base' />
                    </button>
                  </div>

                </div>
              ) : (
                <div className='flex flex-rows mr-6'>
                  <div> <p className="text-blue-600/75 text-base mb-4">{studentData.mobile_number}</p></div>
                  <div>
                    <button onClick={() => setIsEditingMobileNumber(true)}>
                      <FiEdit3 className="text-blue-600/75 text-base hover:text-blue-400 hover:font-bold mb-4" />
                    </button>
                  </div>



                </div>
              )}
            </div>
          </div>

          <div className='flex flex-rows'>
            <div className='mr-4'>
              <p className="text-blue-600/75 text-base mb-4">
                Address:

              </p>
            </div>
            <div>
              {isEditingAddress ? (
                <div className='flex flex-rows'>
                  <div>
                    <input
                      type="text"
                      value={editedAddress}
                      onChange={(e) => setEditedAddress(e.target.value)}
                      className="text-blue-600/75 text-base mb-4"
                    />
                    {showAddressError && (
                      <div className="text-red-500 text-sm mt-2">
                        {addressErrorMessage}
                      </div>
                    )}
                  </div>

                  <div className='mr-6'>
                    <button onClick={() => updateDetails()}>
                      <FiCheck className="text-green-600 text-base" />
                    </button>
                    <button onClick={() => setIsEditingAddress(false)}>
                      <FiX className='text-red-600 text-base' />
                    </button>
                  </div>

                </div>
              ) : (
                <div className='flex flex-rows mr-6'>
                  <div><p className="text-blue-600/75 text-base mb-4 mr-12">{editedAddress}</p></div>

                  <div>
                    <button onClick={() => setIsEditingAddress(true)}>
                      <FiEdit3 className="text-blue-600/75 text-base hover:text-blue-400 hover:font-bold mb-4" />
                    </button>
                  </div>

                </div>
              )}
            </div>
          </div>
          <div className='flex flex-rows'>
            <div className='mr-4'><p className="text-blue-600/75 text-base mb-4">Promotion:</p></div>
            <div><p className="text-blue-600/75 text-base mb-4">{studentData.promotion}</p></div>
          </div>
          <div className='flex flex-rows'>

            <div className='mr-6'><p className="text-blue-600/75 text-base mb-4">Status:</p></div>
            <div><p className={` text-base ${studentData.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
              {studentData.status}
            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
