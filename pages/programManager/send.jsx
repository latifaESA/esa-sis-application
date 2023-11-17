import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../../components/Loader/Loader';
import CustomSelectBox from './customSelectBox';

export default function send() {
  const { data: session } = useSession();
  const router = useRouter();
  const [majors, setMajors] = useState([]);
  const [allmajors, setAllMajors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promotion, setPromotion] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [selectedMajorID, setSelectedMajorID] = useState(null);
  const [afterSub, setAfterSub] = useState(false)
  const redirect = () => {
    router.push('/AccessDenied');
  };

  useEffect(() => {
    const handleSelect = async () => {
      try {
        let major_id = session.user.majorid;
        const { data } = await axios.post('/api/admin/adminApi/getTheMajors', {
          major_id,
        });

        setAllMajors(data);

        // setMessage(data.data.message)
        let datesArray = [];

        data.forEach(
          (major) =>
            major.major_name.startsWith('EXED') &&
            major.status === 'active' &&
            datesArray.push(major.major_name)
        );
        setMajors(datesArray);
      } catch (error) {
        return error;
      }
    };
    handleSelect();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const handleSelect = (selectedValue) => {
    if (selectedValue.trim() !== '') {
      let selectedMajor = allmajors.filter(
        (major) => major.major_name === selectedValue
      );
      setSelectedMajorID(selectedMajor[0].major_id);
    } else {
      setSelectedMajorID(null);
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (selectedMajorID === null || selectedMajorID === '' || emailContent.trim() === '') {
      setMessage("All Fields Must be Filled !");
      setMessageClass("text-red-500");
      setIsLoading(false);
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } else {
      try {
        let user_id = session.user.userid;
        let sendData = {
          user_id,
          selectedMajorID,
          emailContent
        };
        let res = await axios.post("/api/pmApi/getEmailsOnMajorID", sendData);
        setMessage("Request Sent !");
        setMessageClass("text-green-500");
        setEmailContent(""), 
        setSelectedMajorID(null), 
        setAfterSub(true),
        setTimeout(() => {
          setMessage("");
          setAfterSub(false);
        }, 5000);
        if (res) {
          setIsLoading(false);
        }
      } catch (error) {
        console.log('the res is : ', error.response)
        if(error.response.data === 'No Student found'){
          setMessage(error.response.data);
          setMessageClass("text-red-500");
        }else{
          setMessage("Error while sending the email");
          setMessageClass("text-red-500");
        }

        setIsLoading(false);
        setTimeout(() => {
          setMessage("");
        }, 5000);
        console.log(error);
      }
    }
  };
  return (
    <>
      <Head>
        <title>SIS Admin - Send</title>
      </Head>

      {session?.user.role === '2' || session?.user.role === '3' ? (
        <>
          <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">Send</p>

          <div>
            <div className="flex flex-col items-start justify-center">
            <div className="text-center">
              <p className={` ${messageClass}`}>{message}</p>
            </div>
              <form onSubmit={submitHandler}>
                <div>
                  <div className="flex m-10 flex-col md:flex-row">
                    <label className="w-[350px] mb-2">Select Major:</label>
                    <CustomSelectBox
                      options={majors}
                      placeholder="Select Major Name"
                      onSelect={handleSelect}
                      styled={
                        'font-medium h-auto items-start border-[1px] border-zinc-300 self-start w-60 inline-block'
                      }
                      refresh = {afterSub}
                    />
                  </div>
                  <div className="m-4">
                    <textarea
                      className="w-full p-2 border rounded"
                      rows="6"
                      name="emailContent"
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                      placeholder="Message"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-4 justify-end">
                    <button
                      className="w-full sm:w-1/2 p-2 rounded primary-button"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Send'}
                    </button>
                    {isLoading && <Loader />}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        redirect()
      )}
    </>
  );
}
send.auth = true;
send.adminOnly = true;
