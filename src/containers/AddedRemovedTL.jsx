import React, { useEffect, useState } from "react";
import { YearDropDown } from "../components/reusable";
import getCurrentYear from "../lib/helpers";
import { SubmissionRate } from "../components/charts";
import { useQuery } from "@tanstack/react-query";
import { getYearlyEnumerators } from "../lib/service";

const AddedRemovedChartTL = () => {
  const [yearDropdown, setYearDropdown] = useState("");

  const {
    data: enumeratorsChartCount,
    isLoading: eccLoading,
    isSuccess: eccSuccess,
    refetch,
  } = useQuery({
    queryKey: ["getYearlyEnumerators"],
    queryFn: () => getYearlyEnumerators(yearDropdown),
  });

  useEffect(() => {
    refetch();
  }, [yearDropdown]);

  const handleSelectOption = (year) => {
    setYearDropdown(year);
  };

  //   component variables
  let ecCount = eccSuccess ? enumeratorsChartCount.data.data : null;

  console.log("ecCount", ecCount);

  return (
    <div className="bg-white drop-shadow-sm p-3 mt-6 text-sm rounded-sm w-full lg:px-16">
      <div className="flex items-start">
        <div className="flex-1">
          <p className="flex-1 text-[#00BCD4]">Enumerators </p>
          <p className="flex-1 text-xs">Added vs Removed </p>
        </div>

        <div className="flex flex-col px-5">
          <div className="flex items-center">
            <div className="h-2 w-2 bg-yellow-500 mr-1" /> <span>Added</span>
          </div>
          <div className="flex items-center">
            <div className="h-2 w-2 bg-red-500 mr-1" /> <span>Removed</span>
          </div>
        </div>

        <YearDropDown
          startYear={2019}
          endYear={getCurrentYear()}
          selectedYear={yearDropdown}
          onChange={(selectedValue) => handleSelectOption(selectedValue)}
        />
      </div>

      {/* charts */}
      {/* make reusable */}
      <SubmissionRate data={ecCount ?? ecCount} />
    </div>
  );
};

export default AddedRemovedChartTL;
