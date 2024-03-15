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
        "h-[48px] w-fit px-[22px] flex gap-[22px] items-center rounded-[5px] " +
        styles
      }
    >
      <span className={textStyles + " p-1 text-xs rounded-[5px]"}>{text}</span>

      {count && <span className={countStyles}>{count}</span>}

      {plus && <TiPlus color={plusColor} />}
    </div>
  );
};

export default CountCard;
