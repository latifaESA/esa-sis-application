import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
// import Link from 'next/link';
import axios from 'axios';
import * as XLSX from "xlsx";
// import Reports from './Reports';

export default function Statistics() {
  const { data: session } = useSession();
  const router = useRouter()

  const redirect = () => {
    router.push('/AccessDenied')
  }

  const [majors, setMajors] = useState([])
  const [majorValue, setMajorValue] = useState([])
  const [selectMajor, setSelectMajor] = useState(false)
  const handleMajors = async () => {
    try {
      if(session.user?.role === '3'){
        const data = await axios.post('/api/pmApi/getMajorFromAs', {
          pm_ass_id: session.user?.userid
        })
  
        setMajors(data.data.data)
      }else if(session.user?.role === '2'){
        const data = await axios.post('/api/pmApi/getMajorFromMajor', {
          pm_id: session.user?.userid
        })
  
        setMajors(data.data.data)
      }

    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    handleMajors()
  }, [])

  const exportData = async() => {
    try {

    function calculateAge(dateOfBirth) {
        const dob = new Date(dateOfBirth);
        const today = new Date();
        const ageInMilliseconds = today - dob;
        const ageInYears = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));
        return ageInYears;
    }
    
    const {data} = await axios.post('/api/pmApi/statistics',{
        major_id: majorValue 
    })
    console.log('the stat info : ', data)
    let femalecount = 0
    let malecount = 0
    let age = 0
    let avg=0
    let sum= data.data.length
    data?.data.map(ind => {
        ind.gender === 'Female' ? femalecount++ : malecount++;
        age+=calculateAge(ind.dateofbirth)
        console.log(calculateAge(ind.dateofbirth))
})
console.log('sum : ', sum)
   avg = sum !== 0 ? age/sum : 0;
   let femalepercent = sum !== 0 ? (femalecount/sum*100).toFixed(2) : 0;
   let malepercent = sum !== 0 ? (malecount/sum*100).toFixed(2) : 0;
   console.log('avg : ', avg)
   console.log('female count : ', femalecount)
   console.log('female count percentage: ', femalepercent)
   console.log('male count : ', malecount)
   console.log('male count percentage: ', malepercent)

    const stats = [{
       'MajorName': majorValue,
       'Male Ratio': `${malepercent} %`,
       'Female Ratio': `${femalepercent} %`,
       'Average Age': avg
    }]


      // Convert modified data to XLSX format
      const ws = XLSX.utils.json_to_sheet(stats);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");

      // Save the file
      const fileName = `Major-.xlsx`;
      XLSX.writeFile(wb, fileName);

      // Alternatively, use file-saver to save the file
      // saveAs(new Blob([s2ab(XLSX.write(wb, { bookType: 'xlsx', type: 'blob' }))], { type: 'application/octet-stream' }), fileName);
    } catch (error) {
      console.error("Error exporting data: ", error);
    }
  };
 

  return (
    <>
      <Head>
        <title>SIS Program Manager - Statistics</title>
      </Head>

      {session?.user.role === '2' || session?.user.role === "3" ? (<>
        <div className='grid lg:grid-cols-1 gap-5 mb-5'>
        <p className='text-gray-700 text-3xl pt-5 mb-10 font-bold'>Statistics</p>
        <div className='flex justify-around flex-col h-40 sm:flex-row sm:h-auto'>
          {session.user?.hasMultiMajor === "true" ? <>
          <>
          <label className='flex'>
              Major:
              <select
                onChange={(e) => {setMajorValue(e.target.value) ; setSelectMajor(true)}}
                value={majorValue}
                className="ml-12 w-60"

              >
                <option key={"uu2isdvf"} value="">
                  Choose a Major
                </option>
                {majors &&
                  majors.map((major) => (
                    <>
                      <option key={major.major_id} value={major.major_id}>
                        {major.major_name}
                      </option>
                    </>
                  ))}
              </select>
            </label>
          </> 
       
            {selectMajor && majorValue != '' ? <button
              className="primary-button btnCol text-white  w-60 hover:text-white hover:font-bold self-center"
              type="button"
              onClick={exportData}
            >
              Export
            </button>
            :<>
          
            </> }

          </> : <></>}
          </div>
        </div>
      </>) : redirect()}
    </>
  );
}
Statistics.auth = true;
Statistics.adminOnly = true;
