import React, { useEffect, useRef, useState } from "react";
import { FormInputDropDown, TextInput } from "../components/form";
import { GeneralTable } from "../components/charts";
import productInputs from "../../src/data/form/productInputs.json";
import { createProduct, getCategoryByCountry } from "../lib/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/useAuth";
import FormProductInputs from "./FormProductInputs";
import { toast } from "react-toastify";

const CreateProductForm = ({ countryData }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [formFields, setFormFields] = useState({
    country_id: user.country,
    category_id: "",
    name: "",
    inputs: [],
  });

  const categoryInputRef = useRef();
  const titleInputRef = useRef();
  const typesInputRef = useRef();

  const { mutate, isPending: mtPending } = useMutation({
    mutationKey: ["createProduct"],
    mutationFn: (prodData) => createProduct(prodData),
    onSuccess: (sx) => {
      toast.success(`Product created succesfuuly`);
      clearFormFields();
      queryClient.invalidateQueries({ queryKey: ["getProductsByCountry"] });
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

  const {
    data: catByCountry,
    isLoading: catLoading,
    isSuccess: catSuccess,
  } = useQuery({
    queryKey: ["getCategoryByCountry"],
    queryFn: () => getCategoryByCountry(user.country),
  });

  // component variables
  const [expectedInputs, setExpectedInputs] = useState([]);

  let caInputData =
    catSuccess &&
    catByCountry?.data?.data?.map((it) => ({ label: it.name, value: it._id }));

  let mExpectedInputs =
    catSuccess &&
    catByCountry?.data?.data
      ?.map((it) => ({
        categoryName: it.name,
        categoryId: it._id,
        expected_inputs: it.expected_inputs,
      }))
      .reduce((acc, category) => {
        const { categoryName, expected_inputs, categoryId } = category;
        acc[categoryId] = expected_inputs.map((it) => ({
          label: it,
          value: it,
        }));
        return acc;
      }, {});

  const addInput = (inputObj) => {
    console.log(inputObj, "input object");
    console.log(expectedInputs, "expectedInputs");

    const updatedExpectedInputs = expectedInputs.filter(
      (flt) => flt.value !== inputObj.title
    );

    setExpectedInputs(updatedExpectedInputs);

    let newInputs = [...formFields.inputs];
    newInputs.push(inputObj);

    setFormFields({ ...formFields, inputs: newInputs });
  };

  const removeInput = (row) => {
    let catId = formFields.category_id;
    let input_title = row.title;

    let newInputs = [...formFields.inputs].filter(
      (item) => item.title !== input_title
    );
    setFormFields({ ...formFields, inputs: newInputs });

    const newObj = {
      label: input_title,
      value: input_title,
    };

    setExpectedInputs((prev) => [...prev, newObj]);
  };

  const handleSubmit = async () => {
    const mutationData = {
      ...formFields,
    };

    console.log("mutation data", mutationData);

    const isError = Object.values(formFields).filter((it) => !it.length).length;

    if (isError) {
      console.log(isError, "isError");
      return toast.error(`Please fill all inputs`);
    }

    await mutate(mutationData);
  };

  const clearFormFields = () => {
    setFormFields({
      country_id: user.country,
      category_id: "",
      name: "",
      inputs: [],
    });

    try {
      categoryInputRef.current.clearValue();
    } catch (ex) {
      toast.success(`successful`);
    }
  };

  const handleChange = (val, fieldName) => {
    if (fieldName === "category_id") {
      handleCategoryChange(val);
    } else {
      setFormFields({ ...formFields, [fieldName]: val });
    }
  };

  const handleCategoryChange = async (val) => {
    setExpectedInputs(mExpectedInputs[val]);

    setFormFields({ ...formFields, category_id: val });
  };

  return (
    <div className="font-poppins">
      <h2 className="text-[20px] font-[500]  pb-4">Create New Product</h2>

      <div className="mt-4 md:w-3/5 xl:w-2/3 space-y-4">
        <FormInputDropDown
          index="z-40"
          reff={categoryInputRef}
          placeholder={"Choose category"}
          data={caInputData || []}
          value={formFields.category_id}
          onChange={(e) => handleChange(e, "category_id")}
          label={"Category"}
        />

        <TextInput
          value={formFields.name}
          label={"Product Name"}
          placeholder={"Product name"}
          onChange={(e) => handleChange(e.target.value, "name")}
        />

        {formFields.name.length > 0 && (
          <div>
            <div className="w-full rounded-lg p-6 border border-[#00000029]/20 space-y-4">
              <FormProductInputs
                expectedInputs={expectedInputs}
                productInputs={productInputs}
                onAddInput={addInput}
              />
            </div>

            <div>
              <GeneralTable
                height={150}
                flag={{
                  title: "Remove",
                  action: (row) => {
                    removeInput(row);
                  },
                }}
                data={formFields.inputs}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={mtPending}
          className={`h-[54px] my-[45px] rounded-[5px] text-center ${
            mtPending ? "bg-gray-400" : "bg-[#82B22E]"
          }  font-[500] text-base text-white w-full leading-[24px]`}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateProductForm;
