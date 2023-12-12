import React from 'react'

export default function ResetPassComponent({id,handleChangePass,handleCancel,newPass,setNewPass,loading,error,success,isSuccess}) {
  return (
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="relative my-6 mx-auto max-w-3xl w-1/3">
      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-4">
        <>
        {isSuccess ?
        <h6 className="text-green-700 font-bold text-center mb-6">
        {success}
       </h6>
        :
        <h6 className="text-red-700 font-bold text-center mb-6">
         {error}
        </h6>
        }
        </>
        <>
        <p className='self-center'>{id}</p>
        <input onChange={(e) => setNewPass(e.target.value)} value={newPass} />
        <div className='flex justify-between mt-2 mb-2'>
          <button onClick={handleChangePass} className='primary-button rounded w-60 btnCol text-white hover:text-white hover:font-bold'>Change Password</button>
          <button onClick={handleCancel} className='cancel-button rounded w-60 btnCol text-white hover:text-white hover:font-bold bg-gray-100'>Cancel</button>
        </div>
        </>
        {loading &&
                <div role="status" className="flex flex-col  justify-center absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                    <div className="flex justify-center pb-12">
                        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>

                    </div>
                    <div className="flex justify-center">
                        <h5 className="text-gray-700 text-base">please wait until process complete...</h5>
                    </div>
                </div>
        }
        </div>
      </div>
    </div>
  )
}
