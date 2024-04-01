import { useNavigate } from "react-router-dom";
import { Loading, NoData } from "../../components/reusable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  disableUser,
  getAllEnumerators,
  resetPassword,
  updateUserById,
} from "../../lib/service";
import {
  transformEnumeratorsGridData,
  transformSubAdminGridData,
} from "../../lib/utils";
import { GeneralTable } from "../../components/charts";
import { toast } from "react-toastify";
import { userNonEditableFields } from "../../lib/actions";

const Enumerators = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateUserById"],
    mutationFn: (mdata) => updateUserById(mdata),
    onSuccess: (sx) => {
      toast.success(`user details updated successfully`);
      queryClient.invalidateQueries({
        queryKey: ["getAllEnumerators"],
      });
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

  const {
    data: enumerators,
    isLoading: enumLoading,
    isSuccess: enumSuccess,
  } = useQuery({
    queryKey: ["getAllEnumerators"],
    queryFn: getAllEnumerators,
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
      title: "Reset Password",
      action: async (row) => {
        const tData = {
          id: row.id,
        };

        try {
          const res = await resetPassword(tData);
          toast.success(`Passeord reset successfully`);
          queryClient.invalidateQueries({
            queryKey: ["getAllEnumerators"],
          });
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

  const commands = [
    {
      type: "Edit",
      buttonOption: { cssClass: "e-flat", iconCss: "e-edit e-icons" },
    },
    {
      type: "Save",
      buttonOption: { cssClass: "e-flat", iconCss: "e-update e-icons" },
    },
    {
      type: "Cancel",
      buttonOption: { cssClass: "e-flat", iconCss: "e-cancel-icon e-icons" },
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
        <div className="rounded bg-primary p-3 flex items-center gap-2 text-xs">
          <p className="text-white">Total Enumerators</p>
          <p className="rounded p-1 text-primary bg-white">
            {enumCount?.totalEnumerators}
          </p>
        </div>

        <div className="flex p-3 md:ml-8 items-center gap-6 w-fit rounded bg-white">
          <p className="">Recently Added</p>
          <p className="text-primary p-1 bg-gray-200 rounded text-sm">
            {enumCount?.newlyAdded}
          </p>
        </div>

        <div
          onClick={() => navigate("/add")}
          className="rounded bg-white border border-primary text-primary flex items-center p-3 gap-12 sm:ml-auto cursor-pointer sm:flex-initial xs:flex-1 xs:justify-between"
        >
          <p>Add new</p>
          <span>+</span>
        </div>
      </div>

      {/* table */}
      <div className="bg-white  w-full text-xs">
        {enumLoading ? (
          <Loading />
        ) : enumData ? (
          <GeneralTable
            pageSize={60}
            data={enumData}
            actions={actions}
            commands={commands}
            handleSave={handleSave}
            nonEditableFields={userNonEditableFields}
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
