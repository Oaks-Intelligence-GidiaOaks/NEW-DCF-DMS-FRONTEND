import React from "react";
// import { FaPlus } from "react-icons/fa6";
import { TiPlus } from "react-icons/ti";
import { GeneralTable } from "../components/charts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SkeletonLoaders } from "../components/reusable";
import categoryData from "../../src/data/grid/categoryData.json";
import { transformCategoryGridData } from "../lib/utils";
// import { gridActions } from "../lib/actions";
import { Link, useNavigate } from "react-router-dom";

const CategoryPage = ({
  actions,
  data,
  commands,
  pageSize,
  tableTitle = "Category Table",
  productPath,
  categoryPath,
}) => {
  const navigate = useNavigate();

  // const categoryData = useQuery({
  //   queryKey: ["getAllCategory"],
  //   queryFn: async () => await axios.get("category"),
  // });

  const gridData = data?.length ? transformCategoryGridData(data) : [];

  const gridActions = {
    categoryGrid: [
      {
        title: "Edit",
        action: (row) => {
          console.log("Edit clicked", row);
        },
      },
      {
        title: "See more",
        action: (row) => {
          // console.log("See more clicked", row);
          navigate(`/super_admin/configuration/category_products/${row._id}`);
        },
      },
      {
        title: "Remove",
        action: (row) => {
          console.log("Remove clicked", row);
        },
      },
    ],
  };

  const activeState = {
    true: <SkeletonLoaders count={3} />,
    false: (
      <GeneralTable
        height={200}
        data={gridData}
        pageSize={30}
        title={tableTitle}
      />
    ),
  };

  return (
    <div className=" px-3 md:px-7 pt-[35px]">
      <div className="flex items-center justify-between flex-wrap gap-2 xs:text-[10px]">
        <Link to={categoryPath}>
          <button className="border border-[#82B22E] flex items-center py-3 px-5 rounded-[5px] gap-6">
            <span>Add new Category</span>

            <TiPlus color="#82B22E" />
          </button>
        </Link>

        <Link className="ml-auto" to={productPath}>
          <button className="px-5 flex items-center py-3 border bg-white rounded-[5px] gap-6">
            <span>Add new Product</span>

            <TiPlus color="black" />
          </button>
        </Link>
      </div>

      <div className="mt-6">
        {/* table */}
        {/* {activeState[categoryData.isLoading]} */}
        {activeState[false]}
      </div>
    </div>
  );
};

export default CategoryPage;
