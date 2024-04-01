import React, { useEffect, useState } from "react";
import { FormInputDropDown } from "../../components/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteCategory,
  getAllCountries,
  getCategoryByCountry,
  updateCategory,
} from "../../lib/service";
import {
  transformCategoryGridData,
  transformCountryFormData,
} from "../../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { GeneralTable } from "../../components/charts";
import { CountCard } from "../../components/reusable";
import { toast } from "react-toastify";
import {
  categoryNonEditableFields,
  commands,
  userNonEditableFields,
} from "../../lib/actions";

const Configuration = () => {
  const queryClient = useQueryClient();
  const [countryId, setCountryId] = useState("65e344bff0eab8c4f2552abe");

  const navigate = useNavigate();

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

  const { data: countries, isSuccess: cSuccess } = useQuery({
    queryKey: ["getAllCountries"],
    queryFn: getAllCountries,
  });

  const {
    data: categoryData,
    isLoading: catLoading,
    isSuccess: catSuccess,
    refetch,
  } = useQuery({
    queryKey: ["getCategoryByCountry"],
    queryFn: () => getCategoryByCountry(countryId),
    enabled: !!countryId,
  });

  useEffect(() => {
    refetch();
  }, [countryId, refetch]);

  // component variables
  let catGridData = catSuccess
    ? transformCategoryGridData(categoryData.data.data)
    : [];

  let countriesData = cSuccess
    ? transformCountryFormData(countries.data.data)
    : [];

  const handleCountryChange = (e) => {
    setCountryId(e);
  };

  const actions = [
    {
      title: "See more",
      action: (row) => {
        const categoryId = row._id;
        navigate(`/super_admin/configuration/category_products/${categoryId}`);
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
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-6">
      <div className="flex items-center justify-between flex-wrap gap-2 xs:text-[10px]">
        <Link to="/super_admin/configuration/categories">
          <CountCard
            plus
            plusColor="#82B22E"
            styles=" bg-white border border-oaks-green"
            text="Add new category"
          />
        </Link>

        <Link className="ml-auto" to="/super_admin/configuration/products">
          <CountCard
            text="Add new Product"
            styles=" bg-white border border-oaks-green"
            plus
            plusColor="#82B22E"
          />
        </Link>
      </div>

      <div className="w-[230px]">
        <FormInputDropDown
          index="z-20"
          onChange={handleCountryChange}
          label="Select country"
          data={countriesData}
        />
      </div>

      <div>
        <GeneralTable
          height={350}
          data={catGridData}
          pageSize={30}
          title="Categories By Country"
          actions={actions}
          nonEditableFields={categoryNonEditableFields}
          commands={commands}
          handleSave={handleSave}
          hiddenFields={["country_id"]}
        />
      </div>
    </div>
  );
};

export default Configuration;
