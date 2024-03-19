import { useEffect, useState } from "react";
import CategoryTab from "../../components/CategoryTab";
import {
  Restaurant,
  DirectionsCar,
  Home,
  PowerSettingsNew,
  Shuffle,
  Accessibility,
  Summarize,
  Download,
} from "@mui/icons-material";

import { FoodGrid } from "../../components/grid";
import OaksSlider from "../../components/Slider";
import axios from "axios";
import { Loading } from "../../components/reusable";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../../App";
import { GeneralTable } from "../../components/charts";
import { FormDropdown } from "../../components/form";
import {
  getAllCountries,
  getPrevProductDataByCountry,
  getProductDataByCountry,
} from "../../lib/service";
import {
  transformCountryFormData,
  transformProductsDataByCategory,
  transformProductsGridData,
} from "../../lib/utils";

const FormResponses = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [countryId, setCountryId] = useState("65e344bff0eab8c4f2552abe");

  // SA
  // const [countryId, setCountryId] = useState("65e344bff0eab8c4f2552ac5");

  // styles
  const activeStyle = "bg-oaksgreen text-white";
  const nonActiveStyle = "bg-white";

  const { data: countries, isSuccess: cSuccess } = useQuery({
    queryKey: ["getAllCountries"],
    queryFn: getAllCountries,
  });

  const { data: productData, isSuccess: pdSuccess } = useQuery({
    queryKey: ["getProductDataByCountry"],
    queryFn: () => getProductDataByCountry(countryId),
  });

  // const { data: prevProductData, isSuccess: prevPdSuccess } = useQuery({
  //   queryKey: ["getProductDataByCountry"],
  //   queryFn: () => getPrevProductDataByCountry(countryId),
  // });

  let countriesData = cSuccess
    ? transformCountryFormData(countries.data.data)
    : [];

  let productsData = pdSuccess
    ? transformProductsGridData(productData.data.data)
    : [];

  let productsByCategory = pdSuccess
    ? transformProductsDataByCategory(productData.data.data)
    : [];

  console.log("prod by cat", productsByCategory);

  if (true) {
    return <div>Form Responses Super Admin</div>;
  }

  return (
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-6">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="rounded justify-between bg-oaksyellow p-3 flex xs:flex-1 md:flex-initial items-center gap-4 text-xs">
          <p className="text-white whitespace-nowrap">Expected submissions</p>
          <p className="rounded p-1  bg-white">0</p>
        </div>

        <div className="flex p-3 lg:ml-8 items-center gap-6 w-fit rounded bg-white border border-oaksyellow">
          <p className="">Submissions</p>
          <p className="p-1 bg-gray-100 rounded text-sm">0</p>
        </div>

        <div className="rounded bg-white border border-oaksyellow  flex items-center p-3 gap-10 xs:gap-6 lg:ml-auto cursor-pointer">
          <p>No response</p>
          <p className="bg-gray-100 p-1 rounded text-sm px-2">0</p>
        </div>
      </div>

      <div className="w-fit border">
        <FormDropdown
          onChange={(e) => setCountryId(e.target.value)}
          label="Select country"
          data={countriesData}
        />
      </div>

      <OaksSlider slideDefault={5} break1={3} break2={2} break3={2}>
        {productsByCategory.categories?.map((it, i) => (
          <div
            key={i}
            className={`rounded w-fit mr-3 ${
              activeTab === it._id ? "bg-oaksgreen text-white" : "bg-white"
            }`}
            onClick={() => setActiveTab(it._id)}
          >
            <CategoryTab
              text={it?.name}
              Icon={Restaurant}
              activeTab={activeTab}
            />
          </div>
        ))}
      </OaksSlider>

      <div className="bg-white h-80 w-full">
        {false ? (
          <div className="h-32">
            <Loading />
          </div>
        ) : (
          <>
            <GeneralTable
              avgData={productsByCategory.productsByCategory}
              data={
                activeTab
                  ? productsByCategory.productsByCategory[activeTab]
                  : []
              }
            />
          </>
        )}
      </div>
    </div>
  );
};

export default FormResponses;
