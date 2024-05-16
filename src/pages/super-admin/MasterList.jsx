import React, { useEffect, useState } from "react";

import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { arrangeTime } from "../../lib/helpers";
import { useQuery } from "@tanstack/react-query";
import { getAllCountries, getMasterDataByCountry } from "../../lib/service";
import {
  transformCountryFormData,
  transformMasterGridData,
} from "../../lib/utils";
import { FormInputDropDown } from "../../components/form";
import { GeneralTable } from "../../components/charts";
import { Loading } from "../../components/reusable";

const MasterList = () => {
  const [countryId, setCountryId] = useState("65e344bff0eab8c4f2552abe");

  const [masterList, setMasterList] = useState(null);
  const [startDateValue, setStartDateValue] = useState("");
  const [endDateValue, setEndDateValue] = useState("");
  let [totalDataCount, setTotalDataCount] = useState(null);
  let [pageNo, setPageNo] = useState(1);

  const minDate = new Date(new Date().getFullYear(), new Date().getMonth(), 7);
  const maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), 27);

  const { data: countries, isSuccess: cSuccess } = useQuery({
    queryKey: ["getAllCountries"],
    queryFn: getAllCountries,
  });

  const {
    data: masterData,
    isLoading: masterLoading,
    isSuccess: masterSuccess,
  } = useQuery({
    queryKey: ["getMasterDataByCountry"],
    queryFn: () => getMasterDataByCountry(countryId),
  });

  // component variables
  let countriesData = cSuccess
    ? transformCountryFormData(countries.data.data)
    : [];

  const tData = masterSuccess
    ? transformMasterGridData(masterData.data.data)
    : [];

  console.log("Transformed Master Data", tData);

  let paginationItems =
    totalDataCount &&
    masterList &&
    Math.floor(totalDataCount / masterList.length);

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

  const handlePageNumberChange = (no) => {
    setPageNo(no);
  };

  const handleCountryChange = (e) => {
    console.log("country value", e);
    setCountryId(e);
  };

  return (
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-3">
      <div className="flex flex-col space-y-6 lg:flex-row  items-end justify-between">
        <div className="flex items-center justify-between w-full ">
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

          <div className="w-[230px] ml-auto">
            <FormInputDropDown
              index="z-[99]"
              onChange={handleCountryChange}
              label="Select country"
              data={countriesData}
            />
          </div>
        </div>
      </div>

      {/* table */}
      <div className="bg-white h-80 w-full text-[6px]">
        {!masterLoading ? (
          <GeneralTable
            title={"Master List"}
            pageSize={20}
            data={tData}
            height={360}
          />
        ) : (
          <Loading />
          // <div className="text-3xl font-semibold">Loading data!!!</div>
        )}
        {/* <GeneralTable title="Master List" data={tData} /> */}

        {/* <div className="p-2 border ">
          <div className="ml-auto flex items-center">{<PageNumbers />}</div>
        </div> */}
      </div>
    </div>
  );
};

export default MasterList;
