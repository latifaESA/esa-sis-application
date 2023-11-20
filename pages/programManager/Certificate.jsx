import Head from "next/head";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import axios from "axios";
import CertificateModal from "./ModalForm/CertificateModal";
import CertificateList from "../../components/Dashboard/CertificateList";


export default function Certificate() {

  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false)

  const router = useRouter();
  const redirect = () => {
    router.push("/AccessDenied");
  };

  const openModal = () => {

    setModal(true)

  };
  const closeModal = () => {
    setModal(false)
  }

  const handleCertificate = async () => {
    try {
      const response = await axios.post('/api/pmApi/getEnrollment')
      setUsers(response.data.data)
    } catch (error) {
      return error
    }
  }

  useEffect(() => {

    handleCertificate();
  }, []);

  return (
    <>
      {modal ? <CertificateModal closeModal={closeModal} setUsers={setUsers} /> : <></>}
      <Head>
        <title>SIS Admin - Certificate</title>
      </Head>
      {session?.user.role === "2" || session?.user.role === "3" ? (
        <>
          <p className="text-gray-700 text-3xl pt-5 mb-10 font-bold">Certificate</p>
          <form>

            <div className="grid grid-cols-1 gap-4 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 mb-3 pb-4 border-blue-300 border-b-2">

              <div className="flex flex-col min-[850px]:flex-row gap-4">
              </div>
              <div className="flex flex-col min-[850px]:flex-row gap-4">
              </div>
              <div className="flex flex-col min-[850px]:flex-row gap-4">
                <button
                  className="primary-button btnCol text-white w-60 hover:text-white hover:font-bold"
                  type="button"
                  onClick={openModal}
                >
                  Add Certificate
                </button>
              </div>
            </div>
            <div>
              <CertificateList users={users} setUsers={setUsers} />

            </div>


          </form>
        </>
      ) : (
        redirect()
      )}
    </>
  );
}
Certificate.auth = true;
Certificate.adminOnly = true;
