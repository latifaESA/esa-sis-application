import axios from "axios";
import dateFormatter from "../dateFormatter";
import timeFormatter from "../timeFormatter";
const sendMailClass = async () => {
  const res = await axios.post(
    "http://localhost:3001/api/admin/adminApi/schedulemail"
  );
  console.log(res);
};

export default sendMailClass;
