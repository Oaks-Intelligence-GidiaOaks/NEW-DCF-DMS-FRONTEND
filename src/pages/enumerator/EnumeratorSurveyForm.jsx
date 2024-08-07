import { FormInput } from "../../components/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createSurvey } from "../../lib/service";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

import { useAuth } from "../../context";
import { FaRegUser } from "react-icons/fa";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { BiLogOut, BiIdCard } from "react-icons/bi";
import { BsDot } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { BsTelephone } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import oaksLogo from "../../assets/oaks-logo.svg";
import EnumeratorFormContext from "../../context/enumeratorFormContext";
import axios from "axios";
import { Link } from "react-router-dom";

const EnumeratorSurveyForm = () => {
  const {
    state: { currentLGA, showEnumeratorProfile },
    showProfile,
    hideProfile,
    logOut,
  } = useContext(EnumeratorFormContext);

  const { setUser, user } = useAuth();

  const [formData, setFormData] = useState({
    question1: null,
    question2: null,
    question3: null,
    question4: "",
    question5: "",
  });

  const [errors, setErrors] = useState(null);

  const userData = useQuery({
    queryKey: ["user-data"],
    queryFn: async () => {
      const res = await axios.get(`user`);
      return res;
    },
  });

  const AddSurvey = useMutation({
    mutationKey: ["add-survey"],
    mutationFn: (dt) => createSurvey(dt),
    onSuccess: (sx) => {
      toast.success(`submitted successfully`);
    },
    onError: (ex) => {
      setErrors(ex.response.data.errors);
      toast.error(ex.message);
    },
    onSettled: () => {
      clearFormData();
    },
  });

  let isEmptyFields = !!Object.values(formData).filter(
    (it) => it === null || it === ""
  )?.length;

  const isDisabled = AddSurvey.isPending;

  const clearFormData = () => {
    setFormData({
      question1: null,
      question2: null,
      question3: null,
      question4: "",
      question5: "",
    });

    document.getElementById("question1").value = null;
    document.getElementById("question2").value = null;
    document.getElementById("question3").value = null;
  };

  const handleInputChange = (val, fieldName) => {
    const fileFields = ["question1", "question2", "question3"];
    const maxSize = 10 * 1024 * 1024;

    if (fileFields.includes(fieldName) && val.size > maxSize) {
      alert(`File Size exceeds 5MB, Please upload a smaller file.`);

      document.getElementById(fieldName).value = "";
      return;
    }

    setFormData((fd) => ({
      ...fd,
      [fieldName]: val,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fData = new FormData();

    Object.entries(formData).forEach(([key, val]) => {
      fData.append(key, val);
    });

    const nData = Object.fromEntries(fData.entries());

    AddSurvey.mutate(nData);
  };

  return (
    <div>
      {/* Title Bar */}
      <div
        className={`${
          currentLGA.toLowerCase() === user.districts[0].toLowerCase()
            ? "bg-light-gray"
            : currentLGA.toLowerCase() === user.districts[1].toLowerCase()
            ? "bg-[#d1f5f1]"
            : currentLGA.toLowerCase() === user.districts[2].toLowerCase()
            ? "bg-[#e9f5d1]"
            : currentLGA.toLowerCase() === user.districts[3].toLowerCase()
            ? "bg-[#e8d1f5]"
            : "bg-[#D1E5F5]"
        }`}
      >
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

      <div className="mx-auto max-w-[1040px] pt-5 pl-3">
        <button
          className="flex gap-3 items-center justify-center px-5 py-2 w-fit profile-btn-bg bg-[#72a247] rounded"
          onClick={() => showProfile()}
        >
          <div className="flex items-center justify-center bg-white rounded-full p-1">
            <FaRegUser size={16} color="#777777" />
          </div>
          <span className="text-white font-medium">
            {user?.first_name} {user?.last_name}
          </span>
        </button>
      </div>

      {/* Enumerator Profile */}
      {showEnumeratorProfile && (
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
      )}

      <form
        action=""
        onSubmit={handleSubmit}
        className="md:w-3/4 mx-auto mt-6 flex flex-col gap-y-4 px-1"
      >
        <div className="gap-4 flex flex-col ">
          <div className="flex flex-col gap-3 border shadow-md p-3 px-5 rounded-md">
            <label htmlFor="">
              Upload Focus Group Discussion (FGD) Recording
            </label>

            <div>
              <input
                id="question1"
                type="file"
                name=""
                onChange={(e) =>
                  handleInputChange(e.target.files?.[0], "question1")
                }
                accept="audio/*"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border shadow-md p-3 px-5 rounded-md">
            <label htmlFor="">Upload Interview One </label>

            <div className="w-fit">
              <input
                type="file"
                name=""
                id="question2"
                accept="audio/*"
                onChange={(e) =>
                  handleInputChange(e.target.files?.[0], "question2")
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border shadow-md p-3 px-5 rounded-md">
            <label htmlFor="">Upload Interview Two</label>

            <div>
              <input
                type="file"
                name=""
                id="question3"
                accept="audio/*"
                onChange={(e) =>
                  handleInputChange(e.target.files?.[0], "question3")
                }
              />
            </div>
          </div>

          <div className="border shadow-md p-3 px-5 rounded-md">
            <FormInput
              label={"What is the Community Population Size ? "}
              inputClassNames={`border border-gray-500`}
              type={"text"}
              onChange={(e) => handleInputChange(e.target.value, "question4")}
              value={formData.question4}
            />
          </div>

          <div className="border shadow-md p-3 px-5 rounded-md">
            <FormInput
              label={"What is the name of the Community Leader?"}
              type={"text"}
              onChange={(e) => handleInputChange(e.target.value, "question5")}
              value={formData.question5}
            />
          </div>

          <button
            className={`${
              isDisabled || isEmptyFields ? "bg-gray-300" : "bg-primary-green"
            } w-full rounded-lg flex justify-center items-center p-2 mt-2 text-white md:w-2/3 mx-auto ${
              isDisabled || isEmptyFields
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={isDisabled || isEmptyFields}
          >
            {isDisabled ? <Oval height="20" /> : <span>Submit</span>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnumeratorSurveyForm;
