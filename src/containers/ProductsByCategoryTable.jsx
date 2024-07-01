import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import {
  flagResponse,
  getProductResponsesByCategory,
  getProductsByCategory,
  updateProductData,
} from "../lib/service";
import { GeneralTable } from "../components/charts";
import { transformProductGridData } from "../lib/utils";
import { toast } from "react-toastify";
import { queryClient } from "../App";
import { commands, productsByCategoryHiddenFields } from "../lib/actions";
import { Loading } from "../components/reusable";

const ProductsByCategoryTable = ({ categoryId }) => {
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
    // console.log(categoryId);
  }, [categoryId, refetch]);

  // component variables
  let prodGridData = prodSuccess
    ? transformProductGridData(productData.data.data)
    : [];

  const AdminFlag = {
    title: "Flag",
    action: async (row) => {
      const tRow = {
        ids: [row._id],
      };

      try {
        const res = await flagResponse(row._id);
        queryClient.invalidateQueries({
          queryKey: ["getProductResponsesByCategory"],
        });

        toast.success(`response flagged successfully`);
      } catch (ex) {
        toast.error(ex.message);
      }
    },
  };

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

  if (prodGridData.length == 0) {
    return <div>No data</div>;
  }

  return !prodLoading ? (
    <GeneralTable
      title="Form Responses"
      pageSize={60}
      data={prodGridData}
      commands={commands}
      handleSave={handleSave}
      nonEditableFields={["flagged", "district", "name"]}
      hiddenFields={productsByCategoryHiddenFields}
      flag={AdminFlag}
    />
  ) : (
    <Loading />
    // <div className="text-3xl font-semibold">Loading data!!!</div>
  );
};

export default ProductsByCategoryTable;
