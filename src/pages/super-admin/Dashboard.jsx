import React, { useEffect, useMemo, useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropdownCircle } from "react-icons/io";

import MetricsCard from "../../components/MetricsCard";
import { SubmissionRateAdmin } from "../../components/charts";
import CategoryRate from "../../components/charts/CategoryRate";
import OaksSlider from "../../components/Slider";
import axios from "axios";
import { Loading, YearDropDown } from "../../components/reusable";
import getCurrentYear from "../../lib/helpers";
import { FluctuationRates } from "../../components/primitives";
import { useQuery } from "@tanstack/react-query";
import {
  getAllEnumerators,
  getAllSubAdmin,
  getDistrictsCount,
  getEnumeratorCount,
  getSubmissionCount,
  getTeamLeadsCount,
} from "../../lib/service";
import { queryClient } from "../../App";
import { AddedRemovedChart } from "../../containers";
import { MetricCard } from "../../components";

const Dashboard = () => {
  const {
    data: subAdmins,
    isLoading: loadingSubAdmin,
    isSuccess: successSubAdmin,
  } = useQuery({
    queryKey: ["getAllSubAdmin"],
    queryFn: getAllSubAdmin,
  });

  const {
    data: allEnumerators,
    isLoading: loadingEnumerators,
    isSuccess: successEnumerators,
  } = useQuery({
    queryKey: ["getAllEnumerators"],
    queryFn: getAllEnumerators,
  });

  const {
    data: allTeamLeads,
    isLoading: loadingTeamLeads,
    isSuccess: successTeamLeads,
  } = useQuery({
    queryKey: ["getTeamLeadsCount"],
    queryFn: getTeamLeadsCount,
  });

  const {
    data: submissionRate,
    isLoading: srLoading,
    isSuccess: srSuccess,
  } = useQuery({
    queryKey: ["getSubmissionCount"],
    queryFn: getSubmissionCount,
  });

  const {
    data: allDistricts,
    isLoading: districtsLoading,
    isSuccess: districtsSuccess,
  } = useQuery({
    queryKey: ["getDistrictsCount"],
    queryFn: getDistrictsCount,
  });

  // component variables
  let subAdminsCount = successSubAdmin
    ? {
        newlyAdded: subAdmins.data.newlyAdded,
        totalSubAdmin: subAdmins.data.totalSubAdmin,
      }
    : null;

  let enumeratorsCount = successEnumerators
    ? {
        newlyAdded: allEnumerators.data.newlyAdded,
        totalEnumerators: allEnumerators.data.totalEnumerators,
      }
    : null;

  let teamLeadsCount = successTeamLeads
    ? {
        newlyAdded: allTeamLeads.data.newlyAdded,
        totalTeamLead: allTeamLeads.data.totalTeamLead,
      }
    : null;

  let districtsCount = districtsSuccess ? {} : null;
  let submissionsCount = srSuccess ? {} : null;

  console.log("subadmin", subAdminsCount);
  console.log("enumeratorsCount", enumeratorsCount);
  console.log("teamLeadsCount", teamLeadsCount);
  console.log("districtsCount", districtsCount);
  console.log("submissionsCount", submissionsCount);

  return (
    <div className="">
      <div className="mx-auto  mt-8 pb-4 md:w-[]">
        <div className="flex items-center justify-between gap-3 overflow-x-scroll metrics-scrollbar">
          {subAdminsCount ? (
            <MetricCard
              leadText="Sub Admin"
              leadCount={subAdminsCount.totalSubAdmin}
              subText="Newly Added"
              subCount={subAdminsCount.newlyAdded}
              legendOne="Total"
              legendTwo="Newly added"
            />
          ) : (
            <div className="h-32 grid place-items-center w-1/3 p-2 drop-shadow-sm bg-white">
              <Loading />
            </div>
          )}

          {submissionRate ? (
            <MetricCard
              leadText="Team Leads"
              leadCount={teamLeadsCount.totalTeamLead}
              subText="Newly Added"
              subCount={teamLeadsCount.newlyAdded}
              legendOne="Total"
              legendTwo="Newly added"
            />
          ) : (
            <div className="h-32 grid place-items-center w-1/3 p-2 drop-shadow-sm bg-white">
              <Loading />
            </div>
          )}

          {enumeratorsCount ? (
            <MetricCard
              leadText="Enumerators"
              leadCount={enumeratorsCount.totalEnumerators}
              subText="Newly Added"
              subCount={enumeratorsCount.newlyAdded}
              legendOne="Total"
              legendTwo="Newly added"
            />
          ) : (
            <div className="h-32 grid place-items-center w-1/3 p-2 drop-shadow-sm bg-white">
              <Loading />
            </div>
          )}
        </div>

        <AddedRemovedChart />
      </div>

      {/* <FluctuationRates admin /> */}
    </div>
  );
};

export default Dashboard;
