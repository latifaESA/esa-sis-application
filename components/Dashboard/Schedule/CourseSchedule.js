import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const events = [
  { title: 'ELECTIVE COURSE 18h', date: '2023-03-18T16:30:00' },
  {
    title: 'SEMINAR 2: S-02(b) PROBLEM SOLVING & DECISION MAKING',
    date: '2023-03-18T11:00:00',
  },
  { title: 'Midterm', start: '2023-03-25', end: '2023-03-30' },
];

const CourseSchedule = () => {
  return (
    <div className='container bg-white p-10 rounded-lg'>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        events={events}
        defaultView='dayGridMonth'
        editable={true}
        selectable={true}
        headerToolbar={{
          start: 'title',
          end: 'today,dayGridMonth,timeGridWeek,timeGridDay prevYear,prev,next,nextYear',
        }}
        buttonText={{
          month: 'Month',
          today: 'Today',
          week: 'Week',
          day: 'Day',
        }}
      />
    </div>
  );
};

export default CourseSchedule;
