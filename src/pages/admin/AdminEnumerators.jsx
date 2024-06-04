import { Link, useParams } from "react-router-dom";
import { BackButton, CountCard, NoData } from "../../components/reusable";
import { useNavigate } from "react-router-dom";
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
import { commands, userNonEditableFields } from "../../lib/actions";

const AdminEnumerators = () => {
  const queryClient = useQueryClient();
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

  // console.log(teamLead, "team lead");

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
            queryKey: ["getAllEnumerators"],
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
            queryKey: ["getAllEnumerators"],
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

        <Link to={`/admin/edit_team_lead/${teamLeadId}`}>
          <CountCard
            styles="border border-primary"
            plus
            plusColor=""
            text="About"
          />
        </Link>
      </div>

      {/* table */}
      <div className="bg-white  w-full text-xs">
        <GeneralTable
          pageSize={60}
          data={enumData}
          actions={actions}
          title="Users - Enumerators"
          commands={commands}
          nonEditableFields={userNonEditableFields}
          handleSave={handleSave}
        />
      </div>
    </div>
  );
};

export default AdminEnumerators;
