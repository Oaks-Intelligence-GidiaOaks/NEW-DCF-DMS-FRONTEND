import React from "react";

const TextInput = ({
  placeholder,
  label,
  value,
  readOnly,
  onChange,
  errorMessage,
}) => (
  <div className="flex flex-col gap-2 py-3">
    <label htmlFor="">{label}</label>

    <input
      type="text"
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      readOnly={readOnly}
      className="p-3 active:outline-none border-none outline-none rounded bg-white drop-shadow-sm text-gray-500"
    />
    {/* <span className="text-[10px] text-red-300">{errorMessage}</span> */}
  </div>
);

export default TextInput;
