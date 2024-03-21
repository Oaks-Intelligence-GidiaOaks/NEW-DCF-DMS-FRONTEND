import React from "react";

const FormButton = ({ onClick, buttonStyles, text }) => {
  return (
    <button
      className={
        "h-[54px] mt-[42px] w-full text-center text-white bg-[#82B22E] rounded-[5px]" +
        buttonStyles
      }
    >
      {text}
    </button>
  );
};

export default FormButton;
