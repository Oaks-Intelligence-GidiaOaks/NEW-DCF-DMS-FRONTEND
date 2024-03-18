import React from "react";
import { CountCard } from "../../components/reusable";
import { GeneralTable } from "../../components/charts";
import subAdminsData from "../../data/grid/subAdminData.json";
import { transformSubAdminGridData } from "../../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllSubAdmin } from "../../lib/service";

const SubAdmins = () => {
  const navigate = useNavigate();

  const {
    data: subAdmins,
    isLoading: saLoading,
    isSuccess: saSuccess,
  } = useQuery({
    queryKey: ["getAllSubAdmin"],
    queryFn: getAllSubAdmin,
  });

  // console.log(subAdmins.data.totalSubAdmin);

  const tableActions = [
    {
      title: "Edit",
      action: (row) => console.log(row),
    },
    {
      title: "Reset Password",
      action: (row) => console.log(row),
    },
    {
      title: "See more",
      action: (row) => {
        navigate(`/super_admin/country_team_leads/:countryId`);

        console.log(row);
      },
    },
    {
      title: "Delete",
      action: (row) => console.log(row),
    },
  ];

  return (
    <div>
      {/* headers */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[30px] w-full">
        <CountCard
          text="Total Sub Admin"
          styles=" bg-[#FFAD10] text-white"
          countStyles=" bg-white text-[#4A4848] p-1 text-xs rounded-[5px]"
          count={subAdmins?.data.totalSubAdmin}
        />

        <CountCard
          text="Recently added"
          styles="border border-[#FFAD10]"
          count={subAdmins?.data.newlyAdded}
        />

        <Link className="!ml-auto" to="/super_admin/admins/add">
          <CountCard
            text="Add new"
            styles=" border border-[#82B22E] text-[#82B22E]"
            textStyles="bg-[#FAF9F9]"
            plus
            plusColor={"#82B22E"}
          />
        </Link>

        <Link
          className="!ml-auto col-span-3"
          to="/super_admin/admins/assign_country"
        >
          <CountCard
            text="Assign Country"
            styles="  border border-[#82B22E] text-[#82B22E]"
            textStyles="bg-[#FAF9F9]"
            plus
            plusColor={"#82B22E"}
          />
        </Link>
      </div>

      {/* table */}
      <div>
        <GeneralTable
          title="Sub Admin Table"
          data={
            subAdmins?.data
              ? transformSubAdminGridData(subAdmins?.data.users)
              : []
          }
          actions={tableActions}
        />
      </div>

      {/* graphs */}
    </div>
  );
};

export default SubAdmins;
