import React from "react";
import { BackButton, CountCard } from "../../components/reusable";

import {
  FormButton,
  FormInput,
  FormInputDropDown,
  FormMultipleSelect,
} from "../../components/form";

const NewCountry = () => {
  return (
    <div className="mx-2 my-5 md:mx-[35px]">
      <div className="grid md:grid-cols-3 gap-y-4">
        <CountCard
          count={66}
          countStyles=" bg-[#FAF9F9] text-xs "
          styles=" bg-white "
          text="Total Countries"
        />

        <CountCard
          count={66}
          countStyles=" bg-[#FAF9F9] text-xs"
          styles=" bg-white"
          text="Total Countries"
        />

        <div className="col-span-2 md:col-span-1  ml-auto">
          <BackButton />
        </div>
      </div>

      <div className=" mt-[36px] w-full">
        <h3 className="mb-4 font-[500] text-xl leading-[30px] text-[#4A4848]">
          Assign New Country to Sub Admin
        </h3>

        <form action="" className="md:w-3/5 w-full border ">
          <FormMultipleSelect label="Sub Admin *" data={[]} />

          <FormMultipleSelect label="Country * *" data={[]} />

          <FormMultipleSelect label="State" data={[]} />

          <FormMultipleSelect label="LGA *" data={[]} />

          <FormButton buttonStyles="w-full rounded-[5px] " text="Assign" />
        </form>
      </div>
    </div>
  );
};

export default NewCountry;
