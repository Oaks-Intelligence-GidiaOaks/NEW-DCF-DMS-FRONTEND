import React from "react";
import { ProductsPage } from "../../containers";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductsByCategory } from "../../lib/service";
import { transformCategoryProductsGridData } from "../../lib/utils";

const ViewProducts = () => {
  const { categoryId } = useParams();

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

  const flag = {
    title: "Remove",
    action: async () => {
      try {
        const res = await axios.delete(`product/${row._id}`);
        toast.success(`product deleted successfully`);
      } catch (ex) {
        toast.error(ex.message);
      }
    },
  };

  const action = [
    {
      title: "edit",
      action: async (row) => {
        let inputs = [];

        try {
          const updatedData = {
            country_id: row.country_id,
            category_id: row.category_id,
            name: row.name,
            inputs,
          };

          await axios.put(`product/${row._id}`, updatedData);
          toast.success(`product updated successfully`);
        } catch (ex) {
          toast.error(ex.message);
        }
      },
    },
  ];

  return (
    <ProductsPage
      action={action}
      flag={flag}
      data={prodData}
      backNavPath="/admin/configuration"
    />
  );
};

export default ViewProducts;
