import { Link, useNavigate } from "react-router-dom";
import { Loading, NoData } from "../../components/reusable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTeamLeadsByCountry,
  resetPassword,
  updateUserById,
} from "../../lib/service";
import { useAuth } from "../../context";
import { transformTeamLedsGridData } from "../../lib/utils";
import { GeneralTable } from "../../components/charts";
import { toast } from "react-toastify";
import { commands, userNonEditableFields } from "../../lib/actions";

const TeamLeads = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const actions = [
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
        navigate(`/admin/team_leads/${row._id}`);
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
          <GeneralTable
            data={tlGridData}
            actions={actions}
            pageSize={60}
            commands={commands}
            handleSave={handleSave}
            nonEditableFields={userNonEditableFields}
          />
        ) : (
          <NoData text="No team leads yet" />
        )}
      </div>
    </div>
  );
};

export default TeamLeads;
