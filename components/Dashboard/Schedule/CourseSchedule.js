import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import dayListViewPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { useSession } from 'next-auth/react';
import axios from 'axios';




const CourseSchedule = () => {
  const { data: session } = useSession();
  const [events , setEvents] = useState([])
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const major_id = session.user.majorid;
        const promotion = session.user.promotion;
        const data = await axios.post('/api/user/getAllStudentSchedule', {
          major_id,
          promotion,
        });
        const formattedEvents = data.data.data.map((event) => {
          const startDateTime = new Date(`${event.day.split('T')[0]} ${event.from_time}`);
          startDateTime.setDate(startDateTime.getDate() ); 
          const endDateTime = new Date(`${event.day.split('T')[0]} ${event.to_time}`);
          endDateTime.setDate(endDateTime.getDate() ); 
        
          const title = [
            `C-${event.course_name}`,
            `T-${event.teacher_fullname}`,
            `B-${event.room_building}`,
            `R-${event.room_name}`,
          ].map((line) => line + '\n');
        
          return {
            title: title.join(','),
            start: startDateTime,
            end: endDateTime,
            background: 'blue',
          };
        });
        
       
  
        setEvents(formattedEvents);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchSchedule();
  }, []);
  
  return (
    <div className='container bg-white p-10 rounded-lg'>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, dayListViewPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: 'today prev,next',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        }}
        contentHeight = {'23rem'}
        handleWindowResize={true}
        weekends={true}
        events={events}
        views={{
          multiMonthFourMonth: {
            type: 'multiMonth',
            duration: { months: 4 }
          }
        }}
      />
    </div>
  );
};

export default CourseSchedule;
