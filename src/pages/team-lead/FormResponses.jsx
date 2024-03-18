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

import {
  OthersGrid,
  NotesGrid,
  FoodGrid,
  ElectricityGrid,
  TransportGrid,
  AccomodationGrid,
  ClothingGrid,
} from "../../components/grid";
import OaksSlider from "../../components/Slider";
import axios from "axios";
import { Loading } from "../../components/reusable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "../../App";

const FormResponses = () => {
  const [activeTab, setActiveTab] = useState("food");

  const [isLoading, setIsLoading] = useState(false);

  const [prevFoodData, setPrevFoodData] = useState(null);
  // console.log(foodData, "FOOD DATA");

  const activeStyle = "bg-oaksgreen text-white";
  const nonActiveStyle = "bg-white";

  const getSubRate = useQuery({
    queryKey: ["getSubRateTl"],
    queryFn: async () => await axios.get(`team_lead_dashboard/submission_rate`),
  });

  const getFoodData = useQuery({
    queryKey: ["getFoodData"],
    queryFn: async () => {
      const res = await axios.get("form_response/food_product");

      if (res.statusText == "OK") {
        // setActiveTab("food");
        return res;
      }
    },
  });

  const getAvgFoodData = useQuery({
    queryKey: ["getAvgFoodData"],
    queryFn: async () => {
      const res = await axios.get("form_response/prev_food_product");
      return res;
    },
  });

  const getTransData = useQuery({
    queryKey: ["getTransData"],
    queryFn: async () => {
      const res = await axios.get("form_response/transport");
      return res;
    },
  });

  const getAvgTransData = useQuery({
    queryKey: ["getAvgTransData"],
    queryFn: async () => await axios.get("form_response/prev_transport"),
  });

  const getAccData = useQuery({
    queryKey: ["getAccData"],
    queryFn: async () => await axios.get("form_response/accomodation"),
  });
  const getAvgAccData = useQuery({
    queryKey: ["getAvgAccData"],
    queryFn: async () => await axios.get("form_response/prev_accomodation"),
  });

  const getFood = async () => {
    setActiveTab("food");
    queryClient.invalidateQueries({ queryKey: ["getFoodData"] });
    // queryClient.refetchQueries("getFoodData");
  };

  return (
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-6">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="rounded justify-between bg-oaksyellow p-3 flex xs:flex-1 md:flex-initial items-center gap-4 text-xs">
          <p className="text-white whitespace-nowrap">Expected submissions</p>
          <p className="rounded p-1  bg-white">
            {sub && sub?.submited + sub?.notSubmited}
          </p>
        </div>

        <div className="flex p-3 lg:ml-8 items-center gap-6 w-fit rounded bg-white border border-oaksyellow">
          <p className="">Submissions</p>
          <p className="p-1 bg-gray-100 rounded text-sm">
            {sub && sub.submited}
          </p>
        </div>

        <div className="rounded bg-white border border-oaksyellow  flex items-center p-3 gap-10 xs:gap-6 lg:ml-auto cursor-pointer">
          <p>No response</p>
          <p className="bg-gray-100 p-1 rounded text-sm px-2">
            {sub && sub.notSubmited}
          </p>
        </div>
      </div>

      {/* categories */}
      <div className="flex items-center gap-2 overflow-x-scroll metrics-scrollbar">
        {/* <OaksSlider slideDefault={5} break1={3} break2={2} break3={2}> */}

        <div
          className={`rounded ${
            activeTab === "clothing" ? activeStyle : nonActiveStyle
          }`}
          onClick={() => getClothing()}
        >
          <CategoryTab text="Clothing" Icon={Home} activeTab={activeTab} />
        </div>

        {/* </OaksSlider> */}
      </div>

      {/* table */}

      <div className="bg-white h-80 w-full">
        {isLoading ? (
          <div className="h-32">
            <Loading />
          </div>
        ) : (
          <div>
            {activeTab === "food" && (
              <FoodGrid data={foodData} avgData={avgFoodData} />
            )}

            {activeTab === "transport" && (
              <TransportGrid data={transportData} avgData={avgTransportData} />
            )}

            {activeTab === "accomodation" && (
              <AccomodationGrid data={accomodationData} avgData={avgAccData} />
            )}

            {activeTab === "clothing" && (
              <ClothingGrid data={clothingData} avgData={avgClothingData} />
            )}

            {activeTab === "electricity" && (
              <ElectricityGrid data={electricityData} avgData={avgElecData} />
            )}

            {activeTab === "others" && (
              <OthersGrid data={othersData} avgData={avgOthersData} />
            )}

            {activeTab === "notes" && <NotesGrid data={notesData} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormResponses;
