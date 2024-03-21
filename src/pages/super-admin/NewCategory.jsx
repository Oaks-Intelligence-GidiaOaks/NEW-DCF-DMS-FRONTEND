import React, { useEffect, useState } from "react";
import { BackButton, CountCard } from "../../components/reusable";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCategoryByCountry } from "../../lib/service";
import CreateCategoryFormSA from "../../containers/CreateCategoryFormSA";

const NewCategory = () => {
  const [countryId, setCountryId] = useState(null);

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

  let catCount = catSuccess ? categoryData?.data.data.length : 0;

  return (
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-6">
      <div className="flex justify-between items-center">
        <CountCard
          count={catCount}
          text="Total Categories"
          styles=" bg-white"
        />

        <Link to="/super_admin/configuration">
          <BackButton />
        </Link>
      </div>

      <div className="">
        <CreateCategoryFormSA />
      </div>
    </div>
  );
};

export default NewCategory;
