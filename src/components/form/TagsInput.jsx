import React, { useState } from "react";
import { useController } from "react-hook-form";
import { IoCloseSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { CiCirclePlus } from "react-icons/ci";

const TagsInput = ({ label, disabled, defaultValue = [], onChange }) => {
  const [value, setValue] = useState("");
  const [tags, setTags] = useState(defaultValue);

  const Tag = ({ text, formProps }) => {
    const removeSkill = () => {
      const newSkills = tags?.filter((it, i) => it !== text);
      setTags(newSkills);
      onChange(newSkills);
    };

    return (
      <div
        onClick={removeSkill}
        className="cursor-pointer p-2 rounded-lg flex items-center gap-[6px] bg-white"
      >
        <span className="text-[#212121] font-[500] text-sm leading-[21px]">
          {text}
        </span>

        <IoCloseSharp size={14} />
      </div>
    );
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const addTag = (val) => {
    const lowerCaseVal = val.toString().toLowerCase();
    const values = [...tags, lowerCaseVal];
    const set = new Set(values);

    setValue("");
    const setData = Array.from([...set]);
    setTags(setData);
    onChange(setData);
  };

  return (
    <div className="flex flex-col gap-2 py-3 px-2 text-sm">
      <label htmlFor="">{label}</label>

      <div
        className={`w-full px-[25px] min-h-[50px] flex items-center bg-white text-xs rounded drop-shadow-sm `}
      >
        <div className="flex items-center flex-wrap">
          {tags.map((item, index) => (
            <Tag text={item} key={index} />
          ))}

          <input
            disabled={disabled}
            type="text"
            className="flex-1 h-[30px] mn-w-[30px] outline-none actve:outline-none ml-1"
            value={value}
            onChange={handleChange}
          />
        </div>

        <div
          className="h-[26px] w-[26px] ml-auto"
          onClick={() => addTag(value)}
        >
          <CiCirclePlus size={26} />
        </div>
      </div>
    </div>
  );
};

export default TagsInput;
