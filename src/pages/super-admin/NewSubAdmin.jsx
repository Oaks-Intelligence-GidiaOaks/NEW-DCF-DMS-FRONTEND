import React, { useEffect, useRef, useState } from "react";
import { BackButton, CountCard } from "../../components/reusable";
import { Link } from "react-router-dom";
import {
  FormInput,
  FormInputDropDown,
  FormInputNumber,
  FormMultipleSelect,
  TextInput,
} from "../../components/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createUser, getAllCountries, getAllSubAdmin } from "../../lib/service";
import { ClipLoader } from "react-spinners";
import { transformCountryFormData } from "../../lib/utils";
// import axios from "axios";
import { IdTypes } from "../../data/form/others";
import { EditNote } from "@mui/icons-material";

const NewSubAdmin = () => {
  // tanstack
  const { data: countries, isSuccess: isCountryQuerySuccess } = useQuery({
    queryKey: ["getAllCountries"],
    queryFn: getAllCountries,
  });

  const { data: subAdmins, isSuccess: issubAdminsSuccess } = useQuery({
    queryKey: ["getAllSubAdmin"],
    queryFn: getAllSubAdmin,
  });

  const { mutate, isPending: mtPending } = useMutation({
    mutationFn: (formData) => createUser(formData),
    onSuccess: () => {
      toast.success(`created sub admin successfully..`);
      clearFormFields();
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

  const [formFields, setFormFields] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "SubAdmin",
    country: "",
    phone_number: "",
    identity_number: "",
    identity_document: "",
    // states: [],
    // districts: [],
    identityType: "",
  });

  // reference variables
  const countryRef = useRef("");
  // const stateRef = useRef("");
  // const districtsRef = useRef("");
  const identityRef = useRef("");
  const ref = useRef(null);

  // all component variables
  // const [statesData, setStatesData] = useState([]);
  // const [districtsData, setDistrictsData] = useState([]);

  const totalAdmins = subAdmins?.data ? subAdmins.data.totalSubAdmin : 0;
  const newAdmins = subAdmins?.data ? subAdmins.data.newlyAdded : 0;
  const imageMimeType = /image\/(png|jpg|jpeg)/i;
  const [image, setImage] = useState(null);

  useEffect(() => {
    let fileReader,
      isCancel = false;

    if (image) {
      fileReader = new FileReader();

      fileReader.onload = (e) => {
        const { result } = e.target;

        if (result && !isCancel) {
          setFormFields({
            ...formFields,
            identity_document: result,
          });
        }
      };

      fileReader.readAsDataURL(image);
    }
  }, [image]);

  let countryData = isCountryQuerySuccess
    ? transformCountryFormData(countries.data.data)
    : [];

  const clearFormFields = () => {
    setFormFields({
      first_name: "",
      last_name: "",
      email: "",
      role: "SubAdmin",
      country: "",
      phone_number: "",
      identity_number: "",
      identity_document: "",
      // states: [],
      // districts: [],
      identityType: "",
    });

    try {
      countryRef.current.clearValue();
      // identityRef.current.clearValue();
    } catch (err) {
      toast.success(`successfull`);
    }

    // stateRef.current.setValue([]);
    // districtsRef.current.setValue([]);
    setImage(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const isError = Object.values(formFields)?.filter(
      (it) => !it.length
    )?.length;

    const mutationData = {
      ...formFields,
    };

    if (isError) {
      return toast.error(`Please fill all inputs`);
    }
    const formData = new FormData();

    formData.append("country", mutationData.country);
    formData.append("email", mutationData.email);
    formData.append("first_name", mutationData.first_name);
    formData.append("last_name", mutationData.last_name);
    formData.append("identityType", mutationData.identityType);
    formData.append("identity_document", mutationData.identity_document);
    formData.append("identity_number", mutationData.identity_number);
    formData.append("phone_number", mutationData.phone_number);
    formData.append("role", mutationData.role);

    // mutationData.states.forEach((st) => formData.append("states", st));
    // mutationData.districts.forEach((dst) => formData.append("districts", dst));
    await mutate(formData);
  };

  const handleChange = (val, fieldName) => {
    if (fieldName === "country") {
      handleCountryChange(val);
    } else if (fieldName === "states") {
      // handleStateChange(val);
    } else if (fieldName === "districts") {
      // handleDistrictsChange(val);
    } else {
      setFormFields({ ...formFields, [fieldName]: val });
    }
  };

  const handleCountryChange = async (countryId) => {
    // const { data } = await axios.get(`state/country/${countryId}`);
    // const tData = data?.data.length ? transformCountryFormData(data.data) : [];
    // console.log(tData, "states data");
    // setStatesData(tData);
    setFormFields({ ...formFields, country: countryId });
  };

  // const handleStateChange = async (states) => {
  //   const stateIds = states.length ? states.map((item) => item.value) : [];

  //   // get all districts for all states passed.
  //   const { data } = await axios.post(`district/multiple`, {
  //     states: stateIds,
  //   });

  //   const tData = data?.data.length ? transformCountryFormData(data.data) : [];
  //   setDistrictsData(tData);
  //   setFormFields({ ...formFields, states: stateIds });
  // };

  // const handleDistrictsChange = async (lgas) => {
  //   const tData = lgas.map((item) => item.value);
  //   setFormFields({ ...formFields, districts: tData });
  // };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];

    if (!file.type.match(imageMimeType)) {
      alert("image mime type is not valid");
      return;
    }

    setImage(file);
  };

  return (
    <div className="mx-2 lg:mx-[50px] my-[30px] font-poppins">
      {/*  */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-6">
        <CountCard
          count={totalAdmins}
          text="Total Sub Admins"
          styles=" !bg-white"
        />
        <CountCard
          count={newAdmins}
          text="Recently added"
          styles=" !bg-white"
        />

        <Link
          className="ml-auto col-span-2 md:col-span-1 "
          to="/super_admin/admins"
        >
          <BackButton />
        </Link>
      </div>

      <div className="mt-5">
        <h3 className="text-[20px] font-[500] pb-4">
          Create New Sub Admin Profile
        </h3>

        <form action="" onSubmit={onSubmit} className="lg:w-3/5">
          {/* image upload input */}

          <TextInput
            onChange={(e) => handleChange(e.target.value, "first_name")}
            value={formFields.first_name}
            label="First name"
            placeholder="First name"
          />

          <TextInput
            label="Last name"
            placeholder="Last name"
            value={formFields.last_name}
            onChange={(e) => handleChange(e.target.value, "last_name")}
          />

          <FormInput
            label="Email address"
            placeholder="Email"
            type="email"
            value={formFields.email}
            onChange={(e) => handleChange(e.target.value, "email")}
          />

          <FormInputNumber
            label="Contact number *"
            placeholder="Contact number"
            value={formFields.phone_number}
            onChange={(e) => handleChange(e.target.value, "phone_number")}
          />

          <FormInputDropDown
            index="z-50"
            reff={countryRef}
            label="Country *"
            data={countryData}
            onChange={(e) => handleChange(e, "country")}
          />

          {/* <FormMultipleSelect
            index="z-40"
            reff={stateRef}
            label="State *"
            data={statesData}
            onChange={(e) => handleChange(e, "states")}
          /> */}

          {/* <FormMultipleSelect
            index="z-30"
            reff={districtsRef}
            label="Districts *"
            data={districtsData}
            onChange={(e) => handleChange(e, "districts")}
          /> */}

          <FormInputDropDown
            index="z-20"
            reff={identityRef}
            label="Identification(ID) type "
            data={IdTypes}
            onChange={(e) => handleChange(e, "identityType")}
          />

          <FormInputNumber
            value={formFields.identity_number}
            onChange={(e) => handleChange(e.target.value, "identity_number")}
            label="Identification(ID) number"
            placeholder="ID number"
          />

          <input
            type="file"
            name=""
            id=""
            ref={ref}
            onChange={handleImageSelect}
            accept="image/*"
          />

          <div className="h-24 w-full rounded-lg bg-white drop-shadow-md">
            {formFields.identity_document && (
              <img
                src={formFields.identity_document}
                alt="file data url"
                className="h-full w-full bg-black"
              />
            )}
          </div>

          <button
            disabled={mtPending}
            className={`h-[54px] mt-[42px] w-full text-center text-white   ${
              mtPending ? "bg-gray-400" : "bg-oaksgreen"
            }   rounded-[5px]`}
          >
            {mtPending ? (
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
