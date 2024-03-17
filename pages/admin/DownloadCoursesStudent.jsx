import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FaCloudDownloadAlt } from "react-icons/fa";
import axios from 'axios';
import Select from 'react-select';

export default function DownloadCourseStudent() {
  const { data: session } = useSession();
  const [Data, setData] = useState([]);
  const [majors, setMajors] = useState([]);
  const [isSelected, setSelected] = useState(false);
  const router = useRouter();

  const headerStudent = [
    [
      'StudentFirstName(required)', 'StudentLastName(required)', 'Gender(required)', 'DateOfBirth(required,e.g:(mm/dd/yyyy))',
      'AcademicYear(required)', 'Promotion(required,e.g:promo(promoNumber))', 'MajorName', 'Email(required)','MobileNumber(required)', 'PimsId', 'Title','SecondEmail', 'LandLineNumber',
      'FatherName', 'MotherName', 'maidename', 'CountryOfBirth', 'PlaceOfBirth', 'RegisterNumber', 'MartialStatus',
      'FirstNationality', 'SecondNationality', 'Country', 'Region', 'City', 'Street', 'Building', 'Floor', 'Postal',
      'Degree', 'Series', 'DateObtain', 'EducationCountry', 'Establishment', 'otherEstablishment',
      'EmergencePrefix', 'EmergenceFirstName', 'EmergenceMiddleName', 'EmergenceLastName', 'EmergencePhoneNumber',
      'EmergenceRelationShip', 'EmergenceMedicalHealth', 'EmergenceDisease'
    ],
  ];

  const redirect = () => {
    router.push("/AccessDenied");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const table = 'major';
        const data = await axios.post('/api/pmApi/getAll', { table });
        setData(data.data.rows);
      } catch (error) {
        return error;
      }
    };
    fetchData();
  }, []);

  const handleMajor = (selectedOption) => {
    const selectedName = selectedOption.label;
    setMajors([selectedName]);
    setSelected(true);
  };

  const createCSVTemplateStudent = () => {
    const data2 = headerStudent.concat([
      ['', '', '', '', '', '', majors, '', '','', '', '', '', '', '', '', '', '', '', '', '',
  
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
  
        '', '', ''], // MajorName data
    ]);
  
    const worksheet = XLSX.utils.aoa_to_sheet(data2);
    const columnWidths = calculateColumnWidths(worksheet);
  
    // Apply column widths to the worksheet
    worksheet['!cols'] = columnWidths;
  
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const csvBlob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(csvBlob, 'student.csv');
  };
  
  const calculateColumnWidths = (worksheet) => {
    const columnWidths = worksheet['!cols'] || [];
    const headerRow = worksheet[XLSX.utils.encode_cell({ r: 0, c: 0 })];
    if (!Array.isArray(headerRow)) {
      return columnWidths;
    }
  
    headerRow.forEach((cell, colIndex) => {
      const content = cell?.w || '';
      const contentWidth = content.length * 7; // Adjust the multiplier as needed
      const defaultWidth = 10; // Set a default width if content width is smaller
      columnWidths[colIndex] = { wch: Math.max(defaultWidth, contentWidth) };
    });
  
    return columnWidths;
  };
  
  

  return (
    <>
      <Head>
        <title>SIS Admin - Download</title>
      </Head>
      {session?.user.role === "0" ? (
        <>
          <div className="grid grid-cols-1 gap-4 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">
            {isSelected ?
              <>
                <div className="my-4 text-slate-500 text-lg leading-relaxed">
                  <FaCloudDownloadAlt className=" hover:text-blue-600 hover:font-bold" style={{ width: '7rem', height: '7rem', cursor: 'pointer' }} onClick={createCSVTemplateStudent} />
                  <p className="pt-5 mb-10 font-bold">Download Student Template</p>
                </div>
              </> :
              <>
                <div className="my-4 text-slate-500 text-lg leading-relaxed">
                  <FaCloudDownloadAlt className=" hover:text-blue-600 hover:font-bold hover:<small>please select major first</small>" style={{ width: '7rem', height: '7rem', cursor: 'not-allowed' }} />
                  <p className="pt-5 mb-10 font-bold">Download Student Template</p>
                </div>
              </>
            }
            <div className="my-4 text-slate-500 text-lg leading-relaxed">
              <p className="pt-5 mb-10 font-bold">Select Major Name</p>
              <Select
                isMulti={false}
                options={Data.map((major) => ({ value: major.major_id, label: major.major_name })).sort((a, b) => a.label.localeCompare(b.label))}
                placeholder="Select a Major"
                onChange={handleMajor}
                className='place-items-center'
              />
            </div>
          </div>
        </>
      ) : (
        redirect()
      )}
    </>
  )
}

DownloadCourseStudent.auth = true;
DownloadCourseStudent.adminOnly = true;
