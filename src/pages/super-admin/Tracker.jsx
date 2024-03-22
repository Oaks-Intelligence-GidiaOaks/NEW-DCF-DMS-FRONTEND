import React, { useEffect, useState } from "react";

import { CountCard, Loading } from "../../components/reusable";
import { GeneralTable } from "../../components/charts";
import { useQuery } from "@tanstack/react-query";
import {
  getAdminResponseTracker,
  getAdminSubmissionTime,
  getAllCountries,
} from "../../lib/service";
import NewMeshedLineChart from "../../components/charts/NewMeshedLineChart";
import {
  formatChartDate,
  tooltipConfig,
  transformAdminSubmissionTime,
  transformCountryFormData,
} from "../../lib/utils";
import { FormInputDropDown } from "../../components/form";

const Tracker = () => {
  const [countryId, setCountryId] = useState("65e344bff0eab8c4f2552abe");

  const { data: countries, isSuccess: cSuccess } = useQuery({
    queryKey: ["getAllCountries"],
    queryFn: getAllCountries,
  });

  // Query
  const {
    data: rtData,
    isLoading: rtDataLoading,
    isSuccess: rtSuccess,
    refetch: artRefetch,
  } = useQuery({
    queryKey: ["getAdminResponseTracker"],
    queryFn: getAdminResponseTracker,
  });

  const {
    data: stData,
    isLoading: stLoading,
    isSuccess: stSuccess,
    refetch: astRefetch,
  } = useQuery({
    queryKey: ["getAdminSubmissionTime"],
    queryFn: getAdminSubmissionTime,
  });

  useEffect(() => {
    artRefetch();
    astRefetch();
  }, [countryId, artRefetch, astRefetch]);

  // component variables
  let countriesData = cSuccess
    ? transformCountryFormData(countries.data.data)
    : [];

  let transChartTime = stSuccess
    ? transformAdminSubmissionTime(stData.data.data)
    : [];

  let submitted =
    rtSuccess &&
    rtData?.data?.data.filter((item) => item.status === true).length;

  let noResponse =
    rtSuccess &&
    rtData?.data?.data.filter((item) => item.status === false).length;

  const xScale = { type: "point" };
  const yScale = { type: "time" };

  const handleCountryChange = (e) => {
    setCountryId(e);
  };

  return (
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-6">
      <div className="flex items-center flex-wrap gap-3">
        <CountCard
          count={submitted}
          countStyles=" bg-white text-primary"
          text="Submitted"
          styles=" bg-primary"
          textStyles=" text-white"
        />

        <CountCard
          count={noResponse}
          countStyles=" bg-primary text-white"
          text="No response"
          styles=" bg-white"
          textStyles=" "
        />
      </div>

      <div className=" w-[230px]">
        <FormInputDropDown
          index="z-[99]"
          onChange={handleCountryChange}
          label="Select country"
          data={countriesData}
        />
      </div>

      {/* table */}
      <div className="bg-white  w-full">
        {rtDataLoading ? (
          <div className="h-32">
            <Loading />
          </div>
        ) : (
          <GeneralTable
            title="Response Tracker"
            height={200}
            data={rtData?.data.data}
          />
        )}
      </div>

      {/* chart */}
      <div className="p-3 flex flex-col lg:flex-row overflow-x-scroll gap-3 rounded-xl drop-shadow-lg ">
        <div className="h-[350px] w-full bg-white rounded drop-shadow-lg p-2">
          {transChartTime && (
            <NewMeshedLineChart
              xScale={xScale}
              yScale={yScale}
              formatDate={formatChartDate}
              tooltipConfig={tooltipConfig}
              xLabel={"submission week"}
              yLabel={"submission time"}
              data={transChartTime}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Tracker;
