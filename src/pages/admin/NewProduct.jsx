import React from "react";
import { CreateProductForm } from "../../containers";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { BackButton, CountCard } from "../../components/reusable";
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

  return (
    <div className="pt-[40px] md:pl-[70px] ">
      <div className="flex items-center flex-wrap gap-7 mb-[36px]">
        <CountCard
          text="Total Categories"
          count={categoriesCount}
          styles=" bg-white"
        />

        <CountCard
          text="Total Products"
          count={productsCount}
          styles=" bg-white"
        />

        <Link to="/admin/configuration">
          <BackButton />
        </Link>
      </div>

      <CreateProductForm countryData={null} />
    </div>
  );
};

export default NewProduct;
