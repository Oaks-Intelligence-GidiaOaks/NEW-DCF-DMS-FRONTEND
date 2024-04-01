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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context";
import {
  deleteCategory,
  getCategoryByCountry,
  updateCategory,
} from "../../lib/service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Configuration = () => {
  // for create category
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateCategory"],
    mutationFn: (mdata) => updateCategory(mdata),
    onSuccess: (sx) => {
      toast.success(`category updated successfully`);
      queryClient.invalidateQueries({
        queryKey: ["getCategoryByCountry"],
      });
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

  const {
    data: catData,
    isLoading: catLoading,
    isSuccess: catSuccess,
  } = useQuery({
    queryKey: ["getCategoryByCountry"],
    queryFn: () => getCategoryByCountry(user.country),
  });

  const actions = [
    {
      title: "See more",
      action: (row) => {
        navigate(`/admin/configuration/category_products/${row._id}`);
      },
    },
    {
      title: "Delete",
      action: async (row) => {
        const categoryId = row._id;
        try {
          const res = await deleteCategory(categoryId);
          toast.success(`Category deleted successfully`);
          queryClient.invalidateQueries({
            queryKey: ["getCategoryByCountry"],
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
      const updatedData = {
        country_id: data.country_id,
        name: data["Category name"],
        expected_inputs: data["Expected Inputs"].split(","),
      };

      const mtData = {
        categoryId: data._id,
        categoryData: updatedData,
      };

      await mutate(mtData);
    }
  };

  return (
    <CategoryPage
      handleSave={handleSave}
      actions={actions}
      data={catData?.data.data}
      productPath="/admin/configuration/products"
      categoryPath="/admin/configuration/categories"
    />
  );
};

export default Configuration;
