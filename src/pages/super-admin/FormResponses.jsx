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

import { Loading, NoData } from "../../components/reusable";
import { useQuery } from "@tanstack/react-query";
import { FormInputDropDown } from "../../components/form";
import {
  getAllCategory,
  getAllCountries,
  getCategoryByCountry,
  getSubmissionCount,
} from "../../lib/service";
import { transformCountryFormData } from "../../lib/utils";
import { ProductsByCategoryTable } from "../../containers";

const FormResponses = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [countryId, setCountryId] = useState("65e344bff0eab8c4f2552abe");
  const [categoryId, setCategoryId] = useState(null);

  // styles
  const activeStyle = "bg-oaksgreen text-white";
  const nonActiveStyle = "bg-white";

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
  let countriesData = cSuccess
    ? transformCountryFormData(countries.data.data)
    : [];

  let categories = catSuccess
    ? categoryData.data.data.map((it) => ({
        name: it.name,
        _id: it._id,
        country: it.country._id,
      }))
    : null;

  const handleCountryChange = (e) => {
    console.log("country value", e);
    setCountryId(e);
  };

  const handleCategoryClick = (id) => {
    setCategoryId(id);
  };

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

      <div className="w-[230px]">
        <FormInputDropDown
          onChange={handleCountryChange}
          label="Select country"
          data={countriesData}
        />
      </div>

      {/* categories */}
      <div className="flex items-center gap-2 overflow-x-scroll metrics-scrollbar">
        {categories?.map((it, i) => (
          <div
            key={i}
            className={`rounded ${
              categoryId === it._id ? activeStyle : nonActiveStyle
            }`}
            onClick={() => handleCategoryClick(it._id)}
          >
            <CategoryTab text={it.name} Icon={Home} activeTab={activeTab} />
          </div>
        ))}
      </div>

      {/* table */}
      <div className="bg-white h-80 w-full">
        {!categoryId ? (
          <div className="h-32">
            <NoData text="No Catgeory Selected" />
          </div>
        ) : catLoading ? (
          <div className="h-32">
            <Loading />
          </div>
        ) : (
          <ProductsByCategoryTable categoryId={categoryId} />
        )}
      </div>
    </div>
  );
};

export default FormResponses;
