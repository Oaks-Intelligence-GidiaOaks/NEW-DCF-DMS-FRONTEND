import React from "react";
// import { FaPlus } from "react-icons/fa6";
import { TiPlus } from "react-icons/ti";
import { GeneralTable } from "../components/charts";
import { SkeletonLoaders } from "../components/reusable";
import { transformCategoryGridData } from "../lib/utils";
// import { gridActions } from "../lib/actions";
import { Link, useNavigate } from "react-router-dom";
import { commands } from "../lib/actions";

const CategoryPage = ({
  actions,
  handleSave,
  data,
  tableTitle = "Category Table",
  productPath,
  categoryPath,
}) => {
  const gridData = data?.length ? transformCategoryGridData(data) : [];

  const activeState = {
    true: <SkeletonLoaders count={3} />,
    false: (
      <GeneralTable
        height={350}
        data={gridData}
        commands={commands}
        pageSize={30}
        handleSave={handleSave}
        title={tableTitle}
        nonEditableFields={["country_id"]}
        hiddenFields={["country_id"]}
        actions={actions}
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
