import React, { useEffect, useState } from "react";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import EnumeratorGrid from "../../components/grid/EnumeratorGrid";
import { Loading, NoData } from "../../components/reusable";
import { useQuery } from "@tanstack/react-query";
import { getAllEnumerators } from "../../lib/service";

const Enumerators = () => {
  const [tableData, setTableData] = useState(null);
  const navigate = useNavigate();

  const {
    data: enumerators,
    isLoading: enumLoading,
    isSuccess: enumSuccess,
  } = useQuery({
    queryKey: ["getAllEnumerators"],
    queryFn: getAllEnumerators,
  });

  // component variables
  let enumData = enumSuccess ? enumerators.data.users : null;

  let enumCount = enumSuccess
    ? {
        totalEnumerators: enumerators.data.totalEnumerators,
        newlyAdded: enumerators.data.newlyAdded,
      }
    : null;

  return (
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-6">
      <div className="flex items-center flex-wrap gap-2 xs:text-[10px]">
        <div className="rounded bg-primary p-3 flex items-center gap-2 text-xs">
          <p className="text-white">Total Enumerators</p>
          <p className="rounded p-1 text-primary bg-white">
            {enumCount?.totalEnumerators}
          </p>
        </div>

        <div className="flex p-3 md:ml-8 items-center gap-6 w-fit rounded bg-white">
          <p className="">Recently Added</p>
          <p className="text-primary p-1 bg-gray-200 rounded text-sm">
            {enumCount?.newlyAdded}
          </p>
        </div>

        <div
          // onClick={() => navigate("/add", { state: tableData })}
          className="rounded bg-white border border-primary text-primary flex items-center p-3 gap-12 sm:ml-auto cursor-pointer sm:flex-initial xs:flex-1 xs:justify-between"
        >
          <p>Add new</p>
          <span>+</span>
        </div>
      </div>

      {/* table */}
      <div className="bg-white  w-full text-xs">
        {enumLoading ? (
          <Loading />
        ) : enumData ? (
          <EnumeratorGrid data={enumData} />
        ) : (
          <div className="h-32">
            <NoData text="You have no enumerators yet" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Enumerators;
