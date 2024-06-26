import React, { useEffect, useMemo, useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropdownCircle } from "react-icons/io";

import MetricsCard from "../../components/MetricsCard";
import { SubmissionRateAdmin } from "../../components/charts";
import CategoryRate from "../../components/charts/CategoryRate";
import { Loading, YearDropDown } from "../../components/reusable";
import getCurrentYear from "../../lib/helpers";

import { useQuery } from "@tanstack/react-query";
import {
  getAllEnumerators,
  getDistrictsCount,
  getEnumeratorCount,
  getSubmissionCount,
  getTeamLeadSubmissionRate,
  getTeamLeadsCount,
} from "../../lib/service";
import { MetricCard } from "../../components";
import AddedRemovedChartTL from "../../containers/AddedRemovedTL";
import AddedRemovedChartSA from "../../containers/AddedRemovedSA";

const Dashboard = () => {
  const {
    data: srRate,
    isLoading: srLoading,
    isSuccess: srSuccess,
  } = useQuery({
    queryKey: ["getTeamLeadSubmissionRate"],
    queryFn: getTeamLeadSubmissionRate,
  });

  const {
    data: allDistricts,
    isLoading: districtsLoading,
    isSuccess: districtsSuccess,
  } = useQuery({
    queryKey: ["getDistrictsCount"],
    queryFn: getDistrictsCount,
  });

  const {
    data: tls,
    isLoading: tlsLoading,
    isSuccess: tlsSuccess,
  } = useQuery({
    queryKey: ["getTeamLeadsCount"],
    queryFn: getTeamLeadsCount,
  });

  // component variables
  let tlsCount = tlsSuccess
    ? {
        newlyAdded: tls.data.newlyAdded,
        totalEnumerators: tls.data.totalTeamLead,
      }
    : null;

  let districtsCount = districtsSuccess
    ? {
        totalDistrict: allDistricts.data.totalDistrict,
        assignedDistrict: allDistricts.data.assignedDistrict,
      }
    : null;

  let srCount = srSuccess
    ? {
        submited: srRate.data.submited,
        notSubmited: srRate.data.notSubmited,
      }
    : null;

  return (
    <div className="">
      <div className="mx-auto  mt-8 pb-4 md:w-[]">
        <div className="flex items-center justify-between gap-3 overflow-x-scroll metrics-scrollbar">
          {tlsCount ? (
            <MetricCard
              leadText="Team Leads"
              leadCount={tlsCount.totalEnumerators}
              subText="Newly Added"
              subCount={tlsCount.newlyAdded}
              legendOne="Total"
              legendTwo="Newly added"
            />
          ) : (
            <div className="h-32 grid place-items-center w-1/3 p-2 drop-shadow-sm bg-white">
              <Loading />
            </div>
          )}

          {srCount ? (
            <MetricCard
              leadText="Submission rate"
              leadCount={srCount.submited}
              subText="Not Submitted"
              subCount={srCount.notSubmited}
              legendOne="Submission"
              legendTwo="Not Submitted"
            />
          ) : (
            <div className="h-32 grid place-items-center w-1/3 p-2 drop-shadow-sm bg-white">
              <Loading />
            </div>
          )}

          {districtsCount ? (
            <MetricCard
              leadText="Total District"
              leadCount={districtsCount.totalDistrict}
              subText="Assigned District"
              subCount={districtsCount.assignedDistrict}
              legendOne="Total"
              legendTwo="Assigned"
            />
          ) : (
            <div className="h-32 grid place-items-center w-1/3 p-2 drop-shadow-sm bg-white">
              <Loading />
            </div>
          )}
        </div>

        <AddedRemovedChartSA />
      </div>
    </div>
  );
};

export default Dashboard;
