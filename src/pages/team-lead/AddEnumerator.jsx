import React, { useEffect, useState, useRef } from "react";
import {
  FormInput,
  FormInputDropDown,
  FormInputNumber,
  FormMultipleSelect,
  TextInput,
} from "../../components/form";
import { IdTypes } from "../../data/form/others";
import axios from "axios";
import { useAuth } from "../../context";
import { useLocation, useNavigate } from "react-router-dom";
import { RingsCircle } from "../../components/reusable";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createUser, getAllEnumerators, getAllStates } from "../../lib/service";
import { toast } from "react-toastify";

const AddEnumerator = () => {
  const { user } = useAuth();

  console.log("user", user);

  const {
    data: enumerators,
    isLoading: enumLoading,
    isSUccess: enumSuccess,
  } = useQuery({
    queryKey: ["getAllEnumerators"],
    queryFn: getAllEnumerators,
  });

  // replace with get user states
  // const {
  //   data: states,
  //   isLoading: stLoading,
  //   isSUccess: stSuccess,
  // } = useQuery({
  //   queryKey: ["getAllStates"],
  //   queryFn: getAllStates,
  // });

  const { mutate, isLoading: mutateLoading } = useMutation({
    mutationKey: ["createUser"],
    mutationFn: (data) => createUser(data),
    onSuccess: (sx) => {
      toast.success(sx.data.message);
      // clear form
      resetForm();
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

  // component variables
  let enumCount = enumSuccess && {
    totalEnumerators: enumerators.data.totalEnumerators,
    newlyAdded: enumerators.data.newlyAdded,
  };

  const navigate = useNavigate();
  const ref = useRef(null);

  // replace with get user states query
  const teamLeadStates = user.states.map((st) => ({ label: st, value: st }));

  // replace with get user districts query
  const teamLeadLgas = user.districts.map((st) => ({ label: st, value: st }));

  const [formFields, setFormFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    tel: "",
    idNo: "",
    idType: "",
  });

  const [state, setState] = useState(null);
  const [lga, setLga] = useState(null);

  const [image, setImage] = useState(null);
  const [fileDataUrl, setFileDataUrl] = useState(null);
  const imageMimeType = /image\/(png|jpg|jpeg)/i;

  useEffect(() => {
    let fileReader,
      isCancel = false;

    if (image) {
      fileReader = new FileReader();

      fileReader.onload = (e) => {
        const { result } = e.target;

        if (result && !isCancel) {
          setFileDataUrl(result);
        }
      };

      fileReader.readAsDataURL(image);
    }
  }, [image]);

  const resetForm = () => {
    setFormFields({
      firstName: "",
      lastName: "",
      email: "",
      tel: "",
      idNo: "",
      idType: "",
    });

    setState(null);
    setLga([]);
    setImage(null);
    setFileDataUrl(null);
    setIsLoading(false);
    ref.current.value = "";
    navigate("/add");
  };

  const handleStateChange = (selectedValue) => {
    setState([selectedValue]);
    setLga(null);
  };

  const handleLgaChange = (selectedValue) => {
    setLga(selectedValue.map((item) => item.value));
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

    setImage(file);
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
      !fileDataUrl ||
      !state ||
      !lga
    ) {
      toast.error("Error in form fields, please input all fields");

      return;
    }

    const newUser = {
      firstName,
      lastName,
      email,
      phoneNumber: tel,
      identityType: idType,
      identity: idNo,
      state: state,
      LGA: lga,
      identityImage: fileDataUrl,
    };

    let bodyFormData = new FormData();

    bodyFormData.append("first_name", newUser.firstName);
    bodyFormData.append("last_name", newUser.lastName);
    bodyFormData.append("email", newUser.email);
    bodyFormData.append("phone_number", newUser.phoneNumber);
    bodyFormData.append("identityType", newUser.identityType);
    bodyFormData.append("identity_number", newUser.identity);
    bodyFormData.append("states", newUser.state);
    bodyFormData.append("identity_image_url", newUser.identityImage);
    bodyFormData.append("role", "Enumerator");

    newUser.LGA?.map((item) => bodyFormData.append("districts", `${item}`));

    await mutate(bodyFormData);
  };

  return (
    <div className="lg:w-4/5 mx-auto py-6 text-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center text-xs gap-6 bg-white p-2 rounded">
          <p>Total Enumerators</p>
          <p className="p-2 bg-gray-100 rounded">
            {enumCount?.totalEnumerators}
          </p>
        </div>

        {/* recently added */}
        <div className="flex items-center text-xs gap-6 bg-white p-2 rounded">
          <p>Recently added</p>
          <p className="p-2 bg-gray-100 rounded">{enumCount?.newlyAdded}</p>
        </div>
      </div>

      <div className="mt-6 mb-4 ">
        <p className="text-base font-bold">Create new Enumerator profile</p>
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

        <FormInput
          placeholder="Email"
          type="email"
          label="Email address"
          value={formFields.email}
          onChange={(e) =>
            setFormFields((prev) => ({ ...prev, email: e.target.value }))
          }
        />

        <FormInputNumber
          placeholder="090 26******"
          label="Contact number"
          value={formFields.tel}
          onChange={(e) =>
            setFormFields((prev) => ({ ...prev, tel: e.target.value }))
          }
        />

        <FormInputDropDown
          label="State"
          data={teamLeadStates}
          index="z-30"
          onChange={handleStateChange}
        />

        <FormMultipleSelect
          label="Districts"
          onChange={handleLgaChange}
          data={teamLeadLgas}
          index="z-20"
        />

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
          value={formFields.idNo}
          onChange={(e) =>
            setFormFields((prev) => ({ ...prev, idNo: e.target.value }))
          }
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
          {fileDataUrl && (
            <img
              src={fileDataUrl}
              alt="file data url"
              className="h-full w-full bg-black"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full mt-4 grid place-items-center text-white p-3 rounded bg-oaksgreen"
        >
          {mutateLoading ? <RingsCircle /> : `Submit`}
        </button>
      </form>
    </div>
  );
};

export default AddEnumerator;
