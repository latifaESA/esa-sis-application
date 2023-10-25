import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import dayListViewPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const CourseSchedule = () => {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  // const [authorizationCode, setAuthorizationCode] = useState(null);
  // const [event, setEvent] = useState([]);
  // const [googleCalendarLink, setGoogleCalendarLink] = useState(null);

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
          startDateTime.setDate(startDateTime.getDate());
          const endDateTime = new Date(`${event.day.split('T')[0]} ${event.to_time}`);
          endDateTime.setDate(endDateTime.getDate());

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
    

        // const formattedEventsGoogle = data.data.data.map((event) => {
        //   const startDateTime = new Date(event.day);
        //   startDateTime.setHours(Number(event.from_time.split(':')[0]));
        //   startDateTime.setMinutes(Number(event.from_time.split(':')[1]));

        //   const endDateTime = new Date(event.day);
        //   endDateTime.setHours(Number(event.to_time.split(':')[0]));
        //   endDateTime.setMinutes(Number(event.to_time.split(':')[1]));

        //   const title = [
        //     `C-${event.course_name}`,
        //     `T-${event.teacher_fullname}`,
        //     `B-${event.room_building}`,
        //     `R-${event.room_name}`,
        //   ].map((line) => line + '\n');

        //   return {
        //     summary: title.join(','),
        //     start: {
        //       dateTime: startDateTime.toISOString(),
        //     },
        //     end: {
        //       dateTime: endDateTime.toISOString(),
        //     },
            
        //   };
        // });
        // setEvent(formattedEventsGoogle)

        setEvents(formattedEvents);

      } catch (error) {
        console.error(error);
      }
    };
    fetchSchedule();
  }, []);


  // // Handle successful Google login
  // const onGoogleLoginSuccess = async (response) => {
  //   try {
      
  //     // Ensure you have the required access token from the OAuth flow.
  //     const accessToken = 'ya29.a0AfB_byDRg3yBQeIuA5ebSngaUvUEvU6wv1TVY8clyOUFHy_18V5C2m3Ml-w-H-jK8Sk7WwNto9fHprRhRK78PyaTspvOne_aUIiBUZt4qfwA9ha-Xv8tdoEOGjbHcNLyuTQ3PEnQcvACblZM28TGqMZhkECDVBMyr7DsigaCgYKAWESARISFQGOcNnCob5rPWd5n_PG30DGNgfwMw0173'; // Replace with your access token

  //     // Create an array to store the promises of adding events
  //     const addEventPromises = event.map(async (evt) => {
  //       const response = await axios.post('/api/user/google-event', {
  //         accessToken: accessToken,
  //         event: evt, // Pass the event data from formattedEvents
  //       });

  //       console.log('Event added to Google Calendar:', response.data);

  //       return response.data.redirectUrl;
  //     });

  //     // Wait for all promises to resolve using Promise.all
  //     const redirectUrls = await Promise.all(addEventPromises);

  //     // Create a Google Calendar URL that includes all the events
  //     let googleCalendarUrl = 'https://calendar.google.com/calendar/r/month?';

  //     for (const redirectUrl of redirectUrls) {
  //       googleCalendarUrl += `src=${encodeURIComponent(redirectUrl)}&`;
  //     }

  //     // Open the Google Calendar URL in a single tab
  //     window.open(googleCalendarUrl, '_blank');
  //   } catch (error) {
  //     console.error('Error adding events to Google Calendar:', error);
  //   }
  // };



  return (
    <div className='container bg-white p-10 rounded-lg'>
       {/* <div>
       <GoogleLogin
        onSuccess={credentialResponse => {
          onGoogleLoginSuccess(credentialResponse);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
        useOneTap
        accessType="offline" // Request offline access

      />
       </div> */}
  

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, dayListViewPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: 'today prev,next',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        }}
        contentHeight={'23rem'}
        handleWindowResize={true}
        weekends={true}
        events={events}
        views={{
          multiMonthFourMonth: {
            type: 'multiMonth',
            duration: { months: 4 },
          },
        }}
      />
    </div>
  );
};

// const App = () => {
//   return (
//     <GoogleOAuthProvider clientId='748431984812-251tnvfcugl1c3uns4h751pr3119oktc.apps.googleusercontent.com'>
//       <CourseSchedule />
//     </GoogleOAuthProvider>
//   );
// };

export default CourseSchedule;
