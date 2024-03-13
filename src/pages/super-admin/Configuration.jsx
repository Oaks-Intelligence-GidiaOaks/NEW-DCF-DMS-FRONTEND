import React, { useState } from "react";
import {
  CategoryPage,
  CreateCategoryForm,
  CreateProductForm,
} from "../../containers";
import { IoIosArrowBack } from "react-icons/io";

const Configuration = () => {
  // for create category
  const [activeForm, setActiveForm] = useState("category");

  const currentForm = {
    category: <CreateCategoryForm />,
    product: <CreateProductForm />,
  };

  if (true) {
    return (
      <CategoryPage
        productPath="/super_admin/configuration/products"
        categoryPath="/super_admin/configuration/categories"
      />
    );
  }

  return (
    <div className="font-poppins mx-auto lg:ml-[30px] py-6 text-sm">
      <div className="flex  items-center justify-between">
        <div className="h-[48px] w-fit px-[22px] bg-white flex gap-[22px] items-center radius-[5px]">
          <span>Total Categories</span>
          <span>78</span>
        </div>

        <button className="h-[48px] rounded-[5px] bg-[#82B22E] flex items-center  py-5 gap-7 pl-6 pr-11">
          <span className="h-6 w-6 bg-white rounded-[5px] grid place-items-center">
            <IoIosArrowBack />
          </span>

          <span className="font-[500] text-xs leading-[18px]  text-white">
            Back
          </span>
        </button>
      </div>

      <div className="lg:w-3/5">{currentForm[activeForm]}</div>
    </div>
  );
};

export default Configuration;
