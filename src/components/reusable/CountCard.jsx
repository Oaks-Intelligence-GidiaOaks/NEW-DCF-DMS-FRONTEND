import React from "react";
import { TiPlus } from "react-icons/ti";

const CountCard = ({
  text,
  count,
  styles,
  textStyles,
  countStyles,
  plusColor,
  plus,
}) => {
  return (
    <div
      className={
        "h-[48px] w-fit px-[22px] flex gap-5 md:gap-3 items-center rounded-[5px] font-poppins font-[500] " +
        styles
      }
    >
      <span className={textStyles + " p-1 text-xs md:text-sm rounded-[5px]"}>
        {text}
      </span>

      <span className={countStyles + " py-1 px-[6px] rounded-[5px]"}>
        {count}
      </span>

      {plus && <TiPlus color={plusColor} />}
    </div>
  );
};

export default CountCard;
