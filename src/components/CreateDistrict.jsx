import React, { useState } from "react";
import { FormInputDropDown, FormMultipleSelect, TextInput } from "./form";
import { createDistrict } from "./../lib/service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const CreateDistrict = ({ onclick, cStates }) => {
  const [stateId, setStateId] = useState("");
  const [district, setDistrict] = useState("");
  const { mutate, isPending: mutateLoading } = useMutation({
    mutationKey: ["createDistrict"],
    mutationFn: (data) => createDistrict(data),
    onSuccess: (sx) => {
      toast.success(sx.data.message);
      resetForm();
      // location.reload();
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

  const resetForm = () => {
    setStateId("");
    setDistrict("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: district,
      state_id: stateId,
    };
    console.log(data);
    await mutate(data);
    onclick();
  };

  // const handleStateChange = (selectedOptions) => {
  //   setStateId(selectedOptions.map((it) => it.value));
  //   setStateId(selectedOptions.map((it) => it.value));
  //   setLgaIds([]);
  // };
  const handleStateChange2 = (selectedOptions) => {
    setStateId(selectedOptions);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center rounded-lg">
      <div className="bg-white relative rounded-lg md:w-[400px] lg:w-[500px] p-10">
        <div
          className="absolute top-2 right-2 cursor-pointer hover:bg-slate-400"
          onClick={onclick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>
        {/* <PollSurveyHeader title={"Create Poll"} /> */}
        <form onSubmit={handleSubmit}>
          {/* <FormMultipleSelect
            label="States"
            data={cStates}
            index="z-30"
            onChange={handleStateChange}
          /> */}
          <FormInputDropDown
            label="States"
            data={cStates}
            index="z-30"
            onChange={handleStateChange2}
          />
          <TextInput
            placeholder="Enter District"
            label="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            // value={formFields.firstName}
            // onChange={(e) =>
            //   setFormFields((prev) => ({ ...prev, firstName: e.target.value }))
            // }
          />

          <button className="bg-primary-green w-full rounded-lg p-2 font-semibold text-white">
            Create District
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDistrict;
