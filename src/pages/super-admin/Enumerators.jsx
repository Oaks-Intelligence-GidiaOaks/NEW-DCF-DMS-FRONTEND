import { useNavigate, useParams } from "react-router-dom";
import {
  BackButton,
  CountCard,
  Loading,
  NoData,
} from "../../components/reusable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  disableUser,
  getIndividualUser,
  getTeamLeadEnumerators,
  resetPassword,
  updateUserById,
} from "../../lib/service";
import { transformEnumeratorsGridData } from "../../lib/utils";
import { GeneralTable } from "../../components/charts";
import { toast } from "react-toastify";
import { commands } from "../../lib/actions";

const Enumerators = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { teamLeadId } = useParams();

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateUserById"],
    mutationFn: (mdata) => updateUserById(mdata),
    onSuccess: (sx) => {
      toast.success(`user details updated successfully`);
      queryClient.invalidateQueries({
        queryKey: ["getTeamLeadEnumerators"],
      });
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

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

  const actions = [
    {
      title: "reset password",
      action: async (row) => {
        try {
          const res = await resetPassword({
            id: row.id,
          });
          queryClient.invalidateQueries({
            queryKey: ["getTeamLeadEnumerators"],
          });

          toast.success(`Password reset successfully..`);
        } catch (ex) {
          toast.error(ex.message);
        }
      },
    },
    {
      title: "delete",
      action: async (row) => {
        try {
          const res = await disableUser(row._id);
          queryClient.invalidateQueries({
            queryKey: ["getTeamLeadEnumerators"],
          });

          toast.success(`user deleted successfully..`);
        } catch (ex) {
          toast.error(ex.message);
        }
      },
    },
  ];

  const handleSave = async (args) => {
    const { data } = args;

    if (args.requestType === "save") {
      const userFormData = new FormData();

      userFormData.append("first_name", data.first_name);
      userFormData.append("last_name", data.last_name);
      userFormData.append("email", data.email);
      userFormData.append("phone_number", data.phone_number);

      const mtData = {
        userId: data._id,
        userData: userFormData,
      };

      await mutate(mtData);
    }
  };

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
            commands={commands}
            nonEditableFields={[
              "id",
              "identityType",
              "country",
              "states",
              "districts",
            ]}
            title={`${teamLeadName} - Team Lead Enumerators`}
            pageSize={60}
            data={enumData}
            actions={actions}
            handleSave={handleSave}
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
