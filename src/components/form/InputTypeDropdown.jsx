import React, { useState } from "react";
import Select from "react-select";

const InputTypeDropdown = ({
  label,
  data,
  index,
  onChange,
  formProps,
  reff,
}) => {
  const [value, setValue] = useState("");

  const handleChange = (selectedOption) => {
    console.log(selectedOption, "selectedOption");

    setValue(selectedOption);
    onChange(selectedOption.value);
  };

  let availableData = data?.filter((it) => it.value !== value.value);

  return (
    <div className="flex flex-col gap-2 py-3 px-2 text-sm">
      <label htmlFor="">{label}</label>

      <div
        className={`w-full ${index} bg-white text-xs rounded drop-shadow-sm`}
      >
        <Select
          {...formProps}
          options={availableData}
          value={value}
          setValue={setValue}
          onChange={handleChange}
          ref={reff}
        />
      </div>
    </div>
  );
};

export default InputTypeDropdown;
