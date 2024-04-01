import React from "react";
import { BackButton, CountCard } from "../../components/reusable";
import { GeneralTable } from "../../components/charts";
import {
  transformSubAdminGridData,
  transformTeamLedsGridData,
} from "../../lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  disableUser,
  getAllSubAdmin,
  getTeamLeadsByCountry,
  resetPassword,
  updateUserById,
} from "../../lib/service";
import { toast } from "react-toastify";

import { commands, userNonEditableFields } from "../../lib/actions";

const SuperAdminTeamLeads = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { countryId } = useParams();

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateUserById"],
    mutationFn: (data) => updateUserById(data),
    onSuccess: (sx) => {
      toast.success(`user details updated successfully`);
      queryClient.invalidateQueries({
        queryKey: ["getTeamLeadsByCountry"],
      });
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

  const {
    data: teamLeads,
    isLoading: tlLoading,
    isSuccess: tlSuccess,
  } = useQuery({
    queryKey: ["getTeamLeadsByCountry"],
    queryFn: () => getTeamLeadsByCountry(countryId),
  });

  let tlGridData = tlSuccess
    ? transformTeamLedsGridData(teamLeads?.data.users)
    : [];

  const tableActions = [
    {
      title: "Reset Password",
      action: async (row) => {
        const tData = {
          id: row.id,
        };

        try {
          const res = await resetPassword(tData);
          toast.success(`Passeord reset successfully`);
          queryClient.invalidateQueries({
            queryKey: ["getTeamLeadsByCountry"],
          });
        } catch (ex) {
          toast.error(ex.message);
        }
      },
    },
    {
      title: "See more",
      action: (row) => {
        navigate(`/super_admin/admins/team_lead_enumerators/${row._id}`);
      },
    },
    {
      title: "Delete",
      action: async (row) => {
        let userId = row._id;

        try {
          const res = await disableUser(userId);
          toast.success(`user disabled successful`);
          queryClient.invalidateQueries({
            queryKey: ["getTeamLeadsByCountry"],
          });
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

      const mtData = { userId: data._id, userData: userFormData };

      await mutate(mtData);
    }
  };
  return (
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-6">
      {/* headers */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 xs:text-[10px]">
        <CountCard
          text="Total Team leads"
          styles=" bg-[#FFAD10] text-white"
          countStyles=" bg-white text-[#4A4848] p-1 text-xs rounded-[5px]"
          count={teamLeads?.data.totalTeamLead}
        />

        <CountCard
          text="Recently added"
          styles="border border-[#FFAD10]"
          count={teamLeads?.data.newlyAdded}
        />

        <Link className="ml-auto" to="/super_admin/admins">
          <BackButton />
        </Link>

        <Link
          className="md:col-span-3 md:ml-auto"
          to={`/super_admin/admins/${countryId}/add_team_lead`}
        >
          <CountCard
            text="Add new"
            styles=" border border-[#82B22E] text-[#82B22E]"
            textStyles="bg-[#FAF9F9]"
            plus
            plusColor={"#82B22E"}
          />
        </Link>
      </div>

      {/* table */}
      <div>
        <GeneralTable
          title="Team Leads Table"
          data={tlGridData}
          actions={tableActions}
          pageSize={60}
          commands={commands}
          handleSave={handleSave}
          nonEditableFields={userNonEditableFields}
        />
      </div>

      {/* graphs */}
    </div>
  );
};

export default SuperAdminTeamLeads;
