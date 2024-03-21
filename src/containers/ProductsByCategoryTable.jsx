import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import {
  getProductResponsesByCategory,
  getProductsByCategory,
} from "../lib/service";
import { GeneralTable } from "../components/charts";
import { transformProductGridData } from "../lib/utils";

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

  console.log("category id", categoryId);
  console.log("all cat products", productData?.data);

  useEffect(() => {
    refetch();
  }, [categoryId, refetch]);

  let prodGridData = prodSuccess
    ? transformProductGridData(productData.data.data)
    : [];

  return (
    <div>
      <GeneralTable pageSize={60} data={prodGridData} actions={[]} />
    </div>
  );
};

export default ProductsByCategoryTable;
