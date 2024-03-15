import React from "react";

const FormInput = ({
  placeholder,
  type,
  label,
  value,
  readOnly,
  formProps,
  errorMessage,
}) => (
  <div className="flex flex-col gap-2 py-3">
    <label htmlFor="">{label}</label>
    <input
      type={type ? type : "text"}
      placeholder={placeholder}
      {...formProps}
      value={value}
      readOnly={readOnly}
      className="p-3 active:outline-none border-none outline-none rounded bg-white drop-shadow-sm text-gray-500"
    />
    <span className="text-[10px] text-red-300">{errorMessage}</span>
  </div>
);

export default FormInput;
