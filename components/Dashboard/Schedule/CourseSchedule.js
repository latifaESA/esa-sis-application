import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import dayListViewPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { useSession } from 'next-auth/react';
import axios from 'axios';
// import styles from './CourseSchedule.module.css';

import {
  GoogleLogin,
  GoogleOAuthProvider,
  useGoogleLogin,
} from '@react-oauth/google';

const CourseSchedule = () => {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  // const [event, setEvent] = useState([]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  const headerToolbar = isMobile
    ? {
      start: 'today',
      end: 'prev,next',
    }
    : {
      start: 'today prev,next',
      center: 'title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    };

  const initialView = isMobile ? 'listWeek' : 'dayGridMonth';

  const plugins = isMobile
    ? [listPlugin]
    : [
      dayGridPlugin,
      timeGridPlugin,
      interactionPlugin,
      dayListViewPlugin,
      listPlugin,
    ];

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
          const startDateTime = new Date(
            `${event.day.split('T')[0]} ${event.from_time}`
          );
          startDateTime.setDate(startDateTime.getDate());
          const endDateTime = new Date(
            `${event.day.split('T')[0]} ${event.to_time}`
          );
          endDateTime.setDate(endDateTime.getDate());
          let title = [];
          let url = '';

          if (event.is_online === true) {
            title = [`C-${event.course_name}`, `T-${event.teacher_fullname}`, `join to meeting`];
            url = event.zoom_url;
          } else {
            title = [
              `C-${event.course_name}`,
              `T-${event.teacher_fullname}`,
              `B-${event.room_building}`,
              `R-${event.room_name}`,
            ];
          }

          return {
            title: title.join(','),
            start: startDateTime,
            end: endDateTime,
            // Add the Zoom link to the event
            url: url,
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
        // setEvent(formattedEventsGoogle);

        setEvents(formattedEvents);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSchedule();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SaveRefreshToken = async (credentials) => {
    try {
      // Ensure you have the required access token from the OAuth flow.
      const access_Token = credentials;
      await axios.post('/api/user/setAccessTokenGoogle', {
        accessToken: access_Token,
        user_id: session.user?.userid,
      });

      // // Create an array to store the promises of adding events
      // const addEventPromises = event.map(async (evt) => {
      //   // Make a request to add the event to Google Calendar using the access token
      //   const response = await axios.post('/api/user/google-event', {
      //     accessToken: access_Token,
      //     event: evt,
      //   });

      //   console.log('Event added to Google Calendar:', response.data);

      //   return response.data.redirectUrl;
      // });

      // // Wait for all promises to resolve using Promise.all
      // const redirectUrls = await Promise.all(addEventPromises);

      // // Create a Google Calendar URL that includes all the events
      // let googleCalendarUrl = 'https://calendar.google.com/calendar/r/month?';

      // for (const redirectUrl of redirectUrls) {
      //   googleCalendarUrl += `src=${encodeURIComponent(redirectUrl)}&`;
      // }

      // // Open the Google Calendar URL in a single tab
      // window.open(googleCalendarUrl, '_blank');
    } catch (error) {
      console.error('Error adding events to Google Calendar:', error);
    }
  };
  const exchangeCodeForTokens = async (authorizationCode) => {
    try {
      const response = await fetch('/api/google-api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: authorizationCode.code }),
      });

      const { data } = await response.json();
      await SaveRefreshToken(data.refresh_token)
      console.log('access_token' , data.access_token)
      console.log('refresh token' , data.refresh_token)
      // Handle the tokens
  
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw error;
    }
  };

  const login = useGoogleLogin({
    onSuccess: codeResponse => exchangeCodeForTokens(codeResponse),
    flow: 'auth-code',


  });


  return (
    // <div className='container bg-white p-3 p-md-5 rounded-lg'>
    <div className="flex flex-col items-center justify-center overflow-auto">
      <div className="flex mb-3">
        <GoogleLogin
          onSuccess={() => {
            try {
              login();
            } catch (error) {
              console.error('Error obtaining the access token:', error);
            }
          }}
          onError={() => {
            console.log('Login Failed');
          }}
          accessType="offline"
          prompt='consent'
          useOneTap
          auto_select
        />
      </div>

      {/* FullCalendar section */}
      {/* <div className="row"> */}
      <div className="embed-responsive embed-responsive-16by9 w-full">
        <FullCalendar
          plugins={plugins}
          initialView={initialView}
          headerToolbar={headerToolbar}
          contentHeight={'40rem'}
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
      {/* </div> */}
    </div>
  );
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId="670796006199-lddpd6dcka3bh1u5126ibgja7uft5dn9.apps.googleusercontent.com">
      <CourseSchedule />
    </GoogleOAuthProvider>
  );
};

export default App;
