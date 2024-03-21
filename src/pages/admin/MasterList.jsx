import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

import MasterGrid from "../../components/grid/MasterGrid";
import axios from "axios";

import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { BiDownload } from "react-icons/bi";
import { arrangeTime } from "../../lib/helpers";
import { useAuth } from "../../context";
import { getMasterDataByCountry } from "../../lib/service";
import { useQuery } from "@tanstack/react-query";
import { transformMasterGridData } from "../../lib/utils";
import { GeneralTable } from "../../components/charts";

const MasterList = () => {
  const { user } = useAuth();

  const [startDateValue, setStartDateValue] = useState("");
  let [pageNo, setPageNo] = useState(1);
  const [endDateValue, setEndDateValue] = useState("");

  const {
    data: masterData,
    isLoading: masterLoading,
    isSuccess: masterSuccess,
    refetch,
  } = useQuery({
    queryKey: ["getMasterDataByCountry"],
    queryFn: () =>
      getMasterDataByCountry(
        user.country,
        startDateValue,
        endDateValue,
        pageNo
      ),
  });

  useEffect(() => {
    refetch();
  }, [endDateValue, pageNo]);

  // component variables
  const minDate = new Date(new Date().getFullYear(), new Date().getMonth(), 7);

  const maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), 27);

  let mGridData = masterSuccess
    ? transformMasterGridData(masterData.data.data)
    : null;

  let totalDataCount = mGridData?.length;

  console.log(totalDataCount, "totalDataCount");
  console.log("mGridData", mGridData);

  let paginationItems =
    totalDataCount &&
    mGridData &&
    Math.floor(totalDataCount / mGridData.length);

  let PageNumbers = ({ totalPages, currentPage, onPageChange }) => {
    let numArr = [];

    for (let i = 0; i < paginationItems; i++) {
      numArr.push(i + 1);
    }

    return (
      <div className="flex flex-wrap space-x-2">
        {numArr.length > 0 &&
          numArr.map((singleNo) => (
            <button
              className={`grid place-items-center my-1 text-xs text-gray-800 h-5 w-5  rounded-full ${
                singleNo === pageNo ? "bg-oaksgreen text-white" : "bg-gray-200"
              } `}
              key={singleNo}
              onClick={() => setPageNo(singleNo)}
            >
              <span>{singleNo}</span>
            </button>
          ))}
      </div>
    );
  };

  const handleStartDateChange = (args) => {
    let formatDate = new Date(args.value).toISOString().split("T")[0];

    setStartDateValue(`${formatDate}`);
  };

  const handleEndDateChange = (args) => {
    let formatDate = new Date(args.value).toISOString().split("T")[0];

    setEndDateValue(`${formatDate}`);
  };

  // const handlePageNumberChange = (no) => {
  //   setPageNo(no);
  // };

  return (
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-3">
      <div className="flex flex-col space-y-6 lg:flex-row  items-end justify-between">
        <div className="flex items-center justify-around mr-auto">
          <div className="w-32">
            <p className="mb-2 text-center">From</p>
            <div className="border px-2 rounded">
              <DatePickerComponent
                cssClass="custom-datepicker"
                id="datepicker"
                change={handleStartDateChange}
              />
            </div>
          </div>

          <div className="border border-gray-900 mx-3 w-6 my-auto" />

          <div className="w-32">
            <p className="mb-2 text-center">To</p>
            <div className="border px-2 rounded">
              <DatePickerComponent
                change={handleEndDateChange}
                id="datepicker"
                // value={endDateValue}
              />
            </div>
          </div>
        </div>
      </div>

      {/* table */}
      <div className="bg-white h-80 w-full text-[6px]">
        <GeneralTable pageSize={115} data={mGridData} />

        <div className="p-2 border ">
          <div className="ml-auto flex items-center">{<PageNumbers />}</div>
        </div>
      </div>
    </div>
  );
};

export default MasterList;
