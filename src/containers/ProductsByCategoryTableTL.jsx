import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import {
  getProductResponsesByCategory,
  resubmitProductData,
  updateProductData,
} from "../lib/service";
import { GeneralTable } from "../components/charts";
import { transformProductGridData } from "../lib/utils";
import { toast } from "react-toastify";
import catProdSubmission from "../data/grid/categoryProductsSubmission.json";
import { commands, productsByCategoryHiddenFields } from "../lib/actions";

const ProductsByCategoryTableTL = ({ categoryId }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateProductData"],
    mutationFn: (mData) => updateProductData(mData),
    onSuccess: (sx) => {
      toast.success(`product updated successfully..`);
      queryClient.invalidateQueries({
        queryKey: ["getProductResponsesByCategory"],
      });
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

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

  // let prodGridData = prodSuccess
  //   ? transformProductGridData(catProdSubmission.data)
  //   : [];

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
      const {
        data: { createdAt, created_by, district, flagged, _id, name, ...rest },
      } = args;

      const modifiedData = {
        inputs: Object.entries(rest).map((item, i) => ({
          title: item[0],
          value: item[1],
        })),
      };

      const mtData = {
        productId: _id,
        productData: modifiedData,
      };

      await mutate(mtData);
    }
  };

  // console.log(prodGridData);
  return prodGridData.length > 0 ? (
    <div>
      <GeneralTable
        title="Form Responses"
        height={400}
        pageSize={20}
        data={prodGridData}
        commands={Commands}
        handleSave={handleSave}
        flag={Flag}
        nonEditableFields={["flagged", "district", "name"]}
        hiddenFields={productsByCategoryHiddenFields}
      />
    </div>
  ) : (
    <div>Loading</div>
  );
};

export default ProductsByCategoryTableTL;
