import React, { useEffect, useState } from "react";
import axios from "axios";

import { TeamLeadGrid } from "../../components/grid";
import { Link } from "react-router-dom";
import { Loading, NoData } from "../../components/reusable";
import { useQuery } from "@tanstack/react-query";
import { getTeamLeadsByCountry } from "../../lib/service";
import { useAuth } from "../../context";
import { transformTeamLedsGridData } from "../../lib/utils";
import { GeneralTable } from "../../components/charts";

const TeamLeads = () => {
  const [tableData, setTableData] = useState(null);
  const { user } = useAuth();

  const {
    data: teamLeads,
    isLoading: tlLoading,
    isSuccess: tlSuccess,
  } = useQuery({
    queryKey: ["getTeamLeadsByCountry"],
    queryFn: () => getTeamLeadsByCountry(user.country),
  });

  // component varaibles
  let tlGridData = tlSuccess
    ? transformTeamLedsGridData(teamLeads?.data.users)
    : [];

  let tlCount = tlSuccess && {
    totalTeamLead: teamLeads?.data.totalTeamLead,
    newlyAdded: teamLeads?.data.newlyAdded,
  };

  console.log("team leads data", tlGridData);

  return (
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-6">
      <div className="flex items-center flex-wrap gap-2 xs:text-[10px]">
        <div className="rounded bg-oaksyellow p-3 flex items-center gap-2 text-xs">
          <p className="text-white">Total Team Leads</p>
          <p className="rounded p-1 text-oaksyellow bg-white ">
            {tlCount?.totalTeamLead}
          </p>
        </div>

        <div className="flex p-3 md:ml-8 items-center gap-6 w-fit rounded bg-white border border-oaksyellow">
          <p className="">Recently Added</p>
          <p className="text-oaksyellow p-1 bg-gray-200 rounded text-sm">
            {tlCount?.newlyAdded}
          </p>
        </div>

        <Link
          to="/admin/add"
          onClick={() => {}}
          className="rounded bg-white border border-oaksgreen text-oaksgreen flex items-center p-3 lg:gap-10 sm:ml-auto cursor-pointer sm:flex-initial xs:flex-1 xs:justify-between"
        >
          <p>Add new</p>
          <span>+</span>
        </Link>

        <Link
          to="/admin/new-lga"
          onClick={() => {}}
          className="rounded bg-white border border-oaksgreen text-oaksgreen flex items-center p-3 lg:gap-12 sm:ml-auto cursor-pointer sm:flex-initial xs:flex-1 xs:justify-between"
        >
          <p>Enroll new Lga</p>
          <span>+</span>
        </Link>
      </div>

      {/* table */}
      <div className="bg-white  w-full text-xs">
        {tlLoading ? (
          <Loading />
        ) : tlSuccess && tlGridData.length ? (
          <GeneralTable data={tlGridData} actions={[]} />
        ) : (
          <NoData text="No team leads yet" />
        )}
      </div>
    </div>
  );
};

export default TeamLeads;
