import React, { useEffect, useRef, useState } from "react";
import {
  FormInput,
  FormInputDropDown,
  FormInputNumber,
  TextInput,
} from "../../components/form";
import { AllStates, lgasByState } from "../../data/form/states";
import { allLgasByState } from "../../data/form/allLgasByState";
import { IdTypes } from "../../data/form/others";
import axios from "axios";
import FormMultipleSelect from "../../components/form/FormMultipleSelect";
import { useAuth } from "../../context";
import { EditNote, Email } from "@mui/icons-material";
import { RingsCircle } from "../../components/reusable";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createUser,
  getAllCountryStates,
  getAllStateDistricts,
  getMultipleDistricts,
  getMyProfile,
} from "../../lib/service";
import { toast } from "react-toastify";

const AddTeamLead = () => {
  const { user } = useAuth();
  let avaterRef = useRef(null);

  const [stateIds, setStateIds] = useState([]);
  const [lgaIds, setLgaIds] = useState([]);
  const [image, setImage] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [file, setFile] = useState(null);
  const [identityImage, setIdentityImage] = useState(null);

  const { mutate, isPending: mutateLoading } = useMutation({
    mutationKey: ["createUser"],
    mutationFn: (data) => createUser(data),
    onSuccess: (sx) => {
      toast.success(sx.data.message);
      resetForm();
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

  // get team lead profile
  const {
    data: profile,
    isLoading: prLoading,
    isSUccess: prSuccess,
  } = useQuery({
    queryKey: ["getMyProfile"],
    queryFn: getMyProfile,
  });

  // get country states
  const {
    data: countryStates,
    isLoading: stLoading,
    isSUccess: stSuccess,
  } = useQuery({
    queryKey: ["getAllCountryStates"],
    queryFn: () => getAllCountryStates(user.country),
  });

  // get state districts
  const {
    data: stateDistricts,
    isLoading: dsLoading,
    isSUccess: dsSuccess,
    refetch,
  } = useQuery({
    queryKey: ["getAllStateDistricts"],
    queryFn: () => getMultipleDistricts(stateIds),
    enabled: !!stateIds.length,
  });

  // component variables
  let cStates = countryStates?.data.data.map((it) => ({
    value: it._id,
    label: it.name,
  }));

  let cDistricts = stateDistricts?.data.data.map((it) => ({
    value: it._id,
    label: it.name,
  }));

  useEffect(() => {
    refetch();
  }, [stateIds, refetch]);

  const [formFields, setFormFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    tel: "",
    idNo: "",
    idType: "",
  });

  const imageMimeType = /image\/(png|jpg|jpeg)/i;

  useEffect(() => {
    let fileReader,
      isCancel = false;

    if (image) {
      fileReader = new FileReader();

      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setAvatar(result);
        }
      };

      fileReader.readAsDataURL(image);
    }

    if (file) {
      fileReader = new FileReader();

      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setIdentityImage(result);
        }
      };

      fileReader.readAsDataURL(file);
    }
  }, [image, file]);

  const resetForm = () => {
    setFormFields({
      firstName: "",
      lastName: "",
      email: "",
      tel: "",
      idNo: "",
      idType: "",
    });

    setStateIds([]);
    setLgaIds([]);
    setIdentityImage(null);
    setAvatar(null);
  };

  const handleStateChange = (selectedOptions) => {
    setStateIds(selectedOptions.map((it) => it.value));
    setLgaIds([]);
  };

  const handleLgaChange = (selectedOptions) => {
    setLgaIds(selectedOptions.map((it) => it.value));
  };

  const handleIdTypeChange = (selectedValue) => {
    setFormFields((prev) => ({ ...prev, idType: selectedValue }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];

    if (!file.type.match(imageMimeType)) {
      alert("image mime type is not valid");
      return;
    }

    setFile(file);
  };

  const handleAvaterSelect = (e) => {
    let selectedFile = e.target.files[0];

    if (!selectedFile.type.match(imageMimeType)) {
      alert("image mime type is not valid");
      return;
    }

    setImage(selectedFile);
  };

  const handlePhotoClick = () => {
    avaterRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, tel, idNo, idType } = formFields;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !tel ||
      !idNo ||
      !idType ||
      !identityImage ||
      !avatar ||
      !stateIds.length ||
      !lgaIds.length
    ) {
      toast.error("Please input all fields");

      return;
    }

    let transformedStates = stateIds;
    let transformedLgas = lgaIds;
    const formData = new FormData();

    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("phone_number", tel);
    formData.append("identityType", idType);
    formData.append("identity_number", idNo);
    formData.append("identity_document", identityImage);
    formData.append("profile_image", avatar);
    formData.append("role", "TeamLead");
    formData.append("country", user.country);

    // Append list items to form data
    transformedLgas.forEach((lga) => formData.append("districts", lga));
    transformedStates.forEach((state) => formData.append("states", state));

    await mutate(formData);
  };

  return (
    <div className="lg:w-4/5 mx-auto py-6 text-sm">
      <div className="mt-3 mb-4 ">
        <p className="text-base font-bold">Create new Team Lead profile</p>
      </div>

      <div className="mx-auto w-fit">
        <img
          src={avatar}
          alt="img"
          className="h-44 w-44 rounded-full bg-green-200"
        />

        <p
          onClick={handlePhotoClick}
          className="flex justify-center cursor-pointer items-center py-3"
        >
          <input
            type="file"
            name=""
            className="hidden"
            ref={avaterRef}
            onChange={handleAvaterSelect}
            id=""
            accept="image/*"
          />
          <span className="">Add photo</span>
          <EditNote />
        </p>
      </div>

      <form action="" className="lg:w-5/6" onSubmit={handleSubmit}>
        <TextInput
          placeholder="First name"
          label="First name"
          value={formFields.firstName}
          onChange={(e) =>
            setFormFields((prev) => ({ ...prev, firstName: e.target.value }))
          }
        />
        <TextInput
          placeholder="Last name"
          label="Last name"
          value={formFields.lastName}
          onChange={(e) =>
            setFormFields((prev) => ({ ...prev, lastName: e.target.value }))
          }
        />
        <TextInput
          placeholder="Email"
          label="Email address"
          value={formFields.email}
          type={Email}
          onChange={(e) =>
            setFormFields((prev) => ({ ...prev, email: e.target.value }))
          }
        />

        <FormInputNumber
          label="Contact number"
          onChange={(e) =>
            setFormFields((prev) => ({ ...prev, tel: e.target.value }))
          }
          placeholder="090 26***"
          value={formFields.tel}
        />

        <FormMultipleSelect
          label="States"
          data={cStates}
          index="z-30"
          onChange={handleStateChange}
        />

        {/* {states.length > 0 && ( */}
        <FormMultipleSelect
          label="Districts"
          onChange={handleLgaChange}
          data={cDistricts}
          index="z-20"
        />
        {/* )} */}

        <FormInputDropDown
          label="Identification(ID) type"
          data={IdTypes}
          index="z-10"
          value={formFields.idType}
          onChange={handleIdTypeChange}
        />

        <FormInputNumber
          placeholder="ID number"
          label="Identification(ID) Number"
          value={formFields.image}
          onChange={(e) =>
            setFormFields((prev) => ({ ...prev, idNo: e.target.value }))
          }
        />

        <input
          type="file"
          name=""
          id=""
          onChange={handleImageSelect}
          accept="image/*"
        />

        <div className="h-32 w-full rounded-lg bg-white drop-shadow-md">
          {identityImage && (
            <img
              src={identityImage}
              alt="file data url"
              className="h-full w-full bg-black"
            />
          )}
        </div>

        <button className="w-full mt-4 text-white grid place-items-center p-3 rounded bg-oaksgreen">
          {mutateLoading ? <RingsCircle /> : "Submit"}
        </button>
      </form>
    </div>
  );
  ``;
};

export default AddTeamLead;
