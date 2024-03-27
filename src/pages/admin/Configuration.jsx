import React, { useState } from "react";
import {
  FormInputDropDown,
  FormInput,
  FormMultipleSelect,
  TagsInput,
} from "../../components/form";
import {
  CategoryPage,
  CreateCategoryForm,
  CreateProductForm,
} from "../../containers";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context";
import { getCategoryByCountry } from "../../lib/service";

const Configuration = () => {
  // for create category
  const { user } = useAuth();

  const {
    data: catData,
    isLoading: catLoading,
    isSuccess: catSuccess,
  } = useQuery({
    queryKey: [""],
    queryFn: () => getCategoryByCountry(user.country),
  });

  return (
    <CategoryPage
      data={catData?.data.data}
      productPath="/admin/configuration/products"
      categoryPath="/admin/configuration/categories"
    />
  );
};

export default Configuration;
