import React, { useEffect, useState } from 'react';
import NotificationCards from './notificationCards';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { appNotification } from '../redux/slices/appSlice';
import { useDispatch } from 'react-redux';

const NotifPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    const getNot = async () => {
      try {
        let userID = session.user.userid;
        const changeView = async () => {
          try {
            const result = await axios.post(`/api/user/changeView/${userID}`);
            console.log('the result of veeeee is : ', result.data.rowCount);
            if (result.data.rowCount > 0) {
              dispatch(appNotification(null));
              return;
            }
          } catch (error) {
            console.log(error);
          }
        };
        const result = await axios.post(
          `/api/user/getEmailsSenderInfo/${userID}`
        );
        console.log('the notifications are : ', result.data);
        setNotifications(result.data);
        changeView();
      } catch (error) {
        console.log(error);
      }
    };
    getNot();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {notifications?.map((note) => (
        // eslint-disable-next-line react/jsx-key
        <NotificationCards note={note} />
      ))}
    </div>
  );
};

export default NotifPage;
