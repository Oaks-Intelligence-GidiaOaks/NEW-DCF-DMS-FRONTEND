import React, { useEffect, useState } from "react";
import { Loading } from "../../components/reusable";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { useQuery } from "@tanstack/react-query";
import { getAllLog } from "../../lib/service";
import { GeneralTable } from "../../components/charts";
import { transformLogsGridData } from "../../lib/utils";

const History = () => {
  const [startDateValue, setStartDateValue] = useState("");
  const [endDateValue, setEndDateValue] = useState("");
  let [pageNo, setPageNo] = useState(1);

  const {
    data: logs,
    isLoading: logLoading,
    isSuccess: logSuccess,
    refetch,
  } = useQuery({
    queryKey: ["getAllLog"],
    queryFn: getAllLog,
  });

  useEffect(() => {
    refetch();
  }, [endDateValue, pageNo]);

  // component variables
  const logsData = logSuccess ? transformLogsGridData(logs.data.data) : [];

  let [totalDataCount, setTotalDataCount] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const minDate = new Date(new Date().getFullYear(), new Date().getMonth(), 7);
  const maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), 27);

  const itemsPerPage = 10;

  const paginationItems = totalPages;
  const PageNumbers = ({ currentPage, onPageChange }) => {
    const numArr = Array.from({ length: paginationItems }, (_, i) => i + 1);

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

  const handlePageNumberChange = (no) => {
    setPageNo(no);
  };

  const activeStyle = "bg-oaksgreen text-white";
  const nonActiveStyle = "bg-white";

  return (
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-6">
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
        <GeneralTable
          title="Audit Logs"
          data={logsData}
          height={260}
          pageSize={120}
        />

        <div className="py-2 px-4 border ">
          <div className="ml-auto flex items-center">{<PageNumbers />}</div>
        </div>
      </div>
    </div>
  );
};

export default History;
