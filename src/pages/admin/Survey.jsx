import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getSurveys } from "../../lib/service";
import { GeneralTable } from "../../components/charts";
import { transformSurveyData } from "../../lib/utils";

const Survey = () => {
  const { data, isSuccess } = useQuery({
    queryKey: ["get-survey"],
    queryFn: () => getSurveys(),
  });

  const tData = isSuccess ? transformSurveyData(data.data) : [];

  return (
    <div>
      <GeneralTable
        data={tData}
        title={"Survey Table"}
        hiddenFields={["approved"]}
      />
    </div>
  );
};

export default Survey;
