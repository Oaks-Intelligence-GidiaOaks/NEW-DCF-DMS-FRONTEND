import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router-dom";
import { BackButton, CountCard, NoData } from "../../components/reusable";
import { useNavigate } from "react-router-dom";
import EnumeratorGrid from "../../components/grid/EnumeratorGrid";
import { IoIosArrowBack } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import { getIndividualUser, getTeamLeadEnumerators } from "../../lib/service";
import { transformEnumeratorsGridData } from "../../lib/utils";
import { GeneralTable } from "../../components/charts";

const AdminEnumerators = () => {
  const navigate = useNavigate();
  const { teamLeadId } = useParams();

  const {
    data: enumerators,
    isLoading: enumLoading,
    isSuccess: enumSuccess,
  } = useQuery({
    queryKey: ["getTeamLeadEnumerators"],
    queryFn: () => getTeamLeadEnumerators(teamLeadId),
  });

  const {
    data: teamLead,
    isLoading: tlLoading,
    isSuccess: tlSuccess,
  } = useQuery({
    queryKey: ["getIndividualUser"],
    queryFn: () => getIndividualUser(teamLeadId),
  });

  console.log(teamLead, "team lead");

  // component variables
  let enumData = enumSuccess
    ? transformEnumeratorsGridData(enumerators.data.users)
    : null;

  let enumCount = enumSuccess
    ? {
        totalEnumerators: enumerators.data.totalEnumerators,
        newlyAdded: enumerators.data.newlyAdded,
      }
    : null;

  return (
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-6">
      <div className="flex items-center flex-wrap gap-2 xs:text-[10px]">
        <div className="rounded p-3 flex items-center gap-2 text-xs">
          <p className="text-sm font-semibold">
            {`${teamLead?.data.data.first_name} ${teamLead?.data.data.last_name} - Team Lead`}
          </p>
        </div>

        <CountCard
          text="Total Enumerators"
          styles=""
          count={enumCount?.totalEnumerators}
          countStyles={0}
        />

        <Link className="" to={`/admin/team_leads`}>
          <BackButton />
        </Link>

        <CountCard
          styles="border border-primary"
          plus
          plusColor=""
          text="About"
        />
      </div>

      {/* table */}
      <div className="bg-white  w-full text-xs">
        <div className="p-2 font-semibold text-base tracking-tighter">
          Users - Enumerators
        </div>

        <GeneralTable
          data={enumData}
          actions={[]}
          title="Users - Enumerators"
        />
      </div>
    </div>
  );
};

export default AdminEnumerators;
