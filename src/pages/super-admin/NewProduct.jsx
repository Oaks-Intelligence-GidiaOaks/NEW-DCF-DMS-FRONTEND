import React from "react";
import { Link } from "react-router-dom";
import { BackButton, CountCard } from "../../components/reusable";
import { useQuery } from "@tanstack/react-query";
import {
  getAllCategory,
  getAllCountries,
  getAllProduct,
} from "../../lib/service";
import { transformCountryFormData } from "../../lib/utils";
import CreateProductFormSA from "../../containers/CreateProductFormSA";

const NewProduct = () => {
  const { data: countryData, isSuccess: isCountrySuccess } = useQuery({
    queryKey: ["getAllCountries"],
    queryFn: getAllCountries,
  });

  const {
    data: allCategories,
    isLoading: isCatLoading,
    isSuccess: isCatSuccess,
    isError: isCatError,
  } = useQuery({
    queryKey: ["getAllCategory"],
    queryFn: getAllCategory,
  });

  const { data: allProducts } = useQuery({
    queryKey: ["getAllProduct"],
    queryFn: getAllProduct,
  });

  // component variables
  let categoriesCount = allCategories?.data
    ? allCategories.data.data.length
    : 0;
  let productsCount = allProducts?.data ? allProducts.data.data.length : 0;

  let transCountryData = isCountrySuccess
    ? transformCountryFormData(countryData.data.data)
    : [];

  return (
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-6">
      <div className="flex items-center flex-wrap gap-2 xs:text-[10px]">
        <CountCard
          count={categoriesCount}
          text="Total Categories"
          styles=" bg-white"
        />

        <CountCard
          count={productsCount}
          text="Total Products"
          styles=" bg-white"
        />

        <Link className="md:ml-auto" to="/super_admin/configuration">
          <BackButton />
        </Link>
      </div>

      <CreateProductFormSA countryData={transCountryData} />
    </div>
  );
};

export default NewProduct;
