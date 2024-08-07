import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getSurveys } from "../../lib/service";
import { GeneralTable } from "../../components/charts";

const Survey = () => {
  const { data } = useQuery({
    queryKey: ["get-survey"],
    queryFn: () => getSurveys(),
  });

  return (
    <div>
      <GeneralTable
        data={data?.data || []}
        title={"Survey Table"}
        hiddenFields={["approved"]}
      />
    </div>
  );
};

export default Survey;
