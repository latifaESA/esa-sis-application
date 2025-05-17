// import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from 'axios';

export default function GradeView() {
  const { data: session } = useSession();
  const router = useRouter();

  const redirect = () => {
    router.push("/AccessDenied");
  };
  const [isMultiMajor, setIsMultiMajor] = useState([]);

  useEffect(() => {
    const handleMajor = async () => {
      try {
        let payload;
  
          payload = {
            val: session.user?.email,
            table: 'extra_user',
            colName: 'email'
          }

        const response = await axios.post('/api/pmApi/getAllCondition', payload);
        console.log('response' , response)

        setIsMultiMajor(response.data.rows);

      } catch (error) {
        console.error(error);
      }
    };

    if (session?.user?.role === "1") {
      handleMajor();
    }
  }, [session.user?.userid]);

  const handleButtonClick = (majorId , majorName , userId) => {
    router.push(`/student/grades?majorId=${majorId}&majorName=EXED-${majorName}&userid=${userId}`);
  };
console.log('get major' , isMultiMajor)
  return (
    <>
      <Head>
        <title>SIS PM - view</title>
      </Head>

      {session?.user.role === "1" ? (
        <>
          <div className="flex justify-center p-40 gap-6 mt-10">
            {isMultiMajor.length > 0 && (
              <>
                {isMultiMajor.map((item, index) => (
                  <div className="flex font-bold text-xl" key={index}>
                    <button
                      className="primary-button hover:text-white hover:font-bold justify-center text-white font-bold py-2 px-4 border-b-4 border-red-700 rounded uppercase w-40"
                      type="button"
                      onClick={() => handleButtonClick(item.majorid, item.major_name , item.userid)}
                    >
                      {item.major_name.replace("EXED-", "")}
                    </button>
                  </div>
                ))}

                <div className="flex font-bold text-xl">
                  <button
                    className="primary-button hover:text-white hover:font-bold justify-center text-white font-bold py-2 px-4 border-b-4 border-red-700 rounded uppercase"
                    type="button"
                    onClick={() => handleButtonClick(session.user?.majorid , session.user?.majorName.replace("EXED-", "") ,session.user?.userid)}
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
    </>);
}

GradeView.auth = true;
GradeView.adminOnly = true;
