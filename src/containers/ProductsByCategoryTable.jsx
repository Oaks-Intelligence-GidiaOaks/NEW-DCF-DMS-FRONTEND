import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import {
  flagResponse,
  getProductResponsesByCategory,
  getProductsByCategory,
} from "../lib/service";
import { GeneralTable } from "../components/charts";
import { transformProductGridData } from "../lib/utils";
import { toast } from "react-toastify";
import { queryClient } from "../App";

const ProductsByCategoryTable = ({ categoryId }) => {
  const {
    data: productData,
    isLoading: prodLoading,
    isSuccess: prodSuccess,
    refetch,
  } = useQuery({
    queryKey: ["getProductResponsesByCategory"],
    queryFn: () => getProductResponsesByCategory(categoryId),
    enabled: !!categoryId,
  });

  useEffect(() => {
    refetch();
  }, [categoryId, refetch]);

  // component variables
  let prodGridData = prodSuccess
    ? transformProductGridData(productData.data.data)
    : [];

  const AdminActions = [];

  const AdminFlag = {
    title: "Flag",
    action: async (row) => {
      const tRow = {
        ids: [row._id],
      };

      console.log(tRow, "tRow");

      try {
        await flagResponse(tRow);
        queryClient.invalidateQueries({
          queryKey: ["getProductResponsesByCategory"],
        });

        toast.success(`response flagged successfully`);
      } catch (ex) {
        toast.error(ex.message);
      }
    },
  };

  const AdminCommands = [
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
    if (args.requestType === "save") {
      const { data } = args;

      const modifiedData = {
        _id: data._id,
      };
      console.log("modified", data);
    }
  };

  return (
    <div>
      <GeneralTable
        title="Form Responses"
        pageSize={60}
        data={prodGridData}
        commands={AdminCommands}
        handleSave={handleSave}
        flag={AdminFlag}
      />
    </div>
  );
};

export default ProductsByCategoryTable;
