import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../../components/Loader/Loader';

export default function Send() {
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
  const [selectedSignature, setSelectedSignature] = useState(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks

  const [majors, setMajors] = useState([])
  const [majorValue, setMajorValue] = useState([])
  const [signatureValue, setSignatureValue] = useState(null)
  const redirect = () => {
    router.push('/AccessDenied');
  };

  const handleMajors = async () => {
    try {
      if (session.user?.role === '3') {
        const data = await axios.post('/api/pmApi/getMajorFromAs', {
          pm_ass_id: session.user?.userid
        })

        setMajors(data.data.data)
      } else if (session.user?.role === '2') {
        const data = await axios.post('/api/pmApi/getMajorFromMajor', {
          pm_id: session.user?.userid
        })

        setMajors(data.data.data)
      }

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleMajors()

  }, [])

  const handleMajorPM = async () => {
    try {
      if (session.user?.hasMultiMajor === 'true') {
        let major_id = majorValue;
        const { data } = await axios.post('/api/pmApi/getMajorPM', {
          majorID: major_id,
        });
        setSelectedMajorID(data[0].major_id)

        return;
      } else {
        let major_id = session.user.majorid;
        const { data } = await axios.post('/api/pmApi/getMajorPM', {
          majorID: major_id,
        });
        setSelectedMajorID(data[0].major_id)

        return;
      }


    } catch (error) {
      return error;
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    handleMajorPM();
  }, [session, selectedMajorID, majorValue]); // Empty dependency array means this effect runs once when the component mounts

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
  const handleSignature = (e) => {
    if(e.target.value === 'Exed signature'){
  //     setSelectedSignature(`<div style="margin-top:20px;">
  //     <strong>Yara SAADE NAJJAR</strong><br>
  //     Senior Program Manager, Responsable de Programmes<br>
  //     <br>
  //     <div width="100" style="font-size: 10px; padding: 20px;">
  //     École Supérieure des Affaires<br>
  //     Campus de l’ESA, 289 rue Clemenceau<br>
  //     Beyrouth, Liban, B.P. 113-7318<br><br>
  //     T <a href="tel:+9611373373" style="text-decoration:none;color:black;">+961 1 373 373 ext.1183</a><br>
  //     E <a href="mailto:saade@esa.edu.lb" style="text-decoration:none;color:black;">saade@esa.edu.lb</a><br>
  //     <a href="http://www.esa.edu.lb" style="text-decoration:none;color:black;">www.esa.edu.lb</a>
  //     </div>
  // </div>`)
      const signatureInfo = {
        name: 'Sara KARA',
        position: 'Program Manager ESA EXECUTIVE EDUCATION',
        address: 'École Supérieure des Affaires\nCampus de l’ESA, 289 rue Clemenceau\nBeyrouth, Liban, B.P. 113-7318',
        phone: '+961 1 373 373 ext.1154',
        tel_phone: '+961 1 373 374',
        email: 'exed@esa.edu.lb',
        website: 'www.esa.edu.lb'
    };
  setSelectedSignature(signatureInfo)
    }else if(e.target.value === 'My signature'){
      if(
        session?.user?.email === 'kara.s@esa.edu.lb'
        // true
      ){
        const signatureInfo = {
          name: 'Sara KARA',
          position: 'Program Manager ESA EXECUTIVE EDUCATION',
          address: 'École Supérieure des Affaires\nCampus de l’ESA, 289 rue Clemenceau\nBeyrouth, Liban, B.P. 113-7318',
          phone: '+961 1 373 373 ext.1154',
          tel_phone: '+961 1 373 374',
          email: 'kara.s@esa.edu.lb',
          website: 'www.esa.edu.lb'
      };
        setSelectedSignature(signatureInfo)
      }else if(session?.user?.email === 'yamak.n@esa.edu.lb'){
        const signatureInfo = {
          name: 'Nour YAMAK',
          position: 'Senior Program Manager',
          address: 'École Supérieure des Affaires\nCampus de l’ESA, 289 rue Clemenceau\nBeyrouth, Liban, B.P. 113-7318',
          phone: '+961 1 373 373 ext.1133',
          tel_phone: '+961 1 373 374',
          email: 'yamak.n@esa.edu.lb',
          website: 'www.esa.edu.lb'
      };
        setSelectedSignature(signatureInfo)
      }else if(session?.user?.email === 'maalouf.v@esa.edu.lb'){
        const signatureInfo = {
          name: 'Valérie MAALOUF',
          position: 'Responsable de Programme Senior Program Manager ESA Executive Education',
          address: 'École Supérieure des Affaires\nCampus de l’ESA, 289 rue Clemenceau\nBeyrouth, Liban, B.P. 113-7318',
          phone: '+961 1 373 373 ext.1172',
          tel_phone: '+961 1 373 374',
          email: 'maalouf.v@esa.edu.lb',
          website: 'www.esa.edu.lb'
      };
        setSelectedSignature(signatureInfo)
      }else if(session?.user?.email === 'saade.y@esa.edu.lb'){
        const signatureInfo = {
          name: 'Yara SAADE NAJJAR',
          position: 'Senior Program Manager Responsable de Programmes ESA Business School',
          address: 'École Supérieure des Affaires\nCampus de l’ESA, 289 rue Clemenceau\nBeyrouth, Liban, B.P. 113-7318',
          phone: '+961 1 373 373 ext.1183',
          email: 'saade.y@esa.edu.lb',
          website: 'www.esa.edu.lb'
      };
        setSelectedSignature(signatureInfo)
      }else{
        setMessage('Your signature is not exists.');
        setMessageClass('text-red-500');
        setIsLoading(false);
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    }else{
      setMessage('All Fields Must be Filled !');
      setMessageClass('text-red-500');
      setIsLoading(false);
      setTimeout(() => {
        setMessage('');
      }, 3000);
      return
    }
  }
  const submitHandler = async (e) => {
    console.log(session?.user?.email)
    console.log(signatureValue)
    e.preventDefault();
    setIsLoading(true);
    if (
      selectedMajorID === null ||
      selectedMajorID === '' ||
      subjectContent.trim() === '' ||
      emailContent.trim() === '' ||
      selectedSignature === null ||
      selectedSignature === ''
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
          selectedSignature
        };
        console.log('selectedSignature : ',selectedSignature)
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

  {session?.user.role === '2' || session?.user.role === '3' ? (
    <>
      <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">Send</p>

      <div className="flex flex-col md:flex-row items-center justify-center w-full">
        <div className="text-center md:mr-10">
          <p className={` ${messageClass}`}>{message}</p>
        </div>
        <form onSubmit={submitHandler} className='w-full max-w-4xl'>
          <div className="w-full md:w-2/3 lg:w-1/2">
            {session.user?.hasMultiMajor === 'true' &&
              <label className="block mb-4 md:mt-3 md:w-40">
              
                <select
                  onChange={(e) => setMajorValue(e.target.value)}
                  value={majorValue}
                  className="mt-3 ml-5"
                >
                  <option key={"uu2isdvf"} value="">
                    Choose a Major
                  </option>
                  {majors &&
                    majors.map((major) => (
                      <option key={major.major_id} value={major.major_id}>
                        {major.major_name}
                      </option>
                    ))}
                </select>
              </label>
            }

              <label className="block mb-4 md:mt-3 md:w-40">
              
              <select
                onChange={handleSignature}
                value={signatureValue}
                className="mt-3 ml-5"
              >
                <option key={"uu2isd"} value="">
                  Choose a signature
                </option>
                {/* {majors &&
                  majors.map((major) => (
                    <option key={major.major_id} value={major.major_id}>
                      {major.major_name}
                    </option>
                  ))} */}
                  <option key={1} value={"Exed signature"}>Exed signature</option>
                  <option key={2} value={"My signature"}>My signature</option>
              </select>
            </label>

            <div className="m-4">
              <input
                type="text"
                value={subjectContent}
                onChange={(e) => setSubjectContent(e.target.value)}
                placeholder="Subject"
                className="w-full p-2 border rounded"
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
                className="w-full sm:w-auto p-2 rounded primary-button md:min-w-[150px]"
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
    </>
  ) : (
    redirect()
  )}
</>


  );
}
Send.auth = true;
Send.adminOnly = true;
