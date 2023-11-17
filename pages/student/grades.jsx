import Head from 'next/head';
// import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import StudentGrades from '../../components/Dashboard/StudentGrades';
import axios from 'axios';
import { useEffect, useState } from 'react';


export default function Grades() {


  const { data: session } = useSession();
  const [studentGrades , setStudentGrades]=useState([])
  const router = useRouter()
  const redirect = () => {
    router.push('/AccessDenied')
  }
  useEffect(()=>{
    getGrade()
  },[])
  const getGrade = async()=>{
    try {
      const data = await axios.post('/api/user/StudentGrades', {
        studentId : session.user?.userid
      })
   
      setStudentGrades(data.data.data.rows)
    } catch (error) {
      return error
    }
  }

  return (
    <>
      <Head>
        <title>SIS - Grades</title>
      </Head>
      <>
        {session?.user.role === '1' ? (
          <>
            <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold text-primary'>Grades</p>
            <StudentGrades studentGrades={studentGrades} setStudentGrades={setStudentGrades} />
          </>

        ) : redirect()}
      </>
    </>
  );
}
Grades.auth = true;
Grades.adminOnly = true;
