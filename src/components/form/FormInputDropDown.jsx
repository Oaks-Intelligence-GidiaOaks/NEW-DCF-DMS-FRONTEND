import React, { useState } from "react";
import Select from "react-select";

const FormInputDropDown = ({
  label,
  data,
  index,
  onChange,
  formProps,
  reff,
}) => {
  const [value, setValue] = useState("");

  const handleChange = (selectedOption) => {
    setValue(selectedOption);
    onChange(selectedOption.value);
  };

  return (
    <div className="flex flex-col gap-2 py-3 px-2 text-sm">
      <label htmlFor="">{label}</label>

      <div
        className={`w-full ${index} bg-white text-xs rounded drop-shadow-sm`}
      >
        <Select
          {...formProps}
          options={data}
          value={value}
          setValue={setValue}
          onChange={handleChange}
          ref={reff}
        />
      </div>
    </div>
  );
};

export default FormInputDropDown;
