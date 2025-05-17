import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/router';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
    GoogleLogin,
    GoogleOAuthProvider,
    useGoogleLogin,
} from '@react-oauth/google';
import { useSession } from 'next-auth/react';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const formatTime = (timeWithTimeZone) => {
    const [time] = timeWithTimeZone.split('+');
    const [hours, minutes] = time.split(':');
    const formattedHours = parseInt(hours) % 12 === 0 ? 12 : parseInt(hours) % 12;
    const period = parseInt(hours) < 12 ? 'AM' : 'PM';
    return `${formattedHours}:${minutes} ${period}`;
};

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
    const today = dayjs();
    const [currentDate, setCurrentDate] = useState(today);
    const { data: session } = useSession();
    const [googleData, setGoogleData] = useState([]);
    const [eventPayloads, setEventPayloads] = useState({});
    const startOfMonth = currentDate.startOf("month");
    const startDay = startOfMonth.day();
    
    const daysInMonth = currentDate.daysInMonth();
      const router = useRouter();
    const {majorId , userid , promotion} = router.query
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                let payload;
                if(session.user?.hasMultiMajor == 'true'){
                    payload = {
                        major_id:majorId,
                        promotion:promotion
                    }
                    const res = await axios.post('/api/user/getAllStudentSchedule', payload);

                    const payloads = res.data.data;
                    const groupedEvents = payloads.reduce((acc, event) => {
                        const dateKey = dayjs(event.day).format("YYYY-MM-DD");
                        if (!acc[dateKey]) acc[dateKey] = [];
                        acc[dateKey].push(event);
                        return acc;
                    }, {});
    
                    setEventPayloads(groupedEvents);
    
                    const formattedEventsGoogle = payloads.map((event) => {
                        const startDateTime = new Date(event.day);
                        const endDateTime = new Date(event.day);
    
                        const fromTimeParts = event.from_time.split(':');
                        const toTimeParts = event.to_time.split(':');
    
                        startDateTime.setHours(Number(fromTimeParts[0]));
                        startDateTime.setMinutes(Number(fromTimeParts[1]));
                        startDateTime.setSeconds(Number(fromTimeParts[2].split('+')[0]));
    
                        endDateTime.setHours(Number(toTimeParts[0]));
                        endDateTime.setMinutes(Number(toTimeParts[1]));
                        endDateTime.setSeconds(Number(toTimeParts[2].split('+')[0]));
    
                        if (endDateTime <= startDateTime) {
                            endDateTime.setDate(endDateTime.getDate() + 1);
                        }
    
                        return {
                            summary: `${event.course_name}`,
                            start: {
                                dateTime: startDateTime.toISOString(),
                            },
                            end: {
                                dateTime: endDateTime.toISOString(),
                            },
                            location: `${event.room_building} - ${event.room_name}`,
                            attendance_id: event.attendance_id
                        };
                    });
                    console.log('google')
    
                    setGoogleData(formattedEventsGoogle);
                    console.log('google in if',googleData)
                }else{
                    payload = {
                        major_id:session.user.majorid,
                        promotion:session.user.promotion
                    }
                    const res = await axios.post('/api/user/getAllStudentSchedule', payload);

                    const payloads = res.data.data;
                    const groupedEvents = payloads.reduce((acc, event) => {
                        const dateKey = dayjs(event.day).format("YYYY-MM-DD");
                        if (!acc[dateKey]) acc[dateKey] = [];
                        acc[dateKey].push(event);
                        return acc;
                    }, {});
    
                    setEventPayloads(groupedEvents);
    
                    const formattedEventsGoogle = payloads.map((event) => {
                        const startDateTime = new Date(event.day);
                        const endDateTime = new Date(event.day);
    
                        const fromTimeParts = event.from_time.split(':');
                        const toTimeParts = event.to_time.split(':');
    
                        startDateTime.setHours(Number(fromTimeParts[0]));
                        startDateTime.setMinutes(Number(fromTimeParts[1]));
                        startDateTime.setSeconds(Number(fromTimeParts[2].split('+')[0]));
    
                        endDateTime.setHours(Number(toTimeParts[0]));
                        endDateTime.setMinutes(Number(toTimeParts[1]));
                        endDateTime.setSeconds(Number(toTimeParts[2].split('+')[0]));
    
                        if (endDateTime <= startDateTime) {
                            endDateTime.setDate(endDateTime.getDate() + 1);
                        }
    
                        return {
                            summary: `${event.course_name}`,
                            start: {
                                dateTime: startDateTime.toISOString(),
                            },
                            end: {
                                dateTime: endDateTime.toISOString(),
                            },
                            location: `${event.room_building} - ${event.room_name}`,
                            attendance_id: event.attendance_id
                        };
                    });
                    console.log('google')
    
                    setGoogleData(formattedEventsGoogle);
                    console.log('google',googleData)
                }
               

            } catch (error) {
                console.error('Error fetching schedule:', error);
            }
        };

        if (session) {
            fetchSchedule();
        }
    }, [session]);

    const SaveRefreshToken = async (refreshToken, authorizationCode) => {
        try {
            
            for (const evt of googleData) {
                
                const response = await axios.post('/api/user/addEvent', {
                    refreshToken,
                    event: evt,
                    attendance_id: evt.attendance_id,
                    code: authorizationCode.code,
                    user_id:session.user?.hasMultiMajor ==='true' ?  userid :session.user?.userid ,
                });

                if (!response.data.success) {
                    console.warn('⚠️ Failed to create event:', response.data.message);
                } else {
                    console.log('✅ Event created:', response.data.data?.summary || 'Unnamed');
                }
            }

            window.open('https://calendar.google.com/calendar/', '_blank');
        } catch (error) {
            console.error('❌ Error adding events to Google Calendar:', error);
        }
    };

    const exchangeCodeForTokens = async (authorizationCode) => {
        try {
            const response = await fetch('/api/google-api/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: authorizationCode.code }),
            });

            const { data } = await response.json();
            console.log('data' , data?.refresh_token)
            if (data?.refresh_token) {
                await SaveRefreshToken(data.refresh_token, authorizationCode);
            } else {
                console.error('Missing refresh token from server response:', data);
            }
        } catch (error) {
            console.error('Error exchanging code for tokens:', error);
        }
    };

    const login = useGoogleLogin({
        onSuccess: exchangeCodeForTokens,
        flow: 'auth-code',
        scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar',
        access_type: 'offline',
        prompt: 'consent',
    });

    const generateCalendar = () => {
        const days = [];

        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-1 min-h-[100px] md:min-h-[120px]" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const fullDate = currentDate.date(day).format("YYYY-MM-DD");
            const isToday = today.date() === day && currentDate.isSame(today, "month");
            const dayEvents = eventPayloads[fullDate] || [];

            days.push(
                <div
                    key={day}
                    className={`p-1 text-left rounded-lg border min-h-[100px] md:min-h-[120px] overflow-hidden hover:bg-blue-50 transition-all ${isToday ? "bg-green-500 text-white font-bold" : "bg-white"
                        }`}
                >
                    <div className="text-xs md:text-sm font-semibold mb-1">{day}</div>
                    <div className="flex flex-col gap-1.5">
                        {dayEvents.map((event, index) => (
                            <div
                                key={index}
                                className="bg-blue-50 p-1.5 rounded text-gray-800 text-xs leading-tight border border-blue-100"
                            >
                                <div className="font-semibold text-[13px] truncate">
                                    {event.course_name}
                                </div>
                                <div className="flex items-center gap-1 text-[11px] mt-1">
                                    <span>🕒</span>
                                    <span>
                                        {formatTime(event.from_time)} - {formatTime(event.to_time)}
                                    </span>
                                </div>
                                <div className="flex items-start gap-1 text-[11px] mt-1">
                                    <span>🏫</span>
                                    <span className="flex-1">
                                        <div className="font-medium">{event.room_building}</div>
                                        <div className="text-gray-600">Room: {event.room_name}</div>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    const handlePrevMonth = () => {
        setCurrentDate(currentDate.subtract(1, "month"));
    };

    const handleNextMonth = () => {
        setCurrentDate(currentDate.add(1, "month"));
    };

    return (
        <div className="max-w-7xl mx-auto p-2 sm:p-4 w-full">
            <div className="flex mb-3 items-center justify-center">
                <GoogleLogin
                    onSuccess={() => login()}
                    onError={() => console.log('Login Failed')}
                    prompt="consent"
                    useOneTap
                    auto_select
                />
            </div>

            <div className="flex flex-row justify-between items-center mb-4 gap-2 w-full">
                <button
                    onClick={handlePrevMonth}
                    className="bg-gray-200 px-3 py-1 text-sm rounded hover:bg-gray-300"
                >
                    Prev
                </button>

                <h2 className="text-base sm:text-xl font-bold text-center">
                    {currentDate.format("MMMM YYYY")}
                </h2>

                <button
                    onClick={handleNextMonth}
                    className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                >
                    Next
                </button>
            </div>

            <div className="grid grid-cols-7 border border-blue-200 rounded-lg bg-white shadow-sm gap-px text-center font-semibold text-xs sm:text-sm">
                {weekdays.map((day) => (
                    <div key={day} className="text-gray-600 py-2">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-px mt-px rounded-b-lg overflow-hidden">
                {generateCalendar()}
            </div>
        </div>
    );
};

const App = () => {
    return (
        <GoogleOAuthProvider clientId="488510538109-36i4ol70jivfrtcu31upbmld812klgr7.apps.googleusercontent.com">
            <Calendar />
        </GoogleOAuthProvider>
    );
};

export default App;