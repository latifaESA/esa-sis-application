// import { useDispatch } from 'react-redux';
// import { LowerButtons } from '../../components/Admin/LowerButtons';
// import { appIsWaiting } from '../../../redux/slices/appSlice';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const StudentBlue = () => {
  const [survey, setSurvey] = useState([]);
  const { data: session } = useSession();

  let userid = parseInt(session?.user.ID);

  useEffect(() => {
    const BlueData = async () => {
      let { data } = await axios.get(
        `https://survey.esa.edu.lb/BPI/PathwayService.svc/PWBlueTasks?pathway=140&userid=${userid}&SubjectIDs=2022_EMBA-CC-08_01,2022_EMBA-S-04_01,2022_EMBA-EC-03_02,2022_EMBA-EC-09_01`
        //   , {

        //   // httpsAgent: new https.Agent({
        //   //     rejectUnauthorized: false,
        //   //   })
        //   }
      );

      setSurvey(data.Tasks);
    };
    BlueData();
  }, []);
  console.log(survey);
  return (
    <>
      {/* Heading */}
      {survey && survey.length > 0 && (
        <div className="text-center text-red-600">
          <h4>Dear Student, your account is limited</h4>
          <p className="text-gray-700 text-xl pt-5 mb-10 ">
            Please Fill up the following survey to reactivate your account
          </p>
        </div>
      )}
      {/* Blue data Map */}

      {survey &&
        survey.map(({ ID, Name, Link, StartDate, DueDate }) => {
          return (
            <div key={ID}>
              <p className="text-gray-700 text-sm pt-5 ">
                Start Date: {StartDate}
              </p>
              <p className="text-gray-700 text-xl pt-5 mb-2">{Name}</p>
              <p className="text-gray-700 text-xl pt-5 mb-2">
                Follow the Link to take the Survey{' '}
                <a className="underline" href={Link}>
                  Take Survey
                </a>
              </p>
              <p className="text-gray-700 text-sm pt-5 mb-10">
                Due Date: {DueDate}
              </p>
              <hr className="h-px w-[50%] mx-auto my-8 bg-gray-200 border-0" />
            </div>
          );
        })}
    </>
  );
};

export default StudentBlue;
