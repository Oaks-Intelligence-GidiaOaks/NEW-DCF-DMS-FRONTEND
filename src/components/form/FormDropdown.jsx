import React from "react";

const FormDropdown = ({ onChange, data, label, placeholder, value }) => {
  return (
    <div>
      <label className="mb-4" htmlFor="">
        {label}
      </label>

      <div className="bg-white pl-2 pr-4 rounded-[5px] py-1 mt-1">
        <select
          onChange={onChange}
          value={value}
          name=""
          id=""
          className="border-none text-gray-400 outline-none active:border-none active:outline-none w-full h-[40px] px-3 rounded-[5px] bg-transparent"
        >
          <option label={placeholder} />
          {data?.map((item) => (
            <option
              key={item.value}
              label={item.label}
              value={item.value}
            ></option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FormDropdown;
