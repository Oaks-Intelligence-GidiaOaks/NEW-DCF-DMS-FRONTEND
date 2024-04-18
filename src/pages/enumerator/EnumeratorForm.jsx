import { useContext, useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { IoSaveOutline } from "react-icons/io5";
import { HiOutlineArrowLeft, HiUserCircle } from "react-icons/hi";
import { BiLogOut, BiIdCard, BiError, BiLock } from "react-icons/bi";
import { BsDot } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { ImBlocked } from "react-icons/im";
import { BsTelephone } from "react-icons/bs";
import { MdOutlineEmail, MdDone, MdOutlineClose } from "react-icons/md";
import LGAController from "../../components/LGAController";
import ProgressBar from "../../components/ProgressBar";
import TabBar from "../../components/TabBar";
import oaksLogo from "../../assets/oaks-logo.svg";
import EnumeratorFormContext from "../../context/enumeratorFormContext";
import { useApp, useAuth } from "../../context";
import axios from "axios";
import { Rings } from "react-loader-spinner";
import ChangePassword from "../../components/enumeratorFormTabs/ChangePassword";
import { useQuery } from "@tanstack/react-query";
import { ProductItemInput } from "../../components/reusable";
import {
  countValidValueKeys,
  countValueOccurrences,
  deepCompare,
  deepCopy,
} from "../../lib";

function EnumeratorForm() {
  const { secureLocalStorage } = useApp();
  const savedState = JSON.parse(secureLocalStorage.getItem("oaks-enum-forms"));

  const {
    state: {
      showEnumeratorProfile,
      currentFormTab,
      currentLGA,
      showSavedNotification,
      showSubmissionNotification,
      showDuplicateNotification,
      showErrorNotification,
      isSubmitting,
    },
    setState,
    contextLgaRoutes,
    setCurrentLGA,
    setContextLgaRoutes,
    showProfile,
    hideProfile,
    hideSubmissionNotification,
    hideDuplicateNotification,
    hideErrorNotification,
    updateTransportTab,
    formatLGA,
    logOut,
    submitForm,
  } = useContext(EnumeratorFormContext);

  const { setUser, user } = useAuth();
  const [formState, setFormState] = useState(savedState?.formState ?? null);

  console.log("form state: ", savedState);

  useEffect(() => {
    window.addEventListener("beforeunload", function (e) {
      e.preventDefault();
      e.returnValue = "";
    });

    return () =>
      window.removeEventListener("beforeunload", function (e) {
        e.preventDefault();
        e.returnValue = "";
      });
  }, []);

  const enumeratorFormData = useQuery({
    queryKey: ["enumerator-form-data"],
    queryFn: async () => {
      const res = await axios.get(`product/by_country/${user.country}`);
      return res;
    },
    select: (data) => {
      const uniqueCategories =
        data?.data?.data?.reduce((unique, item) => {
          const categoryName = item?.category?.name;
          if (categoryName && !unique.includes(categoryName)) {
            unique.push(categoryName);
          }
          return unique;
        }, []) || [];
      const processedData =
        data?.data?.data?.reduce((accumulator, item) => {
          const categoryName = item?.category?.name;
          if (categoryName) {
            const updatedInputs = item.inputs.map((input) => ({
              ...input,
              value: "",
            }));
            accumulator[categoryName] = [
              { ...item, inputs: updatedInputs },
              ...(accumulator[categoryName] ?? []),
            ];
          }
          return accumulator;
        }, {}) || {};
      return {
        categories: uniqueCategories,
        data: processedData,
      };
    },
  });

  const userData = useQuery({
    queryKey: ["user-data"],
    queryFn: async () => {
      const res = await axios.get(`user`);
      return res;
    },
  });

  console.log("User data: ", userData.data);

  useEffect(() => {
    if (enumeratorFormData.isSuccess) {
      if (
        deepCompare(
          savedState?.formState,
          enumeratorFormData?.data?.data,
          "value"
        )
      ) {
        setFormState(savedState.formState);
      } else {
        setFormState(deepCopy(enumeratorFormData?.data?.data));
      }
    }
  }, [enumeratorFormData.isSuccess]);

  useEffect(() => {
    // checks if the form has any update, it there's an update use the new form else use saved form
    if (showDuplicateNotification) {
      setFormState(deepCopy(enumeratorFormData?.data?.data));
    }
    if (showDuplicateNotification) {
      setFormState(deepCopy(enumeratorFormData?.data?.data));
    }
  }, [showDuplicateNotification, showSubmissionNotification]);

  // Save form if any change is made
  useEffect(() => {
    backgroundSave();
  }, [
    showEnumeratorProfile,
    currentFormTab,
    currentLGA,
    showSavedNotification,
    showSubmissionNotification,
    showDuplicateNotification,
    showErrorNotification,
    isSubmitting,
    formState,
  ]);

  const progressPercentage = Math.round(
    (countValidValueKeys(formState) / countValueOccurrences(formState)) * 100
  );

  const saveForm = () => {
    secureLocalStorage.setItem(
      "oaks-enum-forms",
      JSON.stringify({
        showEnumeratorProfile,
        currentFormTab,
        currentLGA,
        showSavedNotification,
        showSubmissionNotification,
        showDuplicateNotification,
        showErrorNotification,
        isSubmitting,
        formState,
      })
    );
    setState((prev) => ({
      ...prev,
      showSavedNotification: true,
    }));
  };
  const backgroundSave = () => {
    secureLocalStorage.setItem(
      "oaks-enum-forms",
      JSON.stringify({
        showEnumeratorProfile,
        currentFormTab,
        currentLGA,
        showSavedNotification,
        showSubmissionNotification,
        showDuplicateNotification,
        showErrorNotification,
        isSubmitting,
        formState,
      })
    );
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
          <img
            src={oaksLogo}
            alt="Company Logo"
            className="fix-image max-w-[150px] xs:max-w-[120px] sm:max-w-[150px]"
          />
          <p className="text-base xs:text-sm sm:text-base">
            <span className="font-semibold">Data Capture</span>{" "}
            <span>Form</span>
          </p>
        </div>
      </div>

      <div>
        <div
          className={`${
            currentLGA.toLowerCase() === user.districts[0].toLowerCase()
              ? "bg-white"
              : currentLGA.toLowerCase() === user.districts[1].toLowerCase()
              ? "bg-[#d1f5f17d]"
              : currentLGA.toLowerCase() === user.districts[2].toLowerCase()
              ? "bg-[#e9f5d177]"
              : currentLGA.toLowerCase() === user.districts[3].toLowerCase()
              ? "bg-[#e8d1f570]"
              : "bg-[#EDF2F6]"
          }`}
        >
          {/* Enumerator account */}
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

          {/* Info Bar */}
          {formState ? (
            <div className="flex flex-wrap gap-y-10 justify-around sm:justify-between items-end mt-10 pb-14 xs:pb-4 max-w-[1040px] mx-auto">
              <ProgressBar formState={formState} />
              <div
                className={`flex flex-nowrap gap-5 ${
                  user?.districts.length > 1
                    ? "justify-center"
                    : "justify-end xs:pr-0 sm:pr-3"
                }  max-w-[410px] xs:w-[90%]`}
              >
                {user.districts.length > 1 && (
                  <LGAController userData={userData} />
                )}
                <button
                  className="flex justify-center items-center px-3 bg-primary-green py-2 max-w-[170px] rounded"
                  onClick={saveForm}
                >
                  <span className="text-white text-[14px] ">Save Changes</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Tab Bar */}
        <div
          className={`sticky top-0 z-10 max-w-[1040px] mx-auto fix-scrollbar overflow-x-scroll backdrop-blur-[300px] ${
            currentLGA.toLowerCase() === user.districts[0].toLowerCase()
              ? "bg-white"
              : currentLGA.toLowerCase() === user.districts[1].toLowerCase()
              ? "bg-[#d1f5f17d]"
              : currentLGA.toLowerCase() === user.districts[2].toLowerCase()
              ? "bg-[#e9f5d177]"
              : currentLGA.toLowerCase() === user.districts[3].toLowerCase()
              ? "bg-[#e8d1f570]"
              : "bg-[#EDF2F6]"
          }`}
        >
          <TabBar tabs={enumeratorFormData?.data?.categories ?? []} />
          {/* <TabBar tabs={dummyCategories ?? []}/> */}
        </div>
        <div className={`max-w-[1280px] mx-auto justify-center pb-20 pt-4`}>
          {/* Form */}
          <div className="min-h-[100vh] bg-white px-4">
            {/* {!enumeratorFormData.isLoading ? ( */}
            {!enumeratorFormData.isLoading &&
            enumeratorFormData.isSuccess &&
            formState !== null ? (
              <div>
                <div className="flex flex-col gap-y-6 max-w-[1040px] mx-auto">
                  {formState[
                    currentFormTab ?? enumeratorFormData?.data?.categories[0]
                  ].map((product, index) => (
                    <ProductItemInput
                      productData={product}
                      key={index}
                      handleState={(e, productData, inputId) => {
                        setFormState((prev) => {
                          let newData = { ...prev };
                          newData[productData.category.name][index]["inputs"][
                            inputId
                          ]["value"] = e.target.value;
                          return newData;
                        });
                      }}
                      handleDropDownChange={(value, productData, inputId) => {
                        setFormState((prev) => {
                          let newData = { ...prev };
                          newData[productData.category.name][index]["inputs"][
                            inputId
                          ]["value"] = value;
                          return newData;
                        });
                      }}
                    />
                  ))}
                </div>
                <div className="mt-10">
                  <p className="text-[14px] w-full mb-10 text-gray-500">
                    <span className="font-bold">NOTE</span>: Submit button will
                    only be active after all form sections have been filled and
                    the progress bar at the top is complete.
                  </p>
                  <button
                    disabled={progressPercentage !== 100 || isSubmitting}
                    onClick={() => {
                      submitForm(
                        user.token,
                        formState,
                        enumeratorFormData?.data?.categories ?? []
                      );
                    }}
                    className={`${
                      progressPercentage === 100
                        ? "bg-primary-green"
                        : "bg-gray-300"
                    } w-full rounded-lg flex justify-center items-center p-2 mt-2 text-white ${
                      isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? (
                      <Rings
                        height="36"
                        width="36"
                        color="#ffffff"
                        radius="6"
                        wrapperStyle={{ backgoundColor: "yellow" }}
                        wrapperClass=""
                        visible={true}
                        ariaLabel="rings-loading"
                      />
                    ) : (
                      <span className="block p-2 text-[14px]">Submit</span>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full min-h-[50vh] flex justify-center gap-2 flex-col items-center ">
                <Rings
                  height="60"
                  width="60"
                  color="#72a247"
                  radius="30"
                  wrapperClass=""
                  visible={true}
                  ariaLabel="rings-loading"
                />
                <p>Loading</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Saved changes notification */}
      {showSavedNotification && (
        <div className="fixed top-0 left-0 flex backdrop-blur-sm z-20 w-screen h-screen justify-center items-center">
          <div className=" flex flex-col gap-2 px-3 bg-white max-w-[360px] min-w-[240px] pt-10 pb-5 rounded-[10px] login-form-shadow mx-3 xs:w-[90vh]">
            <div className="flex gap-3 justify-center items-center radiant-shadow bg-primary-green w-fit mx-auto p-3 mt-5 mb-10 rounded-full">
              <IoSaveOutline color="white" size={30} />
            </div>
            <p className="text-center font-bold text-xl">Form Changes Saved</p>
            <p className="text-center px-3 xs:px-1 sm:px-3 pt-2">
              Your changes have been saved successfully.
            </p>
          </div>
        </div>
      )}
      {/* Submitted notification */}
      {showSubmissionNotification && (
        <div className="fixed top-0 left-0 flex backdrop-blur-sm z-20 w-screen h-screen justify-center items-center">
          <div className="relative flex flex-col gap-2 px-3 bg-white max-w-[360px] min-w-[240px] pt-10 pb-10 rounded-[10px] login-form-shadow mx-3 xs:w-[90vh]">
            <div
              className="absolute flex justify-center items-center w-6 h-6 top-4 right-4 hover:bg-gray-200 rounded-full transition-all duration-200 cursor-pointer"
              onClick={hideSubmissionNotification}
            >
              <MdOutlineClose size={20} />
            </div>
            <div className="flex gap-3 justify-center items-center radiant-shadow bg-primary-green w-fit mx-auto p-3 mt-5 mb-10 rounded-full">
              <MdDone color="white" size={30} />
            </div>
            <p className="text-center font-bold text-xl">Form Submitted</p>
            <p className="text-center px-3 xs:px-1 sm:px-3 pt-2">
              Your captured data has been successfully submitted. Thanks for
              your contribution.
            </p>
            <div className="mt-5 flex justify-center">
              {user.districts.length > 1 && <LGAController />}
            </div>
          </div>
        </div>
      )}
      {/* Already Submitted notification */}
      {showDuplicateNotification && (
        <div className="fixed top-0 left-0 flex backdrop-blur-sm z-20 w-screen h-screen justify-center items-center">
          <div className="relative flex flex-col gap-2 px-3 bg-white max-w-[360px] min-w-[240px] pt-10 pb-10 rounded-[10px] login-form-shadow mx-3 xs:w-[90vh]">
            <div
              className="absolute flex justify-center items-center w-6 h-6 top-4 right-4 hover:bg-gray-200 rounded-full transition-all duration-200 cursor-pointer"
              onClick={hideDuplicateNotification}
            >
              <MdOutlineClose size={20} />
            </div>
            <div className="flex gap-3 justify-center items-center radiant-shadow bg-primary-green w-fit mx-auto p-3 mt-5 mb-10 rounded-full">
              <ImBlocked color="white" size={30} />
            </div>
            <p className="text-center font-bold text-xl">
              Form Already Submitted
            </p>
            <p className="text-center px-3 xs:px-1 sm:px-3 pt-2">
              Our records tell us you've already submitted for{" "}
              <span className="font-semibold capitalize">{currentLGA} </span>
              <span className="font-semibold">LGA</span> this week.
            </p>
            <div className="mt-5 flex justify-center">
              {user.districts.length > 1 && <LGAController />}
            </div>
          </div>
        </div>
      )}
      {/* Error notification */}
      {showErrorNotification && (
        <div className="fixed top-0 left-0 flex backdrop-blur-sm z-20 w-screen h-screen justify-center items-center">
          <div className="relative flex flex-col gap-2 px-3 bg-white max-w-[360px] min-w-[240px] pt-10 pb-10 rounded-[10px] login-form-shadow mx-3 xs:w-[90vh]">
            <div
              className="absolute flex justify-center items-center w-6 h-6 top-4 right-4 hover:bg-gray-200 rounded-full transition-all duration-200 cursor-pointer"
              onClick={hideErrorNotification}
            >
              <MdOutlineClose size={20} />
            </div>
            <div className="flex gap-3 justify-center items-center error-radiant-shadow bg-red-600 w-fit mx-auto p-3 mt-5 mb-10 rounded-full">
              <BiError color="white" size={30} />
            </div>
            <p className="text-center font-bold text-xl">Error</p>
            <p className="text-center px-3 xs:px-1 sm:px-3 pt-2">
              We couldn't submit your form because of an error, please check
              your network and try again.
            </p>
            <div className="mt-5 flex justify-center">
              {user.districts.length > 1 && <LGAController />}
            </div>
          </div>
        </div>
      )}
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
      {/* Change password on initial login */}
      {user.firstUse && <ChangePassword />}
    </div>
  );
}

export default EnumeratorForm;
