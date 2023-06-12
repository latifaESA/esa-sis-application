// import React ,{useState}from 'react'
// import DropZone from '../../../components/UploadDocuments/DropZone';
// import { ProfileModal } from '../../../components/StudentInfoApplication/ModalDocument';
// import { BsX  , BsExclamationTriangle , BsCheckCircleFill} from "react-icons/bs";

// export default function Archive({setShowArchive}) {
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [updateProfileButtonDisable, setupdateProfileButtonDisable] =
//     useState(false);
//     const [profileUrl, setProfileUrl] = useState(null);
//   return (
//     <>
//     <div
//       className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
//     >
//       <div className="relative w-auto my-6 mx-auto max-w-3xl">
//         {/*content*/}
//         <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
//           {/*header*/}
//           <div className="flex items-start justify-between p-2">
//                             {/* <h3 className="text-3xl font-semibold">
//                     Modal Title
//                   </h3> */}
//                             <button
//                                 className="p-1 ml-auto  border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
//                                 onClick={e => setIsModal(false)}
//                             >
//                                 <span className=" text-black  h-6 w-6 text-2xl block outline-none focus:outline-none">
//                                     <BsX className=' text-gray-700' />
//                                 </span>
//                             </button>
//                         </div>
//           {/*body*/}
//           <div className="relative p-6 flex-auto">
//           {/* <DropZone
          
//           type={'file'}
//         /> */}

//         {profileUrl && profileUrl !== ' ' && (
//           <div className='flex justify-center items-center'>
//             {!showProfileModal && (
//               <a className='cursor-pointer' >
//                 Preview Profile Photo
//               </a>
//             )}
//             {showProfileModal && (
//               <ProfileModal  />
//             )}
//           </div>
//         )}
//           </div>
//           {/*footer*/}
//           <div className="flex items-center justify-end p-6">
//             <button
//               className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
//               type="button"
//               onClick={() => setShowArchive(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//     <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
//   </>
//   )
// }
