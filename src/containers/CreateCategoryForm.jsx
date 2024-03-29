import React, { useRef, useState } from "react";
import { FormInputDropDown, TagsInput, TextInput } from "../components/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategory, getAllCountries } from "../lib/service";
import { transformCountryFormData } from "../lib/utils";
import { toast } from "react-toastify";
import { useAuth } from "../context";
import { RingsCircle } from "../components/reusable";

const CreateCategoryFormSA = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const countryRef = useRef();
  const tagsRef = useRef();

  const { mutate, isPending: isCategoryLooading } = useMutation({
    mutationKey: ["createCategory"],
    mutationFn: (catData) => createCategory(catData),
    onSuccess: (dt) => {
      toast.success(`Category Created SUccessfully`);
      clearFormFields();
      queryClient.invalidateQueries({ queryKey: ["getAllCategory"] });
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

  const [formFields, setFormFields] = useState({
    country_id: user.country,
    name: "",
    expected_inputs: [],
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    const isError = Object.values(formFields).filter((it) => !it.length).length;

    const categoryData = {
      ...formFields,
    };

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
      country_id: user.country,
      name: "",
      expected_inputs: [],
    });

    // try {
    //   // countryRef.current.clearValue();
    // } catch (ex) {
    //   toast.success(`Successful`);
    // }
  };

  return (
    <div className="lg:max-w-[744px]">
      <h2 className="font-[500] text-xl leading-[30px] text-[#4A4848] mt-[30px] mb-3">
        Create New Category
      </h2>

      <form action="" onSubmit={onSubmit}>
        <TextInput
          label={"Category Name"}
          placeholder="Category name"
          onChange={(e) => handleChange(e.target.value, "name")}
          value={formFields.name}
        />

        <TagsInput
          tags={formFields.expected_inputs}
          defaultValue={formFields.expected_inputs}
          label={"Expected Input Name(s)"}
          onChange={(e) => handleChange(e, "expected_inputs")}
        />

        <button
          disabled={isCategoryLooading}
          className={`  h-[54px] w-full my-[45px] text-center rounded-[5px] text-white ${
            isCategoryLooading ? "bg-gray-400" : "bg-[#82B22E]"
          }  font-[500] text-base leading-[24px]`}
        >
          {isCategoryLooading ? (
            <div className="w-fit mx-auto">
              <RingsCircle />
            </div>
          ) : (
            "Create"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateCategoryFormSA;
