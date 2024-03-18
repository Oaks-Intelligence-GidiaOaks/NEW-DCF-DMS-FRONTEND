import React, { useState } from "react";
import {
  FormInput,
  FormInputDropDown,
  TagsInput,
  TextInput,
} from "../components/form";
import { useController, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createCategory, getAllCountries } from "../lib/service";
import { transformCountryFormData } from "../lib/utils";
import { toast } from "react-toastify";

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

  const {
    mutate,
    isError: isCategoryError,
    isLoading: isCategoryLooading,
  } = useMutation({
    mutationKey: ["createCategory"],
    mutationFn: (catData) => createCategory(catData),
    onSuccess: (dt) => {
      toast.success(`Category Created SUccessfully`);
      clearFormFields();
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
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

  const onSubmit = async (e) => {
    e.preventDefault();

    const isError = Object.values(formFields).filter((it) => !it.length).length;

    const categoryData = {
      ...formFields,
    };

    console.log(categoryData);

    if (isError) {
      return toast.error("Please fill all form fields");
    }

    await mutate(categoryData);
  };

  const handleChange = (val, fieldName) => {
    setFormFields({ ...formFields, [fieldName]: val });
  };

  const clearFormFields = () => {
    setFormFields({
      country_id: "",
      name: "",
      expected_inputs: [],
    });
  };

  return (
    <div className="lg:max-w-[744px]">
      <h2 className="font-[500] text-xl leading-[30px] text-[#4A4848] mt-[30px] mb-3">
        Create New Category
      </h2>

      <form action="" onSubmit={onSubmit}>
        <select
          onChange={(e) => handleChange(e.target.value, "country_id")}
          placeholder="Choose country"
          name=""
          id=""
          className="border active:outline-none w-full h-[40px] px-3 rounded-[5px]"
        >
          <option label="Choose country" />
          {countryData?.map((item) => (
            <option
              key={item.value}
              label={item.label}
              value={item.value}
            ></option>
          ))}
        </select>

        <TextInput
          label={"Category Name"}
          placeholder="Category name"
          onChange={(e) => handleChange(e.target.value, "name")}
          value={formFields.name}
        />

        <TagsInput
          defaultValue={formFields.expected_inputs}
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
