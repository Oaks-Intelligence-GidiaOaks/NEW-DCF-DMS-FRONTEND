import React from "react";
import { CountCard } from "../../components/reusable";
import { GeneralTable } from "../../components/charts";
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
    <div className="flex text-xs flex-col gap-6 h-full sm:mx-6 lg:mx-auto lg:w-[90%] mt-6">
      {/* headers */}
      <div className="flex items-center flex-wrap gap-2 xs:text-[10px]">
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
