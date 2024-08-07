import React, { useContext } from "react";
import { FcSurvey } from "react-icons/fc";
import { FaDatabase } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import EnumeratorFormContext from "../../context/enumeratorFormContext";
import oaksLogo from "../../assets/oaks-logo.svg";

const Landing = () => {
  return (
    <div>
      {/* Title Bar */}
      <div className={`${"bg-light-gray"}`}>
        <div className="flex justify-between max-w-[1280px] mx-auto items-center px-10 lg:px-10 md:px-4 sm:px-4 xs:px-4 py-3">
          <Link to={"/landing"}>
            <img
              src={oaksLogo}
              alt="Company Logo"
              className="fix-image max-w-[150px] xs:max-w-[120px] sm:max-w-[150px]"
            />
          </Link>

          <p className="text-base xs:text-sm sm:text-base">
            <span className="font-semibold">Survey Capture </span>
            <span>Form</span>
          </p>
        </div>
      </div>

      {/* <div className="mx-auto max-w-[1040px] pt-5 pl-3">
        <button
          className="flex gap-3 items-center justify-center px-5 py-2 w-fit profile-btn-bg bg-[#72a247] rounded"
          onClick={() => {}}
        >
          <div className="flex items-center justify-center bg-white rounded-full p-1">
            <FaRegUser size={16} color="#777777" />
          </div>
          <span className="text-white font-medium">
            {user?.first_name} {user?.last_name}
          </span>
        </button>
      </div> */}

      {/* Enumerator Profile */}
      {/* {showEnumeratorProfile && (
        <div className="fixed top-0 left-0 flex backdrop-blur-sm z-20 w-screen h-screen justify-center overflow-y-scroll py-[10vh] xs:py-0 sm:py-[10vh]">
          <div className=" flex flex-col gap-2 profile-bg bg-[#72a247] h-fit min-w-[280px] max-w-[640px] sm:min-w-[360px] xs:w-screen mx-3 xs:mx-0 sm:mx-3 rounded-[10px] xs:rounded-none sm:rounded-[10px] overflow-hidden login-form-shadow">
            <button
              className="flex gap-1 items-center justify-center px-3 py-3 w-fit rounded"
              onClick={() => hideProfile()}
            >
              <div className="flex items-center justify-center p-1">
                <HiOutlineArrowLeft size={20} color="white" />
              </div>
              <span className="text-white font-medium">Back</span>
            </button>
            <div className="flex items-center justify-center h-[40vh]">
              <div className="flex items-center justify-center bg-white rounded-full p-8 w-fit">
                <FaRegUser size={60} color="#777777" />
              </div>
            </div>
            <div className="flex flex-col gap-4 bg-white px-6 py-6 rounded-tl-[25px] rounded-tr-[25px]">
              <div className="flex gap-3 items-start px-5 pb-3 border-b border-solid border-mid-gray cursor-pointer">
                <div className="pt-1">
                  <BiIdCard size={20} color="#777777" />
                </div>
                <div>
                  <p className="text-[17px] font-medium">User ID</p>
                  <p className="text-[15px] text-secondary-gray">{user.id}</p>
                </div>
              </div>
              <div className="flex gap-3 items-start px-5 pb-3 border-b border-solid border-mid-gray cursor-pointer">
                <div className="pt-1">
                  <FaRegUser size={18} color="#777777" />
                </div>
                <div>
                  <p className="text-[17px] font-medium">Full Name</p>
                  <p className="text-[15px] text-secondary-gray">
                    {user?.first_name + " " + user?.last_name}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start px-5 pb-3 border-b border-solid border-mid-gray cursor-pointer">
                <div className="pt-1">
                  <BsTelephone size={18} color="#777777" />
                </div>
                <div>
                  <p className="text-[17px] font-medium">Mobile</p>
                  <p className="text-[15px] text-secondary-gray">
                    {user?.phone_number}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start px-5 pb-3 border-b border-solid border-mid-gray cursor-pointer">
                <div className="pt-1">
                  <MdOutlineEmail size={18} color="#777777" />
                </div>
                <div>
                  <p className="text-[17px] font-medium">Email</p>
                  <p className="text-[15px] text-secondary-gray">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start px-5 pb-3 border-b border-solid border-mid-gray cursor-pointer">
                <div className="pt-1">
                  <SlLocationPin size={18} color="#777777" />
                </div>
                <div>
                  <p className="text-[17px] font-medium">
                    {userData.data?.data?.user?.districts?.length > 1
                      ? "Districts"
                      : "District"}
                  </p>
                  {userData?.data?.data?.user?.districts.map((district, i) => (
                    <p
                      key={i}
                      className="text-[15px] capitalize text-secondary-gray flex items-center -translate-x-[6px]"
                    >
                      <BsDot size={18} color="#72a247" />
                      <span>{district.name}</span>
                    </p>
                  ))}
                </div>
              </div>
              <div
                className="flex gap-3 items-start px-5 pb-3 border-b border-solid border-mid-gray cursor-pointer"
                onClick={() => {
                  logOut();
                  setUser(null);
                }}
              >
                <div className="pt-[2px]">
                  <BiLogOut size={18} color="red" />
                </div>
                <div>
                  <p className="text-[15px] font-medium text-red-600">
                    Log Out
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}

      <div className="h-[80vh] w-full grid place-items-center px-3">
        <div className="max-w-3xl ">
          <div className="text-center ">
            <h2 className="text-2xl font-bold">Choose Data Collection</h2>

            <p className="">
              Welcome, enumerators! Select the appropriate data collection
              method to begin your work.
            </p>
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-6">
            <Link to={"/survey"}>
              <div className=" cursor-pointer flex items-center gap-3 border p-3 rounded-md min-h-[130px]">
                <div className="  grid place-items-center rounded-full border border-gray-200 p-2">
                  <FcSurvey size={30} />
                </div>

                <div>
                  <h2 className="font-semibold">Survey Collection</h2>

                  <p>
                    Gather comprehensive data through structured surveys
                    designed for in-depth analysis.
                  </p>
                </div>
              </div>
            </Link>

            <Link to={"/form"}>
              <div className="min-h-[130px] cursor-pointer flex items-center gap-3 p-3 border rounded-md">
                <div className="p-2  grid place-items-center rounded-full shadow-sm border border-gray-200">
                  <FaDatabase size={25} />
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="font-semibold">Weekly Data Collection</h2>

                  <p>
                    Capture regular updates with our streamlined weekly data
                    collection process for ongoing monitoring
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
