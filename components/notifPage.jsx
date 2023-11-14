import React, { useEffect, useState } from "react";
import NotificationCards from "./notificationCards";
import axios from "axios";
import { useSession } from "next-auth/react";

const NotifPage = () => {
  const [notifications, setNotifications] = useState([])
  const { data: session } = useSession();

  useEffect(() => {
    const getNot = async() => {
      try {
        let userID = session.user.userid;
        const result = await axios.post(`/api/user/getEmailsSenderInfo/${userID}`)
        setNotifications(result.data)
      } catch (error) {
        console.log(error)
      }

    }
    getNot()
  },[])

  return (
    <div>
      {notifications.map((note) => 
      <NotificationCards note={note}/>
      )}
    </div>
  );
};

export default NotifPage;
