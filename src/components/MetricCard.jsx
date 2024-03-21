import React from "react";
import Curve from "/Curve.svg";
import Pie from "./charts/Pie";

const MetricCard = ({
  leadText,
  leadCount,
  subText,
  subCount,
  legendOne,
  legendTwo,
}) => {
  const chartData = [
    { id: leadText, value: leadCount },
    { id: subText, value: subCount },
  ];

  return (
    <div className="rounded-md w-fit shrink-0 relative bg-white px-3 py-3 text-sm drop-shadow-sm flex">
      <div className="pr-6">
        <p className="font-bold flex gap-1">
          <span>{leadText}:</span>
          <span>{leadCount}</span>
        </p>

        <p className="text-xs space-x-1">
          <span>{subText}:</span>
          <span>{subCount}</span>
        </p>
      </div>

      <div className="text-xs">
        {/* chart */}
        <div className="h-[70px] w-[70px] ml-auto">
          <Pie iR={0} data={chartData} />
        </div>

        <div className="">
          <div className="flex items-center sdivace-x-1">
            <div className="h-2 w-2 bg-yellow-500 mr-1" />
            <span>{legendOne}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 bg-orange-500 mr-1" />
            <span>{legendTwo}</span>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0">
        <img src={Curve} alt="" />
      </div>
    </div>
  );
};

export default MetricCard;
