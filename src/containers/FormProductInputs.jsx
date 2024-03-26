import React, { useRef, useState } from "react";
import {
  FormDropdown,
  FormInputDropDown,
  InputTypeDropdown,
  TagsInput,
} from "../components/form";

import productInputs from "../data/form/productInputs.json";
import { toast } from "react-toastify";

const FormProductInputs = ({ onAddInput, expectedInputs }) => {
  console.log(expectedInputs, "expected inputs");
  // console.log(onAddInput, "on Add inputs");

  const [inputs, setInputs] = useState({
    title: "",
    input_type: "",
    options: [],
  });

  const titleRef = useRef();
  const typeRef = useRef();

  const clearInputs = () => {
    setInputs({ title: "", input_type: "", options: [] });

    try {
      titleRef.current.clearValue();
      // typeRef.current.clearValue();
    } catch (ex) {
      toast.success(`input added`);
    }
  };

  const addInput = (inputObj) => {
    if (inputObj.title?.length < 1 || inputObj.input_type?.length < 1) {
      return toast.error(`Please complete input fields`);
    }

    clearInputs();
    onAddInput(inputObj);
  };

  const handleInputChange = async (val, fieldName) => {
    setInputs({ ...inputs, [fieldName]: val });
  };

  return (
    <div className="space-y-4">
      <FormInputDropDown
        index="z-50"
        reff={titleRef}
        label={"Input Title"}
        value={inputs.input_title}
        onChange={(e) => handleInputChange(e, "title")}
        placeholder="select input title"
        data={expectedInputs}
      />

      <InputTypeDropdown
        index="z-40"
        reff={typeRef}
        label={"Input Type"}
        value={inputs.input_type}
        onChange={(e) => handleInputChange(e, "input_type")}
        placeholder="select input type"
        data={productInputs}
      />

      <TagsInput
        tags={inputs.options}
        onChange={(val) => handleInputChange(val, "options")}
        disabled={inputs.input_type !== "dropdown"}
        label={"Option(s)"}
      />

      <button
        onClick={() => addInput(inputs)}
        className="h-[48px] w-full rounded-[5px] text-center font-[500] text-xs text-[#82B22E] mt-[30px] border border-[#82B22E]"
      >
        Add Input
      </button>
    </div>
  );
};

export default FormProductInputs;
