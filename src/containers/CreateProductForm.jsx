import React from "react";
import { FormInput, FormInputDropDown, TagsInput } from "../components/form";
import { GeneralTable } from "../components/charts";
import productInputs from "../../src/data/form/productInputs.json";

const CreateProductForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <h2>Create New Product</h2>

      <form action="" onSubmit={handleSubmit} className="lg:max-w-[744px]">
        <FormInputDropDown label={"Category"} data={[]} />
        <FormInput label={"Product Name"} placeholder={"Product name"} />

        <div className="w-full rounded-lg p-6 border border-[#00000029]/20">
          <FormInputDropDown
            label={"Input Title"}
            placeholder="Select"
            data={Comment}
          />

          <FormInputDropDown
            label={"Input Type"}
            placeholder="Select type"
            data={productInputs}
          />

          <TagsInput disabled={true} label={"Option (s) "} />

          <button className="h-[48px] w-full rounded-[5px] text-center font-[500] text-xs text-[#82B22E] mt-[30px] border border-[#82B22E]">
            Add Input
          </button>
        </div>

        {/* inputs table */}
        <div>
          <GeneralTable
            flag={{
              title: "Remove",
              action: (row) => console.log("row clicked", row),
            }}
            data={[
              {
                title: "Price",
                input_type: "Number",
              },
              {
                title: "Size",
                input_type: "Text",
              },
              {
                title: "Brand",
                input_type: "DropDown",
                options: ["Good Mama", "Local"],
              },
            ]}
          />
        </div>

        <button className="h-[54px] my-[45px] rounded-[5px] text-center bg-[#82B22E] font-[500] text-base text-white w-full leading-[24px]">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateProductForm;
