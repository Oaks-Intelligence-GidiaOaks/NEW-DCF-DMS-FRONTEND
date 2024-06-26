import { useContext } from "react";
import { SlLocationPin } from "react-icons/sl";
import { BsChevronDown } from "react-icons/bs";
import EnumeratorFormContext from "../context/enumeratorFormContext";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "../context";

function LGAController({ userData }) {
  const {
    state: {
      currentLGA,
      showSubmissionNotification,
      showDuplicateNotification,
      showErrorNotification,
    },
    setCurrentLGA,
    setState,
  } = useContext(EnumeratorFormContext);
  const { user } = useAuth();

  const inputRef = useRef();
  const dropDownRef = useRef();

  const [dropDownValue, setDropDownValue] = useState(currentLGA);
  const [showDropDown, setShowDropDown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const updateForm = (lga) => {
    if (
      showSubmissionNotification ||
      showDuplicateNotification ||
      showErrorNotification
    ) {
      setState((prev) => ({
        ...prev,
        currentLGA: lga,
        showSubmissionNotification: false,
        showDuplicateNotification: false,
        showErrorNotification: false,
      }));
    }
  };

  // Close dropdown on click away
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setShowDropDown(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  // handle state change
  useEffect(() => {
    setCurrentLGA(dropDownValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropDownValue]);

  return (
    <div
      ref={dropDownRef}
      className="relative flex items-center px-2 py-1 border-[1px] border-solid border-primary-green rounded clamp-md w-[256px_!important] pr-6"
    >
      <SlLocationPin size={16} color="#72a247" />
      <input
        readOnly
        type="text"
        value={
          userData?.data?.data
            ? userData?.data?.data?.user?.districts.filter(
                (d) => d._id === currentLGA
              )[0]["name"]
            : currentLGA
        }
        placeholder="Change LGA"
        className="flex flex-1 capitalize pl-1 outline-none rounded cursor-pointer text-[14px] bg-transparent"
        onFocus={() => {
          setShowDropDown(true);
          setIsFocused(true);
        }}
        ref={inputRef}
      />
      {showDropDown && (
        <ul className="absolute w-full z-20 left-0 top-0 bg-white overflow-hidden translate-y-10 drop-down-shadow rounded max-h-[50vh]">
          {user.districts
            .filter((district) => district !== currentLGA)
            .map((item, i) => (
              <li
                key={i}
                className="px-2 py-2 text-[14px] capitalize cursor-pointer hover:bg-light-primary-green flex items-center gap-1 w-full"
                onClick={() => {
                  setDropDownValue(item);
                  setState((prev) => ({ ...prev, currentLGA: item }));
                  updateForm(item);
                  inputRef.current.blur();
                  setShowDropDown(false);
                  setIsFocused(false);
                }}
              >
                <SlLocationPin size={16} color="#72a247" />
                <span>
                  {
                    userData?.data?.data?.user?.districts.filter(
                      (d) => d._id === item
                    )[0]["name"]
                  }
                </span>
              </li>
            ))}
        </ul>
      )}
      <div
        className={`absolute cursor-pointer rounded-r h-full right-0 top-0 w-7 flex justify-center items-center ${
          isFocused ? "pointer-events-auto" : "pointer-events-auto"
        }`}
        onClick={() => {
          !showDropDown ? setShowDropDown(true) : setShowDropDown(false);
        }}
      >
        <BsChevronDown
          onClick={() => {
            !showDropDown ? setShowDropDown(true) : setShowDropDown(false);
          }}
          className={`cursor-pointer rounded-full transition-all ${
            showDropDown ? "rotate-0" : "rotate-180"
          }`}
        />
      </div>
    </div>
  );
}

export default LGAController;
