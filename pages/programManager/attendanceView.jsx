// import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from 'axios';

export default function AttendanceView() {
    const { data: session } = useSession();
    const router = useRouter();
  
    const redirect = () => {
      router.push("/AccessDenied");
    };
  
    const [isMultiMajor, setIsMultiMajor] = useState([]);
  
    useEffect(() => {
      const handleMajor = async () => {
        try {
          const response = await axios.post('/api/pmApi/getMajorPMExtra', {
            pm_id: session.user?.userid
          });
  
          setIsMultiMajor(response.data.data);
  
        } catch (error) {
          console.error(error);
        }
      };
  
      if (session?.user?.role === "2" || session?.user?.role === "3") {
        handleMajor();
      }
    }, [session.user?.pm_id]);
  
    const handleButtonClick = (majorId) => {
      router.push(`/programManager/AttendanceById?majorId=${majorId}`);
    };
  
    return (
      <>
        <Head>
          <title>SIS PM - view</title>
        </Head>
  
        {session?.user.role === "2" || session?.user.role === "3" ? (
          <>
            <div className="flex items-center justify-center h-[300px] gap-6">
              {isMultiMajor.length > 0 && (
                <>
                  {isMultiMajor.map((item, index) => (
                    <div className="flex font-bold text-xl" key={index}>
                      <button
                        className="primary-button hover:text-white hover:font-bold justify-center text-white font-bold py-2 px-4 border-b-4 border-red-700 rounded uppercase"
                        type="button"
                        onClick={() => handleButtonClick(item.major_id)}
                      >
                        {item.major_name.replace("EXED-", "")}
                      </button>
                    </div>
                  ))}
                  <div className="flex font-bold text-xl" >
                      <button
                        className="primary-button hover:text-white hover:font-bold justify-center text-white font-bold py-2 px-4 border-b-4 border-red-700 rounded uppercase"
                        type="button"
                        onClick={() => handleButtonClick(session.user?.majorid)}
                      >
                        {session.user?.majorName.replace("EXED-", "")}
                      </button>
                    </div>
                </>
              )}

            </div>
          </>
        ) : (
          redirect()
        )}
      </>
    );
  }
  
AttendanceView.auth = true;
AttendanceView.adminOnly = true;
