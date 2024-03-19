
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { appIsWaiting } from '../../redux/slices/appSlice';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/router';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function Items() {
  const [paymentInfo, setPaymentInfo] = useState([]);
  const [theError, setTheError] = useState('')

  const { data: session } = useSession();

  console.log('the session is : ', session?.user.pimsId)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(appIsWaiting(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    let paymentData = async () => {
      try{
        let body = {pimsID : session?.user.pimsId}
      let result = await axios.post('/api/pims/apis', body)
      console.log('the result of pims : ', result)
      setPaymentInfo(result.data.statements.STATEMENT)
      console.log(result.data.statements.STATEMENT)
      console.log('THE ZERO : ',result.data.statements.STATEMENT[0].XACTS)
      setTheError('')
      return
      }catch (error){
        console.log('the error in requesting pims data is : ', error.response.data.error)
        setTheError(error.response.data.error)
        return;
      }
    }
    paymentData();
  }, []);

  

  // const { data: session } = useSession();
  // const router = useRouter()

  // const redirect = () => { 
  //   router.push('/AccessDenied')
  // }

  return (
    <>
      {theError?.length >0 ? 
      <div className='text-center bg-red-400 text-white rounded p-2'>
        {theError}
      </div>
      :
      <div className='border-2 border-primary rounded-lg p-4'>
        <table className='w-full text-center'>
          <thead className="border-b border-blue-gray-100 p-4 bg-blue-50 text-primary">
            <tr>
              <th>Input Date</th>
              <th>Due Date</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {
              paymentInfo && paymentInfo.map((pay,index) => 
                pay.XACTS[0].XACT.map(payCur => 
                    <tr className="p-4 border-b border-blue-gray-50" key={index}>
                        <td>{payCur.INPUTDATE[0]}</td>
                        <td>{payCur.DUEDATE[0]}</td>
                        <td>{payCur.BALANCE[0]} {pay.CURRENCY[0]}</td>
                    </tr>
                    )
                )
            }
          </tbody>
        </table>
      </div>
      }
      </>
  );
}

Items.auth = true;
Items.adminOnly = true;
