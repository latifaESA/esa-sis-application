import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const CourseSchedule = () => {
  // function createData(Time, Monday, Tuesday, Wednesday, Thursday, Friday) {
  //   return { Time, Monday, Tuesday, Wednesday, Thursday, Friday };
  // }

  const rows = [
    {
      id: 1,
      time: '8:00 - 9:30',
      mon: 'Management',
      tue: '',
      wed: 'Accounting',
      thu: '',
      fri: 'History',
    },
    {
      id: 2,
      time: '10:00 - 11:30',
      mon: '',
      tue: 'Accounting',
      wed: '',
      thu: 'Marketing',
      fri: '',
    },
    {
      id: 3,
      time: '12:00 - 1:30',
      mon: 'Management',
      tue: '',
      wed: 'Introduction to Computer',
      thu: '',
      fri: 'Law',
    },
    {
      id: 4,
      time: '14:00 - 16:30',
      mon: 'Math',
      tue: '',
      wed: 'English (101)',
      thu: '',
      fri: 'Arabic',
    },
    {
      id: 5,
      time: '16:45 - 17:30',
      mon: 'English',
      tue: '',
      wed: 'Statistics',
      thu: '',
      fri: 'Log',
    },
    {
      id: 6,
      time: '17:45 - 18:30',
      mon: 'Accounting II',
      tue: 'Finance',
      wed: 'Introduction to Marketing',
      thu: 'Statistics',
      fri: '',
    },
  ];
  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 250, maxWidth: 1200, 'td, th': { border: 1 } }}
        aria-label='simple table'
      >
        <TableHead style={{ backgroundColor: 'lightBlue' }}>
          <TableRow>
            <TableCell
              style={{ fontSize: '18px', fontWeight: 'bold' }}
              align='center'
            >
              Time
            </TableCell>
            <TableCell
              style={{ fontSize: '18px', fontWeight: 'bold' }}
              align='center'
            >
              Monday
            </TableCell>
            <TableCell
              style={{ fontSize: '18px', fontWeight: 'bold' }}
              align='center'
            >
              Tuesday
            </TableCell>
            <TableCell
              style={{ fontSize: '18px', fontWeight: 'bold' }}
              align='center'
            >
              Wednesday
            </TableCell>
            <TableCell
              style={{ fontSize: '18px', fontWeight: 'bold' }}
              align='center'
            >
              Thursday
            </TableCell>
            <TableCell
              style={{ fontSize: '18px', fontWeight: 'bold' }}
              align='center'
            >
              Friday
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell style={{ wordWrap: 'break-word' }} align='center'>
                {row.time}
              </TableCell>
              <TableCell align='center'>{row.mon}</TableCell>
              <TableCell align='center'>{row.tue}</TableCell>
              <TableCell align='center'>{row.wed}</TableCell>
              <TableCell align='center'>{row.thu}</TableCell>
              <TableCell align='center'>{row.fri}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CourseSchedule;
