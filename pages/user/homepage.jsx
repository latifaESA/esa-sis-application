// pages/index.jsx
import Image from "next/image";
import Link from "next/link";
import esaBuilding from "../../public/images/ESA3.jpg";
import esaLogo from "../../public/images/esa.png";

export default function HomeScreen() {
    return (
        <div className="min-h-screen bg-[#F7F7F7] text-gray-800 flex flex-col">
            {/* HEADER */}
            <header className="bg-white py-6 px-10 shadow-md border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Image src={esaLogo} width={80} height={80} alt="ESA Logo" />
                    <div>
                        <p className="text-sm text-gray-500">Welcome to</p>
                        <h1 className="text-2xl font-semibold text-[#3D709A]">
                            Student Information System (SIS)
                        </h1>
                    </div>
                </div>
                <Link
                    href="/user/login"
                    className="text-[#3D709A] font-semibold text-lg px-6 py-2"
                >
                    Login
                </Link>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex flex-1 max-w-screen-xl mx-auto px-8 py-12 lg:flex-row flex-col-reverse">
                {/* Left - Image */}
                <div className="lg:w-1/2 w-full mb-12 lg:mb-0 flex justify-center">
                    <div className="w-full max-w-[500px]">
                        <Image
                            src={esaBuilding}
                            alt="ESA Building"
                            layout="responsive"
                            width={500}
                            height={700}
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                </div>

                {/* Right - Features */}
                <div className="lg:w-1/2 w-full bg-white p-8 rounded-xl shadow-lg flex flex-col justify-between">
                    <h2 className="text-3xl font-semibold text-[#3D709A] mb-6 text-center">
                        What You Can Do with Student Information System
                    </h2>
                    <ul className="space-y-6 flex-grow">
                        {[
                            {
                                label: "Check your Grades",
                                title: "Stay on Top of Your Grades",
                                description:
                                    "Easily track your academic performance and stay informed about your progress in every course.",
                                color: "#002857",
                            },
                            {
                                label: "Check and Sync Schedule Calendar",
                                title: "Organize Your Schedule",
                                description: (
                                    <>
                                        Sync your timetable with Google Calendar{" "}
                                        <span className="text-[#4285F4] font-medium">   <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
                                                    alt="Google Calendar"
                                                    className="inline h-[1em] align-middle"
                                                /></span>{" "}
                                        so you never miss a class or deadline again.
                                    </>
                                ),
                                color: "#535252",
                            },

                            {
                                label: "Submit Requests",
                                title: "Make Official Requests Hassle-Free",
                                description:
                                    "Submit transcripts or other requests directly to program managers—quickly and securely.",
                                color: "#2b6ab3",
                            },
                            {
                                label: "Check your payment",
                                title: "Manage Your Payments Confidently",
                                description:
                                    "Check upcoming tuition installments and payment history so you stay financially in control.",
                                color: "darkgray",
                            },
                        ].map((feature, i) => (
                            <li key={i} className="flex items-start gap-6">
                                <div
                                    className="w-24 h-24 rounded-full flex items-center justify-center text-[14px] font-semibold text-white text-center px-4 shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
                                    style={{ backgroundColor: feature.color }}
                                >
                                    {feature.label}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-[#3D709A]">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <a
                    href="/privacy-policy.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold text-lg hover:underline transition-all duration-300 text-center ease-in-out"
                >
                    View Our Privacy Policy
                </a>

                </div>
            </main>

            {/* FOOTER */}
            {/* <footer className="bg-gradient-to-r from-[#F3F9FF] to-[#B2D0FF] text-center py-8 border-t border-gray-200">
                <p className="text-lg font-semibold text-[#3D709A] mb-4">
                    We care about your experience
                </p>
                <a
                    href="/privacy-policy.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold text-lg hover:underline transition-all duration-300 ease-in-out"
                >
                    View Our Privacy Policy
                </a>
            </footer> */}
        </div>
    );
}
