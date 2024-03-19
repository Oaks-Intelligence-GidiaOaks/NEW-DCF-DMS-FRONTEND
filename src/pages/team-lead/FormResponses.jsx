import React, { useEffect, useState } from "react";
import CategoryTab from "../../components/CategoryTab";
import {
  Restaurant,
  DirectionsCar,
  Home,
  PowerSettingsNew,
  Shuffle,
  Summarize,
} from "@mui/icons-material";

import OaksSlider from "../../components/Slider";
import axios from "axios";
import { Loading, NoData } from "../../components/reusable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "../../App";
import { GeneralTable } from "../../components/charts";
import { useAuth } from "../../context";
import { transformProductsDataByCategory } from "../../lib/utils";
import { getAllCategory, getTeamLeadSubmissionRate } from "../../lib/service";
import { ProductsByCategoryTable } from "../../containers";

const FormResponses = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("food");
  const [categoryId, setCategoryId] = useState(null);

  const {
    data: categoryData,
    isLoading: catLoading,
    isSuccess: catSuccess,
  } = useQuery({
    queryKey: ["getAllCategory"],
    queryFn: () => getAllCategory(user.country),
  });

  const {
    data: sRate,
    isLoading: srLoading,
    isSuccess: srSucess,
  } = useQuery({
    queryKey: ["getTeamLeadSubmissionRate"],
    queryFn: getTeamLeadSubmissionRate,
  });

  const activeStyle = "bg-oaksgreen text-white";
  const nonActiveStyle = "bg-white";

  let categories = catSuccess
    ? categoryData.data.data.map((it) => ({
        name: it.name,
        _id: it._id,
        country: it.country._id,
      }))
    : null;

  let sRCount = srSucess
    ? {
        notSubmited: sRate.data.notSubmited,
        submited: sRate.data.submited,
      }
    : {
        notSubmited: 0,
        submited: 0,
      };

  console.log("SrCount", sRCount);

  const handleCategoryClick = (id) => {
    setCategoryId(id);
  };

  console.log("all categories", categories);

  return (
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-6">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="rounded justify-between bg-oaksyellow p-3 flex xs:flex-1 md:flex-initial items-center gap-4 text-xs">
          <p className="text-white whitespace-nowrap">Expected submissions</p>
          <p className="rounded p-1  bg-white">
            {sRCount?.notSubmited + sRCount?.submited}
          </p>
        </div>

        <div className="flex p-3 lg:ml-8 items-center gap-6 w-fit rounded bg-white border border-oaksyellow">
          <p className="">Submissions</p>
          <p className="p-1 bg-gray-100 rounded text-sm">{sRCount?.submited}</p>
        </div>

        <div className="rounded bg-white border border-oaksyellow  flex items-center p-3 gap-10 xs:gap-6 lg:ml-auto cursor-pointer">
          <p>No response</p>
          <p className="bg-gray-100 p-1 rounded text-sm px-2">
            {sRCount?.notSubmited}
          </p>
        </div>
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
