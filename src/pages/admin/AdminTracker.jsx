import React, { useEffect, useState } from "react";
import { Loading } from "../../components/reusable";
import { parseDate } from "../../lib/helpers";
import { GeneralTable } from "../../components/charts";
import { useQuery } from "@tanstack/react-query";
import {
  getAdminResponseTracker,
  getAdminSubmissionTime,
  getResponseTracker,
  getTeamLeadSubmissionRate,
} from "../../lib/service";
import NewMeshedLineChart from "../../components/charts/NewMeshedLineChart";
import {
  formatChartDate,
  tooltipConfig,
  transformAdminSubmissionTime,
} from "../../lib/utils";
import { userNonEditableFields } from "../../lib/actions";

const AdminTracker = () => {
  const [timeOfSub, setTimeOfSub] = useState(null);
  const [allTeamLeads, setAllTeamLeads] = useState(null);

  // Query
  const {
    data: rtData,
    isLoading: rtDataLoading,
    isSuccess: rtSuccess,
  } = useQuery({
    queryKey: ["getAdminResponseTracker"],
    queryFn: getAdminResponseTracker,
  });

  const {
    data: stData,
    isLoading: stLoading,
    isSuccess: stSuccess,
  } = useQuery({
    queryKey: ["getAdminSubmissionTime"],
    queryFn: getAdminSubmissionTime,
  });

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

  return (
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-6">
      <div className="flex items-center flex-wrap gap-3">
        <div className="rounded bg-primary p-3 flex items-center justify-between  xs:flex-1 md:flex-initial gap-6 xs:gap-16 shrink-0 text-xs">
          <p className="text-white">Submitted</p>
          <p className="rounded p-1 text-primary bg-white">{submitted}</p>
        </div>

        <div className="flex p-3 lg:ml-8 items-center gap-6 w-fit rounded bg-white">
          <p className="">No response</p>
          <p className="text-primary p-1 bg-gray-200 rounded text-sm">
            {noResponse}
          </p>
        </div>
      </div>

      {/* table */}
      <div className="bg-white  w-full">
        {rtDataLoading ? (
          <div className="h-32">
            <Loading />
          </div>
        ) : (
          <GeneralTable
            title={"Response Tracker"}
            height={350}
            pageSize={30}
            nonEditableFields={[
              ...userNonEditableFields,
              "first_name",
              "last_name",
              "status",
            ]}
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

export default AdminTracker;
