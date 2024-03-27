import React from "react";
import { CreateCategoryForm } from "../../containers";
import { IoIosArrowBack } from "react-icons/io";
import { BackButton, CountCard } from "../../components/reusable";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context";
import { getCategoryByCountry } from "../../lib/service";

const NewCategory = () => {
  const { user } = useAuth();

  const {
    data: categoryData,
    isLoading: catLoading,
    isSuccess: catSuccess,
  } = useQuery({
    queryKey: ["getCategoryByCountry"],
    queryFn: () => getCategoryByCountry(user.country),
  });

  let catCount = catSuccess ? categoryData?.data.data.length : 0;

  return (
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-6">
      <div className="flex justify-between items-center">
        <CountCard count={catCount} text="Total Categories" styles="bg-white" />

        <Link to="/admin/configuration">
          <BackButton />
        </Link>
      </div>

      <div className="">
        <CreateCategoryForm />
      </div>
    </div>
  );
};

export default NewCategory;
