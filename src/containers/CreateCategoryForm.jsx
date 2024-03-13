import React, { useState } from "react";
import { FormInput, FormInputDropDown, TagsInput } from "../components/form";
import { useForm } from "react-hook-form";

const CreateCategoryForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      country_id: "",
      name: "",
      expected_inputs: [],
    },
  });

  const onSubmit = (data) => {
    console.log("form data", data);
  };

  return (
    <div className="lg:max-w-[744px]">
      <h2 className="font-[500] text-xl leading-[30px] text-[#4A4848] mt-[30px] mb-3">
        Create New Category
      </h2>

      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <FormInputDropDown
          // formProps={register("", {
          //   required: "Input is required",
          // })}
          data={[]}
          label={"Country"}
        />

        <FormInput
          formProps={register("name", {
            required: "Input is required",
          })}
          label={"Category Name"}
          placeholder={"Category name"}
          errorMessage={errors}
        />

        <TagsInput
          // formProps={register("", {
          //   required: "Input is required",
          // })}
          data={[]}
          label={"Expected Input Name(s)"}
        />

        <button className="h-[54px] w-full my-[45px] text-center rounded-[5px] text-white bg-[#82B22E] font-[500] text-base leading-[24px]">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateCategoryForm;
