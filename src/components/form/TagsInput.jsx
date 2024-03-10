import React, { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

const TagsInput = ({ label, onChange }) => {
  const [value, setValue] = useState("");
  const [tags, setTags] = useState([]);

  const Tag = ({ text }) => {
    const removeSkill = () => {
      const newSkills = tags?.filter((it, i) => it !== text);
      setTags(newSkills);
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const toLowerCaseValue = e.target.value.toString().toLowerCase();

      const values = [...tags, toLowerCaseValue];
      const set = new Set(values);
      setValue("");

      setTags(Array.from([...set]));
    }
  };

  return (
    <div className="flex flex-col gap-2 py-3 px-2 text-sm">
      <label htmlFor="">{label}</label>

      <div
        className={`w-full px-[25px] min-h-[50px] flex items-center flex-wrap bg-white text-xs rounded drop-shadow-sm `}
      >
        {tags.map((item, index) => (
          <Tag text={item} key={index} />
        ))}
        <input
          type="text"
          className="flex-1 mn-w-[30px] outline-none actve:outline-none ml-1"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default TagsInput;
