import React, { useEffect, useState } from 'react';

import { FiEdit3, FiCheck, FiX } from "react-icons/fi";
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useSession } from "next-auth/react";
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const StudentProfile = () => {
  const { data: session } = useSession();

  const [studentData, setStudentData] = useState({
    student_firstname: '',
    student_lastname: '',
    major_name: '',
    mobile_number: '',
    address_city: '',
    address_street: '',
    address_building: '',
    promotion: '',
    status: '',
  });

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

  const averageGrades = 90;
  let gradeColor = '#2ecc71';
  if (averageGrades < 50) {
    gradeColor = '#e74c3c';
  } else if (averageGrades < 60) {
    gradeColor = '#f1c40f';
  }

  const chartOptions = {
    plotOptions: {
      radialBar: {
        dataLabels: {
          total: {
            show: true,
            label: 'Average Grades',
            formatter: function () {
              return Math.round(averageGrades) + '%';
            },
          },
        },
        startAngle: -90,
        endAngle: 90,
      },
    },
    colors: [gradeColor],
  }

  const updateDetails = async () => {
    try {
      const payload = {
        userid: session.user.userid,
        mobile_number: studentData.mobile_number,
        address: editedAddress,
      };
      const response = await axios.post('/api/user/editProfileStudent', payload);
      console.log(response.data.success);
      if (response.data.success === true) {
        setIsEditingMobileNumber(false);
        setIsEditingAddress(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">{studentData.student_firstname} {studentData.student_lastname}</h2>
        <p className="text-gray-700 text-lg font-bold">{studentData.major_name}</p>
      </div>

      <div className="flex flex-cols mt-12">
        <div className="mr-6">
          <ReactApexChart
            options={chartOptions}
            series={[averageGrades]}
            type="radialBar"
            height={300}
          />
        </div>
        <div className="ml-12">
          <div className='flex flex-rows'>
            <div className='mr-6'>
              <p className="text-blue-600/75 text-base mb-4">
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
                  <div><p className="text-blue-600/75 text-base mb-4">{editedAddress}</p></div>

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
