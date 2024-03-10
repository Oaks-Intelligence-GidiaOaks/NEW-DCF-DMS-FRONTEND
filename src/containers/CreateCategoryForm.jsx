import React from "react";
import { FormInput, FormInputDropDown, TagsInput } from "../components/form";

const CreateCategoryForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <h2 className="font-[500] text-xl leading-[30px] text-[#4A4848] mt-[30px] mb-3">
        Create New Category
      </h2>

      <form action="" onSubmit={handleSubmit}>
        <FormInputDropDown data={[]} label={"Country"} />

        <FormInput label={"Category Name"} placeholder={"Category name"} />

        <TagsInput data={[]} label={"Input Name(s)"} />

        <button className="h-[54px] w-full mt-[60px] text-center rounded-[5px] text-white bg-[#82B22E] font-[500] text-base leading-[24px]">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateCategoryForm;
