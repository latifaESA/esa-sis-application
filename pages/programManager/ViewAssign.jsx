
import Link from 'next/link';
import React from 'react';
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
export default function ViewAssign() {
    const { data: session } = useSession();

    const router = useRouter();

    const redirect = () => {
        router.push("/AccessDenied");
    };

    return (
        <>
            <Head>
                <title>SIS PM - Assign</title>
            </Head>

            {session?.user.role === "2" || session?.user.role === "3"? (
                <>
                    <div className="flex items-center justify-center h-[300px] gap-6">
                        <div className="flex font-bold text-xl">
                            <Link href="/programManager/teacherCourse">
                                <button
                                    className="primary-button hover:text-white hover:font-bold  justify-center text-white font-bold py-2 px-4 border-b-4 border-red-700  rounded uppercase"
                                    type="button"
                                >
                                    Assign Teacher
                                </button>
                            </Link>
                        </div>
                        {(session?.user.role === "2" || session?.user.role === "3") && (session?.user.majorid === "13" || session?.user.majorid === '15') ? 
                        <div className="flex font-bold text-xl">
                            <Link href="/programManager/ElectiveCourse">
                                <button
                                    className="primary-button hover:text-white hover:font-bold  justify-center text-white font-bold py-2 px-4 border-b-4 border-red-700  rounded uppercase"
                                    type="button"
                                >
                                    Assign Student
                                </button>
                            </Link>
                        </div> :<></>}


                    </div>
                </>
            ) : (
                redirect()
            )}

        </>
    )
}
ViewAssign.auth = true;
ViewAssign.adminOnly = true;
