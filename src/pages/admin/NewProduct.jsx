import React from "react";
import { CreateProductForm } from "../../containers";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { BackButton } from "../../components/reusable";
import { useQuery } from "@tanstack/react-query";
import {
  getAllCategory,
  getAllCountries,
  getAllProduct,
  getCategoryByCountry,
  getProductsByCountry,
} from "../../lib/service";
import { transformCountryFormData } from "../../lib/utils";
import { useAuth } from "../../context";

const NewProduct = () => {
  const { user } = useAuth();

  const {
    data: allCategories,
    isLoading: isCatLoading,
    isSuccess: isCatSuccess,
    isError: isCatError,
  } = useQuery({
    queryKey: ["getCategoryByCountry"],
    queryFn: () => getCategoryByCountry(user.country),
  });

  const {
    data: allProducts,
    isLoading: isProdLoading,
    isSuccess: isProdSuccess,
    isError: isProdError,
  } = useQuery({
    queryKey: ["getProductsByCountry"],
    queryFn: () => getProductsByCountry(user.country),
  });

  // component variables
  let categoriesCount = allCategories?.data
    ? allCategories.data.data.length
    : 0;
  let productsCount = allProducts?.data ? allProducts.data.data.length : 0;

  //   let transCountryData = isCountrySuccess
  //     ? transformCountryFormData(countryData.data.data)
  //     : [];

  return (
    <div className="pt-[40px] md:pl-[70px] ">
      <div className="flex items-center flex-wrap gap-7 mb-[36px]">
        <button className="h-[48px] px-[22px] gap-6 flex items-center bg-white font-[500] text-xs leading-[18px]">
          <span className="">Total Categories</span>
          <span>{categoriesCount}</span>
        </button>

        <button className="h-[48px] px-[22px] gap-6 flex items-center bg-white font-[500] text-xs leading-[18px]">
          <span className="">Total Products</span>
          <span>{productsCount}</span>
        </button>

        <Link to="/admin/configuration">
          <BackButton />
        </Link>
      </div>

      <CreateProductForm countryData={null} />
    </div>
  );
};

export default NewProduct;
