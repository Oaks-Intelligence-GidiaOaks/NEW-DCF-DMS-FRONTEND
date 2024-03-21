import React, { useEffect, useRef, useState } from "react";
import {
  FormDropdown,
  FormInput,
  FormInputDropDown,
  TagsInput,
  TextInput,
} from "../components/form";
import { GeneralTable } from "../components/charts";
import productInputs from "../../src/data/form/productInputs.json";
import { createProduct, getCategoryByCountry } from "../lib/service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/useAuth";
import { transformCategoryFormData } from "../lib/utils";
import FormProductInputs from "./FormProductInputs";
import { toast } from "react-toastify";

const CreateProductFormSA = ({ countryData }) => {
  const [formFields, setFormFields] = useState({
    country_id: "",
    category_id: "",
    name: "",
    inputs: [],
  });

  const countryInputRef = useRef();
  const categoryInputRef = useRef();
  const titleInputRef = useRef();
  const typesInputRef = useRef();

  const { mutate, isPending: mtPending } = useMutation({
    mutationKey: ["createProduct"],
    mutationFn: (prodData) => createProduct(prodData),
    onSuccess: (sx) => {
      toast.success(`Product created succesfuuly`);
      clearFormFields();
      location.reload();
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

  const {
    data: catByCountry,
    isLoading: catLoading,
    isSuccess: catSuccess,
    refetch,
  } = useQuery({
    queryKey: ["getCategoryByCountry"],
    queryFn: () => getCategoryByCountry(formFields.country_id),
    enabled: formFields.country_id.length > 0,
  });

  useEffect(() => {
    refetch();
  }, [refetch, formFields.country_id]);

  // component variables
  const [allExpectedInputs, setAllExpectedInputs] = useState();
  const [expectedInputs, setExpectedInputs] = useState([]);
  const [categories, setCategories] = useState(null);

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
    let newInputs = [...formFields.inputs];
    newInputs.push(inputObj);

    setFormFields({ ...formFields, inputs: newInputs });
  };

  const handleSubmit = () => {
    // e.preventDefault();

    const mutationData = {
      ...formFields,
    };

    console.log("mutation data", mutationData);

    const isError = Object.values(formFields).filter((it) => !it.length).length;

    if (isError) {
      console.log(isError, "isError");

      return toast.error(`Please fill all inputs`);
    }

    mutate(mutationData);
    clearFormFields();
  };

  const clearFormFields = () => {
    setFormFields({
      country_id: "",
      category_id: "",
      name: "",
      inputs: [],
    });

    countryInputRef.current.setValue("");
    categoryInputRef.current.setValue("");
  };

  const handleChange = (val, fieldName) => {
    if (fieldName === "country_id") {
      handleCountryChange(val);
    } else if (fieldName === "category_id") {
      handleCategoryChange(val);
    } else {
      setFormFields({ ...formFields, [fieldName]: val });
    }
  };

  const handleCountryChange = async (val) => {
    categoryInputRef.current.setValue("");

    setFormFields({ ...formFields, country_id: val, category_id: "" });
  };

  const handleCategoryChange = async (val) => {
    console.log("change", val);
    console.log("change 2", mExpectedInputs[val]);
    console.log("change 3", mExpectedInputs);

    setExpectedInputs(mExpectedInputs[val]);

    setFormFields({ ...formFields, category_id: val });
  };

  return (
    <div className="font-poppins">
      <h2 className="text-[20px] font-[500]  pb-4">Create New Product</h2>

      <div
        // action=""
        // onSubmit={handleSubmit}
        className="mt-4 md:w-3/5 xl:w-2/3 space-y-4"
      >
        <FormInputDropDown
          reff={countryInputRef}
          placeholder={"Choose country"}
          data={countryData}
          value={formFields.country_id}
          onChange={(e) => handleChange(e, "country_id")}
          label={"Country"}
        />

        <FormInputDropDown
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
                    let newInputs = [...formFields.inputs].filter(
                      (item) => item.title !== row.title
                    );

                    setFormFields({ ...formFields, inputs: newInputs });
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

export default CreateProductFormSA;
