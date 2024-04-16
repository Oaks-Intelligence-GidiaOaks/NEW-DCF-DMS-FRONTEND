import { Loading } from "../../components/reusable";
import { useQuery } from "@tanstack/react-query";
import {
  getAllEnumerators,
  getAllSubAdmin,
  getDistrictsCount,
  getSubmissionCount,
  getTeamLeadsCount,
} from "../../lib/service";
import { AddedRemovedChart } from "../../containers";
import { MetricCard } from "../../components";
import { getDistrictRoutesLgas, seedDistrictRoutes } from "../../lib/routes";
import ggg from "../../constants/test.json";

const Dashboard = () => {
  // const createRoutes = async () => {
  //   let dd = await seedDistrictRoutes(ggg);
  //   return dd;
  // };

  // const getRoutes = async () => {
  //   let dd = await getDistrictRoutesLgas();
  //   return dd;
  // };

  const {
    data: subAdmins,
    isLoading: loadingSubAdmin,
    isSuccess: successSubAdmin,
  } = useQuery({
    queryKey: ["getAllSubAdmin"],
    queryFn: getAllSubAdmin,
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
    data: allEnumerators,
    isLoading: loadingEnumerators,
    isSuccess: successEnumerators,
  } = useQuery({
    queryKey: ["getAllEnumerators"],
    queryFn: getAllEnumerators,
  });

  // const {
  //   data: submissionRate,
  //   isLoading: srLoading,
  //   isSuccess: srSuccess,
  // } = useQuery({
  //   queryKey: ["getSubmissionCount"],
  //   queryFn: getSubmissionCount,
  // });

  // const {
  //   data: allDistricts,
  //   isLoading: districtsLoading,
  //   isSuccess: districtsSuccess,
  // } = useQuery({
  //   queryKey: ["getDistrictsCount"],
  //   queryFn: getDistrictsCount,
  // });

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

  // let districtsCount = districtsSuccess ? {} : null;
  // let submissionsCount = srSuccess ? {} : null;

  return (
    <div className="">
      <div className="mx-auto  mt-8 pb-4 md:w-[]">
        <div className="flex items-center justify-between gap-3 overflow-x-scroll metrics-scrollbar">
          {/* <button onClick={getRoutes}>add</button> */}
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

          {teamLeadsCount ? (
            <MetricCard
              leadText="Team Leads"
              leadCount={teamLeadsCount?.totalTeamLead}
              subText="Newly Added"
              subCount={teamLeadsCount?.newlyAdded}
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
    </div>
  );
};

export default Dashboard;
