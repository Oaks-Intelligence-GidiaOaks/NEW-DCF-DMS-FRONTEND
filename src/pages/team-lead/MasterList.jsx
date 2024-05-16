import React, { useEffect, useState } from "react";

import { arrangeTime } from "../../lib/helpers";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { useQuery } from "@tanstack/react-query";
import { getMasterDataByCountry } from "../../lib/service";
import { transformMasterGridData } from "../../lib/utils";
import { GeneralTable } from "../../components/charts";
import { useAuth } from "../../context";
import { Loading } from "../../components/reusable";

const MasterList = () => {
  const { user } = useAuth();

  const [countryId, setCountryId] = useState(user.country);

  const [startDateValue, setStartDateValue] = useState("");
  const [endDateValue, setEndDateValue] = useState("");
  let [pageNo, setPageNo] = useState(1);

  const minDate = new Date(new Date().getFullYear(), new Date().getMonth(), 7);

  const maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), 27);

  const {
    data: masterData,
    isLoading: masterLoading,
    isSuccess: masterSuccess,
    refetch,
  } = useQuery({
    queryKey: ["getMasterDataByCountry"],
    queryFn: () =>
      getMasterDataByCountry(countryId, startDateValue, endDateValue, pageNo),
  });

  useEffect(() => {
    refetch();
  }, [endDateValue, pageNo]);

  // component variables
  let mGridData = masterSuccess
    ? transformMasterGridData(masterData.data.data)
    : null;

  // console.log("master data", mGridData);

  // let paginationItems =
  //   totalDataCount &&
  //   masterList &&
  //   Math.floor(totalDataCount / masterList.length);

  // let PageNumbers = ({ totalPages, currentPage, onPageChange }) => {
  //   let numArr = [];

  //   for (let i = 0; i < paginationItems; i++) {
  //     numArr.push(i + 1);
  //   }

  //   return (
  //     <div className="flex flex-wrap space-x-2">
  //       {numArr.length > 0 &&
  //         numArr.map((singleNo) => (
  //           <button
  //             className={`grid place-items-center my-1 text-xs text-gray-800 h-5 w-5  rounded-full ${
  //               singleNo === pageNo ? "bg-oaksgreen text-white" : "bg-gray-200"
  //             } `}
  //             key={singleNo}
  //             onClick={() => setPageNo(singleNo)}
  //           >
  //             <span>{singleNo}</span>
  //           </button>
  //         ))}
  //     </div>
  //   );
  // };

  const handleStartDateChange = (args) => {
    let formatDate = new Date(args.value).toISOString().split("T")[0];

    setStartDateValue(`${formatDate}`);
  };

  const handleEndDateChange = (args) => {
    let formatDate = new Date(args.value).toISOString().split("T")[0];

    setEndDateValue(`${formatDate}`);
  };

  const handlePageNumberChange = (no) => {
    setPageNo(no);
  };
  // styles
  const activeStyle = "bg-oaksgreen text-white";
  const nonActiveStyle = "bg-white";

  return (
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-6">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="rounded justify-between bg-oaksyellow p-3 flex xs:flex-1 md:flex-initial items-center gap-4 text-xs">
          <p className="text-white whitespace-nowrap">Master List</p>
        </div>
      </div>

      <div className="flex  items-center justify-end mr-auto ">
        <div className="md:w-32 xs:w-full">
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

        <div className="md:w-32 xs:w-full">
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

      {/* table */}
      <div className="bg-white h-80 w-full text-[6px]">
        {mGridData ? (
          <GeneralTable
            title={"Master List"}
            pageSize={20}
            data={mGridData}
            height={360}
          />
        ) : (
          <Loading />
          // <div className="text-3xl font-semibold">Loading data!!!</div>
        )}
        {/* <div className="p-2 border ">
          <div className="ml-auto flex items-center">
            {<PageNumbers />}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default MasterList;
