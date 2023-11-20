import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../../components/Loader/Loader';

export default function send() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: session } = useSession();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [message, setMessage] = useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [messageClass, setMessageClass] = useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [subjectContent, setSubjectContent] = useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [emailContent, setEmailContent] = useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedMajorID, setSelectedMajorID] = useState(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [loadingMajor, setLoadingMajor] = useState(true);
  const redirect = () => {
    router.push('/AccessDenied');
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const handleMajorPM = async () => {
      try {
        let major_id = session.user.majorid;
        const { data } = await axios.post('/api/pmApi/getMajorPM', {
          majorID: major_id,
        });
        setSelectedMajorID(data[0].major_id)
        setLoadingMajor(false)
        console.log(selectedMajorID)
        return;

      } catch (error) {
        return error;
      }
    };
    handleMajorPM();
  }, [session,selectedMajorID]); // Empty dependency array means this effect runs once when the component mounts

  // const handleSelect = (selectedValue) => {
  //   if (selectedValue.trim() !== '') {
  //     let selectedMajor = allmajors.filter(
  //       (major) => major.major_name === selectedValue
  //     );
  //     setSelectedMajorID(selectedMajor[0].major_id);
  //   } else {
  //     setSelectedMajorID(null);
  //   }
  // };
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (
      selectedMajorID === null ||
      selectedMajorID === '' ||
      subjectContent.trim() === '' ||
      emailContent.trim() === ''
    ) {
      setMessage('All Fields Must be Filled !');
      setMessageClass('text-red-500');
      setIsLoading(false);
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } else {
      try {
        let user_id = session.user.userid;
        let sendData = {
          user_id,
          selectedMajorID,
          subjectContent,
          emailContent,
        };
        let res = await axios.post('/api/pmApi/getEmailsOnMajorID', sendData);
        setMessage('Request Sent !');
        setMessageClass('text-green-500');
        setSubjectContent(''),
          setEmailContent(''),
          setTimeout(() => {
            setMessage('');
          }, 5000);
        if (res) {
          setIsLoading(false);
        }
        return;
      } catch (error) {
        if (error.response.data === 'No Student found') {
          setMessage(error.response.data);
          setMessageClass('text-red-500');
        } else {
          setMessage('Error while sending the email');
          setMessageClass('text-red-500');
        }

        setIsLoading(false);
        setTimeout(() => {
          setMessage('');
        }, 5000);
        return;
      }
    }
  };
  return (
    <>
      <Head>
        <title>SIS Admin - Send</title>
      </Head>


      {loadingMajor ?
      <div>
        Loading ...
      </div>
      :
      (session?.user.role === '2' || session?.user.role === '3') &&  selectedMajorID !== null ? (
        <>
          <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">Send</p>

          <div>
            <div className="flex flex-col items-start justify-center w-2/4">
              <div className="text-center">
                <p className={` ${messageClass}`}>{message}</p>
              </div>
              <form onSubmit={submitHandler} className='w-full'>
                <div>
                {/*
                  <div className="flex m-10 flex-col md:flex-row">
                    <label className="w-[350px] mb-2">Select Major:</label>
                    <CustomSelectBox
                      options={majors}
                      placeholder="Select Major Name"
                      onSelect={handleSelect}
                      styled={
                        'font-medium h-auto items-start border-[1px] border-zinc-300 self-start w-60 inline-block'
                      }
                      refresh={afterSub}
                    />
                  </div>
                   */}

                  <div className="m-4">
                    <input
                      type="text"
                      value={subjectContent}
                      onChange={(e) => setSubjectContent(e.target.value)}
                      placeholder="Subject"
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
