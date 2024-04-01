import React from "react";
import { ProductsPage } from "../../containers";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteProduct,
  getProductsByCategory,
  updateProduct,
} from "../../lib/service";
import { transformCategoryProductsGridData } from "../../lib/utils";

const ViewProducts = () => {
  const { categoryId } = useParams();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: (mData) => updateProduct(mData),
    onSuccess: (sx) => {
      toast.success(`product details updated successfully`);
      queryClient.invalidateQueries({
        queryKey: ["getProductsByCategory"],
      });
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

  const {
    data: catProducts,
    isLoading: cpLoading,
    isSuccess: cpSuccess,
  } = useQuery({
    queryKey: ["getProductsByCategory"],
    queryFn: () => getProductsByCategory(categoryId),
  });

  const prodData = cpSuccess
    ? transformCategoryProductsGridData(catProducts?.data?.data)
    : [];

  const handleSave = async (args) => {
    const {
      data: {
        _id,
        category_id,
        category_name,
        country_id,
        country_name,
        currency,
        name,
        ...rest
      },
    } = args;

    if (args.requestType === "save") {
      const inputs = Object.entries(rest).map((item) => ({
        title: item[0],
        input_type: item[1],
      }));

      const modifiedData = {
        country_id,
        category_id,
        name,
        inputs,
      };

      const mtData = {
        productId: _id,
        productData: modifiedData,
      };

      await mutate(mtData);
    }
  };

  const action = [
    {
      title: "delete",
      action: async (row) => {
        try {
          const res = await deleteProduct(row._id);
          toast.success(`product deleted successfully`);
        } catch (ex) {
          toast.error(ex.message);
        }
      },
    },
  ];
  return (
    <ProductsPage
      action={action}
      handleSave={handleSave}
      data={prodData}
      backNavPath="/admin/configuration"
    />
  );
};

export default ViewProducts;
