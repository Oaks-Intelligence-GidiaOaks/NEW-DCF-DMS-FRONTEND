import React, { useRef, useState } from "react";
import { BackButton, CountCard } from "../../components/reusable";
import { Link } from "react-router-dom";
import {
  FormInput,
  FormInputDropDown,
  FormMultipleSelect,
} from "../../components/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createUser,
  getAllCountries,
  getAllCountryStates,
} from "../../lib/service";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { transformCountryFormData } from "../../lib/utils";
import axios from "axios";
import { IdTypes } from "../../data/form/others";

const NewSubAdmin = () => {
  // tanstack
  const queryClient = useQueryClient();

  const {
    data: countries,
    isLoading,
    isError,
    isSuccess: isCountryQuerySuccess,
  } = useQuery({
    queryKey: ["getAllCountries"],
    queryFn: getAllCountries,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      role: "SubAdmin",
      country: "",
      phone_number: "",
      identity_number: "",
      identity_document: "",
      profile_image: "",
    },
  });

  const [formFields, setFormFields] = useState({
    country: "",
    states: [],
    districts: [],
    identity_document: "",
    profile_image: "",
    identityType: "",
  });

  // reference variables
  const countryRef = useRef("");
  const stateRef = useRef("");
  const districtsRef = useRef("");
  const identityRef = useRef("");

  // all component variables
  const [statesData, setStatesData] = useState([]);
  const [districtsData, setDistrictsData] = useState([]);

  const isBtnActive = Object.keys(errors).length < 1;
  let countryData = isCountryQuerySuccess
    ? transformCountryFormData(countries.data.data)
    : [];

  const {
    mutate,
    isPending,
    isSuccess: isMutateSuccess,
  } = useMutation({
    mutationFn: (formData) => createUser(formData),
    onSuccess: () => {
      toast.success(`created sub admin successfully..`);
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

  const clearFormFields = () => {
    setFormFields({
      country: "",
      states: [],
      districts: [],
      identity_document: "",
      profile_image: "",
      identityType: "",
    });

    // countryRef.current.clearValue();
  };

  const onSubmit = async (data) => {
    const mutationData = {
      ...data,
      ...formFields,
    };

    const formData = new FormData();

    formData.append("country", mutationData.country);
    formData.append("email", mutationData.email);
    formData.append("first_name", mutationData.first_name);
    formData.append("last_name", mutationData.last_name);
    formData.append("identityType", mutationData.identityType);
    formData.append("identity_document", mutationData.identity_document);
    formData.append("identity_number", mutationData.identity_number);
    formData.append("phone_number", mutationData.phone_number);
    formData.append("profile_image", mutationData.profile_image);
    formData.append("role", mutationData.role);

    mutationData.states.map((st) => formData.append("states", st));
    mutationData.districts.map((dst) => formData.append("districts", dst));

    // await mutate(formData);
    console.log(mutationData);
    // reset();
    // clearFormFields();
  };

  const handleChange = (val, fieldName) => {
    if (fieldName === "country") {
      handleCountryChange(val);
    } else if (fieldName === "states") {
      handleStateChange(val);
    } else if (fieldName === "districts") {
      handleDistrictsChange(val);
    } else {
      setFormFields({ ...formFields, [fieldName]: val });
    }
  };

  const handleCountryChange = async (countryId) => {
    const { data } = await axios.get(`state/country/${countryId}`);
    const tData = data?.data.length ? transformCountryFormData(data.data) : [];
    console.log(tData, "tData");
    setStatesData(tData);
    setFormFields({ ...formFields, country: countryId });
  };

  const handleStateChange = async (states) => {
    const stateIds = states.length ? states.map((item) => item.value) : [];

    // get all districts for all states passed.
    const { data } = await axios.post(`district/multiple`, {
      states: stateIds,
    });

    const tData = data?.data.length ? transformCountryFormData(data.data) : [];
    setDistrictsData(tData);
    setFormFields({ ...formFields, states: stateIds });
  };

  const handleDistrictsChange = async (lgas) => {
    const tData = lgas.map((item) => item.value);
    setFormFields({ ...formFields, districts: tData });
  };

  return (
    <div className="mx-2 lg:mx-[50px] my-[30px]">
      {/*  */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-6">
        <CountCard count={585} text="Total Enumerators" styles=" !bg-white" />
        <CountCard count={585} text="Recently added" styles=" !bg-white" />

        <Link
          className="ml-auto col-span-2 md:col-span-1 "
          to="/super_admin/admins"
        >
          <BackButton />
        </Link>
      </div>

      <div className="mt-5">
        <h3 className="">Create New Sub Admin Profile</h3>

        <form action="" onSubmit={handleSubmit(onSubmit)} className="lg:w-3/5">
          {/* image upload input */}

          <FormInput
            formProps={register("first_name", {
              required: "First name is required",
            })}
            errorMessage={errors.first_name?.message}
            label="First name"
            placeholder="First name"
          />

          <FormInput
            label="Last name"
            placeholder="First name"
            formProps={register("last_name", {
              required: "Last name is reqiuired",
            })}
            errorMessage={errors.last_name?.message}
          />

          <FormInput
            formProps={register("email", {
              required: "email is reqiuired",
            })}
            errorMessage={errors.email?.message}
            label="Email address"
            placeholder="Email"
            type="email"
          />

          <FormInput
            formProps={register("phone_number", {
              required: "contact number is reqiuired",
            })}
            errorMessage={errors.phone_number?.message}
            label="Contact number *"
            placeholder="Contact number"
          />

          <div className="z-[99]">
            <FormInputDropDown
              reff={countryRef}
              label="Country *"
              data={countryData}
              onChange={(e) => handleChange(e, "country")}
            />
          </div>

          <div className="z-40">
            <FormMultipleSelect
              reff={stateRef}
              label="State *"
              data={statesData}
              onChange={(e) => handleChange(e, "states")}
            />
          </div>

          <div className="z-30">
            <FormMultipleSelect
              reff={districtsRef}
              label="Districts *"
              data={districtsData}
              onChange={(e) => handleChange(e, "districts")}
            />
          </div>

          <div className="z-20">
            <FormInputDropDown
              reff={identityRef}
              label="Identification(ID) type "
              data={IdTypes}
              onChange={(e) => handleChange(e, "identityType")}
            />
          </div>

          {/* upload id preview */}
          <div className=""></div>

          <FormInput
            formProps={register("identity_number", {
              required: "identity number is reqiuired",
            })}
            errorMessage={errors.identity_number?.message}
            label="Identification(ID) number"
            placeholder="ID number"
          />

          <button
            disabled={!isBtnActive || isPending}
            className={`h-[54px] mt-[42px] w-full text-center text-white bg-oaksgreen  rounded-[5px]
            ${!isBtnActive && " !cursoor-not-allowed !bg-gray-200"}
            `}
          >
            {isPending ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              <span>Submit</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewSubAdmin;
