import React from "react";
import { BackButton, CountCard } from "../../components/reusable";

import {
  FormButton,
  FormInput,
  FormInputDropDown,
  FormMultipleSelect,
} from "../../components/form";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getAllSubAdmin } from "../../lib/service";

const NewCountry = () => {
  const {
    data: subAdmins,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getAllSubAdmin"],
    queryFn: getAllSubAdmin,
  });

  const {
    mutate,
    isPending,
    isSuccess: isMutateSuccess,
  } = useMutation({
    mutationFn: (formData) => createUser(formData),
    onSuccess: () => {
      toast.success(`created sub admin successfully..`);
      clearFormFields();
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

  // component variables
  let newAdminCount = subAdmins?.data ? subAdmins.data.newlyAdded : 0;
  let totalCountries = subAdmins?.data ? subAdmins.data.totalSubAdmin : 0;

  const clearFormFields = () => {
    //
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="mx-2 my-5 md:mx-[35px]">
      <div className="grid md:grid-cols-3 gap-y-4">
        <CountCard
          count={newAdminCount}
          countStyles=" bg-[#FAF9F9] text-xs "
          styles=" bg-white "
          text="Newly Added"
        />

        <CountCard
          count={totalCountries}
          countStyles=" bg-[#FAF9F9] text-xs"
          styles=" bg-white"
          text="Total Countries"
        />

        <Link
          to="/super_admin/admins"
          className="col-span-2 md:col-span-1  ml-auto"
        >
          <BackButton />
        </Link>
      </div>

      <div className=" mt-[36px] w-full">
        <h3 className="mb-4 font-[500] text-xl leading-[30px] text-[#4A4848]">
          Assign New Country to Sub Admin
        </h3>

        <form action="" onSubmit={handleSubmit} className="md:w-3/5 w-full">
          <FormInputDropDown label="Sub Admin *" data={[]} />

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
