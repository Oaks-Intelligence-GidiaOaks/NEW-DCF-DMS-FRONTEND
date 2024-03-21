import React, { useRef, useState } from "react";
import { FormDropdown, FormInputDropDown, TagsInput } from "../components/form";

import productInputs from "../data/form/productInputs.json";
import { toast } from "react-toastify";

const FormProductInputs = ({ onAddInput, expectedInputs }) => {
  const [inputs, setInputs] = useState({
    title: "",
    input_type: "",
    options: [],
  });

  const titleRef = useRef();
  const typeRef = useRef();

  const clearInputs = () => {
    setInputs({ title: "", input_type: "", options: [] });

    titleRef.current.setValue("");
    typeRef.current.setValue("");
  };

  const addInput = (inputObj) => {
    console.log(inputObj.title.length, "inpinrns");

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
        reff={titleRef}
        label={"Input Title"}
        value={inputs.input_title}
        onChange={(e) => handleInputChange(e, "title")}
        placeholder="select input title"
        data={expectedInputs}
      />

      <FormInputDropDown
        reff={typeRef}
        label={"Input Type"}
        value={inputs.input_type}
        onChange={(e) => handleInputChange(e, "input_type")}
        placeholder="select input type"
        data={productInputs}
      />

      <TagsInput
        defaultValue={[]}
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
