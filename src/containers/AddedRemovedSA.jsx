import React, { useEffect, useState } from "react";
import { YearDropDown } from "../components/reusable";
import getCurrentYear from "../lib/helpers";
import { SubmissionRateAdmin } from "../components/charts";
import { queryClient } from "../App";
import { useQuery } from "@tanstack/react-query";
import { getEnumeratorCount } from "../lib/service";

const AddedRemovedChartSA = () => {
  const [yearDropdown, setYearDropdown] = useState();
  const [countryId, setCountryId] = useState("65e344bff0eab8c4f2552abe"); //default NG

  const {
    data: enumeratorsChartCount,
    isLoading: eccLoading,
    isSuccess: eccSuccess,
  } = useQuery({
    queryKey: ["getEnumeratorCount"],
    queryFn: () => getEnumeratorCount(yearDropdown),
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["getEnumeratorCount"] });
  }, [yearDropdown]);

  const handleSelectOption = (year) => {
    console.log(year);
    setYearDropdown(year);
  };

  //   component variables
  let ecCount = eccSuccess ? enumeratorsChartCount.data.data : null;

  //   console.log("ecCount", ecCount);

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
      <SubmissionRateAdmin data={ecCount ?? ecCount} />
    </div>
  );
};

export default AddedRemovedChartSA;
