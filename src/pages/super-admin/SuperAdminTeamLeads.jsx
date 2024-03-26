import React from "react";
import { BackButton, CountCard } from "../../components/reusable";
import { GeneralTable } from "../../components/charts";
import {
  transformSubAdminGridData,
  transformTeamLedsGridData,
} from "../../lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  disableUser,
  getAllSubAdmin,
  getTeamLeadsByCountry,
  resetPassword,
} from "../../lib/service";
import { toast } from "react-toastify";
import { queryClient } from "../../App";

const SuperAdminTeamLeads = () => {
  const navigate = useNavigate();

  const { countryId } = useParams();

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
    // {
    //   title: "Edit",
    //   action: (row) => console.log(row),
    // },
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
        />
      </div>

      {/* graphs */}
    </div>
  );
};

export default SuperAdminTeamLeads;
