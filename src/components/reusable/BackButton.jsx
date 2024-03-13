import React from "react";
import { IoIosArrowBack } from "react-icons/io";

const BackButton = () => {
  return (
    <button className="h-[48px] rounded-[5px] bg-[#82B22E] flex items-center  py-5 gap-7 pl-6 pr-11">
      <span className="h-6 w-6 bg-white rounded-[5px] grid place-items-center">
        <IoIosArrowBack />
      </span>

      <span className="font-[500] text-xs leading-[18px]  text-white">
        Back
      </span>
    </button>
  );
};

export default BackButton;
