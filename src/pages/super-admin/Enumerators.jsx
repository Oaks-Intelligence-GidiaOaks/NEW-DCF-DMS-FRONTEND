import { useNavigate, useParams } from "react-router-dom";
import {
  BackButton,
  CountCard,
  Loading,
  NoData,
} from "../../components/reusable";
import { useQuery } from "@tanstack/react-query";
import { getIndividualUser, getTeamLeadEnumerators } from "../../lib/service";
import { transformEnumeratorsGridData } from "../../lib/utils";
import { GeneralTable } from "../../components/charts";

const Enumerators = () => {
  const navigate = useNavigate();
  const { teamLeadId } = useParams();

  const {
    data: teamLead,
    isLoading: tlLoading,
    isSuccess: tlSuccess,
  } = useQuery({
    queryKey: ["getIndividualUser"],
    queryFn: () => getIndividualUser(teamLeadId),
  });

  const teamLeadName = tlSuccess
    ? `${teamLead?.data.data.first_name} ${teamLead?.data.data.last_name} `
    : "";

  const {
    data: enumerators,
    isLoading: enumLoading,
    isSuccess: enumSuccess,
  } = useQuery({
    queryKey: ["getTeamLeadEnumerators"],
    queryFn: () => getTeamLeadEnumerators(teamLeadId),
  });

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
        <CountCard
          count={enumCount?.totalEnumerators}
          text="Team Lead Enumerators"
          styles=" bg-primary text-white"
          countStyles=" text-primary bg-white "
        />

        <CountCard
          count={enumCount?.newlyAdded}
          text="Recently Added"
          styles=" bg-white"
          countStyles=" text-primary "
        />

        <div className="border w-fit md:ml-auto " onClick={() => navigate(-1)}>
          <BackButton />
        </div>
      </div>

      {/* table */}
      <div className="bg-white  w-full text-xs">
        {enumLoading ? (
          <Loading />
        ) : enumData ? (
          <GeneralTable
            title={`${teamLeadName} - Team Lead Enumerators`}
            pageSize={30}
            data={enumData}
            actions={[]}
          />
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
