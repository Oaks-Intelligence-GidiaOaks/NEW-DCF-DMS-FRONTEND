import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import {
  getProductResponsesByCategory,
  resubmitProductData,
} from "../lib/service";
import { GeneralTable } from "../components/charts";
import { transformProductGridData } from "../lib/utils";
import { toast } from "react-toastify";
import { queryClient } from "../App";

const ProductsByCategoryTableTL = ({ categoryId }) => {
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

  const Flag = {
    title: "Submit",
    action: async (row) => {
      let productId = row._id;

      console.log(row, "tRow");

      try {
        const res = await resubmitProductData(productId);
        queryClient.invalidateQueries({
          queryKey: ["getProductResponsesByCategory"],
        });

        toast.success(`product submitted successfully`);
      } catch (ex) {
        toast.error(ex.message);
      }
    },
  };

  const Commands = [
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
        commands={Commands}
        handleSave={handleSave}
        flag={Flag}
      />
    </div>
  );
};

export default ProductsByCategoryTableTL;
