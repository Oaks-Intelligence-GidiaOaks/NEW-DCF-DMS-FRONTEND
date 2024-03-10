import React, { useState } from "react";
import {
  FormInputDropDown,
  FormInput,
  FormMultipleSelect,
  TagsInput,
} from "../../components/form";
import { CreateCategoryForm, CreateProductForm } from "../../containers";

const Configuration = () => {
  // for create category
  const [activeForm, setActiveForm] = useState("category");

  const currentForm = {
    category: <CreateCategoryForm />,
    product: <CreateProductForm />,
  };

  return (
    <div className="font-poppins lg:w-3/5 mx-auto lg:ml-[30px] py-6 text-sm">
      <div className="h-[48px] w-fit px-[22px] bg-white flex gap-[22px] items-center radius-[5px]">
        <span>Total Categories</span>
        <span>78</span>
      </div>

      {currentForm[activeForm]}
    </div>
  );
};

export default Configuration;
