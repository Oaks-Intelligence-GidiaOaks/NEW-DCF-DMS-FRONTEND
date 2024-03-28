import React, { useState } from "react";
import CategoryTab from "../../components/CategoryTab";
import { Home } from "@mui/icons-material";

import { CountCard, Loading, NoData } from "../../components/reusable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "../../App";
import { GeneralTable } from "../../components/charts";
import { useAuth } from "../../context";
import { transformProductsDataByCategory } from "../../lib/utils";
import { getAllCategory, getTeamLeadSubmissionRate } from "../../lib/service";
import { ProductsByCategoryTableTL } from "../../containers";

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

  // console.log("SrCount", sRCount);

  const handleCategoryClick = (id) => {
    setCategoryId(id);
  };

  // console.log("all categories", categories);

  return (
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-6">
      <div className="flex items-center gap-3 flex-wrap">
        <CountCard
          text="Expected submissions"
          styles=" bg-oaksyellow text-white"
          countStyles=" bg-white text-black"
          count={sRCount?.notSubmited + sRCount?.submited}
        />

        <CountCard
          text=" Submissions"
          styles=" bg-white border border-oaksyellow"
          count={sRCount?.submited}
          countStyles=" bg-gray-100"
        />

        <CountCard
          text=" No response"
          styles=" lg:ml-auto  bg-white border border-oaksyellow"
          count={sRCount?.notSubmited}
          countStyles=" bg-gray-100"
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
          <ProductsByCategoryTableTL categoryId={categoryId} />
        )}
      </div>
    </div>
  );
};

export default FormResponses;
