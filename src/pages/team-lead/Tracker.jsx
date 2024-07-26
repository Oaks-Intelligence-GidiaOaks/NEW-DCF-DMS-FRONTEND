import React, { useEffect, useState } from "react";

import MeshedLineChart from "../../components/charts/MeshedLineChart";
import CategoryTab from "../../components/CategoryTab";
import { MeshedLineChartData } from "../../data/charts";

import { Download } from "@mui/icons-material";
import { useAuth } from "../../context";
import { Loading } from "../../components/reusable";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  approveFormResponse,
  getResponseTracker,
  getSubmissionTime,
} from "../../lib/service";
import { GeneralTable } from "../../components/charts";
import NewMeshedLineChart from "../../components/charts/NewMeshedLineChart";
import {
  formatChartDate,
  tooltipConfig,
  transformAdminSubmissionTime,
} from "../../lib/utils";

const Tracker = () => {
  // mutation
  const { mutate, isPending: mtLoading } = useMutation({
    mutationKey: ["approveFormResponse"],
    mutationFn: (dt) => approveFormResponse(dt),
    onSuccess: (sx) => {
      setShowModal(false);
      toast.success(sx.data.message);
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

  // query
  const {
    data: rtData,
    isLoading: rtDataLoading,
    isSuccess: rtSuccess,
  } = useQuery({
    queryKey: ["getResponseTracker"],
    queryFn: getResponseTracker,
  });

  const {
    data: stData,
    isLoading: stLoading,
    isSuccess: stSuccess,
  } = useQuery({
    queryKey: ["getSubmissionTime"],
    queryFn: getSubmissionTime,
  });

  // component variables
  let trackerData = rtSuccess
    ? {
        enumerators: rtData.data.data,
        totalEnumerators: rtData.data.totalEnumerators,
        totalSubmission: rtData.data.totalSubmission,
      }
    : null;

  let submissionTimeData = stSuccess ? {} : null;

  console.log("sub time", stData?.data);

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let submitted = trackerData && trackerData.totalSubmision;

  let noResponse =
    trackerData && trackerData.totalEnumerators - trackerData.totalSubmision;

  let transChartTime = stSuccess
    ? transformAdminSubmissionTime(stData.data.data)
    : [];

  const handleSubmit = async () => {
    let data = trackerData.enumerators;

    const formattedData = data
      .filter((value) => value.form_id)
      .map((val) => val.form_id);

    console.log("formattedData", formattedData);

    await mutate({ ids: formattedData });
  };

  const xScale = { type: "point" };
  const yScale = { type: "time" };

  return (
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-6 relative">
      <div className="flex items-center flex-wrap gap-3">
        <div className="rounded bg-primary p-3 flex items-center justify-between  xs:flex-1 md:flex-initial gap-6 xs:gap-16 shrink-0 text-xs">
          <p className="text-white">Submitted</p>
          <p className="rounded p-1 text-primary bg-white">
            {trackerData?.totalSubmission}
          </p>
        </div>

        <div className="flex p-3 lg:ml-8 items-center gap-6 w-fit rounded bg-white">
          <p className="">No response</p>
          <p className="text-primary p-1 bg-gray-200 rounded text-sm">
            {trackerData?.totalEnumerators - trackerData?.totalSubmission}
          </p>
        </div>
      </div>

      <div
        className="w-fit text-white font-semibold bg-oaksgreen rounded shadow-md"
        onClick={() => setShowModal(true)}
      >
        <CategoryTab text="Submit" Icon={Download} />
      </div>

      {/* submit modal */}
      {showModal && (
        <div className="absolute h-screen w-full  backdrop-blur-sm bg-[rgba(0,0,0,0.15)] grid place-items-center z-40">
          {isLoading ? (
            <div>
              <ClipLoader color="#00BCD4" />
            </div>
          ) : (
            <div className="lg:w-1/3 bg-white mx-auto p-4 px-6 space-y-8 text-base rounded">
              <p>Are you sure you want to submit your weekly data?</p>

              <div className="flex gap-3 items-center justify-between  text-white">
                <div
                  onClick={handleSubmit}
                  className="rounded p-2 cursor-pointer text-center bg-blue-500 flex items-center px-5"
                >
                  <span>Submit</span>
                </div>

                <div
                  onClick={() => setShowModal(false)}
                  className="rounded cursor-pointer p-2 text-center flex items-center bg-green-500 px-5"
                >
                  <span>Cancel</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* table */}
      <div className="bg-white  w-full">
        {!trackerData ? (
          <Loading />
        ) : (
          <GeneralTable
            height={200}
            title="Response Tracker"
            data={trackerData?.enumerators}
            pageSize={50}
          />
        )}
      </div>

      {/* chart */}
      <div className="p-3 flex flex-col lg:flex-row lg:overflow-x-auto gap-3 rounded-xl drop-shadow-lg ">
        {/* {firstChart && ( */}
        <div className="h-[350px] w-full bg-white rounded drop-shadow-lg">
          <NewMeshedLineChart
            xScale={xScale}
            yScale={yScale}
            formatDate={formatChartDate}
            tooltipConfig={tooltipConfig}
            xLabel={"submission week"}
            yLabel={"submission time"}
            data={transChartTime}
          />
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default Tracker;
