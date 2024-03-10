import React from "react";
import { FormInput, FormInputDropDown, TagsInput } from "../components/form";
import MasterGrid from "../components/grid/MasterGrid";

const CreateProductForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <h2>Create New Product</h2>

      <form action="" onSubmit={handleSubmit}>
        <FormInputDropDown label={"Category"} data={[]} />
        <FormInput label={"Product Name"} placeholder={"Product name"} />

        <div className="w-full rounded-lg p-6 border border-[#00000029]/20">
          <FormInputDropDown
            label={"Input Title"}
            placeholder="Select"
            data={[]}
          />

          <FormInputDropDown
            label={"Input Type"}
            placeholder="Select type"
            data={[]}
          />

          <TagsInput label={"Option (s) "} />

          <button className="h-[48px] w-full rounded-[5px] text-center font-[500] text-xs text-[#82B22E] mt-[30px] border border-[#82B22E]">
            Add Input
          </button>
        </div>

        {/* inputs table */}
        <div>
          <MasterGrid
            data={[{ title: "Price", type: "text", options: "me" }]}
          />
        </div>

        <button className="h-[54px] rounded-[5px] text-center bg-[#82B22E] font-[500] text-base text-white w-full leading-[24px]">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateProductForm;
