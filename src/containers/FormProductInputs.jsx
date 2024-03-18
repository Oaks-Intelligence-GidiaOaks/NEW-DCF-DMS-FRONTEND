import React, { useState } from "react";
import { FormDropdown, TagsInput } from "../components/form";

import productInputs from "../data/form/productInputs.json";

const FormProductInputs = ({ onAddInput, expectedInputs }) => {
  const [inputs, setInputs] = useState({
    title: "",
    input_type: "",
  });

  const clearInputs = () => {
    setInputs({ title: "", input_type: "" });
  };

  const addInput = (inputObj) => {
    clearInputs();
    onAddInput(inputObj);
  };

  const handleInputChange = async (val, fieldName) => {
    setInputs({ ...inputs, [fieldName]: val });
  };

  return (
    <div className="space-y-4">
      <FormDropdown
        label={"Input Title"}
        value={inputs.input_title}
        onChange={(e) => handleInputChange(e.target.value, "title")}
        placeholder="select input title"
        data={expectedInputs}
      />

      <FormDropdown
        label={"Input Type"}
        value={inputs.input_type}
        onChange={(e) => handleInputChange(e.target.value, "input_type")}
        placeholder="select input type"
        data={productInputs}
      />

      <TagsInput
        defaultValue={[]}
        onChange={(val) => handleInputChange(val)}
        disabled={true}
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
