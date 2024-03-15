import React, { useState } from "react";
import { FormInput, FormInputDropDown, TagsInput } from "../components/form";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getAllCountries } from "../lib/service";
import { transformCountryFormData } from "../lib/utils";

const CreateCategoryForm = () => {
  const {
    data: countries,
    isLoading,
    isError,
    isSuccess: isCountryQuerySuccess,
  } = useQuery({
    queryKey: ["getAllCountries"],
    queryFn: getAllCountries,
  });

  const [formFields, setFormFields] = useState({
    country_id: "",
    name: "",
    expected_inputs: [],
  });

  // component variables

  let countryData = isCountryQuerySuccess
    ? transformCountryFormData(countries.data.data)
    : [];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data) => {
    // e.preventDefault();

    const categoryData = {
      ...data,
      ...formFields,
    };

    console.log(categoryData);
  };

  const handleChange = (val, fieldName) => {
    if (fieldName === "expected_inputs") {
      setFormFields({
        ...formFields,
        expected_inputs: [...formFields.expected_inputs, val],
      });
    } else {
      setFormFields({ ...formFields, [fieldName]: val });
    }
  };

  return (
    <div className="lg:max-w-[744px]">
      <h2 className="font-[500] text-xl leading-[30px] text-[#4A4848] mt-[30px] mb-3">
        Create New Category
      </h2>

      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <FormInputDropDown
          onChange={(e) => handleChange(e, "country_id")}
          data={countryData}
          label={"Country"}
        />

        <FormInput
          label={"Category Name"}
          onChange={(e) => handleChange(e, "name")}
          placeholder="Category name"
          formProps={register("name", {
            required: "input is required.",
          })}
          errorMessage={errors?.name?.message}
        />

        <TagsInput
          label={"Expected Input Name(s)"}
          onChange={(e) => handleChange(e, "expected_inputs")}
        />

        <button className="h-[54px] w-full my-[45px] text-center rounded-[5px] text-white bg-[#82B22E] font-[500] text-base leading-[24px]">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateCategoryForm;
